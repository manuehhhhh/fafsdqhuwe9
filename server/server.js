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
  }
  
  class Jugador{
    nombre;
    piezasrestantes;
    tablero;
    socket;
    constructor(name, socket){
        this.nombre = name;
        this.socket = socket;
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
        tablero[posicionX][posicionY].tipo = 'disparado';
      }
    
    insertarcasilla(posicionX, posicionY, tipo){
      tablero[posicionX, posicionY].tipo = tipo;
    }
  }
  
  class Casilla {
    posX;
    posY;
    tipo;
    constructor(posX, posY, tipo){
        this.posX = posX;
        this.posY = posY;
        this.tipo = tipo;
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
      default:
            mandarMensaje(socket, 'requisito no valido:' + mensaje.type);
  
  }
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