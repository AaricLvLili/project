class ActivityModel extends BaseSystem {

	public static BTN_TYPE_00 = 0 	// 开服活动
	public static BTN_TYPE_01 = 1			//开服运营活动之排行归类
	public static BTN_TYPE_02 = 2	// 其他时间类活动（春节元宵淘宝等）
	public static BTN_TYPE_03 = 3	// 欢乐庆典活动
	public static BTN_TYPE_04 = 4	// 合服活动
	public static BTN_TYPE_05 = 5	// 天降豪礼活动（时间类的运营活动）

	public static TYPE_01 = 1 // 冲级奖励
	public static TYPE_02 = 2 // 开服-特惠礼包
	public static TYPE_04 = 4 // 开服-新服排行
	public static TYPE_03 = 3 // 开服-连续充值
	public static TYPE_05 = 5 // 开服-登录
	public static TYPE_07 = 7 // 开服-累计充值

	public static TYPE_302 = 302 // 一元直购

	palyEffList = []
	rankInfoList = []
	arrRank = []
	myDabiaoInfo

	isDaBiao				// 达标
	indexCurrDabiao: number // 当前领取的索引

	activityData: { [key: number]: ActivityBaseData } = {}

	static ins(): ActivityModel {
		return super.ins()
	}

	public constructor() {
		super()

		this.regNetMsg(S2cProtocol.sc_activity_init_info, this.doActivityData)
		this.regNetMsg(S2cProtocol.sc_activity_reward_result, this.doRewardResult)
		this.regNetMsg(S2cProtocol.sc_activity_dabiao_info, this.doDaBiaoInfo)
		this.regNetMsg(S2cProtocol.sc_activity_dabiao_reward, this.doDaBiaoRewardStatu)
		this.regNetMsg(S2cProtocol.sc_activity_update_info, this.doActivityUpdate)

		this.regNetMsg(S2cProtocol.sc_activityw_update_info, this._DoActivityWUpdate)
		this.regNetMsg(S2cProtocol.sc_activityw_dresshunt_ret, this._DoDressHunt)

		this.regNetMsg(S2cProtocol.sc_record_datas, this._DoRecordAll)
		this.regNetMsg(S2cProtocol.sc_record_add, this._DoRecord)

		this.regNetMsg(S2cProtocol.sc_luckypackage_res, this.luckypackage);
		this.regNetMsg(S2cProtocol.sc_luckypackage_active_res, this.luckypackageTips);
	}

	public Init() {
		// let tempFunc = (cls, id) => {
		// 	let data = new cls
		// 	data.startTime = 0
		// 	data.endTime = 999999999999
		// 	data.openState = 1
		// 	data.id = id
		// 	data.type = id
		// 	data.update({today: 1, status: 0})
		// 	this.activityData[data.id] = data	
		// 	return data
		// }

		// tempFunc(ActivityType2000Data, 2000).update({today: 1, status: 0})
		// tempFunc(ActivityType2001Data, 2001).update({count: 1, status: 0})
		// tempFunc(ActivityType2002Data, 2002).update({count: 1, status: 0})
		// tempFunc(ActivityType2003Data, 2003).update({count: 1, status: 0})

	}

	static GetActivityData(data: Sproto.activity_data_collection): Sproto.activity_type01 {
		for (let i = 1; i <= 50; ++i) {
			let typeData = data["type" + (i < 10 ? ("0" + i) : i)]
			if (typeData) {
				return typeData
			}
		}
		for (var i = 301; i < 304; i++) {
			let typeData = data["type" + i];
			if (typeData) {
				return typeData
			}
		}
		return null
	}

	private doActivityData(rsp: Sproto.sc_activity_init_info_request) {

		for (let data of rsp.datas) {
			if (data.type35 && data.type35 instanceof Sproto.activity_type35) {
				WarOrderModel.getInstance.setData(data.type35);
				continue;
			}
			let activityData = ActivityModel.GetActivityData(data)
			if (activityData) {
				let id = activityData.baseData.id
				if (this.activityData[id]) {
					this.activityData[id].UpdateBase(activityData.baseData)
					this.activityData[id].update(activityData)
					GameGlobal.MessageCenter.dispatch(MessageDef.UPDATE_ACTIVITY_PANEL, id)
				} else {
					var n = ActivityDataFactory.create(activityData)
					n && (this.activityData[n.id] = n)
				}
			}
		}
		GameGlobal.MessageCenter.dispatch(MessageDef.ACTIVITY_IS_AWARDS);

	}

	doRewardResult(e: Sproto.sc_activity_reward_result_request) {
		var index = e.id
		if (this.activityData[index]) {
			let activityData = ActivityModel.GetActivityData(e.data)
			this.activityData[index].UpdateBase(activityData.baseData)
			this.activityData[index].update(activityData)
			GameGlobal.MessageCenter.dispatch(MessageDef.UPDATE_ACTIVITY_PANEL, index)
			GameGlobal.MessageCenter.dispatch(MessageDef.ACTIVITY_IS_AWARDS)
		}
	}

	SendGetHuntRecord(type: number): void {
		let req = new Sproto.cs_baserecord_info_request
		req.type = type
		this.Rpc(C2sProtocol.cs_baserecord_info, req)
	}

	SendLevelInfo(activityId: number): void {
		let req = new Sproto.cs_activity_send_level_info_request
		req.activityID = activityId
		this.Rpc(C2sProtocol.cs_activity_send_level_info, req)
	}

	/**
	 * 获取奖励
	 */
	sendReward(id: number, index: number) {
		let req = new Sproto.cs_activity_send_reward_request
		req.id = id
		req.index = index
		this.Rpc(C2sProtocol.cs_activity_send_reward, req)
	}

	doDaBiaoInfo(rsp: Sproto.sc_activity_dabiao_info_request) {
		let activityId = rsp.acId
		this.isDaBiao = rsp.draw
		this.indexCurrDabiao = rsp.index
		this.myDabiaoInfo = rsp.value

		this.rankInfoList = [];
		for (var i = 0; rsp.rankInfo.length > i; i++) {
			this.rankInfoList[i] || this.rankInfoList.push(new DabiaoRankData)
			let data: DabiaoRankData = this.rankInfoList[i]
			data.prase(rsp.rankInfo[i], null)
		}

		GameGlobal.MessageCenter.dispatch(MessageDef.ACTIVITY4_UPDATE)
	}

	sendDabiaoInfo(e) {
		let req = new Sproto.cs_activity_send_dabiao_info_request
		req.activityID = e
		this.Rpc(C2sProtocol.cs_activity_send_dabiao_info, req)
	}

	doDaBiaoRewardStatu(e: Sproto.sc_activity_dabiao_reward_request) {
		GameGlobal.MessageCenter.dispatch(MessageDef.ACTIVITY4_IS_GET_AWARDS)
	}

	doActivityUpdate(rsp: Sproto.sc_activity_update_info_request) {
		var index = rsp.index
		if (this.activityData[index]) {
			let activityData = ActivityModel.GetActivityData(rsp.data)
			this.activityData[index].UpdateBase(activityData.baseData)
			this.activityData[index].update(activityData)
			GameGlobal.MessageCenter.dispatch(MessageDef.UPDATE_ACTIVITY_PANEL, index)
			GameGlobal.MessageCenter.dispatch(MessageDef.ACTIVITY_IS_AWARDS)
		}
	}

	private _DoActivityWUpdate(rsp: Sproto.sc_activityw_update_info_request) {
		let id = rsp.baseData.id
		if (this.activityData[id]) {
			let actData = this.activityData[id]
			actData.UpdateBase(rsp.baseData)
			// 只有活动开启才更新数据
			if (actData.openState == 1) {
				actData.update(rsp)
			}
		} else {
			var actData = ActivityDataFactory.create(rsp)
			if (actData) {
				this.activityData[actData.id] = actData
			}
		}
		GameGlobal.MessageCenter.dispatch(MessageDef.UPDATE_ACTIVITY_PANEL, id)
		GameGlobal.MessageCenter.dispatch(MessageDef.ACTIVITY_IS_AWARDS)
	}

	private _DoDressHunt(rsp: Sproto.sc_activityw_dresshunt_ret_request) {
		var arr = [];
		for (var i = 0, num = rsp.items.length; i < num; i++) {
			arr[i] = [rsp.items[i].id, rsp.items[i].count];
		}
		ViewManager.ins().open(ActivityType2003ResultPanel, rsp.type, arr)
	}

	private _DoRecordAll(rsp: Sproto.sc_record_datas_request) {
		GameGlobal.MessageCenter.dispatch(MessageDef.ACTIVITY_HUNT_INIT_RECORD, rsp.type, rsp.record)
	}

	private _DoRecord(rsp: Sproto.sc_record_add_request) {
		GameGlobal.MessageCenter.dispatch(MessageDef.ACTIVITY_HUNT_ADD_RECORD, rsp.type, rsp.record)
	}

	private activityBtnConfig: any;
	private activitySumBtnConfig: any;
	private activityBtnAConfig: any;
	private m_TempBtnList: { [key: string]: any } = {}
	private getbtnInfo(key: string) {
		let configData = this.m_TempBtnList[key]
		if (!configData) {
			if (this.activityBtnConfig == null)
				this.activityBtnConfig = GlobalConfig.ins("ActivityBtnConfig");
			configData = this.activityBtnConfig[key];
			if (!configData) {
				if (key == "20") {
					configData = { id: 20, icon: "act_5", type: 1, acTime: "", acDesc: "", light: 1, onPlace: 0 }
				} else {
					if (this.activitySumBtnConfig == null)
						this.activitySumBtnConfig = GlobalConfig.ins("ActivitySumBtnConfig");
					configData = this.activitySumBtnConfig[key];
				}
			}

			if (!configData) {
				if (this.activityBtnAConfig == null)
					this.activityBtnAConfig = GlobalConfig.ins("ActivityBtnAConfig");
				configData = this.activityBtnAConfig[key];
			}

			if (configData) {
				this.m_TempBtnList[key] = configData
			}
		}
		return configData ? configData : null
	}

	getbtnListByType(type: number = 0): ActBtnData[] {
		var list: ActBtnData[] = [];
		for (var key in this.activityData) {
			let data = this.activityData[key]
			// 忽略类型5
			if (data.type == 5) {
				continue
			}

			if (this.IsOpen(data)) {
				var btnInfo = this.getbtnInfo(key);
				if (btnInfo && btnInfo.onPlace == type) {
					btnInfo.actType = data.type
					list.push(btnInfo)
				}
			}
		}

		if (type == ActivityModel.BTN_TYPE_00) {
			if (ActivityGuildWinnerPanel.IsShowAct()) {
				list.push(ActivityModel.CUS_ACT_4);
			}

			if (Recharge.ins().rechargeData[1].day <= Recharge.ins().getChongZhi2ConfigDay())
				list.push(ActivityModel.CUS_ACT_1);
			list.push(ActivityModel.CUS_ACT_2);
			if (EggBroken.IsOpen()) {
				list.push(ActivityModel.CUS_ACT_3);
			}
		}

		if (list.length > 0 && type == ActivityModel.BTN_TYPE_04) {
			// if (ActivityGuildWinnerPanel.IsShowAct()) {
			list.push(ActivityModel.CUS_ACT_4);
			// }
		}

		if (list.length > 0 && type == ActivityModel.BTN_TYPE_01) {
			list.push(ActivityModel.CUS_ACT_5);
		}
		return list
	}
	//获取开服 每日目标，限购礼包，新服排行活动
	public getTargetKFActivity(): ActBtnData[] {
		let list: ActBtnData[] = [];
		let type = ActivityModel.BTN_TYPE_01;
		for (var key in this.activityData) {
			let data = this.activityData[key]
			if (this.IsOpen(data)) {
				var btnInfo = this.getbtnInfo(key);
				if (btnInfo && btnInfo.onPlace == type) {
					btnInfo.actType = data.type
					list.push(btnInfo)
				}
			}
		}
		list.sort((e, t) => {
			return e.type > t.type ? 1 : e.type < t.type ? -1 : 0;
		})
		return list
	}

	public IsOpen(data: ActivityBaseData): boolean {
		if (data == null) {
			return false
		}
		if (data.isOpenActivity() && 1 == data.openState) {
			return true
		}
		return false
	}

	checkAcCanGet(e) {
		var t = this.activityData;
		for (var i in t)
			if (i == e && t[i].isOpenActivity() && t[i].canReward()) return !0;
		return !1
	}

	checkOtherCharge2CanGet() {
		var e = GameGlobal.rechargeData[1]
		let t = Recharge.ins().GetConfig2()
		for (var i in t) {
			if (!BitUtil.Has(e.isAwards, t[i].index) && e.num >= t[i].pay) return true;
		}
		return false
	}

	getisCangetDabiao(id) {
		for (let i = 1; i <= this.indexCurrDabiao; ++i) {
			if (!BitUtil.Has(this.isDaBiao, i)) {
				return true
			}
		}
		return false
	}

	public GetActivityDataById(id: number): ActivityBaseData {
		return this.activityData[id]
	}

	public GetActivityDataByType(type: number): ActivityBaseData {
		for (let key in this.activityData) {
			let data = this.activityData[key]
			if (type == data.type) {
				return data
			}
		}
		return null
	}

	public static SendLevelInfo() {
		let activityData = ActivityModel.ins().GetActivityDataByType(1)
		if (activityData) {
			ActivityModel.ins().SendLevelInfo(activityData.id)
		}
	}

	/**每日累充 */
	public static CUS_ACT_1 = {
		id: 20001,
		icon: "ui_ljcz_icon",
		type: 20001,
		actType: 20001,
		acTime: "",
		acDesc: "每日累充",
		light: 1,
		onPlace: 0,
		canReward: function () {
			return ActivityModel.ins().checkOtherCharge2CanGet()
		}
	}

	/**充值返利，充值好礼 */
	public static CUS_ACT_2 = {
		id: 20002,
		icon: "ui_lchl_icon",
		type: 20002,
		actType: 20002,
		acTime: "",
		acDesc: "充值返利",
		light: 1,
		onPlace: 0,
		canReward: function () {
			return MoneyTreeModel.HasRechargeGift()
		}
	}

	/**砸蛋 */
	public static CUS_ACT_3 = {
		id: -1001,
		icon: "ui_zjd_icon_jd",
		type: -1001,
		actType: -1001,
		acTime: "",
		acDesc: "砸金蛋",
		light: 1,
		onPlace: 0,
		canReward: function () {
			return EggBroken.ins().HasAward()
		}
	}

	public static CUS_ACT_4 = {
		id: -1000,
		icon: "ui_scbz_icon",
		type: -1000,
		actType: -1000,
		acTime: "",
		acDesc: "遗迹争霸",
		light: 1,
		onPlace: 0,
		canReward: function () {
			return GuildReward.ins().GetFirstRewardState() == RewardState.CanGet
		}
	}

	/**每日目标 */
	public static CUS_ACT_5 = {
		id: -1002,
		icon: "",
		type: 2,
		actType: -1002,
		acTime: "",
		acDesc: "每日目标",
		light: 1,
		onPlace: ActivityModel.BTN_TYPE_01,
		canReward: function () {
			return false;
		}
	}

	public static CUS_ACT_LIST = [
		ActivityModel.CUS_ACT_1,
		ActivityModel.CUS_ACT_2,//这里可以屏蔽充值返利，
		ActivityModel.CUS_ACT_3,
		ActivityModel.CUS_ACT_4,
		ActivityModel.CUS_ACT_5,
	]

	public static GetCusActData(id: number) {
		for (let i = 0; i < this.CUS_ACT_LIST.length; ++i) {
			if (this.CUS_ACT_LIST[i].id == id) {
				return this.CUS_ACT_LIST[i]
			}
		}
		return null
	}

	public static GetActivityConfig(id: number) {
		var config = GlobalConfig.ins("ActivityConfig")[id]
		if (!config) {
			config = GlobalConfig.ins("ActivitySumConfig")[id]
		}
		if (!config) {
			config = GlobalConfig.ins("ActivityAConfig")[id]
		}
		return config
	}

	public checkMonthSingRedPoint(): boolean {
		let activityData: ActivityType20Data = <ActivityType20Data>GameGlobal.activityData[201];
		if (activityData && activityData.todaySigan == 0) {
			return true;
		}
		return false;
	}

	private luckypackage(rsp: Sproto.sc_luckypackage_res_request) {
		if (rsp.datas) {
			LuckGiftBagModel.getInstance.setLuckGiftData(rsp.datas);
			GameGlobal.MessageCenter.dispatch(MessageDef.LUCKGIFTBAG_DATA_UPDATE);
		}
	}
	private luckypackageTips(rsp: Sproto.sc_luckypackage_active_res_request) {
		let id = rsp.id;
		ViewManager.ins().open(LuckGiftTips, [id]);
	}

	/**购买幸运礼包*/
	public luckypackagebuy(id: number) {
		let rsp = new Sproto.cs_luckypackage_testbuy_req_request;
		rsp.id = id;
		this.Rpc(C2sProtocol.cs_luckypackage_testbuy_req, rsp);
	}

}

class ActBtnData {
	id: number
	icon: string
	type: number
	light: number
	onPlace: number
	actType: number
}
window["ActivityModel"] = ActivityModel
window["ActBtnData"] = ActBtnData