window.requestAnimFrame = (function() {
    return window.requestAnimationFrame ||
      window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      window.oRequestAnimationFrame ||
      window.msRequestAnimationFrame ||
      function(callback, element) {
        window.setTimeout(callback, 1000 / 60);
      };
  })();

  SpinWheel = function(id) {

    var _this = this;

    _this.el = $('.wheel-wrapper');
    _this.speed = 0;
    _this.startTime = new Date();
    _this.items = 11;
    _this.itemsWidth = 50;
    _this.spinTime = 3000;
    _this.running = false;
    _this.motion = 20;
    _this.resultId = id;
    _this.resultOffset = null;

    _this.setup = function() {
      _this.resultOffset = _this.resultId * _this.itemsWidth;
      _this.loop();
    };

    _this.loop = function() {
      _this.running = true;
      (function gameLoop() {
        _this.update();
        if (_this.speed >= (_this.items * _this.itemsWidth + _this.itemsWidth)) {
          _this.speed = 0;
        }
        _this.speed += _this.motion;
        if (_this.running) {
          requestAnimFrame(gameLoop);
        }
      })();
    };

    _this.update = function() {
      var now = new Date();
      _this.el.css({
        'transform': 'translateX(-' + _this.speed + 'px)'
      });
      if (now - _this.startTime > _this.spinTime) {
        if (_this.speed == _this.resultOffset && _this.motion == 1) {
          _this.running = false;
        } else if (_this.speed >= _this.resultOffset) {
          _this.motion = _this.motion * 0.99;
        }
        return;
      }
    };

    _this.init = function() {
      _this.setup();
    };

    _this.init();

    return _this;

  };
  var resultId = parseInt(Math.random() * 11);

  var wheel = new SpinWheel(resultId);
