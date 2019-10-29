
/**
 * 
 * @描述：基础配置相关
 * @作者：邱育武
 * @版本: 1.0  
 * @公司: 思迪信息 
 * @创建时间: 2015-4-22 下午2:31:42
 */
var wxconfig = (function () {
	
	/**
	 * @描述：获取系统初始化配置
	 * @作者：邱育武
	 * @版本: 1.0  
	 * @公司: 思迪信息 
	 * @创建时间: 2015-4-22 下午2:31:42
	 * @returns wxconfig 返回初始化后，配置文件对象
	 */
	function configInit()
	{
		/**
		 * 全局变量配置项
		 */
		var wxconfig = {
			"weixinpk":window.weixinpk,//公众号微信pk(使用公司微平台系统才配置)
			"appid":window.appid,//公众号微信appid(开启isOAuth2==true才配置)

			// "weixinpk":"gh_3c4538f92c74",//公众号微信pk(使用公司微平台系统才配置)
			// "appid":"wxc708cfea1ce3b185",//公众号微信appid(开启isOAuth2==true才配置)
			"isDebug" : false, //系统Debug调试模式总开关(true开启、false关闭)
			"jssdkDebug" : false, //JSSDK Debug调试模式独立开关(true开启、false关闭)
			"isJSSDK" : true, //开启JSSDK自动验签(true开启、false关闭)
			"isOAuth2" : false, //开启自动重定向OAuth2网页授权地址(true开启、false关闭)
			"isAccessWebAnaly":false,//是否开启用户访问页面统计(true开启、false关闭)
			"serverPath" : window.serverPath, //后台接口请求地址
			"sitePath" : window.location.origin, //本站点地址
			"urlPath" : window.location.href, //浏览器访问地址
			"title" : "test",//站点标题
			"hash":window.location.hash, //页面hash值
			"projName" : "wx", //模块名称
			"scope" : "snsapi_userinfo", //应用授权作用域，snsapi_base,snsapi_userinfo，默认(snsapi_userinfo)
			"islocal" : true, //开启本地缓存，可提高用户体验(true开启、false关闭)
			"localTimeOut" : "20", //开启本地缓存超时时间(分钟为单位)
			"timeOut":"30000",//后台请求接口默认超时时间(单位毫秒)
			"pageSource":"main",//设置默认访问来源
			"webAnalyTimeOut":"10000",//设置统计访问页面的时间间隔(单位毫秒)
			"OAuth2FuncNo" : "1000000",//网页授权功能号
			"JSSDKFuncNo" : "1000003",//JSSDK验签功能号
			"WXPayFuncNo" : "1000004",//微信支付统一下单功能号
			"DownloadImg" : "1000005",//下载图片素材
			"H5AnalysisFuncNo":"1000006"//获取用户访问页面的数据
		};
		return wxconfig;
	}

	return {
	  	version	:"1.2",
	  	configInit:configInit
	};
})();

/**
 * 
 * @描述：基础工具js
 * @作者：邱育武
 * @版本: 1.0  
 * @公司: 思迪信息 
 * @创建时间: 2015-4-22 下午1:41:37
 */
