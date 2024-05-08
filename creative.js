/////////////////////////////////////////////////////////////////////////////////////////
//  UBC CPSC 314 ------------ Sept 2023, Assignment 1 
/////////////////////////////////////////////////////////////////////////////////////////
console.log('A1 Creative Component by Linda Han');

floorColor = 0xe7dd83;
mountainColor = 0x61764B;   //before: 0xa87a58
lakeColor = 0x87CEEB;

cabinBoxColor = 0xd19825;
cabinRoofColor =  0xBA704F;
// cabinRoofColor =  0x7EAA92;

treeTrunkAColor = 0x9D5C0D;
treeTopAColor = 0xD3DE32;
treeTrunkBColor = 0x964B00;
treeTopBColor = 0x9da558;

// SETUP RENDERER & SCENE
var canvas = document.getElementById('canvas');
var scene = new THREE.Scene();
// var renderer = new THREE.WebGLRenderer( { antialias: true } );
var renderer = new THREE.WebGLRenderer( {antialias: false});
// renderer.setPixelRatio(1.0);

  // set background colour to 0xRRGGBB  where RR,GG,BB are values in [00,ff] in hexadecimal, i.e., [0,255] 
renderer.setClearColor(0xE4F1FF);
canvas.appendChild(renderer.domElement);

// SETUP CAMERA
var camera = new THREE.PerspectiveCamera(50,1,0.01,1e99); // view angle, aspect ratio, near, far
// camera.position.set(0,20,0);     // birds eye view
// camera.position.set(0,0,10);     // side view
camera.position.set(0,10,20);      // angled view
camera.lookAt(0,0,0);
scene.add(camera);

// SETUP ORBIT CONTROLS OF THE CAMERA
var controls = new THREE.OrbitControls(camera);
controls.damping = 0.2;
controls.autoRotate = false;

// ADAPT TO WINDOW RESIZE
function resize() {
//  renderer.setSize(window.innerWidth/4,window.innerHeight/4, false);
  renderer.setSize(window.innerWidth,window.innerHeight);
  console.log('window size: ',window.innerWidth,window.innerHeight);
  camera.aspect = window.innerWidth/window.innerHeight;
  camera.updateProjectionMatrix();
}

// EVENT LISTENER RESIZE
window.addEventListener('resize',resize);
resize();

//SCROLLBAR FUNCTION DISABLE
window.onscroll = function () {
     window.scrollTo(0,0);
   }

/////////////////////////////////////	
// ADD LIGHTS  and define a simple material that uses lighting
/////////////////////////////////////	

light = new THREE.PointLight(0xffffff);
light.position.set(0,10,3);
scene.add(light);
ambientLight = new THREE.AmbientLight(0x606060);
scene.add(ambientLight);

var diffuseMaterial = new THREE.MeshLambertMaterial( {color: 0xffffff} );
var diffuseMaterial2 = new THREE.MeshLambertMaterial( {color: 0xffffff, side: THREE.DoubleSide } );

/////////////////////////////////////////////////////////////////////////////////////
//  create a campfire material that uses the vertex & fragment shaders
/////////////////////////////////////////////////////////////////////////////////////

var campfireMaterial = new THREE.ShaderMaterial( {
	vertexShader: document.getElementById( 'campfireVertexShader' ).textContent,
	fragmentShader: document.getElementById( 'campfireFragmentShader' ).textContent
} );

var ctx = renderer.context;
ctx.getShaderInfoLog = function () { return '' };   // stops shader warnings, seen in some browsers

///////////////////////////////////////////////////////////////////////
//  Campfire
///////////////////////////////////////////////////////////////////////
var manager = new THREE.LoadingManager();
        manager.onProgress = function ( item, loaded, total ) {
	console.log( item, loaded, total );
};

