enum SDKTYPE {
	Wzt = 1,
	Down,
	Wanba = 3,
}
class SdkMgr {
	/** 通过url获取*/
	public static currSdk: number = 0;
	public static appid: number = 0;

	/** 机型*/
	public static deviceModel: string;
	/** 系统版本*/
	public static osInfo: string;
	/** 1进入服器*/
	public static extDataType_1: number = 1;
	/** 2创建用户角色*/
	public static extDataType_2: number = 2;
	/** 3玩家升级*/
	public static extDataType_3: number = 3;
	/** 4角色改名*/
	public static extDataType_4: number = 4;
	/** 5选服页面*/
	public static extDataType_5: number = 5;

	/** 威震天*/
	public static P_TYPE_1: number = 1;
	/** 千熙玩SDK*/
	public static P_TYPE_6: number = 6;
	/** Q版 quick */
	public static P_TYPE_7: number = 7;
	/**趣乐多 玩吧 */
	public static P_TYPE_8: number = 8;
	/**小7 */
	public static P_TYPE_9: number = 9;
	/**暴雨疾风跳跃 */
	public static P_TYPE_10: number = 10;
	/**暴雨疾风跳跃  vivo */
	public static P_TYPE_11: number = 11;
	/**暴雨QQ小游戏**/
	public static P_TYPE_12: number = 12;

	/** 渠道id，服务器定义的*/
	public static channelid: number = 0;
	/** 平台id,服务器定义*/
	public static platformid = 0;
	/** 请求类型，1是走原来服务器请求，2是走PHP接口请求*/
	public static requestType: number = 2;
	/** 和PHP定义的ver*/
	public static ver: string = "";
	/** 创角时间*/
	public static createTime: number = 0;
	/** 信息队列*/
	public static setInfoList: Array<number> = [];
	/** 请求PHP函数名字*/
	public static functionUrl: string = "";
	/** 请求php返回服务器地址的函数*/
	public static serverUrl: string = "";
	/** 版本*/
	public static version: string = "";
	/** 是否进入游戏*/
	public static isLogin: boolean;
	/** 包的标识*/
	public static tag: string = "";
	public constructor() {
	}

	/**微信小游戏*/
	public static isWxGame() {
		return (!window["isWebGame"] && !window["tt"] && window["wx"] && !window["qq"]);
	}

	/**TT小游戏*/
	public static isTTGame() {
		return (!window["isWebGame"] && window["tt"]);
	}

	public static pay(o: SdkParam): void {
		if (Main.isDebug) return;
		if (SdkMgr.isWxGame())
			WxSdk.ins().pay(o); //微信pay
		else
			h5_sdk["Sdk_" + SdkMgr.currSdk].ins()["pay_" + SdkMgr.currSdk](o);
	}

	/** 信息上报
	 * @param type 1进入服器2创建用户角色3玩家升级4角色改名5选服页面
	*/
	public static setExtData(type: number): void {
		if (SdkMgr.isWxGame() && type == SdkMgr.extDataType_1) {
			// WxSdk.ins().reportRoleSdk(RoleMgr.actorid, GameLogic.ins().actorModel.name, GameLogic.ins().actorModel.level);
			return;
		}
		if (Main.isDebug) return;
		if (SdkMgr.createTime == 0) {
			SdkMgr.setInfoList.push(type);
			if (type == SdkMgr.extDataType_2) {
				SdkMgr.getActorCreateTime();
			}
			return;
		}

		if (h5_sdk["Sdk_" + SdkMgr.currSdk])
			h5_sdk["Sdk_" + SdkMgr.currSdk].ins()["setExtData_" + SdkMgr.currSdk](type);
	}

	/** 分享*/
	public static share(): void {
		if (h5_sdk["Sdk_" + SdkMgr.currSdk])
			h5_sdk["Sdk_" + SdkMgr.currSdk].ins()["share_" + SdkMgr.currSdk]();
	}