var wxUtils = (function () {
	
	/**
	 * 
	 * @描述：获取链接上的参数
	 * @作者：邱育武
	 * @版本: 1.0  
	 * @公司: 思迪信息 
	 * @创建时间: 2015-4-22 下午1:41:37
	 * @param urlPath 带参数的URL地址，可以不传(默认取浏览器地址栏URL)
	 * @param paramName 参数名称，可以不传，不传则返所有参数
	 * @returns 参数值
	 */
	function getUrlParam(paramName,urlPath) 
	{
		var config = wxconfig.configInit();
		var url = urlPath;
		if(wxUtils.isEmpty(url))
		{
			 url = decodeURIComponent(config.urlPath);
		}
		var theRequest = null;
		if (url.indexOf("?") != -1) 
		{
			theRequest = new Object();
	        var str = url.substr(url.indexOf("?")+1);
	        if (str.indexOf("&") != -1) 
	        {
	            strs = str.split("&");
	            for (var i = 0; i < strs.length; i++) 
	            {
	                theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
	            }
	        }
	        else 
	        {
	            theRequest[str.split("=")[0]] = unescape(str.split("=")[1]);
	        }
		}
		var param = "";
		if(theRequest)
		{
			if(paramName) 
			{
				param = theRequest[paramName];
			}
		}
//		else
//		{
//			if(wxUtils.isEmpty(urlPath))
//			{
//				theRequest = new Object();
//				var sCurPage = wxUtils.getSStorageInfo("_curPage"),
//				curPage = JSON.parse(sCurPage);
//				if(curPage)
//				{
//					var jsonParam = curPage.param;
//					if(paramName) 
//					{
//						param = (jsonParam&&jsonParam!="null") ? jsonParam[paramName] : "";
//					} 
//					else 
//					{
//						theRequest = jsonParam;
//					}
//				}
//			}
//		}
		
		if(!paramName)
		{
			return theRequest;
		}
		else
		{
			param = wxUtils.modifyParam(param);//解决微信参数干扰
			return param?param:"";
		}
		
	}
	
	/**
	 * 
	 * @描述：给URL链接添加一个参数
	 * @作者：邱育武
	 * @版本: 1.0  
	 * @公司: 思迪信息 
	 * @创建时间: 2015-4-22 下午1:41:12
	 * @param url 需要处理的URL地址，可以不传(默认取浏览器地址栏URL)
	 * @param paramName 参数名称(必传)
	 * @param value 参数值(必传)
	 * @returns 添加参数完成后的URL
	 */
	function setUrlParam(paramName,value,url) 
	{
		var config = wxconfig.configInit();
		if(wxUtils.isEmpty(url))
		{
			 url = config.urlPath;
		}
		
		if (url.indexOf("?") != -1) 
		{
			url = url + "&"+paramName+"="+value;
		}
		else
		{
			url = url + "?"+paramName+"="+value;
		}
		return url;
	}
	
	/**
	 * 
	 * @描述：获取sessionStorage信息，session级别缓存
	 * @作者：邱育武
	 * @版本: 1.0  
	 * @公司: 思迪信息 
	 * @创建时间: 2015-4-22 下午1:38:46
	 * @param key 设置的key, 
	 * @param isModulesShare true/false 是否增加模块前缀标识，false增加，true不增加，不传默认为false 
	 * @returns value值
	 */
	function getSStorageInfo(key,isModulesShare)
	{
		try 
		{
			var config = wxconfig.configInit();
			var keys = "";
			//增加模块前缀标识
			if(wxUtils.isEmpty(isModulesShare) || isModulesShare==false){
				keys = config.projName + "|" + key;
			}
			var value = sessionStorage.getItem(keys);
			if(wxUtils.isEmpty(value)){
				value = sessionStorage.getItem(key);
			}
			return value?value:null;
		} 
		catch (e) 
		{
			alert("您的浏览器版本太低，或者您开启了隐身/无痕浏览模式，或者WebView组件不支持sessionStorage！");
		}
	}
	
	/**
	 * 
	 * @描述：保存sessionStorage信息，session级别缓存
	 * @作者：邱育武
	 * @版本: 1.0  
	 * @公司: 思迪信息 
	 * @创建时间: 2015-4-22 下午1:40:24
	 * @param key 设置的key
	 * @param value 设置的值
	 * @param isModulesShare true/false 是否增加模块前缀标识，false增加，true不增加，不传默认为false 
	 */
	function setSStorageInfo(key, value,isModulesShare)
	{
		try 
		{
			var config = wxconfig.configInit();
			//增加模块前缀标识
			if(wxUtils.isEmpty(isModulesShare) || isModulesShare==false) 
			{
				key = config.projName + "|" + key;
			}
			sessionStorage.setItem(key, value);
		}
		catch (e) 
		{
			alert("您的浏览器版本太低，或者您开启了隐身/无痕浏览模式，或者WebView组件不支持sessionStorage！");
		}
	}
	
	/**
	 * 
	 * @描述：清除sessionStorage中的数据，这里分3种情况：
	 * 1、如果不传key，则清除当前模块的sessionStorage数据
	 * 2、如果key为字符串变量，则清除当前模块的sessionStorage数据
	 * 3、如果key为Boolean类型变量true，则清除同一站点下所有模块的sessionStorage数据（支持多模块）
	 * @作者：邱育武
	 * @版本: 1.0  
	 * @公司: 思迪信息 
	 * @创建时间: 2015-4-22 下午5:20:18
	 * @param key 设置的key
	 */
	function clearSStorage(key)
	{
		try 
		{
			var config = wxconfig.configInit();
			if(key === true) 
			{
				sessionStorage.clear();
			}
			else 
			{
				if(key) 
				{
					sessionStorage.removeItem(config.projName + "|" + key);
				} 
				else 
				{
					for(var pkey in sessionStorage) 
					{
						if(pkey.indexOf(config.projName + "|")>-1)
						{
							sessionStorage.removeItem(pkey);
						}
					}
				}
			}
		}
		catch (e) 
		{
			alert("您的浏览器版本太低，或者您开启了隐身/无痕浏览模式，或者WebView组件不支持sessionStorage！");
		}
	}
	
	/**
	 * @描述：初始化用户访问来源
	 * @作者：邱育武
	 * @版本: 1.0  
	 * @公司: 思迪信息 
	 * @创建时间: 2015-4-30 上午10:54:37
	 * @returns 参数值
	 */
	function initPageSource()
	{
		var config = wxconfig.configInit();
		var url = decodeURIComponent(config.urlPath);
		//来源
		var source = {
			"fromShare" : url.indexOf("_wxshare=1") > -1,
			"fromTimeline" : url.indexOf("from=timeline") > -1,
			"fromGroupmessage" : url.indexOf("from=groupmessage") > -1,
			"formSinglemessage" : url.indexOf("from=singlemessage") > -1
		};
		var sourceInfo = "";
		if (source.fromTimeline) {
			// 来自朋友圈
			wxUtils.setSStorageInfo("pageSource", "fromTimeline");
			sourceInfo = "来自[朋友圈分享]";
		} else if (source.fromGroupmessage) {
			// 来自微信群
			wxUtils.setSStorageInfo("pageSource", "fromGroupmessage");
			sourceInfo = "来自[微信群组分享]";
		} else if (source.formSinglemessage) {
			// 来自好友
			wxUtils.setSStorageInfo("pageSource", "formSinglemessage");
			sourceInfo = "来自[好友聊天分享]";
		}else {
			// 来源于主页面
			wxUtils.setSStorageInfo("pageSource", config.pageSource);
			sourceInfo = "来自[非分享]";
		}
		if (!wxUtils.is_weixn()) {
			if (source.fromShare) {
				wxUtils.setSStorageInfo("pageSource", "_wxshare");
				sourceInfo = "来自[分享但不是微信浏览器打开]";
			}
		}
		if (config.isDebug) {
			alert(sourceInfo);
		}
	}
	
	/**
	 * @描述：获取用户访问来源
	 * @作者：邱育武
	 * @版本: 1.0
	 * @公司: 思迪信息
	 * @创建时间: 2015-4-30 上午10:54:37
	 * @returns 返回来源标示
	 */
	function getPageSource()
	{
		var config = wxconfig.configInit();
		var urlPath = config.urlPath;
		//来源
		var source = wxUtils.getSStorageInfo("pageSource");
		return source;
	}
	
	/**
	 * @描述：解决微信参数干扰
	 * @作者：邱育武
	 * @版本: 1.0  
	 * @公司: 思迪信息 
	 * @创建时间: 2015-4-30 上午05:54:37
	 * @param param 待处理的参数
	 * @returns 返回更正后参数值
	 */
	function modifyParam(param){
		var str = decodeURI(param);
		if (str.indexOf("from=") != -1 || str.indexOf("from%3D") != -1 ) 
		{
			str = str.split("?")[0];
		}
		if(str.indexOf("?") != -1 || str.indexOf("%3F") != -1)
		{
			str = str.split("?")[0];
		}
		return str;
	}
	
	/**
	 * @描述:获取时间戳
	 * @作者：邱育武
	 * @版本: 1.0  
	 * @公司: 思迪信息 
	 * @创建时间: 2015-4-22 下午5:20:18
	 * @param timestamp 当前时间戳(自1970年1月1日 0点0分0秒以来的秒数)
	 */
	function getTimeStamp()
    {
        var timeStr=new Date().getTime();
        var timestamp = timeStr.toString();//一定要转换字符串
        return timestamp;
    }
    
	/**
	 * @描述:是否是微信浏览器
	 * @作者：邱育武
	 * @版本: 1.0  
	 * @公司: 思迪信息 
	 * @创建时间: 2015-4-22 04:20:18
	 * @returns true 是  false 不是
	 */
	function is_weixn()
	{
	    var ua = navigator.userAgent.toLowerCase();
	    if(ua.match(/MicroMessenger/i)=="micromessenger") {
	        return true;
	    } else {
	        return false;
	    }
	}
	
	/**
	 * @描述:判断某参数是否不为空
	 * @作者：邱育武
	 * @版本: 1.0  
	 * @公司: 思迪信息 
	 * @创建时间: 2015-5-16 03:25:18
	 * @param param 需要判断的参数
	 * @returns true 不为空  false 为空
	 */
	function isNotEmpty(param)
	{
		if(param==null || param == undefined || typeof(param)=="undefined" || param=="" || param == "undefined" || param == "null"){
			 return false;
		}else{
			 return true;
		}
	}
	
	/**
	 * @描述:判断某参数是否为空
	 * @作者：邱育武
	 * @版本: 1.0  
	 * @公司: 思迪信息 
	 * @创建时间: 2015-5-16 03:25:18
	 * @param param 需要判断的参数
	 * @returns true 为空  false 不为空
	 */
	function isEmpty(param)
	{
		if(param==null || param == undefined || typeof(param)=="undefined" || param=="" || param == "undefined" || param == "null"){
			 return true;
		}else{
			 return false;
		}
	}
	
	/**
	 * @描述: 关闭页面加载图片
	 * @作者： 邱育武
	 * @版本: 1.0  
	 * @公司: 思迪信息 
	 * @创建时间: 2015-5-16 03:25:18
	 */
	function closeLoading()
	{
		var LoadPage = document.getElementById("firstLoadPage"); 
		if(wxUtils.isNotEmpty(LoadPage))
		{
			LoadPage.style.display = 'none'; 
		}
		wxUtils.closeAjaxLoading();
	}
	
	/**
	 * @描述: 关闭ajax加载动画
	 * @作者： 邱育武
	 * @版本: 1.0  
	 * @公司: 思迪信息 
	 * @创建时间: 2015-5-16 03:25:18
	 */
	function closeAjaxLoading()
	{
		var overlay = document.getElementById("ajaxLoading_overlay_custom"); 
		var showbox = document.getElementById("ajaxLoading_showbox_custom"); 
		if(wxUtils.isNotEmpty(overlay))
		{
			overlay.style.display = 'none'; 
		}
		if(wxUtils.isNotEmpty(showbox))
		{
			showbox.style.display = 'none'; 
		}
	}
	
	/**
	 * @描述: 开启ajax加载动画
	 * @作者： 邱育武
	 * @版本: 1.0  
	 * @公司: 思迪信息 
	 * @创建时间: 2015-5-16 03:25:18
	 */
	function openAjaxLoading()
	{
		var overlay = document.getElementById("ajaxLoading_overlay_custom"); 
		var showbox = document.getElementById("ajaxLoading_showbox_custom"); 
		if(wxUtils.isNotEmpty(overlay) && wxUtils.isNotEmpty(showbox))
		{
			overlay.style.display = 'block'; 
			showbox.style.display = 'block'; 
		}
	}
	
	/**
	 * @描述: 清理URL上的code
	 * @作者： 邱育武
	 * @版本: 1.0  
	 * @公司: 思迪信息 
	 * @创建时间: 2015-5-16 03:29:18
	 */
	function cleanCode(url)
	{
		if(wxUtils.isEmpty(url))
		{
			return;
		}
		if(url.indexOf("?code=") != -1){
			return url.replace("?code=","?invalid_code=");
		}
		if(url.indexOf("&code=") != -1){
			return url.replace("?code=","&invalid_code=");
		}
		return url;
	}
	
	/**
	 * @描述: 获取当前页面第一张图片url地址
	 * @作者： 邱育武
	 * @版本: 1.0  
	 * @公司: 思迪信息 
	 * @创建时间: 2015-5-18 13:29:18
	 */
	function getFirstImgPath()
	{
		var imgScr="";
		var imgs = document.getElementsByTagName("img");
		if(wxUtils.isNotEmpty(imgs))
		{
			for(var i=0;i<imgs.length;i++)
			{
				if(wxUtils.isNotEmpty(imgs[i].src) && imgs[i].width > 80 && imgs[i].height > 80)
				{
					imgScr = imgs[i].src;
					break;
				}
			}
			if(wxUtils.isEmpty(imgScr))
			{
				imgScr = imgs[1] ? imgs[1].src:"";//默认第二个图片
			}
		}
		return imgScr;
	}
	
	/**
	 * @描述: 将json对象数据转换成字符串
	 * @作者： 邱育武
	 * @版本: 1.0  
	 * @公司: 思迪信息 
	 * @创建时间: 2015-5-18 13:29:18
	 * @param jsonData 需要转换的json数据
	 * @returns 转换好的字符串
	 */
	function jsonToString(jsonData)
	{
		if(wxUtils.isNotEmpty(jsonData))
		{
			return JSON.stringify(jsonData);
		}
		return "";
	}
	
	/**
	 * @描述: 将字符串数据转换成json对象
	 * @作者： 邱育武
	 * @版本: 1.0  
	 * @公司: 思迪信息 
	 * @创建时间: 2015-5-18 15:29:18
	 * @param strData 需要转换的json数据
	 * @returns 转换好的字符串
	 */
	function stringToJson(strData)
	{
		if(wxUtils.isNotEmpty(strData))
		{
			var str = '(' + strData + ')'; //json字符串
			return eval(str);
		}
		return "";
	}
	
	/**
	 * @描述: 保存localStorage信息，离线浏览器缓存还存在
	 * @作者： 邱育武
	 * @版本: 1.0  
	 * @公司: 思迪信息 
	 * @创建时间: 2015-6-3 01:25:53
	 * @parm key 设置的key
	 * @parm value 设置的值
	 * @parm isModulesShare true/false 是否增加模块前缀标识，false增加，true不增加，不传默认为false
	 */
	function setLStorageInfo(key, value, isModulesShare)
	{
		var config = wxconfig.configInit();//获取配置
		if(config.islocal)
		{
			var timestamp = wxUtils.getTimeStamp();//存储的时间戳
			var storageinfo = {
					"timestamp":timestamp,
					 key:value
			};
			var infotxt = wxUtils.jsonToString(storageinfo);
			//增加模块前缀标识
			if(wxUtils.isEmpty(isModulesShare) || isModulesShare==false){
				key = config.projName + "|" + key;
			}
			try {
				localStorage.setItem(key, infotxt);
			} catch (e) {
				alert("您的浏览器版本太低，或者您开启了隐身/无痕浏览模式，或者WebView组件不支持localStorage！");
			}
		}else{
			if(config.isDebug){
				alert("未开启离线缓存模式，不支持localStorage缓存！");
			}
		}
	}
	
	/**
	 * 获取localStorage信息
	 * 在key前增加模块名的前缀标识，每个模块存的key值是属于当前模块的，避免冲突，而开发人员不需要关注前缀（缓存的数据会自动增加前缀标识）
	 * 另外在非pc浏览器上保存、取值统一通过aes加密为密文
	 * @parm key 设置的key
	 * @parm isModulesShare true/false 是否多模块共享，true表示可以被其他模块使用，则保存没有模块前缀标识，不传默认为false
	 */
	function getLStorageInfo(key, isModulesShare)
	{
		var config = wxconfig.configInit();//获取配置
		if(config.islocal)
		{
			var timestamp1 = wxUtils.getTimeStamp();//存储的时间戳
			var timeout = config.localTimeOut;//离线缓存数据超时时间(分钟为单位)
			//增加模块前缀标识
			if(wxUtils.isEmpty(isModulesShare) || isModulesShare==false){
				key = config.projName + "|" + key;
			}
			var value = null;
			try {
				value = localStorage.getItem(key);
			} catch (e) {
				alert("您的浏览器版本太低，或者您开启了隐身/无痕浏览模式，或者WebView组件不支持localStorage！");
			}
			var storageinfo = wxUtils.stringToJson(value);//转换成json对象
			var timestamp2 = storageinfo.timestamp;//获取时间戳
			var time = (timestamp1 - timestamp2)/1000/60;
			var keyValue = storageinfo.key;//获取数据
			if(time > timeout)
			{
				wxUtils.clearLStorage(key);//清理本地离线缓存数据
				if(config.isDebug){
					alert(key+"【离线缓存已经超时"+Math.round(time-timeout)+"分钟,已经被清理！】");
				}
				return null;
			}
			else
			{
				keyValue = keyValue?keyValue:null
				if(config.isDebug &&　wxUtils.isNotEmpty(keyValue)){
					alert("获得离线缓存数据"+key+"="+keyValue+"【数据将在"+Math.round(timeout-time)+"分钟后失效！】");
				}
				return keyValue;
			}
		}
		else
		{
			if(config.isDebug){
				alert("未开启离线缓存模式，不支持localStorage缓存！");
			}
		}
	
	}
	
	/**
	 * 
	 * @描述：清除localStorage中的数据，这里分3种情况：
	 * 1、如果不传key，则清除当前模块的localStorage数据
	 * 2、如果key为字符串变量，则清除当前模块的localStorage数据
	 * 3、如果key为Boolean类型变量true，则清除同一站点下所有模块的localStorage数据（支持多模块）
	 * @作者：邱育武
	 * @版本: 1.0  
	 * @公司: 思迪信息 
	 * @创建时间: 2015-4-22 下午5:20:18
	 * @param key 设置的key
	 */
	function clearLStorage(key)
	{
		try 
		{
			var config = wxconfig.configInit();//获取配置
			if(config.islocal)
			{
				if(key === true)
				{
					localStorage.clear();
				} 
				else 
				{
					if(key) 
					{
						localStorage.removeItem(key);
					} 
					else 
					{
						for(var pkey in localStorage)
						{
							if(pkey.indexOf(config.projName + "|")>-1){
								localStorage.removeItem(pkey);
							}
						}
					}
				}
			}else{
				if(config.isDebug){
					alert("未开启离线缓存模式，不支持localStorage缓存！");
				}
			}
		}
		catch (e) 
		{
			alert("您的浏览器版本太低，或者您开启了隐身/无痕浏览模式，或者WebView组件不支持localStorage！");
		}
	}
	
	return {
	  	version	:"1.1",
		getUrlParam: getUrlParam,
		setUrlParam: setUrlParam,
		getSStorageInfo: getSStorageInfo,
		setSStorageInfo: setSStorageInfo,
		clearSStorage: clearSStorage,
		getPageSource: getPageSource,
		initPageSource: initPageSource,
		modifyParam: modifyParam,
		getTimeStamp:getTimeStamp,
		is_weixn:is_weixn,
		isNotEmpty:isNotEmpty,
		isEmpty:isEmpty,
		closeLoading:closeLoading,
		cleanCode:cleanCode,
		getFirstImgPath:getFirstImgPath,
		jsonToString:jsonToString,
		stringToJson:stringToJson,
		setLStorageInfo:setLStorageInfo,
		getLStorageInfo:getLStorageInfo,
		clearLStorage:clearLStorage,
		closeAjaxLoading:closeAjaxLoading,
		openAjaxLoading:openAjaxLoading
	};
})();

