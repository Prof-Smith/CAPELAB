let rows = [];
let threshold = 30;
let selectedIndex = 0;
const scenarioTargets = [
  {label:'Latest Observation', year:null},
  {label:'September 1929', year:1929.75},
  {label:'January 1966', year:1966.04},
  {label:'March 2000', year:2000.21},
  {label:'October 2007', year:2007.79},
  {label:'March 2020', year:2020.21},
  {label:'December 2021', year:2021.96},
  {label:'August 2026', year:2026.62}
];

const fmt = {
  num:(x,d=2)=> Number.isFinite(x) ? Number(x).toFixed(d) : 'n/a',
  pct:(x,d=1)=> Number.isFinite(x) ? (x*100).toFixed(d)+'%' : 'n/a',
  mult:(x,d=2)=> Number.isFinite(x) ? Number(x).toFixed(d)+'x' : 'n/a'
};

function decimalYearToDate(v){
  const y = Math.floor(v);
  const frac = v - y;
  let month = Math.round(frac*12) + 1;
  if(month < 1) month = 1;
  if(month > 12) month = 12;
  return new Date(Date.UTC(y, month-1, 1));
}
function dateLabel(d){return d.toLocaleDateString('en-US',{year:'numeric',month:'short',timeZone:'UTC'});}
function isNum(x){return typeof x === 'number' && Number.isFinite(x);}
function cleanValue(v){
  if(v === null || v === undefined || v === '' || v === 'NA') return NaN;
  if(typeof v === 'number') return v;
  const n = Number(String(v).replace(/,/g,'').trim());
  return Number.isFinite(n) ? n : NaN;
}

function parseArray(aoa){
  const out = [];
  for(const r of aoa){
    if(!r || r.length < 14) continue;
    const dateDecimal = cleanValue(r[0]);
    const price = cleanValue(r[1]);
    if(!Number.isFinite(dateDecimal) || !Number.isFinite(price) || dateDecimal < 1800 || dateDecimal > 2100) continue;
    const obj = {
      dateDecimal,
      date: decimalYearToDate(dateDecimal),
      price,
      dividend: cleanValue(r[2]),
      earnings: cleanValue(r[3]),
      cpi: cleanValue(r[4]),
      dateFraction: cleanValue(r[5]),
      gs10: cleanValue(r[6]),
      realPrice: cleanValue(r[7]),
      realDividend: cleanValue(r[8]),
      realTRPrice: cleanValue(r[9]),
      realEarnings: cleanValue(r[10]),
      realTREarnings: cleanValue(r[11]),
      cape: cleanValue(r[12]),
      capeH: cleanValue(r[13]),
      excessCapeYield: cleanValue(r[14]),
      monthlyTR: cleanValue(r[15]),
      tenYearStockReturn: cleanValue(r[16]),
      tenYearBondReturn: cleanValue(r[17]),
      realTenYearExcessReturn: cleanValue(r[18])
    };
    if(Number.isFinite(obj.cape) || Number.isFinite(obj.realPrice)) out.push(obj);
  }
  out.sort((a,b)=>a.dateDecimal-b.dateDecimal);
  return enrich(out);
}

function enrich(data){
  const baseSeries = data.map(d => Number.isFinite(d.realTRPrice) ? d.realTRPrice : d.realPrice);
  let runningMax = -Infinity;
  data.forEach((d,i)=>{
    const val = baseSeries[i];
    if(Number.isFinite(val)) runningMax = Math.max(runningMax,val);
    d.drawdown = Number.isFinite(val) && runningMax > 0 ? val / runningMax - 1 : NaN;
  });
  const capeVals = data.map(d=>d.cape).filter(Number.isFinite).sort((a,b)=>a-b);
  data.forEach(d=>{
    d.capePercentile = Number.isFinite(d.cape) ? percentileRank(capeVals,d.cape) : NaN;
    d.forward1 = fwdReturn(data,d,12,baseSeries);
    d.forward3 = fwdReturn(data,d,36,baseSeries);
    d.forward5 = fwdReturn(data,d,60,baseSeries);
    d.forward10 = Number.isFinite(d.tenYearStockReturn) ? d.tenYearStockReturn : fwdReturn(data,d,120,baseSeries);
    d.maxDrawdown10 = maxForwardDrawdown(data,d,120,baseSeries);
  });
  return data;
}
function percentileRank(sorted, value){
  let lo=0, hi=sorted.length;
  while(lo<hi){const mid=(lo+hi)>>1; if(sorted[mid] <= value) lo=mid+1; else hi=mid;}
  return sorted.length ? lo / sorted.length : NaN;
}
function fwdReturn(data,d,months,series){
  const i = data.indexOf(d);
  const j = i + months;
  if(j >= data.length) return NaN;
  const start = series[i]; const end = series[j];
  if(!Number.isFinite(start) || !Number.isFinite(end) || start <= 0) return NaN;
  return Math.pow(end/start, 12/months) - 1;
}
function maxForwardDrawdown(data,d,months,series){
  const i = data.indexOf(d);
  const end = Math.min(data.length-1, i+months);
  const start = series[i];
  if(!Number.isFinite(start) || start <= 0) return NaN;
  let min = 0;
  for(let k=i;k<=end;k++){
    if(Number.isFinite(series[k])) min = Math.min(min, series[k]/start - 1);
  }
  return min;
}

