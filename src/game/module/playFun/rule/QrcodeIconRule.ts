class QrcodeIconRule extends RuleIconBase {
	public constructor(t) {
		super(t)
		this.updateMessage = [
			
		]
	}

	//是否显示
	checkShowIcon() {
		return Const.isQrcode;
	}
	//红点逻辑
	checkShowRedPoint() {
	}

	getEffName(e) {

	}

	tapExecute() {
		SdkMgr.Qrcode(); 
	}
}
window["QrcodeIconRule"]=QrcodeIconRule