/**
 * 
 * @描述：原生js Ajax 请求
 * @作者：邱育武
 * @版本: 1.0
 * @公司: 思迪信息
 * @创建时间: 2015-4-22 下午2:32:49
 */
var Ajax = (function () {
	
	/**
	 * 得到Ajax对象
	 * @作者：邱育武
	 * @版本: 1.0
	 * @公司: 思迪信息
	 * @创建时间: 2015-4-22 下午2:32:49
	 * @returns ajax对象
	 */
	function getajaxHttp() {
		var xmlHttp;
		try 
		{
			// Firefox, Opera 8.0+, Safari Google Chrome
			xmlHttp = new XMLHttpRequest();
		}
		catch (e) 
		{
			// Internet Explorer
			try 
			{
				xmlHttp = new ActiveXObject("Msxml2.XMLHTTP");
			} 
			catch (e) 
			{
				try 
				{
					xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
				} catch (e) 
				{
					alert("您的浏览器不支持AJAX！");
					return false;
				}
			}
		}
		return xmlHttp;
	}
	
	/**
	 * 
	 * @描述：原生js发送ajax请求
	 * @作者：邱育武
	 * @版本: 1.0  
	 * @公司: 思迪信息 
	 * @创建时间: 2015-4-22 下午2:34:22
	 * @param url 请求url
	 * @param methodtype 请求方式 (post/get)
	 * @param isAsync true(异步)/false(同步)
	 * @param param 请求参数
	 * @param functionName 回调方法名，不需要引号,这里只有成功的时候才调用
	 * @param obj 需要在调用请求成功后回调函数中处理的数据
	 * @param dataFormat 返回数据格式 true(原格式返回)/false(json格式) 默认:false
	 * @param timeOutFunc 超时后的回调方法
	 * @param timeOut 超时时间(毫秒级别，不传默认30000毫秒，相当于30秒)
	 * @param iLoading 是否开启加载层 true 开启 false 关闭(默认false)
	 */
	function ajaxRequest(url, methodtype, isAsync, param, functionName, obj, dataFormat, timeOutFunc,timeOut,iLoading) 
	{
		if(iLoading)
		{
			wxUtils.openAjaxLoading();
		}
		// 参数处理 UTF-8编码
		for ( var key in param) 
		{
			var value = param[key] + "";
			if (wxUtils.isEmpty(value)) 
			{
				param[key] = "";
			} 
			else 
			{
				value = encodeURIComponent(value);
				param[key] = value;
			}
		}
		
		if(!timeOut){
			var config = wxconfig.configInit();
			timeOut = config.timeOut;
		}
	  	var xmlhttp = getajaxHttp();
	  	var isTimeout = false,
	        timeFlag = 0,
	        options = {
	            url : url,   // string
	            data : param,  // json or string
	            method : methodtype,
	            timeout : timeOut,
	            async : isAsync,
	            success : function(data){
	            	if(iLoading){
	            		wxUtils.closeAjaxLoading();
	            	}
	            	 if(functionName){
	            		 functionName(data,obj);
	            	 }
	            },
	            timeOut : function(data){
	            	if(iLoading){
	            		wxUtils.closeAjaxLoading();
	            	}
	            	 if(timeOutFunc){
	    				 timeOutFunc(obj);
	    			 }else
	            	 {
	    				 alert("请求超时，请稍后重试！");
	    			 }
	            },
	            error : function(xmlhttp){
	            	if(iLoading){
	            		wxUtils.closeAjaxLoading();
	            	}
	            }
	  		};
        if(param){
            if(typeof options.data == "string"){} else {options.data = Ajax.json2String(param); }    
        }
        xmlhttp.onreadystatechange = function(){
            if(xmlhttp.readyState == 4) {
                if(!isTimeout && xmlhttp.status == 200) {
                    clearTimeout(timeFlag);
                    if(!dataFormat){
                        try{
                            var resobj = JSON.parse(xmlhttp.responseText);
                            options.success(resobj);    
                        } catch(e) {
                            var str = '(' + xmlhttp.responseText + ')';  //json字符串
                            options.success(eval(str));
                        }
                    }
                    else 
                    {
                    	var resobj = xmlhttp.responseText;
                    	options.success(resobj);
                    }
                } else {
                    clearTimeout(timeFlag);
                    options.error(xmlhttp);
                }
            }
        };
        
        timeFlag = setTimeout(function(){
            if(xmlhttp.readyState != 4 || xmlhttp.status != 200) {
                isTimeout = true;
                xmlhttp.abort();
                options.timeOut(xmlhttp);
                clearTimeout(timeFlag);
             }  
        }, options.timeout);
        
        xmlhttp.open(options.method.toUpperCase(), options.url, options.async);  //打开与服务器连接
        if(options.method.toUpperCase() == "POST") {
            xmlhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');  //post方式要设置请求类型
            xmlhttp.send(options.data);  //发送内容到服务器
        } else {
                xmlhttp.send(null);
        }
	}
	
	/**
	 * 参数处理
	 */
    function json2String (jsonData) {
        var strArr = [];
        for(var k in jsonData) {
            strArr.push(k + "=" + jsonData[k]);    
        }
        return strArr.join("&");
    }
    
	return {
	  	version	:"1.0",
	  	ajaxRequest: ajaxRequest,
	  	getajaxHttp: getajaxHttp,
	  	json2String: json2String
	};
})();
/**
 * 
 * @描述：原生js微信OAuth2.0网页授权
 * @作者：邱育武
 * @版本: 1.0  
 * @公司: 思迪信息 
 * @创建时间: 2015-4-22 下午2:30:10
 */
