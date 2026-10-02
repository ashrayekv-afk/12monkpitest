'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),{execFileSync}=require('node:child_process');
const root=path.resolve(__dirname,'..'),S=require('../components/schema.js'),B=require('../components/baseline_outlook.js');
const make=(eye='OD')=>({...S.blank(eye),enabled:true,age:24,verified:true,treatment:'untreated',scan_quality:{first:'ok'},first:{A:7.2,B:5.8,C:480,Kmax:52,BAD_D:4,ARTmax:230}});
const service=eyes=>JSON.parse(execFileSync('python3',['-c',"import sys,json;from nkpi.service import configuration,calculate;print(json.dumps({'config':configuration(),'result':calculate(json.load(sys.stdin),include_pdf=False)}))"],{cwd:root,input:JSON.stringify({eyes}),encoding:'utf8'}));
const data=service([make(),make('OS')]);
for(const eye of ['OD','OS']){
 const c=make(eye),r=data.result.eyes[eye];assert(S.verify(c,r,data.config));
 const p=B.summarize(c,r,false,data.config.baseline_outlook),h=B.render(p);
 assert.equal(p.status,'ready');assert(h.includes('Largest input sensitivity'));assert(h.includes('What moves the projected score?'));assert(!h.includes('data-forecast='));assert.equal(p.forecast.status,'experimental_ready');assert(p.forecast.probability>0&&p.forecast.probability<1);
 assert(!h.includes('Patient forecast not released'));assert(!h.includes('clinical progression probability'));
 assert.equal(B.summarize({...c,first:{...c.first,C:479}},r,false,data.config.baseline_outlook).status,'unavailable');
 assert.equal(B.summarize(c,r,true,data.config.baseline_outlook).status,'unavailable');
 for(const edit of [p=>p.eye='OS'===eye?'OD':'OS',p=>p.input_sha256='x',p=>p.version='old',p=>p.current_nkpi+=1,p=>p.score_low-=1,p=>p.score_high+=1,p=>p.forecast.probability=.62,p=>p.forecast.horizon_months=6,p=>p.rows[0].value+=1,p=>p.rows[0].reference_pair_limit*=2,p=>p.rows[0].maximum_shift+=1,p=>p.rows.pop(),p=>p.top_contributors[0].effect+=1,p=>p.scan_quality='unknown',p=>p.age_fixed+=1,p=>p.largest_sensitivity='C',p=>p.within_training_ranges=false]){
  const bad=structuredClone(r);edit(bad.baseline_outlook);assert.throws(()=>S.verify(c,bad,data.config));assert.equal(B.summarize(c,bad,false,data.config.baseline_outlook).status,'unavailable');
 }
}
// The forecast itself is bound to the same eye and independently recomputed.
for(const edit of [f=>f.probability+=.01,f=>f.model_sha256='x',f=>f.input_sha256='x',f=>f.eye='OS',f=>f.version='old',f=>f.horizon_months=6,f=>f.clinical_release=true,f=>f.population_risk_calibration=true,f=>f.feature_values.log_interval_years=1,f=>f.feature_values.baseline_C+=1,f=>f.effects[0].effect_pp+=1,f=>f.effects.pop(),f=>f.extrapolated=true,f=>f.outside_training_ranges=['baseline_C'],f=>f.assumption_treatment='unknown',f=>f.support_band.eyes=1000,f=>f.feature_values.baseline_NKPI_logit+=1]){
 const r=structuredClone(data.result.eyes.OD);edit(r.baseline_outlook.forecast);assert.throws(()=>S.verify(make(),r,data.config));
}
const changed=make();changed.first.C=450;const altered=service([changed]);assert(S.verify(changed,altered.result.eyes.OD,altered.config));assert.notEqual(altered.result.eyes.OD.baseline_outlook.forecast.probability,data.result.eyes.OD.baseline_outlook.forecast.probability);
const held=make();held.verified=false;const hr=service([held]);assert(S.verify(held,hr.result.eyes.OD,hr.config));assert.equal(B.summarize(held,hr.result.eyes.OD,false,hr.config.baseline_outlook).status,'unavailable');
const c=make();c.mode='longitudinal';c.latest={...c.first};c.interval_days=180;const pair=service([c]);assert(S.verify(c,pair.result.eyes.OD,pair.config));assert(B.render(B.summarize(c,pair.result.eyes.OD,false,pair.config.baseline_outlook)).includes('Two-visit mode'));
const html=fs.readFileSync(path.join(root,'components/index.html'),'utf8');assert(!/<details[^>]*id="baseline-drawer"[^>]*\bopen\b/.test(html));assert(html.indexOf('id="baseline-drawer"')>html.indexOf('id="results-area"'));assert(html.indexOf('id="baseline-drawer"')<html.indexOf('id="progression-drawer"'));assert(!html.includes('id="baseline-preview"'));assert(!JSON.stringify(data.result).includes('fictional'));
console.log('PASS baseline contract: both eyes, independent score arithmetic, tampering, held cases, longitudinal separation, stale source rejection and live trained forecast.');

