/**
 * @author Zachary Wartell, ...
 * 
 * Mat2.js is a set of geometry and linear algebra functions related to 2x2 Matrices.
 * 
 * Students are given a initial set of classes and functions are expected to extend these and add
 * additional functions to this file as needed by each project.
 * 
 */

/*
 * test equality of 2 floating point numbers
 * @param {Number} a - double
 * @param {Number} b - double (default Number)
 * @returns {Function|equal.Mat3}
 */
function equal(a,b)
{    
    return Math.abs(a-b)< Number.EPSILON;
}

/*
 * test equality of a 32 bit float and 64 bit float
 * @param {Number} a - 32 bit float
 * @param {Number} b - 64 bit float
 * @returns {Function|equal.Mat3}
 */
function equalfd(a,b)
{        
    // \todo [Wartell] find better way to do this ... 
    /* AFIK - Javascript lacks a 32bit float EPISLON
            - JS seems to lack any proper float to double conversion
    */
    var stupid = new Float32Array([b]); 
    return Math.abs(a-stupid[0])< Number.EPSILON;
}

/**
 * @author Zachary Wartell
 * Constructor of Mat2, a 2x2 matrix 
 * 
 * For efficiency we use a Typed Array.  Elements are stored in 'column major' layout, i.e.
 * for matrix M with math convention M_rc (r=row,c=column)
 *    this.array = [ M_00, M_10,    // first column
 *                   M_01, M_11 ];  // second column
 *                   
 *                   
 * column major order is consistent with OpenGL and GLSL
 *                   
 * @param {null}                  
 * @returns {Mat2}
 */
var Mat2 = function()
{
    this.array = new Float32Array(4);
    this.array.set([1.0, 0.0, 
                    0.0, 1.0]);
};

/**
 * @author Zachary Wartell
 * 'get' returns element in column c, row r of this Mat2
 * @param {Number} r - row 
 * @param {Number} c - column 
 * @returns {Number}
 */
Mat2.prototype.get = function (r, c)
{
    return this.array[c*2+r];
};

/**
 * @author Zachary Wartell
 * 'set' sets element at column c, row r to value 'val'.
 * @param {Number} r - row 
 * @param {Number} c - column 
 * @param {Number} val - value
 * @returns {Number}
 */
Mat2.prototype.set = function (r, c, val)
{
    this.array[c*2+r] = val;
};

/**
 * @author Zachary Wartell
 * 'det' return the determinant of this Mat2
 * @returns {Number}
 */
Mat2.prototype.det = function ()
{
    return this.array[0] * this.array[3] - this.array[1] * this.array[2];
};

/**
 * @author Zachary Wartell 
 * Constructor of Vec2. Vec2 is is used to represent coordinates of 2D geometric points or vectors. 
 * 
 * @param {null | Vec2 | [Number, Number]}
 */
var Vec2 = function ()
{
    if (arguments.length === 0)
    {// no arguements, so initial to 0's
        this.array = new Float32Array(2);
        this.array.set([0.0, 0.0]);
    }
    else if (arguments.length === 1)
    {// 1 argument, ...
        if (arguments[0] instanceof Vec2)
        {// argument is Vec2, so copy it
            this.array = new Float32Array(arguments[0].array);
        }
        else if (arguments[0] instanceof Array)
        {// argument is Array, so copy it
            this.array = new Float32Array(arguments[0]);
        }
    }
};

/**
 * @author Zachary Wartell 
 *  Vec2 - provide alternate syntax for setting/getting x and y coordinates (see math2d_test for examples).
 */
var v = Vec2.prototype;
Object.defineProperties(Vec2.prototype,
    {
        "x": {get: function () {
                return this.array[0];
            },
            set: function (v) {
                this.array[0] = v;
            }},
        "y": {get: function () {
                return this.array[1];
            },
            set: function (v) {
                this.array[1] = v;
            }}
    }
);

/* @author Zachary Wartell
 * Set this Vec2 coordinates to values stored in 'v'
 * @param {Array | Float32Array | Vec3} v
 * @returns {undefined}
 */
Vec2.prototype.set = function (v)
{    
    if (v instanceof Array)
    {
        this.array.set(v);
    }
    else if (v instanceof Float32Array)
    {
        this.array.set(v);
    }    
    else if (v instanceof Vec2)
    {
        this.array.set(v.array);
    }            
    else
        throw new Error("Unsupported Type");
};

