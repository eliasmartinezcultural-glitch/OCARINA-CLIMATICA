# OCARINA CLIMÁTICA · REFORMULACIÓN TRONCAL 2.0

## Decisión arquitectónica
La experiencia pública deja de ser una página larga y pasa a ser una aplicación web estática de navegación por estados.

### Cinco puertas
1. Ahora
2. Viene
3. Archivo
4. Historias
5. Aprender

La complejidad queda detrás del producto: ingestión, snapshots, validación, trazabilidad, evidencia, caché, accesibilidad y evolución de módulos.

## Motor
FUENTES → INGESTORES → SNAPSHOTS → CONTRATOS → VALIDACIÓN → MOTOR DE ESTADO → VISTAS.

## Principios técnicos
- GitHub Pages compatible.
- Sin backend obligatorio.
- Datos desacoplados de la interfaz.
- La interfaz no contiene cifras climáticas inventadas.
- Los snapshots son la unidad pública de intercambio.
- Toda fuente tiene identidad y función.
- Los módulos pueden evolucionar sin reescribir la experiencia.
- Fallback explícito: nunca sustitución silenciosa.
- Mobile-first y teclado desde el diseño.
- Movimiento reducido respetado.
- Acciones táctiles de tamaño adecuado.
- La complejidad no debe convertirse en complejidad de uso.

## Modelo de evidencia
observed · forecast · derived · estimated · documentary · memory.

## Regla de producto
Cada nueva función debe responder qué ayuda a observar, comprender, documentar, recordar o valorar del clima de San Patricio del Chañar.

## Objetivo de interacción
Una persona que entra sin conocimientos meteorológicos debe entender en segundos:
- dónde estamos;
- qué está disponible;
- qué es dato y qué es pronóstico;
- qué puede explorar;
- de dónde sale la información.

## Objetivo técnico
Una persona que inspeccione el repositorio debe poder seguir:
fuente → ingesta → snapshot → validación → interfaz.

## Estándares de referencia
- WMO/GCOS para calidad, continuidad, metadatos, preservación y acceso de datos climáticos.
- W3C WCAG 2.2 para accesibilidad.
- GitHub Pages + GitHub Actions para publicación y automatización.

Esta capa no reemplaza el Estatuto. Lo implementa.
