//合服活动特惠礼包
class Activity2Panel3 extends eui.Component {

	_index = 0
	public constructor() {
		super()
	}

	activityID
	date
	config
	get_2
	get_3
	list
	get_4
	buyBtn
	desc
	chosen
	get_1

	isInit
	type_1
	type_4
	type_2
	type_3
	tips: eui.Label;
	public m_Lan1: eui.Label;

	init() {
		this.skinName = "ActGiftSkin"
		this.list.itemRenderer = ActivityItemShow
		this.m_Lan1.text = GlobalConfig.jifengTiaoyueLg.st101468;
		this.buyBtn.label = GlobalConfig.jifengTiaoyueLg.st101282;
	}

	open(arg2) {
		for (var e = [], t = 0; t < arguments.length; t++) e[t] = arguments[t];
		this.isInit || this.init(), this.buyBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this), this.type_1.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this), this.type_2.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this), this.type_3.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this), this.type_4.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this), this.updateData()
	}

	close() {
		for (var e = [], t = 0; t < arguments.length; t++) e[t] = arguments[t];
		this.buyBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this), this.type_1.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this), this.type_2.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this), this.type_3.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this), this.type_4.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this)
	}

	onTap(e) {
		var t, i = this;
		switch (e.currentTarget) {
			case this.buyBtn:
				t = -1, this.config.vip && GameGlobal.actorModel.vipLv < this.config.vip ? UserTips.ins().showTips(GlobalConfig.jifengTiaoyueLg.st100913) : GameGlobal.actorModel.yb >= (this.config.price) ? WarnWin.show("确定消耗" + this.config.price + "钻石购买特惠商品吗？", function () {
					// App.ControllerManager.applyFunc(ControllerConst.Activity, ActivityFunc.SEND_ACTIVITY_REWARD, i.activityID, i._index + 1)
					ActivityModel.ins().sendReward(i.activityID, i.getRewardIndex(i._index) + 1)
				}, this) : UserTips.ins().showTips(GlobalConfig.jifengTiaoyueLg.st100008);
				break;
			case this.type_1:
				t = 0;
				break;
			case this.type_2:
				t = 1;
				break;
			case this.type_3:
				t = 2;
				break;
			case this.type_4:
				t = 3
		} - 1 != t && this.updateDataByTap(t)
	}

	updateDataByTap(t) {
		this._index = t;
		this.updateData();
	}

	selectPos = [22, 130, 240, 350];
	updateData() {

		var activityData = <ActivityType2Data>GameGlobal.activityData[this.activityID];
		this.date.text = GlobalConfig.jifengTiaoyueLg.st100025 + activityData.getRemindTimeString()
		this.config = activityData.GetConfigData()[this.getRewardIndex(this._index)]
		this.list.dataProvider = new eui.ArrayCollection(this.config.rewards)

		let discountStr = this.config.discount.replace("discount_", "")
		let discount;
		if (discountStr[1] == "0") {
			discount = discountStr[0]
		} else {
			discount = discountStr[0] + "." + discountStr[1]
		}
		let str1 = StringUtils.addColor(`7`, 0xff7e06);
		let str2 = StringUtils.addColor(` ${discount}`, 0xff7e06);
		let str3 = StringUtils.addColor(`${this.config.price}`, 0xff7e06);
		this.desc.textFlow = TextFlowMaker.generateTextFlow(LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st101467, [str1, str2, str3]));

		this.chosen.x = this.selectPos[this._index];

		this.get_1.visible = !this.canbuyState(0);
		this.get_2.visible = !this.canbuyState(1);
		this.get_3.visible = !this.canbuyState(2);
		this.get_4.visible = !this.canbuyState(3);

		this.buyBtn.visible = this.canbuyState(this._index);
		this.tips.visible = !this.buyBtn.visible;
	}

	private indexArray = [[0, 2], [3, 5], [6, 8], [9, 11]];
	private canbuyState(index: number): boolean {
		var activityData = <ActivityType2Data>GameGlobal.activityData[this.activityID];
		for (var i = this.indexArray[index][0]; i <= this.indexArray[index][1]; i++) {
			if (activityData.buyData[i] > 0) {
				return true;
			}
		}
		return false;
	}

	private getRewardIndex(index: number): number {
		var activityData = <ActivityType2Data>GameGlobal.activityData[this.activityID];
		for (var i = this.indexArray[index][0]; i <= this.indexArray[index][1]; i++) {
			if (activityData.buyData[i] > 0) {
				return i;
			}
		}
		return this.indexArray[index][1];
	}

}
window["Activity2Panel3"] = Activity2Panel3