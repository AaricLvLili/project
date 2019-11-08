
class DartCarReportInfoItem extends eui.ItemRenderer {
	public constructor() {
		super()
		this.skinName = "KDReportItemSkin"
	}

	infoData: Sproto.biaoche_record_info
	time
	info
	revenge: eui.Label

	childrenCreated() {
		this.revenge.textFlow = (new egret.HtmlTextParser).parser("<u>" + GlobalConfig.jifengTiaoyueLg.st100560 + "</u>")
		this.revenge.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this)
	}

	dataChanged() {
		this.revenge.visible = false
		this.infoData = this.data;
		var e = GlobalConfig.ins("BiaoCheTypeConfig")[this.infoData.biaocheType];
		if (e) {
			switch (this.time.text = DateUtils.GetFormatSecond(this.infoData.robTime, 8), this.infoData.type) {
				case 1:
					this.info.text = GlobalConfig.jifengTiaoyueLg.st100833 + e.name
					break;
				case 2:
					this.infoData.robResult
						? (this.info.text = LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st100834, [e.name, this.infoData.roberName]), this.revenge.visible = true)
						: (this.info.text = this.infoData.roberName + LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st100835, [e.name]));
					break;
				case 3:
					this.infoData.robResult ? this.info.text = LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st100836, [this.infoData.roberName]) + e.name
						: this.info.text = LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st100837, [this.infoData.roberName,e.name]);
					break;
			}
		} else ErrorLog.Assert(e, "DartCarReportInfoItem     cfg   " + this.infoData.biaocheType)
	}

	destruct() {
		this.revenge.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this)
	}

	onTap() {
		return this.infoData.isRevenge ? void UserTips.ins().showTips(GlobalConfig.jifengTiaoyueLg.st100838) : void ViewManager.ins().open(DartCarRevengeWin, this.infoData)
	}
}
window["DartCarReportInfoItem"] = DartCarReportInfoItem