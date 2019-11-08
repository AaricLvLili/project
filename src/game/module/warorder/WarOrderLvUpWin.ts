class WarOrderLvUpWin extends BaseEuiPanel {
	public constructor() {
		super()
		this.skinName = "WarOrderLvUpWinSkin";
	}
	public m_bg: CommonPopBg;
	public m_GetBtn: eui.Button;
	public add: eui.Group;
	public m_MainNumLab: eui.TextInput;
	public m_CutBtn: eui.Image;
	public m_AddBtn: eui.Image;
	public m_MaxBtn: eui.Button;
	public m_MinBtn: eui.Button;
	public m_LvUpGetLab: eui.Label;
	public m_BuyLvLab: eui.Label;
	public m_Lan1: eui.Label;
	public m_List: eui.List;
	public m_NeedItemGroup: eui.Group;
	public m_LvUpItemImg: eui.Image;
	public m_LvUpItemNum: eui.Label;

	public nowNum: number = 1;

	private listData: eui.ArrayCollection;

	public createChildren() {
		super.createChildren();
		this.m_bg.init("WarOrderLvUpWin", GlobalConfig.jifengTiaoyueLg.st102073);
		this.m_Lan1.text = GlobalConfig.jifengTiaoyueLg.st102081;
		this.m_List.itemRenderer = ItemBase;
		this.listData = new eui.ArrayCollection();
		this.m_List.dataProvider = this.listData;
		this.m_GetBtn.label = GlobalConfig.jifengTiaoyueLg.st100069;
	}
	initUI() {
		super.initUI();
	}
	open(...param: any[]) {
		this.nowNum = 1;
		let warOrderModel = WarOrderModel.getInstance;
		this.addViewEvent();
		this.setData();
	}
	close() {
		this.release();
	}
	public release() {
		this.removeViewEvent();
	}
	private addViewEvent() {
		this.AddClick(this.m_CutBtn, this.onClickCunBtn);
		this.AddClick(this.m_AddBtn, this.onClickAddBtn);
		this.AddClick(this.m_MaxBtn, this.onClickMaxBtn);
		this.AddClick(this.m_MinBtn, this.onClickMinBtn);
		this.AddClick(this.m_GetBtn, this.onClickMainBtn);
	}
	private removeViewEvent() {
	}

	private setData() {
		let warOrderModel = WarOrderModel.getInstance;
		let config = GlobalConfig.ins("TokenConfig")[warOrderModel.mainId];
		let maxNum = 0;
		let itemData = [];
		for (var i = warOrderModel.lv; i < warOrderModel.lv + this.nowNum; i++) {
			maxNum += config[i].baseAward.length;
			maxNum += config[i].advancedAward.length;
			for (var f = 0; f < config[i].baseAward.length; f++) {
				let list = config[i].baseAward.slice(0);
				let data = list[f]
				itemData.push(data);
			}
			for (var f = 0; f < config[i].advancedAward.length; f++) {
				let list = config[i].advancedAward.slice(0);
				let data = list[f]
				itemData.push(data);
			}
		}
		this.listData.replaceAll(itemData);

		this.m_LvUpGetLab.textFlow = new egret.HtmlTextParser().parser(LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st102085,
			["<font color=" + Color.Green + ">" + this.nowNum + "</font>", "<font color=" + Color.Green + ">" + maxNum + "</font>"]));
		this.m_BuyLvLab.textFlow = new egret.HtmlTextParser().parser(LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st102086,
			["<font color=" + Color.Green + ">" + this.nowNum + "</font>", "<font color=" + Color.Green + ">" + (this.nowNum + warOrderModel.lv) + "</font>"]));
		this.m_MainNumLab.text = this.nowNum + "";
		let tokenBaseConfig = GlobalConfig.ins("TokenBaseConfig")[warOrderModel.mainId];
		if (tokenBaseConfig) {
			let needItemData = tokenBaseConfig.levelPrice.slice(0);
			let needData = [];
			for (var i = 0; i < needItemData.length; i++) {
				let newCount = needItemData[i].count * this.nowNum
				let newData = { type: needItemData[i].type, id: needItemData[i].id, count: newCount };
				needData.push(newData)
			}
			UserBag.ins().setNeedItem(needData, this.m_NeedItemGroup);
		}
	}

	private onClickCunBtn() {
		if (this.nowNum > 1) {
			this.nowNum -= 1;
		}
		this.setData();
	}

	private onClickAddBtn() {

		if (this.nowNum < (WarOrderModel.getInstance.maxLv-WarOrderModel.getInstance.lv)) {
			this.nowNum += 1;
		}
		this.setData();
	}

	private onClickMaxBtn() {
		if (this.nowNum == (WarOrderModel.getInstance.maxLv-WarOrderModel.getInstance.lv)) {
			return;
		}
		this.nowNum = (WarOrderModel.getInstance.maxLv-WarOrderModel.getInstance.lv);
		this.setData();
	}

	private onClickMinBtn() {
		if (this.nowNum == 1) {
			return;
		}
		this.nowNum = 1;
		this.setData();
	}

	private onClickMainBtn() {
		WarOrderSproto.ins().sendUpWarOrderLv(this.nowNum);
		this.onMaskTap();
	}


}
ViewManager.ins().reg(WarOrderLvUpWin, LayerManager.UI_Popup);
window["WarOrderLvUpWin"] = WarOrderLvUpWin