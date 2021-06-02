class Moneda {
	// Constructor para la moneda
	constructor(scene, posx, posz, index) {
    //  Posiciones para colocar la moneda en el mapa
	  this.posx = posx;
	  this.posz = posz;
    //  Índice que identifica a la moneda
	  this.index = index
    //  La escena
	  this.scene = scene;
    //  El objeto de la moneda
	  this.meshMoneda = new THREE.Object3D();
	  
	  var that = this;
	  
    //  Llamamos a la función crear moneda
	  this.createMoneda(this.meshMoneda);
	  
	  //  Caja fisica de la moneda
	  var containerGeometry = new THREE.BoxGeometry(5.2, 3, 3);
	  
	  this.box_moneda = new Physijs.BoxMesh(
		containerGeometry,
		new THREE.MeshBasicMaterial({wireframe: true,opacity: 0.0,transparent: true}),
		1
	  );
	  
    //  Añadimos la moneda a la caja física
	  this.box_moneda.add(this.meshMoneda);
	  
	  this.box_moneda.position.set(this.posx, 2, this.posz);
	  this.box_moneda.__dirtyPosition = true;
	  
	  //  Añadimos la caja a la escena
	  this.scene.add(this.box_moneda);
	  
    //  Establecemos que cuando se produzca un evento de tipo colisión
    //  desaparezca la moneda y en caso de ser el jugador el que la recoge
    //  le aplicamos un bonus de velocidad. 
    //  Si la recoge cualquiera de los jugadores, se le suma a su contador
    //  de monedas.
	  this.box_moneda.addEventListener('collision', function(objeto, v, r, n) {
		if(objeto.id == 13) {

		  that.scene.remove(that.box_moneda);
		  that.scene.coche.monedas++;
		  var source = ["100", "100", "100", "100", "100", "100", "0"];
		  
		  var delay = 3000; // use 30000 for 30 seconds
		  
		  var currentIndex = 0;
		  
		  var A = source[currentIndex]; // Starting value
		  
		  var intervalId = setInterval(function() {
        currentIndex += 1;
        A = source[currentIndex];
        
        that.scene.coche.extra = A;
        
        // Clear interval 
        if(source.length === currentIndex + 1) {
          clearInterval(intervalId);
        }
		  }, delay);

		}

		if(objeto.id == 33) { // 1
		  that.scene.remove(that.box_moneda);
		  that.scene.enemigo.monedas++;
		}
		if(objeto.id == 43) { //2
		  that.scene.remove(that.box_moneda);
		  that.scene.enemigo2.monedas++;
		}
		if(objeto.id == 53) { //2
		  that.scene.remove(that.box_moneda);
		  that.scene.enemigo2.monedas++;
		}
	  });
	  
	}
	
	//  Creamos el objeto del personaje
	createMoneda() {
	  
	  var that = this;
	  var materialLoader = new THREE.MTLLoader();
	  var objectLoader = new THREE.OBJLoader();
	  
    //  Cargamos el material
	  materialLoader.load('../models/Coin.mtl',
      function(materials) {
        //  Cargamos el objeto
        objectLoader.setMaterials(materials);
        objectLoader.load('../models/Coin.obj',
        function(object) {
          var modelo = object;
          that.meshMoneda.add(modelo);
        }, null, null);
      }
	  );
	}
	
	//Metodo que actualiza
	update() {
	  this.meshMoneda.rotation['y'] += 0.1;
	  this.meshMoneda.rotation['x'] = 0;
	  this.meshMoneda.rotation['z'] = 0;
	  this.box_moneda.__dirtyRotation = true;
	  
	}
}