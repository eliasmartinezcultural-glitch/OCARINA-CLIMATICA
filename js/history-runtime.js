// Orquestador histórico V0.3. Todavía no inventa una serie: prepara el flujo y exige identidad/cobertura.
window.ClimateHistoryRuntime={
  inspect(records){
    const coverage=window.ClimateCoverage.classify(records);
    return {records:Array.isArray(records)?records:[],coverage,ready:coverage.state!=="unknown"};
  },
  canCompare(a,b){return window.ClimateCoverage.comparable(a,b);}
};