# Herramientas de trabajo recomendadas

La capa pública sigue siendo GitHub Pages + HTML/CSS/JS simple. La complejidad se concentra en ingestión, validación, cartografía y generación de snapshots.

## Datos y automatización
- Python + requests/BeautifulSoup para adaptadores HTTP sencillos.
- GitHub Actions para ingestión programada, validación y publicación de snapshots.
- JSON como formato público de snapshots pequeños y trazables.

## Cartografía y análisis
- QGIS para limpieza, exploración y producción cartográfica.
- Leaflet para mapas web interactivos cuando la capa cartográfica sea necesaria.
- IGN como referencia de capas geoespaciales oficiales.

## Gráficos
- SVG nativo para visualizaciones pequeñas y totalmente controlables.
- Chart.js solo cuando aporte interacción real (zoom, series, tooltips, comparación) y después de validar peso, accesibilidad y licencia.

## Teledetección
- CONAE/SAOCOM y NASA Worldview como capas de observación remota/contexto.
- Nunca se etiqueta una imagen remota como “foto de Chañar” sin identificar sensor, producto y fecha.

## Regla tecnológica
No agregar una librería porque “se vea profesional”. Cada dependencia debe resolver una necesidad concreta, tener mantenimiento razonable, licencia compatible y alternativa de degradación.
