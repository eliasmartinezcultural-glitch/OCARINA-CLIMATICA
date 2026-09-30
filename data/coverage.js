// Motor de cobertura V0.3. Evita llamar histórico a un período cuya cobertura no conocemos.
window.ClimateCoverage={
  classify(records){
    if(!Array.isArray(records)||!records.length)return {state:"unknown",count:0,start:null,end:null,gaps:[]};
    const dates=records.map(r=>new Date(r.observedAt)).filter(d=>Number.isFinite(d.getTime())).sort((a,b)=>a-b);
    if(!dates.length)return {state:"unknown",count:0,start:null,end:null,gaps:[]};
    return {state:"partial",count:dates.length,start:dates[0].toISOString(),end:dates.at(-1).toISOString(),gaps:[]};
  },
  comparable(a,b){return !!a&&!!b&&a.stationId===b.stationId&&a.sourceId===b.sourceId;}
};