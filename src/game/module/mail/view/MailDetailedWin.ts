class MailDetailedWin extends BaseEuiPanel {
	public constructor() {
		super()
	}

	itemList

	background
	receiveBtn
	textLabel
	desc
	public m_DelBtn: eui.Button;
	//private m_bg:CommonPopBg
	public m_Lan1: eui.Label;

	initUI() {
		super.initUI()
		this.skinName = "MailContentSkin"
		this.itemList.itemRenderer = ItemBase
		this.receiveBtn.label = GlobalConfig.jifengTiaoyueLg.st101232;
		this.m_DelBtn.label = GlobalConfig.jifengTiaoyueLg.st101233;
		this.m_Lan1.text = GlobalConfig.jifengTiaoyueLg.st101234;
		this.desc.text = GlobalConfig.jifengTiaoyueLg.st101235;
	}

	open() {
		this.m_bg.init(`MailDetailedWin`, GlobalConfig.jifengTiaoyueLg.st101236)
		for (var e = [], t = 0; t < arguments.length; t++) e[t] = arguments[t];
		this.AddClick(this.receiveBtn, this.onTap)
		this.AddClick(this.m_DelBtn, this.onTap)
		GameGlobal.MessageCenter.addListener(MessageDef.MAIL_GET_ITEM, this.setMailData, this)
		this.setMailData()
	}

	close() {
		for (var e = [], t = 0; t < arguments.length; t++) e[t] = arguments[t];
		GameGlobal.MessageCenter.removeListener(MessageDef.MAIL_GET_ITEM, this.setMailData, this)
		GameGlobal.MessageCenter.dispatch(MessageDef.MAIL_SYSTEM_MAIL)  //派发系统邮件消息
	}

	onTap(e) {
		switch (e.currentTarget) {
			case this.receiveBtn: {
				var t = [];
				t.push(MailModel.ins().currentMailHandle), MailModel.ins().sendGetItem(t);
				MailModel.ins().sendGetItem(t);
				break;
			}
			case this.m_DelBtn: {
				var t = [];
				t.push(MailModel.ins().currentMailHandle);
				MailModel.ins().sendDelMail(t);
				ViewManager.ins().close(this);
				break;
			}
		}
	}
	private _OnClick(e: egret.TouchEvent) {
		ViewManager.ins().close(this);
	}
	otherClose(e) {
		var t = this.background;
		e.localX >= t.x && e.localX <= t.x + t.width && e.localY >= t.y && e.localY <= t.y + t.height || ViewManager.ins().close(MailDetailedWin)
	}

	setMailData() {
		var e = MailModel.ins().getCurrentMail();
		this.textLabel.textFlow = TextFlowMaker.generateTextFlow(e.text), this.setReceiveBtn(e.receive, e.item.length > 0), this.itemList.dataProvider = new eui.ArrayCollection(e.item)
	}

	setReceiveBtn(e, t) {
		void 0 === t && (t = !1);
		var i = "";
		this.receiveBtn.visible = e >= 0, i = e ? GlobalConfig.jifengTiaoyueLg.st100981 : GlobalConfig.jifengTiaoyueLg.st101232, this.receiveBtn.label = i, this.receiveBtn.enabled = !Boolean(e), this.receiveBtn.visible = t, this.desc.visible = !t
		if (this.receiveBtn.visible) {
			if (this.receiveBtn.label == GlobalConfig.jifengTiaoyueLg.st101232) {
				this.m_DelBtn.visible = false;
			} else if (this.receiveBtn.label == GlobalConfig.jifengTiaoyueLg.st100981) {
				this.receiveBtn.visible = false;
				this.m_DelBtn.visible = true;
			}
		} else {
			this.m_DelBtn.visible = true;
		}
	}
}
ViewManager.ins().reg(MailDetailedWin, LayerManager.UI_Popup);
window["MailDetailedWin"] = MailDetailedWin