	/** 扫码关注*/
	public static Qrcode(): void {
		if (h5_sdk["Sdk_" + SdkMgr.currSdk])
			h5_sdk["Sdk_" + SdkMgr.currSdk].ins()["collection_" + SdkMgr.currSdk]();
	}

	/** 退出登录*/
	public static loginOut(): void {
		h5_sdk["Sdk_" + SdkMgr.currSdk].ins()["loginOut_" + SdkMgr.currSdk]();
	}
	/** 请求php登录*/
	public static requestPhpLogin(param: string): void {
		var url: string = "";
		StartGetUserInfo.urlData = param;
		url = "https://wdws-api.shouyougu.cn/api/server/getGameUrl?ver=" + SdkMgr.serverUrl;
		var requestServer: egret.HttpRequest = new egret.HttpRequest();
		requestServer.responseType = egret.HttpResponseType.TEXT;
		requestServer.open(url, egret.HttpMethod.GET);
		requestServer.send();
		requestServer.addEventListener(egret.Event.COMPLETE, this.sendServerUrl, this);
		egret.log("请求服务器地址：" + url);

	}

	/** 返回登录结果*/
	private static requestComplete(e: egret.Event): void {
		var request = <egret.HttpRequest>e.currentTarget;
		request.removeEventListener(egret.Event.COMPLETE, this.requestComplete, this);
		egret.log("登录返回" + request.response);
		var jsonObj: any = JSON.parse(request.response);

		if (jsonObj.code == 200) //200是成功
		{
			egret.log(jsonObj.code + jsonObj.data);
			SdkMgr.ver = jsonObj.data.ver;
			StartGetUserInfo.manageServerList(jsonObj);
		}
		else {
			alert("结果：" + jsonObj.message);
		}
	}

	/** 请求登录*/
	public static sendServerUrl(): void {
		var serverRequest: egret.HttpRequest = new egret.HttpRequest();
		var url: string = Const.SERVER_LIST_URL + "api/" + SdkMgr.functionUrl + "?" + StartGetUserInfo.urlData;
		serverRequest.open(url, egret.HttpMethod.GET);
		serverRequest.send();
		serverRequest.addEventListener(egret.Event.COMPLETE, this.requestComplete, this);
		egret.log("请求php>2" + url);
	}

	public static uuid(len, radix) {
		var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
		var uuid = [], i;
		radix = radix || chars.length;

		if (len) {
			// Compact form
			for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix];
		}
		else {
			// rfc4122, version 4 form
			var r;

			// rfc4122 requires these characters
			uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
			uuid[14] = '4';

			// Fill in random data. At i==19 set the high bits of clock sequence as
			// per rfc4122, sec. 4.1.5
			for (i = 0; i < 36; i++) {
				if (!uuid[i]) {
					r = 0 | Math.random() * 16;
					uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
				}
			}
		}