var OAuth2 = (function () {
	
	/**
	 * @描述：初始化用户信息
	 * @作者：邱育武
	 * @版本: 1.0  
	 * @公司: 思迪信息 
	 * @param code 网页授权code
	 * @param flag 是否弹提示标记 
	 * @创建时间: 2015-4-22 下午1:50:26
	 */
	function initCustomer(code,flag)
	{
		var config = wxconfig.configInit();	
		if (wxUtils.isEmpty(code)) 
		{
			code = OAuth2.getOAuth2Code();// 获取code
		}
		var openid = OAuth2.getOpenid();// 获取openid
		var customer = "";
		if (wxUtils.isNotEmpty(openid))// openid不为空
		{
			customer = OAuth2.getCustomer();
		} 
		else if (wxUtils.isNotEmpty(code)) 
		{
			if(config.isDebug){
				alert("授权参数code=" + code);
			}
			customer = OAuth2.getCustomerByCode(code);// code不为空
		}
		else if(config.isOAuth2 && wxUtils.is_weixn())
		{
			customer = OAuth2.getCodeByAppid();// 重定向获取code
		}
		
		if(wxUtils.isNotEmpty(customer) && wxUtils.isNotEmpty(customer.openid))
		{
			if(config.isDebug && flag)
			{
				if(wxUtils.getPageSource() != "main")
				{
					var sharecustomer = OAuth2.getShareCustomer();
					alert("分享者的sopenid=" + sharecustomer.sopenid);
					alert("分享者的sweixinpk=" + sharecustomer.sweixinpk);
					alert("分享者的snickname=" + sharecustomer.snickname);
				}
				alert("我的openid=" + customer.openid);
				alert("我的weixinpk=" + customer.weixinpk);
				alert("我的nickname=" + customer.nickname);
				var subscribe = customer.subscribe;
				if(subscribe == "0"){
					alert("关注状态：已关注公众号!")
				}else if(subscribe == "1"){
					alert("关注状态：未关注公众号!")
				}else{
					alert("关注状态：未知!")
				}
			}
		}
		return customer;
	}
	
	/**
	 * @描述：初始化用户网页授权信息
	 * @作者：邱育武
	 * @版本: 1.0
	 * @公司: 思迪信息
	 * @创建时间: 2015-4-22 下午1:50:26
	 */
	function setURLCustomer()
	{
		//接收当前用户URL参数
		var weixinpk = wxUtils.getUrlParam("weixinpk");//获取链接传递的weixinpk
		var openid = wxUtils.getUrlParam("openid");//用户openid
		var nickname = wxUtils.getUrlParam("nickname");//用户昵称
		var sex = wxUtils.getUrlParam("sex"); //用户的性别，值为1时是男性，值为2时是女性，值为0时是未知  
		var province = wxUtils.getUrlParam("province");//用户个人资料填写的省份
		var city = wxUtils.getUrlParam("city");//用户个人资料填写的城市
		var country = wxUtils.getUrlParam("country");//国家，如中国为CN
		var subscribe = wxUtils.getUrlParam("subscribe");//关注状态 0关注，1未关注
		var headimgurl = wxUtils.getUrlParam("headimgurl");//用户头像,最后一个数值代表正方形头像大小
		var privilege = wxUtils.getUrlParam("privilege"); //用户特权信息，json 数组，如微信沃卡用户为（chinaunicom）
		var source = wxUtils.getPageSource();//获取来源
		if(source == "main"){
			//从主页面进入的，就设置当前用户信息
			OAuth2.setCustomer(openid,weixinpk,nickname,sex,province,city,country,headimgurl,privilege,subscribe);
		}else{
			//不是主页面进入，直接将链接用户信息设置为分享者信息
			OAuth2.setShareCustomer(openid,weixinpk,nickname);
		}
		//再接收开发者单独传递的分享者用户信息
		var sweixinpk = wxUtils.getUrlParam("sweixinpk");//分享者用户weixinpk
		var sopenid = wxUtils.getUrlParam("sopenid");//分享者openid
		var snickname = wxUtils.getUrlParam("snickname");//用户昵称
		//设置分享者用户信息
		OAuth2.setShareCustomer(sopenid,sweixinpk,snickname);
	}
	/**
	 * 
	 * @描述：获取网页授权code
	 * @作者：邱育武
	 * @版本: 1.0
	 * @公司: 思迪信息
	 * @创建时间: 2015-4-22 下午4:50:01
	 * @returns code 不存在返回 ""
	 */
	function getOAuth2Code()
	{
		var code = wxUtils.getUrlParam("code");//获取微信code
		if(wxUtils.isEmpty(code))//链接去不到，可能链接被微信干扰了
		{
			var config = wxconfig.configInit();
			var url = decodeURIComponent(config.urlPath);
			if(url.indexOf("?code=") != -1 || url.indexOf("&code=") != -1)
			{
				if(url.indexOf("&code=") != -1){
					url = url.substr(url.indexOf("&code=")+6);//截取出&code=后面的字符串 
				}
				else{
					url = url.substr(url.indexOf("?code=")+6);//截取出?code=后面的字符串 
				}
				if(url.indexOf("?") != -1){
					code = url.substr(0,url.indexOf("?"));
				}
				else if(url.indexOf("&") != 1){
					code = url.substr(0,url.indexOf("&"));
				}
			}
		}
		//还是为空，可能被参数干扰，然后链接的参数又被html5框架隐藏了
//		if(wxUtils.isEmpty(code)){
//			var sCurPage = wxUtils.getSStorageInfo("_curPage"),
//			curPage = JSON.parse(sCurPage);
//			if(curPage)
//			{
//				var jsonParam = curPage.param;//框架缓存参数
//				for(var item in jsonParam)
//				{
//					var value = ""+jsonParam[item];
//					if(wxUtils.isNotEmpty(value) && value.indexOf("code=") != -1)
//					{
//						code = value.substr(value.indexOf("code=")+5);//截取出code=后面的字符串 
//						break;
//					}
//				}
//			}
//		}
		return code?code:"";
	}
	
	
	/**
	 * 
	 * @描述：获取微信用户openid
	 * @作者：邱育武
	 * @版本: 1.0  
	 * @公司: 思迪信息 
	 * @创建时间: 2015-4-22 下午4:50:01
	 * @returns openid  获取微信用户openid 不存在返回 ""
	 */
	function getOpenid()
	{
		var openid = wxUtils.getSStorageInfo("openid");//取一级缓存
		if(wxUtils.isEmpty(openid))
		{
			openid = wxUtils.getSStorageInfo("openid",true);//一级缓存没有，取缓二级存
		}
		if(wxUtils.isNotEmpty(openid))//不为空时，存缓存
		{
			wxUtils.setSStorageInfo("openid",openid);
		}
		return openid?openid:"";
	}
	
	/**
	 * 
	 * @描述：获取缓存中的weixinpk
	 * @作者：邱育武
	 * @版本: 1.0
	 * @公司: 思迪信息
	 * @创建时间: 2015-4-22 下午1:53:06
	 * @returns weixinpk 公众号唯一表示(若取不到，则返回"")
	 */
	function getWeixinpk()
	{
		var weixinpk = wxUtils.getUrlParam("weixinpk");// 优先取连接参数
		if(wxUtils.isEmpty(weixinpk))
		{
			weixinpk = wxUtils.getSStorageInfo("weixinpk");// 取一级缓存
		}
		
		if(wxUtils.isEmpty(weixinpk))
		{
			var state = wxUtils.getUrlParam("state");// 获取网页授权state字段
			// 存在gh_说明是个weixinpk
			if(wxUtils.isNotEmpty(state)&& state.indexOf("gh_")!= -1)
			{
				state = decodeURI(state);//解码
				if(state.indexOf("#")!= -1)
				{
					state = state.split("#")[0];
				}
				weixinpk = state;
			}
		}
		if(wxUtils.isEmpty(weixinpk))
		{
			var config = wxconfig.configInit();
			weixinpk = config.weixinpk;// 缓存没有直接，取配置的
		}
		if(wxUtils.isNotEmpty(weixinpk))// 不为空时，存缓存
		{
			wxUtils.setSStorageInfo("weixinpk",weixinpk);
		}
		return weixinpk?weixinpk:"";
	}
	
	/**
	 * @描述：获取公众号appid
	 * @作者：邱育武
	 * @版本: 1.0  
	 * @公司: 思迪信息 
	 * @创建时间: 2015-4-22 下午1:53:06
	 * @returns appid 公众号appid(若取不到，则返回null)
	 */
	function getAppid()
	{
		var config = wxconfig.configInit();
		var appid = config.appid;//链接没有直接，取配置的
		if(wxUtils.isNotEmpty(appid))//存缓存
		{
			wxUtils.setSStorageInfo("appid",appid);
		}
		return appid?appid:"";
	}
	
	/**
	 * 
	 * @描述：将微信用户信息存入缓存
	 * @作者：邱育武
	 * @版本: 1.0  
	 * @公司: 思迪信息 
	 * @创建时间: 2015-4-22 下午1:49:44
	 * @param openid 用户的唯一标识 
	 * @param weixinpk 公众号唯一标识 
	 * @param nickname 用户昵称 
	 * @param sex 用户的性别，值为1时是男性，值为2时是女性，值为0时是未知  
	 * @param province 用户个人资料填写的省份  
	 * @param city 用户个人资料填写的城市 
	 * @param country 国家，如中国为CN  
	 * @param headimgurl 用户头像,最后一个数值代表正方形头像大小 
	 * @param privilege 用户特权信息，json 数组，如微信沃卡用户为（chinaunicom）
	 * @param subscribe 关注状态 0关注，1未关注
	 * @param join_date 首次关注时间(yyyy-mm-dd hh:mm:ss)
	 * @param flag localcustomer存储标记 false存，true不存
	 * @returns  wxCustomer(该对象详见说明文档)
	 */
	function setCustomer(openid,weixinpk,nickname,sex,province,city,country,headimgurl,privilege,subscribe,join_date,flag)
	{
		var wxCustomer = {
			"openid"     : openid, //用户的唯一标识
			"weixinpk"   : weixinpk, //公众号唯一标识 
			"nickname"   : nickname, //用户昵称
			"sex"        : sex, //用户的性别，值为1时是男性，值为2时是女性，值为0时是未知  
			"province"   : province, //用户个人资料填写的省份
			"city"       : city, //用户个人资料填写的城市
			"country"    : country, //国家，如中国为CN
			"headimgurl" : headimgurl,//用户头像,最后一个数值代表正方形头像大小
			"privilege"  : privilege, //用户特权信息，json 数组，如微信沃卡用户为（chinaunicom）
			"subscribe"  : subscribe, //关注状态 0关注，1未关注
			"join_date"  : join_date //首次关注时间(yyyy-mm-dd hh:mm:ss)
				
		};
		var config = wxconfig.configInit();
		if(config.islocal && wxUtils.isNotEmpty(openid) && !flag)//启用离线缓存机制
		{
			var localcustomer = wxUtils.jsonToString(wxCustomer);//转车字符串
			wxUtils.setLStorageInfo("localcustomer",localcustomer);//存入本地离线缓存
		}
		for(var item in wxCustomer)
		{
			var value = wxCustomer[item];
			if(wxUtils.isNotEmpty(value))
			{
				wxUtils.setSStorageInfo(item,value);
			}
		}
//		wxUtils.setSStorageInfo("openid",openid);
//		wxUtils.setSStorageInfo("weixinpk",weixinpk);
//		wxUtils.setSStorageInfo("nickname",nickname);
//		wxUtils.setSStorageInfo("sex",sex);
//		wxUtils.setSStorageInfo("province",province);
//		wxUtils.setSStorageInfo("city",city);
//		wxUtils.setSStorageInfo("country",country);
//		wxUtils.setSStorageInfo("headimgurl",headimgurl);
//		wxUtils.setSStorageInfo("privilege",privilege);
//		wxUtils.setSStorageInfo("subscribe",subscribe);
//		wxUtils.setSStorageInfo("join_date",join_date);
		return wxCustomer;
	}
	
	/**
	 * 
	 * @描述：保存分享者信息
	 * @作者：邱育武
	 * @版本: 1.0  
	 * @公司: 思迪信息 
	 * @创建时间: 2015-4-22 下午1:49:44
	 * @param openid 分享用户的唯一标识 
	 * @param weixinpk 分享公众号唯一标识 
	 * @param nickname 分享用户昵称 
	 */
	function setShareCustomer(openid,weixinpk,nickname)
	{
		if (wxUtils.isNotEmpty(openid)) {
			wxUtils.setSStorageInfo("sopenid", openid);
		}
		if (wxUtils.isNotEmpty(weixinpk)) {
			wxUtils.setSStorageInfo("sweixinpk", weixinpk);
		}
		if (wxUtils.isNotEmpty(nickname)) {
			wxUtils.setSStorageInfo("snickname", nickname);
		}
	}
	
	/**
	 * 
	 * @描述：获取分享者用户信息
	 * @作者：邱育武
	 * @版本: 1.0
	 * @公司: 思迪信息
	 * @创建时间: 2015-4-22 下午6:29:11
	 * @returns ShareCustomer(该对象详见说明文档)
	 */
	function getShareCustomer()
	{
		var shareCustomer = {
			"sopenid"     :  wxUtils.getSStorageInfo("sopenid"),
			"sweixinpk"   :  wxUtils.getSStorageInfo("sweixinpk"), 
			"snickname"   :  wxUtils.getSStorageInfo("snickname"), 
			"sheadimgurl" :  wxUtils.getSStorageInfo("sheadimgurl")
		};
		return shareCustomer;
	}
	
	/**
	 * 
	 * @描述：获取用户信息对象
	 * @作者：邱育武
	 * @版本: 1.0  
	 * @公司: 思迪信息 
	 * @创建时间: 2015-4-22 下午6:29:11
	 * @returns wxCustomer(该对象详见说明文档)
	 */
	function getCustomer()
	{
		var weixinpk = OAuth2.getWeixinpk();
		var openid = OAuth2.getOpenid();
		var wxCustomer = {
			"openid"     :  openid,
			"weixinpk"   :  weixinpk, 
			"nickname"   :  wxUtils.getSStorageInfo("nickname"), 
			"sex"        :  wxUtils.getSStorageInfo("sex"), 
			"province"   :  wxUtils.getSStorageInfo("province"), 
			"city"       :  wxUtils.getSStorageInfo("city"), 
			"country"    :  wxUtils.getSStorageInfo("country"), 
			"headimgurl" :  wxUtils.getSStorageInfo("headimgurl"),
			"privilege"  :  wxUtils.getSStorageInfo("privilege"),
			"subscribe"  :  wxUtils.getSStorageInfo("subscribe") 
				
		};
		return wxCustomer;
	}
	
	/**
	 * 
	 * @描述：获取本地缓存用户信息对象
	 * @作者：邱育武
	 * @版本: 1.0  
	 * @公司: 思迪信息 
	 * @创建时间: 2015-4-22 下午6:29:11
	 * @returns wxCustomer(该对象详见说明文档)
	 */
	function getLocalCustomer()
	{
		var localcustomer = wxUtils.getLStorageInfo("localcustomer");//获取本地离线缓存
		if(wxUtils.isNotEmpty(localcustomer))
		{
			var customer = wxUtils.stringToJson(localcustomer);//转换成json对象
			if(wxUtils.isNotEmpty(customer) && wxUtils.isNotEmpty(customer.openid))
			{
				wxCustomer = OAuth2.setCustomer(customer.openid,customer.weixinpk,customer.nickname,customer.sex,customer.province,customer.city,customer.country,customer.headimgurl,customer.privilege,customer.subscribe,customer.join_date,true);
				return wxCustomer;
			}
		}
		return null;
	}
	
	/**
	 * 
	 * @描述：获取网页授权code
	 * @作者：邱育武
	 * @版本: 1.0  
	 * @公司: 思迪信息 
	 * @创建时间: 2015-4-22 下午1:50:26
	 * @param appid 微信公众号appid(必传)
	 * @param weixinpk 公众号唯一标识 (必传)
	 * @param url 网页授权回调URL地址，非必传:默认取当前页面URL
	 * @param scope 应用授权作用域，snsapi_base/snsapi_userinfo 非必传：默认：snsapi_userinfo
	 * @param state 重定向后会带上state参数，开发者可以填写a-zA-Z0-9的参数值，最多128字节 非必传：默认填写weixinpk
	 * @returns  授权成功后用户信息直接存储于缓存中，通过 wxUtils.getSStorageInfo("openid")获取
	 */
	function getCodeByAppid(appid,weixinpk,url,scope,state)
	{
		var config = wxconfig.configInit();
		if(config.islocal)//启用离线缓存机制
		{
			var localcustomer = OAuth2.getLocalCustomer();
			if(wxUtils.isNotEmpty(localcustomer) && wxUtils.isNotEmpty(localcustomer.openid))
			{
				return localcustomer;
			}
		}
		
		if(wxUtils.is_weixn())
		{
			if(wxUtils.isEmpty(weixinpk))
			{
				weixinpk = OAuth2.getWeixinpk();
			}
			scope = config.scope;//应用授权作用域，snsapi_base,snsapi_userinfo
			if(wxUtils.isEmpty(state))
			{
				state = weixinpk;
			}
			if(wxUtils.isEmpty(appid))
			{
				appid = OAuth2.getAppid();
			}
			if(wxUtils.isEmpty(url))
			{
				url =  config.urlPath;//网页授权跳转页面(默认当前页面)
			}
			var	redirectUri = encodeURIComponent(url);//编码
			var oauth2Url = "https://open.weixin.qq.com/connect/oauth2/authorize?appid="+appid+"&redirect_uri="+redirectUri+"&response_type=code&scope="+scope+"&state="+state+"#wechat_redirect";
			if(config.isDebug){
				alert("网页授权转发链接urlStr=" + url);
				alert("网页授权组装链接oauth2Url=" + oauth2Url);
			}
				window.location.href = oauth2Url;
		}
		return OAuth2.getCustomer();
	}
	
	
	/**
	 * 
	 * @描述：微信OAuth2.0网页授权(有code)
	 * @作者：邱育武
	 * @版本: 1.0  
	 * @公司: 思迪信息 
	 * @创建时间: 2015-4-22 下午1:51:20
	 * @param code 腾讯网页授权code (必传) 
	 * @returns  wxCustomer(该对象详见说明文档)
	 */
	function getCustomerByCode(code)
	{
		var weixinpk = OAuth2.getWeixinpk();//取weixinpk
		var config = wxconfig.configInit();
		var param = {
				"funcNo":config.OAuth2FuncNo,//功能号
				"code":code,//授权code
				"scope":config.scope,//授权作用域
				"weixinpk":weixinpk,
				"url":window.location.href
		};
		var wxCustomer = "";
		var callBackFunc = function(data){
			if(data != null && data.error_no == 0)
			{
				var resultVo = data.results[0];
				var openid = resultVo["openid"];
				var weixinpk = resultVo["weixinpk"];
				var nickname = resultVo["nickname"];
				var sex = resultVo["sex"];
				var province = resultVo["province"];
				var city = resultVo["city"];
				var country = resultVo["country"];
				var headimgurl = resultVo["headimgurl"];
				var privilege = resultVo["privilege"];
				var subscribe = resultVo["state"];
				var join_date = resultVo["join_date"];
				wxCustomer = OAuth2.setCustomer(openid,weixinpk,nickname,sex,province,city,country,headimgurl,privilege,subscribe,join_date);
			}
		}
		//false 同步请求
		Ajax.ajaxRequest(config.serverPath,"post",false,param,callBackFunc,null,false,null,null,true);
		return wxCustomer;
	}
	
  return {
	  	version	:"1.2",
		initCustomer: initCustomer,
		getOpenid: getOpenid,
		getAppid:getAppid,
		getWeixinpk:getWeixinpk,	
		setCustomer: setCustomer, 
		getCustomer: getCustomer,
		getCustomerByCode:getCustomerByCode,
		getCodeByAppid:getCodeByAppid,
		getOAuth2Code:getOAuth2Code,
		setURLCustomer:setURLCustomer,
		setShareCustomer:setShareCustomer,
		getShareCustomer:getShareCustomer,
		getLocalCustomer:getLocalCustomer
	};
})();
/**
 * version 1.1
 * 模块名：微信JS-SDK
 * 作者： 蒋松
 * 时间：2015年1月21日15:32:40
 * 简述：http://mp.weixin.qq.com/wiki/7/aaa137b55fb2e0456bf8dd9148dd613f.html
 */
