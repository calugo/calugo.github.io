var container, stats;
var camera, controls, scene, projector, renderer;
var group;
var objects = [], plane;
var nobjects= [], nlinks;
var links = [];
var spheres = [];
var netjson = [];
var mouse = new THREE.Vector2(),
    offset = new THREE.Vector3(),
    INTERSECTED, SELECTED, CODON;
var MODEONOFF;

var r = 800;
var rHalf = r / 2;




readninit(init);
animate();


function init() {
    //console.log(netjson[0]);
    //console.log(netjson);
    container = document.createElement('div');
    document.body.appendChild(container);

    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 4000);
    //camera.position.x = 500.0;
    //camera.position.y = 500.0;
    //camera.position.z = 500.0;
    camera.position.z = 1750;


    controls = new THREE.OrbitControls(camera); //, container );

    //controls = new THREE.TrackballControls(camera);

    controls.rotateSpeed = 1.0;
    controls.zoomSpeed = 1.2;
    controls.panSpeed = 0.8;
    controls.noZoom = false;
    controls.noPan = false;
    controls.staticMoving = true;
    controls.dynamicDampingFactor = 0.3;




    scene = new THREE.Scene();

    scene.add(new THREE.AmbientLight(0x505050));

    var light = new THREE.SpotLight(0xffffff, 1.5);
    light.position.set(-500, 2000, 0);
    light.castShadow = false;

    light.shadowCameraNear = 200;
    light.shadowCameraFar = camera.far;
    light.shadowCameraFov = 50;

    light.shadowBias = -0.00022;
    light.shadowDarkness = 0.5;

    light.shadowMapWidth = 2048;
    light.shadowMapHeight = 2048;

    scene.add(light);

    var light2 = new THREE.SpotLight(0xffffff, 1.5);
    light2.position.set(500, 2000, 0);
    light2.castShadow = false;

    light2.shadowCameraNear = 200;
    light2.shadowCameraFar = camera.far;
    light2.shadowCameraFov = 50;

    light2.shadowBias = -0.00022;
    light2.shadowDarkness = 0.5;

    light2.shadowMapWidth = 2048;
    light2.shadowMapHeight = 2048;


    scene.add(light2);



  var light3 = new THREE.SpotLight(0xffffff, 1.5);
  light3.position.set(0, 0,1000);
  light3.castShadow = false;

  light3.shadowCameraNear = 200;
  light3.shadowCameraFar = camera.far;
  light3.shadowCameraFov = 50;

  light3.shadowBias = -0.00022;
  light3.shadowDarkness = 0.5;

  light3.shadowMapWidth = 2048;
  light3.shadowMapHeight = 2048;


scene.add(light3);

var light4 = new THREE.SpotLight(0xffffff, 1.5);
light4.position.set(0, 0,1000);
light4.castShadow = false;
light4.shadowCameraNear = 200;
light4.shadowCameraFar = camera.far;
light4.shadowCameraFov = 50;

light4.shadowBias = -0.00022;
light4.shadowDarkness = 0.5;

light4.shadowMapWidth = 2048;
light4.shadowMapHeight = 2048;


