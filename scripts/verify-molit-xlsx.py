"""Verify frozen official XLSX cells; --normalize explicitly creates the reviewed JSON."""
import hashlib
import json
import re
import sys
import zipfile
import xml.etree.ElementTree as ET
from pathlib import Path
from datetime import datetime, timezone

ROOT = Path(__file__).resolve().parents[1]
NS = {'m': 'http://schemas.openxmlformats.org/spreadsheetml/2006/main'}
POLICY = 'https://stat.molit.go.kr/portal/info/protect.do'
LICENSE = 'MOLIT statistical information reuse policy (commercial reuse with attribution)'
TARGET = ROOT / 'data/verified-molit.json'
INGESTED = datetime.now(timezone.utc).isoformat() if '--normalize' in sys.argv else json.loads(TARGET.read_text(encoding='utf-8'))['records'][0]['ingested_at']
SPECS = [
 ('housing_permits', 'permits', 31, 626, '인허가', '주택 인허가 (연간 확정)', 'Housing permits (annual final)'),
 ('housing_starts', 'starts', 471, 5388, '착공', '주택 착공 (연간 확정)', 'Housing starts (annual final)'),
 ('housing_completions', 'completions', 468, 5374, '준공', '주택 준공 (연간 확정)', 'Housing completions (annual final)'),
]

def workbook(path):
    with zipfile.ZipFile(path) as archive:
        strings = [''.join(node.itertext()) for node in ET.fromstring(archive.read('xl/sharedStrings.xml')).findall('m:si', NS)]
        result = {}
        for name in archive.namelist():
            if not re.fullmatch(r'xl/worksheets/sheet\d+\.xml', name):
                continue
            cells = {}
            for cell in ET.fromstring(archive.read(name)).findall('.//m:sheetData/m:row/m:c', NS):
                value = cell.find('m:v', NS)
                text = value.text if value is not None else ''.join(cell.itertext())
                if cell.get('t') == 's' and text:
                    text = strings[int(text)]
                if text:
                    cells[cell.get('r')] = text
            result[name] = cells
        return result

def file_proof(filename):
    path = ROOT / 'data' / filename
    return {'raw_file': 'data/' + filename, 'raw_sha256': hashlib.sha256(path.read_bytes()).hexdigest()}

def base(identifier, code, ko, en, source, cadence, files, series, evidence, note_ko, note_en):
    return dict(id=identifier, code=code, title={'ko': ko, 'en': en}, category='real-estate-housing',
        unit='dwelling', cadence=cadence, country_id='kr', region_id='kr', quality_status='VERIFIED',
        source_org='Ministry of Land, Infrastructure and Transport (MOLIT)', original_source='국토교통부 통계누리, 주택정책과',
        dataset_name=ko, source_url=source, license=LICENSE, license_url=POLICY,
        publication_date=None, source_last_updated=None, ingested_at=INGESTED,
        version='molit-reviewed-2026-11-12-' + identifier, definition=note_en,
        notes={'ko': note_ko, 'en': note_en}, raw_files=files, cell_evidence=evidence, series=series)

