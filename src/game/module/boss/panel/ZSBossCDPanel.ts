class ZSBossCDPanel {
	public static Show(autoClear: boolean, callback = null) {
		let comp = new eui.Component as any
		comp.skinName = "ZSBossCDSkin"
		let label: eui.Label = comp.label
		WarnWin.isRelease = true;
		label.textFlow = (new egret.HtmlTextParser).parser(GlobalConfig.jifengTiaoyueLg.st101891)
		comp.check.selected = autoClear
		comp.check.addEventListener(egret.Event.CHANGE, () => {
			GameGlobal.ZsBossModel.autoClear = comp.check.selected
			if (comp.check.selected) {
				UserTips.ins().showTips(GlobalConfig.jifengTiaoyueLg.st101392)
			}
		}, null)

		WarnWin.ShowContent(comp, () => {
			if (GameGlobal.ZsBossModel.checkIsMoreMoney()) {
				GameGlobal.ZsBossModel.autoClear = comp.check.selected
				if (callback) {
					callback()
				} else {
					ZsBoss.ins().sendBuyCd()
				}
			}
		}, null)
	}
}
window["ZSBossCDPanel"] = ZSBossCDPanel