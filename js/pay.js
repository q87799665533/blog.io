define(function (require) {
  var apis = require('apis/index');
  var orderId;
  var payType = '';//支付方式
  var pending = false;//点击确认订购后 接口是否正在跑

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
    apis.newGetOrderDetails(orderId).done(function (result) { // 通过id
      if(result.code === 200){
        var orderDetail = result.result;
        $('.goodsName').html(orderDetail.orderGoods.goodsName);
        $('#price2').html('￥'+orderDetail.origPrice);
        //实付金额
        $('#finalAmount').html('￥'+orderDetail.payPrice);
      }else {
        alert(result.message.split(":")[1]);
      }
    });
    renderPaytype();//加载支付方式
  }

  function buy() {
    apis.newPayOrder(orderId,'WECHAT_H5').done(function(result){
      if (result.ERRORNO === 200) {
        const url = result.result.mWebUrl + '&redirect_url=./buyComplete.html?orderId=' + orderId;
        window.location.href = url;
        //killRouter(JSON.parse(result.DATA).mWebUrl + "&redirect_url=" + 'weixin.glsc.com.cn://?url=/activity/activity2020Calendar/buyComplete.html?orderId='+orderId);
      } else {
        alert(result.message.split(":")[1]);
      }
      stopPending();
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
    $('.payIns .list').append(wechatStr);
  }

  $(function () {
    bindEvents();
    init();
  });
});