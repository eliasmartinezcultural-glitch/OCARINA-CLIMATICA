# Ocarina Climática · Autoactualizador y sondeador de fuentes

**Objetivo:** sostener una visión meteorológica lo más fiable posible para San Patricio del Chañar, separando el tiempo estimado por modelos de las observaciones instrumentales reales.

## Qué quedó implementado

### 1. Ciclo automático cada 30 minutos
El workflow `.github/workflows/climate-ingestion.yml` se programa con cron `*/30 * * * *`, admite ejecución manual y se ejecuta al cambiar los scripts relevantes. GitHub Actions es gratuito dentro de los límites de la cuenta, pero la hora exacta no está garantizada: puede haber demora en la cola del servicio.

En cada ciclo:
1. Descarga y valida el pronóstico de Open-Meteo.
2. Guarda un snapshot estático en `data/live/open-meteo.json`.
3. Consulta fuentes públicas y actualiza `data/live/source-health.json`.
4. Descubre estaciones SMN y estima distancia al punto de referencia en `data/live/smn-nearby-stations.json`.
5. Marca una estación local como verificada solo si hay una coincidencia oficial exacta y única.
6. Busca observaciones SMN recientes dentro de un radio regional y guarda estación, coordenadas, distancia, variables y antigüedad en `data/live/smn-nearby-observations.json`.
7. Intenta la ingestión complementaria de SMN/AIC sin permitir que la caída de una fuente secundaria cancele el snapshot principal.
8. Valida los archivos JSON y publica los cambios mediante GitHub Pages.

### 2. Página resistente a fallos
- Consulta Open-Meteo directamente al abrir y al actualizar manualmente.
- Repite la consulta del navegador cada 30 minutos.
- Si la API en vivo falla, intenta utilizar el snapshot publicado.
- Si tampoco hay snapshot, conserva la última respuesta válida de la sesión y muestra un aviso.
- Separa la temperatura modelada de la observación oficial regional.
- No etiqueta una estación distante como si midiera dentro del pueblo.
- Muestra la hora válida del modelo y la antigüedad de la observación regional.

### 3. Comparación de modelos
`scripts/ingest_open_meteo.py` intenta consultar ECMWF, GFS e ICON mediante la opción multi-modelo de Open-Meteo. El archivo `data/live/model-comparison.json` conserva qué modelos respondieron y la dispersión de temperatura por hora. Si el servicio no ofrece esos modelos en una ejecución, el pronóstico principal sigue funcionando y la comparación queda como parcial/no disponible.

La dispersión entre modelos es una señal orientativa de incertidumbre, no una probabilidad meteorológica calibrada. A futuro, deberá evaluarse contra observaciones instrumentales verificadas antes de afirmar qué modelo es más preciso para el Chañar.

### 4. Sondeador de fuentes
`scripts/sondear_fuentes.py` revisa disponibilidad y respuesta básica de:
- Open-Meteo Forecast API.
- Catálogo oficial OAPI de estaciones SMN.
- Observaciones sinópticas SMN.
- Observaciones automáticas SMN.
- Catálogo público de estaciones SMN.
- Descargas de datos horarios y estado del tiempo presente SMN.
- Endpoint de alertas del SMN (se monitorea; no se presenta una alerta como válida sin validar estructura, vigencia y cobertura).
- Pronóstico regional y estación hidrológica de AIC.
- Documentación de Open-Meteo.

El resultado no es un buscador de toda la web ni prueba por sí solo la calidad meteorológica. Es un sondeador técnico de un registro explícito de fuentes: responde si una fuente está disponible, registra latencia/HTTP y ayuda a descubrir estaciones. Las nuevas fuentes que se encuentren en futuras investigaciones deben incorporarse al catálogo con URL, variable, cobertura, frecuencia, licencia y criterio de calidad.

## Qué significa “clima real” en esta aplicación

No existe una API que garantice temperatura exacta en cada esquina. La página combina capas diferentes:

- **Observación:** medida por instrumento en una estación identificada; siempre con nombre, coordenadas y hora.
- **Pronóstico:** salida de un modelo para el punto geográfico; no es medición.
- **Referencia regional:** observación de una estación cercana, con distancia y antigüedad visibles.
- **Alerta:** aviso oficial emitido por el organismo competente; no debe reconstruirse a partir de un modelo ni presentarse sin su zona y vigencia.
- **Reanálisis/histórico estimado:** reconstrucción para estudiar el pasado, nunca una medición de estación.

Las coordenadas `-38.625, -68.300` siguen siendo un punto de referencia provisional hasta contrastarlas con una cartografía oficial del casco urbano. Las coordenadas de la estación hidrológica AIC no deben utilizarse como coordenadas meteorológicas del pueblo.

## Límites y controles

- GitHub Pages no ejecuta backend permanente: las tareas programadas corren en GitHub Actions y publican JSON estático.
- El cron de GitHub puede retrasarse; “cada 30 minutos” es una frecuencia objetivo, no garantía de segundo exacto.
- La API puede responder bien y aun así el modelo discrepar con el tiempo real local.
- Una observación regional antigua no se muestra como actual.
- Un error de fuente secundaria no debe borrar la última respuesta principal válida.
- El snapshot debe contener procedencia, hora de recuperación, hora válida, unidades y estado de calidad.
- Open-Meteo exige atribución y su servicio gratuito tiene condiciones de uso; revisar la licencia vigente antes de monetizar el servicio.

## Verificación posterior al despliegue

1. Abrir [la página publicada](https://eliasmartinezcultural-glitch.github.io/OCARINA-CLIMATICA/).
2. Revisar [el workflow de ingestión](https://github.com/eliasmartinezcultural-glitch/OCARINA-CLIMATICA/actions/workflows/climate-ingestion.yml).
3. Revisar [la prueba de navegador](https://github.com/eliasmartinezcultural-glitch/OCARINA-CLIMATICA/actions/workflows/smoke-published-weather.yml).
4. Confirmar que se publicaron `open-meteo.json`, `model-comparison.json`, `source-health.json`, `smn-nearby-stations.json` y `smn-nearby-observations.json`.
5. No declarar el sistema validado hasta que la ejecución programada y la prueba de navegador concluyan con éxito.

## Próxima fase de precisión

- Validar la ubicación urbana exacta.
- Confirmar estaciones reales por catálogo y distancia.
- Incorporar avisos oficiales con estructura y vigencia comprobadas.
- Registrar observaciones versus pronósticos y calcular error absoluto por horizonte de 1, 6, 12, 24 y 48 horas.
- Si no hay estación en el casco urbano, explorar una estación propia calibrada o convenios de datos con instituciones locales.

**Regla de Ocarina:** mostrar lo que se sabe, decir de dónde viene, indicar cuándo es válido y reconocer lo que todavía no se puede afirmar.
