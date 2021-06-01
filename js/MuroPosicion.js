class MurosPosicion {
    //Necesitamos la escena
    constructor(scene, posx, posz, rotacion, index) {
      this.posx = posx;
      this.posz = posz;
      this.rotacion = rotacion;
      this.index = index;
      this.scene = scene;

      this.crearMuro(this.index);

      scene.add(this.physiMesh);
    }

    crearMuro(){
        var material_muro = new THREE.MeshBasicMaterial({ color: 0xFF0000})
        var material_transparent = new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.01 })

        var geometry = new THREE.BoxGeometry(100, 4, 8);
        this.physiMesh = new Physijs.BoxMesh(geometry, material_transparent, 0);

        this.physiMesh.position.set(this.posx, -1.86, this.posz);
        this.physiMesh.rotation.set(0, this.rotacion, 0);
        this.physiMesh.__dirtyPosition = true;
        this.physiMesh.__dirtyRotation = true;
    }
  
  }