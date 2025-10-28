> Transformaciones propuestas por Robert C. Martin

- {} –> nil: De no haber código a devolver nulo.
- nil -> constant: De nulo a devolver un valor literal.
- constant -> constant+: De un valor literal simple a uno más complejo.
- constant -> scalar: De un valor literal a una variable.
- statement -> statements: Añadir más líneas de código sin condicionales.
- unconditional -> if: Introducir un condicional
- scalar -> array: De variable simple a colección.
- array -> container: De colección a contenedor.
- statement -> recursion: Introducir recursión.
- if -> while: Convertir condicional en bucle.
- expression -> function: Reemplazar expresión con llamada a función.
- variable -> assignment: Mutar el valor de una variable.

# Masterclass - Introducción a Testing Sostenible con TypeScript

# Módulo 1 - Fundamentos de testing

# Módulo 1 - Introducción

# Módulo 1 - Tipos de test

# Módulo 1 - Distribución de los test

# Módulo 1 - Test unitarios

# Módulo 1 - Kata: construir una librería de test

# Módulo 1 - Frameworks de testing

# Módulo 1 - Jest

# Módulo 1 - Testing de funciones puras

# Módulo 2 - Testing Sostenible

# Módulo 2 - Introducción

# Módulo 2 - Kata: camelCase converter

# Módulo 2 - Estructura y denominación

# Módulo 2 - Preparación y agrupación

# Módulo 2 - Refactorizando las pruebas

# Módulo 2 - Aserciones

# Módulo 2 - Fundamentos de mocking

# Módulo 2 - Kata: video surveillance

# Módulo 3 - Fundamentos de TDD

# Modulo 3 - Introducción

# Módulo 3. Kata: string calculator

# Modulo 3. Conceptos básicos

# Módulo 3. Kata: password validator

# Módulo 3. TDD como herramienta de diseño

# Módulo 3. Kata: Filtro CVS

# Módulo 3. Estrategias de implementación I

# Módulo 3. Kata: Fibonacci

# Módulo 3. Estrategias de implementación II

# Módulo 3. Kata: Prime factors

# Módulo 3. Kata: Word wrap

# Módulo 3. Estilos de TDD

Hay principalmente dos estilos:

> Estilo inside-out

- Se le conoce como "escuela clásica" o "escuela de chicago" por ser el favorito de programadores como Ken Beck, Martin Fowler o Robert C Martin.
- Es el que hemos visto hasta ahora en el curso

> Estilo outside-out

- También conocido como "escuela mockista" o "escuela de Londres" porque fué allí donde se popularizó.
- Basado principalmente en el libro "Growinf Object Oriented Software Guided by Test" (GOOS) de Stephen Freeman y Nat. Pryce los creadores de los mock objects.

## Estilo Outsise-in TDD

**Este estilo aborda el diseño del sistema desde el exterior, considerando que en el interior está la implementación de las reglas de negocio**, es decir, se empieza desarrollando por las capas más externas avanzando progresivamente hacia el core. **Cuando empiezas el desarrollo de una funcionalidad** (una historia de usuario, por ejemplo) **aplicando outside-in, debes primero escribir un test de granularidad alta que mira al sistema**, o a los artefactos que intervienen, como una caja negra, **y como hemos hecho hasta ahora, hay que ver el test fallar. La idea es tener una prueba de alto nivel que cubra un requisito de negocio**. Típicamente se suelen escribir test de extremo a extremo, o end-to-end, aunque no tiene porqué ser así, podría tratarse perfectamente de un test de granularidad más baja en el que se involucren diferentes capas del sistema. Emily Bache denomina a estos test como "guiding tests", en castellano sería algo así como "pruebas de guía", mientras que Freeman y Pryce los denominan como "test de aceptación".

**Con los test de extremo a extremo, se busca estimular al sistema desde la interfaz de usuario y validando la respuesta también en la propia interfaz de usuario o bien en el otro extremo del sistema**, que con frecuencia es la base de datos. Aunque nada del sistema existe todavía. Cuando se trata de una aplicación web se pueden usar herramientas como Selenium o Cypress para manipular el navegador programáticamente y una base de datos de pruebas con la misma estructura que la real de producción. **En la medida de lo posible hay que intentar que el entorno sea una réplica del de producción para que el test sea lo más real posible**. Aunque la granularidad del test es la más grande, hay que seguir tratando de buscar feedback rápido y todos los demás beneficios de los test fáciles de mantener, **sobre todo hay que intentar que el test sea corto, claro y certero**. Este trabajo de pensar en test de extremo a extremo con el menor número de líneas posibles te puede ayudar a refinar el análisis del sistema. A menudo sirve para que surjan nuevas dudas sobre el negocio y podamos resolverlas antes de empezar a programar, lo cual es más barato que tener que cambiar el código a posteriori.

