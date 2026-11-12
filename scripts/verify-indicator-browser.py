"""Read-only UI checks plus local exports; requires Python Playwright and Edge."""
import csv
import io
import json
import re
import sys
from pathlib import Path
from urllib.parse import urlparse, parse_qs

from playwright.sync_api import sync_playwright, expect

base = sys.argv[1] if len(sys.argv) > 1 else "http://127.0.0.1:3112/"
preview = "/preview/" in base
records = sum([json.loads(Path("data/verified-" + source + ".json").read_text(encoding="utf-8"))["records"] for source in ["reb", "wdi", "kosis"]], [])
output = Path(".npm-cache")

with sync_playwright() as p:
    browser = p.chromium.launch(channel="msedge", headless=True)
    context = browser.new_context(viewport={"width": 1280, "height": 900}, accept_downloads=True)
    context.add_init_script("""Object.defineProperty(navigator, 'share', {value:undefined, configurable:true});
Object.defineProperty(navigator, 'clipboard', {value:{writeText:async text=>{window.__copied=text}}, configurable:true});""")
    page = context.new_page()
    errors = []
    failures = []
    page.on("pageerror", lambda error: errors.append(str(error)))
    page.on("response", lambda response: failures.append(response.url) if response.status >= 400 and response.url.startswith(base.split("/preview")[0]) else None)
    page.route("**/pagead2.googlesyndication.com/**", lambda route: route.abort())
    page.goto(base, wait_until="networkidle")
    expect(page.locator("#verified-indicators .indicator-picker select")).to_be_visible()
    assert page.locator('script[src*="adsbygoogle.js"]').count() == (0 if preview else 1)
    robots = page.locator('meta[name="robots"]').get_attribute("content") or ""
    assert ("noindex" in robots) == preview

    for record in records:
        identifier = record["id"]
        selected_period = str(record["series"][-2][0])
        baseline_period = str(record["series"][0][0])
        target_period = str(record["series"][-1][0])
        content_id = "indicator-" + identifier
        page.locator(".indicator-picker select").select_option(identifier)
        series = page.locator("#" + content_id)
        expect(series).to_be_visible()
        assert "VERIFIED" in series.inner_text()
        assert record["code"] in series.inner_text()
        series.locator(".period-controls select").select_option(selected_period)
        expect(series.locator(".period-controls select")).to_have_value(selected_period)
        series.locator(".export-control summary").click()
        with page.expect_download() as download:
            series.get_by_role("button", name=re.compile("CSV")).click()
        path = output / f"sprint-{identifier}.csv"
        download.value.save_as(path)
        rows = list(csv.DictReader(io.StringIO(path.read_text(encoding="utf-8-sig"))))
        assert len(rows) == len(record["series"])
        values = {str(period): value for period, value in record["series"]}
        for row in rows:
            assert float(row["value"]) == values[row["reference_period"]]
            assert row["source_id"] == record["code"]
            assert row["quality_status"] == "VERIFIED"
            assert "period=" + selected_period in row["index_world_url"]
        series.locator(".share-control button").click()
        shared = page.evaluate("window.__copied")
        url = re.findall(r"https?://[^\s]+", shared)[-1]
        query = parse_qs(urlparse(url).query)
        assert query["content"] == [content_id] and query["period"] == [selected_period]
        page.goto(base + "?" + urlparse(url).query, wait_until="networkidle")
        expect(page.locator(".indicator-picker select")).to_have_value(identifier)
        expect(page.locator("#" + content_id + " .period-controls select")).to_have_value(selected_period)
        compare = page.locator("#" + content_id + "-compare")
        compare.locator(".period-controls select").nth(0).select_option(baseline_period)
        compare.locator(".period-controls select").nth(1).select_option(target_period)
        assert "NaN" not in compare.inner_text() and "Infinity" not in compare.inner_text()
        assert "Population difference" not in compare.inner_text()
        if record["unit"] == "percent":
            assert "percentage points" in compare.inner_text() or "%p" in compare.inner_text()
        compare.locator(".export-control summary").click()
        compare.locator(".share-control button").click()
        comparison_url = re.findall(r"https?://[^\s]+", page.evaluate("window.__copied"))[-1]
        comparison_query = parse_qs(urlparse(comparison_url).query)
        assert comparison_query["baseline"] == [baseline_period] and comparison_query["target"] == [target_period]
        page.goto(base + "?" + urlparse(comparison_url).query, wait_until="networkidle")
        compare = page.locator("#" + content_id + "-compare")
        expect(compare.locator(".period-controls select").nth(0)).to_have_value(baseline_period)
        expect(compare.locator(".period-controls select").nth(1)).to_have_value(target_period)
        compare.locator(".export-control summary").click()
        assert compare.get_by_role("button", name=re.compile("Embed|임베드", re.I)).count() == 0
        if identifier == "gdp_per_capita_usd":
            with page.expect_download() as download:
                compare.locator(".export-options > button").nth(0).click()
            download.value.save_as(output / "sprint-compare.png")
        page.set_viewport_size({"width": 320, "height": 900})
        for locale in ["en", "ko", "ja", "es", "pt", "de", "fr", "zh-CN", "zh-TW", "hi", "id", "it", "vi"]:
            page.locator(".language select").select_option(locale)
            page.wait_for_function("locale => document.documentElement.lang === locale", arg=locale)
            assert page.evaluate("document.documentElement.scrollWidth <= innerWidth"), (identifier, locale, "overflow")
        page.set_viewport_size({"width": 1280, "height": 900})
        print(f"PASS: {identifier} — CSV/Share/Compare/mobile", flush=True)

    page.set_viewport_size({"width": 320, "height": 900})
    page.locator(".language select").select_option("ko")
    page.locator("#verified-indicators").screenshot(path=str(output / "sprint-mobile.png"))
    assert not errors, errors
    assert not failures, failures
    browser.close()
    print(json.dumps({"browser": "PASS", "preview": preview, "indicators": len(records), "checks": "source, exact CSV values, PNG, shared year/compare restoration, 320px x 13 locales", "pageErrors": errors, "firstPartyFailures": failures}))
