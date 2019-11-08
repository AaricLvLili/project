class BlessBackGoodsWin extends BaseEuiPanel {
	public scroller: eui.Scroller;
	public gainList: eui.List;
	public m_AllGetLab: eui.Label;
	public m_AddGroup: eui.Group;
	public m_NumLabel: eui.TextInput;
	public m_CutBtn: eui.Image;
	public m_AddBtn: eui.Image;
	public m_MaxBtn: eui.Button;
	public m_MinBtn: eui.Button;
	public m_SmeltBtn: eui.Button;
	public goods: ItemBase;
	public m_NumLab: eui.Label;
	public m_OneGetLab: eui.Label;

	private itemId: number;

	private nowNum: number = 1;
	private haveNum: number = 0;

	public constructor() {
		super();
		this.skinName = "BlessRecycleSkin";
		this.m_MaxBtn.label = GlobalConfig.jifengTiaoyueLg.st101113
		this.m_MinBtn.label = GlobalConfig.jifengTiaoyueLg.st101114
		this.m_SmeltBtn.label = GlobalConfig.jifengTiaoyueLg.st100209
		this.m_bg.init(`BlessBackGoodsWin`, GlobalConfig.jifengTiaoyueLg.st100108);
	}
	initUI() {
		super.initUI();
	}
	open(...param: any[]) {
		this.itemId = param[0];
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
		this.m_CutBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClick, this);
		this.m_AddBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClick, this);
		this.m_MaxBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClick, this);
		this.m_MinBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClick, this);
		this.m_NumLabel.addEventListener(egret.Event.CHANGE, this.onLabChange, this);
		this.m_SmeltBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClickSmelt, this);
		MessageCenter.addListener(Bless.postBlessSuccess, this.setData, this);
	}
	private removeViewEvent() {
		this.m_CutBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onClick, this);
		this.m_AddBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onClick, this);
		this.m_MaxBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onClick, this);
		this.m_MinBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onClick, this);
		this.m_NumLabel.removeEventListener(egret.Event.CHANGE, this.onLabChange, this);
		this.m_SmeltBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onClickSmelt, this);
		MessageCenter.ins().removeAll(this);
	}
	private setData() {
		let itemId: number = this.itemId;
		let itemNum = UserBag.ins().getBagGoodsCountById(0, itemId);
		this.m_NumLab.text = LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st101687, [itemNum]);
		this.haveNum = itemNum;
		if (this.nowNum > itemNum) {
			this.nowNum = itemNum;
		}
		let smeltConfig = GlobalConfig.ins("SmeltConfig")[itemId];
		let itemConfig = GlobalConfig.ins("ItemConfig")[itemId];
		let itemConfig1 = GlobalConfig.ins("ItemConfig")[smeltConfig.stoneId];
		this.m_OneGetLab.text = GlobalConfig.jifengTiaoyueLg.st101688 + itemConfig1.name + "X" + smeltConfig.stoneNum;
		this.goods.setDataByConfig(itemConfig);
		this.goods.setCount("");
		this.m_AllGetLab.text = GlobalConfig.jifengTiaoyueLg.st101689 + itemConfig1.name + "X" + (smeltConfig.stoneNum * this.nowNum);
		this.m_NumLabel.text = this.nowNum + "";

		let gainItemConfig = GlobalConfig.ins("GainItemConfig");

		var gainConfig = gainItemConfig[itemId];
		if (gainConfig != null) {
			let config = gainConfig.gainWay.slice(0, gainConfig.gainWay.length)
			for (let i = 0; i < config.length; ++i) {
				let data = config[i]
				if (data[1][0] == ViewIndexDef.ACT_GIFT) {
					let activityData = ActivityModel.ins().GetActivityDataByType(2)
					if (!ActivityModel.ins().IsOpen(activityData)) {
						config.splice(i, 1)
					}
					if (itemId == ViewIndexDef.EGG_BROKEN_PANEL && !EggBroken.IsOpen()) {// 判断砸金蛋活动是否关闭
						config.splice(i, 1)
					}
				}
			}
			this.gainList.dataProvider = new eui.ArrayCollection(config);
		} else {
			this.gainList.dataProvider = new eui.ArrayCollection([]);
		}
	}

	private onClick(evt: egret.TouchEvent) {
		switch (evt.currentTarget) {
			case this.m_CutBtn:
				if (this.nowNum > 1) {
					this.nowNum -= 1;
				}
				break;
			case this.m_AddBtn:
				if (this.nowNum < this.haveNum) {
					this.nowNum += 1;
				}
				break;
			case this.m_MaxBtn:
				if (this.nowNum < this.haveNum) {
					this.nowNum = this.haveNum;
				}
				break;
			case this.m_MinBtn:
				if (this.nowNum > 1) {
					this.nowNum = 1;
				}
				break;
		}
		this.m_NumLabel.text = this.nowNum + "";
		this.onChangetext();
	}
	private onLabChange() {
		let str = this.m_NumLabel.text;
		let num = parseInt(str);
		if (num <= 0) {
			this.nowNum = 0;
			num = 0;
		} else if (num > this.haveNum) {
			this.nowNum = this.haveNum;
			num = this.haveNum;
		} else {
			this.nowNum = num;
		}
		this.m_NumLabel.text = num + "";
		this.onChangetext();
	}
	private onClickSmelt() {
		let itemData: ItemData = UserBag.ins().getBagItemById(this.itemId);
		if (itemData) {
			if (itemData.count >= this.nowNum) {
				Bless.ins().sendSmelt(itemData.handle, this.nowNum);
			} else {
				UserTips.ins().showTips(GlobalConfig.jifengTiaoyueLg.st100217);
			}
		}
	}

	private onClickClose() {
		ViewManager.ins().close(this);
	}

	private onChangetext() {
		let itemId: number = this.itemId;
		let smeltConfig = GlobalConfig.ins("SmeltConfig")[itemId];
		let itemConfig = GlobalConfig.ins("ItemConfig")[itemId];
		let itemConfig1 = GlobalConfig.ins("ItemConfig")[smeltConfig.stoneId];
		this.m_AllGetLab.text = GlobalConfig.jifengTiaoyueLg.st101689 + itemConfig1.name + "X" + (smeltConfig.stoneNum * this.nowNum);
	}

}

ViewManager.ins().reg(BlessBackGoodsWin, LayerManager.UI_Popup);

window["BlessBackGoodsWin"] = BlessBackGoodsWin