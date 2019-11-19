define(['jquery'], function($) {
  var env = 1;//开发
  var baseUrl = 'http://61.160.71.141:81/api';;
  if(env == 2){
    baseUrl = 'http://apit.guolianzunbao.com:82/api';//测试
  }else if(env == 3){
    baseUrl = 'http://58.215.43.187:443/u';//生产
  }
  
  return {
    getMobileCode: function(query) {//获取验证码
      return $.ajax({
        type: 'GET',
        url: baseUrl + "/activity-service/register/getMobileCode",
        data: query,
        timeout: 8000
      }).then(function(response) {
        return response;
      });
    },
    bindMobile: function(query) {//验证手机号
      return $.ajax({
        type: 'GET',
        url: baseUrl + "/activity-service/register/bindMobile",
        data: query,
        timeout: 8000
      }).then(function(response) {
        return response;
      });
    },
    newFetchEntityProducts: function (name) {
      return $.ajax({
        type: 'GET',
        url: baseUrl + "/um-mall-service/goods/v1/goodsDetail",
        data: {
          goodsName: name,
          state: 'ON_SHELF',
          functionNo: '4804058',
          goodsType: 'REAL_THING'
        },
        timeout: 8000
      }).then(function(response) {
        return response;
      });
    },
    getUserRecAdd: function () {//获取用户收货地址
      return $.ajax({
        type: 'GET',
        url: baseUrl + "/um-mall-service/userRecAddress/v1/list",
        data: {
          functionNo: '4804098',
          userMobile: sessionStorage.getItem("mobile")
        },
        timeout: 8000
      }).then(function(response) {
        return response;
      });
    },
    newCreateEntityOrder: function (data) {
      return $.ajax({
        type: 'POST',
        url: baseUrl + "/um-mall-service/newOrder/v1/createReal?functionNo=4804097",
        data: JSON.stringify(data),
        contentType: 'application/json',
        timeout: 8000
      }).then(function(response) {
        return response;
      });
    },
    addUserRecAdd: function (data) {//添加用户收货地址
      return $.ajax({
        type: 'POST',
        url: baseUrl + "/um-mall-service/userRecAddress/v1/add?functionNo=4804099",
        data: JSON.stringify(data),
        contentType: 'application/json',
        timeout: 8000
      }).then(function(response) {
        return response;
      });
    },
    updateUserRecAdd: function (data) {//修改用户收货地址
      return $.ajax({
        type: 'PUT',
        url: baseUrl + "/um-mall-service/userRecAddress/v1/update?functionNo=4804100",
        data: JSON.stringify(data),
        contentType: 'application/json',
        timeout: 8000
      }).then(function(response) {
        return response;
      });
    },
    newGetOrderDetails: function (orderId) {// 获取包含订单支付状态在内的订单信息
      return $.ajax({
        type: 'GET',
        url: baseUrl + "/um-mall-service/newOrder/v1/details/"+orderId,
        data: {
          functionNo: '4804074',
        },
        timeout: 8000
      }).then(function(response) {
        return response;
      });
    },
    newPayOrder: function (id, payType) {
      return $.ajax({
        type: 'GET',
        url: baseUrl + "/um-mall-service/new/pay/v1",
        data: {
          id: id,
          payType: payType,
          functionNo: '4804078',
        },
        timeout: 8000
      }).then(function(response) {
        return response;
      });
    },
  };
});

