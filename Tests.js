/*****
 * 
 * TEST FUNCTIONS
 * 
 * Student Note:  Test.js contains functions for testing and demonstrating various classes including classes that are mostly complete in the skeleton code
 * as well as classes that are very incomplete in the skeleton code (i.e. where implementating their details is part of your assignment).
 *****/

/* @author Zachary Wartell
 * 
 * This function tests and demonstrates examples of the SimpleRenderable class.
 * 
 * @param {type} renderables
 * @param {type} shader
 * @returns {undefined}
 */
function SimpleRenderable_test1(renderables,shader)
{
    var 
        square = new SimpleRenderable(shader),
        triangle = new SimpleRenderable(shader);

    // create a SimpleRenderable with 1 triangle
    triangle.vertices.push([0,0]);
    triangle.vertices.push([1,0]);
    triangle.vertices.push([0,1]);
    triangle.updateBuffers();
    
    triangle.color = [1.0,0.0,1.0,1.0];
    
    // create a SimpleRenderable with 1 square
    square.vertices.push([0,0]);
    square.vertices.push([-1,0]);
    square.vertices.push([0,-1]);
    square.vertices.push([-1,-1]);
    square.vertices.push([-1,0]);
    square.vertices.push([0,-1]);    
    square.updateBuffers();
    
    square.color = [1.0,0.0,0.0,1.0];
    
    // add the 2 SimpleRenderables to the list of objects that will be rendered
    renderables.push(square);
    renderables.push(triangle);    
    }
    
/* @author Zachary Wartell
 * Constructor new TestStack Object
 * 
 * TestStack class is designed for testing the functionality of the Mat3Stack class.
 *  
 * @param {Object} shader - a Shader object
 */
var TestStack = function(shader)
{
    this.shader = shader;
    this.unitSquare = new SimpleRenderable(this.shader),
  
    this.unitSquare.vertices.push([-0.5,-0.5]);
    this.unitSquare.vertices.push([ 0.5,-0.5]);
    this.unitSquare.vertices.push([ 0.5, 0.5]);
    this.unitSquare.vertices.push([-0.5,-0.5]);
    this.unitSquare.vertices.push([-0.5, 0.5]);
    this.unitSquare.vertices.push([ 0.5, 0.5]);    
    this.unitSquare.updateBuffers();
    
    this.unitSquare.color = [0.0,0.0,1.0,1.0];
};

/*
 * Draw this TestStack object.
 * 
 * The code in here is designed purely for testing the Mat3Stack functions. 
 * 
 * \todo Students: Suggestion: Use/Extend this code as desired for testing the Mat3Stack functionality as you implement Mat3Stack.
 */
TestStack.prototype.render = function ()
{    
    switch(2)   // change this value to switch between two the examples of test code below
    {
        case 1:
            /* test 1: Tests only the basic Mat3Stack functions that are provided with the skeleton code */
            modelViewStack.push();
            for (i=0;i<4;i++)
            {
                modelViewStack.translate([0.125,-0.125]);
                this.unitSquare.render();
            }
            modelViewStack.pop();
            break;
        case 2:
            /* Test 2: this is based on example shown in class lecture.
             * 
             * To work proprely, Test 2 requires the student implement nearly all of their Mat3Stack code.
             */
            modelViewStack.push();
            modelViewStack.loadIdentity();
            modelViewStack.translate([0.5,0.5]);
            modelViewStack.scale([0.5,0.5]);

            this.unitSquare.color [0]=0; this.unitSquare.color [1]=0; this.unitSquare.color [2]=1; 
            this.unitSquare.render();
            for (var angle=0;angle < 360; angle += 90)
            {
                modelViewStack.push();
                modelViewStack.rotate(angle);
                modelViewStack.translate([1,0]);
                modelViewStack.scale ([0.25,0.25]);

                this.unitSquare.color [0]=1; this.unitSquare.color [1]=0; this.unitSquare.color [2]=0; 
                this.unitSquare.render();
                modelViewStack.pop();
            }                
            modelViewStack.pop();
            break;
    }   
};


/* @author Zachary Wartell
 * 
 * This function uses the TestStack class to test the functionality of Mat3Stack code.
 * 
 * @param {type} renderables - array of Renderable objects
 * @param {type} shader    - Shader object
 * @returns {undefined}
 */    
function TestStack_test1(renderables,shader)    
{
    var testStack = new TestStack(shader);
    renderables.push(testStack);
}

/*
 * Array of Shape's
 * Since this is used only for testing purposes I leave this as global.
 * @type Array
 */
var selectables = new Array();

/*
 * Test some basic features of the CoordinateSystem class
 * 
 * @param {type} renderables
 * @returns {undefined}
 */
function CoordinateSystem_test1(renderables,shader,gl)
{
    var rootCS = new CoordinateSystem();
    var sqr = new UnitSquare(gl, shader);
    sqr.name = "sqr0";
    rootCS.add_shape(sqr);
    rootCS.origin.x = 0.0; rootCS.origin.y = 0.0;
    rootCS.orientation = 45.0;
    rootCS.scale.x = 0.5; rootCS.scale.y = 0.25;

    renderables.push(rootCS);
    selectables.push(rootCS.shapes.sqr);
}

/*
 * Test the tree structure features of CoordinateSystem class and aspects of recursive rendering of that class.
 * 
 * @param {type} renderables
 * @returns {undefined}
 */
function CoordinateSystem_test2(renderables,shader,gl)
{
    var rootCS = new CoordinateSystem();
    rootCS.orientation = 45.0;
    rootCS.origin.x = 0.5; rootCS.origin.y = 0.5;
    
    var sqr = new UnitSquare(gl,shader);
    var sqrCS = new CoordinateSystem();
    sqr.name = "sqr";
    rootCS.add_child(sqrCS);
    sqrCS.scale.x = 0.5; sqrCS.scale.y = 0.25;
    sqrCS.add_shape(sqr);
    
    var CS2 = new CoordinateSystem();
    rootCS.add_child(CS2);
        
    CS2.origin.x = -0.5; CS2.origin.y = -0.5;
    CS2.orientation = -45.0;
    
    var sqr2 = new UnitSquare(gl,shader);
    var sqr2CS = new CoordinateSystem();    
    sqr2.name = "sqr2";
    sqr2CS.scale.x = 0.5; sqr2CS.scale.y = 0.25;
    sqr2CS.add_shape(sqr2);      
    CS2.add_child(sqr2CS);
    
    selectables.push(sqr);
    selectables.push(sqr2);
        
    renderables.push(rootCS);
}


    
