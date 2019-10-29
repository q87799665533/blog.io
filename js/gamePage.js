define(function (require) {
  var apis = require('apis/index');
  var fastclick = require('fastclick');
  var wxShare = require('wxShare');

  function init() {
    fastclick.attach(document.body);
    // 游戏初始
    var Game = new WhiteBlock(document.querySelector(".container"), function (erased) {
      JumpAward(erased)
    });
    Game.startGame(function (erased) {
      JumpAward(erased)
    });
    $('.container').scrollTop( $('.container')[0].scrollHeight);
    wxShare.share(function () {
      apis.fetchShare({});
    });
  }

  function bindEvents() {
    $(document).on('touchstart', '.container div', function () {
      $(this).css('backgroundColor', '#ffdec5');
    });
    $(document).on('touchend', '.container div', function () {
      $(this).css('backgroundColor', '#fff');
    });
  }

  function JumpAward(result) {
    localStorage.setItem('expressNum', result);
    window.location.replace('./award.html')
  }
  $(function () {
    // 绑定事件
    bindEvents();
    init();
  });
});
