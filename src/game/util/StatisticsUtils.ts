class StatisticsUtils {

	public static open: boolean = false;
	public static secretKey = "yonghengxianyu#123!@#$%^&*";
	//后台统计
	public constructor() {
	}
	/**
	 * 玩家注册
	 * 192.168.1.38:7071/api/report
	 * counter	是	string	create
	 * channel	是	string	渠道
	 * account	是	string	账号
	 * regtime	是	int	注册时间 unix时间戳
	 * network_type	是	string	网络类型
	*/
	public static create() {
		if (!StatisticsUtils.open) return;
		let attrArr: Array<string> = ["counter", "channel", "account", "network_type"];
		attrArr.sort();

		let tempObj = {};
		tempObj["counter"] = "create";
		tempObj["channel"] = "android";
		tempObj["account"] = StartGetUserInfo.username;
		tempObj["network_type"] = "4G";

		let signature = StatisticsUtils.getObjStrParam(tempObj, attrArr);

		let md5Str = signature + StatisticsUtils.secretKey;
		let sk = md5.hex_md5(md5Str);
		let param = signature + "&sign=" + sk;

		HttpClient.post((obj2) => {
			console.log("玩家注册返回" + obj2);
		},
			this, param
		);
	}

	/**
	 * 玩家登录
	 * counter	是	string	login
		channel	是	string	渠道
		server_id	是	int	服务器id
		account	是	string	玩家账号
		actor_id	是	int	玩家角色id
		actor_name	是	string	角色名
		user_level	是	int	玩家当前等级
	*/
	public static login() {
		if (!StatisticsUtils.open) return;
		let attrArr: Array<string> = ["counter", "channel", "server_id", "account", "actor_id", "actor_name", "user_level", "user_level"];
		attrArr.sort();

		let tempObj = {};
		tempObj["counter"] = "login";
		tempObj["channel"] = "android";
		tempObj["server_id"] = StartGetUserInfo.ServerId;
		tempObj["account"] = StartGetUserInfo.username;
		tempObj["actor_id"] = StartGetUserInfo.uid;
		tempObj["actor_name"] = StartGetUserInfo.username;
		tempObj["user_level"] = "14";

		let signature = StatisticsUtils.getObjStrParam(tempObj, attrArr);

		let md5Str = signature + StatisticsUtils.secretKey;
		let sk = md5.hex_md5(md5Str);
		let param = signature + "&sign=" + sk;

		HttpClient.post((obj2) => {
			console.log("玩家登录返回" + obj2);
		},
			this, param
		);
	}

	/**
	 * 把错误信息打印给php记录(attrArr长度需要和valueList长度保持一致)
	 * @param attrArr 属性名字
	 * @param valueList 属性值
	*/
	public static debugInfoLogPhp(param: string): void {
		var str: string = "pfrom_id=" + SdkMgr.platformid;
		str += "&server_id=" + GameServer.serverID;
		str += "&account=" + StartGetUserInfo.uid;
		str += "&actor_name=" + GameLogic.ins().actorModel.name;
		str += "&message=" + param + ">>>>手机型号：" + "系统信息：" + SdkMgr.osInfo;

		// param = "isDebug:"+Main.isDebug +  " sdk:"+SdkMgr.currSdk+" appid:"+SdkMgr.appid+"  "+param+ "  手机型号："+SdkMgr.mobileModel; + "系统信息：" + SdkMgr.osInfo;
		HttpClient.post((obj2) => {
			console.log("通知php成功返回" + obj2.message);
		},
			this, str, 'JSON', "https://wdws2-api.h5aiwan.com/api/changyu/noseError"//"https://bg-lhxc.shouyougu.cn/api"
		);
	}

	public static clickNum: number = 0;
	public static time: number = 0;
	public static isSetdata: boolean = false;//是否上报信息
	/** 上报玩家流程*/
	public static setPhpLoading(type: number): void {
		if (this.isSetdata == false && Main.isDebug == false) return;
		var data: any = {};
		data.pfrom_id =   SdkMgr.platformid;
		data.server_id = GameServer.serverID;
		data.channel = StartGetUserInfo.channelId2;
		data.account = StartGetUserInfo.uid;
		data.actor_name = GameLogic.ins().actorModel.name;
		data.schedule = type;
		data.click_count = type == 2 ? this.clickNum : 0;
		data.load_time = egret.getTimer() - this.time;

		var param: string = "";
		for (var key in data) {
			param += key + "=" + data[key] + "&";
		}
		param = param.substr(0, param.length - 1);
		egret.log("上报" + param);
		HttpClient.get((obj) => {
			console.log("通知php上报返回" + obj.code);
		},
			this, param, 'JSON', "https://wdws2-api.h5aiwan.com/api/changyu/noseLoad"
		);
	}

	/** 上报玩家点击次数*/
	public static setPhpClick(type: number): void {
		if (this.isSetdata == false) return;
		var data: any = {};
		data.pfrom_id = SdkMgr.platformid;
		data.server_id = GameServer.serverID;
		data.channel = StartGetUserInfo.channelId2;
		data.account = StartGetUserInfo.uid;
		data.actor_name = GameLogic.ins().actorModel.name;
		data.schedule = 1;
		data.click_type = type;
		data.click_time = egret.getTimer() - CreateRoleView.startTime;

		var param: string = "";
		for (var key in data) {
			param += key + "=" + data[key] + "&";
		}
		param = param.substr(0, param.length - 1);
		egret.log("上报" + param);
		HttpClient.get((obj) => {
			console.log("通知php上报返回" + obj.code);
		},
			this, param, 'JSON', "https://wdws2-api.h5aiwan.com/api/changyu/noseClick"
		);
	}

	public static getObjStrParam(obj: Object, attrArr: Array<string>) {
		let signature = "";
		let len = attrArr.length;
		for (let i = 0; i < len; i++) {
			if (i != (len - 1)) {
				signature += attrArr[i] + "=" + obj[attrArr[i]] + "&";
			}
			else {
				signature += attrArr[i] + "=" + obj[attrArr[i]];
			}
		}

		return signature;
	}


	public static loginErrorLogPhp(str :string){
		
	}


	public test() {
		let request = new egret.HttpRequest();
		request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
		// request.setRequestHeader("Access-Control-Allow-Origin", "*");

		var server_url = "http://192.168.1.38:7071/api/report";
		console.log(server_url);


		request.responseType = egret.HttpResponseType.TEXT;
		request.open(server_url, egret.HttpMethod.GET);
		request.send();

		request.addEventListener(egret.Event.COMPLETE, this.onGetComplete, this);
		request.addEventListener(egret.IOErrorEvent.IO_ERROR, this.onGetIOError, this);
		request.addEventListener(egret.ProgressEvent.PROGRESS, this.onGetProgress, this);
	}

	private onGetComplete(event: egret.Event): void {
		var request = <egret.HttpRequest>event.currentTarget;
		// var data: any = this.responseType == 'JSON' ? JSON.parse(request.response) : request.response;
		// if (this.returnFunc != null) {
		//     this.returnFunc.call(this.target, data);
		// }
		// this.destory();
	}

	private onGetIOError(event: egret.IOErrorEvent): void {
		console.log("get error : " + event);
		// this.destory();
	}

	private onGetProgress(event: egret.ProgressEvent): void {
		console.log("get progress : " + Math.floor(100 * event.bytesLoaded / event.bytesTotal) + "%");
	}

	public static time1: number = 0;
	public static time2: number = 0;
	public static time3: number = 0;
	public static time4: number = 0;
	public static time5: number = 0;

	/** 玩家数据统计*/
	public static playerSetData(type: number, timer: number): void {
		if (Main.isDebug) return;
		let param: string = '';

		param += "account=" + GameLogic.ins().actorModel.actorID + "-" + StartGetUserInfo.uid;
		param += "&actor_name=" + GameLogic.ins().actorModel.name;
		param += "&channel=" + 7;//HySdk.channelId;
		param += "&counter=load_client";
		param += "&load_time=" + (egret.getTimer() - timer);
		param += "&pfrom_id=" + SdkMgr.platformid;
		param += "&schedule=" + type;
		param += "&server_id=" + GameServer.serverID;

		let md5Str = param + StatisticsUtils.secretKey;
		let sk = md5.hex_md5(md5Str);
		param = param + "&sign=" + sk;

		// HttpClient.get((obj2) => {
		// 	console.log("php成功上报信息" + JSON.stringify(obj2));
		// },
		// 	this, param, 'JSON', "https://lyxc.kingcheergame.com:7073/api/report"
		// );

		// console.log(param);
	}
}
window["StatisticsUtils"]=StatisticsUtils