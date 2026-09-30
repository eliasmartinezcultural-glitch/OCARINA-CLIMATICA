// Mapa de series: cada dataset tiene función propia. No se mezclan hasta pasar por identidad y cobertura.
window.CLIMATE_HISTORY_CATALOG=[
{id:"smn-hourly",module:"hourly-series",granularity:"hour",variables:["temperature","pressure","humidity","windSpeed","windDirection"],status:"next"},
{id:"smn-extremes",module:"daily-extremes",granularity:"day",variables:["temperatureMin","temperatureMax"],status:"next"},
{id:"smn-temp365",module:"recent-temperature",granularity:"day",variables:["temperatureMin","temperatureMax"],status:"next"},
{id:"smn-normals",module:"climate-normals",granularity:"monthly",variables:["temperature","temperatureMax","temperatureMin","humidity","windSpeed","cloudiness"],period:"1981-2010",status:"planned"}
];