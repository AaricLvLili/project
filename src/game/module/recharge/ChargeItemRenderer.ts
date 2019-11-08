class ChargeItemRenderer extends eui.ItemRenderer {

	bg: eui.Image
	payBtn: eui.Button
	yuanbaoImg
	firstPay: eui.Image
	// priceImg
	private num: eui.Label
	private num2: eui.Label
	desc
	firstPriceImg: eui.Label
	public m_Lab: eui.Label;
	public constructor() {
		super();


		this.skinName = "ChargeItemSkin";
	}


	dataChanged() {
		//钻石图片
		this.payBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
		this.payBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
		MessageCenter.ins().removeAll(this);
		MessageCenter.addListener(Recharge.ins().postUpDataItem, this.refushInfo, this);
		this.refushInfo();
	};
	refushInfo() {
		var statu = Recharge.ins().getOrderByIndex(this.data.id);
		//热卖或者首冲标签  23 首冲  22 热卖
		let rechargeState = Recharge.ins().ToDayRechargeState()
		let price = this.data.award
		if (statu == 0) {
			// 双倍
			this.firstPay.visible = true;
			this.m_Lab.visible = true;
			this.m_Lab.text = GlobalConfig.jifengTiaoyueLg.st101955;
			this.firstPriceImg.text = LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st101921, [this.data.award]);
			price += this.data.amount
		}
		else {
			this.m_Lab.visible = false;
			this.firstPay.visible = false;
			this.firstPriceImg.text = ""
		}
		this.num.text = price + GlobalConfig.jifengTiaoyueLg.st100050
		//描述
		this.desc.text = this.data.desc
		this.num2.text = this.data.cash + GlobalConfig.jifengTiaoyueLg.st101922;
		this.yuanbaoImg.source = this.data.icon

		if (this.data.isFanli == 1) {
			let n: number = this.data.exYuanBao / this.data.award + 1;
			this.firstPay.visible = true;
			this.m_Lab.visible = true;
			this.m_Lab.text = LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st101954, [n]);
			this.firstPriceImg.text = this.data.exDesc

			this.num.text = (this.data.award + this.data.exYuanBao) + GlobalConfig.jifengTiaoyueLg.st100050
		}
	};
	onTap(e) {
		var e = this.data;
		Recharge.ins().TestReCharge(e.id)
	};
}
window["ChargeItemRenderer"] = ChargeItemRenderer