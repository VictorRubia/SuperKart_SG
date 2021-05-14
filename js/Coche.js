class Coche {
  //Necesitamos la escena
  constructor(scene) {
    this.scene = scene;

    //Aspecto del personaje
    this.createCoche(scene);

    //Caja fisica del personaje
    var containerGeometry = new THREE.BoxGeometry(3, 7.8, 3);
    
    this.box_container = new Physijs.BoxMesh(
      containerGeometry,
      new THREE.MeshBasicMaterial({ wireframe: true, opacity: 0.0, transparent: true }),
      1
    );

    this.input = {
      power: null,
      direction: null,
      steering: 0,
      rear: null
    };
  }

  //Crear el aspecto del personaje
  createCoche(scene) {

    this.input;

    var colorCarroceria = new THREE.MeshLambertMaterial({color: 0xA52523 });

    var carroceriaGeom = new THREE.BoxGeometry(5.2,1.3,2.5);
    carroceriaGeom.rotateY(Math.PI / 2);
    this.carroceria = new THREE.Mesh(carroceriaGeom, colorCarroceria);
    
    var carroceriaPhy = new Physijs.BoxMesh(
      carroceriaGeom,
      colorCarroceria
    );
    
    carroceriaPhy.position.y = 1.4; //1.3
    carroceriaPhy.castShadow = carroceriaPhy.receiveShadow = true;
    
    var cabinaGeom = new THREE.BoxGeometry(2.86,1.04,2);
    cabinaGeom.rotateY(Math.PI / 2);
    this.cabina = new THREE.Mesh(cabinaGeom, new THREE.MeshLambertMaterial({ color: 0xFFFFFF }));
      
    var cabinaVentanaFrontal = new THREE.BoxGeometry(0.2, 0.7, 1.75);
    cabinaVentanaFrontal.rotateY(Math.PI / 2);
    this.ventanaFrontal = new Physijs.BoxMesh(cabinaVentanaFrontal, new THREE.MeshLambertMaterial({ color: 0x666666 }))
    this.ventanaFrontal.position.y = 1.1;
    this.ventanaFrontal.position.z = 1.35;
    
    this.ventanaTrasera = new Physijs.BoxMesh(cabinaVentanaFrontal, new THREE.MeshLambertMaterial({ color: 0x666666 }))
    this.ventanaTrasera.position.y = 1.1;
    this.ventanaTrasera.position.z = -1.35;
    
    var cabinaVentanaLateral = new THREE.BoxGeometry(0.87,0.7,0.2)
    cabinaVentanaLateral.rotateY(Math.PI / 2);
    this.ventanaIzqda1 = new Physijs.BoxMesh(cabinaVentanaLateral, new THREE.MeshLambertMaterial({ color: 0x666666 }))
    this.ventanaIzqda1.position.y = 1.1;
    this.ventanaIzqda1.position.z = 0.6;
    this.ventanaIzqda1.position.x = -1;
    
    this.ventanaIzqda2 = new Physijs.BoxMesh(cabinaVentanaLateral, new THREE.MeshLambertMaterial({ color: 0x666666 }))
    this.ventanaIzqda2.position.y = 1.1;
    this.ventanaIzqda2.position.z = -0.6;
    this.ventanaIzqda2.position.x = -1;
    
    this.ventanaDcha1 = new Physijs.BoxMesh(cabinaVentanaLateral, new THREE.MeshLambertMaterial({ color: 0x666666 }))
    this.ventanaDcha1.position.y = 1.1;
    this.ventanaDcha1.position.z = 0.6;
    this.ventanaDcha1.position.x = 0.92;
    
    this.ventanaDcha2 = new Physijs.BoxMesh(cabinaVentanaLateral, new THREE.MeshLambertMaterial({ color: 0x666666 }))
    this.ventanaDcha2.position.y = 1.1;
    this.ventanaDcha2.position.z = -0.6;
    this.ventanaDcha2.position.x = 0.92;
    
    this.cabina.position.y = 1;
    
    carroceriaPhy.add(this.ventanaFrontal);
    carroceriaPhy.add(this.ventanaTrasera);
    carroceriaPhy.add(this.ventanaDcha1);
    carroceriaPhy.add(this.ventanaDcha2);
    carroceriaPhy.add(this.ventanaIzqda1);
    carroceriaPhy.add(this.ventanaIzqda2);
    carroceriaPhy.add(this.cabina);
    
    this.coche = new Physijs.Vehicle(carroceriaPhy, new Physijs.VehicleTuning(
      10,//10.88,//stiffness
      1.83,//1.83,   //compression
      0.28,//0.28, //travel
      500.0,
      10.5,
      6000
      )
    );
      
      this.coche.mesh.position.x =79.59;
      this.coche.mesh.position.z =16.88;
      this.coche.mesh.rotation.y =-Math.PI;

    scene.add(this.coche);

    var ruedaGeom = new THREE.CylinderGeometry( 0.5, 0.5, 1, 8 );
    // ruedaGeom.rotateX(-Math.PI / 2);
    ruedaGeom.rotateZ(-Math.PI / 2);
    // var ruedaGeom = new THREE.CircleGeometry( 10, 5 );
    var materialRueda = new THREE.MeshLambertMaterial({ color: 0x333333 });

    for ( var i = 0; i < 4; i++ ) {
      this.coche.addWheel(
        ruedaGeom,
        materialRueda,
        new THREE.Vector3(
            i % 2 === 0 ? -1.3 : 1.3, 
            -0.3, // Altura ruedas
            i < 2 ? 1.5 : -1.5    // Como de separadas estan las ruedas
        ),
        new THREE.Vector3( 0, -1, 0 ),  // Ruedas motrices
        new THREE.Vector3( -1, 0, 0 ),
        0.75, // Altura coche respecto a ruedas
        0.5,
        i < 2 ? false : true
      );
    }	

      this.ruedaDelante = this.fabricaRuedas();
      this.ruedaDelante.position.y = 6.5;
      this.ruedaDelante.position.x = 1.5;
      // coche.add(this.ruedaDelante);
  
      this.ruedaAtras = this.fabricaRuedas();
      this.ruedaAtras.position.y = 6.5;
      this.ruedaAtras.position.x = -1.5;
      // this.ruedaDelante.add(this.ruedaAtras);
      
    }

  fabricaRuedas(){
    var ruedaGeom = new THREE.CylinderGeometry( 0.5, 0.5, 1, 8 );
    ruedaGeom.rotateX(Math.PI / 2);
    var materialRueda = new THREE.MeshLambertMaterial({ color: 0x333333 });

    var rueda = new THREE.Mesh(ruedaGeom, materialRueda);
    return rueda;
  }

  //Metodo que actualiza
  update() {

    //  Controlamos motor del coche
    if ( this.input && this.coche ) {
      if ( this.input.direction !== null ) {
        this.input.steering += this.input.direction / 50;
        if ( this.input.steering < -.6 ) this.input.steering = -.6;
        if ( this.input.steering > .6 ) this.input.steering = .6;
      }
      else{
        this.input.steering *=0.9;
      }
      this.coche.setSteering( this.input.steering, 0 );
      this.coche.setSteering( this.input.steering, 1 );

      if ( this.input.power === true ) {
        if(this.input.rear === true){
          this.coche.applyEngineForce(-15);
        }
        else{
          this.coche.applyEngineForce( 30 );
        }
      } else if ( this.input.power === false ) {
        this.coche.setBrake( 2, 2 );
        this.coche.setBrake( 2, 3 );
      } 
      else {
        this.coche.applyEngineForce( 0 );
      }
    }

    //  Limitamos la velocidad
    // if(this.coche.mesh.getLinearVelocity().x > 20){
    //   this.coche.mesh.setLinearVelocity({x: 20, y: this.coche.mesh.getLinearVelocity().y, z:this.coche.mesh.getLinearVelocity().z});
    // }
    // else if(this.coche.mesh.getLinearVelocity().z > 20){
    //   this.coche.mesh.setLinearVelocity({x: this.coche.mesh.getLinearVelocity().x , y: this.coche.mesh.getLinearVelocity().y, z:20});
    // }
    // else if(this.coche.mesh.getLinearVelocity().x < -20){
    //   this.coche.mesh.setLinearVelocity({x: -20, y: this.coche.mesh.getLinearVelocity().y, z:this.coche.mesh.getLinearVelocity().z});
    // }
    // else if(this.coche.mesh.getLinearVelocity().z < -20){
    //   this.coche.mesh.setLinearVelocity({x: this.coche.mesh.getLinearVelocity().x , y: this.coche.mesh.getLinearVelocity().y, z:-20});
    // }

    //  rotacion sucia a 0
    // modulo de vel lineal x y z es velocidad
    // un spline general y predeterminado
    // compararse mi spline con el spline genérico para saber mi posición
    // ecuación
  }
}