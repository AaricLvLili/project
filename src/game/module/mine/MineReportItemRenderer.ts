class MineReportItemRenderer extends eui.ItemRenderer {
	public constructor() {
		super()
		this.skinName = "KDReportItemSkin"
	}

	infoData: Sproto.mine_record_info
	time
	info
	revenge: eui.Label

	childrenCreated() {
		this.revenge.textFlow = (new egret.HtmlTextParser).parser("<u>"+GlobalConfig.jifengTiaoyueLg.st101729+"</u>")
		this.revenge.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this)
	}

	dataChanged() {
		this.revenge.visible = false
		this.infoData = this.data;
		var e = GameGlobal.mineModel.getCfgByType(this.infoData.mineType);
		if (e) {
			switch (this.time.text = DateUtils.GetFormatSecond(this.infoData.robTime, 8), this.infoData.type) {
				case 1:
					this.info.text = "开始采集" + e.name
					break;
				case 2:
					this.infoData.robResult 
							? (this.info.text = this.infoData.roberName +GlobalConfig.jifengTiaoyueLg.st100562 + e.name, this.revenge.visible = true) 
							: (this.info.text = this.infoData.roberName + GlobalConfig.jifengTiaoyueLg.st100562 + e.name + GlobalConfig.jifengTiaoyueLg.st101706+"。");
					break;
				case 3:
					this.infoData.robResult ? this.info.text =LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st101770,[ this.infoData.roberName,e.name])  :
					  this.info.text = LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st101771,[ this.infoData.roberName,e.name ])
					 
					break
				case 4://别人偷了我的
					this.infoData.robResult 
						? (this.info.text = LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st101772,[ this.infoData.roberName,e.name ])) 
						: (this.info.text = LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st101773,[ this.infoData.roberName,e.name ]));
					break ;
				case 5://我偷别人的
					this.infoData.robResult 
						? (this.info.text =LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st101774,[ this.infoData.roberName,e.name ])) 
						: (this.info.text = LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st101775,[ this.infoData.roberName,e.name ]));

					break ;		
			}
		} else ErrorLog.Assert(e, "MineReportItemRenderer     cfg   " + this.infoData.mineType)
	}

	destruct() {
		this.revenge.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this)
	}

	onTap() {
		return this.infoData.isRevenge ? void UserTips.ins().showTips(GlobalConfig.jifengTiaoyueLg.st100838) : void ViewManager.ins().open(MineRevengeWin, this.infoData)
	}
}
window["MineReportItemRenderer"]=MineReportItemRenderer