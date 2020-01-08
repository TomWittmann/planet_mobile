/**
 * @author Zachary Wartell, Jialei Li, K.R. Subrmanian
 *
 */




/*****
 *
 * GLOBALS
 *
 *****/

var lastTimestamp=null;

var debug = {showDelta : false};
var repaint;

var rootCS;
var paused = false;


/*****
 *
 * MAIN
 *
 *****/
function main() {

    /* uncomment to just run unit tests */
    var unitTest=false;
    // unitTest=true;
    if (unitTest)
    {
          Mat2_test();
          Mat3_test();
          return;
    }

    /**
     **      Initialize WebGL Components
     **/

    // Retrieve <canvas> element
    var canvas = document.getElementById('webgl');

    // Get the rendering context for WebGL
    var gl = getWebGLContext(canvas);
    if (!gl) {
        console.log('Failed to get the rendering context for WebGL');
        return;
    }

    /**
     **    Initialize some test Drawable's
     **/
    var shader = new Shader(gl, "vertex-shader", "fragment-shader");
    var renderables = new Array();

    modelViewStack = new Mat3Stack(gl);

    /*
     * Student Note: the conditionally executed calls below enable calls to various
     * testing functions in Tests.js.   See each function's description for details.
     * You can enable and disable calls to these functions to test various parts of your implementation
     * of math2D.js, Mat3Stack.js and the classes in Renderable.js
     * In your final version of Planet Mobile, these test code calls would be replaced by code that creates
     * and initializes all the planet objects in their CoordinateSystem tree.
     */
    {// begin test code
    if (0)
        SimpleRenderable_test1(renderables,shader);
    if (0)
        TestStack_test1(renderables,shader);
    if (0)
        CoordinateSystem_test1(renderables,shader,gl);
    if (0)
        CoordinateSystem_test2(renderables,shader,gl);
    if (0)
        CoordinateSystem_test3(renderables, shader, gl);

    }// end test code


    var skeleton=false;
    if(skeleton)
    {
        document.getElementById("App_Title").innerHTML += "-Skeleton";
    }

    /*
    Create the hierarchy.
     */
    unitDiscHierarchy(gl, shader, renderables);

    /**
     **    Initialize Misc. OpenGL state
     **/
    gl.clearColor(0, 0, 0, 1);

    // Clear <canvas>
    gl.clear(gl.COLOR_BUFFER_BIT);

    /**
     **      Set Event Handlers
     **
     **  Student Note: the WebGL book uses an older syntax. The newer syntax, explicitly calling addEventListener, is preferred.
     **  See https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener
     **/
    // set event handlers buttons
    var pauseButton = document.getElementById("PauseButton");
    pauseButton.addEventListener(
            "click",
            function () {
                console.log("PauseButton");
                if (paused == false) {
                    paused = true;
                    pauseButton.innerHTML = "Play";
                } else {
                    paused = false;
                    pauseButton.innerHTML = "Pause";
                }
            });

    // Register function (event handler) to be called on a mouse press
    canvas.addEventListener(
            "mousedown",
            function (ev) {
                handleMouseDown(ev, gl, canvas, renderables);
                });


    /**
     **   Initiate Animation Loop
     **/
    // define repaint function
    repaint = function(timestamp)
    {
        // draw and animate all objects for this frame
        if (lastTimestamp !== null)
        {
            // update time info
            var
                delta = timestamp-lastTimestamp; // 'delta' = time that has past between this call and previous call to this repaint function
            lastTimestamp = timestamp;

            // animate everything (i.e. update geometry, positions, colors, etc. of all Renderable objects
            if (paused == false)
                rootCS.animate(delta);

            // draw everything
            drawFrame(gl,renderables);

            // some debug output
            if (debug.showDelta)
                console.log("Delta: "+delta);
        }
        lastTimestamp = timestamp;

        // request another call to repaint function to render next frame
        requestAnimationFrame(repaint);
    };
    // make first call to repaint function
    requestAnimationFrame(repaint);

} //end Main



/*****
 *
 * FUNCTIONS
 *
 *****/


/* @author Zachary Wartell && ..
 * This function should update all geometry, positions, transforms, colors, etc. of all Renderable objects
 *
 * @param {renderables} - array of all created ShaderRenderable objects
 * @param {delta} - time that has past since last rendered frame
 */
