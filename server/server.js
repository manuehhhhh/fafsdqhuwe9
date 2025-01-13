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
    id;
    jugadores;
    iniciado;
    constructor(id, nombreJugador){
        this.id = id;
        this.jugadores = [];
        this.jugadores.push(new Jugador(nombreJugador));
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
  
  
    insertarNuevoJugador(nombre){
      this.jugadores.push(new Jugador(nombre));
    }
  
    eliminarJugador(nombreEliminado){
      this.jugadores = this.jugadores.filter(nombre !== nombreEliminado);
  }
  }
  
  class Jugador{
    nombre;
    piezasrestantes;
    tablero;
    constructor(name){
        this.nombre = name;
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
  
  let juegos = [];
  juegos.push(new Juego('prueba', 'Manuel'));

  function encontrarIndice(idBuscada){
    let encontrado = false;
    let i = 0;
    while ((encontrado == false)&&(i<(juegos.length))){
      console.log(juegos);
        if (juegos[i].id == idBuscada){
            encontrado = true;
        } else{
          i++;
        }
        
    }
    if (encontrado) {
        return i;
    } else {
        return -1;
    }
  }
  
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
            let indice = encontrarIndice(mensaje.id);
            devolverJuego(socket, indice);
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
    let indice = encontrarIndice(mensaje.id);
    if (indice !== -1){
      mandarMensaje(socket, 'esta id esta siendo usada');
    } else{
      juegos.push(new Juego(mensaje.id, mensaje.jugador));
      indice = encontrarIndice(mensaje.id);
      console.log(indice);
      devolverJuego(socket, indice);
    }
  }
  
  function unirseJuego(socket, mensaje){
    let indice = encontrarIndice(mensaje.id);
    if (indice !== -1){
      juegos[indice].insertarNuevoJugador(mensaje.jugador);
      devolverJuego(socket, indice);
    } else {
      mandarMensaje(socket, 'no existe juego con este id');
    }
  }
  
  function dejarJuego(socket, mensaje){
    let indice = encontrarIndice(mensaje.id);
    if (indice !== -1){
      juegos[indice].eliminarJugador(mensaje.jugador);
      devolverJuego(socket, indice);
    } else {
      mandarMensaje(socket, 'no existe juego con este id');
    }
  }
  
  function iniciarJuego(mensaje){
    let indice = encontrarIndice(mensaje.id);
    if (indice !== -1){
      juegos[indice].iniciado = true;
      devolverJuego(socket, indice);
    } else {
      mandarMensaje(socket, 'no existe juego con este id');
    }
  }
  
  function realizarJugada(socket, mensaje){
    let indice = encontrarIndice(mensaje.id);
    juegos[indice].disparar(mensaje.jugada.jugador, mensaje.jugada.X, mensaje.jugada.Y);
    devolverJuego(socket, indice);
  }
  
  function devolverJuego(socket, id){
    console.log(juegos[id]);
    let devolucion = JSON.stringify(new Mensaje('tablero', 'estado del juego', juegos[id]));
    console.log(devolucion);
    socket.send(devolucion);
  }
  
  function insertarPieza(socket, mensaje){
    let indice = encontrarIndice(mensaje.id);
    juegos[indice].insertarcasilla(mensaje.jugadorAtacado, posicionX, posicionY, mensaje.tipo);
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