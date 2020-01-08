/**
 * @author Zachary Wartell, ...
 * 
 * math2D.js is a set of 2D geometry related math functions and classes.
 * 
 * Students are given a initial set of classes and functions are expected to extend these and add
 * additional functions to this file.
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
 * Constructor of Mat3, a 3x3 matrix 
 * 
 * For efficiency we use a Typed Array.  Elements are stored in 'column major' layout, i.e.
 * for matrix M with math convention M_rc (r=row,c=column)
 *    this.array = [ M_00, M_10, M_20,   // first column
 *                   M_01, M_11, M_12,  // second column
 *                   M_02, M_12, M_22 ];// third column                  
 *                   
 * When the constructor is called with a Array or Float32Array parameter the above convention should be followed.
 *                                     
 * (Note, column major order is consistent with OpenGL and GLSL).
 *                   
 * @param {null | Array | Float32Array | Mat3 | M_00,M_01,M_02, M_10, M_10, M_11, M_12, M_20, M_21, M_22} - initial value for this Mat3               
 * @returns {Mat3}
 */
var Mat3 = function()
{
    if (arguments.length === 9)                
    {    
        this.array[0] = arguments[0];  this.array[3] = arguments[1]; this.array[6] = arguments[2];
        this.array[1] = arguments[3];  this.array[4] = arguments[4]; this.array[7] = arguments[5];
        this.array[2] = arguments[6];  this.array[5] = arguments[7]; this.array[8] = arguments[8];
    }
    else if (arguments.length === 1)    
    {
        if (arguments[0] instanceof Array)
        {
            this.array = new Float32Array(9);
            this.array.set(arguments[0]);
        }
        else if (arguments[0] instanceof Mat3)
        {
            this.array = new Float32Array(9);
            this.array.set(arguments[0].array);
        }     
        else
            throw new Error("Unsupported Type");
    }
    else
    {
        this.array = new Float32Array(9);
        this.array.set([1.0, 0.0, 0.0,
            0.0, 1.0, 0.0,
            0.0, 0.0, 1.0]);
    }
};

/**
 * @author Zachary Wartell
 * 'get' returns element in row r, column c of this Mat3
 * @param {Number} r - row
 * @param {Number} c - column
 * @returns {Number}
 */
Mat3.prototype.get = function (r, c)
{
    return this.array[c*3+r];
};

/**
 * @author Zachary Wartell
 * 'set' sets element at row r, column c to value 'val'.
 * @param {Number} r - row 
 * @param {Number} c - column
 * @param {Number} val - value
 * @returns {Number}
 */
Mat3.prototype.set = function (r, c, val)
{
    this.array[c*3+r] = val;
};

/**
 * @author Zachary Wartell
 * 'det' return the determinant of this Mat3
 * @returns {Number}
 */
Mat3.prototype.det = function ()
{
    return  this.array[0] * (this.array[4]*this.array[8] - this.array[5] * this.array[7]) +
           -this.array[3] * (this.array[1]*this.array[8] - this.array[2] * this.array[7]) +
            this.array[6] * (this.array[1]*this.array[5] - this.array[2] * this.array[4]);
};

/**
 * @author Zachary Wartell
 * right multiply this Mat3 (denoted 'M') by a matrix 'matrix' (denoted M1), e.g.
 * 
 * M = M * M1
 * 
 * @param {Mat3} matrix
 */
Mat3.prototype.multiply = function (matrix)
{
    if (matrix instanceof Mat3)
    {
        var r,c;
        var Mr = new Float32Array(9); /* 'MatrixResult' */
        for (r=0;r<=2;r++)
        {
            for (c=0;c<=2;c++)
            {     
                Mr[c*3+r] = this.get(r,0)*matrix.get(0,c) + this.get(r,1)*matrix.get(1,c) +
                                  this.get(r,2)*matrix.get(2,c);
            }
        }
        this.array = Mr;
    }
    else
        throw new Error("Unsupported Type");
};
/**
 * @author Zachary Wartell
 * left multiply this Mat3 (denoted 'M') by a matrix 'matrix' (denoted M1), e.g.
 * 
 * M = M1 * M
 * 
 * Often, Mat3.prototype.multiply (a 'right multiply') is sufficient, but occasionally being able to leftMultiply can be useful.
 * 
 * @param {Mat3} matrix
 */