El siguiente paso, una vez que el test está escrito y falla, es añadir otro test de un ámbito más reducido que me permita practicar TDD con un componente más pequeño. A diferencia de los ejemplos vistos anteriormente, no se trata de hacer pasar el test grande con el mínimo esfuerzo. Primero porque el paso al verde será demasiado grande, no podremos dar pasos cortos. Y si acaso lo conseguimos, entonces seguramente el código es demasiado irreal como para ayudar a la generalización con los test sucesivos. A este proceso de dejar un test de granularidad alta en rojo mientras vamos aplicando TDD en artefactos más reducidos hasta conseguir que la prueba de alto nivel pase a verde, se le conoce como TDD de doble ciclo, o double loop TDD.

**En el enfoque Outside-in es bastante típico el uso de Mocks, porque se va penetrando en el sistema traajando en artefactos que deben comunicarse con la siguiente capa y esta todavía no existe**. Estos tests con mocks no necesariamente tienen que quedarse ahí después. Cuando implementamos la siguiente capa y tenemos la opción de inyectar el componente real, es perfectamente válido, y a veces deseable, refactorizar los test para reemplazar algunos mocks por sus alternativas reales. Los mocks en estos casos sirven como andamio para poder estudiar el diseño del sistema y progresar en su implementación. Incluso algunos test se pueden borrar cuando ya está todo implementado si la redundancia no compensa el mantenimiento, teniendo en cuenta que hay un test de extremo a extremo que cubre a nivel de seguridad.

## Estilo Inside-in TDD

Una de las principales críticas al estilo outside-in es que podría hacernos incurrir en un diseño más complejo de lo estrictamente necesario. Puesto que se supone de antemano que el sistema va a dividirse en diferentes capas desde fuera hacia adentro, podría ser que añadamos más artefactos de los necesarios. **El enfoque inside-out propone empezar el desarrollo por la capa de negocio y poco a poco agregarle más funcionalidad conforme nos acercamos a los límites del sistema**, utilizando refactoring para partir el código en diferentes artefactos cuando estos adquieren suficiente responsabilidad. La idea es que tanto el tamaño de los artefactos como la cantidad, sea la mínima necesaria para que el sistema funcione en producción.

**En un enfoque inside-out clásico podríamos realizar el proceso de desarrollo sin mocks**, porque cuando se advierte que la pieza A necesita delegar en la pieza B, primero se implementa la pieza B. Cuando se inventó TDD no existía el concepto de objeto mock object, por lo que se dice que este es el enfoque clásico de TDD.

En este módulo empezamos con un enfoque clásico, ya que es el más adecuado para explicar TDD a las personas que empiezan a estudiar la técnica porque no requiere conocer conceptos avanzados como los mocks. Es también el enfoque que recomiendo a quienes quieran empezar a introducir TDD en su día a día, porque encaja bien en proyectos legados que requieren nuevas funcionalidades. Seguramente esos proyectos no tienen una arquitectura testable y no será posible añadir test sin hacer un buen puñado de cambios antes, pero sí que podremos desarrollar nuevos módulos o funciones con TDD cuando no dependan de otras funcionalidades existentes.

**En la práctica recurrimos a esta técnica sobre todo por una cuestión de cadencia de desarrollo**. Y es que cuando nos atascamos con alguna capa más externa, ya sea por dudas en los requisitos no funcionales, o por dudas sobre la tecnología o la estrategia, podemos volver a las reglas de negocio y seguir avanzando en su implementación. **Lo más habitual es combinar las dos técnicas: trabajar desde afuera y también desde adentro**.

## Combinación

Es muy poco probable que podamos diseñar un sistema entero desde afuera utilizando mocks para diseñar la colaboración con las capas internas, porque habrá ocasiones en que nos queden dudas sobre cómo deberían comportarse esas capas internas. En lugar de jugar a la lotería y configurar mocks con comportamientos poco probables, **es preferible bajar al artefacto donde pensamos que debería estar implementado cierto comportamiento y trabajar en él para comprender mejor su responsabilidad** y, a su vez, aprender cómo van a encajar las piezas. Hay veces que no podemos ni estar seguros de la interfaz de un artefacto interno (sus métodos públicos, por ejemplo) hasta que no nos ponemos a programarlo.

**Outside-in es la punta de lanza mientras que inside-out es la lupa que te permite investigar los pequeños detalles**. Es muy típico desarrollar una historia de usuario alternando los dos estilos, trabajando en las dos direcciones hasta que los caminos se encuentran. Aunque hay developers que tienden a usar más un estilo que el otro, **la mayor parte de la comunidad está de acuerdo en que es necesario combinar ambos estilos para un desarrollo eficaz**. Esto es algo que se ha discutido bastante en congresos internacionales y está claro que no hay un estilo ganador.

Para aquellas personas que nos sentimos cómodas dibujando pequeños diagramas de módulos o clases en la pizarra (o en la cabeza) para analizar el diseño antes de empezar el desarrollo, outside-in encaja como un guante. Cuando surge la duda sobre si el diseño será excesivo en cuanto a su complejidad, inside-out resuelve yendo directo al grano.

# Módulo 3: Kata: banking kata
