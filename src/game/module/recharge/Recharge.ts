class Recharge extends BaseSystem {
	rechargeData: RechargeData[] = [];
	firstRechargeData: FirstRechargeData
	costList: number = 0;
	/** 月卡w为1*/
	flag: number = 0;
	/** 至尊月卡true*/
	zunCard: boolean = false;
	private _monthDay: number = 0;
	private ActivityType8Config: any;
	public IsZunCard(): boolean {
		return this.zunCard
	}

	public IsMonthCard(): boolean {
		return this._monthDay > 0
	}
	// WarnWin.show("正在拉起支付...\n如果长时间无响应，请尝试刷新网页重新购买", function () { }, this)
	private m_MonthReward: RewardState = RewardState.NotReached;
	private chongZhi1Config: any;
	private chongZhi2Config: any;

	public GetMonthReward(): RewardState {
		return this.m_MonthReward
	}

	public static ins(): Recharge {
		return super.ins()
	}
	public constructor() {
		super();

		this.rechargeData = [
			new RechargeData,
			new RechargeData
		]
		this.firstRechargeData = new FirstRechargeData()

		this.sysId = PackageID.Recharge;
		this.regNetMsg(S2cProtocol.sc_recharge_get_data, this.doRechargeData);
		this.regNetMsg(S2cProtocol.sc_recharge_change_data, this.doChangeRechargeData);
		this.regNetMsg(S2cProtocol.sc_recharge_item_data, this.postUpDataItem);
		this.regNetMsg(S2cProtocol.sc_recharge_get_month_day, this.doGetMonthDay);

		this.regNetMsg(S2cProtocol.sc_recharge_month_reward, this.getgifDagData);
		this.regNetMsg(S2cProtocol.sc_recharge_first_status, this.getFirstRechangeData);

	}
	public static IsShowDayRecharge(): boolean {
		let config = Recharge.ins().GetConfig()
		let data = GameGlobal.rechargeData[0];
		for (let key in config) {
			if (!BitUtil.Has(data.isAwards, config[key].index)) {
				return true
			}
		}
		return false
	}

	/*获取是否能领取首充礼包*/
	public getgifDagData(bytes: Sproto.sc_recharge_month_reward_request) {
		this.m_MonthReward = bytes.status
		GameGlobal.MessageCenter.dispatch(MessageDef.RECHARGE_UPDATE_MONTH_REWARD)
	}

	public HasMonthCardReward(): boolean {
		return this.m_MonthReward == RewardState.CanGet
	}

	//发送领取礼包
	public sendgetgifData() {
		this.Rpc(C2sProtocol.cs_recharge_month_reward);
	}
	/**
	 * 获取首充数据
	 */
	public getFirstRechangeData(bytes: Sproto.sc_recharge_first_status_request) {
		this.firstRechargeData.change(bytes)
		GameGlobal.MessageCenter.dispatch(MessageDef.UPDATE_FIRSTRECHARGE)
		let model = PlayFun.ins()
		if (bytes.firstOpenStatus) {
			if (!model.isCheckTimering) {
				model.autoTimeer();
			}
			if (!model.isCheckAnimTimering) {
				model.autoAnimTimeer();
			}
		} else
			model.removeAutoTimer()
	}

	/**获取充值数据 RechargeData*/
	public getRechargeData(index = -1): any {
		return index == -1 ? this.rechargeData : this.rechargeData[index];
	};
    /**
     * 请求领取充值奖励
     * 27-2或27-7
     * @param type 领取类型
     */
	public sendGetAwards(type, id) {
		let req = new Sproto.cs_recharge_get_awards_request
		req.type = type
		req.id = id
		this.Rpc(C2sProtocol.cs_recharge_get_awards, req)
	};
    /**
     * 获取充值1数据
     * 27-1
     */
	private doRechargeData(bytes: Sproto.sc_recharge_get_data_request) {
		this.recharge(bytes.data, bytes.data.type);
	};
    /**
     * 更新充值1数据
     * 27-2
     */
	public doChangeRechargeData(bytes: Sproto.sc_recharge_change_data_request) {
		var data: RechargeData = this.getRechargeData(bytes.data.type);
		if (data) {
			data.change(bytes.data);
			Recharge.doUpdateRecharge(bytes.data.type);
		}
	};
	public static doUpdateRecharge(param) {
		// _Trace("------------------Recharge ", param)
		GameGlobal.MessageCenter.dispatch(MessageDef.UPDATE_RECHARGE, param);
	};
    /**
     * 获取充值2数据
     * 27-6
     */
	// public getRecharge2Data(bytes) {
	// 	this.recharge(bytes, 1);
	// };
    /**
     * 更新充值2数据
     * 27-7
     */
	// public changeRecharge2Data(bytes) {
	// 	var data = this.getRechargeData(1);
	// 	if (data) {
	// 		data.change(bytes);
	// 		Recharge.postUpdateRecharge(1);
	// 	}
	// };
	public recharge(bytes: Sproto.recharge_data, type: number) {
		if (!this.rechargeData[type])
			this.rechargeData[type] = new RechargeData;
		this.rechargeData[type].parser(bytes, type);
		Recharge.doUpdateRecharge(type);
	};
	public postUpDataItem(bytes: Sproto.sc_recharge_item_data_request) {
		this.costList = bytes.costList
	};
    /**
     * 月卡剩余天数
     * 27-10
     */
	public doGetMonthDay(bytes: Sproto.sc_recharge_get_month_day_request) {
		if (bytes.type == 1) {
			this.monthDay = bytes.monthDay
			this.flag = bytes.flag
		} else {
			this.zunCard = bytes.monthDay > 0
		}
		GameGlobal.MessageCenter.dispatch(MessageDef.RECHARGE_UPDATE_MONTH_DAY);
	};
	public getFirstRechangCfg() {
		if (this.chongZhi1Config == null)
			this.chongZhi1Config = GlobalConfig.ins("ChongZhi1Config");

		let rechargeData = this.firstRechargeData
		return (GameServer.serverMergeTime > 0) ? this.chongZhi1Config[99] : this.chongZhi1Config[0];
	}
	public GetConfig() {
		if (this.chongZhi1Config == null)
			this.chongZhi1Config = GlobalConfig.ins("ChongZhi1Config");

		let rechargeData = this.rechargeData[0]
		// if (rechargeData.isFirst) {
		// 	return (GameServer.serverMergeTime > 0) ? this.chongZhi1Config[99][0] : this.chongZhi1Config[0][0];
		// } else {
		if (rechargeData.day / 14 > 1)
			return this.chongZhi1Config[2][(rechargeData.day - 1) % 7]
		else
			return this.chongZhi1Config[1][(rechargeData.day - 1) % 14]
		//}
	}


	public GetConfig2() {
		if (this.chongZhi2Config == null)
			this.chongZhi2Config = GlobalConfig.ins("ChongZhi2Config");

		var data = this.rechargeData[1]
		var maxDay = this.getChongZhi2ConfigDay();
		if (data.day > 7)
			return this.chongZhi2Config[2][(data.day - 1) % maxDay];
		else
			return this.chongZhi2Config[1][(data.day - 1) % maxDay];
	}

	public getChongZhi2ConfigDay() {
		if (this.chongZhi2Config == null)
			this.chongZhi2Config = GlobalConfig.ins("ChongZhi2Config");
		var maxDay = 0;
		for (var k in this.chongZhi2Config[1]) {
			maxDay++;
		}
		return maxDay
	}

	/**
	 * 今日充值状态
	 * @returns 0、已经充值	1、可首冲	2、可每日充值
	 */
	public ToDayRechargeState() {
		let data = this.rechargeData[0]
		if (!data) {
			return 0
		}
		//if (data.num < 1) {
		if (data.isFirst) {
			return 0
		}
		return 2
		//}
		//return 0
	}
	/**
	 * 是否还没首充
	 */
	public getFirstRechargeState() {
		let data = this.firstRechargeData
		if (!data) return true
		// return data.day != 0
		return data.statau == true
	}

	public getOrderByIndex(index) {
		if (index === void 0) { index = 0; }
		var num = (this.costList >> index) & 1;
		return num;
	};

	public get monthDay() {
		return this._monthDay;
	}
	public set monthDay(value) {
		if (value == null) {
			return
		}
		if (this._monthDay != value) {
			this._monthDay = value;
			TimerManager.ins().remove(this.downTime, this);
			TimerManager.ins().doTimer(1000, this._monthDay, this.downTime, this);
			GameGlobal.MessageCenter.dispatch(MessageDef.RECHARGE_UPDATE_MONTH_DAY)
		}
	}
	public downTime() {
		this._monthDay -= 1;
	};
	public getAddBagGrid() {
		return (this.zunCard ? 100 : 0) + (this.flag == 1 ? 100 : 0);
	};

	public static GetBaseInfo() {
		let orderInfo: SdkParam = new SdkParam();
		orderInfo.uid = StartGetUserInfo.uid
		orderInfo.userRoleId = GameGlobal.actorModel.actorID + ""
		orderInfo.userRoleName = GameGlobal.actorModel.name + ""
		// orderInfo.userServer = StartGetUserInfo.mServerData.id + ""
		orderInfo.serverid = StartGetUserInfo.mServerData.id + ""
		orderInfo.userLevel = (GameGlobal.zsModel.lv * 1000 + GameGlobal.actorModel.level) + ""
		orderInfo.count = 1;
		orderInfo.quantifier = '个';
		orderInfo.callbackUrl = 'http://119.23.231.59:8521'
		// orderInfo.extrasParams = StartGetUserInfo.mServerData.id;
		orderInfo.extraInfo = StartGetUserInfo.mServerData.id;
		return orderInfo
	}

	public static GetYbOrderInfo(id: number, isF: boolean = false) {
		let config = isF ? GlobalConfig.ins("FirstPayConfig") : GlobalConfig.ins("PayItemsConfig");
		if (LocationProperty.urlParam["iosiddd"])//如果是美国，直接读配置
		{
			config = GlobalConfig.ins("PayItemsConfig");
			console.log("购买读取配置PayItemsConfig");
		}

		let configData = null
		for (let key in config) {
			if (config[key].id == id) {
				configData = config[key]
				break
			}
		}
		if (!configData) {
			console.log("not found pay id", id)
			return
		}
		let orderInfo = Recharge.GetBaseInfo()
		orderInfo.cpOrderNo = 'ybOrderNo00000' + id;
		orderInfo.amount = configData.cash + ""
		orderInfo.subject = configData.itemName + ""
		orderInfo.desc = configData.itemName + ""
		orderInfo.goodsId = this.GetGoodsId(RechargeGoodsType.YUAN_BAO, id)
		orderInfo.extraInfo += ',' + this.GetGoodsId(RechargeGoodsType.YUAN_BAO, id)
		return orderInfo
	}

	public static GetGoodsId(type: RechargeGoodsType, index: number): number {
		switch (type) {
			case RechargeGoodsType.YUAN_BAO: return index;
			case RechargeGoodsType.MONTY_CARD: return 10000 + index;
			case RechargeGoodsType.INVEST: return 20000 + index;
			case RechargeGoodsType.ZZ_RMB: return 30000 + index;
		}
		return index
	}

	public TestMonth(index) {
		if (ActorModel.IsGM()) {
			var cs_recharge_test_month = new Sproto.cs_recharge_test_month_request()
			cs_recharge_test_month.index = index
			this.Rpc(C2sProtocol.cs_recharge_test_month, cs_recharge_test_month)
			return
		}
		let orderInfo = Recharge.GetBaseInfo()
		orderInfo.cpOrderNo = 'mOrderNo00000' + index;

		let cash, itemName;
		var p: number = GlobalConfig.ins("ChongZhiBaseConfig").yuanBaoScale;
		switch (index) {
			case 1:
				cash = Math.floor(Number(GlobalConfig.ins("MonthCardConfig").money) / p)
				itemName = GlobalConfig.jifengTiaoyueLg.st101925;
				break
			case 2:
				cash = Math.floor(Number(GlobalConfig.ins("MonthCardConfig").moneyEx) / p)
				itemName = GlobalConfig.jifengTiaoyueLg.st101926;
				break
		}

		orderInfo.amount = cash + ""
		orderInfo.subject = itemName + ""
		orderInfo.desc = itemName;
		orderInfo.goodsId = Recharge.GetGoodsId(RechargeGoodsType.MONTY_CARD, index);
		orderInfo.extraInfo += ',' + Recharge.GetGoodsId(RechargeGoodsType.MONTY_CARD, index);
		SdkMgr.pay(orderInfo);
		//console.log("not recharge month !!!")
	}





	/**
	 * 充值人民币通用接口
	 * @param amount 实际人民币价格
	 * @param subject 物品名字
	 * @param goodsId 商品人民币价格对应的套餐id或者序号
	 */
	public static commonCharge(amount, subject, goodsId) {
		let orderInfo = Recharge.GetBaseInfo()
		orderInfo.amount = amount + ""//人民币价格
		orderInfo.subject = subject + ""//名字
		orderInfo.goodsId = goodsId;//商品di
		SdkMgr.pay(orderInfo);
	}

	/**
	 * 第一次首冲和充值 
	 * index：套餐序号 
	 * isF：是否是第一次首冲
	*/
	public TestReCharge(index: number, isF: boolean = false) {
		//console.log("TestReCharge" + index);
		if (ActorModel.IsGM()) {
			let req = new Sproto.cs_recharge_test_request
			req.rechargeId = index
			this.Rpc(C2sProtocol.cs_recharge_test, req)
			return
		}
		// if (QuickSDK) {
		let orderInfo = Recharge.GetYbOrderInfo(index, isF);
		SdkMgr.pay(orderInfo);
		//console.log("not recharge !!!")
	}
	//一元直购
	public TestDayOne(configData) {
		if (configData == null) {
			return
		}
		if (ActorModel.IsGM()) {
			return
		}
		let orderInfo = Recharge.GetBaseInfo()
		orderInfo.cpOrderNo = 'mDayOne00000' + configData.index;
		let cash = Math.floor(Number(configData.price));
		let itemName = configData.orderName || GlobalConfig.jifengTiaoyueLg.st101927;
		orderInfo.amount = cash + ""
		orderInfo.subject = itemName + ""
		orderInfo.desc = itemName + configData.price + ""
		let goodsId = configData.goodsID
		orderInfo.goodsId = goodsId
		orderInfo.extraInfo += ',' + goodsId
		SdkMgr.pay(orderInfo);
	}

	//一元礼包
	public TestOmGifBag(configData) {
		if (configData == null) {
			return
		}
		if (ActorModel.IsGM()) {
			return
		}
		let orderInfo = Recharge.GetBaseInfo()
		orderInfo.cpOrderNo = 'mDayOne00000' + configData.Id;
		let cash = Math.floor(Number(configData.price));
		let itemName = configData.orderName || GlobalConfig.jifengTiaoyueLg.st101999;
		orderInfo.amount = cash + ""
		orderInfo.subject = itemName + ""
		orderInfo.desc = itemName + configData.price + ""
		let goodsId = configData.goodsID
		orderInfo.goodsId = goodsId
		orderInfo.extraInfo += ',' + goodsId
		SdkMgr.pay(orderInfo);
	}

	public commonTopUp(id: number, price: number, goodsId: number, orderName=null) {
		if (ActorModel.IsGM()) {
			return
		}
		let orderInfo = Recharge.GetBaseInfo()
		orderInfo.cpOrderNo = 'mDayOne00000' + id;
		let cash = Math.floor(Number(price));
		let itemName = orderName || GlobalConfig.jifengTiaoyueLg.st101999;
		orderInfo.amount = cash + ""
		orderInfo.subject = itemName + ""
		orderInfo.desc = itemName + price + ""
		orderInfo.goodsId = goodsId
		orderInfo.extraInfo += ',' + goodsId
		SdkMgr.pay(orderInfo);
	}
	public TestInvest(actId: number, index: number) {
		//console.log("invest actId = " + actId + "; id = " + index)
		if (this.ActivityType8Config == null)
			this.ActivityType8Config = GlobalConfig.ins("ActivityType8Config");
		let config = this.ActivityType8Config[actId];
		let configData = null
		for (let key in config) {
			if (config[key].index == index) {
				configData = config[key]
				break
			}
		}
		if (!configData) {
			alert("套餐序号错误 actId = " + actId + "; id =" + index)
			return
		}
		if (ActorModel.IsGM()) {
			GameLogic.SendGM("recharge " + Recharge.GetGoodsId(RechargeGoodsType.INVEST, actId * 100 + index))
			return
		}
		let orderInfo = Recharge.GetBaseInfo()
		orderInfo.cpOrderNo = 'mInvestNo00000' + index;
		var p: number = GlobalConfig.ins("ChongZhiBaseConfig").yuanBaoScale;
		let cash = Math.floor(Number(configData.price) / p);
		let itemName = configData.orderName || GlobalConfig.jifengTiaoyueLg.st101078;
		orderInfo.amount = cash + ""
		orderInfo.subject = itemName + ""
		orderInfo.desc = itemName + ""
		let goodsId = Recharge.GetGoodsId(RechargeGoodsType.INVEST, actId * 100 + index)
		orderInfo.goodsId = goodsId
		orderInfo.extraInfo += ',' + goodsId
		SdkMgr.pay(orderInfo);
	}
}

