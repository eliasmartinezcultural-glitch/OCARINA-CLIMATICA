// Motor de reporte semanal: calcula exclusivamente sobre registros horarios ingeridos.
window.ClimateReportRuntime={
  async load(){
    try{
      const [seriesR,stationR]=await Promise.all([
        fetch("data/live/smn-hourly.json?ts="+Date.now(),{cache:"no-store"}),
        fetch("data/live/smn-station.json?ts="+Date.now(),{cache:"no-store"})
      ]);
      if(!seriesR.ok||!stationR.ok) throw new Error("No se pudo cargar la base local.");
      const series=await seriesR.json(), station=await stationR.json();
      if(station.status!=="verified") return {status:"unavailable",note:"La estación SMN de San Patricio del Chañar todavía no está verificada en el catálogo oficial."};
      if(series.status!=="ready"||!Array.isArray(series.records)||!series.records.length) return {status:"unavailable",note:"El SMN no entregó registros horarios locales utilizables."};
      const end=new Date(series.records[series.records.length-1].observedAt), start=new Date(end.getTime()-7*86400000);
      const records=series.records.filter(r=>new Date(r.observedAt)>=start);
      const vals=k=>records.map(r=>Number(r.values?.[k])).filter(Number.isFinite);
      const stat=a=>a.length?{min:Math.min(...a),max:Math.max(...a),average:a.reduce((x,y)=>x+y,0)/a.length}:null;
      return {status:records.length?"ready":"unavailable",start:start.toISOString(),end:end.toISOString(),count:records.length,temperature:stat(vals("temperature")),humidity:stat(vals("humidity")),pressure:stat(vals("pressure")),wind:stat(vals("windSpeed")),note:"Calculado a partir de observaciones horarias SMN ingeridas. Promedios y rangos son derivados; no son mediciones nuevas."};
    }catch(error){return {status:"unavailable",note:"No se pudo construir el reporte: "+error.message};}
  }
};