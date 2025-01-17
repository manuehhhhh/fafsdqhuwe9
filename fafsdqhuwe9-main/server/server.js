// import { Deno } from "https://deno.land/std/http/mod.ts"; 
// import juego from juego.js;
// import jugador from jugador.js;
// import pieza from pieza.js;

// Me rendi tratando de importar XD

class Mensaje{
  type;
  descripcion;
  tablero;
  constructor(tipo, descripcion, juego){
    this.type = tipo;
    this.descripcion = descripcion;
    this.tablero = juego;
  }
}

class Juego{
    jugadores;
    iniciado;
    jugadorActual;
    constructor(nombreJugador, socket){
        this.jugadores = [];
        this.jugadores.push(new Jugador(nombreJugador, socket));
        this.iniciado = false;
        this.jugadorActual = 0;
    }
  
    disparar(jugadorAtacado, posicionX, posicionY){
        for (const jugador of this.jugadores){
            if (jugador.nombre == jugadorAtacado){  
                jugador.perderCasilla(posicionX, posicionY);
            }
        }
        if(this.jugadorActual+1 < this.jugadores.length){
          this.jugadorActual++;
        } else {
          this.jugadorActual = 0;
        }
    }
  
    ponerCasilla(jugadorAtacado, posicionX, posicionY, tipo){
      for (const jugador of this.jugadores){
          if (jugador.nombre == jugadorAtacado){  
              jugador.insertarcasilla(posicionX, posicionY, tipo);
          }
      }
  }
  
  
    insertarNuevoJugador(nombre, socket){
      this.jugadores.push(new Jugador(nombre, socket));
    }
  
    eliminarJugador(nombreEliminado){
      this.jugadores = this.jugadores.filter(nombre !== nombreEliminado);
  }

    devolverJuego(){
      let estado = JSON.stringify(new Mensaje("tablero", "estado del juego", this));
      for (const jugador of this.jugadores){
            jugador.socket.send(estado);
    }
    }

    iniciarJuego(){
      let estado = JSON.stringify(new Mensaje("inicio", "se inicia el juego", this));
      for (const jugador of this.jugadores){
            jugador.establecerVidas();
            jugador.socket.send(estado);
    }
    }


    usarSonar(jugadorAtacado){
      let casillaAtacadaX = Math.random(11)+1;
      let casillaAtacadaY = Math.random(11)+1;
      let indice = devolverIndiceJugador(jugadorAtacado);
      this.jugadores[indice].tablero[posAtacadaY][posAtacadaX].visible = true;
    }

    usarAtaqueAviones(jugadorAtacado){
      let casillaAtacadaX = Math.random(11)+1;
      let casillaAtacadaY = Math.random(11)+1;
      let indice = devolverIndiceJugador(jugadorAtacado);
      for (let i = 0; i < 5; i++){
        this.disparar(jugadorAtacado, casillaAtacadaX, casillaAtacadaY);
        casillaAtacadaX = Math.random(11)+1;
        casillaAtacadaY = Math.random(11)+1;
      }
    }

    usarMisilCrucero(jugadorAtacado, casillaAtacadaX, casillaAtacadaY) {
      let indice = devolverIndiceJugador(jugadorAtacado);
      this.disparar(jugadroAracado, casillaAtacadaX, casillaAtacadaY);
      this.disparar(jugadroAracado, casillaAtacadaX+1, casillaAtacadaY);
      this.disparar(jugadroAracado, casillaAtacadaX-1, casillaAtacadaY);
      this.disparar(jugadroAracado, casillaAtacadaX, casillaAtacadaY+1);
      this.disparar(jugadroAracado, casillaAtacadaX, casillaAtacadaY-1);
      this.disparar(jugadroAracado, casillaAtacadaX+1, casillaAtacadaY+1);
      this.disparar(jugadroAracado, casillaAtacadaX-1, casillaAtacadaY-1);
      this.disparar(jugadroAracado, casillaAtacadaX+1, casillaAtacadaY-1);
      this.disparar(jugadroAracado, casillaAtacadaX-1, casillaAtacadaY+1);
    }