var onProgress = function ( xhr ) {
	if ( xhr.lengthComputable ) {
		var percentComplete = xhr.loaded / xhr.total * 100;
		console.log( Math.round(percentComplete, 2) + '% downloaded' );
	}
};
var onError = function ( xhr ) {
};
var loader = new THREE.OBJLoader( manager );
loader.load( 'obj/Bonfire.obj', function ( object ) {
	object.traverse( function ( child ) {
		if ( child instanceof THREE.Mesh ) {
		    child.material = campfireMaterial;
		}
	} );
  object.position.set(-2.5,0.05,3);
  object.scale.set(3,3,3);
	scene.add( object );
}, onProgress, onError );

// Bear
var bearLoader = new THREE.OBJLoader( manager );
bearLoader.load( 'obj/bear/Mesh_Bear.obj', function ( object ) {
	object.traverse( function ( child ) {
		if ( child instanceof THREE.Mesh ) {
		    child.material = campfireMaterial;
		}
	} );
  object.position.set(3.5,0.31,0);
  object.scale.set(0.005,0.005,0.005);
  object.rotation.set(0, -Math.PI/3, 0);
	scene.add( object );
}, onProgress, onError );

///////////////////////////////////////////////////////////////////////
//   Cabin
///////////////////////////////////////////////////////////////////////
// log texture
cabinTexture = new THREE.TextureLoader().load('images/cabin.jpg');
cabinTexture.wrapS = cabinTexture.wrapT = THREE.RepeatWrapping;
cabinTexture.repeat.set(2,1);

boxGeometry = new THREE.BoxGeometry( 1.5, 0.8, 1 );    // width, height, depth
boxMaterial = new THREE.MeshLambertMaterial( { map: cabinTexture} );
box = new THREE.Mesh( boxGeometry, boxMaterial );
// box.position.set(-6, 0.4, 2);
box.position.set(0, 0.4, 0);

verticesOfRoof = [
  new THREE.Vector3(0, 0, 0),       // Vertex 0 (bottom)
  new THREE.Vector3(1, 0, 0),       // Vertex 1 (bottom)
  new THREE.Vector3(0.5, 1, 0),     // Vertex 2 (top)

  new THREE.Vector3(0, 0, 1),       // Vertex 3 (bottom)
  new THREE.Vector3(1, 0, 1),       // Vertex 4 (bottom)
  new THREE.Vector3(0.5, 1, 1),     // Vertex 5 (top)
];

indicesOfRoofFaces = [
  new THREE.Face3(0, 1, 2),   // Bottom triangle face
  new THREE.Face3(3, 4, 5),   // Top triangle face
  new THREE.Face3(0, 1, 3),   // Side rectangle face 1
  new THREE.Face3(1, 4, 3),   // Side rectangle face 2
  new THREE.Face3(1, 2, 5),   // Side triangle face 1
  new THREE.Face3(1, 4, 5),   // Side triangle face 2
  new THREE.Face3(0, 2, 5),   // Side triangle face 3
  new THREE.Face3(0, 3, 5)    // Side triangle face 4
];

roofGeometry = new THREE.Geometry();
roofGeometry.vertices = verticesOfRoof;
roofGeometry.faces = indicesOfRoofFaces;
roofGeometry.computeFaceNormals();
const material = new THREE.MeshLambertMaterial({ color: cabinRoofColor, 
                                                  side: THREE.DoubleSide});
const roof = new THREE.Mesh(roofGeometry, material);
roof.rotation.set(0, Math.PI/2, 0);
roof.position.set(-0.75,0.8,0.5);
roof.scale.set(1,0.5,1.5);

cabin = new THREE.Group();
cabin.add(box, roof);

// Adding the cabins
cabin1 = cabin.clone();
cabin1.position.set(-5.5,0,6);
scene.add(cabin1);

cabin2 = cabin.clone();
cabin2.position.set(-5.5,0,3.8);
scene.add(cabin2);