scene.add(light4);









    group = new THREE.Group();
    scene.add( group );
  //  var r = 800;
	//	var rHalf = r / 2;

    var helper = new THREE.BoxHelper( new THREE.Mesh( new THREE.BoxGeometry( r, r, r ) ) );
    helper.material.color.setHex( 0.5 * 0x0000ff);
    helper.material.blending = THREE.AdditiveBlending;
    helper.material.transparent = true;
    group.add( helper );


    //var geometry = new THREE.BoxGeometry( 40, 40, 40 );
    //var geometry = new THREE.SphereGeometry(20); //40, 40 );


    for (var i = 0; i < netjson.length; i++) {
        //console.log(netjson[i]);
        //if((netjson[i].amino=="Ser")||(netjson[i].amino=="Arg")||(netjson[i].amino=="Leu")||(netjson[i].amino=="Phe")||(netjson[i].amino=="Tyr")){
        //console.log("hola");

        var geometry = new THREE.BoxGeometry(netjson[i].size,netjson[i].size,netjson[i].size); //40, 40 );
        var object = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial({color: (parseFloat(netjson[i].colorid) / 47.0) * 0xffffff}));

        object.material.ambient = object.material.color;
        object.radio=netjson[i].size;
        //object.scale.x = 1.0; //Math.random() * 2 + 1;
        //object.scale.y = 1.0; //Math.random() * 2 + 1;
        //object.scale.z = 1.0; //Math.random() * 2 + 1;

        object.position.x = netjson[i].x;//Math.random() * 1000 - 500;
        object.position.y = netjson[i].y;//Math.random() * 600 - 300;
        object.position.z = netjson[i].z;//Math.random() * 800 - 400;

        object.realX = netjson[i].x;
        object.realY = netjson[i].y;
        object.realZ = netjson[i].z;

        //object.rotation.x = 0.0;//Math.random() * 2 * Math.PI;
        //object.rotation.y = 0.0;//Math.random() * 2 * Math.PI;
        //object.rotation.z = 0.0;//Math.random() * 2 * Math.PI;


        object.name = netjson[i].nodeid;
        object.colorid=netjson[i].colorid;
        object.struct= netjson[i].Struct;
        //amnames.push(netjson[i]);
        object.castShadow = true;
        object.receiveShadow = true;
        object.isSphere = true;
        object.links = netjson[i].links;
        //console.log(object.links);
        object.followers = [];

        scene.add(object);

        objects.push(object);
        group.add(object);

        //}
    }
    console.log('scene', scene);
    /// Links



    for (var i = 0; i < netjson.length; i++) {
        //		if(netjson[i].links.length>0){
        for (var j = 0; j < netjson[i].links.length; j++) {
            var tj = netjson[i].links[j];
            for (var k = 0; k < netjson.length; k++) {
                if (netjson[k].nodeid == tj) {
                    var r1 = new THREE.Vector3(netjson[i].x, netjson[i].y, netjson[i].z);
                    var r2 = new THREE.Vector3(netjson[k].x, netjson[k].y, netjson[k].z);
                    var geometry = new THREE.Geometry();
                    //geometry.colors[0]=(parseFloat(netjson[i].colorid) / 47.0) * 0xffffff
                    //geometry.colors[1]=(parseFloat(netjson[k].colorid) / 47.0) * 0xffffff
                    geometry.vertices.push(r1);
                    geometry.vertices.push(r2);
                    geometry.colors[0]=new THREE.Color((parseFloat(netjson[i].colorid) / 47.0) * 0xffffff);
                    geometry.colors[1]=new THREE.Color((parseFloat(netjson[i].colorid) / 47.0) * 0xffffff);
                    //links.push(r1);
                    //links.push(r2);
                    //if (netjson[i].amino != netjson[k].amino) {
                    //    var material = new THREE.LineBasicMaterial({color: 0.0 * 0x0000ff, opacity: 0.25,});
                    //}
                    //if (netjson[i].amino == netjson[k].amino) {

                    var material = new THREE.LineBasicMaterial( {
                      linewidth: 0.1,
                      color: 0.5*0xffffff,
                      vertexColors: THREE.VertexColors,
                      blending: THREE.AdditiveBlending,
                    //  transparent: true
                    } );



                  //  var material = new THREE.LineBasicMaterial({color: 0.5 * 0x0000ff,linewidth: 0.1, opacity: 0.1});

                    //}
                  //  material.transparent = true;
                    var line = new THREE.Line(geometry, material);

                    objects.forEach(function (obj) {
                        if (netjson[i].x == obj.realX && netjson[i].y == obj.realY && netjson[i].z == obj.realZ) {
                            obj.followers.push(r1);
                        }
                        if (netjson[k].x == obj.realX && netjson[k].y == obj.realY && netjson[k].z == obj.realZ) {
                            obj.followers.push(r2);
                        }
                    });


                    line.myId = netjson[i].cod+tj;
                    scene.add(line);
                    links.push(line);
                    group.add(line)
                    break;
                }
            }
        }
    }
    ///
    plane = new THREE.Mesh(new THREE.PlaneGeometry(2000, 2000, 8, 8), new THREE.MeshBasicMaterial({
        color: 0x000000,
        opacity: 0.25,
        transparent: true,
        wireframe: true
    }));
    plane.visible = false;
    scene.add(plane);
    //////////////////////////////////////////////////////simplified network
    ////
    projector = new THREE.Projector();

    renderer = new THREE.WebGLRenderer({antialias: true});
    //renderer.setClearColor(0xf0f0f0);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.sortObjects = false;

    renderer.shadowMapEnabled = true;
    renderer.shadowMapType = THREE.PCFShadowMap;

    renderer.gammaInput = true;
    renderer.gammaOutput = true;


    container.appendChild(renderer.domElement);

    var info = document.createElement('div');
    info.style.position = 'absolute';
    info.style.top = '10px';
    info.style.width = '100%';
    info.style.textAlign = 'center';
    info.innerHTML = 'Bio-Networks Project (<a href="http://threejs.org" target="_blank">three.js</a>)';
    container.appendChild(info);

    stats = new Stats();
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.top = '0px';
    container.appendChild(stats.domElement);

    renderer.domElement.addEventListener('mousemove', onDocumentMouseMove, false);
    renderer.domElement.addEventListener('mousedown', onDocumentMouseDown, false);
    renderer.domElement.addEventListener('mouseup', onDocumentMouseUp, false);

    //
    MODEONOFF=0;
    createMenu();
    // displaycodinfo(['','','','']);

    //
    window.addEventListener('resize', onWindowResize, false);

}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);

}

