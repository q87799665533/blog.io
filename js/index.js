define(function (require) {
  var apis = require('apis/index');
  var jsrender = require('jsrender');
  var fastclick = require('fastclick');
  var wxShare = require('wxShare');

  function init() {
    var sessionId = '';
    if (window.location.search.split('?sessionId=')[1]) {
      sessionId = window.location.search.split('?sessionId=')[1].split('&')[0];
    }
    localStorage.setItem('sessionId', sessionId);
    getAwards();
    fastclick.attach(document.body);
    wxShare.share(function () {
      apis.fetchShare({});
    });
  }

  function bindEvents() {
    $(document).on('click', '.awardTitleImg', function () {
     if ($(this).data('type') === 'down') {
       $('.award').fadeIn();
       $(this).data('type', 'up');
       $(this).attr('src', './images/up.png');
     } else {
       $('.award').fadeOut();
       $(this).data('type', 'down');
       $(this).attr('src', './images/down.png');
     }
    });
    $(document).on('click', '.startBtn', function () {
      window.location.href='./game.html';
    });
  }

  function getAwards() {
    // 中奖纪录
    apis.fetchUserAwards({
      pageNum: 0,
      pageSize: 100,
    }).done(function(data) {
      var award = data.result;
      var awardTpl = $.templates('#award-list').render({ awardList: award});
      $('.awardBox').find('*').not('#award-list').remove();
      $('.awardBox').append(awardTpl);
      $('.loader').hide();
    });
  };

  $(function () {
    // 绑定事件
    bindEvents();
    init();
  });
});
