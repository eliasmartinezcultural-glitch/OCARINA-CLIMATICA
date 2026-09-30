# OCARINA CLIMÁTICA · ARQUITECTURA V2

## Contrato
FUENTE → INGESTA → NORMALIZACIÓN → IDENTIDAD → VALIDACIÓN → ARCHIVO → MOTOR → EXPERIENCIA

La interfaz nunca consulta proveedores externos directamente. Los proveedores alimentan archivos normalizados; los motores consumen contratos internos estables.

## Experiencia pública
Exactamente cinco herramientas: AHORA, EXPLORAR, CHAÑAR, HISTORIAS y ESCUELAS. Los módulos internos no crean nuevas herramientas principales.

## Capas
1. Fuentes: SMN, AIC y fuentes documentales.
2. Ingesta: GitHub Actions genera archivos bajo data/live/ y data/archive/.
3. Normalización: cada proveedor se transforma al contrato interno.
4. Identidad: la atribución local requiere estación oficialmente identificada.
5. Validación: existencia, fecha, frescura, procedencia y rangos físicos.
6. Archivo: las series se conservan por período y no se sustituyen silenciosamente por proximidad.
7. Motores: observación, series, agua/hidrología, cronología, multimedia y educación.
8. Experiencia: responsive, teclado, estados de carga, errores recuperables y degradación elegante.

## Reglas contra bucles y errores
- Inicializadores idempotentes.
- Listeners registrados una sola vez.
- Fetch con timeout.
- Sin reintentos infinitos.
- NaN, Infinity y fechas inválidas nunca llegan a la UI.
- Sin fallback geográfico silencioso.
- Archivo histórico con cobertura y procedencia preservadas.
- Contenido editorial escapado antes de HTML dinámico.
- Acciones asíncronas con carga, éxito y fallo.
- Procesos periódicos deduplicados o cancelables.

## Estados
LIVE = dato local validado.
PARTIAL = parte del sistema disponible.
UNAVAILABLE = no existe dato local verificable.
INVALID = dato rechazado por validación.

## Multidispositivo
Mobile-first. La información crítica debe sobrevivir a anchos pequeños, zoom, orientación horizontal, teclado, touch y conexión lenta. El diseño no depende exclusivamente de hover, color o gestos.
