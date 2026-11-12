"""Reuse the pinned local axe-core engine and existing Python Playwright/Edge.

No remote scanner/API, downloaded browser, disabled rules or app bundle injection.
This detects automated WCAG violations, not complete accessibility conformance.
"""
import argparse
import json
from pathlib import Path
from urllib.parse import urljoin
from playwright.sync_api import sync_playwright

parser = argparse.ArgumentParser()
parser.add_argument('base', nargs='?', default='http://127.0.0.1:3113/')
args = parser.parse_args()
root = Path(__file__).resolve().parents[1]
engine = root / 'node_modules/axe-core/axe.min.js'
assert engine.is_file(), 'Install the pinned dev dependencies first'
base = args.base.rstrip('/') + '/'
results = []

with sync_playwright() as p:
    browser = p.chromium.launch(channel='msedge', headless=True)
    page = browser.new_page(viewport={'width': 1280, 'height': 900})
    page.route('**/pagead2.googlesyndication.com/**', lambda route: route.abort())

    def scan(label, context=None):
        if not page.evaluate('typeof window.axe !== "undefined"'):
            page.add_script_tag(path=str(engine))
        result = page.evaluate('''async context => {
            const result = await axe.run(context || document, {
                runOnly: {type:'tag', values:['wcag2a','wcag2aa','wcag21a','wcag21aa','wcag22aa']},
                resultTypes: ['violations','incomplete']
            });
            const summarize = rows => rows.map(row => ({id:row.id, impact:row.impact,
                help:row.help, helpUrl:row.helpUrl,
                nodes:row.nodes.map(node => ({target:node.target, summary:node.failureSummary}))}));
            return {version:result.testEngine.version, violations:summarize(result.violations),
                incomplete:summarize(result.incomplete)};
        }''', context)
        results.append({'case': label, **result})
        print(f"{label}: {len(result['violations'])} violations, {len(result['incomplete'])} manual-review rules", flush=True)

    page.goto(base, wait_until='networkidle')
    page.locator('.language select').select_option('en')
    scan('home/en/desktop')
    identifiers = page.locator('.indicator-picker select option').evaluate_all('(els)=>els.map(e=>e.value)')
    for identifier in identifiers:
        page.locator('.indicator-picker select').select_option(identifier)
        scan('indicator/en/' + identifier, '#verified-indicators')
    page.set_viewport_size({'width': 320, 'height': 900})
    page.locator('.language select').select_option('ko')
    scan('home/ko/mobile')
    page.set_viewport_size({'width': 1280, 'height': 900})
    for path in ['about/', 'methodology/', 'privacy/', 'terms/', 'embed/']:
        page.goto(urljoin(base, path), wait_until='networkidle')
        scan(path)
    browser.close()

report = {'base': base, 'engine': 'axe-core', 'cases': len(results), 'results': results,
    'note': 'Incomplete results require manual review. No claim of full WCAG conformance.'}
output = root / '.npm-cache' / ('accessibility-preview.json' if '/preview/' in base else 'accessibility-production.json')
output.write_text(json.dumps(report, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
violations = sum(len(case['violations']) for case in results)
print(json.dumps({'accessibility': 'PASS' if violations == 0 else 'FAIL',
    'cases': len(results), 'violations': violations, 'manualReviewRules': sum(len(case['incomplete']) for case in results),
    'report': str(output)}))
raise SystemExit(bool(violations))
