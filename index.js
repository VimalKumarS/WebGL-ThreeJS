// /<reference path='./js/three.js'/> /<reference path='./js/Stats.js'/>
// /<reference path='./js/OrbitControls.js'/>

var fileUpload = function ($, container) {
    var fr = null;
    var jsondata = [];

    uploadfile = function () {
        var x = $(this);
        var txt = "";
        if (x[0].files !== undefined) {
            if (x[0].files.length == 0) {
                txt = "Select one or more files.";
            } else {
                for (var i = 0; i < x[0].files.length; i++) {
                    txt += "<br><strong>" + (i + 1) + ". file</strong><br>";
                    var file = x[0].files[i];
                    if ('name' in file) {
                        txt += "name: " + file.name + "<br>";
                    }
                    if ('size' in file) {
                        txt += "size: " + file.size + " bytes <br>";
                    }
                    fr = new FileReader();
                    fr.onload = receivedText;
                    fr.readAsText(file);
                }
            }
        } else {
            if (x.value == "") {
                txt += "Select one or more files.";
            } else {
                txt += "The files property is not supported by your browser!";
                txt += "<br>The path of the selected file: " + x.value; // If the browser does not support the files property, it will return the path of the selected file instead.
            }
        }
        $("#selected-file-csv").html(txt);
    }

    receivedText = function () {

        var lines = fr
            .result
            .split("\n");
        var result = [];
        var headers = lines[0].split(",");

        for (var i = 1; i < lines.length - 1; i++) {
            var obj = {};
            var currentline = lines[i].split(",");
            for (var j = 0; j < headers.length; j++) {
                obj[headers[j]] = currentline[j];
            }
            result.push(obj);
        }
        jsondata = result; //JavaScript object
    }

    loaddata = function (event) {
        event.preventDefault();
        console.log(jsondata);
        for (let data of jsondata) {
            container.AddCube(data.part, {
                width: parseFloat(data.width),
                height: parseFloat(data.height),
                depth: parseFloat(data.depth)
            }, {
                positionx: parseFloat(data.positionx),
                positiony: parseFloat(data.positiony),
                positionz: parseFloat(data.positionz)
            });
            // container.AddCube('text',{
            //     width: 50,
            //     height: 150,
            //     depth: 150
            // }, {
            //     positionx: 0,
            //     positiony: 0,
            //     positionz: 0
            // });
        }
        console.log(jsondata);
    }

    return {uploadfile: uploadfile, data: jsondata, loaddata: loaddata}
};

var Container = function ($) {

    var scene,
        camera,
        controls,
        projector,
        canvasWidth,
        canvasHeight,projector,
        renderer;
    var objects = [];

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
        //scene.add(light);
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
        scene.add(ground);
        ////////// floor  // //////////

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

        projector = new THREE.Projector();
        ////////////  Dom Event  // //////////
        document.addEventListener('mousedown', onDocumentMouseDown, false);
        window.addEventListener('resize', onWindowResize, false);

    }

    function AddCube(text, dimension, position) {
        var canvas = document.createElement("canvas");
        var context = canvas.getContext("2d");
        context.font = 24 + "pt Arial";
        context.textAlign = "center";
        //context.fillRect(0, 0, 100, 100);
        var texture = new THREE.Texture(canvas);
        texture.needsUpdate = true;

        var imageObj = new Image();
        imageObj.src = "./images/crate.png";
        // after the image is loaded, this function executes
        imageObj.onload = function () {
            context.drawImage(imageObj, 0, 0, 300, 150);
            context.fillStyle = "white";
            context.save();
            context.translate(10,10);
            context.rotate(Math.PI/180);
            context.fillText(text, canvas.width / 2, canvas.height / 2);
            context.restore();
            if (texture) // checks if texture exists
                texture.needsUpdate = true;
            };
        
        var material = new THREE.MeshBasicMaterial({map: texture});
        var mesh = new THREE.Mesh(new THREE.CubeGeometry(dimension.width, dimension.height, dimension.depth), material);
        mesh.data = {
            'part': text,
            'dimension': dimension,
            'position': position
        };
        mesh
            .position
            .set(position.positionx + (dimension.width) / 2, position.positiony + (dimension.height) / 2, position.positionz + (dimension.depth) / 2);

        scene.add(mesh);
        objects.push(mesh);
    }
    onWindowResize = function () {
        windowHalfX = window.innerWidth / 2;
        windowHalfY = window.innerHeight / 2;

        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();

        renderer.setSize(window.innerWidth, window.innerHeight);

    }
    onDocumentMouseDown = function (event) {

        event.preventDefault();
        var canvasPosition = renderer
            .domElement
            .getBoundingClientRect();
        var mouseX = event.clientX - canvasPosition.left;
        var mouseY = event.clientY - canvasPosition.top;

        var mouseVector = new THREE.Vector3(2 * (mouseX / canvasWidth) - 1, 
        1 - 2 * (mouseY / canvasHeight), 0.5);
        
        // var mouseVector = new THREE.Vector3(
        //     2 * ( mouseX / canvasWidth ) - 1,
        //     1 - 2 * ( mouseY / canvasHeight ));
            
            projector.unprojectVector( mouseVector  , camera );
        var raycaster = new THREE.Raycaster(camera.position, mouseVector.sub(camera.position).normalize());

        
        //var raycaster = projector.pickingRay( mouseVector.clone(), camera );

        var intersects = raycaster.intersectObjects( objects );

        if (intersects.length > 0) {
            console.log(intersects[0].object.data)
            $("#data-output").text(JSON.stringify(intersects[0].object.data))
        }
    }
    animate = function () {
        requestAnimationFrame(animate);
        render();
        update();
    }
    update = function () {
        controls.update();
    }

    render = function () {
        renderer.render(scene, camera);
    }

    return {
        scene: scene,
        render: render,
        init: init,
        update: update,
        animate: animate,
        AddCube: AddCube
    }

};