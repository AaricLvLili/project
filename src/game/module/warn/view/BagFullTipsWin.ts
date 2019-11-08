class BagFullTipsPanel {
	public static CheckOpen(count) {
		if (UserBag.ins().getSurplusCount() < count) {
			BagFullTipsPanel.Open()
			return false
		}
		return true
	}

	public static Open() {
		WarnWin.show(GlobalConfig.jifengTiaoyueLg.st101897, () => {
			ViewManager.ins().open(SmeltEquipTotalWin);
		}, this, null, null, "sure", {
				btnName: GlobalConfig.jifengTiaoyueLg.st101896
			})
	}
	//打开熔炼界面，但不关闭自己原来的界面，寻宝功能需要用到
	public static OpenNoCloseMe() {
		WarnWin.show(GlobalConfig.jifengTiaoyueLg.st101897, () => {
			ViewManager.ins().openEasy(SmeltEquipTotalWin);
		}, this, null, null, "sure", {
				btnName: GlobalConfig.jifengTiaoyueLg.st101896
			})
	}
}

window["BagFullTipsPanel"] = BagFullTipsPanel