var GameObject = function (obj, textureName) {
  this.position = {x: 0, y: 0, z: 0}
  this.scale = {x: 1, y: 1, z: 1}
  this.rotation = {x: 0, y: 0, z: 0}
  this.vertices = null
  this.vertexNormals = null
  this.textureCoords = null
  this.vertexIndices = null
  this.obj = obj
  this.imageTexture = null
  this.textureId = textureName
}

GameObject.prototype = {
  setPosition: function (x, y, z) {
    this.position = {x: x, y: y, z: z}
  },

  setScale: function (x, y, z) {
    this.scale = {x: x, y: y, z: z}
  },

  initBuffers: function () {
    this.vertexPositionBuffer = this.positionBuffer()
    this.vertexNormalBuffer = this.normalBuffer()
    this.vertexTextureCoordBuffer = this.textureCoordBuffer()
    this.initTexture()
  },

  draw: function () {
    mvPushMatrix()

    mat4.translate(model, model, [this.position.x, this.position.y, this.position.z])
    mat4.scale(model, model, [this.scale.x, this.scale.y, this.scale.z])
    mat4.rotateX(model, model, degToRad(this.rotation.x))
    mat4.rotateY(model, model, degToRad(this.rotation.y))
    mat4.rotateZ(model, model, degToRad(this.rotation.z))

 		this.cubeBindBuffers()

    mvPopMatrix()
  },

  cubeBindBuffers: function () {
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexPositionBuffer)
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0)

    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexNormalBuffer)
    gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, 3, gl.FLOAT, false, 0, 0)

    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexTextureCoordBuffer)
    gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, 2, gl.FLOAT, false, 0, 0)

    gl.activeTexture(gl.TEXTURE0)
    gl.bindTexture(gl.TEXTURE_2D, this.imageTexture)
    gl.uniform1i(shaderProgram.samplerUniform, 0)

    //gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.vertexIndexBuffer)
    setMatrixUniforms()
    //gl.drawElements(gl.TRIANGLES, this.vertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0)
    gl.drawArrays(gl.TRIANGLES, 0, this.obj.vertices.length / 3)
  },

  handleLoadedTexture: function (texture) {
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture.image);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.generateMipmap(gl.TEXTURE_2D);

      gl.bindTexture(gl.TEXTURE_2D, null);
  },

  initTexture: function () {
    this.imageTexture = gl.createTexture();
    this.imageTexture.image = new Image();
    this.imageTexture.image.onload = function () { this.handleLoadedTexture(this.imageTexture) }.bind(this)
    this.imageTexture.image.src = this.textureId
  },


  positionBuffer: function () {
    var vertexPositionBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexPositionBuffer)
    var vertices = this.obj.vertices
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW)
    vertexPositionBuffer.itemSize = 3
    //vertexPositionBuffer.numItems = this.obj.vertexNumItens

    return vertexPositionBuffer
  },

  normalBuffer: function () {
    var vertexNormalBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexNormalBuffer)
    var vertexNormals = this.obj.vertexNormals
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexNormals), gl.STATIC_DRAW)
    vertexNormalBuffer.itemSize = 3
    //vertexNormalBuffer.numItems = this.obj.normalNumItens

    return vertexNormalBuffer
  },

  textureCoordBuffer: function () {
    var vertexTextureCoordBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexTextureCoordBuffer)
    var textureCoords = this.obj.textureCoords
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoords), gl.STATIC_DRAW)
    vertexTextureCoordBuffer.itemSize = 2
    //vertexTextureCoordBuffer.numItems = this.obj.textureNumItens

    return vertexTextureCoordBuffer
  }
}
