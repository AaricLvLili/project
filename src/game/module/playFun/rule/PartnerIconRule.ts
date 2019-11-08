class PartnerIconRule extends RuleIconBase {
	public constructor(type) {
		super(type)
		this.firstTap = true
		this.updateMessage = [MessageDef.LEVEL_CHANGE, MessageDef.VIP_LEVEL_CHANGE, MessageDef.SUB_ROLE_CHANGE]
	}

	checkShowIcon() {
		if(WxSdk.ins().isHidePay())
		{
			return false;
		}
		return PartnerIconRule.CheckShow()
	}

	checkShowRedPoint() {
		var e = GameGlobal.rolesModel.length,
			t = GlobalConfig.ins("NewRoleConfig")[e];
		if (!t) return 0;
		var i = t.zsLevel ? GameGlobal.zsModel.lv : GameGlobal.actorModel.level,
			n = t.zsLevel ? t.zsLevel : t.level;
		return i >= n || GameGlobal.actorModel.vipLv >= t.vip ? 1 : 0
	}
	getEffName (e) {
		return this.DefEffe(e)
	}
	tapExecute () {
		this.firstTap = false
		if (SubRoles.ins().subRolesLen >= 3) {
			UserTips.ins().showTips("全部职业已解锁")
			return
		}
		GameGlobal.ViewManager.open(NewRoleWin)
	}

	public static CheckShow() {
		return GameGlobal.rolesModel.length < SubRoles.MAX_COUNT
	}
}
window["PartnerIconRule"]=PartnerIconRule