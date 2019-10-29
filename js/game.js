(function () {
  var Model = function (container, callback) {
    var me = this;
    me.container = container;
    me.endGame = false;
    me.initBlock();

    me.container.addEventListener('click', function (e) {
      var node = e.target;
      var r = me.checkBlock(node);
      if (r === 0) {
        clearInterval(me.interval);
        if (me.endGame === false) {
          callback(me.erased);
          me.endGame = true;
        }
      }
      else if (r === 2) {
        me.blockArr.pop();
        me.blockArr.unshift(Math.random() * 3 | 0);
        me.updateblock();
        ++me.erased;
      }
    });
  }
  Model.prototype.startGame = function (callback) {
    var me = this;
    me.erased = 0;
    //列索引初始化
    me.blockArr = [];
    me.startTime = 15;
    me.interval = setInterval(function () {   //计时器
      var d = --me.startTime;
      if (d < 0) {
        clearInterval(me.interval);
        // me.container.removeEventListener('click');
        callback(me.erased);
      } else {
        document.querySelector('#divTimer .time').innerHTML = d;
      }
    }, 1000);
    for (var i = 0; i < 8; i++) {
      me.blockArr[i] = Math.random() * 3 | 0;
    }
    me.blockArr[7] = -1;
    me.updateblock();
  };
  /**
   * 初始化block
   */
  Model.prototype.initBlock = function () {
    var me = this;
    for (var i = 0; i < 8; i++) {
      for (var j = 0; j < 3; j++) {
        var div = document.createElement("div");  //添加div标签
        div.setAttribute("class", "WhiteBlock");    //为标签添加指定属性
        me.container.appendChild(div);
      }
    }
  }
  /**
   * 更新黑块
   */
  Model.prototype.updateblock = function () {
    var me = this;
    var nodes = me.container.childNodes;
    //把所有块变成白块，再根据数组画黑块
    for (var i = 0; i < 24; i++) {
      nodes[i].setAttribute("class", "WhiteBlock");//添加指定的属性，并为其赋指定的值。如果这个指定的属性已存在，则仅设置/更改值
    }
    for (var i = 0; i < 8; i++) {
      var index = me.blockArr[i];
      if (index === -1) {
        continue;
      }
      nodes[i * 3 + index].setAttribute("class", "BlackBlock");   //设置每一行的黑块
    }
  }
  /**
   * 检查点击的块
   * @param node：传入的块
   * @return 0白块
   *         1 非最后一行的黑块
   *         2 最后一行的黑块
   */
  Model.prototype.checkBlock = function (node) {
    var me = this;
    var nodes = me.container.childNodes;
    for (var i = 0; i < 8; i++) {
      if (nodes[i * 3 + me.blockArr[i]] === node) {
        if (i === 6)
          return 2;
      }
    }
    return 0;
  }


  //暴露model
  window.WhiteBlock = Model;
}());