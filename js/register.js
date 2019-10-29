define(function (require) {
  var apis = require('apis/index');
  var jsrender = require('jsrender');
  var lity = require('lity');
  var fastclick = require('fastclick');
  var toast = require('toast');
  var wxShare = require('wxShare');
  var copyModal;

  function init() {
    var sessionId = '';
    if (window.location.search.split('?sessionId=')[1]) {
      sessionId = window.location.search.split('?sessionId=')[1].split('&')[0];
    }
    localStorage.setItem('sessionId', sessionId);
    fastclick.attach(document.body);
    apis.activity191111WXPointRecord();
    // wxShare.share(function () {
    //   apis.fetchShare({});
    // });
  }

  function bindEvents() {
    $(document).on('click', '.immediatelyBtn', function () {
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
    $(document).on('click', '.copyBtn', function () {
      copyModal.close();
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
      if (data.code === 200){
        var status;
        if(data.result.userAwardType === 'ONLY_RED'){//红包
          status = "type1";
        }else if(data.result.userAwardType === 'ONLY_FREE_ORDER' || data.result.userAwardType === 'RED_FREE_ORDER'){//免单
          status = "type2";
        }else{
          status = "type3";
        }
        var copyTipTemplate = $.templates("#copyTip").render({ status: status });
        copyModal = lity(copyTipTemplate);
      } else {
        toast.show(data.message);
      }
    });
  };

  $(function () {
    // 绑定事件
    bindEvents();
    init();
  });
});
