/* Patient-input-driven research forecast, separate from the frozen NKPI score. */
(function(root){'use strict';
const S=typeof module!=='undefined'&&module.exports?require('./schema.js'):root.NKPI,E=S.esc;
const fmt=(v,d=1)=>Number.isFinite(v)?v.toFixed(d):'—';
const sign=v=>(v>0?'+':v<0?'−':'')+Math.abs(v).toFixed(1);
const name=k=>S.features.find(f=>f.key===k)?.label||'Age';
function summarize(current,result,dirty=false,config=null){
 const out={eye:current.eye,status:'unavailable',title:'Awaiting baseline values',reason:'Import or enter a single visit, verify the values, then calculate.',demo:current.demo===true};
 if(!current.enabled)return {...out,title:'Eye not included',reason:'Enable this eye to assess its baseline inputs.'};
 if(dirty)return {...out,title:'Source changed',reason:'Reimport confirmed values before reviewing the baseline forecast.'};
 if(!result)return out;
 try{
  if(result.eye!==current.eye||S.stable(S.canonical(current))!==S.stable(result.case))throw new Error('Recalculate after changing measurements.');
  if(!config)throw new Error('Reconnect the calculator and calculate again.');
  S.verifyBaseline(result,config);
  return {...out,...result.baseline_outlook,title:result.case.mode==='longitudinal'?'Two-visit mode':result.status==='held'?'Inputs need review':'NKPI score outlook',forecast_config:config.forecast,demo:result.case.demo===true};
 }catch(error){return {...out,title:'Recalculation needed',reason:error.message};}
}
function sensitivity(p,disclosureKey='',opened=false){
 const heading='<header class="bl-eye-heading"><h3>'+E(p.eye==='OD'?'OD · Right eye':'OS · Left eye')+'</h3><span class="bl-pill">'+(p.demo?'SYNTHETIC INPUTS':'SINGLE VISIT')+'</span></header>';
 if(p.status!=='ready')return '<article class="bl-eye bl-empty" data-baseline-eye="'+E(p.eye)+'">'+heading+'<h3>'+E(p.title)+'</h3><p>'+E(p.reason)+'</p></article>';
 const lead=p.rows[0],band=v=>Number(v.toFixed(0))<33?'Lower':Number(v.toFixed(0))<67?'Intermediate':'Higher',changesBand=band(p.score_low)!==band(p.score_high);
 const rows=p.rows.map(r=>{const f=S.features.find(x=>x.key===r.key);return '<tr><th>'+E(f.label)+'</th><td>'+fmt(r.value,f.decimals)+'</td><td>±'+fmt(r.reference_pair_limit,3)+(f.unit?' '+E(f.unit):'')+'</td><td>'+fmt(r.score_low)+'–'+fmt(r.score_high)+'</td></tr>';}).join('');
 return '<div class="bl-sensitivity-body">'+
 '<div class="bl-kicker">Current baseline NKPI</div><div class="bl-current">'+fmt(p.current_nkpi,0)+'<span>/ 100</span></div><p class="bl-score-caption">CXL-associated research index</p>'+
 '<div class="bl-sensitivity"><div class="bl-kicker">If the scan inputs vary</div><div class="bl-range"><strong>'+fmt(p.score_low)+'–'+fmt(p.score_high)+'</strong><span>NKPI points</span></div><div class="bl-track" role="img" aria-label="Current NKPI '+fmt(p.current_nkpi)+'; hypothetical stress-test envelope '+fmt(p.score_low)+' to '+fmt(p.score_high)+'"><span class="bl-track-span" style="left:'+p.score_low+'%;width:'+(p.score_high-p.score_low)+'%"></span><span class="bl-track-dot" style="left:'+Math.min(99,Math.max(1,p.current_nkpi))+'%"></span></div><div class="bl-axis"><span>0</span><span>100</span></div><p><b>'+ (changesBand?'Descriptive score band can change':'Same descriptive band in this test')+'</b><br>Hypothetical input variation · not a confidence interval.</p></div>'+
 '<div class="bl-priority"><span>Largest input sensitivity</span><strong>'+E(name(lead.key))+'</strong><small>Up to '+fmt(lead.maximum_shift)+' NKPI points when varied alone.</small></div>'+
 '<div class="bl-contributors"><h4>Top contributors to this NKPI</h4>'+p.top_contributors.map(e=>'<div><span>'+E(name(e.key))+'</span><b>'+sign(e.effect)+' pts</b></div>').join('')+'<p class="micro">Compared with the training median, one input at a time. These effects do not add up.</p></div>'+
 '<details class="bl-details"'+(disclosureKey?' data-disclosure="'+E(disclosureKey)+'"':'')+(opened?' open':'')+'><summary>Inspect scan sensitivity</summary><div class="table-wrap"><table><thead><tr><th>Input</th><th>Entered</th><th>Tested change</th><th>NKPI range</th></tr></thead><tbody>'+rows+'</tbody></table></div><p>The large range combines all six input extremes in the score-lowering and score-raising directions. The rows vary only one input. Age stays fixed at '+fmt(p.age_fixed)+' years.</p><p>Published same-day pair-repeatability limits set the test sizes. Correlated measurements are varied independently as a stress test; those combinations are not a predicted future cornea. Source errors, model uncertainty and actual scan quality are not quantified.</p><p>'+(p.within_training_ranges?'All seven inputs are within individual development ranges; this does not establish model reliability.':'Outside individual development ranges: '+E(p.outside_training_ranges.join(', '))+'.')+'</p><p>Scan quality: '+(p.scan_quality==='ok'?'recorded as acceptable':p.scan_quality==='warning'?'quality/alignment flagged':'unconfirmed')+' · Treatment history: '+(p.treatment==='untreated'?'recorded as untreated':'unconfirmed')+'.'+(p.clipped?' Perturbations were clipped at calculator input bounds.':'')+'</p><p>References: <a href="https://doi.org/10.1038/s41598-020-76020-6" target="_blank" rel="noopener noreferrer">Neuhann 2020</a> and <a href="https://doi.org/10.1371/journal.pone.0228992" target="_blank" rel="noopener noreferrer">Gustafsson 2020</a>. This supplement does not change NKPI.</p></details>'+
 '</div>';
}

function render(p,disclosureKey='',opened=false){
 const heading='<header class="bl-eye-heading"><h3>'+E(p.eye==='OD'?'OD · Right eye':'OS · Left eye')+'</h3><span class="bl-pill">'+(p.demo?'SYNTHETIC INPUTS':p.title==='Two-visit mode'?'TWO VISITS':'SINGLE VISIT')+'</span></header>';
 if(p.status!=='ready')return '<article class="bl-eye bl-empty" data-baseline-eye="'+E(p.eye)+'">'+heading+'<h3>'+E(p.title)+'</h3><p>'+E(p.reason)+'</p></article>';
 const t=p.forecast.trajectory,at12=t.points[4],ageChange=at12.age_only_nkpi-t.current_nkpi,measurementChange=at12.nkpi-at12.age_only_nkpi;
 return '<article class="bl-eye bl-score-audit" data-baseline-eye="'+E(p.eye)+'">'+heading+
 '<h4>What moves the projected score?</h4><div class="bl-score-decomposition"><div><span>Age term alone</span><b>'+sign(ageChange)+' pts</b></div><div><span>Estimated measurement contribution</span><b>'+sign(measurementChange)+' pts</b></div><div class="bl-total"><span>Combined change at 12 months</span><b>'+sign(t.change_at_12_months)+' pts</b></div></div>'+
 '<p class="micro">Age is advanced by one year. The measurement contribution is the difference between the full projection and rescoring unchanged measurements at that older age. This arithmetic breakdown does not establish the cause of disease change.</p>'+
 '<details class="bl-details bl-nkpi-secondary"'+(disclosureKey?' data-disclosure="'+E(disclosureKey)+'"':'')+(opened?' open':'')+'><summary>Current NKPI &amp; input sensitivity</summary>'+sensitivity(p)+'</details></article>';
}

function trajectoryChart(ready,view){
 const change=view==='change',colors={OD:'#6d3da6',OS:'#117d85'};
 const extent=change?Math.max(1,Math.ceil(Math.max(...ready.flatMap(p=>p.forecast.trajectory.points.map(v=>Math.abs(v.nkpi-p.forecast.trajectory.current_nkpi))))*2)/2):100;
 const lo=change?-extent:0,hi=extent,value=(p,v)=>change?v.nkpi-p.forecast.trajectory.current_nkpi:v.nkpi;
 const y=v=>280-(v-lo)/(hi-lo)*260,x=m=>20+m/12*960;
 const ticks=Array.from({length:5},(_,i)=>hi-(hi-lo)*i/4);
 const grid=ticks.map(v=>'<line x1="20" y1="'+y(v)+'" x2="980" y2="'+y(v)+'" stroke="#e4dcec" stroke-width="1" vector-effect="non-scaling-stroke"/>').join('');
 const refs=ready.map(p=>{const v=change?0:p.forecast.trajectory.current_nkpi;return '<line class="nkpi-reference" x1="20" y1="'+y(v)+'" x2="980" y2="'+y(v)+'" stroke="'+colors[p.eye]+'" stroke-opacity=".28" stroke-dasharray="2 5" stroke-width="1.5" vector-effect="non-scaling-stroke"><title>'+E(p.eye)+' · unchanged score reference</title></line>';}).join('');
 const lines=ready.map(p=>{const t=p.forecast.trajectory,col=colors[p.eye],pts=t.points.map(v=>x(v.month).toFixed(3)+','+y(value(p,v)).toFixed(3)).join(' ');return '<polyline '+(change?'data-trajectory-change':'data-trajectory')+'="'+E(p.eye)+'" points="'+pts+'" fill="none" stroke="'+col+'" stroke-width="3" stroke-dasharray="7 5" vector-effect="non-scaling-stroke"/>'+t.points.map((v,i)=>'<circle cx="'+x(v.month)+'" cy="'+y(value(p,v))+'" r="'+(i===0||i===4?6:4)+'" fill="'+(i===0?col:'#fff')+'" stroke="'+col+'" stroke-width="2" vector-effect="non-scaling-stroke"><title>'+E(p.eye)+' · '+(i===0?'Current':'Projected month '+v.month)+' · NKPI '+fmt(v.nkpi,2)+' · change '+sign(v.nkpi-t.current_nkpi)+' points</title></circle>').join('');}).join('');
 return '<div data-trajectory-chart="'+view+'"'+(change?' hidden':'')+'><div class="nkpi-chart-label">'+(change?'Change in NKPI points · magnified, symmetric scale':'NKPI · 0–100 index, not a probability')+'</div><div class="nkpi-chart-grid"><div class="nkpi-y-axis">'+ticks.map(v=>'<span>'+fmt(v,change?2:0)+'</span>').join('')+'</div><svg class="nkpi-lines" viewBox="0 0 1000 300" preserveAspectRatio="none" role="img" aria-label="'+(change?'Projected change in NKPI points':'Projected NKPI scores')+'; exact values in the table below">'+grid+refs+lines+'</svg><div></div><div class="nkpi-x-axis">'+[0,3,6,9,12].map(v=>'<span>'+(v===0?'Now':v+' mo')+'</span>').join('')+'</div></div></div>';
}

function renderTrajectory(panels){
 const ready=panels.filter(p=>p.status==='ready'&&p.forecast?.trajectory);
 if(!ready.length)return '';
 const colors={OD:'#6d3da6',OS:'#117d85'},months=[0,3,6,9,12];
 const cards=ready.map(p=>{const t=p.forecast.trajectory,f=p.forecast;return '<div class="nkpi-path-summary" data-outlook-card="'+E(p.eye)+'" style="--path-color:'+colors[p.eye]+'"><span class="nkpi-path-eye">'+E(p.eye==='OD'?'OD · Right eye':'OS · Left eye')+'</span>'+(p.demo?'<span class="bl-pill nkpi-path-demo">SYNTHETIC INPUTS</span>':'')+'<div class="nkpi-score-pair"><div><small>Current NKPI</small><b data-current-nkpi="'+E(p.eye)+'">'+fmt(t.current_nkpi)+'</b><small>Calculated from this scan</small></div><span aria-hidden="true">→</span><div><small>At 12 months</small><b data-projected-nkpi="'+E(p.eye)+'">'+fmt(t.points[4].nkpi)+'</b><small>Experimental projection</small></div></div><div class="nkpi-change-badge" data-nkpi-change="'+E(p.eye)+'">'+sign(t.change_at_12_months)+' <span>NKPI points over 12 months</span></div>'+(p.scan_quality==='warning'?'<small class="nkpi-path-caution">Quality/alignment flagged · provisional calculation</small>':'')+(p.treatment==='unknown'?'<small class="nkpi-path-caution">Treatment history unconfirmed · assumes no treatment</small>':'')+(p.scan_quality==='unknown'?'<small class="nkpi-path-caution">Scan quality unconfirmed</small>':'')+(f.extrapolated?'<small class="nkpi-path-caution">Extrapolated beyond development ranges</small>':'')+(t.current_nkpi>=65?'<small class="nkpi-path-caution" data-sparse-support="'+E(p.eye)+'">Sparse high-score evidence: only '+f.support_band.eyes+' development eye with baseline NKPI 65+.</small>':'')+'</div>';}).join('');
 const rows=ready.map(p=>'<tr><th>'+E(p.eye)+'</th>'+p.forecast.trajectory.points.map(v=>'<td>'+fmt(v.nkpi,2)+'</td>').join('')+'</tr>').join('');
 const a=ready[0].forecast_config.trajectory;
 return '<section class="nkpi-path" aria-label="Experimental bilateral NKPI trajectory"><header><span class="eyebrow">CURRENT SCORE → 12 MONTHS</span><h3>Your NKPI score outlook</h3><p>One measured visit. A projected path for each eye, assuming no corneal treatment.</p></header><div class="nkpi-path-summaries">'+cards+'</div>'+
 '<div class="nkpi-chart-controls" role="group" aria-label="Chart view"><button type="button" data-trajectory-view="score" aria-pressed="true">NKPI score</button><button type="button" data-trajectory-view="change" aria-pressed="false">Magnify change</button></div>'+trajectoryChart(ready,'score')+trajectoryChart(ready,'change')+
 '<div class="nkpi-chart-legend">'+ready.map(p=>'<span><i style="background:'+colors[p.eye]+'"></i>'+E(p.eye)+'</span>').join('')+'<span>● Current</span><span>○ Projected</span><span>··· Unchanged-score reference</span></div>'+
 '<p class="nkpi-path-note"><b>Experimental score projection.</b> A lower projected NKPI can reflect the score’s age term or regression toward the cohort average; it does not establish corneal improvement or stability. A higher projected score does not confirm progression.</p>'+
 '<div class="nkpi-accuracy-note">Near-year internal check: '+fmt(a.near_twelve_months.trajectory.rmse_nkpi,2)+' points RMSE versus '+fmt(a.near_twelve_months.persistence.rmse_nkpi,2)+' for an unchanged score. This model has not demonstrated better accuracy near 12 months.</div>'+
 '<details class="bl-details"><summary>Exact scores, evidence &amp; calculation</summary><div class="table-wrap"><table><thead><tr><th>Eye</th>'+months.map(v=>'<th>'+(v===0?'Current':v+' months')+'</th>').join('')+'</tr></thead><tbody>'+rows+'</tbody></table></div><p>The line starts at the actual single-visit NKPI. A ridge model fitted to 232 paired eyes / 130 patients uses baseline NKPI and age to estimate measurement-driven change on the logit scale. The frozen NKPI age term is added as age advances. Points at 3, 6 and 9 months are model interpolation, not additional observed scans.</p><p>Both visits were scored with the same baseline NKPI formula. A two-visit NKPI uses a different model and is not joined to this line. Assumption: constant average drift, comparable scans, and no corneal treatment. This model does not estimate the effect of planned CXL.</p><p>Primary limitation: the trajectory’s internal assessment reused a frozen NKPI formula developed on overlapping records. Five patient-grouped folds, three repeats, and inner tuning were used for the trajectory fit; this is conditional internal assessment, not independent clinical validation.</p><p>Variable-interval RMSE '+fmt(a.validation.trajectory.rmse_nkpi,2)+' points versus '+fmt(a.validation.persistence.rmse_nkpi,2)+' for unchanged scores. In the 45 eyes / 25 patients followed for 9–15 months, RMSE was '+fmt(a.near_twelve_months.trajectory.rmse_nkpi,2)+' versus '+fmt(a.near_twelve_months.persistence.rmse_nkpi,2)+', and mean absolute error was '+fmt(a.near_twelve_months.trajectory.mae_nkpi,2)+' versus '+fmt(a.near_twelve_months.persistence.mae_nkpi,2)+'. These average errors are not an individual confidence interval.</p><p>Clinic observations of high NKPI in eyes already judged to be progressing and scheduled for CXL support investigating current CXL-associated patterns. They are not observed 12-month outcomes and have not been used to force these lines upward.</p></details></section>';
}

if(root.document)root.document.addEventListener('click',event=>{
 const button=event.target.closest?.('[data-trajectory-view]');if(!button)return;
 const chart=button.closest('.nkpi-path'),view=button.dataset.trajectoryView;
 chart.querySelectorAll('[data-trajectory-chart]').forEach(el=>{el.hidden=el.dataset.trajectoryChart!==view;});
 chart.querySelectorAll('[data-trajectory-view]').forEach(el=>el.setAttribute('aria-pressed',String(el.dataset.trajectoryView===view)));
});

const api={summarize,render,renderTrajectory};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.NKPIBaseline=api;
})(typeof window!=='undefined'?window:globalThis);