function animateFrame(renderables,delta)
{
    for (i=0;i<renderables.length;i++)
        if (renderables[i] instanceof ShaderRenderable)
            {
                renderables[i].color[0] += delta * 0.001;
                //clle.log(renderables[i].color[0]);
                if (renderables[i].color[0] > 1.0)
                    renderables[i].color[0] = 0.1;
            }
}

/*
 * Handle mouse button press event.
 *
 * @param {MouseEvent} ev - event that triggered event handler
 * @param {Object} gl - gl context
 * @param {HTMLCanvasElement} canvas - canvas
 * @param {Array} renderables - Array of Drawable objects
 * @returns {undefined}
 */
function handleMouseDown(ev, gl, canvas, renderables) {
    var x = ev.clientX; // x coordinate of a mouse pointer
    var y = ev.clientY; // y coordinate of a mouse pointer
    var rect = ev.target.getBoundingClientRect();

    // Student Note: 'ev' is a MouseEvent (see https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent)

    // convert from canvas mouse coordinates to GL normalized device coordinates
    x = ((x - rect.left) - canvas.width / 2) / (canvas.width / 2);
    y = (canvas.height / 2 - (y - rect.top)) / (canvas.height / 2);

    console.log("click\n" +
                "  GUI: " + ev.clientX + ", " + ev.clientY + "\n" +
                "  NDC: " + x + ", " + y);

   // \todo test all Shape objects for selection using their point_inside method's
    var areaOfPlanet = Math.PI * Math.pow(this.radius, 2);
	
	var planetArray = new Array();
	var planetName = "";
	
	planetArray.forEach(function (unitDisc) {
		if (unitDisc.point_inside(new Vec2[x, y])) { 
			planetName = this.name;
			document.getElementById("Selected").innerHTML = "Selected: " + planetName;
		}
	});
	
    if (ev.clientX > 360 && ev.clientX < 460 && ev.clientY > 280 && ev.clientY < 480) {
        document.getElementById("Selected").innerHTML = "Selected: Sun";
    } else {
        document.getElementById("Selected").innerHTML = "Selected: None";
    }

    //Earth is 200-600


   requestAnimationFrame(repaint);
}

/* @author Zachary Wartell
 * Draw all Renderable objects
 * @param {Object} gl - WebGL context
 * @param {Array} renderables - Array of Renderable objects
 * @returns {undefined}
 */
function drawFrame(gl, renderables) {

    // Clear <canvas>
    gl.clear(gl.COLOR_BUFFER_BIT);

    // init model view stack
    //modelViewStack.loadIdentity();

    // draw all Renderable objects
    for(var i=0;i<renderables.length;i++)
        renderables[i].render();
}

/**
 * Converts 1D or 2D array of Number's 'v' into a 1D Float32Array.
 * @param {Number[] | Number[][]} v
 * @returns {Float32Array}
 */
function flatten(v)
{
    var n = v.length;
    var elemsAreArrays = false;

    if (Array.isArray(v[0])) {
        elemsAreArrays = true;
        n *= v[0].length;
    }

    var floats = new Float32Array(n);

    if (elemsAreArrays) {
        var idx = 0;
        for (var i = 0; i < v.length; ++i) {
            for (var j = 0; j < v[i].length; ++j) {
                floats[idx++] = v[i][j];
            }
        }
    }
    else {
        for (var i = 0; i < v.length; ++i) {
            floats[i] = v[i];
        }
    }

    return floats;
}

