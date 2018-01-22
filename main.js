// /reference path='./js/three.js'/> /reference path='./js/Stats.js'/>
// /reference path='./js/OrbitControls.js'/>
var box = (function () {

    var scene,
        camera,
        controls,
        renderer;

    init();
    animate();

    function init() {
        //////////// scene  // //////////
        scene = new THREE.Scene();

        //////////// camera // //////////
        camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 20000);
        camera
            .position
            .set(200, 100, 500);
        camera.lookAt(scene.position);

        ////////////// renderer // ////////////
        renderer = new THREE.WebGLRenderer();
        renderer.setSize(window.innerWidth, window.innerHeight);

        controls = new THREE.OrbitControls(camera, renderer.domElement);

        //document.body.appendChild( renderer.domElement );
        document
            .getElementById("webgl-container")
            .appendChild(renderer.domElement);
        ////////////  axes  // //////////
        var axes = new THREE.AxisHelper(100);
        scene.add(axes);

        //////////// floor  // //////////

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

        ////////////  cube  // //////////

        AddCube({
            width: 50,
            height: 150,
            depth: 150
        }, {
            positionx: 0,
            positiony: 0,
            positionz: 0
        });
        AddCube({
            width: 50,
            height: 50,
            depth: 50
        }, {
            positionx: 00,
            positiony: 150,
            positionz: 0
        });

        AddCube({
            width: 50,
            height: 50,
            depth: 50
        }, {
            positionx: 100,
            positiony: 00,
            positionz: 0
        });
    }

    function AddCube(dimension,position) {
        var crate = new THREE
            .TextureLoader()
            .load("./images/crate.png");
        crate.wrapS = THREE.RepeatWrapping;
        crate.wrapT = THREE.RepeatWrapping;
        var material = new THREE.MeshBasicMaterial({map: crate});
        var wireframeMaterial = new THREE.MeshBasicMaterial({color: 0x00ff00, wireframe: true, transparent: true});
        var geometry = new THREE.CubeGeometry(dimension.width,dimension.height, dimension.depth);
        computeFaceCentroids(geometry);
        console.log(geometry)
        //geometry.applyMatrix( new THREE.Matrix4().setTranslation( 0, 10, 0 ) );
        var cube = new THREE.Mesh(geometry, material);
        cube
            .position
            .set(position.positionx + (dimension.width )/2, 
            position.positiony + (dimension.height )/2,
            position.positionz + (dimension.depth )/2);
           
        scene.add(cube);

        // for (var i = 0; i < geometry.faces.length; i++) {
        //     var spritey = makeTextSprite("text 1 ", {
        //         fontsize: 32,
        //         backgroundColor: {
        //             r: 100,
        //             g: 100,
        //             b: 255,
        //             a: 1
        //         }
        //     });
        //     computeFaceCentroids(geometry);
        //     spritey.position = new THREE.Vector3( position.positionx, position.positiony, position.positionz);
        //     //  geometry
        //     //     .faces[i]
        //     //     .centroid
        //     //     .clone()
        //     //     .multiplyScalar(2.1);
        //     scene.add(spritey);
        // }
    }

    function makeTextSprite(message, parameters) {
        if (parameters === undefined) 
            parameters = {};
        
        var fontface = parameters.hasOwnProperty("fontface")
            ? parameters["fontface"]
            : "Arial";

        var fontsize = parameters.hasOwnProperty("fontsize")
            ? parameters["fontsize"]
            : 18;

        var borderThickness = parameters.hasOwnProperty("borderThickness")
            ? parameters["borderThickness"]
            : 4;

        var borderColor = parameters.hasOwnProperty("borderColor")
            ? parameters["borderColor"]
            : {
                r: 0,
                g: 0,
                b: 0,
                a: 1.0
            };

        var backgroundColor = parameters.hasOwnProperty("backgroundColor")
            ? parameters["backgroundColor"]
            : {
                r: 255,
                g: 255,
                b: 255,
                a: 1.0
            };

        // var spriteAlignment = parameters.hasOwnProperty("alignment") ?
        // 	parameters["alignment"] : THREE.SpriteAlignment.topLeft;

        var spriteAlignment = new THREE.Vector2( 1, -1 );// THREE.SpriteAlignment.topLeft;

        var canvas = document.createElement('canvas');
        var context = canvas.getContext('2d');
        context.font = "Bold " + fontsize + "px " + fontface;

        // get size data (height depends only on font size)
        var metrics = context.measureText(message);
        var textWidth = metrics.width;

        // background color
        context.fillStyle = "rgba(" + backgroundColor.r + "," + backgroundColor.g + "," + backgroundColor.b + "," + backgroundColor.a + ")";
        // border color
        context.strokeStyle = "rgba(" + borderColor.r + "," + borderColor.g + "," + borderColor.b + "," + borderColor.a + ")";

        context.lineWidth = borderThickness;
        roundRect(context, borderThickness / 2, borderThickness / 2, textWidth + borderThickness, fontsize * 1.4 + borderThickness, 6);
        // 1.4 is extra height factor for text below baseline: g,j,p,q. text color
        context.fillStyle = "rgba(0, 0, 0, 1.0)";

        context.fillText(message, borderThickness, fontsize + borderThickness);

        // canvas contents will be used for a texture
        var texture = new THREE.Texture(canvas)
        texture.needsUpdate = true;

        var spriteMaterial = new THREE.SpriteMaterial({map: texture, useScreenCoordinates: false});
        var sprite = new THREE.Sprite(spriteMaterial);
        sprite
            .scale
            .set(100, 50, 1.0);
        return sprite;
    }

    function roundRect(ctx, x, y, w, h, r) 
{
    ctx.beginPath();
    ctx.moveTo(x+r, y);
    ctx.lineTo(x+w-r, y);
    ctx.quadraticCurveTo(x+w, y, x+w, y+r);
    ctx.lineTo(x+w, y+h-r);
    ctx.quadraticCurveTo(x+w, y+h, x+w-r, y+h);
    ctx.lineTo(x+r, y+h);
    ctx.quadraticCurveTo(x, y+h, x, y+h-r);
    ctx.lineTo(x, y+r);
    ctx.quadraticCurveTo(x, y, x+r, y);
    ctx.closePath();
    ctx.fill();
	ctx.stroke();   
}

function computeFaceCentroids( geometry ) {

    var f, fl, face;

    for ( f = 0, fl = geometry.faces.length; f < fl; f ++ ) {

        face = geometry.faces[ f ];
        face.centroid = new THREE.Vector3( 0, 0, 0 );

        if ( face instanceof THREE.Face3 ) {

            face.centroid.add( geometry.vertices[ face.a ] );
            face.centroid.add( geometry.vertices[ face.b ] );
            face.centroid.add( geometry.vertices[ face.c ] );
            face.centroid.divideScalar( 3 );

        } else if ( face instanceof THREE.Face4 ) {

            face.centroid.add( geometry.vertices[ face.a ] );
            face.centroid.add( geometry.vertices[ face.b ] );
            face.centroid.add( geometry.vertices[ face.c ] );
            face.centroid.add( geometry.vertices[ face.d ] );
            face.centroid.divideScalar( 4 );

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