cabin5 = cabin.clone();
cabin5.position.set(-5,0,1.5);
cabin5.rotation.set(0, -Math.PI/5, 0);
scene.add(cabin5);

cabin3 = cabin.clone();
cabin3.position.set(-2.8,0,0);
cabin3.rotation.set(0, -Math.PI/3, 0);
scene.add(cabin3);

cabin4 = cabin.clone();
cabin4.position.set(0,0,-0.6);
cabin4.rotation.set(0, Math.PI/2, 0);
scene.add(cabin4);

/////////////////////////////////////////////////////////////////////////
// Tree
/////////////////////////////////////////////////////////////////////////
// Tree type A
// parameters: radiusAtTop, radiusAtBottom, height, segmentsAroundRadius, segmentsAlongHeight
trunkAGeometry = new THREE.CylinderGeometry( 0.08, 0.08, 0.45, 20, 5 );
trunkAMaterial = new THREE.MeshLambertMaterial( {color: treeTrunkAColor} );   
trunkA = new THREE.Mesh( trunkAGeometry, trunkAMaterial);

// parameters: radiusAtTop, radiusAtBottom, height, segmentsAroundRadius, segmentsAlongHeight
topAGeometry = new THREE.CylinderGeometry( 0.05, 0.3, 1.2, 20, 4 );

topAMaterial = new THREE.MeshLambertMaterial( {color: treeTopAColor} );   
topA = new THREE.Mesh( topAGeometry, topAMaterial);
topA.position.set(0, 0.7, 0);

treeA = new THREE.Group();
treeA.add(topA, trunkA);

// Tree type B
// parameters: radiusAtTop, radiusAtBottom, height, segmentsAroundRadius, segmentsAlongHeight
trunkBGeometry = new THREE.CylinderGeometry( 0.08, 0.1, 0.4, 20, 5 );
trunkBMaterial = new THREE.MeshLambertMaterial( {color: treeTrunkBColor} );   
trunkB = new THREE.Mesh( trunkBGeometry, trunkBMaterial);

// parameters: radiusAtTop, radiusAtBottom, height, segmentsAroundRadius, segmentsAlongHeight
topBGeometry = new THREE.CylinderGeometry( 0.02, 0.3, 1.4, 20, 10 );
topBMaterial = new THREE.MeshLambertMaterial( {color: treeTopBColor} );   
topB = new THREE.Mesh( topBGeometry, topBMaterial);
topB.position.set(0, 0.8, 0);

treeB = new THREE.Group();
treeB.add(topB, trunkB);
treeB.scale.set(2,1,2);

// trees on the left side (-x dir)
tree_A_height = 0.22;
tree_B_height = 0.19;

tree1 = treeB.clone();
tree1.position.set(-7,tree_B_height,-2);
scene.add(tree1);

tree2 = treeB.clone();
tree2.position.set(-6,tree_B_height,-1);
scene.add(tree2);

tree3 = treeA.clone();
tree3.position.set(-7,tree_A_height,-1);
scene.add(tree3);

tree4 = treeA.clone();
tree4.position.set(-5,tree_A_height,-1.5);
scene.add(tree4);

tree5 = treeA.clone();
tree5.position.set(-6.5,tree_A_height,0);
scene.add(tree5);

// trees on the right side (+x dir)
tree6 = treeA.clone();
tree6.position.set(5,tree_A_height,-1.3);
scene.add(tree6);

tree7 = treeA.clone();
tree7.position.set(7,tree_A_height,-1.2);
scene.add(tree7);

tree8 = treeB.clone();
tree8.position.set(6,tree_B_height,-1);
scene.add(tree8);

tree9 = treeA.clone();
tree9.position.set(6,tree_A_height,0.2);
scene.add(tree9);

tree10 = treeB.clone();
tree10.position.set(7,tree_B_height,-0.2);
scene.add(tree10);

