class ReportData {
	httpRequest = new egret.HttpRequest();

	static _ins: ReportData;
	public constructor() {
	}

	public static getIns() {
		this._ins = this._ins || new ReportData();
		return this._ins;
	};
	/** 上报打点记录 */
	public report(str) {
		var roleCount = parseInt(LocationProperty.roleCount);
		//不是新账号不需要上报数据
		if (roleCount != 0)
			return;
        /*
         参数说明：
         pfrom_id: 平台标识 string（16）//登陆时新增登陆参数 pfid
         server_id：区服id smallint（5）
         account: 平台帐号 string(64)
         counter: 打点标识 固定值load
         kingdom：记录打点位置 string 32
         is_new：是否新帐号 默认为 1
         exts：扩展字段 string（32） 非必要字段
         ip 登陆ip
         logdate:2016-03-07 04:23:48请求时间精确到秒
         */
		// var ua = navigator.userAgent.toLowerCase();
		// if (/iphone|ipad|ipod/.test(ua)) {
		// 	ua = "1";
		// }
		// else if (/android/.test(ua)) {
		// 	ua = "2";
		// }
		// else
		// 	ua = "0";
		// var data = "&data=";
		// data += "1";
		// data += "|" + LocationProperty.srvid;
		// data += "|" + LocationProperty.openID;
		// data += "|load";
		// data += "|" + str;
		// data += "|" + LocationProperty.isnew;
		// data += "|" + ua;
		// data += "|" + LocationProperty.login_ip;
		// data += "|" + DateUtils.getFormatBySecond(new Date().getTime(), 2);
		// data += "|" + LocationProperty.appid;
		// var add = DeviceUtils.isLocation ? "192.168.201.235:81" : "report.jzsc.7yao.top";
		// this.reportUrl("http://" + add + "/report?appv=1.0&counter=load&key=3e6d590812e1f1d370c135feeef60f97" + data);
	};
	/** 上报建议 */
	public advice(str, func, funcThis) {
		// var f = function (v) {
		// 	this.httpRequest.removeEventListener(egret.Event.COMPLETE, f, this);
		// 	var request = v.currentTarget;
		// 	if (request.response == "ok") {
		// 		UserTips.ins().showTips("提交问题成功！");
		// 		func.call(funcThis);
		// 	}
		// 	else
		// 		UserTips.ins().showTips("网络出故障，请重新提交问题！");
		// };
		// this.httpRequest.addEventListener(egret.Event.COMPLETE, f, this);
		// var p;
		// while (true) {
		// 	p = str.indexOf("@");
		// 	if (p < 0)
		// 		break;
		// 	str = str.replace("@", "");
		// }
		// var data = "&serverid=" + LocationProperty.srvid;
		// data += "&sign=" + md5.hex_md5("" + (LocationProperty.srvid || 0) + GameLogic.ins().actorModel.actorID + "enter_reportfeedbackqiyaohudongyule!@#");
		// data += "&actorid=" + GameLogic.ins().actorModel.actorID;
		// data += "&actorname=" + GameLogic.ins().actorModel.name;
		// data += "&feedcnt=" + str;
		// data += "&openid=" + LocationProperty.openID;
		// data += "&userlevel=" + GameLogic.ins().actorModel.level;
		// data += "&viplevel=" + UserVip.ins().lv;
		// data += "&appid=" + LocationProperty.appid;
		// var add = DeviceUtils.isLocation ? "cq.api.com" : "";
		// this.reportUrl("http://" + add + "/api/load?counter=enter_report" + data);
	};
	public reportUrl(url, method?: any) {
		// this.httpRequest.open(url, method ? method : egret.HttpMethod.GET);
		// this.httpRequest.send();
	};
	public reportSDK(str) {
		// window['reportSDK'](str, LocationProperty.app_openid, LocationProperty.srvid, LocationProperty.openID, LocationProperty.nickName);
	};
}
window["ReportData"]=ReportData