var JS_SDK = (function () {
	//JS接口集合
	var apiList = ['checkJsApi','onMenuShareTimeline','onMenuShareAppMessage','onMenuShareQQ','onMenuShareWeibo',
       'hideMenuItems','showMenuItems','hideAllNonBaseMenuItem','showAllNonBaseMenuItem','translateVoice',
        'startRecord','stopRecord','onVoiceRecordEnd','playVoice','pauseVoice','stopVoice','uploadVoice',
        'downloadVoice','chooseImage','previewImage','uploadImage','downloadImage','getNetworkType',
        'openLocation','getLocation','hideOptionMenu','showOptionMenu','closeWindow','scanQRCode',
        'chooseWXPay','openProductSpecificView','addCard','chooseCard','openCard'
	]; 
	
	/**
	 * 入口方法 初始化JS-SDK
	 * @param debug 是否开启调试模式
	 */
	function init(debug,callBack){
		var inParam = {
			"jsApiList":apiList,// 必填，需要使用的JS接口列表
			"debug":debug
		};
		var configParam = getWXConfigParam(inParam);
		if(debug)
		{
			if(wx)
			{
				alert("JSSDK对象存在!");
			}
			else
			{
				alert("JSSDK对象不存在,可能没引入微信JS文件!");
			}
		}
		/*所有需要使用JS-SDK的页面必须先注入配置信息，*/
		wx.config(configParam);
		//4.步骤四：通过ready接口处理成功验证
		wx.ready(function(){
			check(apiList);
			if(callBack){
				callBack();
			}else{
				JS_SDK.panel.showOptionMenu();//显示右上角按钮
				//JS_SDK.defaultShareAll();//自动注册默认分享；
			}
		});
		
		//5.步骤五：通过error接口处理失败验证
		wx.error(function (res) {
			if(debug){
				alert(res.errMsg);
			}
		});
	}

	/**
	* 获取 所有需要使用JS-SDK的页面必须先注入配置信息
	* @param weixinpk 微信标识
	* @param shareUrl 当前需要分享的地址（一般是当前页面url）含参数
	* @returns    {appId: '', // 必填，公众号的唯一标识
	*				timestamp: , // 必填，生成签名的时间戳
	*				nonceStr: '', // 必填，生成签名的随机串
	*				signature: '',// 必填，签名，见附录1
	*/	 
	function getWXConfigParam(param)
	{
		var config = wxconfig.configInit();
		var debug = param["debug"];
		if(!debug){debug = false;}
		var returns = "";
		var url = config.urlPath;
		if(url && url.indexOf("#") != -1){
			url = url.split("#")[0];//验签站点地址(#号后面一部分不需要)
		}
		var params = {
			"funcNo":config.JSSDKFuncNo,//功能号
			"weixinpk":OAuth2.getWeixinpk(),//获取weixinpk
			"url":url//验签站点地址
		};
		if(debug)
		{
			alert("JSSDK网页验签参数：" + "funcNo="+config.JSSDKFuncNo+"&weixinpk="+OAuth2.getWeixinpk()+"&url="+url);
		}
		if(config.jssdkDebug)//jssdk debug模式独立开关
		{
			debug = true;
		}
		var callBackFunc = function(data){
			if(data != null && data.error_no == 0)
			{
				var results = data.results[0];
				returns = {
						debug: debug, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
					    appId: results["appid"], // 必填，公众号的唯一标识
					    timestamp: results["timestamp"], // 必填，生成签名的时间戳
					    nonceStr: results["nonceStr"], // 必填，生成签名的随机串
					    signature: results["signature"],// 必填，签名，见附录1
					    jsApiList: param["jsApiList"] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
					};
				if(config.islocal)//启用离线缓存机制
				{
					var signStr = wxUtils.jsonToString(returns);
					wxUtils.setLStorageInfo(url,signStr);//存入本地离线缓存
				}
			}else{
				if(debug){
					alert("JSSDK验签接口调用失败！" + data.error_info);
				}
			}
		};
		if(config.islocal)//启用离线缓存机制
		{
			var jssdksign = wxUtils.getLStorageInfo(url);//获取本地离线缓存
			if(wxUtils.isEmpty(jssdksign)){
				Ajax.ajaxRequest(config.serverPath,"post",false,params,callBackFunc,document);//false 同步请求
			}else{
				var signinfo = wxUtils.stringToJson(jssdksign);//转换成json对象
				returns = signinfo;
			}
		}else{
			
			Ajax.ajaxRequest(config.serverPath,"post",false,params,callBackFunc,document);//false 同步请求
		}
		return returns;
	}
	
	/**
	 * 检测接口
	 */
	function check(jsApiList,func){
		var config = wxconfig.configInit();
		/**
		 * 检测当前设备是否支持使用你要使用的接口
		 * 一版不能使用的原因是微信版本低于6.1版本
		 * @param func <function> 建议按你选择的接口单独处理问题
		 */
		wx.checkJsApi({
			  jsApiList:jsApiList,
			  success: function (res) {
				if(func){
					func(res);
				}else{
					for(var i = 0;i < jsApiList.length; i++){
						if(res["checkResult"][jsApiList[i]] == false){
							if(config.isDebug){
								alert("当前手机暂不支持："+jsApiList[i]);
							}
						}
					}
				}
			  }
	    });
	};
	
	/**
	 * 分享接口集合
	 */
	var share = {
			AppMessage:function(param,clickFuc,hasFuc,cancelFuc,failFuc){
				var param1 = copyObject(param);
				param1["share_type"] = "1";
				//2.1 监听“分享给朋友”，按钮点击、自定义分享内容及分享结果接口
				wx.onMenuShareAppMessage(
					commonShareJson(param1,clickFuc,hasFuc,cancelFuc,failFuc)
				);
			},
			Timeline:function(param,clickFuc,hasFuc,cancelFuc,failFuc){
				var param1 = copyObject(param);
				param1["share_type"] = "2";
				 // 2.2 监听“分享到朋友圈”按钮点击、自定义分享内容及分享结果接口
				wx.onMenuShareTimeline(
					commonShareJson(param1,clickFuc,hasFuc,cancelFuc,failFuc)	
				);
			},
			QQ:function(param,clickFuc,hasFuc,cancelFuc,failFuc){
				var param1 = copyObject(param);
				param1["share_type"] = "4";
				// 2.3 监听“分享到QQ”按钮点击、自定义分享内容及分享结果接口
			    wx.onMenuShareQQ(
			    	commonShareJson(param1,clickFuc,hasFuc,cancelFuc,failFuc)
			    );
			},
			Weibo:function(param,clickFuc,hasFuc,cancelFuc,failFuc){
				var param1 = copyObject(param);
				param1["share_type"] = "5";
				// 2.4 监听“分享到微博”按钮点击、自定义分享内容及分享结果接口
				wx.onMenuShareWeibo(
					commonShareJson(param1,clickFuc,hasFuc,cancelFuc,failFuc)
				);
			}
	};
	
	function copyObject(param){
		var newParam = {};
		  for(var key in param){  
		      if(typeof(param[key])=="function"){  
		            //obj[p]();  
		      }else{  
		    	  newParam[key]  =  param[key];
		      }  
		  }  
		return newParam;
	}
   /**
	* 获取所有分享
	* @param param {imgUrl,link,title,desc}
	* @param clickFuc 用户点击发送给朋友callBack
	* @param hasFuc 已分享callBack
	* @param cancelFuc 已取消callBak
	* @param failFuc 分享失败callBak
	*/
	function shareAll(param,clickFuc,hasFuc,cancelFuc,failFuc){
		//详情见分享集合 share
		share.AppMessage(param, clickFuc, hasFuc, cancelFuc, failFuc);
		share.Timeline(param, clickFuc, hasFuc, cancelFuc, failFuc);
		share.QQ(param, clickFuc, hasFuc, cancelFuc, failFuc);
		share.Weibo(param, clickFuc, hasFuc, cancelFuc, failFuc);
	}
	
	/**
	 * @param param {title,desc,link,imgUrl} &_share=1 后面拼接用于区分是否来自分享，也是为了取参数避免取到腾讯加到的后缀
	 * @param clickFuc 用户点击发送给朋友callBack
	 * @param hasFuc 已分享callBack
	 * @param cancelFuc 已取消callBak
	 * @param failFuc 分享失败callBak
	 * 
	 * @returns {} 初始化分享内容
	 */
	function commonShareJson(param,clickFuc,hasFuc,cancelFuc,failFuc){
		//分享标识，用于判断当前页面是否是分享过来的
		var customer = OAuth2.getCustomer();
		var sopenid = param["sopenid"];
		var sweixinpk = param["sweixinpk"];
		var snickname = param["snickname"];
		var notOauth2 = param["notOauth2"];//不需要网页授权链接  true不需要，false需要  默认：false需要
		if(wxUtils.isEmpty(sopenid))
		{
			sopenid=customer.openid;
		}
		if(wxUtils.isEmpty(sweixinpk))
		{
			sweixinpk=customer.weixinpk;
		}
		if(wxUtils.isEmpty(snickname))
		{
			snickname=customer.nickname;
		}
		//分享者信息
		var url = wxUtils.cleanCode(param["link"]);//清理code参数
		var shareUrl = url;
		var config = wxconfig.configInit();
//		if(!notOauth2 && config.isOAuth2)
		if(!notOauth2)
		{
			//分享者信息
			var dataurl = "sopenid="+sopenid+"&sweixinpk="+sweixinpk+"&snickname="+snickname+"&_wxshare=1";
			shareUrl = url.indexOf("?") > -1 ? url+"&" + dataurl : url+"?" + dataurl;//拼接分享者信息参数
			var	redirectUri = encodeURIComponent(shareUrl);//编码
			var appid = OAuth2.getAppid();//获取appid
			var scope = config.scope;//应用授权作用域，snsapi_base,snsapi_userinfo
			shareUrl = "https://open.weixin.qq.com/connect/oauth2/authorize?appid="+appid+"&redirect_uri="+redirectUri+"&response_type=code&scope="+scope+"&state="+scope+"#wechat_redirect";
		}
		return { 
			  title:param["title"],// 分享标题
			  desc: param["desc"],// 分享描述
			  link: shareUrl,// 分享链接 
			  imgUrl:param["imgUrl"],// 分享图标
			  trigger: function (res) {
				if(clickFuc)
				clickFuc();
			  },
			  success: function (res) {
				  var shareParam = {};
				  var config = wxconfig.configInit();
				  shareParam["funcNo"] = config.SaveShareFlowFuncNo;//功能号
				  shareParam["share_type"] = param["share_type"];
				  shareParam["article_id"] = param["article_id"];
				  shareParam["weixinpk"] = OAuth2.getWeixinpk();
				  shareParam["openid"] = OAuth2.getOpenid();
				//false 同步请求
				//Ajax.ajaxRequest(config.serverPath,"post",true,shareParam,null,null,false,null,null,true);
				if(hasFuc)
				hasFuc();
			  },
			  cancel: function (res) {
				if(cancelFuc)
				cancelFuc();
			  },
			  fail: function (res) {
				if(failFuc)
				failFuc();
			  }
		};
	}
	
   	/**
     *图像接口集合
     */
	var image = {
		chooseImage:function(suFunc,faFunc){
		 /**
		  *拍照、本地选图 
		  *@param callback <function> 回调
          */
		    wx.chooseImage({
			      success: function (res) {
			       //res.localIds   <array>
			       // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
			        if(suFunc)
			        suFunc(res);
			      },
	        	  fail: function (res) {
	        			if(faFunc)
	          			faFunc(res);
	       		  }
			 });
		},
		previewImage:function(current,urls){
			/**
			 *图片预览
			 *@param current <string> 当前预览图片地址
			 *@param urls <array> 预览图片集合
			 */
			wx.previewImage({
      			current:current,
      			urls:urls
    		});
		},
		upload:function(imagesArr,showPro,suFunc,faFunc){
			  /**
			   *上传图片
			   *@param imagesArr <array> 上传图片集合
			   *@param showPro <number> 是否显示进度条
			   *@param suFunc <function> 成功回调
			   *@param faFunc <function>  失败回调 
			   *@returns serverId <array> 上传图片腾讯服务端ID集合，后台可以根据ID去请求图片，有效期3天
               */
			var serverId = [];
		    if (imagesArr.length == 0) {
  				 alert('上传图片不能为空！');
 				 return;
			}
			if(showPro == undefined)
				showPro = 1; // 默认为1，显示进度提示
   		    var i = 0, length = imagesArr.length;
   		    var config = wxconfig.configInit();
   		    function upload() {
   		    	var localId = imagesArr[i];
   		    	var imgLocalId = wxUtils.getSStorageInfo("localId");//缓存的上次本地id
   		    	if(wxUtils.isNotEmpty(imgLocalId)&& imgLocalId==localId){
   		    	 alert('已上传该图片，请勿重复上传！');
 				 return;
   		    	}
      			wx.uploadImage({
	        		localId: localId,
	        		isShowProgressTips: showPro, 
	        		success: function (res) {
	        			wxUtils.setSStorageInfo("localId",localId);
		         		 i++;
		         		serverId.push(res.serverId);
		          		if (i < length){
		           			 upload();
		         		 }else{
							if(suFunc){
							var now = new Date();
							var date = now.getFullYear()+((now.getMonth()+1)<10?"0":"")+(now.getMonth()+1)+(now.getDate()<10?"0":"")+now.getDate();
							 res["imgPath"]="/upload/"+date+"/"+serverId+".jpg";
							 suFunc(res);
							}
						 }
		          		if(config.jssdkDebug){
	         				 alert("已通知后台下载图片素材:"+res.serverId);
	         			 }
		          		var param = {
	        				"funcNo":config.DownloadImg,
	        				"media_id":res.serverId,
	        				"weixinpk":OAuth2.getWeixinpk()
	        			 };
	         			 Ajax.ajaxRequest(config.serverPath,"post",true,param,null,null);//false 同步请求
	       		    },
	        		fail: function (res) {
	        			if(faFunc)
	          			faFunc(res);
	       			}
      	 		});
    		}
   			upload();
   			return serverId;
		 },
		 download:function(serverId,showPro,suFunc,faFunc){
			  /**
			   *下载图片
			   *@param serverId <number> 上传图片腾讯服务端ID集合，后台可以根据ID去请求图片，有效期3天
			   *@param showPro <number> 是否显示进度条
			   *@param suFunc <function> 成功回调
			   *@param faFunc <function>  失败回调 
			   *@returns localId <array> 下载图片ID集合，可以作为img标签的src属性显示图片
               */
			var array = [];
		    if(serverId.length === 0) {
     			 alert('下载列表不能为空');
      			 return;
    		}
			if(serverId instanceof Array){
				array = serverId;
			}else{
				array.push(serverId);
			}
    		var i = 0, length = array.length;
    		var localId = [];
    		function download() {
     		   wx.downloadImage({
	        	   serverId: array[i],
	        	   success: function (res) {
	          	   		i++;
	          	   		localId.push(res.localId);
				         if (i < length) {
				            download();
				         }else{
				        	 if(suFunc)
						       suFunc(res);
				         }
	        		},
	        		fail: function(res){
	        			if(faFunc)
	        			faFunc(res);
	        		}
      			});
   			 }
   			 download();
   			 return localId;
		 }
	};
	
	  /**
	   * 音频接口
	   */
	  var voices ={
			  translateVoice:function(localId,suFunc,faFunc){
				  /**
				   * 识别音频并返回识别结果
				   * @param localId <string>  语音id
				   * @param suFunc <function> 识别成功回调
				   * @param faFunc <function> 识别失败回调 
				   */
				     if (localId == '') {
				        alert('请提供识别的语音');
				        return;
				      }
				      wx.translateVoice({
				        localId: localId,
				        complete: function (res) {
				          if (res.hasOwnProperty('translateResult')) {
				            //识别结果：res.translateResult
				            if(suFunc)suFunc(res);
				          } else {
				        	if(faFunc){
				        		faFunc(res);
				        	}else{
				        		alert('无法识别');
				        	}
				          }
				        }
				      });
			  },
			  startRecord:function(faFunc){
				  /**
				   * 开始录音
				   * @param faFunc <function>拒绝授权录音回调 
				   */
				  wx.startRecord({
				      cancel: function () {
			    	     if(faFunc){
			        		faFunc(res);
			        	 }else{
			        		 if(faFunc){
				        		faFunc(res);
					         }else{
				        		alert('用户拒绝授权录音');
					         }
			        	 }
				      }
				  });
			  },
			  stopRecord:function(suFunc,faFunc,timeOut){
				  /**
				   * 停止录音
				   * @param suFunc <function> 停止成功回调
				   * @param faFunc <function> 停止失败回调 
				   * @param timeOut <function> 超时回调
				   */
				  wx.stopRecord({
				      success: function (res) {
				        if(suFunc)suFunc(res);
				      },
				      fail: function (res) {
				        if(faFunc)faFunc(res);
				      }
				   });
				  /**
				   * 监听录音自动停止
				   */
				  wx.onVoiceRecordEnd({
				    complete: function (res) {
				      if(timeOut){
				    	  timeOut(res);
				      }else{
				    	  alert('录音时间已超过一分钟');
				      }
					}
				   });
			  },
			  playVoice:function(localId){
				  /** 
				   * 播放音频
				   * @param localId 录音id
				   * */	
				    if (localId == '') {
				      alert('请提供播放的录音');
				      return;
				    }
				    wx.playVoice({
				      localId: localId
				    });
			  },
			  pauseVoice:function(localId){
				  /** 
				   * 暂停播放音频
				   * @param localId <string>  语音id
				   * */
				  wx.pauseVoice({
				      localId: localId
				  });
			  },
			  stopVoice:function(localId,timeOut){
				  /** 
				   * 停止播放音频
				   * @param localId <string>  语音id
				   * */
			     if (localId == '') {
				      alert('请提供停止的录音');
				      return;
				    }
				  wx.stopVoice({
				      localId: localId
				  });
				  /**监听录音播放停止*/
				  wx.onVoicePlayEnd({
				    complete: function (res) {
				    	if(timeOut){
				    		timeOut(res);
				    	}else{
				    		alert('录音播放结束');
				    	}
				    }
				  });
			  },
			  uploadVoice:function(localId,suFunc,faFunc){
				  /**
				   * 上传录音
				   * @param localId <string>  语音id
				   * @param suFunc <function> 上传成功回调
				   * @param faFunc <function> 上传失败回调 
				   */
				  if (localId == '') {
				      alert('请提供一段可供上传的录音');
				      return;
				    }
				    wx.uploadVoice({
				      localId: localId,
				      success: function (res) {
				        if(suFunc)suFunc(res);
				      },
	        		  fail: function(res){
	        			if(faFunc)
	        			faFunc(res);
	        		   }
				    });
			  },
			  downloadVoice:function(serverId,suFunc,faFunc){
				  /**
				   * 下载录音
				   * @param localId <string>  语音id
				   * @param suFunc <function> 下载成功回调
				   * @param faFunc <function> 下载失败回调 
				   */
				    if (serverId == '') {
				        alert('请提供可供下载的语音');
				        return;
				      }
				      wx.downloadVoice({
				        serverId: serverId,
				        success: function (res) {
				          if(suFunc)suFunc(res);
				        },
		        		fail: function(res){
			        	   if(faFunc)
			        	   faFunc(res);
			        	}
				      });
			  }
	  };
	
	//所有菜单项列表
	var menuArray = ["menuItem:exposeArticle","menuItem:setFont","menuItem:dayMode","menuItem:nightMode",
	    "menuItem:refresh","menuItem:profile","menuItem:addContact","menuItem:share:appMessage",
	    "menuItem:share:timeline","menuItem:share:qq","menuItem:share:weiboApp","menuItem:favorite",
	    "menuItem:share:facebook","menuItem:jsDebug","menuItem:editTag","menuItem:delete","menuItem:copyUrl",
	    "menuItem:originPage","menuItem:readMode","menuItem:openWithQQBrowser","menuItem:openWithSafari",
	    "menuItem:share:email","menuItem:share:brand"];
	/**
	 *界面操作
	 */
	var panel = {
			hideOptionMenu:function(){
				//隐藏右上角菜单
				 wx.hideOptionMenu();
			},	
			showOptionMenu:function(){
				//显示右上角菜单
				wx.showOptionMenu();
			},
			hideMenuItems:function(menuList,suFunc,faFunc){
				var new_list = [];
				for ( var i = 0; i < menuList.length; i++) {
					new_list.push(menuArray[menuList[i]]);
				}
				/**
				 * 批量隐藏菜单项
				 * @param menuList <array>隐藏列表
				 * @param suFunc <function> 成功回调
				 * @param faFunc <function> 失败回调
				 */
				 wx.hideMenuItems({
				      menuList: new_list,
				      success: function (res) {
				        if(suFunc)suFunc(res);
				      },
				      fail: function (res) {
				        if(faFunc)faFunc(res);
				      }
				});
			},
			showMenuItems:function(menuList,suFunc,faFunc){
					var new_list = [];
					for ( var i = 0; i < menuList.length; i++) {
						new_list.push(menuArray[menuList[i]]);
					}
					/**
					 * 批量显示菜单项
					 * @param menuList <array>隐藏列表
					 * @param suFunc <function> 成功回调
					 * @param faFunc <function> 失败回调
					 */
					 wx.showMenuItems({
					      menuList: new_list,
					      success: function (res) {
					        if(suFunc)suFunc(res);
					      },
					      fail: function (res) {
					        if(faFunc)faFunc(res);
					      }
					});
			},
			hideAllNonBaseMenuItem:function(){
				//隐藏所有非基本菜单项
				wx.hideAllNonBaseMenuItem();
			},
			showAllNonBaseMenuItem:function(){
				//显示所有被隐藏的非基本菜单项
				wx.showAllNonBaseMenuItem();
			},
			closeWindow:function(){
				//关闭当前窗口
				wx.closeWindow();
			}
	};
	
	/**
	 * 二维码扫描接口
	 */
	var QRCode = {
			"scan":function(needResult,desc,suFunc){
				/**
				 * 扫描 
				 * @param desc 扫描描述
				 * @param needResult 1返回结果 0微信处理返回结果
				 * @param suFunc <function> 成功回调
				 */
				 wx.scanQRCode({
				      desc:desc,
				      needResult:needResult,
				      success: function (res) {
					      if(suFunc)suFunc(res);
					  }
				      
				 });
			}
	};
	
	
	/**
	 * 地图接口
	 */
	var Map = {
			openLocation:function(param){
				/**
				 * 使用微信内置地图查看位置接口
				 * @param 入参 ｛latitude：纬度，longitude：经度，
				 * name：名字，address：地址，scale： 地图缩放级别,整形值,范围从1~28。默认为最大，
				 * infoUrl： 在查看位置界面底部显示的超链接,可点击跳转｝
				 */
			    wx.openLocation({
			      latitude:param["latitude"],
			      longitude: param["longitude"],
			      name:param["name"],
			      address:param["address"],
			      scale:param["scale"],
			      infoUrl:param["infoUrl"]
			    });
			},
			getLocation:function(suFunc,faFunc){
				  /**
				   * 获取当前地理位置
				   * @param suFunc
				   */ 
			    wx.getLocation({
			        success: function (res) {
			          if(suFunc)suFunc(res);
			        },
			        cancel: function (res) {
			        	if(faFunc){
			        		faFunc(res);
			        	}else{
			        		alert('用户拒绝授权获取地理位置');
			        	}
			        }
			    });
			}
	};
	
	/**
	 * 微信小店接口
	 */
	var product = {
		/**
		 * 跳转微信商品页
		 * @param productId 商品ID 
		 */
		pageGo:function(productId){
		    wx.openProductSpecificView({
		        productId:productId
		    });
		}	
	};
	
	/**
	 * 设备信息接口
	 */
	var phone = {
		net:function(suFunc,faFunc){
			/**
			 * 获取网络状况
			 * @param suFunc 成功回调
			 * @param suFunc 失败回调
			 */
			wx.getNetworkType({
			      success: function (res) {
			    	  //res.networkType 网络状况
			    	if(suFunc)suFunc(res);
			      },
			      fail: function (res) {
			       if(faFunc)faFunc(res);
			      }
			});
		}
	};

	/**
	 * 微信卡卷
	 */
	var card = {
		"addCard":function(cardList,suFunc,faFunc){
		    wx.addCard({
		    	/**
		    	 * 添加卡卷
		    	 * @param cardList 卡卷集合
		    	 * ｛shopId：门店Id，cardType:卡券类型，cardId:卡券Id， timestamp:卡券签名时间戳，
		    	 * nonceStr：卡券签名随机串， signType:签名方式，默认'SHA1， cardSign:卡券签名，详见附录4｝
		    	 * @param suFunc 成功回调
		    	 * @param faFunc 失败回调
		    	 */
		        cardList:cardList,
		        success: function (res) {
		        	//res.cardList 已添加卡卷信息
		        	if(suFunc)suFunc(res);
		        },
		        fail:function(res){
		        	if(faFunc)faFunc(res);
		        }
		      });
		},
		"chooseCard":function(param,suFunc){
			 /**
			  * 选择卡券
			  * @param 入参
			  */
			wx.chooseCard({
			    shopId:param['shopId'], // 门店Id
			    cardType:param['cardType'], // 卡券类型
			    cardId:param['cardId'], // 卡券Id
			    timestamp:param['timestamp'], // 卡券签名时间戳
			    nonceStr:param['nonceStr'], // 卡券签名随机串
			    signType:param['signType'], // 签名方式，默认'SHA1'
			    cardSign:param['cardSign'], // 卡券签名，详见附录4
			    success: function (res) {
			       //res.cardList;用户选中的卡券列表信息
			    	if(suFunc)suFunc(res);
			    }
			});
		},
		"openCard":function(cardList){
			/**
			 * 查看微信卡包中的卡券
			 * @param cardList <array> array[i] {cardId,code}
			 */
			wx.openCard({
			    cardList:cardList// 需要打开的卡券列表
			});
		}
	};
	
	/**
	 * 微信支付
	 * @param param 入参
	 * @param callBack 支付成功后的回调函数
	 * @param cancelFuc 用户取消支付回调
	 * @param failFuc 支付失败回调
	 */
	var pay = function(param,callBack,cancelFuc,failFuc){
		wx.chooseWXPay({
		    timestamp:param['timestamp'], // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
		    nonceStr:param['nonceStr'], // 支付签名随机串，不长于 32 位
		    package:param['package'], // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=***）
		    signType:param['signType'], // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
		    paySign:param['paySign'], // 支付签名
		    success: function (res) {
	    		if(callBack){
	    			var product_id = param['product_id'];
	    			var total_fee = param['total_fee'];
	    			if(wxUtils.isNotEmpty(product_id))
	    			{
	    				var config = wxconfig.configInit();
		    			wxUtils.clearSStorage("pay|"+product_id+total_fee);
		    			if(config.isDebug){
							alert("清除缓存已支付的订单数据！product_id=" + param['product_id']);
						}
	    			}
	    			callBack(param,res);//支付成功
				}
	    		//更新订单状态
		    },
		    cancel: function(res){
		    	if(cancelFuc){
	    		   cancelFuc(param,res);//用户取消支付
		    	}
		    },
		    fail: function (res){
		    	if(failFuc)
				   failFuc(param,res);//支付失败
		    }
		});	
	};
	
	/**
	 * 
	 * @描述：默认注册所有的分享
	 * @作者：邱育武
	 * @版本: 1.0  
	 * @公司: 思迪信息 
	 * @创建时间: 2015-5-27 下午4:10:42
	 * @returns
	 */
    function defaultShareAll()
    {
    	var config = wxconfig.configInit();
    	var imgScr = wxUtils.getFirstImgPath();//获取页面第一张图片地址
		if(wxUtils.isEmpty(imgScr))
		{
			imgScr = config.sitePath + '/m/wx/images/share.png';
		}
		JS_SDK.shareAll({
			"imgUrl": imgScr,
			"link": config.urlPath,
			"title": config.title,
			"desc":config.title
		});
    }

	return {
	  	version	: "1.2",
	  	init:init,
		check:check,
		shareAll:shareAll,
		share:share,
		panel:panel,
		image:image,
		voices:voices,
		QRCode:QRCode,
		Map:Map,
		product:product,
		phone:phone,
		card:card,
		pay:pay,
		defaultShareAll:defaultShareAll
	};
})();

