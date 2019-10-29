/**
 * version 1.1
 * 模块名：微信JS-SDK
 * 作者： 蒋松
 * 时间：2015年1月21日15:32:40
 * 简述：http://mp.weixin.qq.com/wiki/7/aaa137b55fb2e0456bf8dd9148dd613f.html
 */
define('wx/scripts/common/WX_SDK.js',function(require,exports,module){
	var global = $.config.global;
	//var wx = require("jweixin-1.2.0");
	//JS接口集合
	var apiList = ['checkJsApi','onMenuShareTimeline','onMenuShareAppMessage','onMenuShareQQ','onMenuShareWeibo',
       'hideMenuItems','showMenuItems','hideAllNonBaseMenuItem','showAllNonBaseMenuItem','translateVoice',
        'startRecord','stopRecord','onVoiceRecordEnd','playVoice','pauseVoice','stopVoice','uploadVoice',
        'downloadVoice','chooseImage','previewImage','uploadImage','downloadImage','getNetworkType',
        'openLocation','getLocation','hideOptionMenu','showOptionMenu','closeWindow','scanQRCode',
        'chooseWXPay','openProductSpecificView','addCard','chooseCard','openCard'
	]; 
	function stringToJson(strData)
	{
		if(strData!=""&&strData!=undefined&&strData!=null)
		{
			var str = '(' + strData + ')'; //json字符串
			return eval(str);
		}
		return "";
	}
	/*******************************初始化开始********************************************/
	/**
	 * 入口方法 初始化JS-SDK
	 * @param param 入参（具体内容待定）
	 * param = {
	 *	 jsApiJson <array> JS接口列表数组
	 *   apiArr <array> 固定组合数组
	 *   myApiArr <array> 自定义组合数组
	 *	}
	 * @param callBack 需要调用的SDK功能
	 * @param debug 是否开启调试模式
	 */
	function init(param,callBack,debug){
		//JS接口列表，所有JS接口列表见附录2（http://mp.weixin.qq.com/wiki/7/aaa137b55fb2e0456bf8dd9148dd613f.html）
		var jsApiJson = {
			"share":[apiList[1],apiList[2],apiList[3],apiList[4]]
		};
		var jsApiList = ["checkJsApi"];// 必填，需要使用的JS接口列表
		if(param["apiArr"] != undefined){
			//默认划分的接口列表
			for ( var i = 0; i < param["apiArr"].length; i++) {
				jsApiList = jsApiList.concat(jsApiJson[param["apiArr"][i]]);
			}
		}
		else if(param["myApiArr"] != undefined){
			//自定义接口列表
			for ( var i = 0; i < param["myApiArr"].length; i++) {
				jsApiList.push(apiList[param["myApiArr"][i]]);
			}
		}
		//1.步骤一：绑定域名 【设置 ——> 公众号设置 ——> 功能设置 ——>  JS安全域名（必须为ICP备案域名）】
		
		//2.步骤二：引入JS文件 【在index.html 在框架前引入】
		
		//3.步骤三：通过config接口注入权限验证配置
		var  cur_url = window.location.href;
		/*
		 * 判断当前链接是否含“#”，前端需要用js获取当前页面除去'#'hash部分的链接
		 * （可用location.href.split('#')[0]获取）
		 */
		if(cur_url.split("#")[1] != undefined){
			cur_url = cur_url.split("#")[0];
		}
		var inParam = {
						"weixinpk":$.getSStorageInfo("weixinpk"),
						"cur_url":cur_url,//当前链接含参数
						"url":global.wxApiUrl,//获取验签后台请求链接
						"jsApiList":apiList,// 必填，需要使用的JS接口列表
						"debug":debug
		};
		var configParam = getWXConfigParam(inParam);
		/*所有需要使用JS-SDK的页面必须先注入配置信息，
		否则将无法调用（同一个url仅需调用一次，对于变化url的SPA的web app可在每次url变化时进行调用）。*/
		wx.config(configParam);
		
		//4.步骤四：通过ready接口处理成功验证
		wx.ready(function(){
			if(callBack){
				callBack();
			}
		});
		
		//5.步骤五：通过error接口处理失败验证
		wx.error(function (res) {
			if(debug){
				$.alert(res.errMsg);
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
	*				signature: '',// 必填，签名，见附录1}
	*/	 
	function getWXConfigParam(param){
		var debug = param["debug"];
		if(!debug){debug = false;}
		var returns = "";
		$.ajax({
			url:'/servlet/json',
			data:"weixinpk="+param["weixinpk"]+"&url="+encodeURIComponent(param["cur_url"])+"&funcNo=1000003",
			type:"post",
			async:false,
			success: function(data, textStatus) {
				var results_json =stringToJson( data);
				var results=results_json.results[0];
				console.log(results);
				returns = {
						debug: debug, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
					    appId: results["appid"], // 必填，公众号的唯一标识
					    timestamp: results["timestamp"], // 必填，生成签名的时间戳
					    nonceStr: results["nonceStr"], // 必填，生成签名的随机串
					    signature: results["signature"],// 必填，签名，见附录1
					    jsApiList: param["jsApiList"] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
					};
				return returns;
			}
		});
		 return returns;
	}
	/*******************************初始化结束********************************************/
	
	/*******************************检测接口开始********************************************/
	var check = function(jsApiList,func){
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
							$.alert("当前微信版本过低，请升级到最新版本，不然会影响您的体验哦！");
							break;
						}
					}
				}
			  }
	    });
	};
	/*******************************检测接口结束********************************************/
	
	
	
	/*******************************分享接口开始********************************************/
	
	/**
	 * 分享接口集合
	 */
	var share = {
			AppMessage:function(param,clickFuc,hasFuc,cancelFuc,failFuc){
				//2.1 监听“分享给朋友”，按钮点击、自定义分享内容及分享结果接口
				wx.onMenuShareAppMessage(
					commonShareJson(param,clickFuc,hasFuc,cancelFuc,failFuc)
				);
			},
			Timeline:function(param,clickFuc,hasFuc,cancelFuc,failFuc){
				 // 2.2 监听“分享到朋友圈”按钮点击、自定义分享内容及分享结果接口
				wx.onMenuShareTimeline(
					commonShareJson(param,clickFuc,hasFuc,cancelFuc,failFuc)	
				);
			},
			QQ:function(param,clickFuc,hasFuc,cancelFuc,failFuc){
				// 2.3 监听“分享到QQ”按钮点击、自定义分享内容及分享结果接口
			    wx.onMenuShareQQ(
			    	commonShareJson(param,clickFuc,hasFuc,cancelFuc,failFuc)
			    );
			},
			Weibo:function(param,clickFuc,hasFuc,cancelFuc,failFuc){
				// 2.4 监听“分享到微博”按钮点击、自定义分享内容及分享结果接口
				wx.onMenuShareWeibo(
					commonShareJson(param,clickFuc,hasFuc,cancelFuc,failFuc)
				);
			}
	};
	
   /**
	* 获取所有分享
	* @param param {jsApiList,imgUrl,link,title,desc}
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
	 * @param param {title,desc,link,imgUrl}
	 * &_share=1 后面拼接用于区分是否来自分享，也是为了取参数避免取到腾讯加到的后缀
	 * @param clickFuc 用户点击发送给朋友callBack
	 * @param hasFuc 已分享callBack
	 * @param cancelFuc 已取消callBak
	 * @param failFuc 分享失败callBak
	 * 
	 * @returns {} 初始化分享内容
	 */
	function commonShareJson(param,clickFuc,hasFuc,cancelFuc,failFuc){
		//分享标识，用于判断当前页面是否是分享过来的
		var shareFlag = param["title"].indexOf("?") > -1 ? "&_share=1" : "?_share=1";
		return { 
			  title:param["title"],// 分享标题
			  desc: param["desc"],// 分享描述
			  link: param["link"] + shareFlag,// 分享链接 
			  imgUrl:param["imgUrl"],// 分享图标
			  trigger: function (res) {
				if(clickFuc)
				clickFuc();
			  },
			  success: function (res) {
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
	/*******************************分享接口结束********************************************/
	
	
	
	/*******************************图像接口开始********************************************/
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
		    	$.alert('上传图片不能为空');
 				 return;
			}
			if(showPro == undefined)
				showPro = 1; // 默认为1，显示进度提示
   		    var i = 0, length = imagesArr.length;
   		    function upload() {
      			wx.uploadImage({
	        		localId: imagesArr[i],
	        		isShowProgressTips: showPro, 
	        		success: function (res) {
		         		 i++;
		         		serverId.push(res.serverId);
		          		if (i < length) {
		           			 upload();
		         		 }else{
							if(suFunc)
							   suFunc(res);
						 }
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
		    	$.alert('下载列表不能为空');
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
	/*******************************图像接口结束********************************************/
	
	/*******************************音频接口开始********************************************/
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
				    	 $.alert('请提供识别的语音');
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
				        		$.alert('无法识别');
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
					        	 $.alert('用户拒绝授权录音');
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
							    	  $.alert('录音时间已超过一分钟');
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
				    	$.alert('请提供播放的录音');
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
			    	 $.alert('请提供停止的录音');
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
				    		$.alert('录音播放结束');
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
					  $.alert('请提供一段可供上传的录音');
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
				    	$.alert('请提供可供下载的语音');
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
	
	/*******************************音频接口结束********************************************/
	
	/*******************************界面操作接口开始********************************************/
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
	/*******************************界面操作接口结束********************************************/
	
	/*******************************二维码扫描接口开始********************************************/
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
	/*******************************二维码扫描接口结束********************************************/
	
	/*******************************地图接口开始********************************************/
	var Map = {
			openLocation:function(param){
				/**
				 * 查看地理位置
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
			        		$.alert('用户拒绝授权获取地理位置');
			        	}
			        }
			    });
			}
	};
	/*******************************地图接口结束********************************************/
	
	/*******************************微信小店接口开始********************************************/
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
	/*******************************微信小店接口结束********************************************/
	
	/*******************************设备信息接口开始********************************************/
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
	/*******************************设备信息接口结束********************************************/
	
	/*******************************卡卷接口开始********************************************/
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
	
	/*******************************卡卷接口结束********************************************/
	
	
	/*******************************微信支付接口开始********************************************/
	/**
	 * 微信支付
	 * @param  param 入参
	 */
	var pay = function(param){
		wx.chooseWXPay({
		    timestamp:param['timestamp'], // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
		    nonceStr:param['nonceStr'], // 支付签名随机串，不长于 32 位
		    package:param['package'], // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=***）
		    signType:param['signType'], // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
		    paySign:param['paySign'] // 支付签名
		});	
	};
	/*******************************微信支付接口结束********************************************/
	var WX_SDK = {
			"init":init,
    		"shareAll":shareAll,
    		"share":share,
    		"panel":panel,
    		"image":image,
    		"voices":voices,
    		"QRCode":QRCode,
    		"Map":Map,
    		"product":product,
    		"phone":phone,
    		"card":card,
    		"pay":pay
    };
     module.exports = WX_SDK;
});