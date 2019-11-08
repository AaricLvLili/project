class Activity301Panel extends BaseView implements ICommonWindowTitle {

	public m_MainBtn: eui.Button;
	public m_ItemList: eui.List;
	public m_StateTile: eui.Label;
	public m_BtnList: eui.List;
	public m_MainLab: eui.Label;

	private listData: eui.ArrayCollection;
	private btnListData: eui.ArrayCollection;


	public static selectIndex: number = 0;

	private state: RewardState;

	public m_GetImg: eui.Image;

	windowTitleIconName: string = GlobalConfig.jifengTiaoyueLg.st101273;

	public m_TimeLab: eui.Label;

	public constructor() {
		super()
	}

	public createChildren() {
		super.createChildren();
		this.skinName = "Activity301PanelSkin";
		this.m_ItemList.itemRenderer = ItemBase;
		this.listData = new eui.ArrayCollection();
		this.m_ItemList.dataProvider = this.listData;

		this.m_BtnList.itemRenderer = Activity301Btn;
		this.btnListData = new eui.ArrayCollection();
		this.m_BtnList.dataProvider = this.btnListData;
	}

	initUI() {

	}

	open(e) {
		this.initData()
		GameGlobal.MessageCenter.addListener(MessageDef.UPDATE_ACTIVITY_PANEL, this.updateView, this);
		this.m_MainBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClick, this);
		this.addTime();
	}

	close() {
		GameGlobal.MessageCenter.removeListener(MessageDef.UPDATE_ACTIVITY_PANEL, this.updateView, this);
		this.m_MainBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onClick, this);
		Activity301Panel.selectIndex = 0;
		this.removeTime();
	}

	public addTime() {
		this.removeTime();
		TimerManager.ins().doTimer(1000, 0, this.playTime, this);
		this.playTime();
	}
	public removeTime() {
		TimerManager.ins().remove(this.playTime, this);
	}

	private playTime() {
		let data = GameGlobal.activityData[301]
		if (data) {
			this.m_TimeLab.text = GlobalConfig.jifengTiaoyueLg.st100025 + DateUtils.getFormatBySecond(data.endTime - GameServer.serverTime, DateUtils.TIME_FORMAT_5, 4)
		}
	}

	onChange() {
		this.initData()
	}

	updateView() {
		this.initData()
	}

	private initData() {
		var activityData = <ActivityType10Data>GameGlobal.activityData[301];
		let config = ActivityType10Data.getConfig(301);
		this.btnListData.removeAll();
		this.btnListData.replaceAll(config);
		let configData = config[Activity301Panel.selectIndex];
		this.listData.removeAll();
		this.listData.replaceAll(configData.rewards);
		let index = configData["index"];
		let state = activityData.GetRewardState(index);
		this.state = state;
		this.m_MainBtn.visible = true;
		this.m_GetImg.visible = false;
		switch (state) {
			case RewardState.NotReached:
				this.m_MainBtn.label = GlobalConfig.jifengTiaoyueLg.st101345;
				break;
			case RewardState.CanGet:
				this.m_MainBtn.label = GlobalConfig.jifengTiaoyueLg.st101076;
				break;
			case RewardState.Gotten:
				this.m_MainBtn.visible = false;
				this.m_GetImg.visible = true;
				break;
			case RewardState.Undo:
				this.m_MainBtn.label = GlobalConfig.jifengTiaoyueLg.st101346;
				break;
		}
		this.m_MainLab.textFlow = TextFlowMaker.generateTextFlow(GlobalConfig.jifengTiaoyueLg.st101347 + this.GetStr(activityData, configData));
		this.m_StateTile.text = configData.tips3
	}

	private GetStr(activityData: ActivityType10Data, data) {
		if (activityData.recharge >= data.yuanbao)
			return `|C:0x00ff00&T:(${activityData.recharge}/${data.yuanbao})|`
		else
			return `|C:0xf87372&T:(${activityData.recharge}/${data.yuanbao})|`
	}

	private onClick() {
		switch (this.state) {
			case RewardState.NotReached:
				ViewManager.ins().open(ChargeFirstWin);
				break;
			case RewardState.CanGet:
				let config = ActivityType10Data.getConfig(301);
				let configData = config[Activity301Panel.selectIndex];
				ActivityModel.ins().sendReward(configData.Id, configData.index)
				break;
		}
	}

	UpdateContent(): void {

	}
}
window["Activity301Panel"] = Activity301Panel