define(function(require) {
  var navigation = require('utils/navigation');
  var apis = require('apis/index');
  var filemessage = require('utils/filemessage');
  var localmessage = require('utils/localmessage');
  var app = require('utils/app');
  var myAddressName;
  var myAddressTel;
  var myAddressArea;
  var myAddressAdd;
  var price;
  var goodsId;
  var goodsSpecId;
  var addressId = "";
  
  function init() {
    apis.payApis.newFetchEntityProducts('爱の投资日历').done(function(result) {
      if (result.ERRORNO === '200') {
        var data;
        if(JSON.parse(result.DATA).length > 0){
          data = JSON.parse(result.DATA)[0];
          $('#goods-img img').attr('src',data.goodsImage);
          $('#goods-name').html(data.goodsName);
          price = data.goodsSpecificationList[0].discountPrice;
          $('#goods-price').html('￥'+price);
          $('#goods-left span').html(data.goodsSpecificationList[0].inventory);
          $('#order-price').html('￥'+price);
          goodsId = data.goodsId;
          goodsSpecId = data.goodsSpecificationList[0].id;
        }else {
          alert("商品列表请求出错");
          return;
        }
      }else{
        alert(result.ERRORMESSAGE.split(":")[1]);
      }
    });
    renderAddress('first');  
  }

  function renderAddress(type) {
    apis.payApis.getUserRecAdd().done(function (result){
      if (result.ERRORNO === '200') {
        if(JSON.parse(result.DATA).length > 0){
          data = JSON.parse(result.DATA)[0];
          addressId = data.id;
          $('#address-container').html('<div id="my-address-container">'+
          '<div class="updateAddress">修改</div>'+
          '<div><img src="./img/createOrder/icon_dz.png" /></div>'+
          '<div id="my-address">'+
          '<div><span id="my-address-name"></span><span id="my-address-tel"></span></div>'+
          '<span id="my-address-area"></span>'+
          '<span id="my-address-add"></span>'+
          '</div></div>'); 
          myAddressName = data.recName;
          myAddressTel = data.recMobile;
          myAddressArea = data.recProvince + " " + data.recCity + " " + data.recDistrict;
          myAddressAdd = data.recAddress;
          $('#my-address-name').html(myAddressName);
          $('#my-address-tel').html(myAddressTel.slice(0,3)+'****'+myAddressTel.slice(-4));
          $('#my-address-area').html(myAddressArea);
          $('#my-address-add').html(myAddressAdd);
          $('#rec-name').val(myAddressName);
          $('#rec-tel').val(myAddressTel);
          $("#rec-add-picker").attr('value',myAddressArea);
          $("#rec-add-picker").cityPicker({
            title: "请选择地区"
          });
          $("#rec-add").val(myAddressAdd);
        }else{
          $("#rec-add-picker").cityPicker({
            title: "请选择地区"
          });
          $('#address-container').html('<div id="new-address">+添加收货地址</div>');
        }
        if(type === 'second') {
          $('.wrap2').fadeOut("fast");
          document.title = "确认订单";
          setTimeout(function (){
            $('.wrap').fadeIn("fast");
          },200);
        }
      }else{
        alert(result.ERRORMESSAGE.split(":")[1]);
      }
    });
  }

  function bindEvents() {
    $('body').on('tap','#makeOrder',function (){
      if(addressId === ""){
        alert("请先添加收货地址！");
        return;
      }
      apis.payApis.newCreateEntityOrder({
        "addressId": addressId,
        "mobile": '($MobileCode)',
        "orderGoods":{
          count: Number($('#goods-amount').html()),
          goodsId: goodsId,
          goodsSpecId: goodsSpecId,
        },
      }).done(function (result){
        if (result.ERRORNO === '200') {
          var orderId = JSON.parse(result.DATA).id;
          navigation.toUrl('http://action:10061/?fullscreen=1&&secondtype=9&&url=/activity/activity2020Calendar/pay.html?orderId='+orderId);
        }else{
          alert(result.ERRORMESSAGE.split(":")[1]);
        }
      });
    });

    $('body').on('tap','#goods-amount-increase',function (){
      var amount = $('#goods-amount').html();
      $('#goods-amount').html(Number(amount)+1);
      $('#order-amount').html($('#goods-amount').html());
      $('#order-price').html('￥'+$('#goods-amount').html()*price);
    });

    $('body').on('tap','#goods-amount-decrease',function (){
      var amount = $('#goods-amount').html();
      if(amount>1){
        $('#goods-amount').html(Number(amount)-1);
        $('#order-amount').html($('#goods-amount').html());
        $('#order-price').html('￥'+$('#goods-amount').html()*price);
      }
    });
    $('body').on('tap','#address-container',function (){
      $('.wrap').fadeOut("fast");
      document.title = "填写收货地址";
      setTimeout(function (){
        $('.wrap2').fadeIn("fast");
      },200);
    });
    $('body').on('tap','#goBack',function (){
      $('.wrap2').fadeOut("fast");
      document.title = "确认订单";
      setTimeout(function (){
        $('.wrap').fadeIn("fast");
      },200);
    });
    $('body').on('tap','#addNewAddress',function (){
      var emojiTestStr = [
        '\ud83c[\udf00-\udfff]', 
        '\ud83d[\udc00-\ude4f]', 
        '\ud83d[\ude80-\udeff]'
      ];
      var name = $('#rec-name').val();
      if(!name){
        alert("请输入姓名！");
        return;
      }
      name = name.replace(new RegExp(emojiTestStr.join('|'), 'g'), '');
      if(name !== $('#rec-name').val()){
        alert("请检查姓名输入是否有误");
        return;
      }
      if(!$('#rec-tel').val()){
        alert("请输入手机号码！");
        return;
      }
      if(!/^\d{11}$/.test($('#rec-tel').val())){
        alert("手机号码格式不正确！");
        return;
      }
      if(!$("#rec-add-picker").val()){
        alert("请选择地区！");
        return;
      }
      if(!$("#rec-add").val()){
        alert("请填写详细地址！");
        return;
      }
      var add = $("#rec-add").val();
      add = add.replace(new RegExp(emojiTestStr.join('|'), 'g'), '');
      if(add !== $("#rec-add").val()){
        alert("请检查地址输入是否有误");
        return;
      }
      var addressPicker = $("#rec-add-picker").val();
      if(addressId === ""){//没有地址，添加
        apis.payApis.addUserRecAdd({
          "isDefault": false,
          "recName": $('#rec-name').val(),//名字
          "recMobile": $('#rec-tel').val(),//收货电话
          "recProvince": addressPicker.split(" ")[0],//省
          "recCity": addressPicker.split(" ")[1],//城市
          "recDistrict": addressPicker.split(" ")[2],//区
          "recAddress": $("#rec-add").val(),//详细地址
          "userMobile": '($MobileCode)'//用户电话
        }).done(function (result){
          if(result.ERRORNO === '200'){
            renderAddress('second');
          }else{
            alert(result.ERRORMESSAGE.split(":")[1]);
          }
        });
      }else{//修改
        apis.payApis.updateUserRecAdd({
          "isDefault": false,
          "id": addressId,
          "recName": $('#rec-name').val(),//名字
          "recMobile": $('#rec-tel').val(),//收货电话
          "recProvince": addressPicker.split(" ")[0],//省
          "recCity": addressPicker.split(" ")[1],//城市
          "recDistrict": addressPicker.split(" ")[2],//区
          "recAddress": $("#rec-add").val(),//详细地址
          "userMobile": '($MobileCode)'//用户电话
        }).done(function (result){
          if(result.ERRORNO === '200'){
            renderAddress('second');
          }else{
            alert(result.ERRORMESSAGE.split(":")[1]);
          }
        });
      }
    });

    $('#rec-add-picker').on('tap',function(){
      $('#rec-name').blur();
      $('#rec-tel').blur();
      $('#rec-add').blur();
    });
  }
  $(function () {
    init();
    
    bindEvents();
  });
});