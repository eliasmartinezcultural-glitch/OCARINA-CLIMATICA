// Contrato de datos V0.1.0.
// Este archivo define cómo crecerá el sistema sin mezclar datos con presentación.
const climateSchema={
  current:{temperature:null,feelsLike:null,humidity:null,pressure:null,windSpeed:null,windDirection:null,gust:null,precipitation:null,sky:null,updatedAt:null,sourceId:null},
  historical:{date:null,variable:null,value:null,unit:null,station:null,coverage:null,sourceId:null},
  event:{date:null,title:null,phenomenon:null,place:null,description:null,sourceId:null,photoIds:[],testimonialIds:[]},
  record:{variable:null,value:null,unit:null,date:null,period:null,location:null,sourceId:null},
  testimony:{author:null,approximateDate:null,place:null,text:null,consent:null,sourceId:null},
  photo:{title:null,date:null,place:null,author:null,description:null,license:null,sourceId:null},
  source:{id:null,name:null,type:null,url:null,accessedAt:null,notes:null}
};
if(typeof window!=="undefined") window.climateSchema=climateSchema;