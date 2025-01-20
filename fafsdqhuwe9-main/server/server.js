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
    cantidadJugadores;
    constructor(nombreJugador, socket){
        this.jugadores = [];
        this.jugadores.push(new Jugador(nombreJugador, socket));
        this.iniciado = false;
        this.jugadorActual = 0;
        this.cantidadJugadores = 0;
    }
  
    disparar(id, jugadorAtacado, posicionX, posicionY){
      console.log("dfjajf");
        for (const jugador of this.jugadores){
            console.log("po");
            console.log(jugador.nombre);
            console.log(jugadorAtacado);
            if (jugador.nombre == jugadorAtacado){  
                console.log("encontramo");
                jugador.perderCasilla(posicionX, posicionY);
                console.log("eeeeeeeeeeeeeeee");
                console.log(jugador.piezasrestantes);
                if (jugador.piezasrestantes.length == 0){
                  console.log("djhaquiiiiiiiiifajk");
                  this.eliminarJugador(id, jugadorAtacado);
                  this.jugadorActual--;
                }
            }
        }


        if(this.jugadorActual+1 < this.jugadores.length){
          this.jugadorActual++;
        } else {
          this.jugadorActual = 0;
        }
        if (this.jugadores[this.jugadorActual].timeOut > 1){
          this.jugadores[this.jugadorActual].timeOut--;
          this.jugadorActual = (this.jugadorActual+1 < this.jugadores.length)? this.jugadorActual+=1: 0;
          console.log(this.jugadores[this.jugadorActual].timeOut);
          console.log("jijijaja");
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
      this.cantidadJugadores++;
    }
  
    eliminarJugador(id, nombreEliminado){
      let indice = devolverIndiceJugador(id, nombreEliminado);
      this.jugadores = this.jugadores.slice(indice, 1);
      console.log("kdjhfakjsdhiudsahnfjuidsh");
      this.devolverEliminacion(nombreEliminado);
  }

    devolverJuego(){
      let estado = JSON.stringify(new Mensaje("tablero", "estado del juego", this));
      for (const jugador of this.jugadores){
            jugador.socket.send(estado);
    }
    }

    devolverEliminacion(eliminado){
      console.log("dkljaklj");
      let estado = JSON.stringify(new Mensaje("eliminacion", "estado del juego", "el jugador " + eliminado + " ha sido eliminado"));
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


    usarSonar(id, jugadorAtacado){
      let golpeamos = true;
      let indice;
      let casillaAtacadaX = Math.floor(Math.random()*10);
      let casillaAtacadaY =  Math.floor(Math.random()*10);
      while (golpeamos){
        console.log("Jugador atacado: "+ jugadorAtacado);
        indice = devolverIndiceJugador(id, jugadorAtacado);
        console.log(casillaAtacadaY.toString() + "-" + casillaAtacadaX.toString());
        if(this.jugadores[indice].tablero[casillaAtacadaY][casillaAtacadaX].grupo !== "mar"){
          this.jugadores[indice].tablero[casillaAtacadaY][casillaAtacadaX].visible = true;
          golpeamos = false;
          console.log(casillaAtacadaY.toString + "-" + casillaAtacadaX.toString());
        }
        if (casillaAtacadaX <= 9){
          casillaAtacadaX++;
        } else {
          casillaAtacadaX = 1;
          if (casillaAtacadaY <= 9){
            casillaAtacadaY++;
          } else {
            casillaAtacadaY = 1;
          }
        }

      }
    }

    usarAtaqueAviones(id, jugadorAtacado){
      let casillaAtacadaXA = Math.floor(Math.random()*10);
      let casillaAtacadaYA =  Math.floor(Math.random()*10);
      console.log(jugadorAtacado);
      // console.log(this.jugadores);
      let indice = devolverIndiceJugador(id, jugadorAtacado);
      console.log("a");
      for (let i = 0; i < 5; i++){
        this.disparar(id, jugadorAtacado, casillaAtacadaXA, casillaAtacadaYA);
        casillaAtacadaXA = Math.floor(Math.random()*10);
        casillaAtacadaYA = Math.floor(Math.random()*10);
      }
    }

    usarMisilCrucero(id, jugadorAtacado, casillaAtacadaX, casillaAtacadaY) {
      console.log(typeof casillaAtacadaX);
      console.log ("piu piu pero mas");
      this.disparar(id, jugadorAtacado, casillaAtacadaX, casillaAtacadaY);
      console.log ("piu piu pero mas");
      this.disparar(id, jugadorAtacado, casillaAtacadaX+1, casillaAtacadaY);
      console.log ("piu piu pero mas");
      this.disparar(id, jugadorAtacado, casillaAtacadaX-1, casillaAtacadaY);
      console.log ("piu piu pero mas");
      this.disparar(id, jugadorAtacado, casillaAtacadaX, casillaAtacadaY+1);
      console.log ("piu piu pero mas");
      this.disparar(id, jugadorAtacado, casillaAtacadaX, casillaAtacadaY-1);
      console.log ("piu piu pero mas");
      this.disparar(id, jugadorAtacado, casillaAtacadaX+1, casillaAtacadaY+1);
      this.disparar(id, jugadorAtacado, casillaAtacadaX-1, casillaAtacadaY-1);
      this.disparar(id, jugadorAtacado, casillaAtacadaX+1, casillaAtacadaY-1);
      this.disparar(id, jugadorAtacado, casillaAtacadaX-1, casillaAtacadaY+1);
    }

    usarAtaqueEMP(id, jugadorAtacado){
      let indice = devolverIndiceJugador(id, jugadorAtacado);
      this.jugadores[indice].timeOut+=3;
      console.log(this.jugadores[indice].timeOut);
    }

    usarRegeneracionRapida(jugadorUsado, posX, posY){
      let indice = devolverIndiceJugador(jugadorAtacado);
      this.jugadores[indice].restaurarVida(jugadorUsado);
    }

    usarEscudoDefensivo(id, jugadorUsado, posX, posY){
      let indice = devolverIndiceJugador(id, jugadorUsado);
      this.jugadores[indice].establecerEscudo(posX, posY);

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
      console.log(posicionX);
      console.log(posicionY);
      if (!(this.tablero[posicionX][posicionY].golpeada) && (this.tablero[posicionX][posicionY].escudos <= 0)){
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
      } else {
        this.tablero[posicionX][posicionY].escudos--;
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

    restaurarVida(posX, posY){
      let orientacion = this.tablero[posX][posY].orientacion;
      if ( (orientacion == "iqz-dere") || (orientacion == "dere-izq") ){
        this.tablerotablero[posX][posY].golpeada = false;
        if (posx + 1 <= 11){
          let i = (this.tablerotablero[posX+1][posY].grupo == "mar")? -1: 1;
          this.tablerotablero[posX+i][posY].golepada == false;
        }
      } else if ( (orientacion == "arr-abj") || (orientacion == "abj-arr") ){
        this.tablerotablero[posX][posY].golpeada = false;
        if (posy + 1 <= 11){
          let i = (this.tablerotablero[posX][posY+1].grupo == "mar")? -1: 1;
          this.tablerotablero[posX][posY+i].golepada == false;
        }
      }
    }

    establecerEscudo(posX, posY){
      console.log("casilla leida");
      console.log(posX.toString() + "-" + posY.toString());
      this.tablero[posX][posY].escudos+= 3;
      // this.tablero[posX+1][posY].escudos+= 3;
      this.tablero[posX][posY+1].escudos+= 3;
      this.tablero[posX+1][posY+1].escudos+= 3;
      this.tablero[posX-1][posY].escudos+= 3;
      this.tablero[posX][posY-1].escudos+= 3;
      this.tablero[posX-1][posY-1].escudos+= 3;
      this.tablero[posX+1][posY-1].escudos+= 3;
      this.tablero[posX-1][posY+1].escudos+= 3;
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
    escudos;
    constructor(posX, posY, tipo){
        this.posX = posX;
        this.posY = posY;
        this.tipo = tipo;
        this.visible = false;
        this.golpeada = false;
        this.escudos = 0;
        this.orientacion = "izq-dere";
        this.grupo = "mar";
    }
  }
  
  let juegos = new Map();
  let torneos = new Map();

  class Torneo{
    nombreJugadores;
    idsRondas;
    necesitoCrear;
    numeroDeRondas;
    constructor(numeroDeRondas){
      this.nombreJugadores = [];
      this.idsRondas = [];
      this.necesitoCrear = [];
      for (let i = 0; i < numeroDeRondas; i++){
        this.nombreJugadores.push([]);
        this.idsRondas.push([]);
        this.necesitoCrear.push(true);
      }
      this.numeroDeRondas = numeroDeRondas;
    }

    registrarPartidaNuevaEnRonda(nombre, id, ronda){
      this.idsRondas[(ronda-1)].push(id);
      this.necesitoCrear[(ronda-1)] = false;
    }

    regresarPartidaDisponibleEnRonda(ronda){
      this.necesitoCrear[(ronda-1)] = true;
      return this.idsRondas[(ronda-1)][this.idsRondas.length];
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
            actualizarJuego(mensaje.id);
            break;
      case 'establecerTablero':
            establecerTablero(socket, mensaje);
            break;
      case "disparar":
            dispararCasilla(socket, mensaje);
            break;
      case "sonar":
            realizarSonar(socket, mensaje);
            break;
      case "avionesDeAtaque":
            realizarAvionesDeAtaque(socket, mensaje);
            break;
      case "minaMarina":
            console.log("tipo, honestamente? este no lo quiero hacer");
            break;
      case "escudoDefensivo":
            realizarEscudoDefensivo(socket, mensaje);
            break;
      case "misilCrucero":
            realizarMisilCrucero(socket, mensaje);
            break;
      case "reparacionRapida":
            realizarRegeneracionRapida(socket, mensaje);
            break;
      case "emp":
            realizarEMP(socket, mensaje);
            break;
      case "crearTorneo":
            crearTorneo(socket, mensaje);
            break;
      case "unirmeSiguienteRonda":
            unirmeSiguienteRonda(socket, mensaje);
            break;
      default:
            mandarMensaje(socket, 'requisito no valido:' + mensaje.type);
  }
  }

  function generateGameId() {
    let idAleatorio = Math.random().toString(36).substring(2, 10)
    while ((juegos.has(idAleatorio))){
      idAleatorio = Math.random().toString(36).substring(2, 10)
    }
    return idAleatorio;
  }

  function crearTorneo(socket, mensaje){
    torneos.set(mensaje.torneo.idTorneo, new Torneo(mensaje.torneo.numeroDeRondas));
    let idAleatorio = generateGameId();
    crearJuegoIdAleatorio(socket, mensaje, idAleatorio);
    socket.send(JSON.stringify({type:"entregaId", id:idAleatorio}));
    torneos.get(mensaje.torneo.idTorneo).registrarPartidaNuevaEnRonda(mensaje.jugador, idAleatorio, mensaje.torneo.ronda);
  }

  function unirmeSiguienteRonda(socket, mensaje){
    let partidaId = '';
    if (torneos.get(mensaje.torneo.idTorneo)[mensaje.torneo.ronda].necesitoCrear){
      let idAleatorio = generateGameId();
      crearJuegoIdAleatorio(socket, mensaje, idAleatorio);
      socket.send(JSON.stringify({type:"entregaId", id:idAleatorio}));
      torneos.get(mensaje.torneo.idTorneo).registrarPartidaNuevaEnRonda(mensaje.jugador, idAleatorio, mensaje.torneo.ronda);
    } else {
      partidaId = torneos.get(mensaje.torneo.idTorneo).regresarPartidaDisponible(mensaje.torneo.ronda);
      juegos.get(partidaId).insertarNuevoJugador(mensaje.jugador, socket);
      socket.send(JSON.stringify({type:"entregaId", id:partidaId}));
      actualizarJuego(partidaId);
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

  function crearJuegoIdAleatorio(socket, mensaje, idAleatorio){
      juegos.set(idAleatorio, new Juego(mensaje.jugador, socket));
      actualizarJuego(idAleatorio);
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
    juegos.get(mensaje.id).disparar(mensaje.id, mensaje.jugada.jugador, mensaje.jugada.X, mensaje.jugada.Y);
    devolverJuego(socket, indice);
  }
  
  function actualizarJuego(id){
    juegos.get(id).devolverJuego();
  }

  function dispararCasilla(socket, mensaje){
    console.log("disparo piu piu");
    console.log(juegos.get(mensaje.id).jugadorActual);
      if( (juegos.has(mensaje.id)) && (juegos.get(mensaje.id).jugadores[juegos.get(mensaje.id).jugadorActual].nombre) == mensaje.jugador){
        juegos.get(mensaje.id).disparar(mensaje.id, mensaje.jugada.jugadorAfectado, mensaje.jugada.X, mensaje.jugada.Y);
        actualizarJuego(mensaje.id);
      } else {
        mandarMensaje(socket, 'no es tu turno >:(');
      }
  }

  function realizarSonar(socket, mensaje){
    console.log("sonar bzzzzz te encuentro");
    if((juegos.has(mensaje.id)) && (juegos.get(mensaje.id).jugadores[juegos.get(mensaje.id).jugadorActual].nombre) == mensaje.jugador){
      console.log("djhfak");
      console.log(mensaje.jugada.jugadorAfectado);
      juegos.get(mensaje.id).usarSonar(mensaje.id, mensaje.jugada.jugadorAfectado);
      actualizarJuego(mensaje.id);
    } else {
      mandarMensaje(socket, 'no es tu turno >:(');
    }
}
  function realizarAvionesDeAtaque(socket, mensaje){
    console.log("avion piu");
    if((juegos.has(mensaje.id)) && (juegos.get(mensaje.id).jugadores[juegos.get(mensaje.id).jugadorActual].nombre) == mensaje.jugador){
      console.log("1987");
      juegos.get(mensaje.id).usarAtaqueAviones(mensaje.id, mensaje.jugada.jugadorAfectado);
      actualizarJuego(mensaje.id);
    } else {
      mandarMensaje(socket, 'no es tu turno >:(');
    }
  }


  function realizarEscudoDefensivo(socket, mensaje){
    console.log("definedo");
    if((juegos.has(mensaje.id)) && (juegos.get(mensaje.id).jugadores[juegos.get(mensaje.id).jugadorActual].nombre) == mensaje.jugador){
      juegos.get(mensaje.id).usarEscudoDefensivo(mensaje.id, mensaje.jugada.jugadorAfectado,Number(mensaje.jugada.X), Number(mensaje.jugada.Y));
      actualizarJuego(mensaje.id);
    } else {
      mandarMensaje(socket, 'no es tu turno >:(');
    }
  }

  function realizarMisilCrucero(socket, mensaje){
    console.log("vacaciones :)");
    if((juegos.has(mensaje.id)) && (juegos.get(mensaje.id).jugadores[juegos.get(mensaje.id).jugadorActual].nombre) == mensaje.jugador){
      juegos.get(mensaje.id).usarMisilCrucero(mensaje.id, mensaje.jugada.jugadorAfectado,  Number(mensaje.jugada.X), Number(mensaje.jugada.Y));
      console.log("juego mandado");
      actualizarJuego(mensaje.id);
    } else {
      mandarMensaje(socket, 'no es tu turno >:(');
    }
  }

  function realizarRegeneracionRapida(socket, mensaje){
    console.log("culito de rana");
    if((juegos.has(mensaje.id)) && (juegos.get(mensaje.id).jugadores[juegos.get(mensaje.id).jugadorActual].nombre) == mensaje.jugador){
      juegos.get(mensaje.id).usarRegeneracionRapida(mensaje.jugada.jugadorAfectado,  mensaje.jugada.X, mensaje.jugada.Y);
      actualizarJuego(mensaje.id);
    } else {
      mandarMensaje(socket, 'no es tu turno >:(');
    }
  }

  function realizarEMP(socket, mensaje){
    console.log("emp");
    if((juegos.has(mensaje.id)) && (juegos.get(mensaje.id).jugadores[juegos.get(mensaje.id).jugadorActual].nombre) == mensaje.jugador){
      juegos.get(mensaje.id).usarAtaqueEMP(mensaje.id, mensaje.jugada.jugadorAfectado);
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
