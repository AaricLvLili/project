class MainNeedItem extends eui.Component {
	public constructor() {
		super();
		this.skinName = "MainNeedItemSkin";
	}
	public m_NameLab: eui.Label;
	public m_NeedItemLab: eui.Label;
	public m_GetLab: eui.Label;
	public m_ItemIcon: ItemBase;
	private needItemId: number = 0;
	private neeItemNum: number = 0;

	protected createChildren() {
		super.createChildren();
		this.m_ItemIcon.nameTxt.visible = false;
		this.m_ItemIcon.count.visible = false;
		this.m_GetLab.textFlow = <Array<egret.ITextElement>>[
			{ text: GlobalConfig.jifengTiaoyueLg.st101091, style: { "underline": true } }];
	}
	public setData(needItemId: number, neeItemNum: number) {
		this.needItemId = needItemId;
		this.neeItemNum = neeItemNum;
		let itemData = GlobalConfig.ins("ItemConfig")[this.needItemId];
		this.m_ItemIcon.setDataByConfig(itemData);
		this.m_NameLab.text = itemData.name;
		let itemNum = UserBag.ins().getBagGoodsCountById(0, this.needItemId);
		this.m_NeedItemLab.text = LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st101092, [itemNum, this.neeItemNum]);
	}
	private onClickGetLab() {
		if (this.needItemId) {
			UserWarn.ins().setBuyGoodsWarn(this.needItemId);
		}
	}
	public addEvent() {
		MessageCenter.ins().addListener(MessageDef.ITEM_COUNT_CHANGE, this.onChangeData, this);
		this.m_GetLab.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClickGetLab, this);
	}
	public removeEvent() {
		MessageCenter.ins().removeListener(MessageDef.ITEM_COUNT_CHANGE, this.onChangeData, this);
		this.m_GetLab.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onClickGetLab, this);
	}
	public onChangeData() {
		if (this.needItemId) {
			this.setData(this.needItemId, this.neeItemNum);
		}
	}

}
window["MainNeedItem"] = MainNeedItem