# Inventario verificable de fuentes y pruebas — Ocarina Climática

**Fecha de auditoría:** 13 de octubre de 2026  
**Repositorio:** https://github.com/eliasmartinezcultural-glitch/OCARINA-CLIMATICA  
**Sitio:** https://eliasmartinezcultural-glitch.github.io/OCARINA-CLIMATICA/  
**Criterio:** no declarar una estación local ni una integración funcional sin evidencia verificable.

## 1. Estado ejecutivo

- La publicación de GitHub Pages del commit `5287b1965c776db2349a1ff24db0255d0e8fff80` terminó con éxito: https://github.com/eliasmartinezcultural-glitch/OCARINA-CLIMATICA/actions/runs/38478816035
- La prueba estática `qa-static.yml` falló porque `scripts/qa-static.mjs` sigue exigiendo cinco puertas de navegación y un atributo `aria-expanded="false"` de la interfaz anterior. No es una prueba válida para el nuevo diseño simplificado hasta que se actualice el contrato de QA.
- La ingestión general falló en `scripts/ingest_smn_station.py`: el endpoint CKAN configurado devuelve HTTP 404. Por eso no se ejecutaron los pasos posteriores de ingestión y validación. Registro: https://github.com/eliasmartinezcultural-glitch/OCARINA-CLIMATICA/actions/runs/38473991468
- El archivo `data/live/smn-present.json` está en estado `unavailable`; `data/live/smn-hourly.json` no contiene registros.
- El archivo `data/live/aic-el-chanar.json` contiene valores vacíos y una recuperación anterior fechada el 1 de octubre de 2026; no debe presentarse como dato hídrico actual.
- La interfaz actual consulta directamente Open-Meteo desde el navegador. La ejecución exitosa de Pages confirma la publicación, pero no prueba que el navegador haya podido consultar la API ni que el renderizado final funcione. Esa prueba queda pendiente.

## 2. Inventario de estaciones y fuentes

| Fuente / estación | Qué aporta | Ubicación / identidad | Estado comprobado | Decisión |
|---|---|---|---|---|
| SMN — Listado de Estaciones Meteorológicas | Nombre, provincia, latitud, longitud, altitud, número de estación y OACI | Catálogo nacional oficial: https://www.datos.gob.ar/dataset/smn-listado-estaciones-meteorologicas-smn | Dataset confirmado; ingestor actual bloqueado por endpoint 404. No hay confirmación de una estación con coincidencia exacta en San Patricio del Chañar. | Reparar descarga desde la URL de recurso vigente; buscar coincidencias exactas y estaciones cercanas por distancia. |
| SMN — Datos meteorológicos horarios | Observaciones de temperatura, presión, viento y humedad | https://www.datos.gob.ar/dataset/smn-datos-meteorologicos-horarios | Fuente oficial identificada; snapshot del repositorio está vacío y no hay registros horarios validados para la localidad. | No mostrar como dato local hasta verificar estación y fecha de observación. |
| SMN — Estado del Tiempo presente | Última observación publicada por estaciones de la red | Catálogo de datasets SMN: https://datos.gob.ar/dataset?organization=smn | Ingestor preparado, pero depende de identificar estación con evidencia. El flujo general falla antes de llegar a este paso. | Integrar solo si hay estación identificada y observación reciente. |
| Neuquén Aero (SMN) | Referencia observacional oficial regional | Identificador tradicional 87715; coordenadas publicadas en fuentes de estación: aprox. 38.952° S, 68.137° O; https://w2b.smn.gov.ar/oapi/collections/stations/items/0-20000-0-87715?f=html | Estación oficial operacional identificada; está fuera de San Patricio del Chañar (aprox. 39 km de la coordenada de referencia usada por la web). | Puede usarse como referencia regional etiquetada, nunca como observación del pueblo. Confirmar distancia exacta contra el centro urbano antes de publicarla. |
| AIC — Compensador El Chañar | Altura río/lago y caudal medio diario | Coordenadas de estación: -38.599587, -68.389558. Página: https://www.aic.gob.ar/sitio/estaciones-detalle?a=37&z=1840266588 | Estación real identificada. La página pública mostró altura 1,87 m y caudal medio diario 378 m³/s con actualización 13/10/2026 al momento de la consulta; el snapshot local no refleja estos valores y está desactualizado. | Reparar y probar el ingestor. Mantener en sección hídrica separada, no mezclar con temperatura, viento o precipitación. |
| Open-Meteo Forecast API | Condiciones actuales basadas en modelo, pronóstico horario y diario | API: https://open-meteo.com/en/docs | Integración directa encontrada en `index.html`; usa latitud -38.625, longitud -68.300, zona horaria America/Argentina/Cordoba y actualización de interfaz cada 10 minutos. La API real no quedó validada desde un navegador en esta auditoría. | Mantener como motor provisional de pronóstico; verificar coordenadas urbanas y ejecutar prueba HTTP + renderizado. Etiquetar siempre como modelo, no estación local. |
| Open-Meteo Historical Forecast | Archivo de pronósticos pasados para evaluar precisión | https://open-meteo.com/en/docs/historical-forecast-api | Documentación disponible; no hay evaluación de error implementada ni validada. | Fase posterior, una vez que existan observaciones comparables. |
| Windy | Comparación visual de modelos y mapas | https://www.windy.com/-38.625/-68.300 | Recurso visual de consulta, no integración de datos verificada en el repositorio. | Usar como contraste manual, no como fuente primaria automática. |
| EPEA 3 / estación local histórica | Posibles observaciones meteorológicas del área | Pendiente identificar responsable, ubicación instrumental, período, sensores y archivos originales. | Pista de investigación, no estación activa confirmada. | Contactar a la institución y documentar evidencia antes de incorporar. |

