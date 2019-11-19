define(function (require) {
  var apis = require('apis/index');
  var filemessage = require('utils/filemessage');
  var localmessage = require('utils/localmessage');
  var navigation = require('utils/navigation');
  var app = require('utils/app');
  var appAdr = app.platform;
  var lity = require('lity');
  var toast = require('templates/toast');
  var orderId;
  var payType = '';//支付方式
  var pending = false;//点击确认订购后 接口是否正在跑

  window.payResult = function (errorNo, data) {
    //微信 sdk 购买结束后的回调
    if (errorNo == 0) {
      //成功处理.
      navigation.toUrl('http://action:10061/?fullscreen=1&&noTitle=1&&url=/activity/activity2020Calendar/buyComplete.html?orderId='+orderId);
    } else {
      //失败处理.
      var str = JSON.stringify(data);
      var d = JSON.parse(str);
      if (d.errStr != '') {
        alert(d.errStr);
      } else {
        if (d.errCode == '-1' || d.errCode == '-3') {
          toast.show('网络出错啦，再试一下。');
        } else if (d.errCode == '-2') {
          toast.show('就这样与牛股擦肩而过吗?');
        } else if (d.errCode == '-4') {
          toast.show('微信未授权，先去授权。');
        } else if (d.errCode == '-5') {
          toast.show('微信版本太低喽，先去升级。');
        }
      }
    }
  };

  window.payResultAli = function (errorNo, data) {
    //支付宝 sdk 购买结束后的回调
    if (errorNo == '10000') {
      //成功处理.
      navigation.toUrl('http://action:10061/?fullscreen=1&&noTitle=1&&url=/activity/activity2020Calendar/buyComplete.html?orderId='+orderId);
     } else {
      var str = JSON.stringify(data);
      var d = JSON.parse(str);
      if (d.errStr != '') {
        alert(d.errStr);
      }else {
        if (d.errCode == '-1' || d.errCode == '-3') {
          toast.show('网络出错啦，再试一下。');
        } else if (d.errCode == '-2') {
          toast.show('就这样与牛股擦肩而过吗?');
        } else if (d.errCode == '-4') {
          toast.show('支付宝未授权，先去授权。');
        } else if (d.errCode == '-5') {
          toast.show('支付宝版本太低喽，先去升级。');
        }
      }
    }
  }

  function jumpFree() {
    killRouter('http://action:10061/?fullscreen=1&&noTitle=1&&url=/activity/activity2020Calendar/buyComplete.html?orderId='+orderId);
  }

  function killRouter(url){
    setTimeout(function () {
      onJsOverrideUrlLoading('http://action:55303/?closeurl=/activity/activity2020Calendar/createOrder.html');
        setTimeout(function () {
          navigation.toUrl(url);
        }, 10);
  }, 5);
  }

  function bindEvents() {
    $('body').on('tap', '.pay-type-item', function (e) {
      if($(this).hasClass('enable')){
        $('.pay-type-select').attr('src', './img/pay/item_select.png');
        $('.pay-type-item').removeClass('selected');
        $(this).find('.pay-type-select').attr('src', './img/pay/item_selected.png');
        $(this).addClass('selected');
        payType = $(this).attr('data-type');
      }   
    });

    $('body').on('tap', '#payBtn', function (e) {
      e.preventDefault();
      if(!payType){
        alert("请选择支付方式");
        return;
      }
      if(pending){
        return;
      }
      pending = true;
      $('#payBtn').addClass('pending');
      buy();
    });
  }

  function init() {
    if (window.location.search.split('?orderId=')[1]) {
      orderId = window.location.search.split('?orderId=')[1].split('&')[0];
    }
    apis.payApis.newGetOrderDetails(orderId).done(function (result) { // 通过id
      if(result.ERRORNO === '200'){
        var orderDetail = JSON.parse(result.DATA);
        console.log(orderDetail);
        $('.goodsName').html(orderDetail.orderGoods.goodsName);
        $('#price2').html('￥'+orderDetail.origPrice);
        //实付金额
        $('#finalAmount').html('￥'+orderDetail.payPrice);
      }else {
        alert(result.ERRORMESSAGE.split(":")[1]);
      }
    });
    renderPaytype();//加载支付方式
  }

  function buy() {
    var paramPayType;
      app.version().done(function (version) {
        var vcode = '4.01.021';
        if(appAdr.indexOf("iphone") > 0){
          if(payType === 'alipay'){
            paramPayType = 'ALI_PAY_H5';
          }else if(payType === 'wechat'){
            if (version > vcode) {
              //iphone H5跳转支付
              apis.payApis.newPayOrder(orderId,'WECHAT_H5').done(function(result){
                if (result.ERRORNO === '200') {
                  if (JSON.parse(result.DATA).PayType === 'FREE') {
                    jumpFree();
                  } else {
                    killRouter(JSON.parse(result.DATA).mWebUrl + "&redirect_url=" + 'weixin.glsc.com.cn://?url=/activity/activity2020Calendar/buyComplete.html?orderId='+orderId);
                  }
                } else {
                  alert(result.ERRORMESSAGE);
                }
                stopPending();
              });
            }else {
              //iphone 微信sdk跳转支付
              apis.payApis.newPayOrder(orderId,'WECHAT_APP').done(function (result) {
                  if (result.ERRORNO === '200') {
                    if (JSON.parse(result.DATA).PayType === 'FREE') {
                      jumpFree();
                    } else {
                      killRouter('http://action:55106?payId=' + JSON.parse(result.DATA).prepayId +
                        '&&payType=' +
                        0 +
                        '&&result=' + JSON.parse(result.DATA).sign);
                    }
                  } else {
                    alert(result.ERRORMESSAGE);
                  }
                  stopPending();
                })
            }
          }
        }else if(appAdr.indexOf("android") > 0){
          if(payType === 'alipay'){
            paramPayType = 'ALI_PAY_APP';
          }else if(payType === 'wechat'){
            paramPayType = 'WECHAT_APP';
          }else if(payType === 'deposit'){
            paramPayType = 'DEPOSIT';
          }
          apis.payApis.newPayOrder(orderId,paramPayType).done(function (result) {
            if (result.ERRORNO === '200') {
              if (JSON.parse(result.DATA).PayType === 'FREE') {//如果实际上没付钱
                jumpFree();
              } else {
                if(paramPayType === 'ALI_PAY_APP'){//支付宝
                  killRouter('http://action:55106?' +
                  '&&payType=' +
                  1 +
                  '&&result=' + encodeURI(JSON.parse(result.DATA).body));
                }else if(paramPayType === 'WECHAT_APP'){//微信
                  killRouter('http://action:55106?payId=' + JSON.parse(result.DATA).prepayId +
                  '&&payType=' +
                  0 +
                  '&&result=' + JSON.parse(result.DATA).sign);
                }else if(paramPayType === 'DEPOSIT'){
                  jumpFree();
                }
              }
            } else {
              alert(result.ERRORMESSAGE.split(":")[1]);
            }
            stopPending();
          });
        }
      });
  }

  function stopPending() {
    pending = false;
    $('#payBtn').removeClass('pending');
  }

  function renderPaytype() {
    var wechatStr = '<div class="pay-type-item enable" data-type="wechat">'+
    ' <div class="pay-type-title">'+
    '   <div class="pay-icon">'+
    '     <img src="./img/pay/wechat.png" />'+
    '   </div>'+
    '   <span class="subTitle">微信支付：</span>'+
    ' </div>'+
    ' <img class="pay-type-select" src="./img/pay/item_select.png" />'+
    '</div>';
    var alipay = '<div class="pay-type-item enable" data-type="alipay">'+
    ' <div class="pay-type-title">'+
    '   <div class="pay-icon">'+
    '     <img src="./img/pay/alipay.png" />'+
    '   </div>'+
    '   <span class="subTitle">支付宝：</span>'+
    ' </div>'+
    ' <img class="pay-type-select" src="./img/pay/item_select.png" />'+
    '</div>';
      if(appAdr.indexOf("android") > 0) {
        $('.payIns .list').append(wechatStr);
        app.version().done(function(version){
          if(version>='4.03.010'){//可用支付宝和微信
            $('.payIns .list').append(alipay);
          }
        });
      }else if(appAdr.indexOf("iphone") > 0){
        $('.payIns .list').append(wechatStr);
      }
  }

  window.GoBackOnLoad = function () {
  }

  $(function () {
    bindEvents();
    init();
  });
});