function buildSample(){
  const sample=[];
  let rp=100, tr=100;
  for(let y=1881;y<=2026;y++){
    for(let m=1;m<=12;m++){
      if(y===2026 && m>8) break;
      const t=(y-1881)*12+m;
      const cycle=Math.sin(t/72)*5 + Math.sin(t/19)*2;
      let cape = 16 + cycle;
      if(y >= 1928 && y <= 1929) cape += 14;
      if(y >= 1997 && y <= 2001) cape += 21;
      if(y >= 2021) cape += 22;
      if(y >= 2008 && y <= 2009) cape -= 8;
      if(y >= 1932 && y <= 1933) cape -= 7;
      const shock = (y===1929&&m>8)||y===1930||y===1931 ? -0.035 : (y===2008 ? -0.03 : (y===2020&&m>=2&&m<=4 ? -0.07 : 0));
      const ret = 0.006 + Math.sin(t/31)*0.006 + shock;
      tr *= 1+ret;
      rp *= 1+ret*0.75;
      sample.push({dateDecimal:y+(m-1)/12,date:decimalYearToDate(y+(m-1)/12),price:rp,realPrice:rp,realTRPrice:tr,cape,capeH:cape*.82+3,excessCapeYield:(1/cape)-.015,gs10:.03,tenYearStockReturn:NaN});
    }
  }
  return enrich(sample);
}

