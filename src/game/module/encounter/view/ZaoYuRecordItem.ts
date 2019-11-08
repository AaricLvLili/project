class ZaoYuRecordItem extends eui.ItemRenderer {
	public constructor() {
		super()
		this.skinName = "ZaoYuRecordInfoSkin"
	}

	// imgWin: eui.Image
	// time: eui.Label
	// exp: eui.Label
	// money: eui.Label
	// prestige: eui.Label
	// lingpo: eui.Label
	// playerName: eui.Label

	go: eui.Button
	roleHead: EncounterRoleHead
	playerName: eui.Label
	lv: eui.Label
	time: eui.Label
	protected childrenCreated() {
		this.go.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnClick, this)
		this.go.label = GlobalConfig.jifengTiaoyueLg.st100560;
	}

	private _OnClick() {
		var rsp: EncounterRecordData = this.data;
		if (rsp.beRob != null && !rsp.beRob.isWin && !rsp.beRob.isRevenge) {
			if (GameMap.IsNoramlLevel()) {
				Encounter.ins().SendRevenge(rsp.beRob.index);
				ViewManager.ins().close(ZaoYuRecordWin)
				ViewManager.ins().close(LadderWin)
			} else {
				UserTips.ins().showTips(GlobalConfig.jifengTiaoyueLg.st100545);
			}
		}
	}

	public dataChanged(): void {
		var rsp: EncounterRecordData = this.data;
		// this.imgWin.source = rsp.isWin ? "zyz_10" : "zyz_11"
		// this.time.text = DateUtils.getFormatBySecond(DateUtils.formatMiniDateTime(rsp.time), 2)
		// this.playerName.textFlow = (new egret.HtmlTextParser).parser("pk玩家：<font color='#3681FC'>" + rsp.name + "</font>")
		// this.exp.text = "" + rsp.exp
		// this.money.text = "" + rsp.money
		// this.prestige.text = "" + rsp.prestige
		// this.lingpo.text = rsp.lingpo ? (rsp.lingpo + "") : "0"

		let actorData
		if (rsp.rob != null) {
			actorData = rsp.rob.actorData
		} else {
			actorData = rsp.beRob.actorData
		}
		if (actorData == null) {
			actorData = {

				name: "",
				job: 0,
				sex: 0,
				zsLv: 0,
				lv: 1,

			}
		}

		this.roleHead.SetHead(actorData.job, actorData.sex)
		// let itemId = rsp.itemCount
		this.roleHead.SetCount(0, null)
		this.playerName.text = actorData.name
		this.lv.text = ResDataPath.GetLvName(actorData.zsLv, actorData.lv)
		let str = ""
		if (rsp.beRob != null) {
			str = GlobalConfig.jifengTiaoyueLg.st100562 + rsp.itemName
			// this.flag.visible = rsp.beRob.isWin
			this.go.visible = !rsp.beRob.isRevenge
		} else {
			str = GlobalConfig.jifengTiaoyueLg.st100563 + GameString.GetThirdPerson(actorData.sex) + GlobalConfig.jifengTiaoyueLg.st100564 + rsp.itemName
			this.go.visible = false
		}
		this.time.textFlow = new egret.HtmlTextParser().parser(`<font>${DateUtils.getFormatBySecond(rsp.time, 2)}</font> `).concat(TextFlowMaker.generateTextFlow(str))
		// this.time.textFlow = TextFlowMaker.generateTextFlow(DateUtils.getFormatBySecond(rsp.time, 2) + " " + str)
	}
}
window["ZaoYuRecordItem"] = ZaoYuRecordItem