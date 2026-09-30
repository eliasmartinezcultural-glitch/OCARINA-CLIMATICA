// FUENTE → IDENTIDAD → ADAPTADOR → VALIDACIÓN → OBSERVATORIO → INTERFAZ
(async function(){
  const adapter=window.SMNPresentAdapter;
  const stationAdapter=window.SMNStationAdapter;
  if(!adapter||!stationAdapter){window.Observatory.status="unavailable";window.Observatory.provenance={provider:"SMN",dataset:"Conector incompleto",retrievedAt:new Date().toISOString(),coverage:null,notes:"Falta el adaptador de observación o el verificador de estación."};renderObservatory();return;}
  const stationResult=await stationAdapter.load();
  const stationData=stationResult?.ok?stationResult.data:null;
  if(!stationData||stationData.status!=="verified"){
    window.Observatory.status="unavailable";
    window.Observatory.provenance={provider:"SMN",dataset:"Estado del Tiempo presente",retrievedAt:stationData?.retrievedAt||new Date().toISOString(),coverage:null,notes:"La estación local todavía no tiene una identidad oficial única verificada en el catálogo SMN. No se atribuyen datos a Chañar por proximidad."};
    renderObservatory(); return;
  }
  const candidate=await adapter.load();
  if(!candidate?.ok){window.Observatory.status="unavailable";window.Observatory.provenance={provider:"SMN",dataset:adapter.dataset,retrievedAt:new Date().toISOString(),coverage:null,notes:candidate?.message||"Fuente no disponible."};renderObservatory();return;}
  const record=adapter.normalize(candidate.data);
  if(!record){window.Observatory.status="unavailable";window.Observatory.provenance={provider:"SMN",dataset:adapter.dataset,retrievedAt:candidate.data?.retrievedAt||new Date().toISOString(),coverage:null,notes:candidate.data?.notes||"No existe una observación local candidata."};renderObservatory();return;}
  record.station={...record.station,...stationData.station};
  record.station.id=record.station.stationNumber||record.station.id||null;
  record.provenance.coverage="Estación verificada por catálogo oficial SMN + registro de Estado del Tiempo presente.";
  const validation=ClimateValidator.validate(record);
  if(!validation.valid){window.Observatory.status="invalid";window.Observatory.provenance={...record.provenance,notes:"Dato rechazado: "+validation.errors.join(", ")};renderObservatory();return;}
  Object.assign(window.Observatory,record,{status:"live"});
  renderObservatory();
})();