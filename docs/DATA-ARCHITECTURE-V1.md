# Arquitectura de datos aditiva V1

## Flujo canónico
FUENTE → ADAPTADOR → SNAPSHOT INMUTABLE → CONTRATO → VALIDACIÓN → CALIDAD → ÍNDICE → PRESENTACIÓN → TRAZABILIDAD

## Tipos de evidencia
- observed: medición/observación publicada por una fuente.
- forecast: predicción; nunca se presenta como observación.
- derived: cálculo reproducible a partir de datos base.
- estimated: reanálisis, reconstrucción o producto remoto.
- documentary: documento, mapa, informe o publicación.
- memory: testimonio o memoria local.

## Regla de localidad
Cada registro debe declarar cómo se vincula con Chañar:
- exact-local: estación/objeto inequívocamente local.
- declared-locality: la fuente entrega un pronóstico para la localidad.
- regional-context: sirve para contexto espacial/regional.
- coordinate-grid: producto sobre una grilla; debe marcarse como estimado si corresponde.
- historical-document: documento que menciona explícitamente el lugar.

## Campos mínimos de un snapshot
id, sourceId, evidenceType, localityGate, observedAt/retrievedAt, value(s), unit(s), station/object identity, sourceUrl, validationState, qualityState, transformation, checksum/version.

## Prohibiciones
No rellenar huecos con otra estación sin declararlo. No convertir una imagen satelital en fotografía local convencional. No convertir memoria oral en medición. No publicar récords o anomalías sin referencia comparable y método documentado.
