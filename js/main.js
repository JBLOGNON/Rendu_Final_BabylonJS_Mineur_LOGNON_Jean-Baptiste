import Dude from "./Dude.js";

let canvas;
let engine;
let scene;
let heroDude;
window.onload = startGame;

function startGame() {
  canvas = document.querySelector("#myCanvas");
  engine = new BABYLON.Engine(canvas, true);
  scene = createScene();

  // enable physics
  scene.enablePhysics();

  // modify some default settings (i.e pointer events to prevent cursor to go
  // out of the game window)
  modifySettings();

  let camera = false;

  scene.toRender = () => {
    let deltaTime = engine.getDeltaTime(); // remind you something ?

    let mainHero = scene.getMeshByName("heroDude");

        if(mainHero){
            if(!camera){
                let followCamera = createFollowCamera(scene, mainHero);
                scene.activeCamera = scene.followCameraDude
                camera = true;
            }
            moveHeroDude();
        }

    //moveHeroDude();
    //moveOtherDudes();

    scene.render();
  };

  //engine.runRenderLoop();
  // instead of running the game, we tell instead the asset manager to load.
  // when finished it will execute its onFinish callback that will run the loop
  scene.assetsManager.load();
}

function createScene() {
  let scene = new BABYLON.Scene(engine);

  scene.assetsManager = configureAssetManager(scene);

  let ground = createGround(scene);
  let freeCamera = createFreeCamera(scene);

  let hero = createHeroDude(scene);

  createLights(scene);

  createFinishLine(scene);

  createPortals(scene);

  return scene;
}

function createFinishLine(scene){
  let finishLine = BABYLON.Mesh.CreateBox("finishLine");
  finishLine.scaling = new BABYLON.Vector3(20,40,40);
  finishLine.position = new BABYLON.Vector3(-395,10.5,-430);

  const finishMaterial = new BABYLON.StandardMaterial(
    "finishMaterial",
    scene
  );
  finishMaterial.diffuseTexture = new BABYLON.Texture("images/finish.jpg");
  finishLine.material = finishMaterial;

  finishLine.checkCollisions = true;
}

