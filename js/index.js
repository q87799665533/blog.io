    function is_neizhi() {
      var ua = navigator.userAgent.toLowerCase();
      if (ua.match(/MicroMessenger/i) == "micromessenger") {
        return "weixin";
      } else if (ua.match(/QQ/i) == "qq" && ua.indexOf('safari') == -1) {
        return "QQ";
      } else if (ua.match(/Alipay/i) == "alipay" && payway == 2) {
        return "alipay";
      }
      return false;
    }

    function init() {
      
    }

    function bindEvents() {
      $(".wrap").on("click",function () {
        if (is_neizhi()){//只要再qq或者微信里面 都引导去端外打开
          lity($("#lity-tips").html());
          return;
        } 
        var version = navigator.appVersion.toLocaleLowerCase();
        if (version.indexOf("iphone") > 0) {
          window.location.href = "com.tzt.glscjpb://action=http://action:10061/?fullscreen=1&&noTitle=1&&url=/activity/activity191111/preHeat.html";
        } else {
          window.location.href = "glsc://zunbao.com?action=http://action:10061/?fullscreen=1&&noTitle=1&&url=/activity/activity191111/preHeat.html";  
        }
        window.setTimeout(function () {
          if (!document.hidden) {
            window.location.href = "https://www.glsc.com.cn/glzb/";//打开app下载地址
          }
        }, 2500)
      });
    }

    $(function () {

      init();

      bindEvents();
    });