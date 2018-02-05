// /reference path='./js/three.js'/> /reference path='./js/Stats.js'/>
// /reference path='./js/OrbitControls.js'/>
var box = (function () {

    var scene,
        camera,
        controls,projector,canvasWidth,canvasHeight,
        renderer;
        var objects = [];
    init();
    animate();

function init() {
    //////////// scene  // //////////
    scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x808080, 2000, 4000);
    scene.add(new THREE.AmbientLight(0x222222));
    var light = new THREE.DirectionalLight(0xFFFFFF, 1.0);
    light
        .position
        .set(200, 400, 500);
    scene.add(light);

    light = new THREE.DirectionalLight(0xFFFFFF, 1.0);
    light
        .position
        .set(-400, 200, -300);
    scene.add(light);
    canvasWidth = window.innerWidth;
    canvasHeight = window.innerHeight;
    //////////// camera // //////////
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 20000);
    camera
        .position
        .set(200, 100, 500);
    camera.lookAt(scene.position);

    ////////////// renderer // ////////////
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(scene.fog.color, 1);
    controls = new THREE.OrbitControls(camera, renderer.domElement);

    //document.body.appendChild( renderer.domElement );
    document
        .getElementById("webgl-container")
        .appendChild(renderer.domElement);
    ////////////  axes  // //////////
    var axes = new THREE.AxesHelper(100);
    scene.add(axes);

    var ground = new THREE.Mesh(new THREE.PlaneGeometry(10000, 10000, 100, 100), new THREE.MeshBasicMaterial({color: 0x0, wireframe: true}));
    ground.rotation.x = -Math.PI / 2;

    //scene.add( ground ); ////////// floor  // //////////

    var texture = new THREE
        .TextureLoader()
        .load("./images/checkerboard.jpg");
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture
        .repeat
        .set(10, 10);
    var floorMaterial = new THREE.MeshBasicMaterial({map: texture, side: THREE.DoubleSide});
    var floorGeometry = new THREE.PlaneGeometry(500, 500, 100, 100);
    var floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.position.y = -0.1;
    floor.position.x = 250;
    floor.position.z = 250;
    floor.rotation.x = Math.PI / 2;
    scene.add(floor);

    //////////// skybox // //////////
    var skyBoxGeometry = new THREE.CubeGeometry(10, 10, 10);
    var skyBoxMaterial = new THREE.MeshBasicMaterial({color: 0x9999ff, side: THREE.BackSide});
    var skyBox = new THREE.Mesh(skyBoxGeometry, skyBoxMaterial);
    scene.add(skyBox);
    // var x = window.innerWidth / 2 - 300; var y = window.innerHeight / 2 - 300;
    // scene.add( createLabel("HELLO WORLD", 0, 0, 0, 100, "black", "yellow"))
    projector = new THREE.Projector();
    changeCanvas();

    ////////////  cube  // //////////
    document.addEventListener('mousedown', onDocumentMouseDown, false);
    window.addEventListener('resize', onWindowResize, false);

}
    function createLabel(text, x, y, z, size, color, backGroundColor, backgroundMargin) {
        if(!backgroundMargin)
            backgroundMargin = 50;
        var canvas = document.createElement("canvas");
        var context = canvas.getContext("2d");
        context.font = size + "pt Arial";
        var textWidth = context.measureText(text).width;
        canvas.width = textWidth + backgroundMargin;
        canvas.height = size + backgroundMargin;
        context = canvas.getContext("2d");
        context.font = size + "pt Arial";
        if(backGroundColor) {
            context.fillStyle = backGroundColor;
            context.fillRect(canvas.width / 2 - textWidth / 2 - backgroundMargin / 2, canvas.height / 2 - size / 2 - +backgroundMargin / 2, textWidth + backgroundMargin, size + backgroundMargin);
        }
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.fillStyle = color;
        context.fillText(text, canvas.width / 2, canvas.height / 2);
        // context.strokeStyle = "black";
        // context.strokeRect(0, 0, canvas.width, canvas.height);
        var texture = new THREE.Texture(canvas);
        texture.needsUpdate = true;
        var material = new THREE.MeshBasicMaterial({
            map : texture
        });
        var mesh = new THREE.Mesh(new THREE.PlaneGeometry(canvas.width, canvas.height), material);
        // mesh.overdraw = true;
        mesh.doubleSided = true;
        mesh.position.x = x 
        mesh.position.y = y 
        mesh.position.z = z;
        return mesh;
    }

    function changeCanvas() {
    var canvas = document.createElement("canvas");
        var context = canvas.getContext("2d");
        context.font = 24 + "pt Arial";
        context.textAlign = "center";
        context.fillRect(0, 0, 200, 200);
        var texture = new THREE.Texture(canvas);
        texture.needsUpdate = true;

        var imageObj = new Image();
        imageObj.src = "./images/crate.png";
        // after the image is loaded, this function executes
        imageObj.onload = function()
        {  
            context.drawImage(imageObj, 0,0,300,150);
            context.fillStyle = "white";
            context.fillText("text", canvas.width / 2, canvas.height / 2);
            if ( texture ) // checks if texture exists
                texture.needsUpdate = true;
        };  

        var material = new THREE.MeshBasicMaterial({ map: texture });
        var  mesh = new THREE.Mesh( new THREE.CubeGeometry( 200, 200, 200 ), material );
        mesh.data={'property':1};
        scene.add(mesh);
        objects.push(mesh);
    }
    function onWindowResize() {

        windowHalfX = window.innerWidth / 2;
        windowHalfY = window.innerHeight / 2;

        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();

        renderer.setSize( window.innerWidth, window.innerHeight );

    }
    function onDocumentMouseDown( event ) {

        event.preventDefault();
    
        var canvasPosition = renderer.domElement.getBoundingClientRect();
        var mouseX = event.clientX - canvasPosition.left;
        var mouseY = event.clientY - canvasPosition.top;
    
        // console.log(canvasPosition.left,canvasPosition.top);
        // console.log(mouseX,mouseY);
    
        /*
        while (node.offsetParent){
            node = node.offsetParent;
            mouseX -= node.offsetLeft;
            mouseY -= node.offsetTop;
        }*/
    
        /* the old way */
        
        var mouseVector = new THREE.Vector3(
            2 * ( mouseX / canvasWidth ) - 1,
            1 - 2 * ( mouseY / canvasHeight ), 0.5 );
        projector.unprojectVector( mouseVector, camera );
    
        var raycaster = new THREE.Raycaster( camera.position, mouseVector.sub( camera.position ).normalize() );
        

        /* the new way: simpler creation of raycaster */
        /* from tutorial: http://soledadpenades.com/articles/three-js-tutorials/object-picking/ */
        // var mouseVector = new THREE.Vector3(
        //     2 * ( mouseX / canvasWidth ) - 1,
        //     1 - 2 * ( mouseY / canvasHeight ));
    
        // debug: console.log( "client Y " + event.clientY + ", mouse Y " + mouseY );
    
        //var raycaster = projector.pickingRay( mouseVector.clone(), camera );
    
        var intersects = raycaster.intersectObjects( objects );
    
        if ( intersects.length > 0 ) {
            console.log(intersects)
            // intersects[ 0 ].object.material.color.setRGB( Math.random(), Math.random(), Math.random() );
    
            // var sphere = new THREE.Mesh( sphereGeom, sphereMaterial );
            // sphere.position = intersects[ 0 ].point;
            // scene.add( sphere );
        }
    
        /*
        // Parse all the faces, for when you are using face materials
        for ( var i in intersects ) {
            intersects[ i ].face.material[ 0 ].color.setHex( Math.random() * 0xFFFFFF | 0x80000000 );
        }
        */
    }
    
    function AddCube(dimension, position) {
        var crate = new THREE
            .TextureLoader()
            .load("./images/crate.png");
        crate.wrapS = THREE.RepeatWrapping;
        crate.wrapT = THREE.RepeatWrapping;
        var material = new THREE.MeshBasicMaterial({map: crate});
        var wireframeMaterial = new THREE.MeshBasicMaterial({color: 0x00ff00, wireframe: true, transparent: true});
        var geometry = new THREE.CubeGeometry(dimension.width, dimension.height, dimension.depth);
        computeFaceCentroids(geometry);
        console.log(geometry)
        //geometry.applyMatrix( new THREE.Matrix4().setTranslation( 0, 10, 0 ) );
        var cube = new THREE.Mesh(geometry, material);
        cube
            .position
            .set(position.positionx + (dimension.width) / 2, position.positiony + (dimension.height) / 2, position.positionz + (dimension.depth) / 2);

        scene.add(cube);


    }
    function computeFaceCentroids(geometry) {

        var f,
            fl,
            face;

        for (f = 0, fl = geometry.faces.length; f < fl; f++) {

            face = geometry.faces[f];
            face.centroid = new THREE.Vector3(0, 0, 0);

            if (face instanceof THREE.Face3) {

                face
                    .centroid
                    .add(geometry.vertices[face.a]);
                face
                    .centroid
                    .add(geometry.vertices[face.b]);
                face
                    .centroid
                    .add(geometry.vertices[face.c]);
                face
                    .centroid
                    .divideScalar(3);

            } else if (face instanceof THREE.Face4) {

                face
                    .centroid
                    .add(geometry.vertices[face.a]);
                face
                    .centroid
                    .add(geometry.vertices[face.b]);
                face
                    .centroid
                    .add(geometry.vertices[face.c]);
                face
                    .centroid
                    .add(geometry.vertices[face.d]);
                face
                    .centroid
                    .divideScalar(4);

            }

        }

    }
    function animate() {
        requestAnimationFrame(animate);
        render();
        update();
    }

    function update() {
        controls.update();
    }

    function render() {
        renderer.render(scene, camera);
    }

    return {scene: scene}

})();