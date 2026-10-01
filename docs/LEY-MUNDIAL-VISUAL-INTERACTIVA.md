# LEY MUNDIAL DE EXPERIENCIA VISUAL, INTERACTIVA Y MULTIDISPOSITIVO
## OCARINA CLIMÁTICA · V1.0 · BLOQUEADA

**Estado:** LEY DE DISEÑO Y EXPERIENCIA — BLOQUEADA  
**Base:** PL1 + V3.17  
**Aplicación:** todas las capas futuras de Ocarina Climática  
**Regla:** se suma capacidad; no se rompe la simplicidad.

## 1. Principio supremo

Ocarina Climática debe poder ser tecnológicamente profunda sin parecer tecnológicamente complicada.

La interfaz pública tendrá pocas puertas, decisiones claras, respuesta inmediata y una experiencia visual viva. La complejidad pertenece al motor, no al usuario.

**Mucha estructura detrás. Muy poca fricción delante.**

## 2. Multidispositivo no es adaptación: es diseño de origen

La experiencia se diseña simultáneamente para:
- teléfono pequeño y grande;
- tablet;
- notebook;
- escritorio;
- pantallas táctiles;
- mouse y trackpad;
- teclado;
- lápiz/stylus cuando exista;
- distintos niveles de conexión y rendimiento.

Ningún dispositivo será tratado como una versión secundaria.

No se aceptan:
- funciones exclusivas de desktop sin alternativa;
- interacciones dependientes exclusivamente de hover;
- controles diminutos;
- contenido que requiera zoom horizontal;
- layouts que oculten información crítica;
- modales o barras fijas que tapen el foco.

La interacción primaria utilizará un modelo de entrada compatible con mouse, touch, stylus y otros punteros mediante capacidades web estándar.

## 3. Salto visual

La evolución visual debe ser grande, pero nunca ornamental.

Cada pantalla futura debe responder visualmente a cuatro preguntas:
1. ¿Dónde estoy?
2. ¿Qué está pasando?
3. ¿Qué puedo tocar/explorar?
4. ¿Qué aprendí o descubrí?

Se priorizan:
- jerarquía visual fuerte;
- mapas, capas, líneas temporales y tarjetas explorables;
- microinteracciones con propósito;
- estados vivos;
- transiciones cortas y comprensibles;
- visualización de datos local;
- fotografía y multimedia con procedencia;
- profundidad espacial cuando ayude a comprender;
- composición responsive;
- movimiento respetuoso y desactivable.

No se acepta “efecto por efecto”.

## 4. Interacción por descubrimiento

La interfaz debe invitar a explorar sin exigir aprendizaje previo.

Patrones permitidos:
- tocar para ampliar;
- deslizar cuando exista una secuencia real;
- explorar mapas;
- recorrer cronologías;
- comparar períodos;
- abrir capas de evidencia;
- revelar detalles bajo demanda;
- filtrar sin perder contexto;
- volver siempre con claridad al punto anterior.

Toda interacción avanzada debe tener una ruta simple equivalente.

## 5. Regla de una mano

En móvil, las acciones frecuentes deben ser alcanzables y distinguibles con una mano.

Los objetivos táctiles no serán menores que los mínimos establecidos por WCAG 2.2; como estándar interno, se favorecerán áreas mayores cuando el contexto lo permita.

Los controles cercanos deben evitar activaciones accidentales.

## 6. Accesibilidad como arquitectura

La accesibilidad no será una auditoría posterior.

Es parte del sistema visual desde el primer componente:
- foco visible;
- orden lógico de foco;
- foco no oculto por elementos fijos;
- navegación por teclado;
- contraste suficiente;
- estados interactivos distinguibles;
- alternativas a hover;
- respeto de reduced motion;
- etiquetas y nombres accesibles;
- contenido legible sin depender exclusivamente del color;
- interacción operable con distintos dispositivos de entrada.

El objetivo interno será superar el mínimo legal/técnico cuando sea razonable, sin convertir la experiencia en una interfaz pesada.

## 7. Movimiento

El movimiento comunica estado, continuidad, orientación o causa/efecto.

Nunca debe:
- bloquear una tarea;
- retrasar una acción simple;
- ocultar información;
- producir mareo innecesario;
- reemplazar una explicación;
- impedir navegación rápida.

Toda animación relevante tendrá una alternativa estática o respetará las preferencias del sistema.

## 8. Arquitectura visual por capas

Cada componente interactivo deberá poder existir como:

**ESTADO → ACCIÓN → RESPUESTA → EVIDENCIA → RETORNO**

Ejemplo:
un fenómeno climático → el usuario lo toca → aparece información → se muestra su fuente/estado → el usuario vuelve al recorrido.

La trazabilidad nunca se sacrificará por espectacularidad.

## 9. Datos visualizados con honestidad

Una visualización debe conservar:
- localidad;
- fecha/hora;
- unidad;
- fuente;
- tipo de evidencia;
- estado de calidad;
- naturaleza del dato.

Observado, pronóstico, derivado, estimado, documental y memoria no se mezclarán visualmente sin identificación.

## 10. Rendimiento

La espectacularidad no justifica lentitud.

Prioridades:
1. contenido esencial;
2. interacción principal;
3. legibilidad;
4. multimedia;
5. efectos.

Se aplicará carga progresiva, imágenes adecuadas, JavaScript modular y degradación elegante cuando un dispositivo no pueda sostener una experiencia avanzada.

## 11. Diseño adaptativo, no simplemente responsive

No se reducirá una interfaz desktop hasta convertirla en móvil.

Cada escala podrá cambiar:
- composición;
- densidad;
- navegación;
- tamaño de controles;
- cantidad de información simultánea;
- modo de visualización.

La identidad permanece; la composición se adapta.

## 12. Regla de simplicidad

El usuario no debe necesitar conocer:
- APIs;
- estaciones;
- pipelines;
- JSON;
- GitHub;
- modelos;
- sensores;
- bases de datos;
- arquitectura interna.

Debe poder simplemente:

**MIRAR → TOCAR → EXPLORAR → ENTENDER → RECORDAR → VOLVER.**

## 13. Regla de no regresión

Una nueva capacidad no puede:
- romper PL1;
- eliminar una puerta existente;
- degradar navegación;
- empeorar accesibilidad;
- ocultar trazabilidad;
- aumentar complejidad sin beneficio claro;
- crear una función sin estado de error;
- depender de una única modalidad de entrada.

## 14. Bloqueo

Esta ley queda congelada como contrato de producto.

Las futuras versiones pueden:
- agregar;
- enriquecer;
- optimizar;
- mejorar;
- reemplazar internamente una implementación cuando exista compatibilidad funcional.

No pueden violar los principios de esta ley sin una nueva revisión formal del contrato.

## 15. Criterio de aceptación transversal

Una nueva función visual/interactiva sólo entra al producto si demuestra:

**UTILIDAD + CLARIDAD + MULTIDISPOSITIVO + ACCESIBILIDAD + RENDIMIENTO + TRAZABILIDAD + REVERSIBILIDAD**

Si falla una dimensión crítica, queda fuera o en estado experimental.

## 16. Referencias técnicas

Esta ley toma como referencia técnica las WCAG 2.2 y estándares web actuales, especialmente foco visible/no oculto, tamaño de objetivos y comportamiento predecible de contenido interactivo. La implementación de punteros debe considerar un modelo unificado para mouse, touch y stylus.

**Esta ley es un contrato interno del proyecto. No sustituye normas legales ni estándares regulatorios externos.**