function createPortals(scene){
  //Textures
  var myMaterial = new BABYLON.StandardMaterial("myMaterial", scene);
  myMaterial.diffuseColor = new BABYLON.Color3(1, 0, 1);

  var invisibleTexture = new BABYLON.StandardMaterial("greenMat", scene);
	invisibleTexture.diffuseTexture = new BABYLON.Texture("images/grass.jpg", scene);
	invisibleTexture.alpha = 0;

  //Portail 1
  let portal1_1 = BABYLON.MeshBuilder.CreateCylinder("Portail1", {height: 2, diameter: 30, diameterTop: 25,tessellation: 50}, scene);
  portal1_1.position = new BABYLON.Vector3(153, 0, 429);
  portal1_1.material = myMaterial;
  
  let portal1_2 = BABYLON.MeshBuilder.CreateCylinder("Portail1", {height: 3, diameter: 28, diameterTop: 18, tessellation: 50}, scene);
  portal1_2.position = new BABYLON.Vector3(153, 0, 429);

  let portal1 = BABYLON.MeshBuilder.CreateCylinder("Portail1", {height: 15, diameter: 23, diameterTop: 13, tessellation: 50}, scene);
  portal1.position = new BABYLON.Vector3(153, 0, 429);
  
  portal1.material = invisibleTexture;

  portal1.checkCollisions = true;

  //Portail 2
  let portal2_1 = BABYLON.MeshBuilder.CreateCylinder("Portail2", {height: 2, diameter: 30, diameterTop: 25,tessellation: 50}, scene);
  portal2_1.position = new BABYLON.Vector3(431, 0, 147);
  portal2_1.material = myMaterial;
  
  let portal2_2 = BABYLON.MeshBuilder.CreateCylinder("Portail2", {height: 3, diameter: 28, diameterTop: 18, tessellation: 50}, scene);
  portal2_2.position = new BABYLON.Vector3(431, 0, 147);

  let portal2 = BABYLON.MeshBuilder.CreateCylinder("Portail2", {height: 15, diameter: 23, diameterTop: 13, tessellation: 50}, scene);
  portal2.position = new BABYLON.Vector3(431, 0, 147);
  
  portal2.material = invisibleTexture;

  portal2.checkCollisions = true;

  //Portail 3
  let portal3_1 = BABYLON.MeshBuilder.CreateCylinder("Portail3", {height: 2, diameter: 30, diameterTop: 25,tessellation: 50}, scene);
  portal3_1.position = new BABYLON.Vector3(-159, 0, -144);
  portal3_1.material = myMaterial;
  
  let portal3_2 = BABYLON.MeshBuilder.CreateCylinder("Portail3", {height: 3, diameter: 28, diameterTop: 18, tessellation: 50}, scene);
  portal3_2.position = new BABYLON.Vector3(-159, 0, -144);

  let portal3 = BABYLON.MeshBuilder.CreateCylinder("Portail3", {height: 15, diameter: 23, diameterTop: 13, tessellation: 50}, scene);
  portal3.position = new BABYLON.Vector3(-159, 0, -144);
  
  portal3.material = invisibleTexture;

  portal3.checkCollisions = true;

  //Portail 4
  let portal4_1 = BABYLON.MeshBuilder.CreateCylinder("Portail4", {height: 2, diameter: 30, diameterTop: 25,tessellation: 50}, scene);
  portal4_1.position = new BABYLON.Vector3(235, 0, -432);
  portal4_1.material = myMaterial;
  
  let portal4_2 = BABYLON.MeshBuilder.CreateCylinder("Portail4", {height: 3, diameter: 28, diameterTop: 18, tessellation: 50}, scene);
  portal4_2.position = new BABYLON.Vector3(235, 0, -432);

  let portal4 = BABYLON.MeshBuilder.CreateCylinder("Portail4", {height: 15, diameter: 23, diameterTop: 13, tessellation: 50}, scene);
  portal4.position = new BABYLON.Vector3(235, 0, -432);
  
  portal4.material = invisibleTexture;

  portal4.checkCollisions = true;

  //Portail 5
  let portal5_1 = BABYLON.MeshBuilder.CreateCylinder("Portail5", {height: 2, diameter: 30, diameterTop: 25,tessellation: 50}, scene);
  portal5_1.position = new BABYLON.Vector3(145, 0, 50);
  portal5_1.material = myMaterial;
  
  let portal5_2 = BABYLON.MeshBuilder.CreateCylinder("Portail5", {height: 3, diameter: 28, diameterTop: 18, tessellation: 50}, scene);
  portal5_2.position = new BABYLON.Vector3(145, 0, 50);

  let portal5 = BABYLON.MeshBuilder.CreateCylinder("Portail5", {height: 15, diameter: 23, diameterTop: 13, tessellation: 50}, scene);
  portal5.position = new BABYLON.Vector3(145, 0, 50);
  
  portal5.material = invisibleTexture;

  portal5.checkCollisions = true;

  //Portail 6
  let portal6_1 = BABYLON.MeshBuilder.CreateCylinder("Portail6", {height: 2, diameter: 30, diameterTop: 25,tessellation: 50}, scene);
  portal6_1.position = new BABYLON.Vector3(433, 0, 36);
  portal6_1.material = myMaterial;
  
  let portal6_2 = BABYLON.MeshBuilder.CreateCylinder("Portail6", {height: 3, diameter: 28, diameterTop: 18, tessellation: 50}, scene);
  portal6_2.position = new BABYLON.Vector3(433, 0, 36);

  let portal6 = BABYLON.MeshBuilder.CreateCylinder("Portail6", {height: 15, diameter: 23, diameterTop: 13, tessellation: 50}, scene);
  portal6.position = new BABYLON.Vector3(433, 0, 36);
  
  portal6.material = invisibleTexture;

  portal6.checkCollisions = true;

}

