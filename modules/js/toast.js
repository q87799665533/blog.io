/**
 * Toast component
 * This simple component relies on JQuery
 * @author Eric Kim
 */
define(function() {
  var toast;

  $(function() {
    var dom = document.createElement('div');
    dom.id = 'toast-div';
    document.body.appendChild(dom);
    toast = $(dom);
  });

  return {
    toast: toast,
    show: function(text, option) {
      var mOption = option          || {};
      var fadeIn  = mOption.fadeIn  || 400;
      var delay   = mOption.delay   || 1000;
      var fadeOut = mOption.fadeOut || 400;
      var bottom = mOption.bottom || '42%';
      toast.css({
        width:  mOption.width || '200px',
        display: 'none',
        position: 'fixed',
        left: '50%',
        'margin-left': mOption.marginLeft || '-100px',
        bottom: bottom,
        'background-color': '#383838',
        color: '#F0F0F0',
        'font-size': '14px',
        'box-sizing': 'border-box',
        padding: '10px 20px 10px 20px',
        'text-align': 'center',
        'border-radius': '2px',
        '-webkit-box-shadow': '0px 0px 24px -1px rgba(56, 56, 56, 1)',
        '-moz-box-shadow': '0px 0px 24px -1px rgba(56, 56, 56, 1)',
        'box-shadow': '0px 0px 24px -1px rgba(56, 56, 56, 1)',
        'z-index': 99999,
        'overflow': 'hidden',
      });
      if (text) {
        toast.html(text);
        toast.stop().fadeIn(fadeIn).delay(delay).fadeOut(fadeOut);
      }
    },
  };
});