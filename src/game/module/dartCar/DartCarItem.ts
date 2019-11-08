class DartCarItem extends egret.DisplayObjectContainer {

	endSecond = 0
	carBody: MovieClip
	nameLabel
	guildLabel
	endTime
	isRob: MovieClip

	info: DartCarListInfo
	private caiKuangConfig: any;

	constructor() {
		super()
		this.carBody = new MovieClip
		this.carBody.x = -20
		this.carBody.y = 30
		this.carBody.scaleX = this.carBody.scaleY = .8
		this.carBody.touchEnabled = !0
		this.addChild(this.carBody)
		this.nameLabel = new eui.Label
		this.nameLabel.fontFamily = "Microsoft YaHei"
		this.nameLabel.size = 16
		this.nameLabel.x = -50
		this.nameLabel.y = -55
		this.nameLabel.textAlign = "left"

		this.guildLabel = new eui.Label
		this.guildLabel.fontFamily = "Microsoft YaHei"
		this.guildLabel.size = 16
		this.guildLabel.x = -50
		this.guildLabel.y = -35
		this.guildLabel.textAlign = "left"

		this.endTime = new eui.Label
		this.endTime.size = 16
		this.endTime.fontFamily = "Microsoft YaHei"
		this.endTime.x = -50//-24
		this.endTime.y = -75
		this.endTime.textAlign = "left"
		this.endTime.textColor = 4381465
		this.isRob = new MovieClip
		this.isRob.touchEnabled = !0
		this.isRob.x = -75
		this.isRob.y = -75
	}

	setMineInfo(mineListInfo: DartCarListInfo) {
		this.info = mineListInfo;
		this.nameLabel.text = mineListInfo.name + GlobalConfig.jifengTiaoyueLg.st100849;
		//this.nameLabel.x = -50 + (120 - this.nameLabel.textWidth) / 2;

		this.guildLabel.visible = this.info.guildName.length > 0;
		this.guildLabel.text = GlobalConfig.jifengTiaoyueLg.st100850 + this.info.guildName;
		//this.guildLabel.x = -50 + (120 - this.guildLabel.textWidth) / 2;

		var t = (mineListInfo.surplusTime)
		let config = MineModel.ins().getCfgByType(this.info.type);
		if (config) {
			this.endSecond = t
		} else {
			ErrorLog.Assert(config, "DartCarItem    setMineInfo      cfg" + this.info.type)
		}
		this.endTime.text = DateUtils.getFormatBySecond(this.endSecond, DateUtils.TIME_FORMAT_5)
		TimerManager.ins().doTimer(1e3, this.endSecond, this.refushTime, this)
		this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.attrOther, this)
		this.touchEnabled = true;
		this.nameLabel.textColor = ItemBase.QUALITY_COLOR[this.info.type];
		if (this.info.guildName == GameGlobal.actorModel.guildName)
			this.guildLabel.textColor = 0x5ad200;
		else
			this.guildLabel.textColor = Color.Red;

		mineListInfo.isAtt
			? (this.isRob.loadUrl(ResDataPath.MINE_ROB_EFFE, !0), this.addChildAt(this.isRob, 2))
			: (this.isRob.stop(), DisplayUtils.removeFromParent(this.isRob))
		this.setLookInfo(mineListInfo.type, !0)
	}

	setLookInfo(e, t = false) {
		this.carBody.loadUrl(ResDataPath.GetDartCarBodyByType(e), !0)
		if (t) {
			this.endTime.parent || this.addChild(this.endTime);
			this.nameLabel.parent || this.addChild(this.nameLabel);
			this.guildLabel.parent || this.addChild(this.guildLabel);
		}
		else {
			DisplayUtils.removeFromParent(this.nameLabel);
			DisplayUtils.removeFromParent(this.endTime);
			DisplayUtils.removeFromParent(this.guildLabel);
		}
	}

	destruct() {
		this.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.attrOther, this), TimerManager.ins().remove(this.refushTime, this), this.carBody.stop(), this.isRob.stop()
	}

	refushTime() {
		--this.endSecond, this.endTime.text = DateUtils.getFormatBySecond(this.endSecond, DateUtils.TIME_FORMAT_5), this.endSecond <= 0 && (this.destruct(), DisplayUtils.removeFromParent(this))
	}

	attrOther() {
		if (this.info.acId != GameGlobal.actorModel.actorID) {
			if (this.info.isAtt) {
				ViewManager.ins().open(DartCarRobWin, this.info)
			} else {
				UserTips.ins().showTips("|C:0xf87372&T:" + this.info.showError + "|")
			}
		}
	}
}
window["DartCarItem"] = DartCarItem