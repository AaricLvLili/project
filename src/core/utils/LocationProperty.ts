class LocationProperty {
	public constructor() {
	}

	public static urlParam: any = {};

	public static init() {
		this.urlParam = {};
		// var str = window['paraUrl'];
		var str = window.location.search;
		
		if (str) {
			var whIndex = str.indexOf("?");
			if (whIndex != -1) {
				var param = str.slice(whIndex + 1).split("&");
				var strArr = void 0;
				for (var i = 0; i < param.length; i++) {
					strArr = param[i].split("=");
					this.urlParam[strArr[0]] = strArr[1];
				}
			}
		}
	};
	public static get resAdd(): string {
		return this.urlParam['hosts'] || "";
	}
	public static get openID() {
		return this.urlParam['user'];
	}

	public static get openKey() {
		return this.urlParam['openkey'];
	}

	public static get password() {
		return this.urlParam['spverify'] || "e10adc3949ba59abbe56e057f20f883e";
	}

	public static get serverIP() {
		return this.urlParam['srvaddr'];
	}

	public static get serverPort() {
		return this.urlParam['srvport'];
	}

	public static get serverID() {
		return this.urlParam['serverid'];
	}

	public static get srvid() {
		return this.urlParam['srvid'];
	}

	public static get appid() {
		return this.urlParam['appid'] || "";
	}

	public static get app_openid() {
		return this.urlParam['app_openid'] || "";
	}

	public static get isSubscribe() {
		return this.urlParam['isSubscribe'];
	}

	public static get nickName() {
		var str = this.urlParam['nickName'] || "";
		return str.length ? decodeURIComponent(str) : str;
	}

	public static get callUrl() {
		var str = this.urlParam['callUrl'] || "";
		return str.length ? decodeURIComponent(str) : str;
	}

	public static get gifi() {
		return this.urlParam['gifi'];
	}

	public static get roleCount() {
		return this.urlParam['roleCount'] || "0";
	}

	public static get isnew() {
		return this.urlParam['isnew'];
	}

	public static get login_ip() {
		return this.urlParam['login_ip'];
	}

	public static get is_attention() {
		return this.urlParam['is_attention'];
	}

	public static get token(): string {
		return "111";//this.urlParam["token"] || ""
	}

	public static isCanLogin() {
		return this.openID != null &&
			this.password != null &&
			this.srvid != null &&
			this.serverIP != null &&
			this.serverPort != null;
	};
    /*
     * 获取url参数值，没有返回null
     * 不传递paraUrl参数默认获取当前url
     * */
	public getPara(paraName, paraUrl) {
		if (egret.Capabilities.runtimeType == egret.RuntimeType.NATIVE)//egret.MainContext.RUNTIME_NATIVE)
			return null;
		var url = paraUrl || location.href;
		var whIndex = url.indexOf("?");
		if (whIndex != -1) {
			//let urlPara = "&" + url.split("?")[1];
			var urlPara = "&" + url.slice(whIndex + 1);
			var reg = new RegExp("\&" + paraName + "\=.*?(?:\&|$)");
			var result = reg.exec(urlPara);
			if (result) {
				var value = result[0];
				return value.split("&")[1].split("=")[1];
			}
		}
		return null;
	};
    /*
     * 给Url参数赋值
     * 不传递paraUrl参数默认获取当前url
     * */
	public setProperty(paraName, paraValue, paraUrl) {
		var url = paraUrl || location.href;
		var urlPara = "&" + url.split("?")[1];
		if (url.indexOf("?") == -1) {
			return url += "?" + paraName + "=" + paraValue;
		}
		else {
			var urlPara_1 = url.split("?")[1];
			if (urlPara_1 == "")
				return url += paraName + "=" + paraValue;
			var regParaKV = new RegExp("(?:^|\&)" + paraName + "\=.*?(?:\&|$)");
			var result = regParaKV.exec(urlPara_1);
			if (!result || result[0] == "") {
				return url += "&" + paraName + "=" + paraValue;
			}
			else {
				var oldValue = result[0];
				var regParaKey = new RegExp("\=.*$");
				var newValue = oldValue.replace(regParaKey, "=" + paraValue);
				return url.replace(oldValue, newValue);
			}
		}
	};
    /*
     * 检查url中是否包含某参数
     * 这代码有一个例外就是paraName = "undefined", paraUrl中不含"?"会返回true
     * 相信你不会这么用的 =.=
     * */
	public hasProperty(paraName, paraUrl) {
		var url = paraUrl || location.href;
		var para = "&" + url.split("?")[1]; //加&是为了把&作为参数名开始=作为参数名结束，防止uid=1&id=2此类误判
		return para.indexOf("&" + paraName + "=") != -1;
	};

}
window["LocationProperty"]=LocationProperty