Mat3.prototype.leftMultiply = function (matrix)
{
    // \todo implement as needed
    throw new Error("UNIMPLEMENTED FUNCTION");
};

/**
 * @author Zachary Wartell
 * set (overwrite) this Mat3 to be a 2D translation matrix that translates by vector [x,y]
 * 
 * @param {[Number, Number]} translate
 */
Mat3.prototype.setTranslate = function (translate)
{
    if (translate instanceof Array)
    {
        this.array[0] = 1.0;  this.array[3] = 0.0;  this.array[6] = translate[0];
        this.array[1] = 0.0;  this.array[4] = 1.0;  this.array[7] = translate[1];
        this.array[2] = 0.0;  this.array[5] = 0.0;  this.array[8] = 1.0;
    }
    else
        throw new Error("Unsupported Type");
};

/**
 * @author Zachary Wartell
 * right multiply this Mat3 (denoted 'M') by the 2D translation matrix that translates by vector [x,y], e.g.
 * 
 * M = M * M_T(x,y)
 * 
 * @param {[Number, Number]} translate
 */
Mat3.prototype.translate = function (translate)
{
    if (translate instanceof Array)
    {
        var M_t = new Mat3(
                   [1.0, 0.0, 0.0,
                    0.0, 1.0, 0.0,
                    translate[0],translate[1],1.0]);
        this.multiply(M_t);        
    }
    else
        throw new Error("Unsupported Type");
};

/**
 * @author Zachary Wartell
 * left multiply this Mat3 (denoted 'M') by the 2D translation matrix that translates by vector [x,y], e.g.
 * 
 * M = M_T(x,y) * M 
 * 
 * See comment on Mat3.prototype.leftMultiply
 * 
 * @param {[Number, Number]} translate
 */
Mat3.prototype.leftTranslate = function (translate)
{
    if (translate instanceof Array)
    {
        var M_t = new Mat3([1.0, 0.0, 0.0,
                            0.0, 1.0, 0.0,
                            translate[0],translate[1],1.0]);            
        this.leftMultiply(M_t);        
    }
    else
        throw new Error("Unsupported Type");
};

/**
 * @author
 * set (overwrite) this Mat3 to be a 2D scale matrix that scales by scale factors [sx,sy]
 * 
 * @param {[Number, Number]} scale_factors
 */
Mat3.prototype.setScale = function (scale_factors)
{
    /* \todo implement */
    throw new Error("UNIMPLEMENTED FUNCTION");
};

/**
 * @author
 * right multiply this Mat3 (denoted 'M') by the 2D scale matrix that scales by scale factors [sx,sy], e.g.
 * 
 * M = M * M_S(x,y)
 * 
 * @param {[Number, Number]} scale_factors
 */
Mat3.prototype.scale = function (scale_factors)
{
    /* \todo implement */
    throw new Error("UNIMPLEMENTED FUNCTION");
};

/**
 * @author
 * left multiply this Mat3 (denoted 'M') by the 2D scale matrix that scales by scale factors [sx,sy], e.g.
 * 
 * M = M_S(sx,sy) * M 
 * 
 * @param {[Number, Number]} scale_factors
 */
Mat3.prototype.leftScale = function (scale_factors)
{
    /* \todo implement */
    throw new Error("UNIMPLEMENTED FUNCTION");
};

/**
 * @author
 * set (overwrite) this Mat3 to be the 2D rotation matrix that rotates by angle 'angle'
 *  
 * @param {Number} angle - measured in degrees
 */
Mat3.prototype.setRotate = function (angle)
{
    /* \todo implement */
    throw new Error("UNIMPLEMENTED FUNCTION");
};

