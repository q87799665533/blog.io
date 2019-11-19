define(['jquery'], function($) {
  return {
    isNeizhi : function (){
      var ua = navigator.userAgent.toLowerCase();
      var version = navigator.appVersion.toLocaleLowerCase();
      if (ua.indexOf("micromessenger")>-1) {
        return "weixin";
      }else if (ua.indexOf("mqqbrowser")>-1 && version.indexOf("iphone") > 0) {//iOS QQ浏览器
        alert("请尝试用其他浏览器唤起国联尊宝");
        return "iPhoneQQBrowser";
      }else if (ua.indexOf("mqqbrowser")>-1 && version.indexOf("android") > 0) {//android QQ内外
        return false;
      }else if(ua.indexOf("qq")>-1 && version.indexOf("iphone") > 0){//iOS QQ
        return "iPhoneQQ";
      }
      return false;
    }
  }
});