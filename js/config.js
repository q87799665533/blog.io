require.config({
  urlArgs: "bust=" +  (new Date()).getTime(),
  baseUrl: './',
  paths: {
    // libs
    jquery: 'modules/js/jquery-2.2.4.min',
    'jquery-mobile': 'modules/js/jquery.mobile.custom.min',
    moment: 'modules/js/moment.min',
    lodash: 'modules/js/lodash.min',
    fastclick: 'modules/js/fastclick',
    jsrender: 'modules/js/jsrender.min',
    lity: 'modules/js/lity.min',
    toast: 'modules/js/toast',
    wxShare: 'modules/js/wxShare',

    // paths
    apis: 'ajax',
  }
});
