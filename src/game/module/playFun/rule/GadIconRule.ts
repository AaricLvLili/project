class GadIconRule extends RuleIconBase {
	public constructor(t) {
		super(t)
		this.firstTap = true
		this.updateMessage = [
			MessageDef.OPEN_SERVER
		]
		
	}

	checkShowIcon() {
		return true;
	}

	checkShowRedPoint() {
		// let isShow: boolean = false;
		// if (GadModel.getInstance.checkAllRoleCanChangeItem() || GadModel.getInstance.checkAllRoleCanLvUp()) {
		// 	isShow = true;
		// }
		// return isShow;
		return Deblocking.IsRedDotGadrBtn()
	}

	getEffName(e) {
		// return this.DefEffe(e)
	}

	tapExecute() {
		GuideUtils.ins().next(this);
		if (!Deblocking.Check(DeblockingType.TYPE_62)) {
			return
		}
		ViewManager.ins().open(GadWin);
		this.firstTap = false
		this.update()
	}
}
window["GadIconRule"]=GadIconRule