function unitDiscHierarchy(gl, shader, renderables) {

    renderables.pop();

    /*
    rootCS
     */
    rootCS = new CoordinateSystem();
    rootCS.name = "RootCS";
    rootCS.origin = new Vec2([0.0, 0.0]);
    rootCS.orientation = 0.0;
    rootCS.scale = new Vec2([1.0, 1.0]);
    /*
    sunCS
     */
    sunCS = new CoordinateSystem();
    sunCS.name = "sunCS";
    sunCS.origin = new Vec2([0.0, 0.0]);
    sunCS.orientation = 0.0;
    sunCS.scale = new Vec2([0.5, 0.5]);
    sunCS.speed = 0.0;
    /*
    sun
     */
    sunColor = [1.0, 1.0, 0.0, 1.0]; //Set the sun color to yellow.
    sun = new UnitDisc(gl, shader, sunColor);
    sun.name = "sun";
    sun.center = new Vec2([0.0, 0.0]);
    sun.radius = 0.5;
    sun.clicked = true;
    /*
    earthOrbitCS
     */
    earthOrbitCS = new CoordinateSystem();
    earthOrbitCS.name = "earthOrbitCS";
    earthOrbitCS.origin = new Vec2([0.0, 0.0]);
    earthOrbitCS.orientation = 0.0;
    earthOrbitCS.scale = new Vec2([1.0, 1.0]);
    earthOrbitCS.speed = 20;
    /*
    earthCS
     */
    earthCS = new CoordinateSystem();
    earthCS.name = "earthCS";
    earthCS.origin = new Vec2([0.5, 0.0]);
    earthCS.orientation = 0.0;
    earthCS.scale = new Vec2([0.1, 0.1]);
    earthCS.speed = 1.5;
    /*
    earth
     */
    earthColor = [0.0, 0.0, 1.0, 1.0];
    earth = new UnitDisc(gl, shader, earthColor)
    earth.name = "earth";
    earth.center = new Vec2([0.0, 0.0]);
    earth.radius = 0.25;
    earth.clicked = true;
    /*
    moonOrbitCS
     */
    moonOrbitCS = new CoordinateSystem();
    moonOrbitCS.name = "moonOrbitCS";
    moonOrbitCS.origin = new Vec2([0.5, 0.0]);
    moonOrbitCS.orientation = 0.0;
    moonOrbitCS.scale = new Vec2([1.0, 1.0]);
    moonOrbitCS.speed = 100;
    /*
    moonCS
     */
    moonCS = new CoordinateSystem();
    moonCS.name = "moonCS";
    moonCS.origin = new Vec2([0.05, 0.0]);
    moonCS.orientation = 0.0;
    moonCS.scale = new Vec2([0.05, 0.05]);
    moonCS.speed = 30;
    /*
    moon
     */
    moonColor = [1.0, 1.0, 1.0, 1.0];
    moon = new UnitDisc(gl, shader, moonColor)
    moon.name = "moon";
    moon.center = new Vec2([0.5, 0.0]);
    moon.radius = 0.1;
    moon.clicked = true;
    /*
    debrisOrbitCS
     */
    debrisOrbitCS = new CoordinateSystem();
    debrisOrbitCS.name = "debrisOrbitCS";
    debrisOrbitCS.origin = new Vec2([0.075, 0.0]);
    debrisOrbitCS.orientation = 0.0;
    debrisOrbitCS.scale = new Vec2([1.0, 1.0]);
    debrisOrbitCS.speed = 150;
    /*
    debrisCS
     */
    debrisCS = new CoordinateSystem();
    debrisCS.name = "debrisCS";
    debrisCS.origin = new Vec2([0.05, 0.0]);
    debrisCS.orientation = 0;
    debrisCS.scale = new Vec2([0.025, 0.05]);
    debrisCS.speed = 2.5;
    /*
    debris
     */
    debrisColor = [1.0, 0.0, 0.0, 1.0];
    debris = new UnitDisc(gl, shader, debrisColor)
    debris.name = "debris";
    debris.center = new Vec2([0.0, 0.0]);
    debris.radius = 0.1;
    debris.clicked = true;
    /*
    1. Add sun to sunCS
    2. Add earth to earthCS
    3. Add moon to MoonCS
    4. Add moonCS to moonOrbitCS
    5. Add earthCS and moonOrbitCS to earthOrbitCS
    6. Add earthOrbitCS and sunCS to rootCS
     */
    sunCS.add_shape(sun);
    rootCS.add_child(sunCS);
    earthCS.add_shape(earth);
    moonCS.add_shape(moon);
    debrisCS.add_shape(debris);
    debrisOrbitCS.add_child(debrisCS);
    moonOrbitCS.add_child(debrisOrbitCS);
    moonOrbitCS.add_child(moonCS);
    earthOrbitCS.add_child(earthCS);
    earthOrbitCS.add_child(moonOrbitCS);
    rootCS.add_child(earthOrbitCS);
     /*
    Render the coordinate system.
     */
    renderables.push(rootCS);
}

