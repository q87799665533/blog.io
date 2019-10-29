/**
 * 双十一活动
 */
define(['jquery'], function($) {
  return {
    /**
     * 抽奖
     * @param onSuccess
     */
    fetchLotto: function(query) {
      return $.ajax({
        type: 'POST',
        url: "http://58.215.43.187:443/u/double-11-service/double11/lottoOut",
        // url: "http://106.14.92.244/double-11-service/double11/lottoOut",
        data: query,
        timeout: 8000,
        beforeSend: function(request) {
          request.setRequestHeader("x-auth-token", localStorage.getItem("sessionId"));
        },
      }).then(function(response) {
        return response;
      });
    },
    /**
     * 中奖纪录
     * @param onSuccess
     */
    fetchUserAwards: function(query) {
      return $.ajax({
        type: 'GET',
        url: "http://58.215.43.187:443/u/double-11-service/double11/award/out/list",
        // url: "http://106.14.92.244/double-11-service/double11/award/out/list",
        data: query,
        timeout: 8000,
        beforeSend: function(request) {
          request.setRequestHeader("x-auth-token", localStorage.getItem("sessionId"));
        },
      }).then(function(response) {
        return response;
      });
    },
    /**
     * 分享
     * @param onSuccess
     */
    fetchShare: function(query) {
      return $.ajax({
        type: 'GET',
        url: "http://58.215.43.187:443/u/double-11-service/double11/shareOut",
        // url: "http://106.14.92.244/double-11-service/double11/shareOut",
        data: query,
        timeout: 8000,
        beforeSend: function(request) {
          request.setRequestHeader("x-auth-token", localStorage.getItem("sessionId"));
        },
      }).then(function(response) {
        return response;
      });
    },
    /**
     * 获取短信验证码
     * @param onSuccess
     */
    getMobileCode: function(query) {
      return $.ajax({
        type: 'GET',
        // url: "http://58.215.43.187:443/u/double-11-service/double11/getMobileCode",
        // url: "http://106.14.92.244/double-11-service/double11/getMobileCode",
        //url: "http://61.160.71.141:81/api/activity-service/register/getMobileCode",
        url: "http://apit.guolianzunbao.com:81/api/activity-service/register/getMobileCode",
        data: query,
        timeout: 8000
      }).then(function(response) {
        return response;
      });
    },
    /**
     * 绑定手机和openId
     * @param onSuccess
     */
    bindMobile: function(query) {
      return $.ajax({
        type: 'GET',
        // url: "http://58.215.43.187:443/u/double-11-service/double11/bindMobile",
        // url: "http://106.14.92.244/double-11-service/double11/bindMobile",
        //url: "http://61.160.71.141:81/api/activity-service/register/bindMobile",
        url: "http://apit.guolianzunbao.com:81/api/activity-service/register/bindMobile",
        beforeSend: function(request) {
          request.setRequestHeader("x-auth-token", localStorage.getItem("sessionId"));
        },
        data: query,
        timeout: 8000
      }).then(function(response) {
        return response;
      });
    },
    activity191111WXPointRecord: function() {
      return $.ajax({
        type: 'POST',
        //url: "http://61.160.71.141:81/api/activity-service/double11/wxPointRecord?wxOpenId="+localStorage.getItem("sessionId")+"&pointType=ENTER_BIND_PAGE",
        url: "http://apit.guolianzunbao.com:81/api/activity-service/double11/wxPointRecord?wxOpenId="+localStorage.getItem("sessionId")+"&pointType=ENTER_BIND_PAGE",
        // data:{
        //   wxOpenId:localStorage.getItem("sessionId"),
        //   pointType:'ENTER_BIND_PAGE'
        // }
      });
    }
  };
});

