# OCARINA CLIMÁTICA · CAPAS ADITIVAS POST-PL1

PL1 permanece congelada como referencia de estructura, navegación y funcionalidad pública.

Esta etapa agrega profundidad sin rediseñar el núcleo.

## Orden de crecimiento

### Capa A — Identidad territorial
- registro de identidad de localidad;
- registro de estaciones y metadatos;
- alias controlados;
- evidencia de pertenencia territorial;
- bloqueo de sustituciones silenciosas.

### Capa B — Datos
- adaptadores por fuente;
- snapshots versionados;
- estados LIVE / STALE / DEGRADED / UNAVAILABLE / PENDING_VERIFICATION;
- unidades y normalización;
- cobertura temporal;
- detección de vacíos y duplicados.

### Capa C — Archivo
- series diarias;
- series horarias;
- calendario climático;
- eventos;
- documentos;
- fotografías y audio con derechos;
- memoria oral marcada como memory.

### Capa D — Interacción
- exploración por período;
- filtros;
- comparación únicamente cuando exista base metodológica compatible;
- fichas de procedencia;
- trazabilidad bajo demanda;
- pequeñas herramientas educativas.

### Capa E — Presentación
- visualizaciones progresivas;
- microinteracciones;
- iconografía climática;
- fotografía local;
- mapas cuando la escala y la fuente sean adecuadas;
- decoración subordinada a la comprensión.

## Regla de integración

Toda capa nueva debe entrar en el flujo:

FUENTE → INGESTOR → SNAPSHOT → CONTRATO → VALIDACIÓN → MOTOR DE ESTADO → VISTA → TRAZABILIDAD

No se crearán módulos paralelos que contradigan el núcleo.

## Referencias globales

La gobernanza de datos sigue los principios GCOS/WMO sobre continuidad, metadatos, calidad, homogeneidad, preservación, acceso y evaluación de cambios. WCAG 2.2 continúa siendo la referencia de accesibilidad del producto. 
