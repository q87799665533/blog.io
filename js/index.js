define(function (require) {
  var apis = require('apis/index');
  var swiper = require('swiper');
  var tools = require('tools');
  var lity = require("lity");
  var toast = require('toast');
  var isNeizhi;

  function init() {
    isNeizhi = tools.isNeizhi();
    var screenWidth = $(window).width();
    var screenHeight = $(window).height();
    if (screenWidth / screenHeight < 0.55){//大屏
      $('.iosTop').show();
      $('.ins-lead-fixed').css({
        'padding-top':'0.65rem',
        'height': '2rem'
      });
    }else{
      $('.iosTop').hide();
    }
    $('.wrapper').css({
      "padding-bottom":$('.top-btn').css('height')
    });
    new swiper('#swiper-container-today', {
      loop: true,
      autoplay: 3000,
      autoplayDisableOnInteraction: false,
      pagination: '.swiper-pagination',
      paginationClickable: true,
    });
  }

  function bindEvents() {
    var throttle = function(func, delay) {
      var timer = null;
      return function() {
          var context = this;
          var args = arguments;
          if (!timer) {
              timer = setTimeout(function() {
                  func.apply(context, args);
                  timer = null;
              }, delay);
          }
      }
    }

    window.addEventListener('scroll', throttle(scrollTop, 500));

    $('body').on('tap','.ins-lead-btn1',function () {
      $('.ins-lead-btn').removeClass('active');
      $('.ins-lead-btn1').addClass('active');
      $("html,body").animate({scrollTop:$("#img1").offset().top-110},500);
    });

    $('body').on('tap','.ins-lead-btn2',function () {
      $('.ins-lead-btn').removeClass('active');
      $('.ins-lead-btn2').addClass('active');
      $("html,body").animate({scrollTop:$("#img2").offset().top-100},500);
    });

    $('body').on('tap','.ins-lead-btn3',function () {
      $('.ins-lead-btn').removeClass('active');
      $('.ins-lead-btn3').addClass('active');
      $("html,body").animate({scrollTop:$("#img3").offset().top-100},500);
    });

    $('body').on('tap','#jl',function () {
      window.location.href = 'http://zbinfo.glsc.com.cn/html/2020calendar/myOrder.html';
    });

    $('body').on('tap','#gm',function (e) {
      e.preventDefault();
      if(isNeizhi){
        lity($("#lity-tips").html());
        return;
      }
      if(sessionStorage.getItem("mobile")){
        window.location.href = 'http://zbinfo.glsc.com.cn/html/2020calendar/createOrder.html';
      }else{
        $('.coverContainer').fadeIn("fast");
      }
    });

    $('body').on('tap', '.code_btn', function () {
      if(!/^\d{11}$/.test($('.mobile_input').val())){
        toast.show('手机号码格式不正确');
      } else {
        countDown();
        getMobileCode($('.mobile_input').val());
      }
    });

    $('body').on('tap', '.immediatelyBtn', function () {
      if(!/^\d{11}$/.test($('.mobile_input').val())){
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

  function scrollTop (){
    var scrollTop = $(document).scrollTop();
    if(scrollTop >= ($('#img1').offset().top-60) ){
      $(".ins-lead-fixed").css({
        'display':'flex'
      });
    }else{
      $(".ins-lead-fixed").css({
        'display':'none'
      });
    }
    if( scrollTop <= ($('#img2').offset().top-150) ){
      $('.ins-lead-btn').removeClass('active');
      $('.ins-lead-btn1').addClass('active');
    }else if( scrollTop > ($('#img2').offset().top-150) && scrollTop <= $('#img3').offset().top-150 ){
      $('.ins-lead-btn').removeClass('active');
      $('.ins-lead-btn2').addClass('active');
    }else if(scrollTop> $('#img3').offset().top-150){
      $('.ins-lead-btn').removeClass('active');
      $('.ins-lead-btn3').addClass('active');
    }
  
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

  function getAwards(query) {
    // 验证验证码
    apis.bindMobile(query).done(function(data) {
      if (data.code === 200){
      } else {
        toast.show(data.message);
      }
      window.location.href = './createOrder.html';
      $('.coverContainer').fadeOut("fast");
      sessionStorage.setItem("mobile",query.mobile);
    });
  };

  $(function () {
    init();

    bindEvents();
  });
});