/**
 * 
 * @描述：微信支付js
 * @作者：邱育武
 * @版本: 1.0  
 * @公司: 思迪信息 
 * @创建时间: 2015-5-02 02:30:10
 */
var WX_Pay = (function () {
	
	
	
	/**
	 * 
	 * @描述：微信统一下单接口(只下单不支付)
	 * @作者：邱育武
	 * @版本: 1.0  
	 * @公司: 思迪信息 
	 * @创建时间: 2015-4-22 下午1:51:20
	 * @param param 微信支付统一下单接口参数
	 * @param successFuc 支付成功后的回调
	 * @param cancelFuc 用户取消支付后的回调
	 * @param failFuc 支付失败后的回调
	 * @param timeOutFunc 调用接口超时回调
	 */
	function unifiedOrderNew(param,successFuc,failFuc,timeOutFunc)
	{
		var openid = param["openid"];//openid
		var body = param["body"];//商品标题
		var total_fee = param["total_fee"];//总金额
		var product_id = param["product_id"];//产品id
		var order_id = param["order_id"];//客户商品订单号id
		var ptypeid = param["ptypeid"];//产品类型id
		var type_key = param["type_key"];//支付类型key
		if(wxUtils.isEmpty(openid)){
			alert("[FAIL]JSAPI支付必须传openid参数！");
			if(failFuc)
				failFuc(param);//支付失败
			return ;
		}
		if(wxUtils.isEmpty(body)){
			alert("[FAIL]JSAPI支付必须传body参数！");
			if(failFuc)
				failFuc(param);//支付失败
			return ;
		}
		if(wxUtils.isEmpty(product_id)){
			alert("[FAIL]JSAPI支付必须传product_id参数！");
			if(failFuc)
				failFuc(param);//支付失败
			return ;
		}
		if(wxUtils.isEmpty(type_key)){
			alert("[FAIL]JSAPI支付必须传type_key参数！");
			if(failFuc)
				failFuc(param);//支付失败
			return ;
		}
		if(wxUtils.isEmpty(total_fee) || total_fee == "0.00" || total_fee == "0" || total_fee <= "0"){
			alert("[FAIL]金额不能为空，或者必须大于0！");
			if(failFuc)
				   failFuc(param);//支付失败
			return ;
		}
		var config = wxconfig.configInit();
		param["funcNo"] = config.WXPayFuncNo;//功能号
		param["appid"] = OAuth2.getAppid();//公众号appid
		var body = decodeURI(param["body"]);//商品描述
		var payParam = "";//签名参数数据
		var callBackFunc = function(data){
			if(data != null && data.error_no == 0){
				var resultVo = data.results[0];
				//设置数据
				payParam = {
					"appid":resultVo["appId"],//支付公众号appid
				    "timestamp":resultVo["timeStamp"], //支付时间戳
				    "nonceStr":resultVo["nonceStr"],//随机数
				    "package":resultVo["package"], //支付数据签名包
				    "signType":resultVo["signType"],//签名类型
				    "paySign":resultVo["paySign"],//签名秘钥
				    "out_trade_no":resultVo["out_trade_no"],//商户订单号
				    "order_id": order_id,//客户商品订单号id
				    "product_id": product_id,//产品id
				    "type_key": type_key,//支付类型key
				    "total_fee": total_fee,//产品价格
				    "body":body  //产品标题
				};
				if(config.isDebug)
				{
					alert("获取新下单未支付订单数据！" + wxUtils.jsonToString(payParam));
				}
				if(successFuc){
					successFuc(payParam);//用户取消支付
			    }
			}
			else
			{
				if(failFuc){
					failFuc(data);//用户取消支付
			    }
				alert(data.error_info);
			}
		}
		//false 同步请求
		Ajax.ajaxRequest(config.serverPath,"post",false,param,callBackFunc,null,false,timeOutFunc,null,true);
	}
	
	
	/**
	 * 
	 * @描述：微信统一下单接口
	 * @作者：邱育武
	 * @版本: 1.0  
	 * @公司: 思迪信息 
	 * @创建时间: 2015-4-22 下午1:51:20
	 * @param param 微信支付统一下单接口参数
	 * @param successFuc 支付成功后的回调
	 * @param cancelFuc 用户取消支付后的回调
	 * @param failFuc 支付失败后的回调
	 * @param timeOutFunc 调用接口超时回调
	 */
	function unifiedOrder(param,successFuc,cancelFuc,failFuc,timeOutFunc)
	{
		var openid = param["openid"];//openid
		var body = param["body"];//商品标题
		var total_fee = param["total_fee"];//总金额
		var product_id = param["product_id"];//产品id
		var order_id = param["order_id"];//客户商品订单号id
		var ptypeid = param["ptypeid"];//产品类型id
		var type_key = param["type_key"];//支付类型key
		if(wxUtils.isEmpty(openid)){
			alert("[FAIL]JSAPI支付必须传openid参数！");
			if(failFuc)
				failFuc(param);//支付失败
			return ;
		}
		if(wxUtils.isEmpty(body)){
			alert("[FAIL]JSAPI支付必须传body参数！");
			if(failFuc)
				failFuc(param);//支付失败
			return ;
		}
		if(wxUtils.isEmpty(product_id)){
			alert("[FAIL]JSAPI支付必须传product_id参数！");
			if(failFuc)
				failFuc(param);//支付失败
			return ;
		}
		if(wxUtils.isEmpty(type_key)){
			alert("[FAIL]JSAPI支付必须传type_key参数！");
			if(failFuc)
				failFuc(param);//支付失败
			return ;
		}
		if(wxUtils.isEmpty(total_fee) || total_fee == "0.00" || total_fee == "0" || total_fee <= "0"){
			alert("[FAIL]金额不能为空，或者必须大于0！");
			if(failFuc)
				   failFuc(param);//支付失败
			return ;
		}
		var config = wxconfig.configInit();
		param["funcNo"] = config.WXPayFuncNo;//功能号
		param["appid"] = OAuth2.getAppid();//公众号appid
		var body = decodeURI(param["body"]);//商品描述
		var payParam = "";//签名参数数据
		var callBackFunc = function(data){
			if(data != null && data.error_no == 0){
				var resultVo = data.results[0];
				//设置数据
				payParam = {
					"appid":resultVo["appId"],//支付公众号appid
				    "timestamp":resultVo["timeStamp"], //支付时间戳
				    "nonceStr":resultVo["nonceStr"],//随机数
				    "package":resultVo["package"], //支付数据签名包
				    "signType":resultVo["signType"],//签名类型
				    "paySign":resultVo["paySign"],//签名秘钥
				    "out_trade_no":resultVo["out_trade_no"],//商户订单号
				    "order_id": order_id,//客户商品订单号id
				    "product_id": product_id,//产品id
				    "type_key": type_key,//支付类型key
				    "total_fee": total_fee,//产品价格
				    "body":body  //产品标题
				};
				if(wxUtils.isNotEmpty(product_id)){
					var signParam = wxUtils.jsonToString(payParam);//将json对象转换成字符串
					wxUtils.setSStorageInfo("pay|"+product_id+total_fee,signParam);//根据商品id和价格将验签数据存入缓存(目的避免多次无效的下单)
				}
				if(config.isDebug)
				{
					alert("获取新下单未支付订单数据！" + wxUtils.jsonToString(payParam));
				}
				JS_SDK.pay(payParam,successFuc,cancelFuc,failFuc);//调起js微信支付
			}
			else
			{
				alert(data.error_info);
			}
		}
		var signData = wxUtils.getSStorageInfo("pay|"+product_id+total_fee);//根据商品id和价格取缓存的验签数据(目的避免多次无效的下单)
		if(wxUtils.isNotEmpty(signData))
		{
			if(config.isDebug)
			{
				alert("获取缓存未支付订单数据！" + signData);
			}
			var signParam = wxUtils.stringToJson(signData);//将缓存的字符串转换成json对象
			JS_SDK.pay(signParam,successFuc,cancelFuc,failFuc);//调起js微信支付
			
		}else{
			//false 同步请求
			Ajax.ajaxRequest(config.serverPath,"post",false,param,callBackFunc,null,false,timeOutFunc,null,true);
		}
		return payParam;//返回签名参数数据
	}
   
  return {
	  	version	:"1.0",
	  	unifiedOrder :unifiedOrder,
	  	unifiedOrderNew :unifiedOrderNew
	};
})();
 /**
   * @描述：HTML5流量统计工具
   * @作者：邱育武
   * @版本: 1.0  
   * @公司: 思迪信息 
   * @创建时间: 2016-2-22 下午1:41:37
   */