/**
 * @author
 * right multiply this Mat3 multiply this Mat3 (denoted 'M') by the 2D rotation matrix that rotates by angle 'angle', e.g.
 * 
 * M = M * M_R(angle)
 * 
 * @param {Number} angle - measured in degrees
 */
Mat3.prototype.rotate = function (angle)
{
    /* \todo implement */
    throw new Error("UNIMPLEMENTED FUNCTION");
};

/**
 * @author
 * left multiply this Mat3 (denoted 'M') by the 2D rotation matrix that rotates by angle 'angle', e.g.
 * 
 * M = M_R(angle) * M 
 * 
 * See comment on Mat3.prototype.leftMultiply
 * 
 * @param {Number} angle - measured in degrees
 */
Mat3.prototype.leftRotate = function (angle)
{
    /* \todo implement as needed */
    throw new Error("UNIMPLEMENTED FUNCTION");
};

/**
 * @author Zachary Wartell
 * set (overwrite) this Mat3 to be the identity matrix
 *  
 */
Mat3.prototype.setIdentity = function ()
{
    this.array[0] = 1.0;  this.array[3] = 0.0;  this.array[6] = 0.0;
    this.array[1] = 0.0;  this.array[4] = 1.0;  this.array[7] = 0.0;
    this.array[2] = 0.0;  this.array[5] = 0.0;  this.array[8] = 1.0;
};

/**
 * @author Zachary Wartell 
 * Constructor of Vec3. Vec3 is is used to EITHER:
 *    - represent homogenous coordinates of 2D geometric points or vectors, stored as (x,y,w)   
 * OR 
 *    - represent regular coordinates of 3D geometric points or vectors, stored as (x,y,z) -- hence the 4th w coordinate is not stored.
 * 
 * For 2D computations, the Vec3 should be used as (x,y,w), while for 3D computations it should be used as (x,y,z).
 * 
 * For operations combining Mat3 and Vec3 (which are 2D computations), Vec3 is treated as a column matrix:
 *         | x |
 *         | y |
 *         | w |
 * 
 * @param {null | Vec3 | [Number, Number, Number]}
 */
var Vec3 = function ()
{
    if (arguments.length === 0)
    {// no arguements, so initial to 0's
        this.array = new Float32Array(3);
        this.array.set([0.0, 0.0,0.0]);
    }
    else if (arguments.length === 1)
    {// 1 argument, ...
        if (arguments[0] instanceof Vec3)
        {// argument is Vec3, so copy it
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
 *  Vec3 - provide alternate syntax for setting/getting coordinates of this Vec3 (see math2d_test for examples).
 */
var v = Vec3.prototype;
Object.defineProperties(Vec3.prototype,
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
                }},
            /* use when Vec3 is used for storing 3D point/vector (non-homogenous) coordinates */
            "z": {get: function () {
                    return this.array[2];
                },
                set: function (v) {
                    this.array[2] = v;
                }},
            /* use when Vec3 is used for storing 2D point/vector homogenous coordinates */
            "w": {get: function () {
                    return this.array[2];
                },
                set: function (v) {
                    this.array[2] = v;
                }}               
        }
);

/**
 * @author Zachary Wartell 
 * Treat this Vec3 as a column matrix (denoted 'v') and multiply it by Mat3 'M' on left of 'v', i.e.
 * 
 * v = M * v
 * 
 * @param {Mat3} m    
 */
Vec3.prototype.multiply = function (M)
{
     if (M instanceof Mat3)     
        this.array.set([this.array[0]*M.array[0] + this.array[1]*M.array[3] + this.array[2]*M.array[6],
                        this.array[0]*M.array[1] + this.array[1]*M.array[4] + this.array[2]*M.array[7],
                        this.array[0]*M.array[2] + this.array[1]*M.array[5] + this.array[2]*M.array[8]]);                     
    else
        throw new Error("Unsupported Type");                    
};

/**
 * @author Zachary Wartell
 * Treat this Vec3 as a row matrix (denoted 'v') and multiply it by Mat3 'M' on right of 'v', i.e.
 * 
 * v = v * M
 * 
 * Typically, Vec3.prototype.multiply is sufficient, but occasionally rightMultiply can be useful.
 * 
 * @param {Mat3} m
 */
