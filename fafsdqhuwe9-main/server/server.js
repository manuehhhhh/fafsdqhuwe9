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
    constructor(nombreJugador, socket){
        this.jugadores = [];
        this.jugadores.push(new Jugador(nombreJugador, socket));
        this.iniciado = false;
    }
  
    disparar(jugadorAtacado, posicionX, posicionY){
        for (const jugador of this.jugadores){
            if (jugador.nombre = jugadorAtacado){  
                jugador.perderCasilla(posicionX, posicionY);
            }
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
        this.disparar(jugadroAtacado, casillaAtacadaX, casillaAtacadaY);
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
    tablero;
    timeOut;
    socket;
    constructor(name, socket){
        this.nombre = name;
        this.socket = socket;
        this.puntosRestantes  = 1000;
        this.timeOut = 0;
        this.piezasrestantes = [];
  
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
  
    perderCasilla(posicionX, posicionY){
        tablero[posicionY][posicionX].visible = true;
        tablero[posicionY][posicionX].golpeada = true;
      }
    
    insertarBarco(barco){
      this.piezasrestantes.push(barco);
    }
  }
  
  class Casilla {
    posX;
    posY;
    tipo;
    visible;
    golpeada;
    constructor(posX, posY, tipo){
        this.posX = posX;
        this.posY = posY;
        this.tipo = tipo;
        this.visible = false;
        this.golpeada = false;
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
      juegos.get(mensaje.id).insertarNuevoJugador(mensaje.jugador, socket);
      actualizarJuego(mensaje.id);
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
  
  function iniciarJuego(mensaje){
    if (juegos.has(mensaje.id)){
      juegos.get(mensaje.id).iniciado = true;
      actualizarJuego(mensaje.id);
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
