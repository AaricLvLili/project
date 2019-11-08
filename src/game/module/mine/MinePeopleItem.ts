class MinePeopleItem extends egret.DisplayObjectContainer {

	endSecond = 0
	mineType: eui.Image

	mineBody: MovieClip
	nameLabel
	endTime
	isRob: MovieClip

	info: MineListInfo
	private caiKuangConfig: any;

	constructor() {
		super()

		this.mineType = new eui.Image
		this.mineType.x = 8

		this.addChild(this.mineType)
		this.mineBody = new MovieClip
		this.mineBody.x = -20
		this.mineBody.y = 30
		this.mineBody.touchEnabled = !0
		this.addChild(this.mineBody)
		this.nameLabel = new eui.Label
		this.nameLabel.fontFamily = "Microsoft YaHei"
		this.nameLabel.size = 16
		this.nameLabel.x = -50
		this.nameLabel.y = -55
		this.endTime = new eui.Label
		this.endTime.size = 16
		this.endTime.fontFamily = "Microsoft YaHei"
		this.endTime.x = -24
		this.endTime.y = -72
		this.endTime.textColor = 4381465
		this.isRob = new MovieClip
		this.isRob.touchEnabled = !0
		this.isRob.x = 40
		this.isRob.y = -30

	}

	setMineInfo(mineListInfo: MineListInfo) {
		this.info = mineListInfo, this.nameLabel.text = mineListInfo.name + GlobalConfig.jifengTiaoyueLg.st100866, this.nameLabel.x = -50 + (120 - this.nameLabel.textWidth) / 2;
		// var t = DateUtils.formatMiniDateTime(e.surplusTime),
		var t = (mineListInfo.surplusTime)
		let config = MineModel.ins().getCfgByType(this.info.type);
		if (config) {
			this.endSecond = t
		} else {
			ErrorLog.Assert(config, "MinePeopleItem    setMineInfo      cfg" + this.info.type)
		}
		this.endTime.text = DateUtils.getFormatBySecond(this.endSecond, DateUtils.TIME_FORMAT_5)
		TimerManager.ins().doTimer(1e3, this.endSecond, this.refushTime, this)
		this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.attrOther, this)
		mineListInfo.acId == GameGlobal.actorModel.actorID ? this.nameLabel.textColor = 4381465 : this.nameLabel.textColor = 16767011
		mineListInfo.isAtt
			? (this.isRob.loadUrl(ResDataPath.MINE_ROB_EFFE, !0), this.addChildAt(this.isRob, 2))
			: (this.isRob.stop(), DisplayUtils.removeFromParent(this.isRob))
		this.setLookInfo(mineListInfo.type, !0)
	}

	setLookInfo(e, t = false) {
		this.mineType.source = ResDataPath.GetMineNameByType(e)
		this.mineBody.loadUrl(ResDataPath.MINER, !0)
		t
			? (this.endTime.parent || this.addChild(this.endTime), this.nameLabel.parent || this.addChild(this.nameLabel))
			: (DisplayUtils.removeFromParent(this.nameLabel), DisplayUtils.removeFromParent(this.endTime))
	}

	destruct() {
		this.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.attrOther, this), TimerManager.ins().remove(this.refushTime, this), this.mineBody.stop(), this.isRob.stop()
	}

	refushTime() {
		--this.endSecond, this.endTime.text = DateUtils.getFormatBySecond(this.endSecond, DateUtils.TIME_FORMAT_5), this.endSecond <= 0 && (this.destruct(), DisplayUtils.removeFromParent(this))
	}

	attrOther() {
		if (this.info.acId != GameGlobal.actorModel.actorID) {
			if (this.info.isAtt) {
				if (this.caiKuangConfig == null)
					this.caiKuangConfig = GlobalConfig.ins("CaiKuangConfig");
				// if (GameGlobal.mineModel.robNum >= this.caiKuangConfig.maxrobotcount) {
				// 	UserTips.ins().showTips("|C:0xf87372&T:今日掠夺次数已用完|") 
				// } else {
				ViewManager.ins().open(MineRobWin, this.info)
				// }
			} else {
				UserTips.ins().showTips("|C:0xf87372&T:" + this.info.showError + "|")
			}
		}
	}
}
window["MinePeopleItem"] = MinePeopleItem