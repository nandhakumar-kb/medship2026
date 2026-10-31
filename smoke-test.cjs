const fs = require('fs');
const vm = require('vm');
const appNode = { innerHTML: '' };
const listeners = {};
const store = new Map();
const fakeDocument = {
  querySelector(selector) { return selector === '#app' ? appNode : null; },
  addEventListener(type, fn) { listeners[type] = fn; },
};
class FakeFormData {
  constructor(form) { this.form = form; }
  get(key) { return this.form.values?.[key] ?? null; }
  [Symbol.iterator]() { return Object.entries(this.form.values || {})[Symbol.iterator](); }
}
const context = {
  document: fakeDocument,
  localStorage: { getItem: k => store.get(k) ?? null, setItem: (k,v) => store.set(k,v) },
  FormData: FakeFormData,
  console,
  Date,
  Math,
  Number,
  String,
  Set,
  Object,
  Array,
  confirm: () => true,
  window: { open: () => null },
  URL,
  Blob,
};
vm.createContext(context);
const html = fs.readFileSync(require('path').join(__dirname, 'index.html'), 'utf8');
const js = html.match(/<script>([\s\S]*?)<\/script>\s*<\/body>/)[1];
vm.runInContext(js, context);
const click = dataset => listeners.click({ target: { closest: () => ({ dataset }) } });
const submit = (id, values, submitterValue) => listeners.submit({ preventDefault(){}, target:{ id, values }, submitter: submitterValue ? { value: submitterValue } : null });
function assert(cond,msg){if(!cond)throw new Error(msg);}
assert(appNode.innerHTML.includes('Smart pharmaceutical dispatch'),'dashboard failed to render');
assert((appNode.innerHTML.match(/class="metric"/g)||[]).length===4,'dashboard KPI cards missing');
click({page:'Batch inventory'});
assert(appNode.innerHTML.includes('Batch inventory'),'inventory navigation failed');
click({action:'new-batch'});
assert(appNode.innerHTML.includes('Register finished batch'),'batch form did not open');
submit('batch-form',{id:'TEST-901',product:'Normal Saline 500ml',expiryDate:'2027-12-31',quantity:'125',location:'Z-01',sku:'NS500'});
let saved=JSON.parse(store.get('medship-working-v1'));
assert(saved.batches.some(b=>b.id==='TEST-901'&&b.qualityStatus==='UNDER_QC'),'batch registration failed');
click({action:'qa',id:'TEST-901'});
submit('qa-form',{note:'Release approved after document review.'},'release');
saved=JSON.parse(store.get('medship-working-v1'));
assert(saved.batches.find(b=>b.id==='TEST-901').qualityStatus==='RELEASED','QA release failed');
click({page:'FEFO allocation'});
submit('alloc-form',{orderId:'',hospitalId:'H-01',product:'Ringer Lactate IV',quantity:'500'});
assert(appNode.innerHTML.includes('RL-202'),'FEFO did not select the eligible later batch');
assert(appNode.innerHTML.includes('RL-201'),'FEFO exclusion did not show the short-shelf-life batch');
click({action:'confirm-dispatch'});
saved=JSON.parse(store.get('medship-working-v1'));
assert(saved.dispatches.length===1,'dispatch not recorded');
assert(saved.batches.find(b=>b.id==='RL-202').availableQuantity===400,'stock was not deducted');
click({page:'Cold chain'});
click({action:'add-reading',id:'INS-301'});
submit('reading-form',{temperature:'11.4'});
saved=JSON.parse(store.get('medship-working-v1'));
assert(saved.batches.find(b=>b.id==='INS-301').qualityStatus==='QUARANTINED','temperature excursion did not quarantine batch');
assert(saved.batches.find(b=>b.id==='INS-301').temperatureLog.at(-1).celsius===11.4,'temperature reading not saved');
console.log('MedShip UI smoke test passed: navigation, batch registration, QA release, FEFO exclusion/pick, dispatch stock deduction, temperature logging and auto-quarantine.');
