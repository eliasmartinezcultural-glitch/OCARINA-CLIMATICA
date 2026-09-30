// Motor de reporte semanal local. Solo calcula sobre observaciones de San Patricio del Chañar.
window.ClimateReportRuntime={
  async load(){
    if(!window.SMNHourlyAdapter)return this.empty("Adaptador horario ausente.");
    const loaded=await window.SMNHourlyAdapter.load();
    if(!loaded.ok)return this.empty(loaded.message);
    const data=loaded.data||{};
    if(data.status!=="ready"||!Array.isArray(data.records)||!data.records.length)return this.empty(data.notes||"No hay serie local validada.");
    return this.build(data.records);
  },
  build(records){
    const valid=records.filter(r=>r&&r.observedAt&&r.values);
    const nums=(key)=>valid.map(r=>Number(r.values[key])).filter(Number.isFinite);
    const avg=a=>a.length?a.reduce((x,y)=>x+y,0)/a.length:null;
    const max=a=>a.length?Math.max(...a):null;
    const min=a=>a.length?Math.min(...a):null;
    const t=nums("temperature"),h=nums("humidity"),p=nums("pressure"),w=nums("windSpeed");
    const start=valid.map(r=>r.observedAt).sort()[0]||null;
    const end=valid.map(r=>r.observedAt).sort().at(-1)||null;
    return {
      status:"ready",scope:"San Patricio del Chañar",start,end,count:valid.length,
      temperature:{min:min(t),max:max(t),average:avg(t)},
      humidity:{average:avg(h),min:min(h),max:max(h)},
      pressure:{average:avg(p),min:min(p),max:max(p)},
      wind:{average:avg(w),max:max(w)},
      precipitation:{available:false,value:null,note:"El dataset horario del SMN no aporta precipitación en este contrato."},
      coverage:{state:valid.length?"partial":"unknown",records:valid.length},
      note:"Resumen derivado de observaciones horarias locales; no reemplaza el dato original."
    };
  },
  empty(note){return {status:"unavailable",scope:"San Patricio del Chañar",note,count:0};}
};