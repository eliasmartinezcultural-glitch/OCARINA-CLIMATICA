// Almacén lógico V0.3. GitHub Pages sigue siendo estático: los datos se materializan en archivos JSON generados por ingestores.
window.ClimateHistoryStore={
  index:[],
  add(records){if(Array.isArray(records))this.index.push(...records);return this.index;},
  byStation(stationId){return this.index.filter(r=>r.stationId===stationId);},
  byPeriod(start,end){const a=new Date(start),b=new Date(end);return this.index.filter(r=>{const d=new Date(r.observedAt);return d>=a&&d<=b;});}
};