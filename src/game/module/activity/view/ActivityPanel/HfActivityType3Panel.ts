class HfActivityType3Panel extends ActivityPanel{

	private currIndex: number = 0
	private group:eui.Group;
	private list:eui.List;
	private stateImg:eui.Image;
	private getBtn:eui.Button;
	private dayNum:eui.Label;

	private m_DayItem: {
		stateImg: eui.Image,
		select: eui.Image,
		dayimg: eui.Label,
		stateImg2: eui.Image,
		m_ItemList:eui.DataGroup;

	}[]

	public constructor() {
		super()
	}

	initUI() {
		this.skinName = "HfActivityType3Skin";
		this.m_DayItem = this.group.$children as any;
		this.list.itemRenderer = ItemBase;
	}

	open(e) 
	{
		let config = GlobalConfig.ins("ActivityType3Config")[this.activityID];
		for (let i = 0; i < 3; i++) {
			let comp = this.group.getChildAt(i)
			comp.addEventListener(egret.TouchEvent.TOUCH_TAP, this._ClickBox, this);
			this.m_DayItem[i].dayimg.text = `连充${config[i]["day"]}天`;
			this.m_DayItem[i].stateImg.source = "comp_64_61_01_png";
			this.m_DayItem[i].stateImg.visible = true;
			this.m_DayItem[i].stateImg.x = 18;
			this.m_DayItem[i].stateImg.y = 40;
			this.m_DayItem[i].stateImg2.visible = false;
			this.m_DayItem[i].m_ItemList.visible = false;
		}

		this.getBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.getReward, this);
		GameGlobal.MessageCenter.addListener(MessageDef.UPDATE_ACTIVITY_PANEL, this._UpdateRewards, this)
		this.selectBoxHandle();
	}

	close() {
		for (let i = 0; i < 3; i++) {
			this.group.getChildAt(i).removeEventListener(egret.TouchEvent.TOUCH_TAP, this._ClickBox, this);
		}

		this.getBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.getReward, this);
		GameGlobal.MessageCenter.removeListener(MessageDef.UPDATE_ACTIVITY_PANEL, this._UpdateRewards, this)
	}

	private getReward(e: egret.TouchEvent): void {
		ActivityModel.ins().sendReward(17, this.currIndex + 1);
	}

	private _ClickBox(e: egret.TouchEvent): void {
		this.selectBoxHandle(this.group.getChildIndex(e.target));
	}

	private selectBoxHandle(index:number=0):void
	{
		this.m_DayItem[this.currIndex].select.visible = false;
		this.currIndex = index;
		let dayItem = this.m_DayItem[this.currIndex];
		dayItem.select.visible = true;
		this._UpdateRewards();
	}

	private _UpdateRewards() {
		let config = GlobalConfig.ins("ActivityType3Config")[this.activityID];
		this.list.dataProvider = new eui.ArrayCollection(RewardData.ToRewardDatas(config[this.currIndex]["rewards"]));

		var activityData = <ActivityType3Data>GameGlobal.activityData[this.activityID];
		this.dayNum.text = `连充天数：${activityData.dabiao}`;
		let state = activityData.GetRewardState(config[this.currIndex]["index"]);
		this.getBtn.enabled = RewardState.CanGet == state;
		this.getBtn.visible =   state != RewardState.Gotten; 
		this.stateImg.visible = state == RewardState.Gotten;
	}

}
window["HfActivityType3Panel"]=HfActivityType3Panel