    usarAtaqueEMP(jugadorAtacado){
      let indice = devolverIndiceJugador(jugadorAtacado);
      this.jugadores[indice].timeOut+=3;
    }
  }
  
  class Jugador{
    nombre;
    piezasrestantes;
    puntosRestantes;
    vidasPorPiezas;
    tablero;
    timeOut;
    socket;
    constructor(name, socket){
        this.nombre = name;
        this.socket = socket;
        this.puntosRestantes  = 1000;
        this.timeOut = 0;
        this.piezasrestantes = [];
        this.vidasPorPiezas = [];
  
        let tabla = [];
        let Aux = [];
        let tipo;
        const tamano = 11
        for (let i = 0 ;i<11; i++ ) {
            for (let j = 0; j < 11; j++) {
                if ((i == 0)||(j==0)){
                    tipo = 'guia';
                } else {
                    tipo = 'agua'
                }
                Aux.push(new Casilla(i, j, tipo));
            }
            tabla.push(Aux);
            Aux = [];
        }
        this.tablero = tabla;
    }

    quitarVidaABarco(nombreBarco){
      let i = 0;
      console.log("pongo");
      console.log(this.piezasrestantes);
      console.log(nombreBarco);
      while ( i < this.piezasrestantes.length){
        console.log(i);
        if (this.piezasrestantes[i] == nombreBarco){
          this.vidasPorPiezas[i]--;
          console.log("Vidas de: "+ nombreBarco + this.vidasPorPiezas[i].toString());
          if (this.vidasPorPiezas[i] <= 0){
            console.log("muere " + this.vidasPorPiezas + "  " + this.piezasrestantes[i]);
            this.piezasrestantes.splice(i,1);
            this.vidasPorPiezas.splice(i,1);
          }
        }
        i++;
      }
    } 


  
    perderCasilla(posicionX, posicionY){
      console.log("rapido");
      if (!(this.tablero[posicionX][posicionY].golpeada)){
        console.log(this.tablero[posicionX][posicionY].tipo);
        this.tablero[posicionX][posicionY].visible = true;
        this.tablero[posicionX][posicionY].golpeada = true;
        switch (this.tablero[posicionX][posicionY].grupo){
          case "portaviones":
            this.quitarVidaABarco("portaviones");
            break;
          case "acorazado":
            this.quitarVidaABarco("acorazado");
            break;
          case "crucero":
            this.quitarVidaABarco("crucero");
            break;
          case "submarino":
            this.quitarVidaABarco("submarino");
            break;
          case "destructor":
            this.quitarVidaABarco("destructor");
            break;
        }
      }  
      }
    
    insertarBarco(barco){
      this.piezasrestantes.push(barco);
    }

    establecerVidas(){
      for (const pieza of this.piezasrestantes){
        switch(pieza){
          case "portaviones":
            this.vidasPorPiezas.push(5);
            break;
          case "acorazado":
            this.vidasPorPiezas.push(4);
            break;
          case "crucero":
            this.vidasPorPiezas.push(3);
            break;
          case "submarino":
            this.vidasPorPiezas.push(3);
            break;
          case "destructor":
            this.vidasPorPiezas.push(2);
            break;
        }
      }
    }
  }
  
  class Casilla {
    posX;
    posY;
    tipo;
    visible;
    golpeada;
    grupo;
    orientacion;
    constructor(posX, posY, tipo){
        this.posX = posX;
        this.posY = posY;
        this.tipo = tipo;
        this.visible = false;
        this.golpeada = false;
        this.orientacion = "izq-dere";
        this.grupo = "mar";
    }
  }
  
  let juegos = new Map();

  
  function manejarMensaje(mensaje, socket){
    console.log('Mensaje Recibido');
    switch (mensaje.type) {
      case 'create':
          crearJuego(socket, mensaje);
          break;
      case 'join':
          unirseJuego(socket, mensaje);
          break;
      case 'start':
          iniciarJuego(socket, mensaje);
          break;
      case 'move':
          realizarJugada(socket, mensaje);
          break;
      case 'leave':
          dejarJuego(socket, mensaje);
          break;
      case 'insertar':
          insertarPieza(socket, mensaje);
          break;
      case 'pedir':
            actualizarJuego(mensaje.id);
            break;
      case 'establecerTablero':
            establecerTablero(socket, mensaje);
            break;
      case "disparar":
            dispararCasilla(socket, mensaje);
            break;
      default:
            mandarMensaje(socket, 'requisito no valido:' + mensaje.type);
  
  }
  }


  function powerUp(mensaje, socket){
    switch (mensaje.jugada.powerUp) {
      case 'avionesDeAtaque':
          // crearJuego(socket, mensaje);
          break;
      case 'minaMarina':
          // unirseJuego(socket, mensaje);
          break;
      case 'escudoDefensivo':
          iniciarJuego(socket, mensaje);
          break;
      case 'misilCrucero':
          realizarJugada(socket, mensaje);
          break;
      case 'regeneracionRapida':
          dejarJuego(socket, mensaje);
          break;
      case 'ataqueEMP':
          insertarPieza(socket, mensaje);
          break;
      case 'sonar':
            actualizarJuego(mensaje.id);
            break;
      default:
            mandarMensaje(socket, 'requisito no valido:' + mensaje.type);
  }
}

  function devolverIndiceJugador(id, nombre){
    let j = 0;
    let longitud = juegos.get(id).jugadores.length;
    console.log(longitud);
    while (j < longitud){
      console.log(j);
      console.log("hu");
      console.log(juegos.get(id).jugadores[j].nombre);
      console.log(nombre);
      console.log("hu");
      if (juegos.get(id).jugadores[j].nombre == nombre){
        return j;
      }
      j++;
    }
    return -1;
  }

  function establecerTablero(socket, mensaje){
      let indice = devolverIndiceJugador(mensaje.id, mensaje.jugador);
      if (juegos.get(mensaje.id).jugadores[indice].piezasrestantes.includes(mensaje.pieza)){
        console.log("mensaje mandado");
        mandarMensaje(socket, "esta pieza ya se puso");
      } else{
        if (indice == -1){
          console.log("ejrkjf");
        } else{
          console.log(mensaje.jugada.tablero);
          juegos.get(mensaje.id).jugadores[indice].tablero = mensaje.jugada.tablero;
          juegos.get(mensaje.id).jugadores[indice].insertarBarco(mensaje.pieza);
        }
        
      }
      actualizarJuego(mensaje.id);
  }

  function mandarMensaje(socket, mensaje){
    console.log(mensaje);
    socket.send(JSON.stringify(new Mensaje('error', mensaje, {})));
  }
  
  function crearJuego(socket, mensaje){
    if (!(juegos.has(mensaje.id))){
      juegos.set(mensaje.id, new Juego(mensaje.jugador, socket));
      actualizarJuego(mensaje.id);
    } else{
      mandarMensaje(socket, 'esta id esta siendo usada');
    }
  }
  
  function unirseJuego(socket, mensaje){
    if (juegos.has(mensaje.id)){
      if(juegos.get(mensaje.id).iniciado){
        mandarMensaje(socket, 'no existe juego ya fue iniciado');
      } else {
        juegos.get(mensaje.id).insertarNuevoJugador(mensaje.jugador, socket);
        actualizarJuego(mensaje.id);
      }
    } else {
      mandarMensaje(socket, 'no existe juego con este id');
    }
  }
  
  function dejarJuego(socket, mensaje){
    if (juegos.has(mensaje.id)){
      juegos.get(mensaje.id).eliminarJugador(mensaje.jugador);
      actualizarJuego(mensaje.id);
    } else {
      mandarMensaje(socket, 'no existe juego con este id');
    }
  }
  
  function iniciarJuego(socket, mensaje){
    let todosLosJugadoresTienenTodasLasPiezas = true;
    let longitud;
    for (const jugador of juegos.get(mensaje.id).jugadores){
      console.log(jugador.piezasrestantes.length);
      todosLosJugadoresTienenTodasLasPiezas =  todosLosJugadoresTienenTodasLasPiezas && (jugador.piezasrestantes.length == 5);
    }
    if (juegos.has(mensaje.id) && todosLosJugadoresTienenTodasLasPiezas){
      juegos.get(mensaje.id).iniciado = true;
      actualizarJuego(mensaje.id);
      juegos.get(mensaje.id).iniciarJuego();
      juegos.get
    } else {
      mandarMensaje(socket, 'no existe juego con este id');
    }
  }
  
  function realizarJugada(socket, mensaje){
    juegos.get(mensaje.id).disparar(mensaje.jugada.jugador, mensaje.jugada.X, mensaje.jugada.Y);
    devolverJuego(socket, indice);
  }
  
  function actualizarJuego(id){
    juegos.get(id).devolverJuego();
  }

  function dispararCasilla(socket, mensaje){
    console.log("disparo piu piu");
    console.log(juegos.get(mensaje.id).jugadorActual);
      if( (juegos.has(mensaje.id)) && (juegos.get(mensaje.id).jugadores[juegos.get(mensaje.id).jugadorActual].nombre) == mensaje.jugador){
        juegos.get(mensaje.id).disparar(mensaje.jugada.jugadorAfectado, mensaje.jugada.X, mensaje.jugada.Y);
        actualizarJuego(mensaje.id);
      } else {
        mandarMensaje(socket, 'no es tu turno >:(');
      }
  }


  
  function insertarPieza(socket, mensaje){
    juegos.get(mensaje.id).insertarcasilla(mensaje.jugadorAtacado, posicionX, posicionY, mensaje.tipo);
  }

  
  Deno.serve(async (req) => {
  
    if (req.headers.get("upgrade") !== "websocket") {
  
      return new Response("Not a WebSocket request", { status: 400 });
  
    }
  
  
  
    const { socket, response } = Deno.upgradeWebSocket(req); 

    // Handle WebSocket events
  
    socket.onopen = () => console.log("Client connected");
  
    socket.onmessage = (event) => manejarMensaje(JSON.parse(event.data), socket);
  
    socket.onclose = () => console.log("Client disconnected");
  
  
  
    return response; 
  
  }); 
  
  
  
  console.log("Listening on http://localhost:8000");
