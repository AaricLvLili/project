class MailIconRule extends RuleIconBase {
	public constructor(t) {
		super(t)
		this.updateMessage = [MessageDef.MAIL_RED_POINT, MessageDef.MAIL_DATA_CHANGE, MessageDef.MAIL_GET_ITEM]
	}
	checkShowIcon() {
		return StartGetUserInfo.isOne == false;
	}
	checkShowRedPoint() {
		if (MailModel.ins().isHaveRedPoint)
			return true;
		return MailModel.ins().mailData ? MailModel.ins().getUnreadMail() : 0
	}

	tapExecute() {
		ViewManager.ins().open(MailWin)
	}
}
window["MailIconRule"]=MailIconRule