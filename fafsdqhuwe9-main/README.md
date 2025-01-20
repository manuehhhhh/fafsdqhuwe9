# Taller-program-Web
taller de batalla naval
# Objetivo
Se realiza el esquema basico de todas las paginas, con colores, fotos y fondos tentativos.


# Modo Torneo
Por distintas razones, principalmente el tiempo, el funcionamiento del modo Torneo no pudo ser completado. Acá una breve explicación de cómo planeabamos que funcionase:

    -Tenemos un Map() llamado 'Torneos' en donde se almacenarían objetos de tipo 'Torneo'

    -Cada objeto 'Torneo' tendría:
        -nombreJugadores: un array de String con el nombre de cada jugador en el torneo
        -idsRondas: un array con el id de cada una de las partidas en la llave
        -necesitoCrear: un array de booleanos
        -numeroDeRondas: este sería el único dato en el constructor de la clase 'Torneo', se refiere a la cantidad de llaves/rondas necesarias para definir a un ganador.

    -Al inicio de un torneo se crearia un objeto de este tipo, especificando el numero de rondas necesarias para definir a un ganador en base a la cantidad de jugadores, y se almacenaria dentro del Map() 'torneos'.

    -Se generaría un id de 8 digitos automáticamente, el cual sería usado por uno de los jugadores de cada llave para crear una partida a la cual el jugador adversario se uniría (todo esto de forma automática y sin que lo sepa ninguno de los usuarios). Para identificar si es necesario crear una nueva partida se utiliza el array de booleanos 'necesitoCrear'

    -Al terminar las partidas, se eliminarán los nombres de los perdedores del array 'nombreJugadores', se avanzará de ronda y se crearán nuevamente los ids correspondientes. Así sucesivamente hasta que quede solo un jugador

# Server
Debe ejecutar el archivo "server.js" usando Deno. Se creará un servidor local al que el cliente se conectará automáticamente al momento de crear una partida.

# Partida
Para crear una partida solo es necesario insertar un código y el nombre del jugador.

Para unirse una partida es necesario insertar el código de una sala *YA CREADA* y el nombre del jugador.

Para iniciar la partida será necesario que ambos jugadores pongan todas las fichas en su tablero antes de presionar el botón 'Iniciar Juego'

# Console.log()
Esto es un aviso para informar que la mayoría de los console.log() en el programa son avisos usados para pruebas que no deberían estar en la versión final, pero, debido al tiempo, no pudieron ser eliminados del programa.