var H5_Analysis = (function () {

  var timeFlag;
  function initH5Analysis()
  {
	  var page_code=H5_Analysis.getPageCode();
	  var page_title=H5_Analysis.getPageTitle();
	  var weixin_pk=OAuth2.getWeixinpk();
	  var openid=OAuth2.getOpenid();
	  var source= wxUtils.getPageSource();
	  var page_url=H5_Analysis.getPageUrl();
	  var config = wxconfig.configInit();
		var param = {
				"funcNo":config.H5AnalysisFuncNo,//功能号
				"page_code":page_code,//
				"page_title":page_title,//
				"weixin_pk":weixin_pk,
				"openid":openid,
				"source":source,
				"page_url":page_url
		};
	  var callBackFunc=function(data){
		  if(data != null && data.error_no == 0)
		  {
			  var resultVo = data.results[0];
			  if(wxUtils.isNotEmpty(resultVo["id"]))
			  {
				  wxUtils.setSStorageInfo("webAnalysisId",resultVo["id"]);
			  }
			  else
			  {
				  wxUtils.setSStorageInfo("webAnalysisId","");
			  }
		  }
	  }
	  Ajax.ajaxRequest(config.serverPath,"post",true,param,callBackFunc,null,false,null,null,true);
  }
  
  function updateH5Analysis()
  {
	  var page_code=H5_Analysis.getPageCode();
	  var page_title=H5_Analysis.getPageTitle();
	  var weixin_pk=OAuth2.getWeixinpk();
	  var openid=OAuth2.getOpenid();
	  var source= wxUtils.getPageSource();
	  var page_url=H5_Analysis.getPageUrl();
	  var timeout=H5_Analysis.getwebAnalyTimeOut();
	  var webAnalysisId=H5_Analysis.getWebAnalysisId();
	  var config = wxconfig.configInit();
		var param = {
				"funcNo":config.H5AnalysisFuncNo,//功能号
				"page_code":page_code,//
				"page_title":page_title,//
				"weixin_pk":weixin_pk,
				"openid":openid,
				"source":source,
				"analysistimeout":timeout,
				"webAnalysisId":webAnalysisId,
				"page_url":page_url
		};
	  var callBackFunc=function(data){
		  if(data != null && data.error_no == 0)
		  {
			  var resultVo = data.results[0];
			  if(wxUtils.isNotEmpty(resultVo["id"]))
			  {
				  wxUtils.setSStorageInfo("webAnalysisId",resultVo["id"]);
			  }
			  else
			  {
				  wxUtils.setSStorageInfo("webAnalysisId","");
			  }
			 
		  }
		  else if(data != null && data.error_no == 2)//用户已切换页面
			  {
			  startH5Analy();
			  return;
			  }
	  }
	  Ajax.ajaxRequest(config.serverPath,"post",true,param,callBackFunc,null,false,null,null,true);
  }
  
  /**
   * @描述：开始统计
   * @作者：邱育武
   * @版本: 1.0  
   * @公司: 思迪信息 
   * @创建时间: 2016-2-24 下午1:41:37
   */
  function startH5Analy()
  {
	  clearInterval(timeFlag);
	  var config = wxconfig.configInit();//初始化系统配置文件
		if(config.isAccessWebAnaly)//是否开启网页访问统计
		{
			H5_Analysis.initH5Analysis();
			if(wxUtils.isNotEmpty(config.webAnalyTimeOut))
			{
				timeFlag=setInterval(function()
				{
					H5_Analysis.updateH5Analysis();
				}, config.webAnalyTimeOut);
			}
		}
  }
  
  /**
   * @描述：获取页面编码
   * @作者：邱育武
   * @版本: 1.0  
   * @公司: 思迪信息 
   * @创建时间: 2016-2-22 下午1:41:37
   */
  function getPageCode()
  {
	  var config = wxconfig.configInit();
	  var pageCode="";
	  var cutUrl=decodeURIComponent(config.urlPath);
			  //pageCode=wxUtils.getSStorageInfo("_curPageCode");
		      var arrys = cutUrl.split(/[?]/);
			  //alert("arrys[0]="+arrys[0]);
			  //alert(arrys[0].substr(arrys[0].length-5));
			  //if(cutUrl.substr(cutUrl.length-5)==".html")
			  //if(arrys[0].substr(arrys[0].length-3)))
			  if(arrys[0].substr(arrys[0].length-5)==".html"){
				  var urlArrys = cutUrl.split(/[/.]/);
				  if(urlArrys[urlArrys.length-3]=="#!"){
					  pageCode = urlArrys[urlArrys.length-2];
				  }else if(urlArrys[urlArrys.length-4]=="#!"){
					  pageCode = urlArrys[urlArrys.length-3] + "/" + urlArrys[urlArrys.length-2];
				  }	 
			  }else{
				  pageCode = "main";
			  }
	  return pageCode?pageCode:"";
  }
   
  function getPageTitle()
  {
	  var config=wxconfig.configInit();
	  var pageTitle=config.title;
	  return pageTitle?pageTitle:"";
  }
    
  function getPageUrl()
  {
	  var config=wxconfig.configInit();
	  var pageUrl=config.urlPath;
	  return pageUrl?pageUrl:"";
  }
  
  function getwebAnalyTimeOut()
  {
	  var config=wxconfig.configInit();
	  var timeOut=config.webAnalyTimeOut;//毫秒
	  var time=parseInt(timeOut)/1000;
	  return time?time:"";
  }
  function getWebAnalysisId()
  {
	  var webAnalysisId=wxUtils.getSStorageInfo("webAnalysisId");
	  if(wxUtils.isNotEmpty(webAnalysisId))
	  {
		  wxUtils.setSStorageInfo("webAnalysisId");
	  }
	  return webAnalysisId?webAnalysisId:"";
  }
  return {
	  	version	:"1.0",
	  	startH5Analy:startH5Analy,
	  	initH5Analysis:initH5Analysis,
	  	updateH5Analysis:updateH5Analysis,
	  	getPageCode :getPageCode,
	  	getPageTitle:getPageTitle,
	  	getPageUrl:getPageUrl,
	  	getwebAnalyTimeOut:getwebAnalyTimeOut,
	  	getWebAnalysisId:getWebAnalysisId
	};
})();

