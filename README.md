# OCARINA CLIMÁTICA

## San Patricio del Chañar · V0.2.3

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

### Próxima gran capa

**V0.3 — EL TIEMPO SE CONVIERTE EN HISTORIA:** identidad de estaciones + series temporales + extremos + cobertura + archivo histórico, sin mezclar períodos incompatibles.

**Ocarina Producciones · tecnología desarrollada por Elías Martínez.**
