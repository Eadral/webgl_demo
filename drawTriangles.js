let VSHADER_SOURCE =
    'attribute vec4 a_Position;' +
    'uniform mat4 u_ModelMatrix;' +
    'void main() {' +
    '   gl_Position = u_ModelMatrix * a_Position;' +
    '}';

let FSHADER_SOURCE =
    'precision mediump float;' +
    'uniform vec4 u_FragColor;' +
    'void main() {' +
    '   gl_FragColor = u_FragColor;' +
    '}';

let ANGLE = 15.0;
let ANGLE_STEP = 45.0;

function main() {
    let canvas = document.getElementById('webgl');

    let gl = getWebGLContext(canvas);
    if (!gl) {
        console.log('Failed to get gl');
        return;
    }

    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.log('Failed to initialize shaders');
        return;
    }

    let n = initVertexBuffers(gl);
    if (n < 0) {
        console.log('failed');
        return;
    }

    let u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
    let u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');

    gl.uniform4f(u_FragColor, 0.5, 0.5, 0.5, 1.0);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    let currentAngle = 0.0;
    let modelMatrix = new Matrix4();

    let tick = function() {
        currentAngle = animate(currentAngle);
        draw(gl, n, currentAngle, modelMatrix, u_ModelMatrix);
        requestAnimationFrame(tick);
    };
    tick();
}

function initVertexBuffers(gl) {
    let vertices = new Float32Array([
        -0.5, 0.5,
        -0.5, -0.5,
        0.5, 0.5,
        0.5, -0.5
    ]);

    let n = 4;

    let vertexBuffer = gl.createBuffer();
    if (!vertexBuffer) {
        console.log('Failed to create buffer');
        return -1;
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    let a_Position = gl.getAttribLocation(gl.program, 'a_Position');

    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(a_Position);

    return n;
}
function draw(gl, n, currentAngle, modelMatrix, u_ModelMatrix) {
    modelMatrix.setRotate(currentAngle, 0, 0, 1);

    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);

    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, n);
}

let g_last = Date.now();
function animate(angle) {
    let now = Date.now();
    let elapsed = now - g_last;
    g_last = now;
    let newAngle = angle + (ANGLE_STEP * elapsed) / 1000.0;
    return newAngle % 360;
}


