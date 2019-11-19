define(function (require) {
  var apis = require('apis/index');
  var orderId = '';
  
  
  $('#goods-company-span').html('圆通快递');
  if (window.location.search.split('?orderId=')[1]) {
    orderId = window.location.search.split('?orderId=')[1].split('&')[0];
  }
  apis.payApis.getExpressMsg(orderId).done(function (result) {
    if (result.ERRORNO == "200") {
      var expressMsg =  JSON.parse(result.DATA);
      var code = expressMsg.trackingCode;
      var status = expressMsg.status;
      var trackingInfo = JSON.parse(expressMsg.trackingInfo);
      switch(status){
        case 'DELIVERED':
          $('#goods-state-span').html('成功签收');
          break;
        case 'PICKUP':
          $('#goods-state-span').html('到达代取');
          break;
        case 'TRANSIT':
          $('#goods-state-span').html('运输中');
          break;
        default:
          $('#goods-state-span').html('尚未查询到，请稍后再试！');
      }
      $('#goods-id-span').html(code);//运单编号
      trackingInfo.forEach(function (item){
        var str = '';
        if(item.checkpoint_status === "delivered"){
          str += '<div class="logistic-item final-item">';
        }else{
          str += '<div class="logistic-item">';
        }
        str += '<p class="logistic-item-msg">'+item.StatusDescription+'</p>';
        str+= '<p class="logistic-item-time">'+item.Date+'</p>';
        str+= '</div>';
        $('#logistic-list').append(str);
      });
    } else {
      alert(result.ERRORMESSAGE)
    }
  });
  var list = [{
    msg:'配送完成，感谢您为山区教育尽的一份力！',
    time:'2019-11-08 10:53:11',
    type:'final'
  },{
    msg:'您的包裹正在配送,快递员将按照配送路线先后/。。。',
    time:'2019-11-08 10:53:11',
    tel:'13306182681'
  }];
  
  $('body').on("tap",'#copy',function (){
    const range = document.createRange();
    range.selectNode(document.getElementById('goods-id-span'));
    const selection = window.getSelection();
    if(selection.rangeCount > 0) {
      selection.removeAllRanges();
    }
    selection.addRange(range);
    document.execCommand('copy');
    alert('已复制');
  });
});