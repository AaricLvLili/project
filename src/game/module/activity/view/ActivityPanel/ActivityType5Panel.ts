class ActivityType5Panel extends ActivityPanel {
	public constructor() {
		super()
	}

	rewardIndex = -1
	btnMax = 0
	sureBtn1
	list1
	date
	logTime
	sign
	selectBtn
	btn1
	btn2
	btn3
	btn4
	btn5
	btn6
	btn7
	btn8
	btn9
	btn10
	desc
	private ActivityType5Config;

	open() {
		this.updateData()
		this.sureBtn1.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClick, this)
		GameGlobal.MessageCenter.addListener(MessageDef.ACTIVITY_IS_AWARDS, this.updateData, this);
		for (var i = 1; i <= this.btnMax; i++) 
			this["btn" + i].addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClick, this)
	}

	close() {
		this.sureBtn1.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onClick, this)
		GameGlobal.MessageCenter.removeListener(MessageDef.ACTIVITY_IS_AWARDS, this.updateData, this);
		for (var i = 1; i <= this.btnMax; i++) 
			this["btn" + i].removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onClick, this)
	}

	initUI() {
		var config = GlobalConfig.ins("ActivityConfig")[this.activityID];
		this.skinName = config.source1
		this.btnMax = config.params
		this.list1.itemRenderer = ItemBase
	}

	updateData() {
		var e = GameGlobal.activityData[this.activityID];
		this.date.text = e.getRemindTimeString()
		this.desc.text = GlobalConfig.ins("ActivityConfig")[this.activityID].desc
		this.refushBtnReward()
	}

	refushBtnReward(index = 0) {
		var t = <ActivityType5Data>GameGlobal.activityData[this.activityID];
		0 == index && (index = t.logTime, t.logTime || (index = 1))
		if(this.ActivityType5Config == null)
			this.ActivityType5Config = GlobalConfig.ins("ActivityType5Config");
		index > this.ActivityType5Config[this.activityID].length && (index = 1)
		this.rewardIndex = index;
		var i = this.ActivityType5Config[this.activityID][this.rewardIndex - 1 + ""];
		this.list1.dataProvider = new eui.ArrayCollection(i.rewards)
		this.selectBtn && (this.selectBtn.currentState = "up")
		this.selectBtn = this["btn" + index]
		this.selectBtn.currentState = "down"
		index <= t.logTime 
			? t.checkOneDayStatu(index) 
				? (this.sign.visible = !1, this.sureBtn1.visible = !0) 
				: (this.sign.visible = !0, this.sureBtn1.visible = !1) 
			: (this.sign.visible = !1, this.sureBtn1.visible = !1)
	}

	onClick(e) {
		switch (e.currentTarget) {
			case this.sureBtn1:
				// GameGlobal.ControllerManager.GameGloballyFunc(ControllerConst.Activity, ActivityFunc.SEND_ACTIVITY_REWARD, this.activityID, this.rewardIndex);
				ActivityModel.ins().sendReward(this.activityID, this.rewardIndex)
				break;
			case this.btn1:
				this.refushBtnReward(1);
				break;
			case this.btn2:
				this.refushBtnReward(2);
				break;
			case this.btn3:
				this.refushBtnReward(3);
				break;
			case this.btn4:
				this.refushBtnReward(4);
				break;
			case this.btn5:
				this.refushBtnReward(5);
				break;
			case this.btn6:
				this.refushBtnReward(6);
				break;
			case this.btn7:
				this.refushBtnReward(7);
				break;
			case this.btn8:
				this.refushBtnReward(8);
				break;
			case this.btn9:
				this.refushBtnReward(9);
				break;
			case this.btn10:
				this.refushBtnReward(10)
		}
	}
}
window["ActivityType5Panel"]=ActivityType5Panel