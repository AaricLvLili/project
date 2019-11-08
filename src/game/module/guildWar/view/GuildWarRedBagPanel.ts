class GuildWarRedBagPanel extends BaseEuiPanel implements ICommonWindow {

	public static LAYER_LEVEL = LayerManager.UI_Popup

	////////////////////////////////////////////////////////////////////////////////////////////////////
	// RedBagWinSkin.exml
	////////////////////////////////////////////////////////////////////////////////////////////////////
	private send: eui.Button
	private rob: eui.Button
	private robRemainNum: PriceIcon
	private remainBag: eui.Label
	private price: PriceIcon
	private btn1: eui.Button
	private btn3: eui.Button
	private btn2: eui.Button
	private btn4: eui.Button
	private btn5: eui.Button
	private btn6: eui.Button
	private num1: eui.EditableText
	private num2: eui.EditableText
	private xxx__xxxxx: eui.Label
	private languageTxt: eui.Label;
	private languageTxt0: eui.Label;
	private languageTxt1: eui.Label;
	private languageTxt2: eui.Label;



	////////////////////////////////////////////////////////////////////////////////////////////////////
	public constructor() {
		super()
		this.skinName = "RedBagWinSkin"
		this.num1.restrict = "0-9"
		this.num2.restrict = "0-9"
		this.rob.label = GlobalConfig.jifengTiaoyueLg.st101599;
		this.send.label = GlobalConfig.jifengTiaoyueLg.st101598;
		this.btn5.label = GlobalConfig.jifengTiaoyueLg.st101113;
		this.btn6.label = GlobalConfig.jifengTiaoyueLg.st101113;
		this.languageTxt.text = GlobalConfig.jifengTiaoyueLg.st101600;
		this.languageTxt0.text = GlobalConfig.jifengTiaoyueLg.st101601;
		this.languageTxt1.text = GlobalConfig.jifengTiaoyueLg.st101780;
		this.languageTxt2.text = GlobalConfig.jifengTiaoyueLg.st101781;
		this.robRemainNum.priceLabel.textColor = Color.White;
		this.price.priceLabel.textColor = Color.White;
	}

	public open() {
		//this.commonDialog.OnAdded(this)

		this.rob.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this)
		this.send.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this)
		this.btn1.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this)
		this.btn2.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this)
		this.btn3.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this)
		this.btn4.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this)
		this.btn5.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this)
		this.btn6.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this)
		this.num1.addEventListener(egret.Event.CHANGE, this.onTxtChange, this)
		this.num2.addEventListener(egret.Event.CHANGE, this.onTxtChange, this)
		if (GuildReward.ins().canRod) {
			this.currentState = "rob"
			this.refushInfo()
		} else {
			this.currentState = "send"
			this.refushSendInfo()
		}
	}

	public close() {
		//this.commonDialog.OnRemoved()
	}
	onClose() {
		ViewManager.ins().close(GuildWarRedBagPanel);
	}
	onTxtChange(e) {
		let i = 1;
		switch (e.currentTarget) {
			case this.num1:
				i = 1;
				break;
			case this.num2:
				i = 2
		}
		TimerManager.ins().doTimer(500, 1, () => {
			this.checkInputChange(i)
		}, this)
	}

	sendYb: number
	sendNum: number
	sendYBMaxNum: number
	sendMaxNum: number = 0

	onTap(e) {
		switch (e.currentTarget) {
			case this.rob:
				GuildReward.ins().SendGetRedpacket()
				break;
			case this.send:
				GuildReward.ins().SendRedpacket(this.sendYb, this.sendNum);
				break;
			case this.btn1:
				--this.sendYb, this.sendYb < this.sendNum && (this.sendYb = this.sendNum), this.num1.text = this.sendYb + "";
				break;
			case this.btn2:
				++this.sendYb, this.sendYb > this.sendYBMaxNum && (this.sendYb = this.sendYBMaxNum), this.num1.text = this.sendYb + "";
				break;
			case this.btn3:
				--this.sendNum, this.sendNum < 1 && (this.sendNum = 1), this.num2.text = this.sendNum + "";
				break;
			case this.btn4:
				++this.sendNum, this.sendNum > this.sendMaxNum && (this.sendNum = this.sendMaxNum), this.num2.text = this.sendNum + "";
				break;
			case this.btn5:
				this.sendYb = this.sendYBMaxNum, this.num1.text = this.sendYb + "";
				break;
			case this.btn6:
				this.sendNum = this.sendMaxNum, this.num2.text = this.sendNum + ""
		}
	}

	refushSendInfo() {
		this.sendYb = this.sendYBMaxNum = GuildReward.ins().remainYB
		if (Guild.ins().getMemberNum() > 0)
			this.sendMaxNum = this.sendNum = Guild.ins().getMemberNum();
		else
			this.sendMaxNum = this.sendNum = 1;
		this.price.price = this.sendYb
		this.num1.text = this.sendYb + ""
		this.num2.text = this.sendNum + ""
	}

	refushInfo() {
		this.robRemainNum.price = GuildReward.ins().sendYbNum
		this.remainBag.text = GlobalConfig.jifengTiaoyueLg.st101597 + "：" + GuildReward.ins().remainRedNum + "/" + GuildReward.ins().maxRedNum
	}

	checkInputChange(e) {
		var t;
		switch (e) {
			case 1:
				t = Number(this.num1.text), t > this.sendYBMaxNum && (t = this.sendYBMaxNum), this.sendYb = t, this.num1.text = this.sendYb + "";
				break;
			case 2:
				t = Number(this.num2.text), t > this.sendMaxNum && (t = this.sendMaxNum), this.sendNum = t, this.num2.text = this.sendNum + ""
		}
		this.checkPercentage()
	}

	checkPercentage() {
		this.sendYb < this.sendNum && (this.sendYb = this.sendNum, this.num1.text = this.sendYb + "")
	}
}

window["GuildWarRedBagPanel"] = GuildWarRedBagPanel