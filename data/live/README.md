# Registros vivos

Estos archivos son **salidas de ingesta**, no fuentes originales.

Regla: cada registro debe conservar proveedor, dataset, instante de recuperación, cobertura, identidad de estación y calidad. Si una fuente falla, no se fabrican valores ni se reemplaza silenciosamente una estación local por otra cercana.

Archivos principales:
- `smn-present.json`: última observación SMN que coincide con la localidad objetivo.
- `smn-hourly.json`: ventana horaria reciente del SMN.
- `smn-station.json`: verificación de identidad contra el catálogo oficial de estaciones.
- `aic-el-chanar.json`: capa hidrológica observada de AIC; no es meteorología y se muestra separada.