/**
 * 
 * @描述：微信模板素材管理
 * @作者：邱育武
 * @版本: 1.0  
 * @公司: 思迪信息 
 * @创建时间: 2015-4-22 下午2:31:42
 */
var wxCommon = (function () {
	
	/**
	 * @描述：获取微信模板素材信息
	 * @作者：邱育武
	 * @版本: 1.0  
	 * @公司: 思迪信息 
	 * @创建时间: 2015-4-22 下午2:31:42
	 * @returns  返回数据
	 */
	function getMaterialDetail(id,weixinpk)
	{
		var config = wxconfig.configInit();
		var param = {
				"id":id,//素材id
				"weixinpk":weixinpk
		};
		var materialInfo = "";
		var callBackFunc = function(data)
		{
			return materialInfo = data;
		}
		//false 同步请求
		Ajax.ajaxRequest(config.sitePath+"/servlet/material/MaterialAction","post",false,param,callBackFunc,null,false,null,null,true);
		return materialInfo;
	}

	return {
	  	version	:"1.0",
	  	getMaterialDetail:getMaterialDetail
	};
})();

/**
 * 描述：微信系统前端入口
 * 版权: Copyright (c) 2014 
 * 公司: 思迪科技 
 * 作者: 邱育武 
 * 版本: 1.0 
 * 创建日期: 2015-4-20 
 * 创建时间: 下午7:34:51
 */
window.onload = function()
{
	var config = wxconfig.configInit();//初始化系统配置文件
	wxUtils.initPageSource();//初始化访问来源
	OAuth2.setURLCustomer();// 保存URL上的用户信息
	var customer = OAuth2.initCustomer(null,true);//初始化访问用户信息
	if(config.isJSSDK)
	{
		JS_SDK.init(config.isDebug);//JSSDK接口自动授权
	}
//	wxUtils.closeLoading();//关闭页面预先加载动画
}; 