"""Normalize explicit public R-ONE CSV downloads; never use keyless API samples."""
import csv
import hashlib
import json
import re
from datetime import datetime, timezone
from pathlib import Path
from urllib.request import urlopen

records = []
evidence = json.loads(Path("docs/data-sources/r-one-verification-2026-11-12.json").read_text(encoding="utf-8"))
for identifier, code, catalog_id in [
    ("apartment_price_index", "A_2024_00045", "15069821"),
    ("apartment_jeonse_price_index", "A_2024_00050", "15044018"),
]:
    path = Path("data") / f"reb-{code}.csv"
    raw = path.read_bytes()
    rows = list(csv.reader(raw.decode("cp949").splitlines()))
    months = []
    for cell in rows[0][5:]:
        match = re.fullmatch(r"(\d{4})년 (\d{1,2})월", cell)
        assert match, cell
        months.append(f"{match[1]}-{int(match[2]):02}")
    national = [row for row in rows[2:] if row[1:5] == ["전국"] * 4]
    assert len(national) == 1
    assert len(national[0][5:]) == len(months) == 10
    series = [[period, float(value)] for period, value in zip(months, national[0][5:])]
    assert [period for period, value in series] == ["2025-12"] + [f"2026-{month:02}" for month in range(1, 10)]
    assert dict(series)["2026-06"] == 100.0
    catalog_url = f"https://www.data.go.kr/catalog/{catalog_id}/fileData.json"
    with urlopen(catalog_url, timeout=20) as response:
        catalog = json.loads(response.read().decode("utf-8"))
    assert catalog["license"]["name"] == "이용허락범위 제한 없음"
    definition = next(item for item in evidence["definitions"] if item["id"] == code)
    assert definition["table"][0]["RPSTUI_NM"] == "기준시점 : 2026.06.=100.0"
    records.append({
        "id": identifier, "code": code, "category": "real-estate-housing", "unit": "index (2026.06=100)",
        "cadence": "monthly", "country_id": "kr", "region_id": "kr", "quality_status": "VERIFIED",
        "license": catalog["license"]["name"], "license_url": catalog["license"]["url"],
        "license_evidence_url": catalog_url, "license_evidence": catalog,
        "source_org": "Korea Real Estate Board", "original_source": "Korea Real Estate Board, National Housing Price Survey (monthly, non-seasonally adjusted)",
        "source_url": f"https://www.reb.or.kr/r-one/portal/stat/easyStatPage/{code}.do",
        "dataset_name": definition["table"][0]["STATBL_NM"],
        "definition": "National apartment price survey index; June 2026=100. Public CSV selected-window snapshot, not the transaction-price index or full historical series.",
        "publication_date": None, "source_last_updated": None,
        "ingested_at": datetime.now(timezone.utc).isoformat(), "version": f"reb-{code}-2026-09-base202606",
        "raw_file": path.as_posix(), "raw_sha256": hashlib.sha256(raw).hexdigest(),
        "csv_header": rows[0], "csv_national_row": national[0], "source_region_count": len(rows) - 2,
        "coverage_note": "2025-12 to 2026-09, 10 selected monthly observations; national only. No sample API data or interpolated periods.",
        "series": series,
    })
Path("data/verified-reb.json").write_text(json.dumps({"schema_version": 1, "records": records}, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
print(json.dumps([{"id": r["id"], "periods": len(r["series"]), "latest": r["series"][-1]} for r in records]))
