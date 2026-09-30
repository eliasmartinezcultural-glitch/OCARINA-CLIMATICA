window.CLIMATE_HISTORY_CATALOG=[
{id:"smn-hourly",module:"hourly-series",granularity:"hour",variables:["temperature","pressure","humidity","windSpeed","windDirection"],status:"active"},
{id:"smn-extremes",module:"daily-extremes",granularity:"day",variables:["temperatureMin","temperatureMax"],status:"next"},
{id:"smn-temp365",module:"recent-temperature",granularity:"day",variables:["temperatureMin","temperatureMax"],status:"next"},
{id:"smn-forecast5",module:"forecast-five-days",granularity:"3-hour",variables:["temperature","windSpeed","windDirection","precipitation"],status:"next"},
{id:"smn-normals",module:"climate-normals",granularity:"monthly",variables:["temperature","temperatureMax","temperatureMin","humidity","windSpeed","cloudiness"],period:"1981-2010",status:"planned"}
];