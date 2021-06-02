// Clase principal, donde se define la escena
class MyPhysiScene extends Physijs.Scene {

  constructor(myCanvas) {
    // El gestor de hebras
    Physijs.scripts.worker = './physijs/physijs_worker.js'
    // El motor de física de bajo nivel, en el cual se apoya Physijs
    Physijs.scripts.ammo = './ammo.js'
    super();

    this.posiciones;

    this.finalizado = true;

    this.shadows = true;

    // Crear el visualizador, pasándole el lienzo sobre el que realizar los renderizados.
    this.renderer = this.createRenderer(myCanvas);

    // Se establece el valor de la gravedad, negativo, los objetos caen hacia abajo
    this.setGravity(new THREE.Vector3(0, -33, 0));

    // El personaje principal
    this.coche = new Coche(this, 159, 30, 0xA52523, false, 0);

    this.coche.coche.castShadow = true;

    getRandomArbitrary(0.91, 1.04)
    this.enemigo = new Enemigos(this, 171.65, 39.19, 0x00FF00, true, getRandomArbitrary(0.91, 1.07), 1);
    this.enemigo2 = new Enemigos(this, 159.37, 48.83, 0x0000FF, true, getRandomArbitrary(0.91, 1.07), 2);
    this.enemigo3 = new Enemigos(this, 171.97, 58.19, 0xFFFF00, true, getRandomArbitrary(0.91, 1.07), 3);

    this.enemigos = [this.enemigo, this.enemigo2, this.enemigo3];

    this.moneda2 = new Moneda(this, 31.53, -100.82, 2);
    this.moneda3 = new Moneda(this, -53.14, -148.79, 3);
    this.moneda5 = new Moneda(this, -164.55, 8.13, 5);
    this.moneda7 = new Moneda(this, 90.40, 151.96, 7);
    this.moneda8 = new Moneda(this, 165.17, 112.24, 8);


    // Raycaster que se usará
    this.raycaster = new THREE.Raycaster();

    // Se crean y añaden luces a la escena
    this.createLights();

    // Creamos la camara
    this.createCamera();

    // Creamos el mapa 
    this.mapa = new Mapa(this);

    this.mapa.ground.receiveShadow = true;

    //Los elementos del html que vamos a ir modificando
    this.primero = document.getElementById('1');
    this.noveno = document.getElementById('9');

    var clock = new THREE.Clock();
    var delta = 0;
    var interval = 1 / 30;

    this.clock = clock;
    this.delta = delta;
    this.interval = interval;


  }

  createRenderer(myCanvas) {
    // Se recibe el lienzo sobre el que se van a hacer los renderizados. Un div definido en el html.

    // Se instancia un Renderer   WebGL
    var renderer = new THREE.WebGLRenderer();

    // Se establece un color de fondo en las imágenes que genera el render
    renderer.setClearColor(new THREE.Color(0x000000), 1.0);

    // Se establece el tamaño, se aprovecha la totalidad de la ventana del navegador
    renderer.setSize(window.innerWidth, window.innerHeight);

    renderer.shadowMapEnabled = true;

    // La visualización se muestra en el lienzo recibido
    $(myCanvas).append(renderer.domElement);

    return renderer;
  }

  /// Método que actualiza la razón de aspecto de la cámara y el tamaño de la imagen que genera el renderer en función del tamaño que tenga la ventana
  onWindowResize() {

    this.setCameraAspect(window.innerWidth / window.innerHeight);
    this.renderer.setSize(window.innerWidth, window.innerHeight);

  }

  createCamera() {

    this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);

    this.camera.position.set(30, 10, 10);

    this.camera.lookAt(this.coche.coche.mesh.position);

