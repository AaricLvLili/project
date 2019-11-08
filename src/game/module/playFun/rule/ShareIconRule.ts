class ShareIconRule extends RuleIconBase {
	public constructor(t) {
		super(t)
		this.updateMessage = [

		]
	}

	//是否显示
	checkShowIcon() {
		if (SdkMgr.currSdk == SDKTYPE.Wanba || SdkMgr.isWxGame() || Const.isShare) return true;
		return false;
	}
	//红点逻辑
	checkShowRedPoint() {
	}

	getEffName(e) {

	}

	tapExecute() {
		if (Main.isDebug || SdkMgr.isWxGame()) {

			// if(!WxSdk.ins().imgURL)
			// 	WxSdk.ins().getUserWx();

			//微信小游戏的分享
			var state = ShareModel.ins().infos.firstshare
			if (state == 2)
				ViewManager.ins().open(ShareWinMain);
			else ViewManager.ins().open(ShareFirstWin);
		}
		else {
			SdkMgr.share();
		}
	}
}
window["ShareIconRule"] = ShareIconRule