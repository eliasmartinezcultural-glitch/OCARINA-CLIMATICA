// Política de identidad V0.3. La localidad y la estación son entidades distintas.
window.CLIMATE_IDENTITY_POLICY={
  exactStationRequired:true,
  nearbyStationMayBeContext:true,
  nearbyStationMayNotBeLocalObservation:true,
  requiredFields:["stationName","province","latitude","longitude","altitude","stationNumber","oaci"],
  rule:"Una estación cercana puede mostrarse como referencia territorial, nunca como observación local sin declaración explícita."
};