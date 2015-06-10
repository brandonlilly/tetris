(function () {

  Tetris = function (ctx, width, height) {
    this.ctx = ctx;
    this.width = width;
    this.height = height;

    this.board = [];
    for(var i = 0; i < 20; i++) {
      this.board.push([])
    }

    this.bindKeys();
    this.generatePiece();

  };

  Tetris.prototype.step = function() {
    this.piece.advance();

    if (this.piece.isSettled()) {
      this.piece.eachBlockPos(function (x, y) {
        this.board[y][x] = 1;
      }.bind(this));
      this.generatePiece();
    }

    this.removeFilledRows();
  };

  Tetris.prototype.removeFilledRows = function() {
    for(var y = 0; y < 20; y++) {
      var filled = true;
      for(var x = 0; x < 10; x++) {
        if (!this.board[y][x]) {
          filled = false;
        }
      }
      if (filled) {
        this.board.splice(y, 1);
        this.board.unshift([]);
      }
    }
  };

  Tetris.prototype.bindKeys = function() {
    document.onkeydown = function(e) {
      switch (e.keyCode) {
        case 37: // left arrow
          this.piece.slide(-1);
          break;
        case 38: // up arrow
          this.piece.instantDrop();
          break;
        case 39: // right arrow
          this.piece.slide(1);
          break;
        case 40: // down arrow
          this.piece.advance();
          break;
        case 68: // d
          this.piece.rotate(1);
          break;
        case 65: // a
          this.piece.rotate(-1);
          break;
        default:
          console.log(e.keyCode);
      }
      this.render();
    }.bind(this);
  }

  Tetris.prototype.render = function() {
    this.ctx.clearRect(0, 0, this.width, this.height);

    this.ctx.beginPath();
    for(var y = 0; y < 20; y++) {
      for(var x = 0; x < 10; x++) {
        if (this.board[y][x]) {
          this.ctx.rect(x*40, y*40, 40, 40);
        }
      }
    }
    this.ctx.fillStyle = '#369';
    this.ctx.fill();

    this.ctx.beginPath();
    this.piece.eachBlockPos(function (x, y) {
      this.ctx.rect(x*40, y*40, 40, 40);
    }.bind(this));
    this.ctx.fillStyle = '#6DD3E3';
    this.ctx.fill();
  };

  Tetris.prototype.generatePiece = function() {
    var L = [[0,0],[0,-1],[0,1],[-1,1]];
    var T = [[0,0],[-1,0],[1,0],[0,1]];
    var pieceTypes = [L, T];
    var blocks = pieceTypes[Math.floor(Math.random()*pieceTypes.length)];
    this.piece = new Piece(blocks, 5, 1, this.board);
  };



  var Piece = function(blocks, x, y, board) {
    this.blocks = blocks
    this.x = x;
    this.y = y;
    this.board = board;
  };

  Piece.prototype.rotate = function(dir) {
    dir = dir || 1;
    for(var i = 0; i < this.blocks.length; i++) {
      var x = this.blocks[i][0];
      var y = this.blocks[i][1];
      this.blocks[i][0] = y * -1 * dir;
      this.blocks[i][1] = x * dir;
    }

    if (this.isCollided() || this.isOutOfBounds()) {
      this.rotate(dir * -1);
    }
  };

  Piece.prototype.instantDrop = function() {
    while (!this.isSettled()) {
      this.advance();
    }
  };

  Piece.prototype.advance = function() {
    this.y += 1;
    if (this.isOutOfBounds() || this.isCollided()) {
      this.y -= 1;
    }
  };

  Piece.prototype.slide = function(xOffset) {
    this.x += xOffset;
    if (this.isOutOfBounds() || this.isCollided()) {
      this.x -= xOffset;
    }
  };

  Piece.prototype.eachBlockPos = function(callback) {
    for(var i = 0; i < this.blocks.length; i++) {
      var x = this.x + this.blocks[i][0];
      var y = this.y + this.blocks[i][1];
      callback(x, y);
    }
  };

  Piece.prototype.isCollided = function() {
    var collided = false;
    this.eachBlockPos(function (x, y) {
      if (y > 19 || this.board[y][x]) {
        collided = true;
      }
    }.bind(this));
    return collided;
  };

  Piece.prototype.isSettled = function() {
    var settled = false;
    this.y += 1;
    if (this.isCollided()) {
      settled = true;
    }
    this.y -= 1;
    return settled;
  };

  Piece.prototype.isOutOfBounds = function() {
    var outside = false;
    this.eachBlockPos(function (x, y) {
      if (x < 0 || x > 9 || y > 19) {
        outside = true;
      }
    });
    return outside;
  };



})();
