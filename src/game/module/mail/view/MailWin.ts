class MailWin extends BaseEuiPanel implements ICommonWindow {

	static LAYER_LEVEL = LayerManager.UI_Main

	public constructor() {
		super()
	}

	_mails
	mailScroller;
	mailList;
	// closeBtn
	// closeBtn0
	allReceiveBtn
	noMailTip
	currentPageLable: eui.Label
	leftPageBtn
	rightPageBtn

	commonWindowBg: CommonWindowBg
	private m_AllDeleBtn: eui.Button;

	initUI() {
		super.initUI()
		this.skinName = "MailSkin"
		this._mails = []
		this.mailList.itemRenderer = MailItem
		this.mailScroller.viewport = this.mailList
		this.noMailTip.text = GlobalConfig.jifengTiaoyueLg.st101228;
		this.leftPageBtn.label = GlobalConfig.jifengTiaoyueLg.st101229;
		this.rightPageBtn.label = GlobalConfig.jifengTiaoyueLg.st101230;
		this.allReceiveBtn.label = GlobalConfig.jifengTiaoyueLg.st100982;
		this.m_AllDeleBtn.label=GlobalConfig.jifengTiaoyueLg.st101231;
	}

	open() {
		for (var e = [], t = 0; t < arguments.length; t++) e[t] = arguments[t];
		this.commonWindowBg.OnAdded(this)
		this.AddClick(this.allReceiveBtn, this.onTap)
		this.AddClick(this.leftPageBtn, this.onTap)
		this.AddClick(this.rightPageBtn, this.onTap)
		this.AddClick(this.mailList, this.onSendMail)
		this.AddClick(this.m_AllDeleBtn, this.onTap)
		GameGlobal.MessageCenter.addListener(MessageDef.MAIL_DATA_CHANGE, this.setMailData, this)
		GameGlobal.MessageCenter.addListener(MessageDef.OPEN_MAIL, this.setOpenMail, this)
		GameGlobal.MessageCenter.addListener(MessageDef.MAIL_SYSTEM_MAIL, this.mailSystemHandle, this)
		MailModel.ins().isHaveRedPoint = false;
		MailModel.ins().sendMailInitData(MailModel.ins().currentPage);
	}

	close() {
		for (var e = [], t = 0; t < arguments.length; t++) e[t] = arguments[t];
		this.commonWindowBg.OnRemoved()
		GameGlobal.MessageCenter.removeListener(MessageDef.MAIL_DATA_CHANGE, this.setMailData, this)
		GameGlobal.MessageCenter.removeListener(MessageDef.OPEN_MAIL, this.setOpenMail, this)
		GameGlobal.MessageCenter.removeListener(MessageDef.MAIL_SYSTEM_MAIL, this.mailSystemHandle, this)
		this.removeObserve();
		this.mailScroller.stopAnimation();
	}

	onTap(e) {
		switch (e.currentTarget) {
			// case this.closeBtn:
			// case this.closeBtn0:
			// 	ViewManager.ins().close(MailWin);
			// 	break;
			case this.allReceiveBtn:
				for (var t: number[] = [], i = MailModel.ins().getMailByReceive(), n = 0; n < i.length; n++) t.push(i[n].handle);
				MailModel.ins().sendGetItem(t)
				break
			case this.leftPageBtn:
				if (MailModel.ins().currentPage < 2) {
					UserTips.InfoTip(GlobalConfig.jifengTiaoyueLg.st101226);
					return;
				}
				MailModel.ins().sendMailInitData(MailModel.ins().currentPage - 1);
				break
			case this.rightPageBtn:
				if (MailModel.ins().maxPage <= MailModel.ins().currentPage) {
					UserTips.InfoTip(GlobalConfig.jifengTiaoyueLg.st101227);
					return;
				}
				MailModel.ins().sendMailInitData(MailModel.ins().currentPage + 1);
				break;
			case this.m_AllDeleBtn:
				WarnWin.show(GlobalConfig.jifengTiaoyueLg.st101765, function () {
					let mailDatas: MailData[] = MailModel.ins().mailData;
					let delHande: number[] = [];
					for (var f = 0; f < mailDatas.length; f++) {
						if (mailDatas[f].type && mailDatas[f].receive) {
							delHande.push(mailDatas[f].handle);
						}
					}
					if (delHande.length > 0) {
						MailModel.ins().sendDelMail(delHande);
					}
				}, this);
				break;
		}
	}

	onSendMail(e) {
		var t = e.target.parent;
		if (t) {
			var i = t.data;
			i && MailModel.ins().sendMailContentData(i.handle)
		}
	}

	setMailData() {
		this.currentPageLable.text = MailModel.ins().currentPage + "/" + MailModel.ins().maxPage;

		this._mails = MailModel.ins().mailData
		this.mailList.dataProvider = new eui.ArrayCollection(this._mails)
		this.allReceiveBtn.visible = Boolean(MailModel.ins().getMailByReceive().length)
		this.m_AllDeleBtn.visible = !this.allReceiveBtn.visible;
		MailModel.ins().mailData.length > 0 && (this.noMailTip.visible = !1)
		if (this.m_AllDeleBtn.visible) {
			let ishaveDel: boolean = false;
			for (var f = 0; f < this._mails.length; f++) {
				if (this._mails[f].type && this._mails[f].receive) {
					ishaveDel = true;
					break;
				}
			}
			this.m_AllDeleBtn.visible = ishaveDel;
		}
	}

	mailSystemHandle() {
		for (var i = 0; i < this._mails.length; i++) {
			if (this._mails[i].receive == 0 && this._mails[i].mailtype == 1 && this._mails[i].type == 0) {
				MailModel.ins().sendMailContentData(this._mails[i].handle);
				return;
			}
		}
	}

	setOpenMail(e) {
		for (var t = 0; t < this.mailList.numChildren; t++) {
			var i = this.mailList.getChildAt(t);
			if (i.data.handle == e.handle) return void (i.data = e)
		}
	}

	OnBackClick(clickType: number): number { return 0 }
	OnOpenIndex(openIndex: number): boolean { return true }
}
window["MailWin"] = MailWin