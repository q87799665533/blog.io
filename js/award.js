define(function (require) {
  var apis = require('apis/index');
  var jsrender = require('jsrender');
  var lity = require('lity');
  var fastclick = require('fastclick');
  var toast = require('toast');
  var wxShare = require('wxShare');
  var copyModal;
  var bindMobileModal;
  var redSuperModal;
  var scanModal;
  var needBind = false;

  var awardArr = [{
    code: 'zhengu',
    name: '诊股体验',
    type: 'ALL',
    url: '',
    eventId: '',
  },{
    code: 'xiangsi',
    name: '相似K线体验',
    type: 'ALL',
    url: '',
    eventId: '',
  },{
    code: 'guozhai',
    name: '国债逆回购体验',
    type: 'ALL',
    url: '',
    eventId: '',
  },{
    code: 'touzi',
    name: '投资组合体验',
    type: 'ALL',
    url: '',
    eventId: '',
  },{
    code: 'zhuti',
    name: '主题投资体验',
    type: 'ALL',
    url: '',
    eventId: '',
  },{
    code: 'kaihu',
    name: '一键开户体验',
    type: 'ALL',
    url: '',
    eventId: '',
  },{
    code: 'f10',
    name: '新版图文F10体验',
    type: 'ALL',
    url: '',
    eventId: '',
  },{
    code: 'duokong',
    name: '多空信号体验',
    type: 'ALL',
    url: '',
    eventId: '',
  },{
    code: 'daxin',
    name: '一键打新体验',
    type: 'ALL',
    url: '',
    eventId: '',
  },{
    code: 'red',
    name: '现金红包',
    type: 'RED',
    url: '',
    eventId: '',
  },{
    code: 'new_65',
    name: '新人6.5%理财券',
    type: 'LICAI',
    url: '',
    eventId: '',
  },{
    code: 'level2',
    name: '一个月港股level-2',
    type: 'LEVEL',
    url: '',
    eventId: '',
  }];
  function init() {
    var result = localStorage.getItem("expressNum");
    $('.awardNum').text(result);
    if (result > 50) {
      $('.awardPercent').text(100);
      drawAward();
    } else {
      $('.awardPercent').text(parseInt((result / 50) * 100));
      if (Number(result) !== 0) {
        drawAward();
      } else {
        $('.loader').hide();
      }
    }

    fastclick.attach(document.body);
    wxShare.share(function () {
      apis.fetchShare({});
      copyModal.close();
    });
  }

  function drawAward() {
    var winAward;
    var redAward = false;
    apis.fetchLotto({}).done(function(data) {
      var award = data.result;
      needBind = award.needBind;
      var awardList = [];
      if (award.needShare) {
        var copyTipTemplate = $.templates("#copyTip").render();
        copyModal = lity(copyTipTemplate);
      }

      if (award.price1.code === 'red_super' || award.price2.code === 'red_super') {
        var redSuperTemplate = $.templates("#redSuper").render();
        redSuperModal = lity(redSuperTemplate);
      }

      if (award.price1.priceType === 'ALL' && award.price2.priceType === 'ALL') {
        winAward = false;
      } else {
        winAward = true;
      }
      awardArr.forEach(function (item) {
        if (item.code === award.price1.code) {
          awardList[0] = item;
        } else if (item.code === award.price1.code.split('_')[0]) {
          awardList[0] = item;
          redAward = true;
        }
        if (item.code === award.price2.code) {
          awardList[1] = item;
        } else if (item.code === award.price2.code.split('_')[0]) {
          awardList[1] = item;
          redAward = true;
        }
      });
      if (!winAward) {
        $('.awardTip').hide();
        $('.littleHint').show();
      } else {
        $('.awardTip').show();
        $('.littleHint').hide();
      }
      if (redAward) {
        $('.awardTip').hide();
        $('.awardRedTip').show();
      }
      var awardTpl = $.templates('#award-list').render({ awardList: awardList});
      $('.infoBox').find('*').not('#award-list').remove();
      $('.infoBox').append(awardTpl);
      $('.loader').hide();
    });
  }

  function bindEvents() {
    $(document).on('click', '.anotherBtn', function () {
      window.location.replace('./game.html')
    });
    $(document).on('click', '.seeBtn', function () {
      if (needBind) {
        var bindMobileTemplate = $.templates("#bindMobile").render();
        bindMobileModal = lity(bindMobileTemplate);
      } else {
        platform();
      }
    });
    $(document).on('click', '.receiveBtn', function () {
      var type = $(this).data('type');
      if (type !== 'RED') {
        if (needBind) {
          var bindMobileTemplate = $.templates("#bindMobile").render();
          bindMobileModal = lity(bindMobileTemplate);
        } else {
          platform();
        }
      } else {
        // $("html,body").animate({
        //   scrollTop: document.body.clientHeight
        // },500);
        // var scanTemplate = $.templates("#scan").render();
        // scanModal = lity(scanTemplate);
        window.location.href='./register.html?sessionId=' + localStorage.getItem("sessionId");
      }
    });
    $(document).on('click', '.shareBox', function () {
      copyModal.close();
    });

    $(document).on('click', '.redSuperBtn', function () {
      redSuperModal.close();
    });

    $(document).on('click', '.scanBtn', function () {
      scanModal.close();
    });

    $(document).on('click', '.yesBtn', function () {
      if (!(/^1[34578]\d{9}$/.test($('.mobile_input').val()))) {
        toast.show('手机号码格式不正确');
      } else if ($('.code_input').val() === '') {
        toast.show('短信验证码不能为空');
      } else {
        getAwards({
          mobile: $('.mobile_input').val(),
          mobileCode: $('.code_input').val(),
        });
      }
    });
    $(document).on('click', '.cancelBtn', function () {
      bindMobileModal.close();
    });
    $(document).on('click', '.code_btn', function () {
      if (!(/^1[34578]\d{9}$/.test($('.mobile_input').val()))) {
        toast.show('手机号码格式不正确');
      } else {
        countDown();
        getMobileCode($('.mobile_input').val());
      }
    });
  }

  function countDown() {
    var InterValObj; //timer变量，控制时间
    var curCount = 60;//当前剩余秒数
    var code = ""; //验证码

    $(".code_btn").attr("disabled", "true");
    $(".code_btn").val(curCount + "秒");
    $(".code_btn").addClass('disabledCodeBtn');
    InterValObj = window.setInterval(SetRemainTime, 1000); //启动计时器，1秒执行一次
    //timer处理函数
    function SetRemainTime() {
      if (curCount == 0) {
        window.clearInterval(InterValObj);//停止计时器
        $(".code_btn").removeAttr("disabled");//启用按钮
        $(".code_btn").removeClass('disabledCodeBtn');
        $(".code_btn").val("获取验证码");
        code = ""; //清除验证码。如果不清除，过时间后，输入收到的验证码依然有效
      } else {
        curCount--;
        $(".code_btn").val(curCount + "秒");
      }
    }
  }

  function getMobileCode(mobile) {
    // 获取验证码
    apis.getMobileCode({
      mobile: mobile
    }).done(function(data) {
      if (data.code === 200) {
        toast.show(data.message);
      }
    });
  };

  function getAwards(query) {
    // 中奖纪录
    apis.bindMobile(query).done(function(data) {
      if (data.code === 200) {
        platform();
      }
    });
  };
  
  function platform() {
    var app = window.navigator.appVersion.toLocaleLowerCase();
    if (app.indexOf("iphone") > 0) {
      window.location.href='http://itunes.apple.com/cn/app/%E5%9B%BD%E8%81%94%E5%B0%8A%E5%AE%9D-%E7%90%86%E8%B4%A2%E7%89%88/id887800915?mt=8';
    } else if (app.indexOf("android") > 0) {
      window.location.href='http://www.glsc.com.cn/glzb/';
    }
  }

  $(function () {
    // 绑定事件
    bindEvents();
    init();
  });
});
