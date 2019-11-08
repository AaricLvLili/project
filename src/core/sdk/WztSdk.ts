namespace h5_sdk {
	/** 威震天聚合*/
	export class Sdk_1 extends BaseClass {
		public constructor() {
			super();
		}

		public static ins(): Sdk_1 {
			return super.ins();
		}

		public getParam_1(): void {
			egret.log("调用sdk登录");
			window["WZTSDK"].login(function (param) {
				egret.log("收到参数》》》" + param);
				Sdk_1.ins().loginSucceed(param);
			}, this.quitCall);
			window["lockResult"] = this.lockResult;//监听音乐锁屏通知
		}
		/** 退出登录*/
		public loginOut_1(): void {
			window["WZTSDK"].func();
			egret.log("退出");
		}
		private loginSucceed(param): void {
			var s: string = '';
			var data: any = JSON.parse(param);
			// egret.log("参111数" + param);
			for (var key in data) {
				s += key + "=" + data[key] + "&";
			}
			egret.log(data);
			s += "tag=" + LocationProperty.urlParam["tag"];
			s += "&auditServer=" + LocationProperty.urlParam["auditServer"];
			StartGetUserInfo.urlData = s;
			SdkMgr.sendServerUrl();
		}

		private lockResult(result): void {
			// if (typeof (result) == 'string') {
			// 	if (result == "false")
			// 		SoundManager.ins().stopBg();
			// 	else
			// 		SoundManager.ins().playBg("bg_mp3");

			// }
			// else if (typeof (result) == 'boolean' && !result) {
			// 	if (!result)
			// 		SoundManager.ins().stopBg();
			// 	else
			// 		SoundManager.ins().playBg("bg_mp3");
			// }
			if (typeof (result) == 'string') {
				if (result == "false")
					// SoundManager.ins().stopBg();
					SoundUtils.getInstance().stopSoundByID(1);
				else
				// SoundManager.ins().playBg("bg_mp3");
				{
					let isPlay = SoundSetPanel.getSoundLocalData("soundBg");
					if (isPlay)
						SoundUtils.getInstance().playSound(1);
				}

			}
			else if (typeof (result) == 'boolean' && !result) {
				if (!result)
					// SoundManager.ins().stopBg();
					SoundUtils.getInstance().stopSoundByID(1);
				else
				// SoundManager.ins().playBg("bg_mp3");
				{
					let isPlay = SoundSetPanel.getSoundLocalData("soundBg");
					if (isPlay)
						SoundUtils.getInstance().playSound(1);
				}
			}


		}

		/** 用户退出监听用户中途退出会监听*/
		private quitCall(status): void {
			alert("退出" + status);
			if (status == 'success') {
				//成功
				window.location.reload();
			} else {
				//失败
			}
		}


		/** 支付*/
		public pay_1(o: SdkParam): void {
			if (SdkMgr.tag == "bsymx_baoyu_ppl_android") {
				WarnWin.show("本次测试暂未开放充值系统", null, this);
				return;
			}

			var tempObj: any = {};
			var nowDate = new Date().getTime();
			tempObj.serverid = GameServer.serverID;
			tempObj.goodsid = o.goodsId;
			tempObj.amount = o.amount;
			tempObj.uid = StartGetUserInfo.uid;
			tempObj.tag = LocationProperty.urlParam["tag"];
			tempObj.timestamp = nowDate;
			tempObj.auditServer = LocationProperty.urlParam["auditServer"];
			var byt: egret.ByteArray = new egret.ByteArray();
			var s = JSON.stringify(tempObj);
			byt.writeUTFBytes(s);

			let payment: any = {};
			payment.billno = SdkMgr.uuid(18, 16);	// billno	订单号	否	查看备注
			payment.amount = o.amount; // amount	订单金额	是	查看备注

			var subject: string = "";
			var idx = o.subject.indexOf("=");
			if (idx != -1) {
				subject = o.subject.substr(0, idx) + "获得" + o.subject.substr(idx + 1, o.subject.length);
			}
			else {
				subject = o.subject;
			}

			var desc: string = "";
			idx = o.desc ? o.desc.indexOf("=") : -1;
			if (idx != -1) {
				desc = o.desc.substr(0, idx) + "获得" + o.desc.substr(idx + 1, o.desc.length);
			}
			else {
				desc = o.desc;
			}

			payment.subject = subject; // subject	订单主题	否	钻石
			if (LocationProperty.urlParam["iosid"] != null) {
				if (LocationProperty.urlParam["tag"] != null && LocationProperty.urlParam["tag"] == "wdws_lezhong_dataeye_ios_cqtlby") {
					payment.productId = payment.iosPayId = LocationProperty.urlParam["iosid"] + o.amount;
				} else {
					payment.productId = payment.iosPayId = LocationProperty.urlParam["iosid"] + o.amount + "0";
				}
			}
			else {
				payment.productId = payment.iosPayId = o.goodsId; // iosPayId	Ios商品id 见附表	IOS商品id 如果不走苹果内购不用填写 ，安卓为空即可	112
			}
			payment.extraInfo = egret.Base64Util.encode(byt.buffer); // extraInfo	额外参数	否	自定义
			payment.uid = StartGetUserInfo.uid; // uid	用户信息	是	查看备注
			payment.isTest = "";// isTest	是否测试	否	“”：正式1：测试
			// payment.roleid = GameLogic.ins().actorModel.actorID; // roleid	角色id	否	111
			payment.rolename = GameLogic.ins().actorModel.name; // rolename	角色名	否	手游谷
			payment.rolelevel = GameLogic.ins().actorModel.level; // rolelevel	角色等级	否	9999
			payment.serverid = GameServer.serverID; // serverid	服务器id	否	鲸旗
			payment.cpOrderNo = SdkMgr.uuid(18, 16) + '';//游戏内的订单,服务器通知中会回传
			payment.productDesc = o.desc ? desc : subject;
			payment.roleID = GameLogic.ins().actorModel.actorID;
			payment.vip = GameLogic.ins().actorModel.vipLv;
			payment.coinNum = GameLogic.ins().actorModel.yb;
			egret.log(JSON.stringify(payment));
			window["WZTSDK"].pay(payment, (result) => {
				egret.log("支付状态》" + result);
			});
		}

		/** 信息上报
		 * 
		 * @param  type 1进入服器2创建用户角色3玩家升级4角色改名5选服页面
		*/
		public setExtData_1(type: number): void {
			let extData: any = {};

			extData.scene_Id = type;
			extData.roleId = GameLogic.ins().actorModel.actorID; // roleId	角色id	否	112
			extData.roleName = GameLogic.ins().actorModel.name; // roleName	角色名	否	手游谷
			extData.roleLevel = GameLogic.ins().actorModel.level; // roleLevel	角色等级	否	99
			extData.zoneId = GameServer.serverID; // zoneId	服务器id	否	1
			extData.zoneName = GameServer.serverID + "区"; // zoneName	服务器名称	否	剑魂
			extData.balance = GameLogic.ins().actorModel.yb; // balance	游戏币余额	是	12
			extData.vip = GameLogic.ins().actorModel.vipLv ? GameLogic.ins().actorModel.vipLv : 0; // Vip	Vip等级	否	1
			extData.partyName = GameLogic.ins().actorModel.guildName != "" ? GameLogic.ins().actorModel.guildName : "无"; // partyName	所属公会	是	醉江湖
			extData.roleCtiem = SdkMgr.createTime; // roleCtiem	创建角色时间	是	21322222
			extData.roleLeveMTimE = GameServer._serverTime; // roleLeveMTimE	角色等级变化时间	是	54456588
			extData.coinNum = GameLogic.ins().actorModel.yb;

			window["WZTSDK"].setExtData(extData);
		}
	}

	/** quick聚合*/
	export class Sdk_2 extends BaseClass {
		public constructor() {
			super();
		}

		public static ins(): Sdk_2 {
			return super.ins();
		}

		private readonly productCode: string = "99936258951302565905224499833313";
		private readonly productKey: string = "21684263";

		/** 解析平台返回参数*/
		public getParam_2(): void {
			StartGetUserInfo.urlData = "token=" + LocationProperty.urlParam["token"] + "&tag=" + LocationProperty.urlParam["tag"];
			SdkMgr.sendServerUrl();
			egret.log("调用服务器");
			// this.sdkLogin();
		}

		public initSkd_2(): void {
			egret.log(this);
			egret.log(this.productCode);
			egret.log("channelId" + StartGetUserInfo.channelId2);
			window["QuickSDK"].init(this.productCode, this.productKey, true, StartGetUserInfo.channelId2);
		}

		private info: any;

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
					}

					StartGetUserInfo.urlData = s.substr(0, s.length - 1);
					SdkMgr.sendServerUrl();
					StartGetUserInfo.uid = callbackData.data.uid;
					Sdk_2.ins().info = callbackData.data;

					window["QuickSDK"].setSwitchAccountNotification(function (callbackData) {//切换账号注册
						window.location.reload();
						// egret.log("切换账号注册");
					});

					window["QuickSDK"].setLogoutNotification(function (logoutObject) {
						// console.log('Game:玩家点击注销帐号');
						window.location.reload();
					})// 注册退出接口

				} else {
					Sdk_2.ins().sdkLogin();
					// message = 'GameDemo:QuickSDK登录失败:' + callbackData.message;	
				}
			});
		}


		/** 购买支付*/
		public pay_2(data: SdkParam): void {
			let tempObj: any = {};//通过json格式透传给服务器
			tempObj.serverid = GameServer.serverID + '';
			tempObj.goodsid = data.goodsId + '';
			tempObj.amount = data.amount + '';
			tempObj.tag = LocationProperty.urlParam["tag"];

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
			orderInfo.userRoleId = GameLogic.ins().actorModel.actorID + ""; //游戏内角色ID
			orderInfo.userRoleName = GameLogic.ins().actorModel.name + '';
			orderInfo.userServer = GameServer.serverID + '区';//角色所在区服
			orderInfo.userLevel = GameLogic.ins().actorModel.level;//角色等级
			orderInfo.cpOrderNo = SdkMgr.uuid(18, 16) + '';//游戏内的订单,服务器通知中会回传
			orderInfo.amount = data.amount + '';//购买金额
			orderInfo.subject = subject;//data.subject;//道具名称
			orderInfo.desc = '';//道具描述
			orderInfo.callbackUrl = '';
			orderInfo.extrasParams = egret.Base64Util.encode(byt.buffer) + '';//透传参数,服务器通知中原样回传
			orderInfo.goodsId = data.goodsId + '';
			orderInfo.count = 1;
			orderInfo.quantifier = '个';

			var orderInfoJson = JSON.stringify(orderInfo);
			// egret.log(orderInfoJson);
			// alert(orderInfoJson);
			window["QuickSDK"].pay(orderInfoJson, function (payStatusObject) {
				egret.log('GameDemo:下单通知' + JSON.stringify(payStatusObject));
			});
		}

		/** 上传角色信息接口*/
		public setExtData_2(type: number): void {
			var roleInfo: any = new Object();
			roleInfo.isCreateRole = type == SdkMgr.extDataType_2 ? true : false;//仅创建角色时传true,更新信息时传false
			roleInfo.roleCreateTime = SdkMgr.createTime;//角色创建时间
			roleInfo.uid = StartGetUserInfo.uid2 + "";//渠道UID
			roleInfo.username = StartGetUserInfo.username2;//渠道username
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
			roleInfo.partyRoleId = 1;//角色在公会中的ID
			roleInfo.partyRoleName = '';//角色在公会中的名称
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

	/** 玩吧*/
	export class Sdk_3 extends BaseClass {
		public constructor() {
			super();
		}

		public static ins(): Sdk_3 {
			return super.ins();
		}

		private openid;
		private openkey;
		private platform;
		private pf;
		private order;
		/** 解析平台返回参数*/
		public getParam_3(): void {
			egret.log("调用服务器");

			window["__paySuccess"] = Sdk_3.ins().paySuccess;
			window["__payError"] = Sdk_3.ins().payError;
			window["__payClose"] = Sdk_3.ins().payClose;//   //关闭对话框执行,IOS下无效

			window["getOpenKey"]((d) => {//处理登录函数
				if (d.code != 0) return;
				SdkMgr.appid = d.data.appid;
				this.openid = d.data.openid;
				this.openkey = d.data.openkey;

				StartGetUserInfo.uid = this.openid
				StartGetUserInfo.pwd = this.openkey;

				this.platform = window["OPEN_DATA"].platform;//Number 平台，2-IOS，1-安卓
				this.pf = window["OPEN_DATA"].pf;//用户平台来源，用于OpenAPI接口。pf的值为wanba_ts：用户来自手机QQ或手机QQ空间，pf的值为weixin：用户来自微信。关于pf的详细用法，可以参见：如何使用pf值。

				let str = JSON.stringify(d);
				egret.log("参数》" + str);

				var urlParam = "openid=" + this.openid + "&openkey=" + this.openkey + "&pf=" + this.pf + "&tag=wdws_tanggu_h5_wanba&zoneid=" + this.platform;
				SdkMgr.requestPhpLogin(urlParam);
			});

			var mqq = window["mqq"];
			//分享设置
			mqq.invoke('ui', 'setOnShareHandler', function (type) {
				egret.log("type===" + type + "app=" + window["OPEN_DATA"].qua.app);
				if (window["OPEN_DATA"].qua.app == "SQ" && type == 0) {//必选：是
					// 说明：用户点击的分享类型
					// 0：QQ好友；
					// 1：QQ空间；
					// 2：微信好友；
					// 3：微信朋友圈
					mqq.ui.shareArkMessage({
						title: '《万道武神》游戏分享',
						desc: '仙侠ARPG挂机游戏，魔幻仙侠与战斗融为一体；嗜血PK、王者荣耀、夺旗等创新玩法',
						share_url: window["OPEN_DATA"].shareurl,
						image_url: 'https://wdwsfile.h5aiwan.com/wdws2/resource/assets/atlas2_ui/denglu/share_wdws.png',
						back: true
					}, function (result) {
						//result
						// 					0 -- 用户点击发送，完成整个分享流程
						// 1 -- 用户点击取消，中断分享流程
						egret.log("状态返回" + result);
						egret.log(result);
						if (result.retCode == 0) {
							egret.log("shareArkMessage分享成功");
							this.shareRewardreq();
						}
					});
				}
				else {
					mqq.invoke('ui', 'shareMessage', {
						title: '《万道武神》H5游戏分享',
						desc: '仙侠ARPG挂机游戏，魔幻仙侠与战斗融为一体；嗜血PK、王者荣耀、夺旗等创新玩法',
						share_type: type,
						share_url: window["OPEN_DATA"].shareurl,
						image_url: window["OPEN_DATA"].appicon,
						back: true
					}, function (result) {
						if (result && result.retCode == 0) {
							// UserTips.ins().showTips("分享成功");
							// egret.log("分享成功");
							this.shareRewardreq();
						} else {
							// UserTips.ins().showTips("分享取消");
							// egret.log("分享取消");
						}
					});
				}
			});
		}

		/** 分享*/
		public share_3(): void {
			egret.log("分享");
			var mqq = window["mqq"];
			mqq.ui.showShareMenu();
			if (1 == 1) return;
			//拉起分享菜单
			//拉起分享菜单
			if (window["OPEN_DATA"].qua.app == "SQ") {// 手机QQ、手机QQ空间或微信：SQ-手Q，QZ-手空，WX-微信，QQLive-腾讯视频
				mqq.ui.shareArkMessage({
					title: '《万道武神》游戏分享',
					desc: '仙侠ARPG挂机游戏，魔幻仙侠与战斗融为一体；嗜血PK、王者荣耀、夺旗等创新玩法',
					share_url: window["OPEN_DATA"].shareurl,
					image_url: "https://wdwsfile.h5aiwan.com/wdws2/resource/assets/atlas2_ui/denglu/share_wdws.png",
					back: true
				}, function (result) {
					//result
					// 					0 -- 用户点击发送，完成整个分享流程
					// 1 -- 用户点击取消，中断分享流程
					egret.log("状态返回" + result);
					egret.log(result);
					if (result.retCode == 0) {
						egret.log("shareArkMessage分享成功");
						this.shareRewardreq();
					}
				});
			}
			else {
				mqq.ui.showShareMenu();
			}
		}

		public pay_3(o: SdkParam): void {
			this.order = o;
			var payUrl = "https://wdws2-api.h5aiwan.com/api/wdws/lezhongTwo/wanbaPay?zoneid=" + this.platform +
				"&openid=" + this.openid + "&openkey=" + this.openkey + "&pf=" + this.pf + "&tag=wdws_tanggu_h5_wanba" + "&goodsid=" +
				this.order.goodsId + "&money=" + this.order.amount + "&serverid=" + GameServer.serverID;
			var request = new egret.HttpRequest();
			request.responseType = egret.HttpResponseType.TEXT;
			request.open(payUrl, egret.HttpMethod.GET);
			request.send();
			request.addEventListener(egret.Event.COMPLETE, this.requestpayComplete, this);
			egret.log("请求phppay>" + payUrl);
		}

		public setExtData_3(type: number): void {
		}

		/**分享奖励领取请求*/
		private shareRewardreq(): void {
			let req = new Sproto.cs_wanba_share_use_request;
			GameSocket.ins().Rpc(C2sProtocol.cs_wanba_share_use, req, this.shareRewardResult, this)
		}

		/**分享奖励领取返回*/
		private shareRewardResult(bytes: Sproto.cs_wanba_share_use_response): void {
			if (bytes.ret == 0)//等于0是成功
			{
				UserTips.ins().showTips("领取奖励成功");
			}
		}
		/** 返回付款结果*/
		private requestpayComplete(e: egret.Event): void {
			var request = <egret.HttpRequest>e.currentTarget;
			request.removeEventListener(egret.Event.COMPLETE, this.requestpayComplete, this);
			egret.log("支付返回" + request.response);
			var jsonObj: any = JSON.parse(request.response);

			if (jsonObj.code == 2) {
				egret.log("支付----");
				window["popPayTips"]({
					version: 'v2',
					defaultScore: parseInt(this.order.amount) * 10,//购买失败星币不足返回 通知前端应当充值的星币
					appid: SdkMgr.appid
				});
			}
			else if (jsonObj.code == 200) {
				UserTips.ins().showTips("购买商品成功");
				this.order = null;
			} else if (jsonObj.code == 4) {
				UserTips.ins().showTips("发货失败");
				this.order = null;
			} else if (jsonObj.code == 3) {
				UserTips.ins().showTips("购买失败");
				this.order = null;
			}
		}

		public paySuccess() {
			egret.log("支付成功!");
			UserTips.ins().showTips("您已充值成功");
			this.pay_3(this.order);
		}

		public payError() {
			// alert("支付失败");
			WarnWin.show(TextFlowMaker.generateTextFlow("支付失败"), () => {
				// ViewManager.ins().open(ChargeFirstWin)
			}, this, null, null, "sure", {
					btnName: "确定",
					title: "L温馨提示R"
				})
		}

		public payClose() {//关闭对话框：提示用户已取消支付，iOS在使用苹果支付时，取消支付__payClose回调不会执行
			// alert("已取消支付");
			// UserTips.ins().showTips("已取消支付");
			WarnWin.show(TextFlowMaker.generateTextFlow("已取消支付"), () => {
				// ViewManager.ins().open(ChargeFirstWin)
			}, this, null, null, "sure", {
					btnName: "确定",
					title: "L温馨提示R"
				})
		}

		/** 收藏*/
		public collection_3(): void {
			egret.log("请求收藏");
			var mqq = window["mqq"];
			mqq.ui.addShortcut({
				action: 'web',
				title: '万道武神',
				icon: "https://wdwsfile.h5aiwan.com/wdws2/resource/assets/atlas2_ui/denglu/share_wdws.png",
				url: window["OPEN_DATA"].jumpurl,
				callback: function (ret) { }
			});
			let req = new Sproto.cs_channel_share_use_request;
			req.shareType = 3;
			GameSocket.ins().Rpc(C2sProtocol.cs_channel_share_use, req, function (bytes: Sproto.cs_channel_share_use_response) {

				var str: string = "";
				if (bytes.ret == 0) {//0. 领取成功 1.领取过了
					str = "领取收藏成功，奖励已经发送到邮件！";
				}
				else
					str = "您已经领取过收藏奖励，不再发送奖励！";

				WarnWin.show(TextFlowMaker.generateTextFlow(str), () => {
					// ViewManager.ins().open(ChargeFirstWin)
				}, this, null, null, "sure", {
						btnName: "确定",
						title: "L温馨提示R"
					})
			}, this);

		}
	}

	/** quick(安卓）*/
	export class Sdk_4 extends BaseClass {
		public constructor() {
			super();
		}

		public static ins(): Sdk_4 {
			return super.ins();
		}

		private productCode: string = '76407950625787305789811613324862';        //QuickSDK后台自动分配
		private productKey: string = '41210726';        //QuickSDK后台自动分配
		public info: any;

		public getParam_4(): void {
			window["QuickSDK"].init(this.productCode, this.productKey, true);

			window["QuickSDK"].login(function (callbackData) {
				var message;
				if (callbackData.status) {
					message = 'GameDemo:QuickSDK登录成功: uid=>' + callbackData.data.uid;
					// alert(message);
					var s: string = '';
					for (var key in callbackData.data) {
						s += key + "=" + callbackData.data[key] + "&";
					}
					StartGetUserInfo.urlData = s + "&tag=" + LocationProperty.urlParam["tag"];
					SdkMgr.sendServerUrl();
					Sdk_4.ins().info = callbackData.data;

					egret.log("初始化sdk");
					window["QuickSDK"].setSwitchAccountNotification(function (callbackData) {//切换账号注册
						window.location.reload();
						// egret.log("切换账号注册");
					});

					window["QuickSDK"].setLogoutNotification(function (logoutObject) {
						// console.log('Game:玩家点击注销帐号');
						window.location.reload();
					})//
				} else {
					message = 'GameDemo:QuickSDK登录失败:' + callbackData.message;
				}
			});
		}


		/** 购买支付*/
		public pay_4(data: SdkParam): void {
			let tempObj: any = {};//通过json格式透传给服务器
			tempObj.serverid = GameServer.serverID + '';
			tempObj.goodsid = data.goodsId + '';
			tempObj.amount = data.amount + '';
			tempObj.tag = LocationProperty.urlParam["tag"];

			var byt: egret.ByteArray = new egret.ByteArray();
			var s = JSON.stringify(tempObj);
			byt.writeUTFBytes(s);

			var orderInfo: any = {};
			orderInfo.productCode = "04943838744090570821883811669650";//QuickSDK后台自动分配的参数
			orderInfo.uid = Sdk_4.ins().info.uid + '';//渠道UID
			orderInfo.userRoleName = GameLogic.ins().actorModel.name + '';
			orderInfo.userRoleId = GameLogic.ins().actorModel.actorID + ""; //游戏内角色ID
			orderInfo.serverId = GameServer.serverID + "";
			orderInfo.userServer = GameServer.serverID + '区';//角色所在区服
			orderInfo.userLevel = GameLogic.ins().actorModel.level;//角色等级
			orderInfo.cpOrderNo = SdkMgr.uuid(18, 16) + "";//游戏内的订单,服务器通知中会回传
			orderInfo.amount = data.amount + '';//购买金额
			orderInfo.count = 1;//购买商品个数
			orderInfo.subject = data.subject;//道具名称
			orderInfo.desc = '';//道具描述
			orderInfo.callbackUrl = '';//服务器通知地址
			orderInfo.extrasParams = egret.Base64Util.encode(byt.buffer);;//透传参数,服务器通知中原样回传
			orderInfo.goodsId = data.goodsId + '';//商品ID
			orderInfo.quantifier = '个';//购买商品单位，如，个

			var orderInfoJson = JSON.stringify(orderInfo);
			egret.log(orderInfoJson);
			window["QuickSDK"].pay(orderInfoJson, function (payStatusObject) {
				egret.log('GameDemo:下单通知' + JSON.stringify(payStatusObject));
			});
		}

		/** 上传角色信息接口*/
		public setExtData_4(type: number): void {
			var roleInfo: any = new Object();
			roleInfo.isCreateRole = type == SdkMgr.extDataType_2 ? true : false;//仅创建角色时传true,更新信息时传false
			roleInfo.roleCreateTime = SdkMgr.createTime;//角色创建时间
			roleInfo.uid = Sdk_4.ins().info.uid;//渠道UID
			roleInfo.username = Sdk_4.ins().info.username;//渠道username
			roleInfo.serverId = GameServer.serverID + "";//区服ID
			roleInfo.serverName = GameServer.serverID + '区';//区服名称
			roleInfo.userRoleId = GameLogic.ins().actorModel.actorID + "";//游戏角色
			roleInfo.userRoleName = GameLogic.ins().actorModel.name;//游戏内角色ID
			roleInfo.userRoleBalance = GameLogic.ins().actorModel.yb + "";//角色游戏内货币余额
			roleInfo.vipLevel = GameLogic.ins().actorModel.vipLv + "";//角色VIP等级
			roleInfo.userRoleLevel = GameLogic.ins().actorModel.level + "";//角色等级
			roleInfo.partyId = GameLogic.ins().actorModel.guildID + "";//	公会/社团ID
			roleInfo.partyName = GameLogic.ins().actorModel.guildName; //	公会/社团名称
			roleInfo.gameRoleGender = '';//角色性别
			roleInfo.gameRolePower = GameLogic.ins().actorModel.power + "";//角色战力
			roleInfo.partyRoleId = "";//角色在公会中的ID
			roleInfo.partyRoleName = '';//角色在公会中的名称
			roleInfo.professionId = '';//	角色职业ID
			roleInfo.profession = '';//角色职业名称
			roleInfo.friendlist = '';//	角色好友列表

			var roleInfoJson = JSON.stringify(roleInfo);
			// alert("上报日志" + roleInfoJson);
			window["QuickSDK"].uploadGameRoleInfo(roleInfoJson, function (response) {
				if (response.status) {
					egret.log("提交信息成功");
					// document.getElementById('uploadMessage').innerHTML = '提交信息成功';
				} else {
					egret.log(response.message);
					// document.getElementById('uploadMessage').innerHTML = response.message;
				}
			});
		}

	}


	/** 掌盟（内部测试专用）*/
	export class Sdk_5 extends BaseClass {
		public constructor() {
			super();
		}

		public static ins(): Sdk_5 {
			return super.ins();
		}

		private info: any;
		private payObj: any;
		public getParam_5(): void {
			var s: string = "";
			for (var key in LocationProperty.urlParam) {
				s += key + "=" + LocationProperty.urlParam[key] + "&";
			}
			this.info = window["ZmSdk"].getInstance().getUserInfo();
			if (s != null) {
				for (key in this.info.userdata) {
					s += key + "=" + this.info.userdata[key] + "&";
				}
			}
			// s += "userdata="+JSON.stringify(this.info.userdata);
			StartGetUserInfo.urlData = s.substr(0, s.length - 1);
			SdkMgr.sendServerUrl();
		}


		public pay_5(o: SdkParam): void {
			var request = new egret.HttpRequest();
			request.responseType = egret.HttpResponseType.TEXT;
			request.open(Const.SERVER_LIST_URL + "api/wdws/soeasy/createH5PaySign?feeid=" + o.goodsId + "&fee=" + parseInt(o.amount) + "&serverid=" + GameServer.serverID + "&goods_id=" + o.goodsId, egret.HttpMethod.GET);
			request.send();
			request.addEventListener(egret.Event.COMPLETE, this.sendServerSign, this);

			let tempObj: any = {};//通过json格式透传给服务器
			tempObj.serverid = GameServer.serverID + '';
			tempObj.goodsid = o.goodsId + '';
			tempObj.tag = LocationProperty.urlParam["tag"];
			var byt: egret.ByteArray = new egret.ByteArray();
			var s = JSON.stringify(tempObj);
			byt.writeUTFBytes(s);

			let obj: any = {};
			obj.fee = parseInt(o.amount);//* 100;//必填 金额 分
			obj.feeid = o.goodsId + ""; //" 必填 cp 方自定义的计费 id ,
			obj.feename = o.subject;//必填商品名字,"
			obj.extradata = egret.Base64Util.encode(byt.buffer);//透传参数 支付回调通知时会带给cp",
			obj.serverid = GameServer.serverID + "";//游戏分区号",
			obj.rolename = GameLogic.ins().actorModel.name;//"角色 名称",
			obj.roleid = GameLogic.ins().actorModel.actorID + "";;//角色 ID",
			obj.servername = GameServer.serverID + "区";//分区服名称
			this.payObj = obj;
		}

		/** 服务器返回支付签名*/
		private sendServerSign(e: egret.Event): void {
			var request = <egret.HttpRequest>e.currentTarget;
			request.removeEventListener(egret.Event.CONNECT, this.sendServerSign, this);
			let jsonObj = JSON.parse(request.response);
			// jsonObj = JSON.parse(jsonObj.data);
			this.payObj.check = jsonObj.data.sign;

			window["ZmSdk"].getInstance().pay(this.payObj, this.onPayCallBackFn);
		}
		/** 支付回调
		 * 
		 * 	// onPayCallBackFn(data):支付回调
			//  data.retcode 0 成功 1 失败 2 取消 3 跳转到了支付界面或渠道不支持
			//  data.msg 支付描述
			// 说明：该方法用于道具付费。必选接口，md5 中“+”不参与加密。
			// check=md5(fee+feeid+seceret_key) 加密必须在服务端完成。
			// 关于 serverid、rolename、roleid、servername，rolelevel 是渠道要求，并非速易平台要求
			// 上报。（code 返回-5 表示 check 值加密不正确）
		*/
		private onPayCallBackFn(data): void {
			egret.log(data.retcode + "msg==" + data.msg);
		}

		/** 上传角色信息接口*/
		public setExtData_5(type: number): void { }
	}

	/**千熙玩SDK */
	export class Sdk_6 extends BaseClass {
		public constructor() {
			super();
		}

		public static ins(): Sdk_6 {
			return super.ins();
		}
		/** 解析平台返回参数*/
		public getParam_6(): void {
			let shareParams = {
				shareTitle: "幻想勇者",
				shareImg: "https://h5game.qianxiyou.com/minigame/images/huangxiangyongzhe/icon.png"
			}
			let params = {
				isLandscape: false,
				dubug: false,
				shareInfo: shareParams
			}
			window["gameSDK"].init(params).then(res => {
				console.log("小游戏初始化结果" + res);
				if (res.statusCode == 0) {
					this.login();
				}
			});
			setTimeout(function () {
				window["gameSDK"].on('flymeChangeAccount', function (res) {
					console.log('成功调用listen:flymeChangeAccount:', res)
					window["gameSDK"].changeAccount().then(function (res) {
						console.log('成功调用changeAccount:', res)
						window.location.reload();
					})
				}, true)
			}, 1000)
		}
		// 登录
		private login(): void {

			window["gameSDK"].login().then(function (res) {
				console.log('登录成功：', res)
				if (res.statusCode == 0) {

					var s: string = "";
					for (var key in res.loginParams) {
						s += key + "=" + res.loginParams[key] + "&";
					}
					s += "tag=" + SdkMgr.tag;
					StartGetUserInfo.urlData = s;
					SdkMgr.sendServerUrl();

				} else {
					window.location.reload();
				}
			})

		}
		/** 购买支付*/
		public pay_6(data: SdkParam): void {
			let tempObj: any = {};//通过json格式透传给服务器
			tempObj.serverid = GameServer.serverID + '';
			tempObj.goodsid = data.goodsId + '';
			tempObj.amount = data.amount + '';
			tempObj.tag = LocationProperty.urlParam["tag"];
			tempObj.uid = StartGetUserInfo.uid;
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

			byt.writeUTFBytes(s);
			let payParams = {
				amount: data.amount + "00",
				cpProductId: data.goodsId,
				productName: data.subject,
				callbackURL: Const.SERVER_LIST_URL + 'api/bsymx/daqian/h5Pay',
				callbackInfo: egret.Base64Util.encode(byt.buffer),
				serverId: GameServer.serverID,
				serverName: GameServer.serverName + "区",
				roleName: GameLogic.ins().actorModel.name,
				roleId: GameLogic.ins().actorModel.actorID + "",
				rate: 100,
				roleLevel: GameLogic.ins().actorModel.level,
				sociaty: GameLogic.ins().actorModel.guildName,
				lastMoney: GameLogic.ins().actorModel.yb + "",
				vipLevel: GameLogic.ins().actorModel.vipLv,
			}

			window["gameSDK"].recharge(payParams).then(function (res) {
				console.log('充值：', res)
			})
		}

		/** 上传角色信息接口*/
		public setExtData_6(type: number): void {
			let param = {
				"roleId": GameLogic.ins().actorModel.actorID + "",//游戏角色
				"roleName": GameLogic.ins().actorModel.name,
				"roleLevel": GameLogic.ins().actorModel.level,
				"serverId": GameServer.serverID,
				"serverName": GameServer.serverName + "区",
				"vipLevel": GameLogic.ins().actorModel.vipLv ? GameLogic.ins().actorModel.vipLv : "0",
				"userMoney": GameLogic.ins().actorModel.yb ? GameLogic.ins().actorModel.yb : "0",
				"roleCTime": SdkMgr.createTime,
				"gender": "",
				"professionId": "0",
				"profession": "",
				"power": GameLogic.ins().actorModel.power,//角色战力
				"partyid": GameLogic.ins().actorModel.guildID,///帮会id
				"partyname": GameLogic.ins().actorModel.guildName,////帮会名称
				"partyroleid": "0",
				"partyrolename": "",
				"payTotal": "",
				"roleLevelUpTime": type == SdkMgr.extDataType_3 ? GameServer._serverTime : "",////等级变化时间
				task_id: "",
				task_name: "",
				task_status: "",
				honor_id: "",
				honor_name: "",
			}
			egret.log("角色上报" + JSON.stringify(param));
			switch (type) {
				case SdkMgr.extDataType_1:///登录
					window["gameSDK"].changeRole(param).then(function (res) {
						console.log('切换角色登录：', res)
					})
					break;
				case SdkMgr.extDataType_2:///创角
					window["gameSDK"].createRole(param).then(function (res) {
						console.log('角色创建：', res)
					})
					break;
				case SdkMgr.extDataType_3:///等级变化
					window["gameSDK"].upgradeRole(param).then(function (res) {
						console.log('角色升级：', res)
					})
					break;
				case SdkMgr.extDataType_5:
					window["gameSDK"].slectServe().then(function (res) {
						console.log('选择服务器：', res)
					})
					break;
			}
		}
	}

	/**埃克斯幻想 quick聚合*/
	export class Sdk_7 extends BaseClass {
		public constructor() {
			super();
		}

		public static ins(): Sdk_7 {
			return super.ins();
		}

		private readonly productCode: string = "86526461240369773215048491299087";
		private readonly productKey: string = "64028630";

		/** 解析平台返回参数*/
		public getParam_7(): void {
			Const.BG_SERVER_URL = "https://ro-bg.h5aiwan.com/";
			QuickH5SDK.ins().getParam(this.productCode, this.productKey);
		}
		/** 购买支付*/
		public pay_7(data: SdkParam): void {
			QuickH5SDK.ins().pay(data);
		}

		/** 上传角色信息接口*/
		public setExtData_7(type: number): void {
			QuickH5SDK.ins().setExtData(type);
		}
	}

	/** 玩吧 趣乐多*/
	export class Sdk_8 extends BaseClass {
		public constructor() {
			super();
		}

		public static ins(): Sdk_8 {
			return super.ins();
		}

		public static openid;
		public static appid;
		public static openkey;
		public static platform;
		public static pf;
		public static order: any;
		/** 礼包id*/
		public static GIFT: any;// = "10005";
		/** 记录价格*/
		private static price: number;
		/** 一个状态，是否是通过购买调用(false 情况下，在调用一次购买)*/
		public static type: boolean = false;
		/** 解析平台返回参数*/
		public getParam_8(): void {
			SdkMgr.requestType = 1;
			egret.log("调用服务器");
			Sdk_8.GIFT = LocationProperty.urlParam["GIFT"];
			window["__paySuccess"] = Sdk_8.ins().paySuccess;
			window["__payError"] = Sdk_8.ins().payError;
			window["__payClose"] = Sdk_8.ins().payClose;//   //关闭对话框执行,IOS下无效

			window["getOpenKey"]((d) => {//处理登录函数
				if (d.code != 0) return;
				Sdk_8.appid = SdkMgr.appid = d.data.appid;
				Sdk_8.openid = d.data.openid;
				Sdk_8.openkey = d.data.openkey;

				StartGetUserInfo.uid = Sdk_8.openid
				StartGetUserInfo.pwd = Sdk_8.openkey;

				Sdk_8.platform = window["OPEN_DATA"].platform;//Number 平台，2-IOS，1-安卓
				Sdk_8.pf = window["OPEN_DATA"].pf;//用户平台来源，用于OpenAPI接口。pf的值为wanba_ts：用户来自手机QQ或手机QQ空间，pf的值为weixin：用户来自微信。关于pf的详细用法，可以参见：如何使用pf值。

				let str = JSON.stringify(d);
				egret.log("参数》" + str);
				StartGetUserInfo.urlData = Const.SERVER_LIST_URL + "get_player_serverinfo_qqwanba?openid=" + Sdk_8.openid
					+ "&openkey=" + Sdk_8.openkey
					+ "&pf=" + Sdk_8.pf
					+ "&zoneid=" + Sdk_8.platform
					+ "&appid=" + SdkMgr.appid;
				StartGetUserInfo.GetUserInfo();
			});

			var mqq = window["mqq"];
			//分享设置
			mqq.invoke('ui', 'setOnShareHandler', function (type) {
				egret.log("type===" + type + "app=" + window["OPEN_DATA"].qua.app);
				if (window["OPEN_DATA"].qua.app == "SQ" && type == 0) {//必选：是
					// 说明：用户点击的分享类型
					// 0：QQ好友；
					// 1：QQ空间；
					// 2：微信好友；
					// 3：微信朋友圈
					mqq.ui.shareArkMessage({
						title: '《苍元战记》游戏分享',
						desc: '超萌日系幻想MMO放置手游，邀您展开不思议冒险之旅！全民VIP即登即送！零氪金也能爽翻天！',
						share_url: window["OPEN_DATA"].shareurl,
						image_url: window["OPEN_DATA"].appicon,
						back: true
					}, function (result) {
						//result
						// 					0 -- 用户点击发送，完成整个分享流程
						// 1 -- 用户点击取消，中断分享流程
						egret.log("状态返回" + result);
						egret.log(result);
						if (result && result.retCode == 0) {
							egret.log("shareArkMessage分享成功");
							Sdk_8.ins().shareRewardreq();
						}
					});
				}
				else {
					mqq.invoke('ui', 'shareMessage', {
						title: '《苍元战记》H5游戏分享',
						desc: '超萌日系幻想MMO放置手游，邀您展开不思议冒险之旅！全民VIP即登即送！零氪金也能爽翻天！',
						share_type: type,
						share_url: window["OPEN_DATA"].shareurl,
						image_url: window["OPEN_DATA"].appicon,
						back: true
					}, function (result) {
						egret.log("状态返回" + result);
						egret.log(result);
						if (result && result.retCode == 0) {
							// UserTips.ins().showTips("分享成功");
							egret.log("分享成功");
							Sdk_8.ins().shareRewardreq();
						} else {
							// UserTips.ins().showTips("分享取消");
							egret.log("分享取消");
						}
					});
				}
			});
		}

		/** 分享*/
		public share_8(): void {
			egret.log("分享");
			var mqq = window["mqq"];
			mqq.ui.showShareMenu();
		}

		public pay_8(o: SdkParam): void {
			Sdk_8.order = o;
			var appid: any = SdkMgr.appid;
			let req = new Sproto.cs_buy_wanba_item_request();
			req.goodsid = o.goodsId; //商品ID
			req.zoneid = Sdk_8.platform;  //区服类型 区ID，用于区分用户是在哪一款平台下(Android、IOS等)，IOS填2，Android填1
			req.appid = appid;  //玩吧appid
			req.openid = Sdk_8.openid; 	//QQ号码转化得到的ID
			req.pf = Sdk_8.pf;   //玩吧 pf 值
			req.openkey = Sdk_8.openkey;
			if (parseInt(o.amount) == 1) {
				req.money = 1;  //商品价格
			}
			else {
				req.money = parseInt(o.amount);  //商品价格
			}
			GameSocket.ins().Rpc(C2sProtocol.cs_buy_wanba_item, req, this.rpcRspHandler, Sdk_8.ins());

		}
		public rpcRspHandler(bytes: Sproto.cs_buy_wanba_item_response): void {
			egret.log("ret=" + bytes.ret + ">>>type=" + Sdk_8.type + "price=" + bytes.price);
			if (bytes.ret == 1)//ret 	0 : integer # 状态码 0.购买成功 1.购买失败星币不足 客户端需要弹出充值对话框 2.缺少参数. 3.远程服务器操作失败。 
			{
				egret.log("支付----" + "appid" + SdkMgr.appid + "价格" + parseInt(Sdk_8.order.amount) * 10);
				window["popPayTips"]({
					version: 'v2',
					defaultScore: parseInt(Sdk_8.order.amount) * 10,//购买失败星币不足返回 通知前端应当充值的星币
					appid: SdkMgr.appid
				});
			}
			else if (bytes.ret == 0) {
				UserTips.ins().showTips("购买商品成功");
				// this.moXieExt(3, Sdk_11.order.amount);
				Sdk_8.order = null;
			}
		}
		// 1进入服器2创建用户角色3玩家升级4角色改名5选服页面
		public setExtData_8(type: number): void {
			egret.log("数据上报");
			if (type == 1) {
				window["reportLogin"]();
			}
			else if (type == 2) {
				window["reportRegister"]();
			}
		}

		/**分享奖励领取请求*/
		private shareRewardreq(): void {
			egret.log("分享请求")
			let req = new Sproto.cs_channel_share_use_request;
			req.shareType = 14;
			egret.log("分享请求" + req);
			GameSocket.ins().Rpc(C2sProtocol.cs_channel_share_use, req, function (bytes: Sproto.cs_channel_share_use_response) {
				var str: string = "";
				if (bytes.ret == 0) {//0. 领取成功 1.领取过了
					str = "领取分享成功，奖励已经发送到邮件！";
				}
				else
					str = "您已经领取过分享奖励，不再发送奖励！";

				WarnWin.show(TextFlowMaker.generateTextFlow(str), () => {
					// ViewManager.ins().open(ChargeFirstWin)
				}, this, null, null, "sure", {
						btnName: "确定",
						title: "L温馨提示R"
					})
			}, this);
		}
		/** 返回付款结果*/
		private requestpayComplete(e: egret.Event): void {
			var request = <egret.HttpRequest>e.currentTarget;
			request.removeEventListener(egret.Event.COMPLETE, this.requestpayComplete, this);
			egret.log("支付返回" + request.response);
			var jsonObj: any = JSON.parse(request.response);

			if (jsonObj.code == 2) {
				egret.log("支付----");
				window["popPayTips"]({
					version: 'v2',
					defaultScore: parseInt(Sdk_8.order.amount) * 10,//购买失败星币不足返回 通知前端应当充值的星币
					appid: SdkMgr.appid
				});
			}
			else if (jsonObj.code == 200) {
				UserTips.ins().showTips("购买商品成功");
				Sdk_8.order = null;
			} else if (jsonObj.code == 4) {
				UserTips.ins().showTips("发货失败");
				Sdk_8.order = null;
			} else if (jsonObj.code == 3) {
				UserTips.ins().showTips("购买失败");
				Sdk_8.order = null;
			}
		}

		public paySuccess() {
			egret.log("支付成功!");
			h5_sdk.Sdk_8.ins().pay_8(Sdk_8.order);
			egret.log("支付成功2");
			Sdk_8.type = true;


		}

		public payError() {
			// alert("支付失败");
			WarnWin.show(TextFlowMaker.generateTextFlow("支付失败"), () => {
				// ViewManager.ins().open(ChargeFirstWin)
			}, this, null, null, "sure", {
					btnName: "确定",
					title: "L温馨提示R"
				})
		}

		public payClose() {//关闭对话框：提示用户已取消支付，iOS在使用苹果支付时，取消支付__payClose回调不会执行
			// alert("已取消支付");
			// UserTips.ins().showTips("已取消支付");
			WarnWin.show(TextFlowMaker.generateTextFlow("已取消支付"), () => {
				// ViewManager.ins().open(ChargeFirstWin)
			}, this, null, null, "sure", {
					btnName: "确定",
					title: "L温馨提示R"
				})
		}

		/** 收藏*/
		public collection_8(): void {
			egret.log("请求收藏");
			var mqq = window["mqq"];
			mqq.ui.addShortcut({
				action: 'web',
				title: '苍元战记',
				icon: window["OPEN_DATA"].appicon,
				url: window["OPEN_DATA"].jumpurl,
				callback: function (ret) { }
			});
			let req = new Sproto.cs_channel_share_use_request;
			req.shareType = 13;
			GameSocket.ins().Rpc(C2sProtocol.cs_channel_share_use, req, function (bytes: Sproto.cs_channel_share_use_response) {

				var str: string = "";
				if (bytes.ret == 0) {//0. 领取成功 1.领取过了
					str = "领取收藏成功，奖励已经发送到邮件！";
				}
				else
					str = "您已经领取过收藏奖励，不再发送奖励！";

				WarnWin.show(TextFlowMaker.generateTextFlow(str), () => {
					// ViewManager.ins().open(ChargeFirstWin)
				}, this, null, null, "sure", {
						btnName: "确定",
						title: "L温馨提示R"
					})
			}, this);

		}
	}
	/**小7*/
	export class Sdk_9 extends BaseClass {
		public constructor() {
			super();
		}

		public static ins(): Sdk_9 {
			return super.ins();
		}

		private hgame: any;
		private game_key: string = "e078dedf41fbe074ca03e0b3989adf21";
		private updateObj: any;
		/** 解析平台返回参数*/
		public getParam_9(): void {
			this.hgame = new window["xqhGame"]();
			SdkMgr.requestType = 2;
			var s: string = '';
			for (var key in LocationProperty.urlParam) {
				s += key + "=" + LocationProperty.urlParam[key] + "&";
			}
			StartGetUserInfo.urlData = s + "tag=" + SdkMgr.tag;
			SdkMgr.sendServerUrl();

		}
		/** 购买支付*/
		public pay_9(data: SdkParam): void {
			// if (data.amount == "6") {
			// 	data.amount = "0.01";
			// }else{
			// 	data.amount="1";
			// }
			let tempObj: any = {};//通过json格式透传给服务器
			tempObj.serverid = GameServer.serverID + '';
			tempObj.goodsid = data.goodsId + '';
			tempObj.amount = data.amount + '';
			tempObj.tag = SdkMgr.tag;

			var byt: egret.ByteArray = new egret.ByteArray();
			var s = JSON.stringify(tempObj);
			byt.writeUTFBytes(s);

			var pay_obj: any = {};
			pay_obj.description = data.subject;
			pay_obj.extends_data = egret.Base64Util.encode(byt.buffer);//透传参数,服务器通知中原样回传
			pay_obj.game_area = GameServer.serverID;//角色所在区服
			pay_obj.game_group = GameServer.serverName;//区名
			pay_obj.game_key = this.game_key;
			pay_obj.game_level = GameLogic.ins().actorModel.level;//角色等级
			pay_obj.game_orderid = SdkMgr.uuid(18, 16) + "";//游戏内的订单,服务器通知中会回传
			pay_obj.game_price = data.amount;
			pay_obj.game_role_id = GameLogic.ins().actorModel.actorID + ""; //游戏内角色ID
			pay_obj.notify_id = "-1";
			pay_obj.subject = data.subject;//道具名称
			pay_obj.user_id = StartGetUserInfo.uid2;

			var s: string = "";
			for (var key in pay_obj) {
				s += key + "=" + pay_obj[key] + "&";
			}
			var request = new egret.HttpRequest();
			request.responseType = egret.HttpResponseType.TEXT;
			request.open(Const.SERVER_LIST_URL + "api/bsymx/baoyuzxdl/getPaySign?" + s.substr(0, s.length - 1), egret.HttpMethod.GET);
			request.send();
			request.addEventListener(egret.Event.COMPLETE, this.getPaySign, this);

		}
		private getPaySign(e: egret.Event): void {
			var request = <egret.HttpRequest>e.currentTarget;
			request.removeEventListener(egret.Event.CONNECT, this.getPaySign, this);
			let jsonObj = JSON.parse(request.response);
			jsonObj = jsonObj.data;

			var args: any = {};
			args.complete = this.payCallBack;
			args.pay_obj = jsonObj.pay_obj;
			this.hgame.pay(args);
		}
		private payCallBack(data): void {
			egret.log("支付" + data.errorno == "0" ? "成功" : data.complete);
		}
		/** 信息上报
			 * 
			 * @param  type 1进入服器2创建用户角色3玩家升级4角色改名5选服页面
			*/
		public setExtData_9(type: number): void {
			if (type == 2) {
				var args: any = {};
				args.game_key = this.game_key;
				args.user_id = StartGetUserInfo.uid2;
				args.role_name = GameLogic.ins().actorModel.name;
				args.game_area = GameServer.serverName;
				var s: string = "";
				for (var key in args) {
					s += key + "=" + args[key] + "&";
				}
				var url = Const.SERVER_LIST_URL + "api/bsymx/baoyuzxdl/getRoleSign?" + s.substr(0, s.length - 1);
				var request = new egret.HttpRequest();
				request.responseType = egret.HttpResponseType.TEXT;
				request.open(url, egret.HttpMethod.GET);
				request.send();
				request.addEventListener(egret.Event.COMPLETE, this.getUpdateSign, this);
				egret.log("创建" + url);
			}
		}
		private getUpdateSign(e: egret.Event): void {
			var request = <egret.HttpRequest>e.currentTarget;
			request.removeEventListener(egret.Event.CONNECT, this.getUpdateSign, this);
			let jsonObj = JSON.parse(request.response);

			jsonObj = jsonObj.data;
			var args: any = {};
			args = jsonObj.role_obj;
			args.complete = this.complete;
			this.hgame.game_role_callback(args);
		}
		private complete(data): void {
			egret.log(data.errorno == "0" ? "成功" : data.complete);
		}
	}

	/**暴雨疾风跳跃 quick聚合*/
	export class Sdk_10 extends BaseClass {
		public constructor() {
			super();
		}

		public static ins(): Sdk_10 {
			return super.ins();
		}

		private readonly productCode: string = "49618624822552987326879360917331";
		private readonly productKey: string = "20216465";

		/** 解析平台返回参数*/
		public getParam_10(): void {
			QuickH5SDK.ins().getParam(this.productCode, this.productKey);
		}
		/** 购买支付*/
		public pay_10(data: SdkParam): void {
			QuickH5SDK.ins().pay(data);
		}

		/** 上传角色信息接口*/
		public setExtData_10(type: number): void {
			QuickH5SDK.ins().setExtData(type);
		}

		public share_10(): void {
			window["qhsdk"].share();

			setTimeout(function () {
				let req = new Sproto.cs_channel_share_use_request;
				req.shareType = 14;
				egret.log("分享请求" + req);
				GameSocket.ins().Rpc(C2sProtocol.cs_channel_share_use, req, function (bytes: Sproto.cs_channel_share_use_response) {
					var str: string = "";
					if (bytes.ret == 0) {//0. 领取成功 1.领取过了
						str = "领取分享成功，奖励已经发送到邮件！";
					}
					else
						str = "您已经领取过分享奖励，不再发送奖励！";

					WarnWin.show(TextFlowMaker.generateTextFlow(str), () => {
						// ViewManager.ins().open(ChargeFirstWin)
					}, this, null, null, "sure", {
							btnName: "确定",
							title: "L温馨提示R"
						})
				}, this);

			}, 10000)

		}
	}

	/**暴雨疾风跳跃 vivo*/
	export class Sdk_11 extends BaseClass {
		public constructor() {
			super();
		}

		private _vivoGame: any;
		private orderData: any;
		public static ins(): Sdk_11 {
			return super.ins();
		}

		/** 解析平台返回参数*/
		public getParam_11(): void {
			this._vivoGame = window["qg"];
			this._vivoGame.authorize({
				type: "code",
				success: function (data) {
					var s: string = '';
					for (var key in data) {
						s += key + "=" + data[key] + "&";
					}
					egret.log(data);
					s += "tag=" + SdkMgr.tag;
					StartGetUserInfo.urlData = s;
					SdkMgr.sendServerUrl();

				},
				fail: function (data, code) {
					egret.log("登录失败");
					Sdk_11.ins().getParam_11();
				}
			})

		}

		/** 购买支付*/
		public pay_11(data: SdkParam): void {

			var nowDate = new Date().getTime();
			// let tempObj: any = {};//通过json格式透传给服务器
			// tempObj.serverid = GameServer.serverID + '';
			// tempObj.goodsid = data.goodsId + '';
			// tempObj.uid = StartGetUserInfo.uid2;
			// tempObj.timestamp = nowDate;

			var cpOrderNumber: string = "";
			cpOrderNumber = GameServer.serverID + "_" + data.goodsId + "_" + GameLogic.ins().actorModel.actorID + "_" + nowDate;
			// tempObj.amount = data.amount + '';
			// tempObj.tag = SdkMgr.tag;

			var byt: egret.ByteArray = new egret.ByteArray();
			var s = JSON.stringify(cpOrderNumber);
			byt.writeUTFBytes(s);

			var pay_obj: any = {};
			pay_obj.version = "1.0.0";
			pay_obj.signMethod = "MD5"
			pay_obj.packageName = "com.ld.jfty.vivominigame"
			pay_obj.cpOrderNumber = egret.Base64Util.encode(byt.buffer);//透传参数,服务器通知中原样回传
			pay_obj.notifyUrl = Const.SERVER_LIST_URL + "api/Bsymx/Baoyujfty/vivoPay"
			pay_obj.orderAmount = data.amount + ".00"
			pay_obj.orderTitle = data.subject
			pay_obj.orderDesc = data.subject

			var s: string = "";
			for (var key in pay_obj) {
				s += key + "=" + pay_obj[key] + "&";
			}
			var url: string = Const.SERVER_LIST_URL + "api/Bsymx/Baoyujfty/vivoSignature?" + s.substr(0, s.length - 1);
			egret.log("支付" + url);
			var request = new egret.HttpRequest();
			request.responseType = egret.HttpResponseType.TEXT;
			request.open(url, egret.HttpMethod.GET);
			request.send();
			request.addEventListener(egret.Event.COMPLETE, this.getPaySign, this);

		}
		private getPaySign(e: egret.Event): void {
			var request = <egret.HttpRequest>e.currentTarget;
			request.removeEventListener(egret.Event.CONNECT, this.getPaySign, this);
			let jsonObj = JSON.parse(request.response);
			jsonObj = jsonObj.data;

			var jsonString: string = JSON.stringify(jsonObj);
			egret.log("支付支付串" + jsonString);
			this._vivoGame.pay({
				orderInfo: jsonString,
				success: function (ret) {
				},
				fail: function (erromsg, errocode) {
					egret.log("支付失败" + erromsg + errocode);
				},
				cancel: function () {
					egret.log("取消")
				}
			})
		}


		/** 上传角色信息接口*/
		public setExtData_11(type: number): void {

		}

	}

	/**暴雨疾风跳跃 OPPO*/
	export class Sdk_12 extends BaseClass {
		public constructor() {
			super();
		}

		private _vivoGame: any;
		private orderData: any;
		public static ins(): Sdk_12 {
			return super.ins();
		}

		/** 解析平台返回参数*/
		public getParam_12(): void {
			this._vivoGame = window["qg"];
			this._vivoGame.authorize({
				type: "code",
				success: function (data) {
					var s: string = '';
					for (var key in data) {
						s += key + "=" + data[key] + "&";
					}
					egret.log(data);
					s += "tag=" + SdkMgr.tag;
					StartGetUserInfo.urlData = s;
					SdkMgr.sendServerUrl();

				},
				fail: function (data, code) {
					egret.log("登录失败");
					Sdk_11.ins().getParam_11();
				}
			})

		}

		/** 购买支付*/
		public pay_12(data: SdkParam): void {

		}
		/** 上传角色信息接口*/
		public setExtData_12(type: number): void {

		}

	}
}