function configureAssetManager(scene) {
  // useful for storing references to assets as properties. i.e scene.assets.cannonsound, etc.
  scene.assets = {};

  let assetsManager = new BABYLON.AssetsManager(scene);

  assetsManager.onProgress = function (
    remainingCount,
    totalCount,
    lastFinishedTask
  ) {
    engine.loadingUIText =
      "We are loading the scene. " +
      remainingCount +
      " out of " +
      totalCount +
      " items still need to be loaded.";
    console.log(
      "We are loading the scene. " +
        remainingCount +
        " out of " +
        totalCount +
        " items still need to be loaded."
    );
  };

  assetsManager.onFinish = function (tasks) {
    engine.runRenderLoop(function () {
      scene.toRender();
    });
  };

  return assetsManager;
}

function createGround(scene) {
  const groundOptions = {
    width: 1000,
    height: 1000,
    subdivisions: 200,
    minHeight: 0,
    maxHeight: 100,
    onReady: onGroundCreated,
  };
  //scene is optional and defaults to the current scene
  const ground = BABYLON.MeshBuilder.CreateGroundFromHeightMap(
    "gdhm",
    "images/hmap3.jpg",
    groundOptions,
    scene
  );

  function onGroundCreated() {
    const groundMaterial = new BABYLON.StandardMaterial(
      "groundMaterial",
      scene
    );
    groundMaterial.diffuseTexture = new BABYLON.Texture("images/maptexture2.jpg");
    ground.material = groundMaterial;
    // to be taken into account by collision detection
    ground.checkCollisions = true;
    //groundMaterial.wireframe=true;

    // for physic engine
    ground.physicsImpostor = new BABYLON.PhysicsImpostor(
      ground,
      BABYLON.PhysicsImpostor.HeightmapImpostor,
      { mass: 0 },
      scene
    );
  }
  return ground;
}

function createLights(scene) {
  // i.e sun light with all light rays parallels, the vector is the direction.
  let light0 = new BABYLON.DirectionalLight(
    "dir0",
    new BABYLON.Vector3(-1, -1, 0),
    scene
  );
}

function createFreeCamera(scene) {
  let camera = new BABYLON.FreeCamera(
    "freeCamera",
    new BABYLON.Vector3(0, 50, 0),
    scene
  );
  camera.attachControl(canvas);
  // prevent camera to cross ground
  camera.checkCollisions = true;
  // avoid flying with the camera
  camera.applyGravity = true;

  // Add extra keys for camera movements
  // Need the ascii code of the extra key(s). We use a string method here to get the ascii code
  camera.keysUp.push("z".charCodeAt(0));
  camera.keysDown.push("s".charCodeAt(0));
  camera.keysLeft.push("q".charCodeAt(0));
  camera.keysRight.push("d".charCodeAt(0));
  camera.keysUp.push("Z".charCodeAt(0));
  camera.keysDown.push("S".charCodeAt(0));
  camera.keysLeft.push("Q".charCodeAt(0));
  camera.keysRight.push("D".charCodeAt(0));

  return camera;
}

function createFollowCamera(scene, target) {
  let targetName = target.name;

  // use the target name to name the camera
  let camera = new BABYLON.FollowCamera(
    targetName + "FollowCamera",
    target.position,
    scene,
    target
  );

  // default values
  camera.radius = 40; // how far from the object to follow
  camera.heightOffset = 15; // how high above the object to place the camera
  camera.rotationOffset = 0; // the viewing angle
  camera.cameraAcceleration = 0.1; // how fast to move
  camera.maxCameraSpeed = 5; // speed limit

  // specific values
  switch (target.name) {
    case "heroDude":
      camera.rotationOffset = 0;
      break;
  }

  return camera;
}

let zMovement = 5;

