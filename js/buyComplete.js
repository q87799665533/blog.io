define(function (require) {
  var navigation = require('utils/navigation');
  var apis = require('apis/index');
  var filemessage = require('utils/filemessage');
  var localmessage = require('utils/localmessage');
  var app = require('utils/app');
  var umeng = require('umeng');
  var ums = require('ums');
  var jsrender = require('jsrender');
  var orderState = false;
  var orderId = '';
  function init() {
    if (window.location.search.split('?orderId=')[1]) {
      orderId = window.location.search.split('?orderId=')[1].split('&')[0];
    }
    navigation.toUrl('http://action:55303/?closeurl=/activity/activity2020Calendar/pay.html?orderId='+orderId);
    setTimeout(function () {
      navigation.toUrl('http://action:55303/?closeurl=/activity/activity2020Calendar/myOrder.html');
    }, 20);
    var appAdr = app.platform;
    if (appAdr.indexOf("iphone") > 0) {
       $('.iosVideoTop').show();
       $('.iosTop').show();
       $('.androidVideoTop').hide();
       $('.icon_box').show();
    } else if (appAdr.indexOf("android") > 0) {
      $('.iosVideoTop').hide();
      $('.iosTop').hide();
      localmessage.read('statusheight').then(function (result) {
        statusHeight = result.STATUSHEIGHT;
        $('.top_title').css("top", statusHeight + 'px');
        $('.androidVideoTop').css("height", statusHeight + 'px');
        $('.androidVideoTop').show();
        $('.icon_box').show();
      })
    }
    apis.payApis.newGetOrderDetails(orderId).done(function (result){// 订单是否支付成功
      var payResult = JSON.parse(result.DATA).orderState;
      if(payResult === 'FINISH' || payResult === 'WATING_DELIVERY'){//支付成功
        orderState = 'FINISH';
      }else if(payResult === 'PAY_SUCCESS'){
        orderState = 'WAITING';
        setTimeout(function(){
          init();
        },2500);
      }
      renderPayResult(orderState);
    });
  }

  function bindEvents () {
    $(document).on('tap','#gobackToProduct', function() {
      navigation.toUrl('http://action:10002/');
    });

    $(document).on('tap', '.box1', function () {
      navigation.toUrl('http://action:10002/');
    });

    $(document).on('tap', '#continueToPay', function () {// 支付失败时的继续支付
      navigation.to('http://action:10061/?fullscreen=1&&url=/activity/activity2020Calendar/pay.html?orderId='+orderId);
      setTimeout(function () {
        navigation.toUrl('http://action:55303/?closeurl=/activity/activity2020Calendar/buyComplete.html?orderId='+orderId);//杀掉自己
      },500);
    });
  }

  function renderPayResult (state) {
    var order = $.templates('#stateContainer').render({ state: state});
		$('.up').find('*').not('#stateContainer').remove();
    $('.up').append(order);
  }

  $(function () {
    init();

    bindEvents();
  });
});