define(function (require) {
  var lity = require('lity');
  var jsrender = require('jsrender');
  var fastclick = require('fastclick');
  var copyModal;

  function init() {
    fastclick.attach(document.body);
  }

  function Copy() {
    const range = document.createRange();
    range.selectNode(document.getElementById('content'));

    const selection = window.getSelection();
    if(selection.rangeCount > 0) selection.removeAllRanges();
    selection.addRange(range);
    document.execCommand('copy');
    var copyTipTemplate = $.templates("#copyTip").render();
    copyModal = lity(copyTipTemplate);
  }
  function bindEvents() {
    $('.immediatelyBtn').on('click', function () {
      Copy();
    });
    $(document).on('click', '.copyBtn', function () {
      copyModal.close();
    });
  }

  $(function () {
    // 绑定事件
    bindEvents();
    init();
  });
});