		return uuid.join('');
	}


	/** 获取创角时间*/
	public static getActorCreateTime(): void {
		if (Main.isDebug) return;//debug环境不请求
		if (SdkMgr.createTime != 0) return;
		var url: string = "";
		// egret.log("请求创角时间");
		if (SdkMgr.isWxGame() || SdkMgr.requestType == 1) {
			url = Const.SERVER_LIST_URL + "get_actor_create_time?platformid=" + SdkMgr.platformid + "&serverid=" + GameServer.serverID + "&account=" + StartGetUserInfo.uid;
		}
		else {
			url = Const.SERVER_LIST_URL + "api/server/getActorCreateTime?platformid=" + SdkMgr.platformid + "&serverid=" + GameServer.serverID + "&account=" + StartGetUserInfo.uid + "&ver=" + SdkMgr.ver;
		}
		var request = new egret.HttpRequest();
		request.responseType = egret.HttpResponseType.TEXT;
		request.open(url, egret.HttpMethod.GET);
		request.send();
		request.addEventListener(egret.Event.COMPLETE, this.requestCreateComplete, this);
	}

	/** php返回创角时间*/
	private static requestCreateComplete(e: egret.Event): void {
		var request = <egret.HttpRequest>e.currentTarget;
		request.removeEventListener(egret.Event.COMPLETE, this.requestCreateComplete, this);
		let jsonObj = JSON.parse(request.response);
		this.createTime = jsonObj.data;

		for (var i = 0; i < SdkMgr.setInfoList.length; i++) {
			SdkMgr.setExtData(SdkMgr.setInfoList.shift());
		}
	}

	/** 传入一个object对象，返回拼接好字符串*/
	public static objectUrlParam(obj): string {
		var s: string = "";
		for (var key in obj) {
			s += key + "=" + obj[key] + "&";
		}
		return s.substr(0, s.length - 1);
	}

	public static mobileVersions() {
		var u = navigator.userAgent, app = navigator.appVersion;
		var o: any = {};
		o.trident = u.indexOf('Trident') > -1, //IE内核
			o.presto = u.indexOf('Presto') > -1, //opera内核
			o.webKit = u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
			o.gecko = u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核
			o.mobile = !!u.match(/AppleWebKit.*Mobile.*/), //是否为移动终端
			o.ios = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
			o.android = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或uc浏览器
			o.iPhone = u.indexOf('iPhone') > -1, //是否为iPhone或者QQHD浏览器
			o.iPad = u.indexOf('iPad') > -1, //是否iPad
			o.webApp = u.indexOf('Safari') == -1 //是否web应该程序，没有头部与底部

		return o;        //移动终端浏览器版本信息
	}

	/** 初始化，获取参数*/
	public static getParam(): void {

		if (SdkMgr.functionUrl == null) {
			SdkMgr.functionUrl = "wdws/LezhongTwo/wanbaVerify";
		}
		if (h5_sdk["Sdk_" + SdkMgr.currSdk])
			h5_sdk["Sdk_" + SdkMgr.currSdk].ins()["getParam_" + SdkMgr.currSdk]();
	}
	public static isSendCdkey: boolean = false;
	public static sendCdkey(code: string): void {
		if (Main.isDebug) return;
		if (SdkMgr.isSendCdkey) return;
		SdkMgr.isSendCdkey = true;
		var serverRequest: egret.HttpRequest = new egret.HttpRequest();
		serverRequest.responseType = egret.HttpResponseType.TEXT
		serverRequest.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
		var url: string = Const.BG_SERVER_URL + "api/code/useCode?code=" + code +
			"&platform_id=" + SdkMgr.platformid +
			"&server_id=" + GameServer.serverID +
			"&channel_id=" + SdkMgr.channelid +
			"&dbid=" + RoleMgr.actorid +
			"&account=" + StartGetUserInfo.uid +
			"&actor_name=" + GameLogic.ins().actorModel.name;

		// let url: string = "http://192.168.2.15:5555/api/code/useCode?code=" + code + "&platform_id=5014&server_id=1&channel_id=7&dbid=17179869328&account=wdws_soeasy_2e00316b5c5d88c70af352cd49c8a7ef&actor_name=%E7%AB%A5%E6%9B%A6%E5%92%8C"
		serverRequest.open(url, egret.HttpMethod.GET);
		serverRequest.send();
		serverRequest.addEventListener(egret.Event.COMPLETE, SdkMgr.getCdk, this);
		serverRequest.addEventListener(egret.IOErrorEvent.IO_ERROR, this.onGetIOError, this);
		serverRequest.addEventListener(egret.ProgressEvent.PROGRESS, this.onGetProgress, this);
	}
	private static getCdk(event: egret.Event): void {
		setTimeout(function () {
			egret.log("恢复");
			SdkMgr.isSendCdkey = false;
		}, 2000)
		var request = <egret.HttpRequest>event.currentTarget;
		// var data: any = this.responseType == 'JSON' ? JSON.parse(request.response) : request.response;
		let jsonObj = JSON.parse(request.response)
		UserTips.ins().showTips(jsonObj.message);
	}
	private static onGetIOError(e) {
		egret.log(e);
	}
	private static onGetProgress(e) {
		egret.log(e);
	}
}
window["SdkMgr"] = SdkMgr