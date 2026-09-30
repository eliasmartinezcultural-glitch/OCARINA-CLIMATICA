// FUENTE → ADAPTADOR → VALIDACIÓN → OBSERVATORIO → INTERFAZ
(async function(){
  const adapter=window.SMNPresentAdapter;if(!adapter){renderObservatory();return;}
  const candidate=await adapter.load();
  if(!candidate?.ok){window.Observatory.status="unavailable";window.Observatory.provenance={provider:"SMN",dataset:adapter.dataset,retrievedAt:new Date().toISOString(),coverage:null,notes:candidate?.message||"Fuente no disponible."};renderObservatory();return;}
  const record=adapter.normalize(candidate.data),validation=ClimateValidator.validate(record);
  if(!validation.valid){window.Observatory.status="invalid";window.Observatory.provenance={provider:"SMN",dataset:adapter.dataset,retrievedAt:new Date().toISOString(),coverage:null,notes:"Dato rechazado: "+validation.errors.join(", ")};renderObservatory();return;}
  Object.assign(window.Observatory,record,{status:"live"});renderObservatory();
})();