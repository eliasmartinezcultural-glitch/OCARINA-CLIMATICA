# OCARINA CLIMÁTICA

## San Patricio del Chañar · V1.1.0 · CRONOLOGÍA CLIMÁTICA

**El clima de nuestro lugar.**

Un observatorio local que combina observación meteorológica, series históricas, territorio, fotografías, testimonios y memoria climática.

### Reglas mundiales

1. **Profundidad oculta:** mucha estructura, sistema, datos y programación por detrás; experiencia fácil por delante.
2. **Curiosidad:** cada visita debe abrir una nueva pregunta o descubrimiento.
3. **Identidad territorial:** debe ser y parecer de San Patricio del Chañar, para Chañar.
4. **Rigor:** no inventar mediciones, registros, acontecimientos, fotografías ni fuentes.
5. **Procedencia:** cada dato debe conservar qué mide, dónde, cuándo, fuente y calidad.
6. **Separación:** observado, calculado, estimado, pronosticado, testimonial e histórico no se mezclan sin declararlo.

### Motor actual

**FUENTE → INGESTOR → ADAPTADOR → VALIDACIÓN → OBSERVATORIO → REPORTE → INTERFAZ**

La observación del SMN llega mediante GitHub Actions a data/live/smn-present.json. El navegador consume únicamente ese registro normalizado. Así, un cambio de proveedor no obliga a reconstruir toda la interfaz.

### Estructura

- index.html — experiencia principal.
- css/styles.css — sistema visual responsive.
- data/config.js — reglas globales.
- data/schema.js — contrato canónico.
- data/source-catalog.js — catálogo único de fuentes.
- data/stations.js — identidad de estaciones.
- data/live/ — registros normalizados publicados.
- scripts/ — ingestores externos.
- data/providers/ — adaptadores por proveedor.
- data/validator.js — control de calidad.
- data/observatory.js — estado central.
- js/observatory-runtime.js — orquestador.
- js/observatory-ui.js — render del observatorio.
- data/explorer-catalog.js — puertas de exploración.
- js/app.js — interacción general.
- ARCHITECTURE.md — reglas estructurales para no romper el proyecto al crecer.

### Fuentes oficiales previstas

El catálogo oficial del SMN incluye, entre otros, Estado del Tiempo presente, Datos meteorológicos horarios, temperaturas extremas, Registro de Temperatura de 365 días, pronóstico a 5 días, listado de estaciones y estadísticas climáticas normales. Cada fuente tendrá su propio adaptador cuando corresponda.

### Estado de la estación

La identidad de una estación local no se da por supuesta. El motor puede recibir una observación con nombre de estación, pero no asigna coordenadas, número, OACI ni equivalencia con una estación cercana hasta verificarlo.

### Nueva capa · Cronología climática\n\nLa cronología inicial separa evidencia primaria, secundaria, testimonial y contextual. Los episodios documentados se conservan como registros editoriales y no como mediciones instrumentales. La base actual es deliberadamente no exhaustiva: funciona como punto de partida para ampliar el archivo 1900–2026.\n\n### Próxima gran capa

**V0.3 — EL TIEMPO SE CONVIERTE EN HISTORIA:** identidad de estaciones + series temporales + extremos + cobertura + archivo histórico, sin mezclar períodos incompatibles.

**Ocarina Producciones · tecnología desarrollada por Elías Martínez.**


## Archivo Climático Histórico · fase de investigación

La cronología se amplió con antecedentes hidrológicos contextuales (1899, 1915, 1945, 1972), la historia de Tratayen, la emergencia agropecuaria por granizo de 1999, memorias documentadas de crecidas de 2002 y 2005 y la serie de granizo INTA 1966–1998 + 2011–2017. Estos registros conservan explícitamente su nivel de evidencia y no se presentan como mediciones locales cuando no existe evidencia local suficiente.

### Fuentes históricas prioritarias aún por recuperar
- estación meteorológica instalada en EPEA 3 en 2015: localizar responsable, instrumentos, período y archivos;
- estación meteorológica del viñedo de San Patricio del Chañar utilizada por CFI: localizar propietario, coordenadas, variables, período y archivos originales;
- registros meteorológicos de bodegas y establecimientos productivos;
- series INTA y agroclimáticas locales;
- registros hidrométricos AIC de 2002, 2005 y 2006;
- archivos municipales, prensa local y fotografías fechadas;
- documentación primaria de eventos anteriores a 1966.
