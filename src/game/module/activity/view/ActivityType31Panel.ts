class ActivityType31Panel extends ActivityPanel implements ICommonWindowTitle {
	public constructor() {
		super()
		this.skinName = "ActivityType31Skin"

	}
	mWindowHelpId = 39;
	public group_Info: eui.Group;
	public group_table: eui.Group;
	public group_rewardEff: eui.Group;
	public showGroup: eui.Group;
	public m_Lan0: eui.Label;
	public price_cost: PriceIcon;
	public m_Lan2: eui.Label;
	public label_remainTime: eui.Label;
	public barList: eui.Scroller;
	public list;
	public warehouse: eui.Button;
	public closeMcCheck: eui.CheckBox;
	public priceIcon1: PriceIcon;
	public priceIcon2: PriceIcon;
	public buy10: eui.Button;
	public buy1: eui.Button;
	public btn_showRank0: eui.Button;
	public warn: eui.Group;
	public m_Lan1: eui.Label;
	public group_Rank: eui.Group;
	public activityGroup: eui.Group;
	public m_Lan3: eui.Label;
	public desc: eui.Label;
	public m_Lan4: eui.Label;
	public date: eui.Label;
	public list1: eui.List;
	public m_Lan5: eui.Label;
	public btn_showRank: eui.Button;
	public labelRank: eui.Label;
	public labelCount: eui.Label;


	public scroller_record: eui.Scroller;
	public label_record: eui.Label;
	private m_ArrayDatas = new eui.ArrayCollection;

	private listData: eui.ArrayCollection
	public resultImg: eui.Image;

	private readonly rankObj: { [key: number]: number } = {
		"205": 1013,
		"209": 1014,
		"2015": 2016,
		"3022": 3023,
		"4022": 4023,
	}

	public childrenCreated() {
		var config = ActivityType31Data.getConfig(this.activityID);
		this.priceIcon1.price = config.huntOnce;
		this.priceIcon2.price = config.huntTenth;
		this.list.itemRenderer = HuntListRenderer;
		this.list1.itemRenderer = ActivityType21ItemRenderer;
		this.listData = new eui.ArrayCollection, this.list1.dataProvider = this.listData
		this.name = GlobalConfig.jifengTiaoyueLg.st102061;
		for (let i = 0; i < this.showGroup.numChildren; ++i) {
			let item = this.showGroup.getChildAt(i) as ItemBase;
			item.data = config.showAward[i];
		}
		this.m_Lan0.text = GlobalConfig.jifengTiaoyueLg.st102056;
		this.m_Lan1.text = GlobalConfig.jifengTiaoyueLg.st102059;
		this.m_Lan2.text = GlobalConfig.jifengTiaoyueLg.st100025;
		this.m_Lan3.text = GlobalConfig.jifengTiaoyueLg.st101274;
		this.m_Lan4.text = GlobalConfig.jifengTiaoyueLg.st100025;
		this.m_Lan5.text = GlobalConfig.jifengTiaoyueLg.st102060;
		this.warehouse.label = GlobalConfig.jifengTiaoyueLg.st101311;
		this.buy10.label = GlobalConfig.jifengTiaoyueLg.st102057;
		this.buy1.label = GlobalConfig.jifengTiaoyueLg.st102058;
		this.btn_showRank0.label = GlobalConfig.jifengTiaoyueLg.st100381;
		this.btn_showRank.label = GlobalConfig.jifengTiaoyueLg.st102061;
		this.closeMcCheck.label = GlobalConfig.jifengTiaoyueLg.st102068;
	}
	open() {
		this.currentState = "luck";
		this.buy1.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
		this.buy10.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
		this.warehouse.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onWarehouse, this);
		this.btn_showRank.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this)
		this.btn_showRank0.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this)
		GameGlobal.MessageCenter.addListener(MessageDef.HUNT_LUCK_ADDLOG, this.listAddData, this);
		GameGlobal.MessageCenter.addListener(MessageDef.HUNT_LUCK_REWARD, this.updateRewardData, this);
		GameGlobal.MessageCenter.addListener(MessageDef.PAY_SPEND_RANK_UPDATE, this.updateRankData, this);
		GameGlobal.MessageCenter.addListener(MessageDef.HUNT_LUCK_GOODPOOL, this.updateGoodPool, this);
		GameGlobal.MessageCenter.addListener(MessageDef.CHANGE_ITEM, this._UpdateRedPoint, this);
		GameGlobal.MessageCenter.addListener(MessageDef.DELETE_ITEM, this._UpdateRedPoint, this);
		MessageCenter.addListener(UserBag.postItemAdd, this._UpdateRedPoint, this);
		MessageCenter.addListener(ActivityType31Model.postBestListInfo, this.listRefush, this);

		this.listRefush([]);
		this.updateGoldPool();
		this._UpdateRedPoint();
		ActivityType31Model.ins().sendLuckywheelList();
		let activityWin = ViewManager.ins().getView(ActivityWinSummer);
		if (activityWin instanceof ActivityWinSummer) {
			activityWin.activityGroup.visible = false;
			activityWin.commonWindowBg.helpBtn.visible = true;
			activityWin.commonWindowBg.helpBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClickHelp, this);
		}
	}

	close() {
		let activityWin = ViewManager.ins().getView(ActivityWinSummer);
		if (activityWin instanceof ActivityWinSummer) {
			activityWin.activityGroup.visible = true;
			activityWin.commonWindowBg.helpBtn.visible = false;
			activityWin.commonWindowBg.helpBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onClickHelp, this);
		}
		this.buy1.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
		this.buy10.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
		this.warehouse.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onWarehouse, this);
		this.btn_showRank.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this)
		this.btn_showRank0.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this)
		GameGlobal.MessageCenter.removeListener(MessageDef.HUNT_LUCK_ADDLOG, this.listAddData, this);
		GameGlobal.MessageCenter.removeListener(MessageDef.HUNT_LUCK_REWARD, this.updateRewardData, this);
		GameGlobal.MessageCenter.removeListener(MessageDef.PAY_SPEND_RANK_UPDATE, this.updateRankData, this);
		GameGlobal.MessageCenter.removeListener(MessageDef.HUNT_LUCK_GOODPOOL, this.updateGoodPool, this);
		GameGlobal.MessageCenter.removeListener(MessageDef.CHANGE_ITEM, this._UpdateRedPoint, this);
		GameGlobal.MessageCenter.removeListener(MessageDef.DELETE_ITEM, this._UpdateRedPoint, this);
		MessageCenter.ins().removeAll(this);
	}
	UpdateContent() { }
	private onClickHelp() {
		ViewManager.ins().open(ZsBossRuleSpeak, this.mWindowHelpId);
	}
	private _UpdateRedPoint() {
		UIHelper.ShowRedPoint(this.warehouse, TreasureHuntWin.IsRedPointByWarehouse())
	}

	//仓库
	private onWarehouse(e: egret.TouchEvent): void {
		ViewManager.ins().open(TreasureStorePanel);
	}

	updateGoldPool() {
		var activityData = <ActivityType31Data>GameGlobal.activityData[this.activityID];
		this.price_cost.price = activityData.goldPool;
		this.label_remainTime.text = activityData.getRemindTimeString();
	}
	//更新排行榜
	private updateRankData(type) {
		// let config =ActivityModel.ins().GetActivityConfig1(this.activityID)
		// let data = Rank.ins().getRankModel(config[0].rankType)
		let config = ActivityType31Data.GetActivityConfig1(this.rankObj[this.activityID]);
		if (config[0].rankType != type) {//该活动ID对应的排行榜类型
			return;
		}
		let data = Rank.ins().getRankModel(config[0].rankType) as any
		let rankDataList = [...data._dataList];
		if (rankDataList == null) {
			return
		}
		// console.log(data, rankDataList)
		for (let i = 0, len = rankDataList.length; i < len; i++) {
			let item = rankDataList[i] as RankDataInfo
			item.activityId = this.rankObj[this.activityID]
		}
		// console.log(data, rankDataList)
		// let rankData = GameGlobal.activityData[this.rankObj[this.activityID]]
		let rankData = GameGlobal.activityData[this.activityID]
		this.listData.replaceAll(rankDataList)
		this.labelRank.textFlow = new egret.HtmlTextParser().parse(GlobalConfig.jifengTiaoyueLg.st100403 + `<font color="#008F22">${data.selfPos == 0 ? GlobalConfig.jifengTiaoyueLg.st100086 : data.selfPos}</font>`)
		this.labelCount.textFlow = new egret.HtmlTextParser().parse(GlobalConfig.jifengTiaoyueLg.st102062 + `<font color="#008F22">${data.value}</font>` + GlobalConfig.jifengTiaoyueLg.st100024)

		let config1 = ActivityModel.GetActivityConfig(this.rankObj[this.activityID])
		if (config && rankData) {
			this.date.text = this.getRemindTimeString(rankData.startTime, rankData.endTime);
			this.desc.text = config1.desc
		}
	}

	private updateGoodPool(e) {
		this.price_cost.price = e
	}
	public getRemindTimeString(startTime, endTime) {
		var e = this
		let t = Math.floor(startTime - GameServer.serverTime)
		let i = Math.max(Math.floor(endTime - GameServer.serverTime), 0)
		if (t >= 0) return GlobalConfig.jifengTiaoyueLg.st101885;
		if (0 >= i) return GlobalConfig.jifengTiaoyueLg.st101289;
		var n = Math.floor(i / 86400),
			r = Math.floor(i % 86400 / 3600),
			o = Math.floor(i % 3600 / 60),
			s = n + GlobalConfig.jifengTiaoyueLg.st100006 + r + GlobalConfig.jifengTiaoyueLg.st101518 + o + GlobalConfig.jifengTiaoyueLg.st101519;
		return s
	}

	onTap(e: egret.Event) {

		// console.log(e.target)
		if (this.closeMcCheck.selected) {
			ActivityType31Model.isPlayTween = true;
		} else {
			ActivityType31Model.isPlayTween = false;
		}

		switch (e.currentTarget) {
			case this.buy1:
				this.buyHunt(0);
				break;
			case this.buy10:
				this.buyHunt(1);
				break;
			case this.btn_showRank0: {
				this.currentState = "ranking";
				let config = ActivityType31Data.GetActivityConfig1(this.rankObj[this.activityID]);
				Rank.ins().sendGetRankingData(config[0].rankType)
				let activityWin = ViewManager.ins().getView(ActivityWin);
				if (activityWin instanceof ActivityWin) {
					activityWin.activityGroup.visible = true;
				}
				break;
			}
			case this.btn_showRank: {
				this.currentState = "luck";
				let activityWin = ViewManager.ins().getView(ActivityWin);
				if (activityWin instanceof ActivityWin) {
					activityWin.activityGroup.visible = false;
				}
				break;
			}
			default:
				break;
		}
	}

	buyHunt(type) {
		var config = ActivityType31Data.getConfig(this.activityID);
		var huntOnce = type == 0 && config.huntOnce || config.huntTenth;
		if (Checker.Money(MoneyConst.yuanbao, huntOnce, Checker.YUNBAO_FRAME)) {
			ActivityType31Model.ins().sendHuntOne(type, this.activityID);
			ActivityType31Model.bCanClose = false;
		}
	}

	private huntType = 0;
	private huntReward = [];
	updateRewardData(type, arr) {
		this.updateGoldPool();
		this.huntType = type;
		this.huntReward = arr;
		if (ViewManager.ins().isShow(ActivityType31ResultWin)) {
			GameGlobal.MessageCenter.dispatchImmediate(MessageDef.HUNT_RESULT, [this.huntType, this.huntReward, this.activityID])
		}
		else {

			if (this.closeMcCheck.selected) {
				ViewManager.ins().open(ActivityType31ResultWin, this.huntType, this.huntReward, this.activityID);
				return;
			}
			let index = this.getRewardIndex();
			this.onRollStart(index);
		}
	}

	onRollReset() {
		egret.Tween.removeTweens(this.group_table);
		this.group_table.rotation = 0;
		this.group_table.scaleX = this.group_table.scaleY = 1;
		this.resultImg.visible = false;
	}

	onRollStart(index) {
		this.onRollReset();
		this.buy1.touchEnabled = false;
		this.buy10.touchEnabled = false;
		egret.Tween.get(this.group_table).to({
			rotation: 1440
		}, 1200, egret.Ease.quartIn).to({
			rotation: 1 * (2160 + 36 * index)
		}, 3600, egret.Ease.quartOut).call(this.onRollStop, this)
	}

	onRollStop() {
		egret.Tween.removeTweens(this.group_table);
		this.resultImg.visible = true;
		var e = this;
		TimerManager.ins().doTimer(500, 1, function () {
			ViewManager.ins().open(ActivityType31ResultWin, e.huntType, e.huntReward, e.activityID);
			this.onRollReset();
			e.buy1.touchEnabled = true;
			e.buy10.touchEnabled = true;
			this.warn.visible = false;
			ActivityType31Model.bCanClose = true
		}, this)
	}

	listRefush(datas) {
		this.list.dataProvider = new eui.ArrayCollection(datas);
	};
	listAddData(data) {
		this.list.dataProvider.addItemAt(data, 0)
	}

	private getRewardIndex(): number {
		var config = ActivityType31Data.getConfig(this.activityID);
		var len = config.rewardShow.length;
		var id = this.huntReward[0] ? this.huntReward[0][0] : 0;
		for (let i = 0; i < len; ++i) {
			if (id == config.rewardShow[i].id)
				return i;
		}
		return 0;
	}
}
window["ActivityType31Panel"] = ActivityType31Panel