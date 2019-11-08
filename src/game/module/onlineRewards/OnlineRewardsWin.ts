class OnlineRewardsWin extends BaseEuiPanel implements ICommonWindowTitle {
	public constructor() {
		super();
		this.skinName = "OnlineRewardsWinSkin";
	}

	windowTitleIconName: string = GlobalConfig.jifengTiaoyueLg.st101070;
	private commonWindowBg: CommonWindowBg;
	//private itemList:eui.List;
	// private onlineDec:eui.Label;
	// private btnGet:eui.Button;
	// private labelGet:eui.Image;
	// private labelGo:eui.Label;
	private listTop: eui.List;
	private onlineTime: eui.Label;
	private configList;

	initUI() {
		this.configList = [];
		var config = GlobalConfig.ins("OnLineRewardConfig");
		for (var key in config) {
			//if(parseInt(key) != OnlineRewardsModel.VIPREWARD_ID)//排除vip奖励
			this.configList.push(config[key]);
		}
		//this.itemList.itemRenderer = ItemBaseEffe;
		this.listTop.itemRenderer = OnlineRewardsItem;
	}

	open(...param: any[]) {
		this.commonWindowBg.OnAdded(this, param[0] || 0);
		this.observe(MessageDef.ONLINE_REWARDS_STATE, this.UpdateContent);
		//this.AddClick(this.btnGet,this.onClick);

		OnlineRewardsModel.ins().sendOnlineRewardsList();
		TimerManager.ins().doTimer(1000, 0, this.updateTime, this);
		this.updateTime();
	}

	close() {
		this.commonWindowBg.OnRemoved();
		this.removeEvents();
		this.removeObserve();

		TimerManager.ins().remove(this.updateTime, this);
		var len = this.listTop.numChildren;
		for (var i = 0; i < len; i++) {
			let child = this.listTop.getChildAt(i);
			if (child instanceof OnlineRewardsItem) {
				child.destroy();
			}
		}
	}

	UpdateContent(): void {
		// var config = GlobalConfig.ins("OnLineRewardConfig")[1];//vip在线奖励
		// this.onlineDec.textFlow = TextFlowMaker.generateTextFlow("累计在线时间达" + StringUtils.addColor(config.time + "分钟", Color.Green) 
		// + "后可领取奖励");
		// this.itemList.dataProvider = new eui.ArrayCollection(RewardData.ToRewardDatas(config.reward));
		// var vipRewardState = OnlineRewardsModel.ins().rewardDataList[OnlineRewardsModel.VIPREWARD_ID-1];
		// this.btnGet.visible = onlineRewardState.ONLINETYPE0 == vipRewardState;
		// this.labelGet.visible = onlineRewardState.ONLINETYPE1 == vipRewardState;
		// this.labelGo.visible = onlineRewardState.ONLINETYPE2 == vipRewardState;

		this.configList.sort(this.sortFun);
		this.listTop.dataProvider = new eui.ArrayCollection(this.configList);
	}

	private sortFun(aItem, bItem) {
		var info1 = OnlineRewardsModel.ins().rewardDataList[aItem.id - 1];
		var info2 = OnlineRewardsModel.ins().rewardDataList[bItem.id - 1];
		if (info1 == onlineRewardState.ONLINETYPE1)
			return 1;
		if (info2 != onlineRewardState.ONLINETYPE1)
			return -1;
		return 0;
	}

	private updateTime(): void {
		let totalTimes = DateUtils.GetFormatSecond(OnlineRewardsModel.ins().totalTime, DateUtils.TIME_FORMAT_9);
		this.onlineTime.text = LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st101071, [totalTimes]);
		// if(this.labelGo.visible)
		// {
		// 	var config = GlobalConfig.ins("OnLineRewardConfig")[OnlineRewardsModel.VIPREWARD_ID];
		// 	let vipTimes = DateUtils.GetFormatSecond(config.time*60 - OnlineRewardsModel.ins().totalTime, DateUtils.TIME_FORMAT_1);
		// 	this.labelGo.text = vipTimes + "后可领取";
		// }
	}

	// private onClick(evt):void
	// {
	// 	OnlineRewardsModel.ins().sendGetOnlineRewards(OnlineRewardsModel.VIPREWARD_ID);
	// }

}

ViewManager.ins().reg(OnlineRewardsWin, LayerManager.UI_Main);
enum onlineRewardState {
	/**可以领取 */
	ONLINETYPE0 = 0,
	/**已经领取 */
	ONLINETYPE1 = 1,
	/**不能领取 */
	ONLINETYPE2 = 2,
}

class OnlineRewardsItem extends eui.ItemRenderer {
	public constructor() {
		super()
		this.skinName = "AchieveItemSkin"
	}
labelGo
	public childrenCreated() {
		this.list.itemRenderer = ItemBaseEffe;
		this.btnGet.addEventListener(egret.TouchEvent.TOUCH_TAP, this.OnClick, this);
		this.btnGet.label=GlobalConfig.jifengTiaoyueLg.st101076;
		this.labelGo.text=GlobalConfig.jifengTiaoyueLg.st101077;
	}

	labelUndo
	labelInfo
	list: eui.List
	btnGet

	private OnClick(e: egret.TouchEvent) {
		let count = 0
		for (let item of this.data.reward) {
			if (item.type == 2) {
				count += item.count
			}
		}
		if (UserBag.ins().getSurplusCount() < count) {
			var t = GlobalConfig.jifengTiaoyueLg.st101072;
			UserTips.ins().showTips(t);
			return;
		}
		OnlineRewardsModel.ins().sendGetOnlineRewards(this.data.id);
	}

	dataChanged() {
		var data = this.data;
		var rewardState = OnlineRewardsModel.ins().rewardDataList[data.id - 1];
		this.currentState = (rewardState + 1) + "";
		this.list.dataProvider = new eui.ArrayCollection(RewardData.ToRewardDatas(data.reward));
		this.labelInfo.textFlow = TextFlowMaker.generateTextFlow(LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st101073, [StringUtils.addColor(data.time + GlobalConfig.jifengTiaoyueLg.st101074, Color.Green)]));
		if (rewardState == onlineRewardState.ONLINETYPE2) {
			this.updateItemTime();
			TimerManager.ins().doTimer(1000, 0, this.updateItemTime, this);
		}
	}

	updateItemTime() {
		let vipTimes = DateUtils.GetFormatSecond(this.data.time * 60 - OnlineRewardsModel.ins().totalTime, DateUtils.TIME_FORMAT_1);
		this.labelUndo.text = LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st101075, [vipTimes]);
	}

	public destroy(): void {
		TimerManager.ins().remove(this.updateItemTime, this);
		// this.btnGet.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.OnClick, this)
		var len = this.list.numChildren;
		for (var i = 0; i < len; i++) {
			let child = this.list.getChildAt(i);
			if (child instanceof ItemBase) {
				child.destroy();
			}
		}
	}
}
window["OnlineRewardsWin"] = OnlineRewardsWin
window["OnlineRewardsItem"] = OnlineRewardsItem