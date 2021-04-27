export default class Dude {
  constructor(dudeMesh, id, speed, scaling, scene) {
    this.dudeMesh = dudeMesh;
    this.id = id;
    this.scene = scene;
    this.scaling = scaling;
    this.frontVector = new BABYLON.Vector3(0, 0, -1); // at start dude is facing camera looking to -Z
    this.nbVie = 3;
    this.portail = 0;

    if (speed) this.speed = speed;
    else this.speed = 1;

    // in case, attach the instance to the mesh itself, in case we need to retrieve
    // it after a scene.getMeshByName that would return the Mesh
    // SEE IN RENDER LOOP !
    dudeMesh.Dude = this;

    // scaling
    this.dudeMesh.scaling = new BABYLON.Vector3(0.2, 0.2, 0.2);

    // FOR COLLISIONS, let's associate a BoundingBox to the Dude

    // singleton, static property, computed only for the first dude we constructed
    // for others, we will reuse this property.
    if (Dude.boundingBoxParameters == undefined) {
      Dude.boundingBoxParameters = this.calculateBoundingBoxParameters();
    }

    this.bounder = this.createBoundingBox();
    this.bounder.dudeMesh = this.dudeMesh;

    // Particle system for the Dude, to show when he is hit by cannonball or laser

    // singleton, static property, computed only for the first dude we constructed
    // for others, we will reuse this property.
    if (Dude.particleSystem == undefined) {
      Dude.particleSystem = this.createParticleSystem();
      this.setParticleSystemDefaultValues();
    }
  }

  moveFPS(scene) {
    // just called with the original dude....

    // if no bounding box return;
    if (!this.bounder) return;

    // if active camera is not on dude, it cannot be controlled...
    if (scene.activeCamera !== scene.followCameraDude) {
      // if active camera is not following the dude, this latter is immobile.
      // let's pause his animation...
      //this.dudeMesh.animation.pause();
      return;
    }

    // active camera is on the dude. restart animation if he's moving forward or backward
    if (scene.inputStates.up || scene.inputStates.down) {
      this.dudeMesh.animation.restart();
    } else {
      this.dudeMesh.animation.pause();
    }

    // Movements using arrows or zqsd...

    // like with followTank(), dude takes bounding box position, as we choosed to move the bbox
    this.dudeMesh.position.x = this.bounder.position.x;
    this.dudeMesh.position.z = this.bounder.position.z;

    // adjust y position dependingOn Ground height
    this.followGround();

    var direction = this.frontVector;
    var dir = direction.normalize();
    var alpha = Math.atan2(-1 * dir.x, -1 * dir.z);
    this.dudeMesh.rotation.y = alpha;

    if (scene.inputStates.up) {
      this.bounder.moveWithCollisions(
        this.frontVector.multiplyByFloats(this.speed, this.speed, this.speed)
      );
    }

    if (scene.inputStates.down) {
      this.bounder.moveWithCollisions(
        this.frontVector.multiplyByFloats(-this.speed, -this.speed, -this.speed)
      );
    }

    if (scene.inputStates.left) {
      var alpha = this.dudeMesh.rotation.y;
      alpha -= 0.02;
      this.frontVector = new BABYLON.Vector3(-Math.sin(alpha), 0, -Math.cos(alpha));
    }
    if (scene.inputStates.right) {
      var alpha = this.dudeMesh.rotation.y;
      alpha += 0.02;
      this.frontVector = new BABYLON.Vector3(-Math.sin(alpha), 0,-Math.cos(alpha));
    }

    this.bounder.onCollide = (collidedMesh) => {
      //console.log(collidedMesh.name);
      if(collidedMesh.name == "finishLine") {
        console.log("dude collide finish line");
        if (confirm("Felicitation vous etes arrivé !!")) {
          window.location.reload();
        } else {
          window.location.reload();
        }
      } else if(collidedMesh.name == "Portail1") {
        this.portail = 1;
      }else if(collidedMesh.name == "Portail2") {
        this.portail = 2;
      }else if(collidedMesh.name == "Portail3") {
        this.portail = 3;
      }else if(collidedMesh.name == "Portail4") {
        this.portail = 4;
      }else if(collidedMesh.name == "Portail5") {
        this.portail = 5;
      }else if(collidedMesh.name == "Portail6") {
        this.portail = 6;
      }
    }

    this.teleport(this.portail, scene);

  }

  teleport(numPortail, scene){
    if(numPortail == 0){
      return;
    }else if (numPortail == 1){
      this.bounder.position = new BABYLON.Vector3(431, 0, 169);
      this.portail = 0;
    }else if (numPortail == 2){
      this.bounder.position = new BABYLON.Vector3(173, 0, 428);
      this.portail = 0;
    }else if (numPortail == 3){
      this.bounder.position = new BABYLON.Vector3(214, 0, -430);
      this.portail = 0;
    }else if (numPortail == 4){
      this.bounder.position = new BABYLON.Vector3(-178, 0, -146);
      this.portail = 0;
    }else if (numPortail == 5){
      this.bounder.position = new BABYLON.Vector3(173, 0, 428);
      this.portail = 0;
    }else if (numPortail == 6){
      this.bounder.position = new BABYLON.Vector3(145, 0, 70);
      this.portail = 0;
    }
  }

  followGround() {
    // adjusts y position depending on ground height...

    // create a ray that starts above the dude, and goes down vertically
    let origin = new BABYLON.Vector3(this.dudeMesh.position.x, 1000, this.dudeMesh.position.z);
    let direction = new BABYLON.Vector3(0, -1, 0);
    let ray = new BABYLON.Ray(origin, direction, 10000);

    // compute intersection point with the ground
    let pickInfo = this.scene.pickWithRay(ray, (mesh) => { return(mesh.name === "gdhm"); });

    let groundHeight = pickInfo.pickedPoint.y;
    this.dudeMesh.position.y = groundHeight;

    let bbInfo = Dude.boundingBoxParameters;

    let max = bbInfo.boundingBox.maximum;
    let min = bbInfo.boundingBox.minimum;

    // Not perfect, but kinda of works...
    // Looks like collisions are computed on a box that has half the size... ?
    //bounder.scaling.y = (max._y - min._y) * this.scaling * 2;

    let lengthY = (max._y - min._y);

   this.bounder.position.y = groundHeight + (max._y - min._y) * this.scaling/2
    return groundHeight;
  }

  calculateBoundingBoxParameters() {
    // Compute BoundingBoxInfo for the Dude, for this we visit all children meshes
    let childrenMeshes = this.dudeMesh.getChildren();
    let bbInfo = this.totalBoundingInfo(childrenMeshes);

    return bbInfo;
  }

  // Taken from BabylonJS Playground example : https://www.babylonjs-playground.com/#QVIDL9#1
  totalBoundingInfo(meshes) {
    var boundingInfo = meshes[0].getBoundingInfo();
    var min = boundingInfo.minimum.add(meshes[0].position);
    var max = boundingInfo.maximum.add(meshes[0].position);
    for (var i = 1; i < meshes.length; i++) {
      boundingInfo = meshes[i].getBoundingInfo();
      min = BABYLON.Vector3.Minimize(
        min,
        boundingInfo.minimum.add(meshes[i].position)
      );
      max = BABYLON.Vector3.Maximize(
        max,
        boundingInfo.maximum.add(meshes[i].position)
      );
    }
    return new BABYLON.BoundingInfo(min, max);
  }

  createBoundingBox() {
    // Create a box as BoundingBox of the Dude
    let bounder = new BABYLON.Mesh.CreateBox(
      "bounder" + this.id.toString(),
      1,
      this.scene
    );
    let bounderMaterial = new BABYLON.StandardMaterial(
      "bounderMaterial",
      this.scene
    );
    bounderMaterial.alpha = 0;
    bounder.material = bounderMaterial;
    bounder.checkCollisions = true;

    bounder.position = this.dudeMesh.position.clone();

    let bbInfo = Dude.boundingBoxParameters;

    let max = bbInfo.boundingBox.maximum;
    let min = bbInfo.boundingBox.minimum;

    // Not perfect, but kinda of works...
    // Looks like collisions are computed on a box that has half the size... ?
    bounder.scaling.x = (max._x - min._x) * this.scaling;
    bounder.scaling.y = (max._y - min._y) * this.scaling;
    bounder.scaling.z = (max._z - min._z) * this.scaling * 3;
    //bounder.isVisible = false;

    bounder.position.y += (max._y - min._y) * this.scaling/2;

    return bounder;
  }

}
