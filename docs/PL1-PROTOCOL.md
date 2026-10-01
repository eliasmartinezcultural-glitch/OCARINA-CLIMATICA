# OCARINA CLIMÁTICA — PL1

## Estado

PL1 es la primera versión altamente curada, funcional y base del proyecto.

**Commit congelado:** `4f8a0db890285c92ebe3096c7fb83638063067b8`  
**Rama de referencia congelada:** `PL1`  
**Fecha de congelamiento:** 2026-10-01

PL1 constituye la referencia recuperable de estructura, navegación, concepto y funcionalidad del núcleo actual.

## Regla de evolución

A partir de PL1, la evolución ordinaria es **aditiva**.

Se puede:
- sumar datos y fuentes verificadas;
- sumar recursos documentales y multimedia;
- sumar capas de interacción;
- sumar visualización y decoración;
- sumar software interno, validadores y automatizaciones;
- sumar accesibilidad, pruebas y observabilidad;
- sumar contenido histórico, educativo y de memoria;
- sumar metadatos, trazabilidad y calidad.

No se puede, como parte de una ampliación ordinaria:
- reemplazar la estructura pública de PL1;
- quitar o cambiar las cinco puertas públicas: AHORA, PRONÓSTICO, 365 DÍAS / ARCHIVO, HISTORIAS y APRENDER;
- cambiar silenciosamente el significado de un dato;
- convertir una predicción en observación;
- presentar una estimación como medición;
- sustituir una estación local por otra sin declararlo;
- incorporar contenido ajeno a la misión climática-territorial;
- introducir información sin procedencia trazable;
- romper compatibilidad multidispositivo;
- degradar accesibilidad, claridad o rendimiento para agregar complejidad.

## Principio técnico

La complejidad debe crecer principalmente detrás de la interfaz.

La experiencia pública debe conservar:
1. claridad;
2. localidad;
3. trazabilidad;
4. interacción sencilla;
5. lectura rápida;
6. profundidad bajo demanda.

## Regla científica

Todo dato nuevo debe conservar, cuando corresponda:

- fuente;
- ubicación/estación;
- fecha y hora;
- unidad;
- tipo de evidencia;
- fecha de recuperación;
- estado de validación;
- transformación aplicada, si existe.

Los estados de evidencia definidos por el Estatuto son:

`observed`, `forecast`, `derived`, `estimated`, `documentary`, `memory`.

PL1 no autoriza datos inventados, inferencias presentadas como mediciones ni equivalencias territoriales silenciosas.

## Regla de integración

Cada nueva capa debe conectarse orgánicamente con el núcleo:

**FUENTE → INGESTOR → SNAPSHOT → CONTRATO → VALIDACIÓN → MOTOR DE ESTADO → VISTA → TRAZABILIDAD**

La incorporación de profundidad no debe crear un segundo sistema paralelo.

## Regla de recuperación

Si una evolución futura rompe la estructura o el sentido de PL1, la referencia de recuperación es la rama `PL1` y el commit indicado arriba.

PL1 no se modifica para absorber errores posteriores.
