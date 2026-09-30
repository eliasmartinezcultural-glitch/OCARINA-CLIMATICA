# OCARINA CLIMÁTICA · Arquitectura V0.2.3

## Regla central

**FUENTE → INGESTOR → ADAPTADOR → VALIDACIÓN → OBSERVATORIO → INTERFAZ**

La interfaz nunca consulta directamente al SMN. El ingestor transforma el recurso externo en un registro local estable; el adaptador transforma ese registro al contrato canónico; el validador decide si puede entrar al observatorio.

## Capas

- `data/config.js`: reglas globales, lugar y tolerancias.
- `data/schema.js`: contrato canónico de observaciones y estaciones.
- `data/source-catalog.js`: catálogo único de fuentes oficiales y su función.
- `data/stations.js`: identidad de estaciones, separada de los valores meteorológicos.
- `data/live/`: último registro normalizado que puede consumir GitHub Pages.
- `scripts/ingest_smn_present.py`: descarga y adapta el recurso horario del SMN sin depender del navegador.
- `data/providers/`: adaptadores por proveedor.
- `data/validator.js`: control temporal, físico y de procedencia.
- `data/observatory.js`: estado central del observatorio.
- `js/observatory-runtime.js`: orquestador del flujo.
- `js/observatory-ui.js`: única capa que pinta el estado del observatorio.
- `data/explorer-catalog.js`: mapa de módulos futuros sin acoplarlos a HTML.
- `js/app.js`: interacción general de la experiencia.

## Identidad de estación

No se considera confirmada una estación local solo porque aparezca una localidad en un documento. El registro meteorológico y el catálogo oficial de estaciones se mantienen separados hasta poder asociar nombre, número, OACI, coordenadas, altura y provincia con evidencia verificable.

Esto evita atribuir a San Patricio del Chañar una estación cercana o una estación privada como si fuera una estación oficial del SMN.

## Calidad de datos

Cada observación debe poder responder:

1. ¿Qué mide?
2. ¿Dónde?
3. ¿Cuándo?
4. ¿De qué fuente?
5. ¿Es observado, calculado, estimado o pronosticado?

Si una respuesta no existe, el sistema muestra **Sin dato / identidad pendiente / registro no validado** en lugar de completar con una suposición.

## Históricos

El próximo motor histórico debe consumir fuentes separadas del presente: datos meteorológicos horarios, temperaturas extremas, registro de 365 días y normales climáticas. No se deben mezclar series con coberturas o estaciones distintas sin declararlo.

## Operación

GitHub Actions actualiza el registro del presente cada hora y permite ejecución manual. La concurrencia está limitada para impedir dos ingestas simultáneas. Si la fuente falla, el sitio conserva el último archivo válido y la interfaz no inventa valores.