const panels=['OD','OS'].map(eye=>B.summarize(make(eye),data.result.eyes[eye],false,data.config.baseline_outlook));
const chart=B.renderTrajectory(panels);assert(chart.includes('data-trajectory="OD"'));assert(chart.includes('data-trajectory="OS"'));assert(chart.includes('NKPI · 0–100 index, not a probability'));assert(chart.includes('not additional observed scans'));assert.equal(B.renderTrajectory([]),'');
for(const edit of [t=>t.eye='OS',t=>t.input_sha256='x',t=>t.model_sha256='x',t=>t.score_model_sha256='x',t=>t.current_nkpi+=1,t=>t.measurement_logit_per_year+=1,t=>t.age_logit_per_year=0,t=>t.points[0].nkpi+=1,t=>t.points[1].month=6,t=>t.points[2].age+=1,t=>t.points[4].nkpi=100,t=>t.points[4].age_only_nkpi+=1,t=>t.change_at_12_months+=1,t=>t.points.pop(),t=>t.scan_quality='warning',t=>t.clinical_release=true]){
 const r=structuredClone(data.result.eyes.OD);edit(r.baseline_outlook.forecast.trajectory);assert.throws(()=>S.verify(make(),r,data.config));
}
const q=make();q.scan_quality.first='warning';const qr=service([q]);assert(S.verify(q,qr.result.eyes.OD,qr.config));assert.equal(qr.result.eyes.OD.status,'ready');assert.equal(qr.result.eyes.OD.prediction.nkpi,data.result.eyes.OD.prediction.nkpi);
assert(B.renderTrajectory([B.summarize(q,qr.result.eyes.OD,false,qr.config.baseline_outlook)]).includes('Quality/alignment flagged'));
assert.equal(data.result.eyes.OD.baseline_outlook.forecast.nkpi_input,data.result.eyes.OD.prediction.nkpi);
console.log('PASS quality advisory, independently checked trajectory points, both-eye chart, corruption rejection and NKPI-aware forecasts.');

assert(chart.includes('regression toward the cohort average'));
assert(!html.includes('id="trajectory-drawer"'));
assert(html.indexOf('id="baseline-trajectory"')<html.indexOf('id="baseline-columns"'));
assert(html.includes('NKPI score outlook · 12 months'));
const severe=make('OS');severe.age=25;severe.first={A:4.57,B:2.96,C:315,Kmax:86,BAD_D:31.92,ARTmax:27};
const sr=service([severe]),sp=B.summarize(severe,sr.result.eyes.OS,false,sr.config.baseline_outlook);assert(S.verify(severe,sr.result.eyes.OS,sr.config));
assert(B.renderTrajectory([sp]).includes('Sparse high-score evidence'));assert.equal(sp.forecast.support_band.eyes,1);
console.log('PASS NKPI logit mapping, support-band audit, sparse-score disclosure and primary score trajectory.');

// The released display shows points and the unchanged-score benchmark, not the legacy percentage.
assert(!chart.includes('data-forecast='));assert(!chart.includes('bl-forecast-value'));
assert(chart.includes('data-trajectory-view="change"'));assert(chart.includes('data-trajectory-chart="change" hidden'));
assert(chart.includes('unchanged score reference'));assert(chart.includes('has not demonstrated better accuracy'));
assert(!chart.includes('risk of progression'));assert(!chart.includes('75%'));
for(const p of panels){
 const t=p.forecast.trajectory,expected=t.points[4].nkpi.toFixed(1);
 assert(chart.includes('data-projected-nkpi="'+p.eye+'">'+expected));
 assert(chart.includes('data-current-nkpi="'+p.eye+'">'+t.current_nkpi.toFixed(1)));
 assert(chart.includes('data-nkpi-change="'+p.eye+'"'));
 const h=B.render(p);assert(h.includes('Age term alone'));assert(h.includes('Estimated measurement contribution'));
}
console.log('PASS score-first display, exact endpoints, both chart scales, no-change benchmark and no probability hero.');

assert(B.renderTrajectory(panels.map(p=>({...p,demo:true}))).includes('SYNTHETIC INPUTS'));
assert(!B.renderTrajectory(panels).includes('SYNTHETIC INPUTS'));
