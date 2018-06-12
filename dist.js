'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var engine = {
  config: {}, // 配置对象
  fatherEle: {}, // 父元素
  canvas: {}, // canvas 对象
  canvasSpace: 0, // canvas 每次实际位移的距离
  tailLists: [], // 小球的尾巴的列表
  context: {}, // canvas context
  isStart: false, // 游戏是否开始
  ball: {}, // 小球对象
  terrLists: {}, // 树列表
  gameTimer: null, // 游戏的计时器
  point: 0, // 分数
  pointTimer: null, // 分数计时器
  pointAddNum: 0, // 分数增值
  addPointTimer: null, // 更新分数增值的计时器
  position: 0, // canvas 总位移
  level: 0, // 游戏等级
  isTouch: false, // 是否处于按下
  stateColor: {}, // 当前状态的颜色

  init: function init(id) {
    var _this = this;

    var config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    // 初始化函数
    var devicePixelRatio = window.devicePixelRatio || 1;
    var fatherEle = document.getElementById(id);
    var fatherWidth = fatherEle.offsetWidth;
    var fatherHeight = fatherEle.offsetHeight;

    // 默认配置
    var _config = _extends({
      canvasClassName: 'ball-canvas', // canvas 的 class
      terrNum: 10, // 初始树的数量
      updatePointTime: 3000, // 更新分数增值计时器的超时时间
      nearDistance: computedPixe(50), // 小球靠近树的距离
      canvasAddSpace: computedPixe(3), // canvas 位移的加距离
      ballEndPosition: fatherHeight / 2, // 小球停留位置
      terrMinTop: fatherHeight / 4, // 初始化树 最小的 top
      tailNum: 50 }, config);

    var canvas = document.createElement('canvas');

    canvas.width = fatherWidth * devicePixelRatio;
    canvas.height = fatherHeight * devicePixelRatio;
    canvas.style.width = fatherWidth + 'px';
    canvas.style.height = fatherHeight + 'px';
    canvas.className = _config.canvasClassName;

    fatherEle.appendChild(canvas);

    var context = canvas.getContext('2d');

    var terrImg = new window.Image();
    terrImg.src = './images/terr.png';

    terrImg.onload = function () {
      _this.initGame();
    };

    Object.assign(this, {
      config: _config,
      canvas: canvas,
      terrImg: terrImg,
      context: context,
      devicePixelRatio: devicePixelRatio
    });

    canvas.addEventListener('touchstart', function (e) {
      e.preventDefault();
      var ball = _this.ball;

      if (!_this.isStart) {
        _this.startGame();
      }
      _this.isTouch = true;
      ball.direction = !ball.direction;
    });

    canvas.addEventListener('touchend', function (e) {
      e.preventDefault();
      _this.isTouch = false;
    });
  },
  initGame: function initGame() {
    var config = this.config;

    Object.assign(this, _extends({}, config, {
      isStart: false,
      canvasSpace: 0,
      tailLists: [],
      ball: {},
      terrLists: {},
      point: 0,
      pointAddNum: 0,
      position: 0,
      level: 0,
      isTouch: false,
      stateColor: stateColors[0]
    }));

    var canvas = this.canvas,
        terrImg = this.terrImg,
        terrNum = this.terrNum,
        terrMinTop = this.terrMinTop,
        stateColor = this.stateColor,
        gameTimer = this.gameTimer,
        pointTimer = this.pointTimer,
        updatePointTimer = this.updatePointTimer;


    window.cancelAnimationFrame(gameTimer);
    window.clearInterval(pointTimer);
    window.clearInterval(updatePointTimer);

    var terrLists = {};

    this.ball = new Ball(canvas, {
      top: terrMinTop / 2,
      color: stateColor.ballColor
    });

    for (var i = 0; i < terrNum; i++) {
      var terr = new Terr(canvas, {
        top: Math.floor(Math.random() * (canvas.height - terrMinTop) + terrMinTop)
      }, terrImg);
      terrLists[terr.id] = terr;
    }

    this.terrLists = sortTerr(terrLists);

    this.paintGameCanvas();
  },
  startGame: function startGame() {
    this.isStart = true;
    this.terrNum += 10;
    this.move();
    this.startAddPoint();
  },
  move: function move() {
    var _this2 = this;

    var canvas = this.canvas,
        terrImg = this.terrImg,
        nearDistance = this.nearDistance,
        tailNum = this.tailNum;

    var halfCanvasHeight = canvas.height / 2;

    var animate = function animate() {
      var terrLists = _this2.terrLists,
          ball = _this2.ball,
          tailLists = _this2.tailLists,
          canvasAddSpace = _this2.canvasAddSpace,
          isTouch = _this2.isTouch,
          position = _this2.position,
          pointAddNum = _this2.pointAddNum,
          terrNum = _this2.terrNum,
          stateColor = _this2.stateColor;


      ball.move(canvasAddSpace, isTouch);

      var ballTop = ball.top;
      var ballLeft = ball.left;

      if (ballLeft < 0 || ballLeft > canvas.width) {
        // 小球超出边界
        _this2.gameOver();
        return;
      }

      for (var i = 0; i < terrNum - Object.keys(terrLists).length; i++) {
        // 给下一屏绘制的树
        var terr = new Terr(canvas, {
          top: Math.floor(Math.random() * canvas.height + canvas.height + position)
        }, terrImg);
        terrLists[terr.id] = terr;
      }

      for (var key in terrLists) {
        if (terrLists.hasOwnProperty(key)) {
          var _terr = terrLists[key];
          if (_terr.top < position - _terr.height) {
            delete terrLists[key];
            continue;
          }

          if (!_terr.isNear && isNear(ball, _terr, nearDistance)) {
            // 小球靠近这个树
            var point = pointAddNum + 1;
            _terr.isNear = true;
            _this2.updatePointAddNum(point);
            _terr.initPoint(point, stateColor.pointColor);
          }

          if (!_terr.isCrash && isCrash(ball, _terr)) {
            // 小球撞上这个树
            _terr.isCrash = true;
            _this2.gameOver();
            return;
          }
        }
      }

      // 更新尾巴列表
      tailLists.unshift({
        left: ballLeft,
        top: ballTop
      });
      tailLists.splice(tailNum);

      var canvasSpace = ballTop - position > halfCanvasHeight ? canvasAddSpace : (ballTop - position) / halfCanvasHeight * canvasAddSpace;

      Object.assign(_this2, {
        canvasSpace: canvasSpace,
        position: position + canvasSpace,
        terrLists: sortTerr(terrLists),
        gameTimer: window.requestAnimationFrame(animate)
      });

      _this2.paintGameCanvas();
    };

    this.gameTimer = window.requestAnimationFrame(animate);
  },
  startAddPoint: function startAddPoint() {
    var _this3 = this;

    this.pointTimer = window.setInterval(function () {
      _this3.addPoint(1);
    }, 1000);
  },
  addPoint: function addPoint(addNum) {
    var point = this.point,
        level = this.level;


    point += addNum;
    this.point = point;

    for (var key in levelLists) {
      if (levelLists.hasOwnProperty(key) && point > key && levelLists[key] > level) {
        this.level = levelLists[key];
        this.canvasAddSpace += 0.3;
        this.terrNum += 3;
        break;
      }
    }
  },
  updatePointAddNum: function updatePointAddNum(num) {
    var _this4 = this;

    var updatePointTime = this.updatePointTime,
        updatePointTimer = this.updatePointTimer;

    this.addPoint(num);
    this.pointAddNum = num;

    var index = num > 15 ? 2 : num > 6 ? 1 : 0;

    this.stateColor = stateColors[index];
    this.ball.color = stateColors[index].ballColor;

    clearTimeout(updatePointTimer);
    this.updatePointTimer = window.setTimeout(function () {
      _this4.updatePointAddNum(0);
      clearTimeout(_this4.updatePointTimer);
    }, updatePointTime);
  },
  paintGameCanvas: function paintGameCanvas() {
    var ball = this.ball,
        context = this.context,
        canvas = this.canvas,
        terrLists = this.terrLists,
        tailLists = this.tailLists,
        position = this.position,
        point = this.point,
        stateColor = this.stateColor;
    var canvasWidth = canvas.width,
        canvasHeight = canvas.height;
    var ballRadius = ball.radius,
        ballLeft = ball.left,
        ballTop = ball.top,
        ballColor = ball.color;
    var pointColor = stateColor.pointColor;


    var tailListsLength = tailLists.length;

    context.clearRect(0, 0, canvasWidth, canvasHeight);
    context.fillStyle = '#fff';
    context.fillRect(0, 0, canvasWidth, canvasHeight);

    if (tailListsLength) {
      context.beginPath();
      for (var i = 0; i < tailListsLength; i++) {
        var tail = tailLists[i];
        var tailLeft = tail.left,
            tailTop = tail.top;

        var _tailTop = computedBeyond(tailTop, position);
        context.lineTo(tailLeft - ballRadius + ballRadius * (i + 1) / tailListsLength, _tailTop);
      }
      for (var _i = tailListsLength - 1; _i >= 0; _i--) {
        var _tail = tailLists[_i];
        var _tailLeft = _tail.left,
            _tailTop2 = _tail.top;

        var _tailTop3 = computedBeyond(_tailTop2, position);
        context.lineTo(_tailLeft + ballRadius - ballRadius * (_i + 1) / tailListsLength, _tailTop3);
      }

      var firstTail = tailLists[0];
      var lastTail = tailLists[tailListsLength - 1];
      var firstTailTop = computedBeyond(firstTail.top, position);
      var lastTailTop = computedBeyond(lastTail.top, position);
      var line = context.createLinearGradient(firstTail.left, firstTailTop, lastTail.left, lastTailTop);
      var gradualColor = stateColor.gradualColor;

      line.addColorStop(0, gradualColor[0]);
      line.addColorStop(1, gradualColor[1]);
      context.fillStyle = line;
    }
    context.fill();

    context.fillStyle = ballColor;
    var _ballTop = computedBeyond(ballTop, position);
    context.beginPath();
    context.arc(ballLeft, _ballTop, ballRadius, 0, 2 * Math.PI);
    context.fill();

    context.fillStyle = '#000';
    for (var key in terrLists) {
      if (terrLists.hasOwnProperty(key)) {
        var terr = terrLists[key];
        var terrImg = terr.terrImg,
            terrImgWidth = terr.terrImgWidth,
            terrImgHeight = terr.terrImgHeight,
            terrImgLeft = terr.terrImgLeft,
            terrImgTop = terr.terrImgTop;

        var _terrImgTop = computedBeyond(terrImgTop, position);
        context.drawImage(terrImg, terrImgLeft, _terrImgTop, terrImgWidth, terrImgHeight);
        context.beginPath();
        var _point = terr.point;
        if (_point) {
          context.fillStyle = terr.pointColor;
          context.font = computedPixe(16) + 'px sans';
          context.textAlign = 'center';
          context.fillText('+' + _point, terrImgLeft + terrImgWidth / 2, _terrImgTop - 5);
        }
      }
    }

    context.fillStyle = pointColor;
    context.font = computedPixe(20) + 'px sans';
    context.textAlign = 'left';
    context.fillText('\u5206\u6570\uFF1A' + point, computedPixe(10), computedPixe(28));
  },
  gameOver: function gameOver() {
    var _this5 = this;

    var context = this.context,
        canvas = this.canvas,
        terrLists = this.terrLists,
        point = this.point,
        pointTimer = this.pointTimer,
        updatePointTimer = this.updatePointTimer,
        gameTimer = this.gameTimer;
    var canvasWidth = canvas.width,
        canvasHeight = canvas.height;


    window.cancelAnimationFrame(gameTimer);
    window.clearInterval(pointTimer);
    window.clearInterval(updatePointTimer);

    this.paintGameCanvas();
    this.isStart = false;
    for (var key in terrLists) {
      if (terrLists.hasOwnProperty(key)) {
        terrLists[key].clearPointTimer();
        delete terrLists[key];
      }
    }

    context.fillStyle = 'rgba(0, 0, 0, 0.5)';
    context.fillRect(0, 0, canvasWidth, canvasHeight);
    context.fill();
    context.fillStyle = '#fff';
    context.font = computedPixe(28) + 'px sans';
    context.textAlign = 'center';
    context.fillText('游戏结束', canvasWidth / 2, canvasHeight / 2.6);
    context.font = computedPixe(18) + 'px sans';
    context.fillText('\u83B7\u5F97 ' + point + ' \u5206', canvasWidth / 2, canvasHeight / 1.8);
    context.font = computedPixe(14) + 'px sans';
    context.fillText('（点击屏幕重新开始）', canvasWidth / 2, canvasHeight / 1.65);

    var resetGame = function resetGame(e) {
      e.preventDefault();
      _this5.initGame();
      canvas.removeEventListener('touchstart', resetGame);
    };
    canvas.addEventListener('touchstart', resetGame);
  }
};