function renderAll(){
  if(!rows.length) rows = buildSample();
  selectedIndex = nearestScenarioIndex();
  renderStats();
  renderScenarioOptions();
  renderScenario();
  renderCharts();
  renderHeatmap();
}
function latestValid(){
  for(let i=rows.length-1;i>=0;i--){ if(Number.isFinite(rows[i].cape)) return rows[i]; }
  return rows[rows.length-1];
}
function renderStats(){
  const latest = latestValid();
  const capes = rows.map(d=>d.cape).filter(Number.isFinite);
  const median = quantile(capes,.5);
  const max = Math.max(...capes);
  const html = [
    ['Latest CAPE',fmt.mult(latest.cape),'red'],
    ['CAPE Percentile',fmt.pct(latest.capePercentile),'red'],
    ['Median CAPE',fmt.mult(median),'green'],
    ['Max CAPE',fmt.mult(max),'orange'],
    ['Latest Date',dateLabel(latest.date),'green']
  ].map(x=>`<div class="stat-card ${x[2]}"><h3>${x[0]}</h3><div class="value">${x[1]}</div></div>`).join('');
  document.getElementById('statsGrid').innerHTML=html;
}
function quantile(arr,q){
  const a=arr.filter(Number.isFinite).sort((x,y)=>x-y); if(!a.length) return NaN;
  const pos=(a.length-1)*q, base=Math.floor(pos), rest=pos-base;
  return a[base+1]!==undefined ? a[base]+rest*(a[base+1]-a[base]) : a[base];
}
function renderScenarioOptions(){
  const sel=document.getElementById('scenarioSelect');
  sel.innerHTML='';
  scenarioTargets.forEach((s,i)=>sel.add(new Option(s.label,i)));
  sel.value='0';
  sel.onchange=()=>{selectedIndex = Number(sel.value); renderScenario(); renderCharts();};
}
function nearestScenarioIndex(){return 0;}
function getScenarioRow(){
  const target=scenarioTargets[selectedIndex];
  if(!target || target.year===null) return latestValid();
  let best=rows[0], dist=Infinity;
  rows.forEach(r=>{const d=Math.abs(r.dateDecimal-target.year); if(d<dist){dist=d; best=r;}});
  return best;
}
function renderScenario(){
  const r=getScenarioRow();
  const title=scenarioTargets[selectedIndex]?.label || 'Scenario';
  document.getElementById('scenarioOutput').innerHTML = `
    <div class="scenario-head"><h2>${title}</h2><p><strong>Nearest available month:</strong> ${dateLabel(r.date)}. CAPE percentile is measured against all loaded observations with valid CAPE values.</p></div>
    <div class="metric-grid">
      <div class="mini-metric"><span>CAPE</span><strong>${fmt.mult(r.cape)}</strong></div>
      <div class="mini-metric"><span>CAPE-H / TR CAPE</span><strong>${fmt.mult(r.capeH)}</strong></div>
      <div class="mini-metric"><span>CAPE Percentile</span><strong>${fmt.pct(r.capePercentile)}</strong></div>
      <div class="mini-metric"><span>10Y Max Drawdown</span><strong>${fmt.pct(r.maxDrawdown10)}</strong></div>
      <div class="mini-metric"><span>1Y Forward Return</span><strong>${fmt.pct(r.forward1)}</strong></div>
      <div class="mini-metric"><span>3Y Forward Return</span><strong>${fmt.pct(r.forward3)}</strong></div>
      <div class="mini-metric"><span>5Y Forward Return</span><strong>${fmt.pct(r.forward5)}</strong></div>
      <div class="mini-metric"><span>10Y Forward Return</span><strong>${fmt.pct(r.forward10)}</strong></div>
    </div>`;
}
function renderCharts(){
  const x=rows.map(r=>r.date), scenario=getScenarioRow();
  const highX=rows.filter(r=>Number.isFinite(r.cape)&&r.cape>=threshold).map(r=>r.date);
  const highY=rows.filter(r=>Number.isFinite(r.cape)&&r.cape>=threshold).map(r=>r.cape);
  const capes=rows.map(r=>r.cape).filter(Number.isFinite);
  const med=quantile(capes,.5), p90=quantile(capes,.9);
  const layoutCommon={paper_bgcolor:'white',plot_bgcolor:'white',font:{family:'Segoe UI, Arial'},margin:{l:55,r:25,t:34,b:45},hovermode:'x unified',legend:{orientation:'h',y:-.18},shapes:[{type:'line',xref:'x',yref:'paper',x0:scenario.date,x1:scenario.date,y0:0,y1:1,line:{color:'#111827',width:2,dash:'dot'}}]};
  Plotly.newPlot('capeChart',[
    {x,y:rows.map(r=>r.cape),name:'CAPE',mode:'lines',line:{color:'#2563eb',width:2.5}},
    {x,y:rows.map(r=>r.capeH),name:'CAPE-H / TR CAPE',mode:'lines',line:{color:'#f59e0b',width:2}},
    {x:highX,y:highY,name:`CAPE > ${threshold}x`,mode:'markers',marker:{color:'#b91c1c',size:5,opacity:.75}},
    {x,y:rows.map(()=>med),name:'Historical Median',mode:'lines',line:{color:'#64748b',dash:'dash'}},
    {x,y:rows.map(()=>p90),name:'90th Percentile',mode:'lines',line:{color:'#dc2626',dash:'dot'}}
  ],{...layoutCommon,yaxis:{title:'Valuation multiple'},xaxis:{title:''}} ,{responsive:true});
  Plotly.newPlot('drawdownChart',[
    {x,y:rows.map(r=>r.drawdown*100),name:'Drawdown %',mode:'lines',fill:'tozeroy',line:{color:'#b91c1c',width:1.75},fillcolor:'rgba(185,28,28,.18)'},
    {x,y:rows.map(()=>-20),name:'-20% Bear Market',mode:'lines',line:{color:'#f97316',dash:'dash'}}
  ],{...layoutCommon,yaxis:{title:'Drawdown %',ticksuffix:'%'},xaxis:{title:''}}, {responsive:true});
  const scatter=rows.filter(r=>Number.isFinite(r.cape)&&Number.isFinite(r.forward10));
  Plotly.newPlot('scatterChart',[
    {x:scatter.map(r=>r.cape),y:scatter.map(r=>r.forward10*100),text:scatter.map(r=>dateLabel(r.date)),name:'Monthly observations',mode:'markers',marker:{color:scatter.map(r=>r.cape),colorscale:'RdYlBu',reversescale:true,size:6,opacity:.68,colorbar:{title:'CAPE'}}}
  ],{paper_bgcolor:'white',plot_bgcolor:'white',font:{family:'Segoe UI, Arial'},margin:{l:60,r:25,t:34,b:55},xaxis:{title:'Starting CAPE'},yaxis:{title:'Subsequent 10-Year Real Annualized Return',ticksuffix:'%'},hovermode:'closest'}, {responsive:true});
  Plotly.newPlot('forwardChart',[{x:['1Y','3Y','5Y','10Y'],y:[scenario.forward1,scenario.forward3,scenario.forward5,scenario.forward10].map(v=>Number.isFinite(v)?v*100:null),type:'bar',marker:{color:['#60a5fa','#3b82f6','#2563eb','#1d4ed8']}}],{paper_bgcolor:'white',plot_bgcolor:'white',font:{family:'Segoe UI, Arial'},margin:{l:55,r:25,t:34,b:45},yaxis:{title:'Annualized return',ticksuffix:'%'},xaxis:{title:''}}, {responsive:true});
}
function renderHeatmap(){
  const bins=[[0,10],[10,15],[15,20],[20,25],[25,30],[30,35],[35,100]];
  const html = `<table><thead><tr><th>CAPE Range</th><th>Months</th><th>Avg 10Y Return</th><th>Median 10Y Return</th><th>Avg 10Y Max Drawdown</th></tr></thead><tbody>` + bins.map(b=>{
    const group=rows.filter(r=>Number.isFinite(r.cape)&&r.cape>=b[0]&&r.cape<b[1]&&Number.isFinite(r.forward10));
    const avg=mean(group.map(r=>r.forward10)), med=quantile(group.map(r=>r.forward10),.5), dd=mean(group.map(r=>r.maxDrawdown10));
    const cls = avg>.06?'heat-good':avg>.03?'heat-ok':'heat-bad';
    return `<tr class="${cls}"><td>${b[0]}-${b[1]===100?'plus':b[1]}</td><td>${group.length}</td><td>${fmt.pct(avg)}</td><td>${fmt.pct(med)}</td><td>${fmt.pct(dd)}</td></tr>`;
  }).join('') + `</tbody></table>`;
  document.getElementById('heatmapTable').innerHTML=html;
}
function mean(a){const v=a.filter(Number.isFinite);return v.length?v.reduce((s,x)=>s+x,0)/v.length:NaN;}

