const fs=require("fs");
const src=fs.readFileSync("script.js","utf8");
const checks=[
 ["save key V16",src.includes('upaon-acu-v16')],
 ["legacy V15 migration",src.includes('upaon-acu-v15')],
 ["max 5 AP",src.includes('clamp(num(S.actionsLeft,5),0,5)')],
 ["project resource validation",src.includes('ship:[["wood",14')&&src.includes('computer:[["machines",2')],
 ["project tech validation",src.includes('if(a.techReq&& !a.techReq.every(techHas))')],
 ["peace treaty recorded",src.includes('S.treaties.peace.push(id)')],
 ["save version V16",src.includes('version:"16.0"')]
];
let bad=checks.filter(x=>!x[1]);
for(const [name,ok] of checks) console.log(`${ok?'PASS':'FAIL'} ${name}`);
if(bad.length)process.exit(1);
