class DayTargetPanel extends eui.Component {
	public constructor() {
		super()
		this.skinName = "DayTargetPanelSkin"
	}

	private readonly type: number = 4;
	private descTf: eui.Label;
	private timeTf: eui.Label;
	private dabiaoConfig;
	private list: eui.List;
	public static _curActId: number;
	private rankBtn: eui.Button;
	private updateBtn: eui.Button;

	public childrenCreated() {
		this.list.itemRenderer = DayTargetItemRenderer;
	}

	sendDabiaoInfo() {
		if (DayTargetPanel.curActId > 0) {
			ActivityModel.ins().sendDabiaoInfo(DayTargetPanel.curActId)
		}
	}

	public static get curActId(): number {
		var datas: any = GameGlobal.activityModel.getbtnListByType(ActivityModel.BTN_TYPE_01);
		var data: any;
		for (var info in datas) {
			if (datas[info].actType == 4) {
				data = datas[info];
				break;
			}
		}
		if (data == null) return 0;
		else return data.id;
	}


	updateData() {
		var data: ActBtnData[] = GameGlobal.activityModel.getbtnListByType(ActivityModel.BTN_TYPE_01);
		for (var info of data) {
			if (info.actType == this.type) {
				break;
			}
		}


		var config = GlobalConfig.ins("ActivityType4Config")[info.id];
		var value: any[] = [];
		for (var key in config) {
			if (config[key].ranking == 0) {
				value = config[key].value;
				this.dabiaoConfig = config[key];
				break;
			}
		}
		if (this.dabiaoConfig == null) return

		config = GameGlobal.activityData[info.id];
		var time: string = "";
		var des: string = "";
		if (config) {
			time = GlobalConfig.jifengTiaoyueLg.st101338 + `${config.getRemindTimeString()}`;
			des = ActivityModel.GetActivityConfig(info.id).desc;
		}
		this.descTf.text = des;
		this.timeTf.text = time + "";

		var curIdx: number = this.GetRecentConfig();
		var tempArr = this.dabiaoConfig.value.slice(Math.min(curIdx, this.dabiaoConfig.value.length - 2), Math.min(curIdx + 2, this.dabiaoConfig.value.length));

		var tempArr2: any[] = [];
		var obj: any;
		var num: number = Math.min(curIdx, this.dabiaoConfig.value.length - 2);
		for (var i: number = 0; i < tempArr.length; i++) {
			obj = {};
			obj.rewards = tempArr[i].rewards;
			obj.value = tempArr[i].value;
			obj.desc = this.dabiaoConfig.taskTips;
			obj.state = this.getCurStatus(num, obj.value); //NotReached = 0, // 未达成CanGet = 1,		// 可以领取Gotten = 2,		// 已经领取Undo = 3,		// 不能完成
			num++;
			tempArr2[i] = obj;
		}

		this.list.dataProvider = new eui.ArrayCollection(tempArr2);
	}

	public open() {
		GameGlobal.MessageCenter.addListener(MessageDef.ACTIVITY4_IS_GET_AWARDS, this.sendDabiaoInfo, this);//领取刷新
		GameGlobal.MessageCenter.addListener(MessageDef.ACTIVITY4_UPDATE, this.updateData, this);
		this.rankBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClick, this);
		this.updateBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClick, this);
		this.sendDabiaoInfo();
		this.rankBtn.visible = !WxSdk.ins().isHidePay();
	}

	private onClick(e: egret.TouchEvent): void {
		if (e.currentTarget == this.rankBtn) {
			ViewManager.ins().open(ActivityWinSummer, ActivityModel.BTN_TYPE_01);
		} else if (e.currentTarget == this.updateBtn && this.dabiaoConfig.gainWay) {
			ViewManager.Guide(this.dabiaoConfig.gainWay[0], this.dabiaoConfig.gainWay[1]);
		}
	}

	/** 获取当前可领取的索引，或者当前需要显示的配置奖励*/
	private GetRecentConfig(): number {
		let activityModel = GameGlobal.activityModel;
		let index = activityModel.indexCurrDabiao
		for (let i = activityModel.indexCurrDabiao; i > 0; --i) {
			if (!BitUtil.Has(activityModel.isDaBiao, i)) {
				index = i - 1;
			}
		}
		return index;
	}

	/** 计算出状态是否可以领取*/
	private getCurStatus(index: number, value: number): RewardState {
		let activityModel = GameGlobal.activityModel;
		var index = index + 1;//服务器索引从1开始，这里加1，对应计算
		// for (let i = 1; i <= index + 2; ++i) {
		if (!BitUtil.Has(activityModel.isDaBiao, index) && GameGlobal.activityModel.myDabiaoInfo >= value) {
			return RewardState.CanGet;
		}
		// }
		if (activityModel.indexCurrDabiao >= index) {
			return RewardState.Gotten;
		}
		return RewardState.NotReached;
	}

	public close() {
		GameGlobal.MessageCenter.removeListener(MessageDef.ACTIVITY4_IS_GET_AWARDS, this.sendDabiaoInfo, this);//领取刷新
		GameGlobal.MessageCenter.removeListener(MessageDef.ACTIVITY4_UPDATE, this.updateData, this);
		this.rankBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onClick, this);
		this.updateBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onClick, this);
	}
}
window["DayTargetPanel"] = DayTargetPanel