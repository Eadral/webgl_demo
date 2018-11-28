let VSHADER_SOURCE =
    'attribute vec4 a_Position;' +
    'attribute float a_PointSize;' +
    'void main() {' +
    '   gl_Position = a_Position;' +
    '   gl_PointSize = a_PointSize;' +
    '}';

let FSHADER_SOURCE =
    'precision mediump float;' +
    'uniform vec4 u_FragColor;' +
    'void main() {' +
    '   gl_FragColor = u_FragColor;' +
    '}';

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

    let a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    let a_PointSize = gl.getAttribLocation(gl.program, 'a_PointSize');

    let u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');

    canvas.onmousedown = function(ev) {
        click(ev, gl, canvas, a_Position, u_FragColor);
    };

    gl.vertexAttrib1f(a_PointSize, 10.0);

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
}

let g_points = [];
let g_colors = [];
function click(ev, gl, canvas, a_Position, u_FragColor) {
    let x = ev.clientX;
    let y = ev.clientY;
    let rect = ev.target.getBoundingClientRect();

    x = ((x - rect.left) - canvas.height/2)/(canvas.height/2);
    y = (canvas.width/2 - (y - rect.top))/(canvas.height/2);

    g_points.push([x, y]);
    g_colors.push([(x + 1) / 2, (y + 1) / 2, 100.0, 1.0]);

    gl.clear(gl.COLOR_BUFFER_BIT);

    let len = g_points.length;
    for (let i = 0; i < len; i++) {
        let xy = g_points[i];
        let rgba = g_colors[i];
        gl.vertexAttrib3f(a_Position, xy[0], xy[1], 0.0);
        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
        gl.drawArrays(gl.POINTS, 0, 1);
    }

}