function onDocumentMouseMove(event) {

    event.preventDefault();

    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = -( event.clientY / window.innerHeight ) * 2 + 1;

    //

    var vector = new THREE.Vector3(mouse.x, mouse.y, 0.5);
    projector.unprojectVector(vector, camera);

    var raycaster = new THREE.Raycaster(camera.position, vector.sub(camera.position).normalize());


    if (SELECTED) {

        var intersects = raycaster.intersectObject(plane);
        SELECTED.position.copy(intersects[0].point.sub(offset));
        return;

    }


    var intersects = raycaster.intersectObjects(objects);

    if (intersects.length > 0) {


        if (INTERSECTED != intersects[0].object) {




            if (INTERSECTED) INTERSECTED.material.emissive.setHex(INTERSECTED.currentHex);

            INTERSECTED = intersects[0].object;
            INTERSECTED.currentHex = INTERSECTED.material.emissive.getHex();
            INTERSECTED.material.emissive.setHex( 0xff0000 );

            //////////////////////////////////////////////////////////
            /*for(var qn=0; qn< INTERSECTED.links.length; qn++){
                zn=INTERSECTED.codon+INTERSECTED.links[qn];
                console.log(zn);
                for(var pn=0; pn<links.length;pn++){
                  if (zn==links[pn].myId){
                    console.log(zn);
                    links[pn].material.linewidth=5.0;
                  }
              }}*/
              //links.forEach(function (link) {
              //    link.geometry.verticesNeedUpdate = true;
            //////////////////////////////////////////////////////////


            mux=1
            if (mux==1){
                        //console.log(INTERSECTED.codon);
                        //console.log(INTERSECTED.name);
                        //console.log(INTERSECTED.links);
                        var nn=[];
                        var na=[];
                        var sk, qn, ncp, nmx, ctb;

                        nmx=INTERSECTED.struct
                        console.log(nmx)

                        ncp=0.0
                        for(var ik=0;ik<netjson.length;ik++){

                          if (netjson[ik].Struct==nmx){ncp=ncp+1.0;}
                        }



                        for(var ik = 0; ik < INTERSECTED.links.length; ik++) {
                          sk=INTERSECTED.links[ik]
                          //console.log(sk)
                          for(var jk=0;jk<netjson.length;jk++){
                            if (netjson[jk].nodeid==sk){nn.push(netjson[jk].Struct);
                                                        na.push(netjson[jk].Struct);}
                          }
                        }
                        //console.log(nn);
                        //console.log(na);



                        var nax=[];
                        nax.push(na[0]);
                        for(var mi=0; mi<na.length;mi++){
                          var rn=0;
                          for(var mj=0;mj<nax.length;mj++){
                            if(na[mi]==nax[mj]){rn=1;
                                                break;}
                          }

                          if (rn==0){
                                    nax.push(na[mi])
                                    }

                      }
                      //  console.log(nn)
                      //  console.log(nax)
                        $('#ccc').find('span').text(INTERSECTED.struct);
                        $('#nnn').find('span').text(0.5*ncp);
                        $('#aaa').find('span').text(INTERSECTED.name);
                        $('#bbb').find('span').text(nax.length);
                       //console.log(nax)
                       //var x = document.getElementsByClassName("seqn");
                       //console.log(x)
                       //var y = x.textContent
                       //console.log(y)
                      }
            //mux=0
            //createMenu();
            //var bt = document.createElement('box');
            //button.innerHTML = netjson[i].amino;
            //br.innerHTML = "dddddd";//amnames[i];

            plane.position.copy(INTERSECTED.position);
            plane.lookAt(camera.position);

        }



        container.style.cursor = 'pointer';

    } else {

        if (INTERSECTED) INTERSECTED.material.emissive.setHex(INTERSECTED.currentHex);
        //for(var qn=0; qn< INTERSECTED.links.length; qn++){
        //    zn=INTERSECTED.codon+INTERSECTED.links[qn];
        //    console.log(zn);
        for(var pn=0; pn<links.length;pn++){
            links[pn].material.linewidth=1.0;
          }

        INTERSECTED = null;

        container.style.cursor = 'auto';

    }
}