def extract():
    records = []
    for identifier, short, rs, form, term, ko, en in SPECS:
        filename = f'molit-{short}-final-2024.xlsx'
        cells = workbook(ROOT / 'data' / filename)['xl/worksheets/sheet1.xml']
        assert term in cells['A1'] and any('단위:호' in value for value in cells.values())
        series, evidence = [], []
        for address, label in cells.items():
            match = re.fullmatch(r"[’'](\d{2})(?:년)?", label)
            if not match:
                continue
            year = 1900 + int(match[1]) if int(match[1]) >= 90 else 2000 + int(match[1])
            if not 2014 <= year <= 2024:
                continue
            col, row = re.fullmatch(r'([A-Z]+)(\d+)', address).groups()
            next_row = str(int(row) + 1)
            assert re.sub(r'\s', '', cells['A' + next_row]) == '합계'
            value_address = col + next_row
            value = int(cells[value_address])
            assert value >= 0
            series.append([str(year), value])
            evidence.append(dict(raw_file='data/' + filename, sheet='xl/worksheets/sheet1.xml',
                header_cell=address, header=label, value_cell=value_address, value=str(value), region_cell='A'+next_row, region=cells['A'+next_row]))
        series.sort()
        assert [period for period, _ in series] == [str(year) for year in range(2014, 2025)]
        source=f'https://stat.molit.go.kr/portal/cate/statMetaView.do?hRsId={rs}&hFormId={form}&hSelectId={form}&hPoint=00&sFormId={form}'
        records.append(base(identifier, f'MOLIT/{rs}/{form}', ko, en, source, 'annual', [file_proof(filename)], series, evidence,
            f'전국 주택 {term} 연간 확정치 2014~2024년입니다. 2025년 9월 30일 소급 확정 공표 범위만 사용하며, 2025년 이후와 월별 잠정치는 제외했습니다. 단위는 호입니다. 현재 월의 공급량이 아닙니다.',
            f'National annual final housing {short}, 2014–2024 only, from the explicitly revised final release of 30 September 2025. Later years and monthly provisional data excluded. Unit: dwellings, not buildings or current-month supply.'))

    # Only unambiguous literal month labels from the latest original workbook.
    filename='molit-unsold-2026-09.xlsx'
    cells=workbook(ROOT / 'data' / filename)['xl/worksheets/sheet1.xml']
    assert cells['A1'] == '□ 부문별 미분양 현황' and cells['A5'] == '계'
    series, evidence=[], []
    for address, label in cells.items():
        match=re.fullmatch(r'(24|25|26)\.(\d{1,2})', label)
        if not match or not address.endswith('3'):
            continue
        period=f'20{match[1]}-{int(match[2]):02d}'
        assert 1 <= int(match[2]) <= 12 and period <= '2026-09'
        value_address=address[:-1]+'5'
        value=int(cells[value_address]); assert value >= 0
        series.append([period,value]);evidence.append(dict(raw_file='data/'+filename,sheet='xl/worksheets/sheet1.xml',header_cell=address,header=label,value_cell=value_address,value=str(value),region_cell='A5',region='계'))
    series.sort(); assert len(series)==33 and series[0][0]=='2024-01' and series[-1][0]=='2026-09'
    source='https://stat.molit.go.kr/portal/cate/statMetaView.do?hRsId=32&hFormId=2082&hSelectId=2082&hPoint=00&sFormId=2082'
    records.append(base('unsold_housing','MOLIT/32/2082','미분양 주택 (월말 재고)','Unsold housing (month-end stock)',source,'monthly',[file_proof(filename)],series,evidence,
        '전국 민간 미분양 주택의 월말 재고(준공 전·후 포함)입니다. 2024년 1월~2026년 9월 공표값이며 매월 발생 건수나 거래량이 아닙니다. 원본은 사후 수정될 수 있습니다.',
        'Published national private-sector unsold housing, including before and after completion. Month-end stock, January 2024–September 2026; not monthly transactions or a flow. The source may revise reported figures.'))
    series,evidence,files=[],[],[]
    for month in ['07','08','09']:
        filename=f'molit-unsold-2026-{month}.xlsx'; cells=workbook(ROOT/'data'/filename)['xl/worksheets/sheet4.xml']
        assert cells['A1']=='□ 공사완료후 미분양 현황' and re.sub(r'\s','',cells['A5'])=='전국' and re.sub(r'\s','',cells['B5'])=='합계'
        value=int(cells['C5']);assert value>=0
        series.append([f'2026-{month}',value]);files.append(file_proof(filename))
        evidence.append(dict(raw_file='data/'+filename,sheet='xl/worksheets/sheet4.xml',value_cell='C5',value=str(value),region_cell='A5',region=cells['A5']))
    records.append(base('unsold_completed_housing','MOLIT/32/5328','준공 후 미분양 주택 (월말 재고)','Completed unsold housing (month-end stock)',source,'monthly',files,series,evidence,
        '전국 공사완료 후 미분양 주택의 월말 재고입니다. 정상 공개 월보 2026년 7~9월 3개월만 확보했습니다. 전체 미분양의 부분집합이며 별도로 더하지 않습니다. 원본은 사후 수정될 수 있습니다.',
        'National completed unsold housing, month-end stock. Only the three acquired public monthly reports for July–September 2026. A subset of total unsold housing; do not add the two series. Reported source values may be revised.'))
    return records

if __name__=='__main__':
    records=extract()
    target=ROOT/'data/verified-molit.json'
    if '--normalize' in sys.argv:
        target.write_text(json.dumps({'schema_version':1,'records':records},ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
    else:
        assert json.loads(target.read_text(encoding='utf-8'))['records']==records, 'Original XLSX/normalized snapshot mismatch'
    for record in records:print(f"MOLIT XLSX PASS: {record['id']}, {len(record['series'])} unchanged original values")