///////////////////////////////////////////////////////////////////////
// Lake
///////////////////////////////////////////////////////////////////////
// Create a 1/4 circle lake geometry
const lakeRadius = 8;
const lakeSegments = 32; // Number of segments for the circle
const thetaStart = Math.PI / 2; // Start angle in radians
const thetaLength = Math.PI / 2; // 90 degrees in radians

const lakeGeometry = new THREE.CircleGeometry(lakeRadius, lakeSegments, thetaStart, thetaLength);

const lakeMaterial = new THREE.MeshBasicMaterial({ color: lakeColor });
const lake = new THREE.Mesh(lakeGeometry, lakeMaterial);
lake.rotation.x = -Math.PI / 2;
lake.position.set(7.53,0,7.53);
lake.scale.set(1.3,0.8,1);
scene.add(lake);


///////////////////////////////////////////////////////////////////////
//  polyhedron, representation mountain
//////////////////////////////////////////////////////////////////////
verticesOfMountain = [
  0, 1, 0,        // Apex vertex 0
  0, 0, 0.5,        // Base vertex 1
  -1, 0, 0,       // Base vertex 2
  -1, 0, -1,     // Base vertex 3
  1, 0, -1,    // Base vertex 4
  1, 0, 0,       // Base vertex 5
];

indicesOfFaces = [
  0, 1, 2, // Triangle 1
  0, 2, 3, // Triangle 2
  0, 3, 4, // Triangle 3
  0, 4, 5, // Triangle 4
  0, 5, 1, // Triangle 5
  1, 2, 3, // Base triangle 1
  1, 3, 4, // Base triangle 2
  1, 4, 5, // Base triangle 3
  1, 5, 2, // Base triangle 4
];

// radius, level of tessellation
mountainGeometry = new THREE.PolyhedronGeometry( verticesOfMountain, indicesOfFaces, 5, 0 );
mountainMaterial = new THREE.MeshLambertMaterial( {color: mountainColor, side: THREE.DoubleSide } ); 
mountain = new THREE.Mesh(mountainGeometry, mountainMaterial);
mountain.scale.set(0.5,0.5,0.5);
mountain.position.set(-5.2,0,-6);

mountain2 = new THREE.Mesh(mountainGeometry, mountainMaterial);
mountain2.scale.set(0.6,0.8,0.7);
mountain2.position.set(-2.8,0,-6);
mountain2.rotation.set(0,4.5,0);     // rotation about x,y,z axes

mountain3 = new THREE.Mesh(mountainGeometry, mountainMaterial);
mountain3.scale.set(0.9,0.6,0.6);
mountain3.position.set(1.2,0,-7);
mountain3.rotation.set(0,-0.5,0);     // rotation about x,y,z axes

mountain4 = new THREE.Mesh(mountainGeometry, mountainMaterial);
mountain4.scale.set(0.7,0.5,0.6);
mountain4.position.set(4.3,0,-6);
mountain4.rotation.set(0,-0.9,0);     // rotation about x,y,z axes

mountains = new THREE.Group();
mountains.add(mountain, mountain2, mountain3, mountain4);
mountains.scale.set(1.06,1.1,1);
mountains.position.set(0,0,2);
scene.add(mountains);
/////////////////////////////////////	
// FLOOR with texture
/////////////////////////////////////	
floorTexture = new THREE.TextureLoader().load('images/grass-5.jpg');
floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping;
floorTexture.repeat.set(5,5);

floorMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, map: floorTexture, side: THREE.DoubleSide });
floorGeometry = new THREE.PlaneBufferGeometry(15,15);    // x,y size 
floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.position.y = -0.01;
floor.rotation.x = -Math.PI / 2;
scene.add(floor);

///////////////////////////////////////////////////////////////////////////////////////
// UPDATE CALLBACK
///////////////////////////////////////////////////////////////////////////////////////

function update() {
  requestAnimationFrame(update);      // requests the next update call;  this creates a loop
  renderer.render(scene, camera);
}

update();

