/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * @author Zachary Wartell 
 * Constructor of Mat3Stack. Argument 'gl' must be a valid WebGLContext
 * 
 * Mat3Stack mimics the classic OpenGL Matrix Stack functions described in:
 *    http://www.glprogramming.com/red/chapter03.html#name6
 *    
 * Mat3Stack, however, is only a stack of 3x3 matrices not 4x4 and hence used for 2D graphics.
 *    
 * @param {Object} gl - valid GL context
 */
var Mat3Stack = function (gl)
{
    this.array = new Array();
    this.array.push(new Mat3());
    this.u_modelView = null;
    this.gl = gl;
};

/**
 * @author Zachary Wartell
 * Assign the GLSL Uniform mat3 variable, u_modelView, the top Mat3 on this Mat3Stack.
 * 
 * This method must be called whereever you would set the active shader's various uniform variables.
 * See other example code included with this project.
 * @param {WebGLUniformLocaiton} u_modelView
 */
Mat3Stack.prototype.updateShader = function (u_modelView)
{
    if (!(u_modelView instanceof WebGLUniformLocation))
        throw new Error("Bad Type");      
    this.gl.uniformMatrix3fv(u_modelView, false, this.array[this.array.length-1].array);    
};

/**
 * @author Zachary Wartell 
 * Push a copy of the current top Mat3 onto the Mat3Stack K4YEJHUR5SW AMQO
 * @param {null}
 */
Mat3Stack.prototype.push = function ()
{     
    this.array.push(new Mat3(this.array[this.array.length-1]));
};

/**
 * @author Zachary Wartell 
 * Pop the current top of stack
 * @param {null}
 */
Mat3Stack.prototype.pop = function ()
{        
    this.array.pop();
};

/* @author Zachary Wartell
 * set the top Mat3 to the identity matrix
 * 
 * @param {null} 
 */
Mat3Stack.prototype.loadIdentity = function ()
{  
    this.array[this.array.length-1].setIdentity();
};

/* @author Zachary Wartell
 * assign (overwrite) the top Mat3 to the matrix 'matrix'
 * 
 * @param {Array} - Array of 9 floats storing matrix in column-major order
 */
Mat3Stack.prototype.loadMatrix = function (matrix)
{  
    this.array[this.array.length-1] = new Mat3(matrix);
};

/* @author Zachary Wartell
 * translate the top Mat3 by translation [x,y]
 * 
 * @param {[x,y]} - Array with translation vector coordinates
 * @returns {undefined}
 */
Mat3Stack.prototype.translate = function ()
{    
    if (this.array.length === 0)
        throw new Error("Mat3Stack: Empty");
    
    if (arguments[0] instanceof Array)
    {
        /* translate top matrix */        
        this.array[this.array.length-1].translate(arguments[0]);
    }
    else
        throw new Error("Unsupported Type");
};

/* @author
 * scale the top Mat3 by scale matrix with scale factors [sx,sy]
 * @param {[sx,sy]}
 */
Mat3Stack.prototype.scale = function ()
{
    /* \todo implement this */
    // throw new Error("UNIMPLEMENTED FUNCTION");
    if (this.array.length === 0)
        throw new Error("Mat3Stack: Empty");

    if (arguments[0] instanceof Array)
    {
        /* scale top matrix */
        this.array[this.array.length-1].scale(arguments[0]);
    }
    else
        throw new Error("Unsupported Type");
};

/* @author
 * rotate the top Mat3 by rotate matrix with rotation angle 'angle'
 * @param {Number : angle}
 */
Mat3Stack.prototype.rotate = function ()
{
    /* \todo implement this */
    // throw new Error("UNIMPLEMENTED FUNCTION");
    if (this.array.length === 0) {
        throw new Error("Mat3Stack: Empty");
    } else {
        var rad = arguments[0];
        /* rotate top matrix */
        this.array[this.array.length - 1].rotate(rad);

    }

};

/* Student Note: You may add additional methods to Mat3Stack based on the classic OpenGL matrix stack API
 * as you see fit.
 */