Vec3.prototype.rightMultiply = function (M)
{
    if (M instanceof Mat3) 
        this.array.set([this.array[0]*M.array[0] + this.array[1]*M.array[1] + this.array[2]*M.array[2],
                        this.array[0]*M.array[3] + this.array[1]*M.array[4] + this.array[2]*M.array[5],
                        this.array[0]*M.array[6] + this.array[1]*M.array[7] + this.array[2]*M.array[8]]);                  
    else
        throw new Error("Unsupported Type");              
};

/*
 * Set this Vec3 coordinates to values stored in 'v'
 * @param {Array | Float32Array | Vec3} v
 * @returns {undefined}
 */
Vec3.prototype.set = function (v)
{    
    if (v instanceof Array)
    {
        this.array.set(v);
    }
    else if (v instanceof Float32Array)
    {
        this.array.set(v);
    }    
    else if (v instanceof Vec3)
    {
        this.array.set(v.array);
    }            
    else
        throw new Error("Unsupported Type");    
};

/* \todo implement the following functions as needed using the similar Vec2 functions as examples */
Vec3.prototype.add = function (v)
{   
    /* \todo implement as needed */
    throw new Error("UNIMPLEMENTED FUNCTION");
};
Vec3.prototype.sub = function (v)
{    
    /* \todo implement as needed */
    throw new Error("UNIMPLEMENTED FUNCTION");
};
// return xyz length of this Vec3 (assuming it represents a 3D coordinate (non-homogenous))
Vec3.prototype.mag = function ()
{    
    /* \todo implement as needed */
    throw new Error("UNIMPLEMENTED FUNCTION");
};
// return xy length of this Vec3 (assuming it represents a 2D homogenous coordinate)
Vec3.prototype.mag2 = function ()
{    
    /* \todo implement as needed */
    throw new Error("UNIMPLEMENTED FUNCTION");
};
// return the dot product of this Vec3 and Vec3 'v'
Vec3.prototype.dot = function (v)
{    
    throw new Error("UNIMPLEMENTED FUNCTION");
};


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

/*
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
    throw new Error("UNIMPLEMENTED FUNCTION");
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
    throw new Error("UNIMPLEMENTED FUNCTION");
    return 0;
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
    throw new Error("UNIMPLEMENTED FUNCTION");
    return 0;
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
function math2d_test()
{
    var M1 = new Mat2();
    var M2 = new Mat3();
    var v0 = new Vec2(), v1 = new Vec2([5.0,5.0]), v2, 
            vx = new Vec2([1.0,0.0]),
            vy = new Vec2([0.0,1.0]),
            vx_h = new Vec3([1.0,0.0,0.0]),  /* 'h' is for homogenous coordinate */
            vy_h = new Vec3([0.0,1.0,0.0]),
            po_h = new Vec3();
    
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
     
    po_h.x = 0; po_h.y = 0; po_h.w = 1;
    
    vx_h.multiply(M2);
    vy_h.multiply(M2);
    po_h.multiply(M2);    
    console.assert(equalfd(vy_h.x,-Math.sin(rad)) && equalfd (vy_h.y,Math.cos(rad)) &&
                   equalfd(vx_h.x, Math.cos(rad)) && equalfd (vx_h.y,Math.sin(rad)));    
    
    var M3 = new Mat3();
    M3.setTranslate([10.0,15.0]);
    M3.translate([5.0,5.0]);
    po_h.multiply(M3);
    
    console.assert(equalfd(po_h.x,15) && equalfd (po_h.y,20));
  
   
   
    var M4 = new Mat3(), M5 = new Mat3();
    
    M4.setTranslate([10,10]);
    M4.rotate(50);
    M4.scale([5,10]);
    
    M5.setTranslate([-10,-10]);
    M5.leftRotate(-50);
    M5.leftScale([1/5,1/10]);
    
    MI = new Mat3(M5);
    MI.multiply(M4);
    
    /* \todo add more tests as needed */
}
