/** 分享商店*/
class ShareShopPanel extends BaseView implements ICommonWindowTitle {
	public constructor() {
		super();
		this.name = GlobalConfig.jifengTiaoyueLg.st100085;
		this.skinName = "ShareShopSkin";
		this.listView.itemRenderer = ShareShopPanelItem
		this.m_Lan1.text = GlobalConfig.jifengTiaoyueLg.st101946;
	}
	listView: eui.List
	priceLabel: eui.Label

	public m_Lan1: eui.Label;

	/** 窗口打开基类调用*/
	public open(...param: any[]): void {
		super.open(param);
		MessageCenter.ins().addListener(ShareEvt.WX_SHARECOIN, this.UpdateContent, this);
		this.update();
	}

	update() {
		var cfg = GlobalConfig.share5Config
		var cfgs = []
		for (var i in cfg) {
			cfgs.push(cfg[i])
		}
		this.listView.dataProvider = new eui.ArrayCollection(cfgs);
	}

	/** 窗口关闭基类调用*/
	public close(): void {
		super.close();
	}

	UpdateContent(): void {
		this.priceLabel.text = '' + GameLogic.ins().actorModel.sharecoin
	}
}
window["ShareShopPanel"] = ShareShopPanel

class ShareShopPanelItem extends eui.ItemRenderer {
	public constructor() {
		super()
		this.skinName = 'ShareShopItemSkin';
		this.buyBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.click, this);
	}
	itemName: eui.Label
	priceLabel: eui.Label
	buyBtn: eui.Button
	shopItem: ItemBase

	public dataChanged() {
		this.shopItem.data = this.data.tbItem[0]
		this.shopItem.dataChanged()
		// this.shopItem.setDataByConfig(this.data.tbItem[0])
		this.priceLabel.text = this.data.nPrice + ''
		this.itemName.text = this.shopItem.nameTxt.text
		this.shopItem.isShowName(false);
	}

	click() {
		var n = GameLogic.ins().actorModel.sharecoin
		if (n < this.data.nPrice) UserTips.ErrorTip(GlobalConfig.jifengTiaoyueLg.st101945);
		else {
			let req = new Sproto.cs_operate_share_request;
			req.actId = 5  //分享币
			req.subProto = "buy"
			req.subData = new Sproto.sub_proto_data
			req.subData.integer_data = [this.data.Index]
			GameSocket.ins().Rpc(C2sProtocol.cs_operate_share, req, null, this);//
		}
	}

}
window["ShareShopPanelItem"] = ShareShopPanelItem
