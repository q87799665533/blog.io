define(function (require) {
  var app = require('utils/app');
  var appAdr = app.platform;
  var filemessage = require('utils/filemessage');
  var localmessage = require('utils/localmessage');
	var apis = require('apis/index');
	var jsrender = require('jsrender');
	var moment = require('moment');
	var navigation = require('utils/navigation');
  var listType = 0;

	window.GoBackOnLoad = function () {
    finishedOrderList = [];
    payingOrderList = [];
    init();
          
	};

	function init() {
    setActiveTitle(listType);
    $.views.helpers({
      renderTimer: function (time) {
        var thisTime = Math.floor(time/1000);
        var second = Math.floor(thisTime % 60) > 0 ? Math.floor(thisTime % 60) : 0;
        var minute = Math.floor(thisTime / 60) > 0 ? Math.floor(thisTime / 60) : 0;
        return {
            minute: tow(minute),
            second: tow(second)
        }
      }
    });
    getFinishedOrder(true);
    getPayingOrder(true);
	}

	function bindEvents() {
    $('body').on('tap', '#nav0', function () {
      listType = 0;
      setActiveTitle(listType);
    });

    $('body').on('tap', '#nav1', function () {
      listType = 1;
      setActiveTitle(listType);
    });

    $('body').on('tap', '.buyAgain', function(e) { //重新购买
      e.preventDefault();
      e.stopPropagation();
      navigation.toUrl('http://action:10061/?fullscreen=1&&secondtype=9&&url=/activity/activity2020Calendar/createOrder.html');
    });

    $('body').on('tap', '.continueBuy',function(e) { //继续支付
      e.stopPropagation();
      var orderId = $(this).attr('data-orderId');  
        apis.payApis.newGetOrderDetails(orderId).done(function (result) { // 通过id
          if(result.ERRORNO === '200'){
            navigation.toUrl('http://action:10061/?fullscreen=1&&secondtype=9&&url=/activity/activity2020Calendar/pay.html?orderId='+orderId);
          }else {
            alert("获取订单详情失败");
          }
        });

    });
    $('body').on('tap', '.card', function() {
      var orderId = $(this).attr("data-orderId");
      var orderState = $(this).attr("data-orderState");
      if(orderState === 'PENDING' || orderState === 'FINISH'){
        navigation.toUrl('http://action:10061/?fullscreen=1&&secondtype=9&&url=/activity/activity2020Calendar/logistic.html?orderId='+orderId);
      }
    });
	}
	function getFinishedOrder() {
		apis.payApis.getOrders({
      pageNum: 1,
      pageSize: 100,
      goodsType: 'REAL_THING',
      url: 'states=FINISH&states=FULL_REFUND&states=WATING_DELIVERY&states=PENDING',
    }).done(function (result) {
			if (result.ERRORNO == "200") {
        var data =  JSON.parse(result.DATA).list;
        var orderTpl = $.templates('#order-list0').render({ finishedOrderList: data});
				$('#list0').find('*').not('#order-list0').remove();
        $('#list0').append(orderTpl);
				if (data.length > 0) {
          $('#no-finished-order').text('');
          $('#no-finished-order').hide();
          data.forEach(function (item,index){
            if(item.orderState === 'PENDING' || item.orderState === 'FINISH'){
              apis.payApis.getExpressMsg(item.id).done(function (result) {
                if (result.ERRORNO == "200") {
                  var expressMsg =  JSON.parse(result.DATA);
                  var trackingInfo = JSON.parse(expressMsg.trackingInfo);
                  $($('#list0 li')[index]).find('.middle-logis').html(trackingInfo[0].StatusDescription);
                } else {
                  alert(result.ERRORMESSAGE)
                }
              });
            }else{
              $($('#list0 li')[index]).find('.middle-logis').html('发货后可查看物流信息');
            }
          });
				} else {
					$('#no-finished-order').text('您还没有已完成的订单');
					$('#no-finished-order').show();
				}
			} else {
				alert(result.ERRORMESSAGE)
			}
		});
  }
  
  function getPayingOrder(){
    apis.payApis.getOrders({
      pageNum: 1,
      pageSize: 100,
      goodsType: 'REAL_THING',
      url: 'states=WATING_PAY',
    }).done(function (result) {
			if (result.ERRORNO == "200") {
        var data =  JSON.parse(result.DATA).list;
        var orderTpl = $.templates('#order-list1').render({ payingOrderList: data});
				$('#list1').find('*').not('#order-list1').remove();
        $('#list1').append(orderTpl);
				if (data.length > 0) {
          $('#no-paying-order').text('');
          $('#no-paying-order').hide();
          renderOrdersTimer();
				} else {
					$('#no-paying-order').text('您目前没有待支付的订单');
					$('#no-paying-order').show();
				}
			} else {
				alert(result.ERRORMESSAGE)
			}
		});
  }
  function renderOrdersTimer(){
    $("#list1").find(".timer").each(function(){
      var that = this;
      var thisTime = Math.floor($(this).attr("data-countdown")/1000);
      var timer = setInterval(function(){
          if(thisTime <= 0){
            clearInterval(timer);
            $(that).find('.minute').html('00');
            $(that).find('.second').html('00');
          }else{
            thisTime = thisTime - 1;
            var second = Math.floor(thisTime % 60);
            var minute = Math.floor(thisTime / 60);   
            $(that).find('.minute').html(tow(minute));
            $(that).find('.second').html(tow(second));     
          }
        },1000);
    });
  }

  function tow(n) {
    return n >= 0 && n < 10 ? '0' + n : '' + n;
  }

  function setActiveTitle(id) {
    $('.nav').children('div').removeClass();
    $('#nav'+id).addClass('active');
    $('#list0, #list1').hide();
    $('#list'+id).show();
  }

	$(function () {
    bindEvents();
    init();
	});
});
