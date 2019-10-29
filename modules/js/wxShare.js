/**
 * Toast component
 * This simple component relies on JQuery
 * @author Eric Kim
 */
define(function() {
  return {
    share: function(callback) {
      var url = "http://zbinfo.glsc.com.cn/double11-api/wx/notice/share/auth/doubleElevenIndex";//活动地址
      var share_url = window.rootPath + "/shareRedirect?redirect_uri=" + encodeURIComponent(window.rootPath + "/OAuth?weixinpk=" + window.weixinpk) + "&appid=" + window.appid + "&state=" + encodeURIComponent(url); //分享链接地址
      JS_SDK.init(false, function () {
        JS_SDK.shareAll({
          imgUrl: "http://cdninfo.glsc.com.cn/wallimg/zb/banners/index_banner.jpg",// 分享的展示图片
          link: share_url,//地址
          title: "双十一疯狂快递",//标题
          desc: "点击进入，瓜分百万红包",//描述
          notOauth2: true
        }, null, function () {
          callback();
        }, null, function () {
          alert("分享失败");
        });
      });
    },
  };
});