    this.cameraControl = new THREE.TrackballControls(this.camera, this.renderer.domElement);
    this.cameraControl.noRotate = true;
  }


  createLights() {

    this.light2 = new THREE.AmbientLight(0xffffff );
    this.light2.position.set(20, 60, -15);

    this.light = new THREE.SpotLight( 0xffffff ); 
    this.light.position.set( 200, 250, 200 );  
    this.light.castShadow = true;  
    this.light.shadowMapWidth = 1024; 
    this.light.shadowMapHeight = 1024;  
    this.light.shadowCameraNear = 250; 
    this.light.shadowCameraFar = 750; 
    this.light.shadowCameraFov = 500; 
    this.light.visible=false;

    // this.light2 = new THREE.SpotLight( 0xffffff ); 
    // this.light2.position.set( 150, 0, 150 );  
    // console.log(this.coche);
    // this.light2.target = this.coche.coche.wheels[0];
    // this.light2.castShadow = true;
    // this.light2.shadowCameraFov = 20; 
    // this.light2.shadowMapWidth = 1024; 
    // this.light2.shadowMapHeight = 1024;  

    // this.coche.coche.mesh.add(this.light2);

    this.add( this.light );

    this.coche.coche.mesh.add(this.light2);

  }

  getCamera() {

    var relativeCameraOffset = new THREE.Vector3(0, 25, -25);
    this.coche.coche.mesh.updateMatrixWorld(); // Para que la cámara no tiemble
    var cameraOffset = relativeCameraOffset.applyMatrix4(this.coche.coche.mesh.matrixWorld);
    this.camera.position.z = cameraOffset.z;
    this.camera.position.x = cameraOffset.x;

    this.camera.lookAt(this.coche.coche.mesh.position);

    return this.camera;
  }

  //Se define el aspecto de la cámara
  setCameraAspect(ratio) {
    this.camera.aspect = ratio;
    this.camera.updateProjectionMatrix();
  }



  update() {
    // Se solicita que La próxima vez que haya que refrescar la ventana se ejecute una determinada función, en este caso la funcion render.
    // La propia función render es la que indica que quiere ejecutarse la proxima vez
    // Por tanto, esta instrucción es la que hace posible que la función  render  se ejecute continuamente y por tanto podamos crear imágenes que tengan en cuenta los cambios que se la hayan hecho a la escena después de un render.

    if (this.finalizado) // Finalizamos el juego
      requestAnimationFrame(() => this.update());
    this.delta += this.clock.getDelta();

    this.coche.update();
    this.enemigo.update();
    this.enemigo2.update();
    this.enemigo3.update();
    // this.moneda.update();
    this.moneda2.update();
    this.moneda3.update();
    // this.moneda4.update();
    this.moneda5.update();
    // this.moneda6.update();
    this.moneda7.update();
    this.moneda8.update();

    const time = performance.now();

    this.cameraControl.update();

    this.light.position.set( this.coche.coche.mesh.position.x + 100, 250, this.coche.coche.mesh.position.z + 100 ); 
    // this.light2.position.set(0, 0, 0);

    //Actualizar los valores de puntuación y de vida
    var velZ = this.coche.coche.mesh.getLinearVelocity().z.toFixed(2);
    var velX = this.coche.coche.mesh.getLinearVelocity().x.toFixed(2);

    var velocidad = Math.sqrt(Math.pow(velZ, 2) + Math.pow(velX, 2));
    if (this.coche.vueltas == -1)
      this.primero.innerHTML = 1;
    else if (this.coche.vueltas == 2)
      this.primero.innerHTML = 2;
    else
      this.primero.innerHTML = this.coche.vueltas + 1;

    calcularDistancia(this);
    this.noveno.innerHTML = this.coche.posicionCuadro;

    let tacho = 0;
    let gas = 0;

    let turnSignalsStates = {}

    let iconsStates = {
      // main circl
    }

    function redraw() {
      draw((velocidad * 0.005), tacho, gas, (velocidad).toFixed(2), turnSignalsStates, iconsStates);
    }

    redraw();
    TWEEN.update();

    this.simulate();

    this.prevTime = time;

    this.renderer.render(this, this.getCamera());
  }

}

// Retorna un número aleatorio entre min (incluido) y max (excluido)
function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}

/// La función principal
$(function() {

  // Se crea la escena
  var scene = new MyPhysiScene("#WebGL-output");

  // listeners
  // Cada vez que el usuario cambie el tamaño de la ventana se llama a la función que actualiza la cámara y el renderer
  window.addEventListener("resize", () => scene.onWindowResize());

  document.getElementById("restaurar").addEventListener("click", function() {
    scene.coche.coche.mesh.__dirtyRotation = true;
    scene.coche.coche.mesh.__dirtyPosition = true;
    scene.coche.coche.mesh.rotation['x'] = 0;
    scene.coche.coche.mesh.rotation['y'] = Math.PI / 2;
    scene.coche.coche.mesh.rotation['z'] = 0;
  });

  document.getElementById("shadows").addEventListener('change', function() {
    if (this.checked) {
      scene.light.visible=true;
      scene.light2.color.setHex( 0x404040 );
    } else {
      scene.light.visible=false;
      scene.light2.color.setHex( 0xffffff );
    }
  });

  function detectar() {
    window.addEventListener('keydown', function(ev) {
      switch (ev.keyCode) {
        case 65: // left
          scene.coche.input.direction = 1;
          break;

        case 87: // forward
          scene.coche.input.power = true;
          break;

        case 68: // right
          scene.coche.input.direction = -1;
          break;

        case 66: // brake 32
          scene.coche.input.power = false;
          break;

        case 83: // back
          scene.coche.input.power = true;
          scene.coche.input.rear = true;
          break;
      }
    });

    window.addEventListener('keyup', function(ev) {
      switch (ev.keyCode) {
        case 65: // left
          scene.coche.input.direction = null;
          break;

        case 87: // forward
          scene.coche.input.power = null;
          scene.coche.coche.setBrake(0.5, 2);
          scene.coche.coche.setBrake(0.5, 3);
          break;

        case 68: // right
          scene.coche.input.direction = null;
          break;

        case 66: // brake
          scene.coche.input.power = null;
          break;

        case 83: // back
          scene.coche.input.power = null;
          scene.coche.input.rear = null;
          break;
      }
    });
  }
  setTimeout(detectar, 4000);

  // Finalmente, realizamos el primer renderizado.
  scene.update();
});