define(['jquery'], function($) {
  return {
    getMobileCode: function(query) {//获取验证码
      return $.ajax({
        type: 'GET',
        //url: "http://58.215.43.187:443/u/double-11-service/double11/getMobileCode",
        // url: "http://106.14.92.244/double-11-service/double11/getMobileCode",
        url: "http://61.160.71.141:81/api/activity-service/register/getMobileCode",
        //url: "http://apit.guolianzunbao.com:82/api/activity-service/register/getMobileCode",
        //url: "http://58.215.43.187:443/u/activity-service/register/getMobileCode",
        data: query,
        timeout: 8000
      }).then(function(response) {
        return response;
      });
    },
    bindMobile: function(query) {//验证手机号
      return $.ajax({
        type: 'GET',
        // url: "http://58.215.43.187:443/u/double-11-service/double11/bindMobile",
        // url: "http://106.14.92.244/double-11-service/double11/bindMobile",
        url: "http://61.160.71.141:81/api/activity-service/register/bindMobile",
        //url: "http://apit.guolianzunbao.com:82/api/activity-service/register/bindMobile",
        //url: "http://58.215.43.187:443/u/activity-service/register/bindMobile",
        data: query,
        timeout: 8000
      }).then(function(response) {
        return response;
      });
    },
  };
});