engine.init('container');
'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Ball = function () {
  function Ball(canvas) {
    var config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    _classCallCheck(this, Ball);

    var radius = config.radius || 7;

    Object.assign(this, _extends({
      radius: computedPixe(radius),
      degree: 0.1,
      degreeSpace: computedPixe(0.14),
      maxDegree: computedPixe(4),
      minDegree: computedPixe(-4),
      left: canvas.width / 2,
      top: 10,
      direction: false,
      space: 1,
      endPosition: canvas.height / 2,
      isCrash: false,
      color: 'red'
    }, config));
  }

  _createClass(Ball, [{
    key: 'move',
    value: function move(space, isTouch) {
      var direction = this.direction,
          degree = this.degree,
          left = this.left,
          top = this.top,
          maxDegree = this.maxDegree,
          minDegree = this.minDegree,
          degreeSpace = this.degreeSpace;

      left += degree;

      if (isTouch) {
        if (direction) {
          var _degree = degree + degreeSpace;
          degree = _degree > maxDegree ? maxDegree : _degree;
        } else {
          var _degree2 = degree - degreeSpace;
          degree = _degree2 < minDegree ? minDegree : _degree2;
        }
      }

      Object.assign(this, {
        degree: degree,
        left: left,
        space: space,
        top: top + space
      });
    }
  }]);

  return Ball;
}();
'use strict';