class RechargeData {
	public day: number = 1
	public isFirst: number = 1
	public num: number = 0
	public isAwards: number = 0
	public parser(bytes: Sproto.recharge_data, type) {
		this.day = bytes.day
		if (type == 0)
			this.isFirst = bytes.isFirst
		this.num = bytes.num
		this.isAwards = bytes.isAwards
	};
	public change(bytes: Sproto.recharge_data) {
		this.day = bytes.day
		this.num = bytes.num
		this.isAwards = bytes.isAwards
		this.isFirst = bytes.isFirst
	}
}

enum RechargeGoodsType {
	YUAN_BAO = 0,// 钻石
	MONTY_CARD = 1,// 月卡
	INVEST = 2,// 投资
	ZZ_RMB = 3,//至尊人民币
	ACTIVITY_52_TYPE = 4,//新手礼包中的人民币礼包第一档次
	ACTIVITY_53_TYPE = 4,//新手礼包中的人民币礼包第二档次
}
class FirstRechargeData {
	statau: boolean = true
	awards: number = 0
	day: number = 0
	// public parser(bytes: Sproto.sc_recharge_first_status_request) {
	// 	this.statau = bytes.firstOpenStatus
	// 	this.awards = bytes.firstRewardStatus
	// 	this.day = bytes.day
	// };
	public change(bytes: Sproto.sc_recharge_first_status_request) {
		this.statau = bytes.firstOpenStatus
		this.awards = bytes.firstRewardStatus
		this.day = bytes.day
	};
}
enum AwardStatus {
	None = -1,
	unfinish = 0,
	awaitrReceive = 1,
	finish = 2
}

MessageCenter.compile(Recharge);
window["Recharge"] = Recharge
window["RechargeData"] = RechargeData
window["FirstRechargeData"] = FirstRechargeData