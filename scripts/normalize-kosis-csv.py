"""Preserve published final national rates; never calculate or publish provisional ones."""
import csv
import hashlib
import json
import re
from datetime import datetime, timezone
from pathlib import Path
from urllib.request import urlopen

path = Path("data/kosis-DT_1BD1101.csv")
raw = path.read_bytes()
rows = list(csv.reader(raw.decode("cp949").splitlines()))
assert len(rows) == 21
national = [row for row in rows[2:] if row[0] == "전체"]
assert len(national) == 1
metadata = json.loads(Path("docs/data-sources/kosis-DT_1BD1101-metadata.json").read_text(encoding="utf-8"))
assert metadata["tblId"] == "DT_1BD1101"
policy_url = "https://stat.kosis.kr/nsistN/kosisUseGuide.do"
with urlopen(policy_url, timeout=20) as response:
    policy = response.read()
assert "상업적" in policy.decode("utf-8") and "국내통계" in policy.decode("utf-8")
records = []
for identifier, code, label in [("business_birth_rate", "T04", "신생률"), ("business_death_rate", "T05", "소멸률")]:
    assert any(item["id"] == code and item["name"] == label for item in metadata["items"])
    indices = [i for i in range(1, len(rows[0])) if re.fullmatch(r"\d{4}", rows[0][i]) and rows[1][i] == label]
    series = [[rows[0][i], float(national[0][i])] for i in indices]
    assert [year for year, value in series] == [str(year) for year in range(2016, 2025)]
    assert all(0 <= value <= 100 for year, value in series)
    records.append({
        "id": identifier, "code": f"DT_1BD1101/{code}/A=0", "category": "business-startup", "unit": "percent",
        "cadence": "annual", "country_id": "kr", "region_id": "kr", "quality_status": "VERIFIED",
        "license": "KOSIS domestic statistics reuse guidance (attribution required)", "license_url": policy_url,
        "license_evidence_url": policy_url, "license_evidence_sha256": hashlib.sha256(policy).hexdigest(),
        "source_org": "Ministry of Data and Statistics (KOSIS)",
        "original_source": "국가데이터처, 기업생멸행정통계, 제11차 한국표준산업분류, 산업 전체",
        "source_url": "https://kosis.kr/statHtml/statHtml.do?orgId=101&tblId=DT_1BD1101&conn_path=I2",
        "dataset_name": metadata["tblNm"] + " · " + label,
        "definition": "Published national enterprise rate (all industries, KSIC 11th revision), not a rate inferred from a different vintage or classification.",
        "publication_date": None, "source_last_updated": metadata["renewalDate"],
        "ingested_at": datetime.now(timezone.utc).isoformat(), "version": f"kosis-DT_1BD1101-{code}-{metadata['renewalDate']}-KSIC11",
        "raw_file": path.as_posix(), "raw_sha256": hashlib.sha256(raw).hexdigest(), "item_label": label,
        "csv_header": rows[:2], "csv_national_row": national[0], "column_indices": indices,
        "excluded_provisional_periods": ["2025"],
        "coverage_note": "2016–2024 final annual published rates. 2025 p) provisional values are excluded; no missing death-rate observation is invented.",
        "series": series,
    })
Path("data/verified-kosis.json").write_text(json.dumps({"schema_version": 1, "records": records}, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
print(json.dumps([{"id": r["id"], "periods": len(r["series"]), "latest": r["series"][-1]} for r in records]))