var levelLists = {
  9999: 12,
  6666: 11,
  5000: 10,
  3000: 9,
  2000: 8,
  1500: 7,
  1000: 6,
  800: 5,
  500: 4,
  200: 3,
  100: 2,
  50: 1
};

var terrSizeLists = [{
  width: 3,
  height: 3
}, {
  width: 5,
  height: 5
}];

var stateColors = [{
  gradualColor: ['rgb(210, 210, 210)', 'rgba(240, 240, 240)'],
  pointColor: 'rgb(0, 0, 0)',
  ballColor: '#b7e8e8'
}, {
  gradualColor: ['rgba(255, 154, 37, 0.6)', 'rgba(228, 154, 37, 0.1)'],
  pointColor: 'rgb(228, 154, 37)',
  ballColor: 'rgb(255, 154, 37)'
}, {
  gradualColor: ['rgba(255, 0, 0, 0.6)', 'rgba(231, 57, 39, 0.1)'],
  pointColor: 'rgb(231, 57, 39)',
  ballColor: 'rgb(255, 0, 0)'
}];
'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Terr = function () {
  function Terr(canvas) {
    var config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var terrImg = arguments[2];

    _classCallCheck(this, Terr);

    var left = Math.floor(Math.random() * canvas.width + -10);
    var top = config.top || Math.floor(Math.random() * (canvas.height * 2) + canvas.height);
    var id = Math.floor(Math.random() * 8999999 + 1000000) + '_terr';

    var random = Math.floor(Math.random() * terrSizeLists.length);
    var randomSize = terrSizeLists[random];
    var width = randomSize.width,
        height = randomSize.height;

    width = computedPixe(width);
    height = computedPixe(height);
    var terrImage = {};
    if (terrImg) {
      var terrImgWidth = width * 6;
      var terrImgHeight = terrImgWidth / (terrImg.width / terrImg.height);
      var terrImgLeft = left - terrImgWidth * 0.38;
      var terrImgTop = top - terrImgHeight + height;

      Object.assign(terrImage, {
        terrImg: terrImg,
        terrImgWidth: terrImgWidth,
        terrImgHeight: terrImgHeight,
        terrImgLeft: terrImgLeft,
        terrImgTop: terrImgTop
      });
    }

    Object.assign(this, _extends({
      id: id,
      left: left,
      top: top,
      width: width,
      height: height
    }, config), _extends({}, terrImage, {
      isNear: false,
      point: 0
    }));
  }

  _createClass(Terr, [{
    key: 'initPoint',
    value: function initPoint(point, pointColor) {
      var _this = this;

      Object.assign(this, {
        pointColor: pointColor,
        point: point
      });
      this.zeroPointTimer = setTimeout(function () {
        _this.point = 0;
      }, 500);
    }
  }, {
    key: 'clearPointTimer',
    value: function clearPointTimer() {
      clearTimeout(this.zeroPointTimer);
    }
  }]);

  return Terr;
}();
"use strict";

