// Black Meridian roadmap integrity check. No external dependencies.
// Structural checks cannot establish feature acceptance: tests and human review remain mandatory.
import fs from 'node:fs';
const read = p => fs.readFileSync(new URL('../' + p, import.meta.url), 'utf8');
const config = JSON.parse(read('site-progress.json'));
const roadmap = read('DEVELOPMENT-ROADMAP.md');
const coverage = read('ROADMAP-COVERAGE.md');
const audit = read('audit.md');
const index = read('index.html');
const failures = [];
const check = (ok,msg) => { if(!ok) failures.push(msg); };
check(config.schemaVersion === 1, 'unsupported manifest schema');
check(config.roadmap?.document === 'DEVELOPMENT-ROADMAP.md', 'roadmap link');
check(/^# BLACK MERIDIAN — DEVELOPMENT ROADMAP/m.test(roadmap), 'missing governing roadmap');
check(index.includes('site-progress.js'), 'published revision widget absent');
const ids = new Set();
let total = 0, done = 0;
const gates = config.roadmap?.gates || [];
for (const gate of gates) {
  check(typeof gate.id === 'string' && /^[a-z0-9-]{2,64}$/.test(gate.id), 'invalid gate id');
  check(!ids.has(gate.id), 'duplicate gate: ' + gate.id); ids.add(gate.id);
  check(['accepted','planned','partial'].includes(gate.status), 'invalid gate status: ' + gate.id);
  check(Number.isInteger(gate.weight) && gate.weight > 0, 'invalid gate weight: ' + gate.id);
  check(roadmap.includes('|' + ' `' + gate.id + '` |'), 'gate not listed in roadmap table: ' + gate.id);
  check(roadmap.includes('### ' + gate.id + ' —'), 'gate missing acceptance section: ' + gate.id);
  check(typeof gate.evidence === 'string' && gate.evidence.trim(), 'missing evidence field: ' + gate.id);
  if (gate.status === 'accepted') {
    check(!/pending/i.test(gate.evidence), 'unverified accepted gate: ' + gate.id);
    done += gate.weight;
  }
  total += gate.weight;
}
check(gates.length === 23, 'review roadmap revision if gate count changes');
check(total === 100, 'roadmap weights must sum to 100 (got '+ total +')');
check(roadmap.includes('Current independently accepted = '+done+'/100'), 'roadmap accepted summary drift');
check(coverage.includes('Whole-product accepted: '+done+' of 100'), 'coverage summary drift');
check(Number.isInteger(config.progress.completed) && Number.isInteger(config.progress.total) && config.progress.total > 0 && config.progress.completed <= config.progress.total, 'invalid phase indicator');
const match = audit.match(/\*\*Version:\*\*\s*([0-9.]+)/);
check(match !== null, 'audit has no game revision');
check(config.revision === 'v'+(match?.[1] || ''), 'game revision/manifest drift');
check(config.roadmap.version?.startsWith('R'), 'roadmap version missing');
if (failures.length) { console.error('Roadmap integrity failed:\n'+failures.map(x=>' - '+x).join('\n')); process.exit(1); }
console.log('Roadmap integrity PASS | '+gates.length+' gates | '+done+'/'+total+' accepted | '+config.progress.completed+'/'+config.progress.total+' CoC phase | '+config.revision+' | '+config.roadmap.version);
