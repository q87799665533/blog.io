    function is_neizhi() {
      var ua = navigator.userAgent.toLowerCase();
      var version = navigator.appVersion.toLocaleLowerCase();
      if (ua.indexOf("micromessenger")>-1) {
        return "weixin";
      }else if (ua.indexOf("mqqbrowser")>-1 && version.indexOf("iphone") > 0) {//iOS QQ浏览器
        alert("请尝试用其他浏览器唤起国联尊宝");
        return "iphoneQQBrowser";
      }else if (ua.indexOf("mqqbrowser")>-1 && version.indexOf("android") > 0) {//android QQ内外
        return false;
      }else if(ua.indexOf("qq")>-1 && version.indexOf("iphone") > 0){//iOS QQ
        return "iPhoneQQ";
      }
      return false;
    }

    function init() {
      alert(navigator.userAgent.toLowerCase());
      if (is_neizhi()){//引导
        lity($("#lity-tips").html());
        return;
      }
    }
    function bindEvents() {
      $(".wrap").on("click",function () { 
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