function computedBeyond(top, position) {
  return top - position;
}

function isCrash(ball, terr) {
  var ballLeft = ball.left,
      ballTop = ball.top;
  var terrLeft = terr.left,
      terrTop = terr.top,
      terrWidth = terr.width,
      terrHeight = terr.height;

  return ballLeft >= terrLeft && ballLeft <= terrLeft + terrWidth && ballTop >= terrTop && ballTop <= terrTop + terrHeight;
}

function isNear(ball, terr, distance) {
  var ballLeft = ball.left,
      ballTop = ball.top;
  var terrLeft = terr.left,
      terrTop = terr.top,
      terrWidth = terr.width,
      terrHeight = terr.height;

  var _terrLeft = terrLeft + terrWidth / 2;
  var _terrTop = terrTop + terrHeight / 2;
  return Math.pow(Math.abs(_terrLeft - ballLeft), 2) + Math.pow(Math.abs(_terrTop - ballTop), 2) <= Math.pow(distance, 2);
}

function sortTerr(terrLists) {
  var _terrLists = {};
  var terrListsArr = Object.entries(terrLists);
  terrListsArr.sort(function (x, y) {
    var xTerr = x[1];
    var yTerr = y[1];
    return xTerr.top + xTerr.height - yTerr.top + yTerr.height;
  });
  terrListsArr.forEach(function (item) {
    _terrLists[item[0]] = item[1];
  });
  return _terrLists;
}

function computedPixe(pixe) {
  return pixe * (window.devicePixelRatio || 1);
}