### Fuentes oficiales consultadas

- Catálogo SMN en Datos Argentina: https://www.datos.gob.ar/dataset?organization=smn
- Listado de estaciones SMN: https://www.datos.gob.ar/dataset/smn-listado-estaciones-meteorologicas-smn
- Datos meteorológicos horarios SMN: https://www.datos.gob.ar/dataset/smn-datos-meteorologicos-horarios
- Estación AIC Compensador El Chañar: https://www.aic.gob.ar/sitio/estaciones-detalle?a=37&z=1840266588
- Listado de estaciones AIC (incluye coordenadas): https://www.aic.gob.ar/sitio/estaciones
- Estación SMN Neuquén Aero: https://w2b.smn.gov.ar/oapi/collections/stations/items/0-20000-0-87715?f=html
- Open-Meteo: https://open-meteo.com/en/docs

## 3. Problema de coordenadas

La interfaz actual usa `-38.625, -68.300` como referencia del pueblo. La estación AIC Compensador El Chañar se encuentra en `-38.599587, -68.389558`, en una ubicación distinta. Las coordenadas de una estación hidrológica no deben reemplazar las del punto urbano de pronóstico.

**Acción:** verificar el punto urbano que Ocarina desea representar y registrar la fuente de las coordenadas. Mantener por separado:
1. punto de pronóstico del área urbana;
2. cada estación meteorológica con sus propias coordenadas;
3. estación hidrológica AIC.

## 4. Prueba funcional: resultados y límites

### Pruebas completadas con evidencia
- [x] El repositorio contiene una interfaz HTML con actualización manual y automática.
- [x] El workflow de GitHub Pages para el commit actual terminó con éxito.
- [x] Se inspeccionó el JSON de SMN presente: no contiene observaciones.
- [x] Se inspeccionó el JSON de SMN horario: no contiene registros.
- [x] Se inspeccionó el JSON AIC: no está actualizado respecto de la página pública consultada.
- [x] Se inspeccionó el log de ingestión: falla en el endpoint del catálogo de estaciones, HTTP 404.
- [x] Se inspeccionó el log de QA: el test falla por reglas de navegación heredadas que no corresponden al nuevo index.

### Pruebas pendientes
- [ ] HTTP GET al sitio publicado y confirmación de que devuelve el nuevo `index.html`.
- [ ] HTTP GET a Open-Meteo desde un entorno de prueba; verificar código 200, JSON válido, variables, unidades y zona horaria.
- [ ] Prueba de renderizado real en escritorio y móvil: temperatura, sensación térmica, humedad, viento, ráfagas, precipitación, ocho horas y siete días.
- [ ] Probar error de red, respuesta incompleta y botón de actualización.
- [ ] Comprobar que la etiqueta “actualizado” representa la hora de los datos y no solo la hora de consulta.
- [ ] Reparar el endpoint de catálogo SMN y ejecutar manualmente los flujos SMN.
- [ ] Reparar el parser AIC y comprobar que un dato vacío o una página alterada no se etiquete como actualizado.
- [ ] Actualizar QA para validar la interfaz actual en vez de exigir componentes eliminados.

**Limitación de esta auditoría:** el acceso de navegación utilizado aquí no pudo abrir la URL pública ni ejecutar JavaScript en un navegador real. Por eso no se declara aprobada la prueba funcional completa. La confirmación de despliegue es real; la prueba de extremo a extremo todavía no.

## 5. Plan inmediato sin costes

1. **Reparar la fuente de estaciones SMN:** sustituir el endpoint roto por la URL de descarga vigente publicada por el catálogo oficial; validar el ZIP y el esquema de columnas.
2. **Rehacer QA estático para la interfaz actual:** validar IDs requeridos, script, URL de API, variables solicitadas, botón, temporizador y mensajes de error.
3. **Agregar una prueba de humo automatizada:** solicitar el sitio publicado y la API Open-Meteo desde GitHub Actions, validar HTTP, JSON y variables esenciales. No requiere servidor propio.
4. **Corregir AIC:** comparar el parser con el HTML actual y rechazar valores vacíos o datos demasiado antiguos como “actuales”.
5. **Definir la coordenada urbana:** registrar el punto y su fuente antes de comparar estaciones.
6. **Solo después:** decidir si el SMN puede ser la fuente observacional local o si Open-Meteo debe seguir siendo el único motor meteorológico inicial.

## 6. Condición de uso de Open-Meteo

Open-Meteo declara la API gratuita para uso no comercial dentro de sus límites y requiere atribución. Antes de monetizar Ocarina Climática, vender espacios o usar el servicio en una prestación comercial, revisar la licencia vigente: https://open-meteo.com/en/pricing. No asumir que “gratis” significa “gratuito para cualquier uso comercial”.

---

**Criterio de aceptación:** Ocarina Climática no se considera funcionalmente validada hasta que la página publicada, la API y el renderizado pasen pruebas automatizadas y manuales, y cada dato observado tenga estación, hora y procedencia verificadas.
