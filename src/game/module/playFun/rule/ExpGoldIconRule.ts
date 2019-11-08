class ExpGoldIconRule extends RuleIconBase {

	firstTap

	public constructor(t) {
		super(t)
		this.firstTap = !0, this.updateMessage = [MessageDef.LEVEL_CHANGE, MessageDef.UPDATA_VIP_AWARDS, MessageDef.VIP_LEVEL_CHANGE]
	}

	checkShowIcon() {
		// if (StartGetUserInfo.isOne || StartGetUserInfo.isUsa) {
		// 	return false;
		// }
		// return !GameGlobal.vipModel.GetRewardState(3) && GameGlobal.actorModel.level >= 10
		return false //暂时屏蔽。配置有误
	}

	checkShowRedPoint() {
		return UserVip.ins().lv >= 3 && !UserVip.ins().GetRewardState(3)
	}

	getEffName(e) {
		return this.firstTap ? this.DefEffe(e) : void 0
	}

	tapExecute() {
		ViewManager.ins().open(VIP3WIn), this.firstTap = !1, this.update()
	}
}
window["ExpGoldIconRule"]=ExpGoldIconRule