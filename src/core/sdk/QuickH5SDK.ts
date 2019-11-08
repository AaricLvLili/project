/**qucik聚合*/
class QuickH5SDK extends BaseClass {
	public constructor() {
		super();
	}

	public static ins(): QuickH5SDK {
		return super.ins();
	}

	private productCode: string = "";
	private productKey: string = "";
	private static username: string = "";
	/** 解析平台返回参数*/
	public getParam(productCode: string, productKey: string): void {
		SdkMgr.requestType = 2;
		this.productCode = productCode;
		this.productKey = productKey;

		window["QuickSDK"].init(productCode, productKey, true, () => {
			console.log("init success");
			window["QuickSDK"].setSwitchAccountNotification(function (callbackData) {//切换账号注册
				window.location.reload();
				egret.log("切换账号注册");
			});

			window["QuickSDK"].setLogoutNotification(function (logoutObject) {
				console.log('Game:玩家点击注销帐号');
				window.location.reload();
			})// 注册退出接口
			this.sdkLogin();
		})
		// StartGetUserInfo.urlData = "token=" + LocationProperty.urlParam["token"] + "&tag=" + LocationProperty.urlParam["tag"];
		// SdkMgr.sendServerUrl();
		// egret.log("调用服务器");

	}

	public sdkLogin(): void {
		egret.log("调用登录");
		window["QuickSDK"].login(function (callbackData) {
			egret.log("quick登录状态" + callbackData.status);
			var message;
			if (callbackData.status) {
				message = 'GameDemo:QuickSDK登录成功: uid=>' + callbackData.data.uid;
				// alert(message);
				var s: string = '';
				for (var key in callbackData.data) {
					s += key + "=" + callbackData.data[key] + "&";
					if (key == "username") {
						QuickH5SDK.username = callbackData.data[key];
					}
				}
				StartGetUserInfo.urlData = s + "tag=" + SdkMgr.tag;
				SdkMgr.sendServerUrl();
				// StartGetUserInfo.uid2 = callbackData.data.uid

			} else {
				QuickH5SDK.ins().sdkLogin();
				// message = 'GameDemo:QuickSDK登录失败:' + callbackData.message;	
			}
		});
	}
	/**退出账号*/
	public sdkLogout(): void {
		window["QuickSDK"].logout(function (logoutObject) {
			console.log('Game:成功退出游戏');
			window.location.reload();
		})
	}

	/** 购买支付*/
	public pay(data: SdkParam): void {
		let tempObj: any = {};//通过json格式透传给服务器
		tempObj.serverid = GameServer.serverID + '';
		tempObj.goodsid = data.goodsId + '';
		tempObj.amount = data.amount + '';
		tempObj.tag = SdkMgr.tag;

		var subject: string = "";
		var idx = data.subject.indexOf("=");
		if (idx != -1) {
			subject = data.subject.substr(0, idx - 1) + "等于" + data.subject.substr(idx + 1, data.subject.length);
		}
		else {
			subject = data.subject;
		}

		var byt: egret.ByteArray = new egret.ByteArray();
		var s = JSON.stringify(tempObj);
		// alert(s + "傲玩ver>>>" +AoWanSdk.ver);
		byt.writeUTFBytes(s);

		var orderInfo: any = new Object();
		orderInfo.productCode = this.productCode;
		orderInfo.serverId = GameServer.serverID;
		orderInfo.uid = StartGetUserInfo.uid2;
		orderInfo.username = QuickH5SDK.username;
		orderInfo.userRoleId = GameLogic.ins().actorModel.actorID + ""; //游戏内角色ID
		orderInfo.userRoleName = GameLogic.ins().actorModel.name + '';
		orderInfo.userServer = GameServer.serverID + '区';//角色所在区服
		orderInfo.userLevel = GameLogic.ins().actorModel.level;//角色等级
		orderInfo.cpOrderNo = SdkMgr.uuid(18, 16) + '';//游戏内的订单,服务器通知中会回传
		orderInfo.amount = data.amount + '';//购买金额
		orderInfo.subject = subject;//data.subject;//道具名称
		orderInfo.desc = subject;//道具描述
		orderInfo.callbackUrl = '';
		orderInfo.extrasParams = egret.Base64Util.encode(byt.buffer) + '';//透传参数,服务器通知中原样回传
		orderInfo.goodsId = data.goodsId + '';
		orderInfo.count = 1;
		orderInfo.quantifier = '个';

		var orderInfoJson = JSON.stringify(orderInfo);
		// egret.log(orderInfoJson);
		// alert(QuickH5SDK.username + orderInfoJson);
		window["QuickSDK"].pay(orderInfoJson, function (payStatusObject) {
			egret.log('GameDemo:下单通知' + JSON.stringify(payStatusObject));
		});
	}

	/** 上传角色信息接口*/
	public setExtData(type: number): void {
		if (type == SdkMgr.extDataType_5) {
			return;
		}
		var roleInfo: any = new Object();
		roleInfo.isCreateRole = type == SdkMgr.extDataType_2 ? true : false;//仅创建角色时传true,更新信息时传false
		roleInfo.roleCreateTime = SdkMgr.createTime;//角色创建时间
		roleInfo.uid = StartGetUserInfo.uid2 + "";//渠道UID
		roleInfo.username = QuickH5SDK.username;//渠道username
		roleInfo.serverId = GameServer.serverID;//区服ID
		roleInfo.serverName = GameServer.serverName + '';//区服名称
		roleInfo.userRoleId = GameLogic.ins().actorModel.actorID + "";//游戏角色
		roleInfo.userRoleName = GameLogic.ins().actorModel.name;//游戏内角色ID
		roleInfo.userRoleBalance = GameLogic.ins().actorModel.yb;//角色游戏内货币余额
		roleInfo.vipLevel = GameLogic.ins().actorModel.vipLv;//角色VIP等级
		roleInfo.userRoleLevel = GameLogic.ins().actorModel.level;//角色等级
		roleInfo.partyId = GameLogic.ins().actorModel.guildID;//	公会/社团ID
		roleInfo.partyName = GameLogic.ins().actorModel.guildName; //	公会/社团名称
		roleInfo.gameRoleGender = '';//角色性别
		roleInfo.gameRolePower = GameLogic.ins().actorModel.power;//角色战力
		roleInfo.partyRoleId = 1;//角色在帮派中的ID
		roleInfo.partyRoleName = '';//角色在帮派中的名称
		roleInfo.professionId = '';//	角色职业ID
		roleInfo.profession = '';//角色职业名称
		roleInfo.friendlist = '';//	角色好友列表
		roleInfo.roleCreateTime = SdkMgr.createTime;

		var roleInfoJson = JSON.stringify(roleInfo);
		// alert("上报日志" + roleInfoJson);
		window["QuickSDK"].uploadGameRoleInfo(roleInfoJson, function (response) {
			if (response.status) {
				egret.log("提交信息成功");
			} else {
				egret.log(response.message);
			}
		});
	}
}
window["QuickH5SDK"] = QuickH5SDK