/**
 * @author Zachary Wartell 
 * Add Vec2 'v' to this Vec2
 * @param {Vec2} v    
 */
Vec2.prototype.add = function (v)
{
    this.array.set([this.array[0] + v.array[0], this.array[1] + v.array[1]]);
};

/**
 * @author Zachary Wartell 
 * Subtract Vec2 'v' from this Vec2
 * @param {Vec2} v    
 */
Vec2.prototype.sub = function (v)
{
    /*
     * \todo needs to be implemented
     */    
    // throw new Error("UNIMPLEMENTED FUNCTION");
    this.array.set([this.array[0] - v.array[0], this.array[1] - v.array[1]]);
};

/**
 * @author Zachary Wartell 
 * Treat this Vec2 as a column matrix and multiply it by Mat2 'm' to it's left, i.e.
 * 
 * v = m * v
 * 
 * @param {Mat2} m    
 */
Vec2.prototype.multiply = function (m)
{
     this.array.set([this.array[0]*m.array[0] + this.array[1]*m.array[2],
                     this.array[0]*m.array[1] + this.array[1]*m.array[3] ]);
};

/**
 * @author Zachary Wartell
 * Treat this Vec2 as a row matrix and multiply it by Mat2 'm' to it's right, i.e.
 * 
 * v = v * m
 * 
 * @param {Mat2} m
 */
Vec2.prototype.rightMultiply = function (m)
{
     this.array.set([this.array[0]*m.array[0] + this.array[1]*m.array[1],
                     this.array[0]*m.array[2] + this.array[1]*m.array[3] ]);
};

/**
 * @author Zachary Wartell
 * Return the dot product of this Vec2 with Vec2 'v'
 * @param {Vec2} v    
 * @return {Number}
 */
Vec2.prototype.dot = function (v)
{
    /*
     * \todo needs to be implemented
     */
    // throw new Error("UNIMPLEMENTED FUNCTION");
    var a = this.array[0] * v.array[0];
    var b = this.array[1] * v.array[1];

    var dotProduct = a + b;

    return dotProduct;
};

/**
 * @author Zachary Wartell 
 * Return the magnitude (i.e. length) of of this Vec2 
 * @return {Number}
 */
Vec2.prototype.mag = function ()
{
    /*
     * \todo needs to be implemented
     */
    // throw new Error("UNIMPLEMENTED FUNCTION");
    var positiveX = Math.abs(this.array[0]);
    var positiveY = Math.abs(this.array[1]);

    var squared_x = Math.pow(positiveX, 2);
    var squared_y = Math.pow(positiveY, 2);

    var answer = Math.sqrt(squared_x + squared_y);

    return answer;
};

/**
 * @author Zachary Wartell && ... 
 * This contains misc. code for testing and demonstrating the functions in this file.
 * 
 * Note, the tests are not meant to be comprehensive, but rather only provide examples.
 * 
 * Students can add to this function for testing their additional math2d.js code...
 * 
 * @returns {undefined}
 */
function Mat2_test()
{
    var M1 = new Mat2(), M2 = new Mat2();
    var v0 = new Vec2(), v1 = new Vec2([5.0,5.0]), v2, 
            vx = new Vec2([1.0,0.0]),
            vy = new Vec2([0.0,1.0]);
                
    var rad = 45 * Math.PI/180;
    M1.set(0,0, Math.cos(rad)); M1.set(0,1, -Math.sin(rad)); 
    M1.set(1,0, Math.sin(rad)); M1.set(1,1,  Math.cos(rad));
    
    M2.set(0,0, Math.cos(rad)); M2.set(0,1, -Math.sin(rad)); 
    M2.set(1,0, Math.sin(rad)); M2.set(1,1,  Math.cos(rad));    
       
    v0.x = 1.0;
    v0.y = 2.0;
    v0.y += 1.0;
    v2 = new Vec2(v0);
    v2.add(v1);
    console.assert(v2.x === 6 && v2.y === 8);
    
    vx.multiply(M1);       
    vy.multiply(M1);  
           
    console.assert(equalfd(vy.x,-Math.sin(rad)) && equalfd (vy.y,Math.cos(rad)) &&
                   equalfd(vx.x, Math.cos(rad)) && equalfd (vx.y,Math.sin(rad)));
     
}