function onDocumentMouseDown(event) {

    event.preventDefault();

    var vector = new THREE.Vector3(mouse.x, mouse.y, 0.5);
    projector.unprojectVector(vector, camera);

    var raycaster = new THREE.Raycaster(camera.position, vector.sub(camera.position).normalize());

    var intersects = raycaster.intersectObjects(objects);
    var intersectsb = raycaster.intersectObjects(links);
    //console.log("Intersected objects", intersects);
    //console.log("Intersected objects", intersects[0].object.name);
    //var intersectsb= raycaster.intersectObjects( links );
    if (intersects.length > 0) {
        //if (( intersects.length > 0 )||(intersectsb.length>0)) {

        controls.enabled = false;

        SELECTED = intersects[0].object;

        CODON = intersects[0].object.name;

        var intersects = raycaster.intersectObject(plane);
        offset.copy(intersects[0].point).sub(plane.position);

        container.style.cursor = 'move';

    }

}

function onDocumentMouseUp(event) {

    event.preventDefault();

    controls.enabled = true;

    if (INTERSECTED) {

        INTERSECTED.followers.forEach(function (follower) {
            //console.log(INTERSECTED);
            follower.x = INTERSECTED.position.x;
            follower.y = INTERSECTED.position.y;
            follower.z = INTERSECTED.position.z;
            console.log(follower);
        });

        links.forEach(function (link) {
            link.geometry.verticesNeedUpdate = true;
            //link.geometry.material.transparent= false;
        });


        plane.position.copy(INTERSECTED.position);


        SELECTED = null;

    }

    container.style.cursor = 'auto';

}

//

function animate() {

    requestAnimationFrame(animate);

    render();
    stats.update();


}

function render() {

    var time = Date.now() * 0.001;
    group.rotation.y = time * 0.1;

    controls.update();

    renderer.render(scene, camera);

}

function readninit(callback) {
    //loads net
    $.ajax({
	// FOR PRODUCTION url: "https://cdn.rawgit.com/calugo/RNA-NETS/master/jsonnets/nugencode.json",
	   url: "rnaNet3.json",
        //url: "nugencode.json",
        dataType: "text",

        success: function (gencode) {
            var njson = $.parseJSON(gencode);
            //console.log(njson[0].cod);
            for (var xi = 0; xi < njson.length; xi++) {
                //console.log(njson[xi]);
                netjson.push(njson[xi]);
            }
            //console.log(njson);
        },

        async: false

    });
    //console.log(netjson[0]);
    //console.log(netjson);
    //console.log(netjson.length);
    //console.log(netjson[0]);
    callback();
    //console.log(ntjson[0].links);
}

function redlog(msg) {
    setTimeout(function () {
        throw new Error(msg);
    }, 0);
}

function createMenu() {
    var amnames = [];
    amnames.push(netjson[0].Struct);

    for (var i = 1; i < netjson.length; i++) {
        var b = 0;
        for (var j = 0; j < i; j++) {
            if (amnames[j] == netjson[i].Struct) {
                b = 1;
                break;
            }
        }

        if (b == 0) {
            amnames.push(netjson[i].Struct);
        }
    }

    //console.log(amnames);

  /*  for (var i = 0; i < amnames.length; i++) {

        var button = document.createElement('button');
        //button.innerHTML = netjson[i].amino;
        button.innerHTML = amnames[i];
        menu.appendChild(button);

        //	var url = "models/molecules/" +  MOLECULES[ m ];

        //button.addEventListener( 'click', generateButtonCallback( url ), false );

    }*/

    var mode_onoff = document.getElementById( "MODE" );
    //var b_b = document.getElementById( "b_b" );
    //var b_ab = document.getElementById( "b_ab" );

    mode_onoff.addEventListener( 'click', function() {
                var x; x=(MODEONOFF+1)%2;
                MODEONOFF=x;
                console.log(MODEONOFF);
                showNETS();
                });
    //b_b.addEventListener( 'click', function() { visualizationType = 1; showBonds() } );
    //b_ab.addEventListener( 'click', function() { visualizationType = 2; showAtomsBonds() } );

}

//////////////////////////////////////////////////
function showNETS() {


  console.log("HELLOIMIN")
  console.log(MODEONOFF)
  console.log(nobjects.length)
	switch ( MODEONOFF ) {
						case 0:
                    console.log("ZERO")
                    console.log(nobjects.length);
                    for (var i=0; i< nobjects.length;i++){
                        //scene.getObjectByName( 'q10', true )
                        //console.log("rata");
                        //console.log(i);
                        //console.log(nobjects[i].objectx.id);
                        nobjects[i].visible = false;
                    }

                    break;
						case 1:
                    for (var i=0; i<nobjects.length;i++){
                        //scene.getObjectByName( 'q10', true )
                        nobjects[i].visible = true;
                    }
                    break;
						//case 2: showAtomsBonds(); break;
					}
}
