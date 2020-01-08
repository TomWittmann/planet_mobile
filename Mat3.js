/**
 * @author Zachary Wartell, ...
 * 
 * Mat3.js is a set of geometry and linear algebra functions related to 3x3 Matrices.
 * 
 * Students are given a initial set of classes and functions are expected to extend these and add
 * additional functions to this file.
 * 
 */

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
/*
Function expression. An anonumous function.
You can't call a function expression before
it is defined but you can call a function declaration
before it is defined.
 */
var Mat3 = function ()
{
    /*
    The arguments object is available in all functions
    and it specifies how many arguments are passed
    into the function.

    0, 1, 2,      0, 3, 6,
    3, 4, 5,  to  1, 4, 7,
    6, 7, 8       2, 5, 8

     */
    if (arguments.length === 9) {

        this.array[0] = arguments[0];
        this.array[3] = arguments[1];
        this.array[6] = arguments[2];
        this.array[1] = arguments[3];
        this.array[4] = arguments[4];
        this.array[7] = arguments[5];
        this.array[2] = arguments[6];
        this.array[5] = arguments[7];
        this.array[8] = arguments[8];

    } else if (arguments.length === 1) {

        if (arguments[0] instanceof Array) {

            this.array = new Float32Array(9);
            this.array.set(arguments[0]);

        } else if (arguments[0] instanceof Mat3) {

            this.array = new Float32Array(9);
            this.array.set(arguments[0].array);

        } else
            throw new Error("Unsupported Type");
    } else {
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
    return this.array[c * 3 + r];
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
    this.array[c * 3 + r] = val;
};

/**
 * @author Zachary Wartell
 * 'det' return the determinant of this Mat3
 * @returns {Number}
 */
Mat3.prototype.det = function ()
{
    return  this.array[0] * (this.array[4] * this.array[8] - this.array[5] * this.array[7]) +
            -this.array[3] * (this.array[1] * this.array[8] - this.array[2] * this.array[7]) +
            this.array[6] * (this.array[1] * this.array[5] - this.array[2] * this.array[4]);
};

/**
 * @author Zachary Wartell
 * 
 * Right multiply this Mat3 by a matrix 'matrix', i.e.
 * in mathematical notation, let 'M' equal this Mat3, and 'M1' equal 'matrix':
 *     M = M * M1
 * 
 * @param {Mat3} matrix
 */
Mat3.prototype.multiply = function (matrix)
{
    if (!(matrix instanceof Mat3)) {
        throw new Error("Unsupported Type");
    } else {
        // // \todo implement this algorithm
        // throw new Error("UNIMPLEMENTED FUNCTION");
        /*
        Multiply the matricies.
        Product should be another 3x3 matrix.
        Result matrix is the matrix from the multiplication.
         */
        this.array.set([            this.array[0] * matrix.array[0] + this.array[3] * matrix.array[1] + this.array[6] * matrix.array[2], //0

                                    this.array[1] * matrix.array[0] + this.array[4] * matrix.array[1] + this.array[7] * matrix.array[2], //1

                                    this.array[2] * matrix.array[0] + this.array[5] * matrix.array[1] + this.array[8] * matrix.array[2], //2

                                    this.array[0] * matrix.array[3] + this.array[3] * matrix.array[4] + this.array[6] * matrix.array[5], //3

                                    this.array[1] * matrix.array[3] + this.array[4] * matrix.array[4] + this.array[7] * matrix.array[5], //4

                                    this.array[2] * matrix.array[3] + this.array[5] * matrix.array[4] + this.array[8] * matrix.array[5], //5

                                    this.array[0] * matrix.array[6] + this.array[3] * matrix.array[7] + this.array[6] * matrix.array[8], //6

                                    this.array[1] * matrix.array[6] + this.array[4] * matrix.array[7] + this.array[7] * matrix.array[8], //7

                                    this.array[2] * matrix.array[6] + this.array[5] * matrix.array[7] + this.array[8] * matrix.array[8]]); //8
    }

};
/*
Transpose for calculating the inverse matrix.
 */
Mat3.prototype.transpose = function (matrix)
{
    if (!(matrix instanceof Mat3)) {
        throw new Error("Unsupported Type");
    } else {
        var transpose = new Mat3();
        transpose.array[0] = matrix[0];
        transpose.array[3] = matrix[1];
        transpose.array[6] = matrix[2];
        transpose.array[1] = matrix[3];
        transpose.array[4] = matrix[4];
        transpose.array[7] = matrix[5];
        transpose.array[2] = matrix[6];
        transpose.array[5] = matrix[7];
        transpose.array[8] = matrix[8];
        return transpose;
    }


}
/**
 * @author Zachary Wartell
 * 
 * Left multiply this Mat3 by a matrix 'matrix' (denoted M1).
 * In mathematical notation, let 'M' equal this Mat, and 'M1' equal 'matrix':
 *    M = M1 * M
 * 
 * For many calculations Mat3.multiply (a 'right multiply') is sufficient, but occasionally being able to leftMultiply is useful.
 * 
 * @param {Mat3} matrix
 */
Mat3.prototype.leftMultiply = function (matrix)
{
    if (!(matrix instanceof Mat3)) {
        throw new Error("Unsupported Type");
    } else {
        // \todo implement if/when needed
        // throw new Error("UNIMPLEMENTED FUNCTION");

        this.array.set([    matrix.array[0] * this.array[0] + matrix.array[3] * this.array[1] + matrix.array[6] * this.array[2], //0

                            matrix.array[1] * this.array[0] + matrix.array[4] * this.array[1] + matrix.array[7] * this.array[2], //1

                            matrix.array[2] * this.array[0] + matrix.array[5] * this.array[1] + matrix.array[8] * this.array[2], //2

                            matrix.array[0] * this.array[3] + matrix.array[3] * this.array[4] + matrix.array[6] * this.array[5], //3

                            matrix.array[1] * this.array[3] + matrix.array[4] * this.array[4] + matrix.array[7] * this.array[5], //4

                            matrix.array[2] * this.array[3] + matrix.array[5] * this.array[4] + matrix.array[8] * this.array[5], //5

                            matrix.array[0] * this.array[6] + matrix.array[3] * this.array[7] + matrix.array[6] * this.array[8], //6

                            matrix.array[1] * this.array[6] + matrix.array[4] * this.array[7] + matrix.array[7] * this.array[8], //7

                            matrix.array[2] * this.array[6] + matrix.array[5] * this.array[7] + matrix.array[8] * this.array[8]]); //8
    }

};

/**
 * @author Zachary Wartell
 * Set this Mat3 to a new 2D translation matrix that translates by vector [x,y]
 * 
 * @param {[Number, Number]} translate
 */
Mat3.prototype.setTranslate = function (translate)
{
    if (translate instanceof Array)
    {
        this.array[0] = 1.0;
        this.array[3] = 0.0;
        this.array[6] = translate[0];
        this.array[1] = 0.0;
        this.array[4] = 1.0;
        this.array[7] = translate[1];
        this.array[2] = 0.0;
        this.array[5] = 0.0;
        this.array[8] = 1.0;
    } else
        throw new Error("Unsupported Type");
};

/**
 * @author Zachary Wartell
 * 
 * Right multiply this Mat3 by a 2D translation matrix that translates by vector [x,y], i.e.
 * in mathematical notation, let 'M' equal this Mat3, and 'M_t' equal the translate matrix:
 *     M = M * 
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
                 translate[0], translate[1], 1.0]);
        this.multiply(M_t);
    } else
        throw new Error("Unsupported Type");
};

/**
 * @author Zachary Wartell
 * 
 * Left multiply this Mat3 by a 2D translation matrix that translates by vector [x,y], i.e.
 * in mathematical notation, let 'M' equal this Mat3, and 'M_t' equal the translate matrix:
 *     M = M_t * M
 * 
 * See also comment on Mat3.prototype.leftMultiply
 * 
 * @param {[Number, Number]} - translate vector
 */
Mat3.prototype.leftTranslate = function (translate)
{
    if (translate instanceof Array)
    {
        var M_t = new Mat3([1.0, 0.0, 0.0,
                            0.0, 1.0, 0.0,
                            translate[0], translate[1], 1.0]);
        this.leftMultiply(M_t);
    } else
        throw new Error("Unsupported Type");
};

/**
 * @author Zachary Wartell && ..
 * set this Mat3 to a new 2D scale matrix that scales by scale factors [sx,sy]
 * 
 * @param {[Number, Number]} scale_factors
 */
Mat3.prototype.setScale = function (scale_factors)
{
    /* \todo implement */
    // throw new Error("UNIMPLEMENTED FUNCTION");
    /*
    To set the scale factor you multiply
    the diagonal by the scale values.
     */
    if (scale_factors instanceof Array)
    {
        this.array[0] = scale_factors[0];
        this.array[3] = 0.0;
        this.array[6] = 0.0;
        this.array[1] = 0.0;
        this.array[4] = scale_factors[1];
        this.array[7] = 0.0;
        this.array[2] = 0.0;
        this.array[5] = 0.0;
        this.array[8] = 1.0;
    } else
        throw new Error("Unsupported Type");
};
/**
 * @author Zachary Wartell && ..
 * Right multiply this Mat3 by the 2D scale matrix that scales by scale factors [sx,sy], i.e.
 * in mathematical notation, let 'M' equal this Mat3, and 'M_s' equal the scale matrix:
 *      M = M * M_s
 * 
 * @param {[Number, Number]} - scale factors
 *
 */
Mat3.prototype.scale = function (scale_factors)
{
    /* \todo implement */
    //throw new Error("UNIMPLEMENTED FUNCTION");
    if (scale_factors instanceof Array) {
        var M_s = new Mat3([scale_factors[0], 0.0, 0.0,
                            0.0, scale_factors[1], 0.0,
                            0.0, 0.0, 1.0]);
        this.multiply(M_s);
    } else {
        throw new Error("Unsupported Type.");
    }
};

/**
 * @author Zachary Wartell && ..
 * Left multiply this Mat3 by the 2D scale matrix that scales by scale factors [sx,sy], i.e.
 * in mathematical notation, let 'M' equal this Mat3, and 'M_s' equal the scale matrix:
 *      M = M_s * M
 * 
 * @param {[Number, Number]} - scale_factors
 */
Mat3.prototype.leftScale = function (scale_factors)
{
    /* \todo implement */
    // throw new Error("UNIMPLEMENTED FUNCTION");
    if (scale_factors instanceof Array)
    {
        var M_s = new Mat3([scale_factors[0], 0.0, 0.0,
                            0.0, scale_factors[1], 0.0,
                            0.0, 0.0, 1.0]);
        this.leftMultiply(M_s);
    } else
        throw new Error("Unsupported Type");
};

/**
 * @author Zachary Wartell && ..
 * set this Mat3 to a new 2D rotation matrix that rotates by angle 'angle'
 *  
 * @param {Number} angle - measured in degrees
 */
Mat3.prototype.setRotate = function (angle)
{
    /* \todo implement */
    // throw new Error("UNIMPLEMENTED FUNCTION");
    var rad = angle * Math.PI / 180;
        this.array[0] = Math.cos(rad);
        this.array[3] = -Math.sin(rad);
        this.array[6] = 0.0;
        this.array[1] = Math.sin(rad);
        this.array[4] = Math.cos(rad);
        this.array[7] = 0.0;
        this.array[2] = 0.0;
        this.array[5] = 0.0;
        this.array[8] = 1.0;
};

/**
 * @author
 * Right multiply this Mat3 by the 2D rotation matrix that rotates by angle 'angle', e.g.
 * in mathematical notation, let 'M' equal this Mat3, and 'M_r' equal the rotation matrix:
 *      M = M * M_r 
 * 
 * @param {Number} angle - measured in degrees
 */
Mat3.prototype.rotate = function (angle)
{
    /* \todo implement */
    // throw new Error("UNIMPLEMENTED FUNCTION");
    var rad = arguments[0] * Math.PI / 180;
    var M_r = new Mat3([Math.cos(rad), -Math.sin(rad), 0.0,
                        Math.sin(rad), Math.cos(rad), 0.0,
                         0.0, 0.0, 1.0]);
    this.multiply(M_r);
};

/**
 * @author Zachary Wartell && ..
 * Left multiply this Mat3 by the 2D rotation matrix that rotates by angle 'angle', e.g.
 * in mathematical notation, let 'M' equal this Mat3, and 'M_r' equal the rotation matrix:
 *      M = M_r * M
 *      
 * See comment on Mat3.prototype.leftMultiply
 * 
 * @param {Number} angle - measured in degrees
 */
Mat3.prototype.leftRotate = function (angle)
{
    /* \todo implement as needed */
    // throw new Error("UNIMPLEMENTED FUNCTION");
    var rad = arguments[0] * Math.PI / 180;
        var M_r = new Mat3([Math.cos(rad), -Math.sin(rad), 0.0,
                            Math.sin(rad), Math.cos(rad), 0.0,
                            0.0, 0.0, 1.0]);
        this.leftMultiply(M_r);
};

/**
 * @author Zachary Wartell
 * set this Mat3 to the identity matrix
 *  
 */
Mat3.prototype.setIdentity = function ()
{
    this.array[0] = 1.0;
    this.array[3] = 0.0;
    this.array[6] = 0.0;
    this.array[1] = 0.0;
    this.array[4] = 1.0;
    this.array[7] = 0.0;
    this.array[2] = 0.0;
    this.array[5] = 0.0;
    this.array[8] = 1.0;
};

/**
 * @author Zachary Wartell 
 * Constructor of Vec3. 
 * 
 * Vec3 represents one of several different types of geometric objects or linear algebra objects.
 * Vec3 represents either:
 *    - the homogenous coordinates of 2D geometric points or vectors, stored as (x,y,w)   
 * OR 
 *    - the regular coordinates of 3D geometric points or vectors, stored as (x,y,z)
 * 
 * For 2D computations, the Vec3 should be used as (x,y,w), while for 3D computations it should be used as (x,y,z).
 * 
 * For operations combining Mat3 and Vec3 (which are 2D geometry computations), Vec3 is typically treated as a column matrix:
 *         | x |
 *         | y |
 *         | w |
 * 
 * but some Mat3 methods treat Vec3 as a row matrix [x y w]
 * 
 * @param {nul | Array | Float32Array | Vec3 | Vec2 , Number | Number, Number , Number }
 */
var Vec3 = function ()
{
    this.array = new Float32Array(3);
    if (arguments.length === 0)
        // no arguements, so initial to 0's        
        this.array.set([0.0, 0.0, 0.0]);
    /*
    ...arguments makes an array of the arguments.
     */
    else        
        this.set(...arguments); // ES6 'spread' operator
    
};

/**
 * @author Zachary Wartell 
 * Vec3 properties provides a syntax for setting/getting coordinates of this Vec3 (see Mat3_test for example usage).
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
            /* use ONLY when Vec3 is used for storing 3D point/vector (non-homogenous) coordinates */
            "z": {get: function () {
                    return this.array[2];
                },
                set: function (v) {
                    this.array[2] = v;
                }},
            /* use ONLY when Vec3 is used for storing 2D point/vector homogenous coordinates */
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
 * 
 * Treat this Vec3 as a column matrix and multiply it by Mat3 'M' on it's left, i.e.
 * mathematically, denoting this Vec3 as 'v'
 *   v = M v
 * 
 * @param {Mat3} m    
 */
Vec3.prototype.multiply = function (M)
{
    if (!(M instanceof Mat3))
        throw new Error("Unsupported Type");

    this.array.set([this.array[0] * M.array[0] + this.array[1] * M.array[3] + this.array[2] * M.array[6],
        this.array[0] * M.array[1] + this.array[1] * M.array[4] + this.array[2] * M.array[7],
        this.array[0] * M.array[2] + this.array[1] * M.array[5] + this.array[2] * M.array[8]]);
};

/**
 * @author Zachary Wartell
 *
 * Treat this Vec3 as a row matrix and multiply it by Mat3 'M' on it's right, i.e.
 * mathematically, denoting this Vec3 as 'v'
 *    v = v M
 *  
 * For many calculations Vec3.multiply (a 'left multiply') is sufficient, but occasionally being able to rightMultiply is useful.
 *  
 * @param {Mat3} m
 */
Vec3.prototype.rightMultiply = function (M)
{
    if (!(M instanceof Mat3))
        throw new Error("Unsupported Type");
    // \todo implement if/when needed 
    // throw new Error("UNIMPLEMENTED FUNCTION");

    this.array.set([M.array[0] * this.array[0] + M.array[1] * this.array[3] + M.array[2] * this.array[6],
        M.array[0] * this.array[1] + M.array[1] * this.array[4] + M.array[2] * this.array[7],
        M.array[0] * this.array[2] + M.array[1] * this.array[5] + M.array[2] * this.array[8]]);
};

/*
 * @author Zachary Wartell
 * 
 * Set this Vec3 coordinates to values in arguments
 * 
 * @param {Array | Float32Array | Vec3 | Vec2 , Number | Number, Number , Number }
 * @returns {undefined}
 */
Vec3.prototype.set = function ()
{
    if (arguments.length === 1)
    {
        if (arguments[0] instanceof Array)
            this.array.set(arguments[0]);
        else if (arguments[0] instanceof Float32Array)        
            this.array.set(arguments[0]);
        else if (arguments[0] instanceof Vec3)        
            this.array.set(arguments[0].array);
        else
            throw new Error("Unsupported Type");        
    } else if (arguments.length === 2) {
        if (arguments[0] instanceof Vec2 && typeof arguments[1] === 'number')
        {
            this.x = arguments[0].x;
            this.y = arguments[0].y;
            this.w = arguments[1];
        } else
            throw new Error("Unsupported Type");        
    } else if (arguments.length === 3) {
        this.array.set(arguments);
    } else
      throw new Error("Unsupported Type");        
};


/**
 * @author Zachary Wartell && ... 
 * This contains misc. code for testing and demonstrating the functions in this file.
 * 
 * Student Note: The tests are not meant to be comprehensive, but rather only provide examples.
 * Students can add to this function for testing their additional code...
 * 
 * @returns {undefined}
 */
function Mat3_test()
{
    var M1 = new Mat2();
    var M2 = new Mat3();
    var v0 = new Vec2(), v1 = new Vec2([5.0, 5.0]), v2,
            vx = new Vec2([1.0, 0.0]),
            vy = new Vec2([0.0, 1.0]),
            vx_h = new Vec3([1.0, 0.0, 0.0]), /* 'h' is for homogenous coordinate */
            vy_h = new Vec3(0.0, 1.0, 0.0),
            po_h = new Vec3();

    var rad = 45 * Math.PI / 180;
    M1.set(0, 0, Math.cos(rad));
    M1.set(0, 1, -Math.sin(rad));
    M1.set(1, 0, Math.sin(rad));
    M1.set(1, 1, Math.cos(rad));

    M2.set(0, 0, Math.cos(rad));
    M2.set(0, 1, -Math.sin(rad));
    M2.set(1, 0, Math.sin(rad));
    M2.set(1, 1, Math.cos(rad));

    v0.x = 1.0;
    v0.y = 2.0;
    v0.y += 1.0;
    v2 = new Vec2(v0);
    v2.add(v1);
    console.assert(v2.x === 6 && v2.y === 8);

    vx.multiply(M1);
    vy.multiply(M1);

    console.assert(equalfd(vy.x, -Math.sin(rad)) && equalfd(vy.y, Math.cos(rad)) &&
            equalfd(vx.x, Math.cos(rad)) && equalfd(vx.y, Math.sin(rad)));

    var po = new Vec2([0,0]);
    po_h.set (po,1);

    vx_h.multiply(M2);
    vy_h.multiply(M2);
    po_h.multiply(M2);
    console.assert(equalfd(vy_h.x, -Math.sin(rad)) && equalfd(vy_h.y, Math.cos(rad)) &&
            equalfd(vx_h.x, Math.cos(rad)) && equalfd(vx_h.y, Math.sin(rad)));

    var M3 = new Mat3();
    M3.setTranslate([10.0, 15.0]);
    M3.translate([5.0, 5.0]);
    po_h.multiply(M3);

    console.log(po_h.x + " " + po_h.y);

    console.assert(equalfd(po_h.x, 15) && equalfd(po_h.y, 20));

    var M4 = new Mat3(), M5 = new Mat3();

    M4.setTranslate([10, 10]);
    M4.rotate(50);
    M4.scale([5, 10]);

    M5.setTranslate([-10, -10]);
    M5.leftRotate(-50);
    M5.leftScale([1 / 5, 1 / 10]);

    MI = new Mat3(M5);
    MI.multiply(M4);

    /* \todo add more tests as needed */
}
