# AGENTS.md — CheckMate

## Idioma y comunicación

* Responde SIEMPRE en español.
* Sé breve, directo y conciso.
* Evita explicaciones largas si no son necesarias.
* No repitas información que ya fue proporcionada.
* No generes documentación extensa a menos que se solicite.
* Prioriza respuestas accionables sobre explicaciones teóricas.
* Al realizar cambios, explica únicamente:

  1. Qué se modificó.
  2. En qué archivo.
  3. Si existe algún paso adicional necesario.
* Evita resúmenes largos después de completar una tarea.

## Proyecto

Nombre: CheckMate

Stack principal:

* React Native
* Expo
* TypeScript

CheckMate es una aplicación móvil para el chequeo y gestión de estudiantes.

Actualmente el proyecto se encuentra en fase de desarrollo del frontend.

Prioridades actuales:

* Construir las interfaces.
* Replicar fielmente los diseños proporcionados.
* Implementar navegación.
* Crear componentes reutilizables.
* Utilizar datos mock cuando sea necesario.
* Preparar la arquitectura para una futura conexión con API.

No implementar ni asumir endpoints de backend hasta que sean proporcionados.

## Buenas prácticas

* Utiliza TypeScript.
* Mantén el código limpio, legible y modular.
* Evita archivos excesivamente grandes.
* Divide la interfaz en componentes reutilizables cuando tenga sentido.
* Evita duplicar código.
* Usa nombres descriptivos para variables, funciones, componentes y archivos.
* Elimina imports, variables y código que no se utilicen.
* Mantén una estructura de carpetas organizada y escalable.
* Respeta la arquitectura existente del proyecto antes de crear nuevas estructuras.
* No agregues dependencias innecesarias.
* Antes de instalar una librería, verifica si la funcionalidad puede resolverse con las herramientas existentes.

## React Native y Expo

* Utiliza componentes compatibles con React Native y Expo.
* Evita APIs exclusivas de la web como `div`, `span`, `window` o `document`.
* Usa `View`, `Text`, `Pressable`, `Image`, `ScrollView`, `FlatList`, etc.
* Considera siempre compatibilidad con Android e iOS.
* Respeta Safe Areas.
* Considera diferentes tamaños de pantalla.
* Evita dimensiones fijas cuando puedan causar problemas de responsividad.
* Optimiza listas grandes utilizando `FlatList` cuando corresponda.
* Evita renders innecesarios.
* Mantén la lógica separada de la presentación cuando sea posible.

## Diseño y UI

Cuando se proporcione una imagen o diseño de referencia:

* Analiza el diseño antes de programar.
* Replica la interfaz con la mayor fidelidad posible.
* Respeta espaciados, tamaños, jerarquía visual y distribución.
* Crea componentes reutilizables para elementos repetidos.
* Mantén consistencia visual entre pantallas.
* No inventes elementos visuales que no aparecen en el diseño sin autorización.

## Estructura

Antes de crear archivos:

* Revisa la estructura actual del proyecto.
* Coloca cada archivo en la ubicación correspondiente.
* No reorganices todo el proyecto sin autorización.
* No crees archivos duplicados o innecesarios.

Cuando sea conveniente, utiliza una estructura similar a:

src/
components/
screens/
navigation/
hooks/
services/
utils/
types/
constants/
assets/

Adapta esta estructura al proyecto existente en lugar de imponerla.

## Cambios en el código

Antes de modificar código:

* Lee los archivos relacionados.
* Comprende cómo funciona la implementación actual.
* Realiza únicamente los cambios necesarios para completar la tarea.
* Evita modificar código que no esté relacionado con la solicitud.
* No elimines funcionalidades existentes sin autorización.

Después de realizar cambios:

* Verifica errores de TypeScript.
* Verifica imports.
* Verifica que el proyecto pueda compilar.
* Corrige errores causados por tus propios cambios.

## Uso eficiente de tokens

* Mantén las respuestas cortas.
* No muestres archivos completos si solo cambiaste unas líneas.
* No pegues grandes bloques de código en el chat si los cambios ya fueron aplicados directamente.
* No expliques cada línea de código.
* No repitas el código implementado en el resumen.
* Evita planes extensos para tareas simples.
* Ejecuta la tarea directamente cuando la solicitud sea clara.
* Haz preguntas únicamente cuando falte información indispensable.

## Formato de respuesta

Al terminar una tarea, responde preferentemente con:

"Listo. Se modificó:

* `archivo`: cambio realizado.

No se requieren pasos adicionales."

Si existe un comando necesario:

"Listo. Se modificó:

* `archivo`: cambio realizado.

Ejecuta:
`comando`"

Mantén este formato breve siempre que sea posible.

## Regla principal

Prioriza siempre:

1. Código funcional.
2. Buenas prácticas.
3. Simplicidad.
4. Mantenibilidad.
5. Compatibilidad con Expo.
6. Fidelidad al diseño.
7. Uso eficiente de tokens.

No sobreingenierices soluciones simples.
