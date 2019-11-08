class ChatGuildItemRender extends eui.ItemRenderer {
	public constructor() {
		super()
		this.skinName = "ChatGuildItemSkin"
	}

	// btn_friend
	// btn_blackList
	head
	showText: eui.Label
	bulType
	actorName: ActorName

	childrenCreated() {
		super.childrenCreated()
		// this.btn_friend.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this)
		// this.btn_blackList.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this)
	}
	dataChanged() {
		if (this.data instanceof GuildMessageInfo) {
			let t: GuildMessageInfo = this.data;
			this.currentState = "type" + ((t.type == 1) ? "1" : "0")
			if (t.type == 1) {
				this.showText.text = t.content
				var e = GuildLanguage.guildOffice(t.office)
				var i = Number("0x" + GuildLanguage.guildOfficeColor(t.office))
				var s = t.roleId == GameLogic.ins().actorModel.actorID ? 65280 : 1487615;
				this.head.source = JobHeadIconConst.GetIcon(t.job, t.sex)
				this.actorName.Set(TextFlowMaker.generateTextFlow1("|C:" + i + "&T:[" + e + "]||C:" + s + "&T:" + t.name + "|"), t.vipLevel, t.monthCard, t.superMonthCard)
			} else {
				this.showText.textFlow = TextFlowMaker.generateTextFlow(t.content)
			}
		}
	}


}
window["ChatGuildItemRender"]=ChatGuildItemRender