from pathlib import Path
import json
root=Path(__file__).resolve().parents[1]
required=['index.html','style.css','script.js','v14.js','assets/atlas-vintage.png','assets/world-map-bg.png']
missing=[x for x in required if not (root/x).exists()]
if missing: raise SystemExit('Arquivos ausentes: '+', '.join(missing))
tech=json.loads((root/'data/v14-tech-sample.json').read_text())
print(f'V14 OK — {len(tech["ancestral"])} tecnologias ancestrais de exemplo; {len(tech["industrial"])} industriais.')
