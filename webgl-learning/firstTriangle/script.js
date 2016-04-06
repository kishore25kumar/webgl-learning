/*jslint vars:true, nomen:true*/
/*globals define, document, window */

var start = function () {
    "use strict";

    var canvas = document.getElementById("3dCanvas");

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    var GL;

    try {
        GL = canvas.getContext("experimental-webgl", { antialias: false });
    } catch (e) {
        window.alert("The browser is not webgl compatible" + e);

        return false;
    }

    var getShader = function (source, type, typeString) {
        var shader = GL.createShader(type);

        GL.shaderSource(shader, source);
        GL.compileShader(shader);

        if (!GL.getShaderParameter(shader, GL.COMPILE_STATUS)) {
            window.alert("Error in shader compilation " + typeString + " \n" + GL.getShaderInfoLog(shader));

            return false;
        }

        return shader;
    };

    var vertexShader = getShader(document.getElementById("vertexShader").text, GL.VERTEX_SHADER, "VERTEX");
    var fragmentShader = getShader(document.getElementById("fragmentShader").text, GL.FRAGMENT_SHADER, "FRAGMENT");
    var shaderProgram = GL.createProgram();

    GL.attachShader(shaderProgram, vertexShader);
    GL.attachShader(shaderProgram, fragmentShader);

    GL.linkProgram(shaderProgram);

    var position = GL.getAttribLocation(shaderProgram, "position");

    GL.enableVertexAttribArray(position);
    GL.useProgram(shaderProgram);

    // Construction of triangle
    var triangleVertex = [-1, -1, 1, -1, 1, 1];
    var triangleVertexBuffer = GL.createBuffer();

    GL.bindBuffer(GL.ARRAY_BUFFER, triangleVertexBuffer);
    GL.bufferData(GL.ARRAY_BUFFER, new window.Float32Array(triangleVertex), GL.STATIC_DRAW);

    var triangleFaces = [0, 1, 2];
    var triangleFacesBuffer = GL.createBuffer();

    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, triangleFacesBuffer);
    GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new window.Uint16Array(triangleFaces), GL.STATIC_DRAW);

    // Drawing
    GL.clearColor(0.0, 0.0, 0.0, 0.0);

    var animate = function () {
        GL.viewport(0.0, 0.0, canvas.width, canvas.height);
        GL.clear(GL.COLOR_BUFFER_BIT);

        GL.bindBuffer(GL.ARRAY_BUFFER, triangleVertexBuffer);
        GL.vertexAttribPointer(position, 2, GL.FLOAT, false, 4 * 2, 0);
        GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, triangleFacesBuffer);
        GL.drawElements(GL.TRIANGLES, 3, GL.UNSIGNED_SHORT, 0);

        GL.flush();

        window.requestAnimationFrame(animate);
    };

    animate();
};

start();
