class LuckIconRule extends RuleIconBase {
	private timeLab: eui.Label;

	private dataLen: number = 0;

	public constructor(t: eui.Group) {
		super(t);
		this.firstTap = true
		this.updateMessage = [
			MessageDef.UPDATE_ACTIVITY_PANEL,
		]

		let childNum = t.numChildren
		for (var i = 0; i < childNum; i++) {
			let child = t.getChildAt(i);
			if (child instanceof eui.Label) {
				this.timeLab = child;
				break;
			}
		}

	}
	private isOpenTick: boolean = false;


	public onTimer() {
		let luckDatas: Sproto.luckypackage_row[] = LuckGiftBagModel.getInstance.luckGiftData.values;
		let datetime: number = 0;
		if (luckDatas.length > 0) {
			datetime = luckDatas[0].time;
		}
		for (var i = 0; i < luckDatas.length; i++) {
			let t = Math.max(0, (luckDatas[i].time || 0) - GameServer.serverTime);
			if (t <= 0 && LuckGiftBagModel.getInstance.isModelOpen == false) {
				LuckGiftBagModel.getInstance.luckGiftData.remove(luckDatas[i].id);
				GameGlobal.MessageCenter.dispatch(MessageDef.LUCKGIFTBAG_DATA_UPDATE);
				continue;
			}
			if (datetime >= luckDatas[i].time) {
				datetime = luckDatas[i].time;
			}
		}
		let time: string = GameServer.GetSurplusTime(datetime, DateUtils.TIME_FORMAT_1);
		this.timeLab.text = time;

	}



	checkShowIcon() {
		if (LuckGiftBagModel.getInstance.luckGiftData.length > 0) {
			return true;
		}
		return false;
	}

	checkShowRedPoint() {
		return LuckGiftBagModel.getInstance.cleckAllRedPoint();
	}

	getEffName(e) {
		return false//this.DefEffe(e)
	}

	tapExecute() {
		ViewManager.ins().open(LuckGiftBagWin);
		// ViewManager.ins().open(LuckGiftTips, [1]);
		this.firstTap = false
		this.update()
	}
}
window["LuckIconRule"] = LuckIconRule