function handleWorkbook(file){
  const reader=new FileReader();
  reader.onload=e=>{
    try{
      const data=new Uint8Array(e.target.result);
      const wb=XLSX.read(data,{type:'array'});
      const sheetName=wb.SheetNames.find(n=>/data/i.test(n)) || wb.SheetNames[0];
      const ws=wb.Sheets[sheetName];
      const aoa=XLSX.utils.sheet_to_json(ws,{header:1,raw:true,defval:null});
      const parsed=parseArray(aoa);
      if(!parsed.length) throw new Error('No usable Shiller rows found.');
      rows=parsed;
      document.getElementById('dataNotice').innerHTML=`Loaded <strong>${file.name}</strong> with ${rows.length.toLocaleString()} observations. Data are processed locally in your browser.`;
      renderAll();
    }catch(err){
      document.getElementById('dataNotice').innerHTML=`Could not parse this file: ${err.message}. The teaching sample remains loaded.`;
    }
  };
  reader.readAsArrayBuffer(file);
}

function setupIO(){
  const input=document.getElementById('fileInput');
  const drop=document.getElementById('dropZone');
  input.addEventListener('change',e=>{if(e.target.files[0]) handleWorkbook(e.target.files[0]);});
  ['dragenter','dragover'].forEach(evt=>drop.addEventListener(evt,e=>{e.preventDefault();drop.classList.add('dragover');}));
  ['dragleave','drop'].forEach(evt=>drop.addEventListener(evt,e=>{e.preventDefault();drop.classList.remove('dragover');}));
  drop.addEventListener('drop',e=>{const f=e.dataTransfer.files[0]; if(f) handleWorkbook(f);});
  document.getElementById('threshold').addEventListener('input',e=>{threshold=Number(e.target.value);document.getElementById('thresholdValue').textContent=threshold;renderCharts();});
  document.getElementById('downloadCsv').addEventListener('click',downloadCleanCsv);
}
function downloadCleanCsv(){
  const cols=['dateDecimal','date','price','realPrice','realTRPrice','cape','capeH','excessCapeYield','drawdown','capePercentile','forward1','forward3','forward5','forward10','maxDrawdown10'];
  const csv=[cols.join(',')].concat(rows.map(r=>cols.map(c=>c==='date'?dateLabel(r.date):r[c]).join(','))).join('\n');
  const blob=new Blob([csv],{type:'text/csv'});
  const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='valuation_reality_lab_clean_data.csv';a.click();URL.revokeObjectURL(a.href);
}

setupIO();
rows=buildSample();
renderAll();