function createHeroDude(scene) {
  // load the Dude 3D animated model
  // name, folder, skeleton name
  //BABYLON.SceneLoader.ImportMesh("him", "models/Dude/", "Dude.babylon", scene, onDudeImported);

  let meshTask = scene.assetsManager.addMeshTask(
    "Dude task",
    "him",
    "models/Dude/",
    "Dude.babylon"
  );

  meshTask.onSuccess = function (task) {
    onDudeImported(
      task.loadedMeshes,
      task.loadedParticleSystems,
      task.loadedSkeletons
    );
  };

  function onDudeImported(newMeshes, particleSystems, skeletons) {
    heroDude = newMeshes[0];
    heroDude.position = new BABYLON.Vector3(372, 1.5, 427); // The original dude
    // make it smaller
    //heroDude.speed = 0.1;

    // give it a name so that we can query the scene to get it by name
    heroDude.name = "heroDude";

    // create a follow camera for this mesh
    scene.followCameraDude = createFollowCamera(scene, heroDude);

    // there might be more than one skeleton in an imported animated model. Try console.log(skeletons.length)
    // here we've got only 1.
    // animation parameters are skeleton, starting frame, ending frame,  a boolean that indicate if we're gonna
    // loop the animation, speed,
    // let's store the animatableObject into the main dude mesh
    heroDude.animation = scene.beginAnimation(skeletons[0], 0, 120, true, 1);
    
    setTimeout(() => {
      heroDude.animation.pause();
    }, 500)
    // params = id, speed, scaling, scene
    let hero = new Dude(heroDude, -1, 0.5, 0.2, scene);

  }
}

function moveHeroDude() {
  let heroDude = scene.getMeshByName("heroDude");
  if (heroDude) heroDude.Dude.moveFPS(scene);
}

window.addEventListener("resize", () => {
  engine.resize();
});

function modifySettings() {
  // as soon as we click on the game window, the mouse pointer is "locked"
  // you will have to press ESC to unlock it
  scene.onPointerDown = () => {
    if (!scene.alreadyLocked) {
      console.log("requesting pointer lock");
      canvas.requestPointerLock();
    } else {
      console.log("Pointer already locked");
    }
  };

  document.addEventListener("pointerlockchange", () => {
    let element = document.pointerLockElement || null;
    if (element) {
      // lets create a custom attribute
      scene.alreadyLocked = true;
    } else {
      scene.alreadyLocked = false;
    }
  });

  // key listeners for the tank
  scene.inputStates = {};
  scene.inputStates.left = false;
  scene.inputStates.right = false;
  scene.inputStates.up = false;
  scene.inputStates.down = false;

  //add the listener to the main, window object, and update the states
  window.addEventListener(
    "keydown",
    (event) => {
      if (event.key === "ArrowLeft" || event.key === "q" || event.key === "Q") {
        scene.inputStates.left = true;
      } else if (
        event.key === "ArrowUp" ||
        event.key === "z" ||
        event.key === "Z"
      ) {
        scene.inputStates.up = true;
      } else if (
        event.key === "ArrowRight" ||
        event.key === "d" ||
        event.key === "D"
      ) {
        scene.inputStates.right = true;
      } else if (
        event.key === "ArrowDown" ||
        event.key === "s" ||
        event.key === "S"
      ) {
        scene.inputStates.down = true;
      } else if (event.key == "y" || event.key == "Y") {
        scene.activeCamera = scene.followCameraDude;
        console.log(heroDude.position);
      }
    },
    false
  );

  //if the key will be released, change the states object
  window.addEventListener(
    "keyup",
    (event) => {
      if (event.key === "ArrowLeft" || event.key === "q" || event.key === "Q") {
        scene.inputStates.left = false;
      } else if (
        event.key === "ArrowUp" ||
        event.key === "z" ||
        event.key === "Z"
      ) {
        scene.inputStates.up = false;
      } else if (
        event.key === "ArrowRight" ||
        event.key === "d" ||
        event.key === "D"
      ) {
        scene.inputStates.right = false;
      } else if (
        event.key === "ArrowDown" ||
        event.key === "s" ||
        event.key === "S"
      ) {
        scene.inputStates.down = false;
      }
    },
    false
  );
}
