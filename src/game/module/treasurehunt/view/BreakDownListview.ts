class BreakDownListview extends BaseEuiPanel {

	equipList: eui.List
	listData
	goList
	contrain: eui.Group
	itemID = 0
	quality = 0

	private title02: eui.Label
	private tipImg: eui.Label

	//private dialogCloseBtn: eui.Button;
	private gainItemConfig: any;

	public m_MaxResolveGroup: eui.Group;
	public m_ResolveBtn: eui.Button;
	public m_MaxDebrisNum: eui.Label;
	private languageTxt: eui.Label;

	public constructor() {
		super()
		this.layerLevel = VIEW_LAYER_LEVEL.TOP
	}
	initUI() {
		super.initUI()
		this.skinName = "BreakDownSkin";
		this.equipList.itemRenderer = BreakDownItemRenderer;
		this.listData = new eui.ArrayCollection();
		this.equipList.dataProvider = this.listData;
		this.goList = [];
		this.languageTxt.text = GlobalConfig.jifengTiaoyueLg.st100762;

	};
	open(...param: any[]) {
		this.m_bg.init(`BreakDownListview`, GlobalConfig.jifengTiaoyueLg.st100762)
		this.m_ResolveBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClickResolveBtn, this);
		//this.dialogCloseBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnClick, this);
		GameGlobal.MessageCenter.addListener(MessageDef.DELETE_ITEM, this.updateData, this); //道具删除
		this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
		this.itemID = param[0]
		this.quality = param[1];
		let str: string = "";
		if (this.quality == 1000) {//护具分解
			this.m_ResolveBtn.label = GlobalConfig.jifengTiaoyueLg.st100763;//`一键分解`
			this.m_bg.txtTitle.text = GlobalConfig.jifengTiaoyueLg.st100764;//`分解护具`
			str = GlobalConfig.jifengTiaoyueLg.st100765;//"分解护具将100%返还魔石碎片";
		}
		else if (this.quality == 5) {
			this.m_ResolveBtn.label = GlobalConfig.jifengTiaoyueLg.st100763;//`一键分解`
			this.m_bg.txtTitle.text = GlobalConfig.jifengTiaoyueLg.st100766;//`分解红装`
			str = GlobalConfig.jifengTiaoyueLg.st100767;//"分解红装将100%返还传奇碎片";
		}
		else {
			this.m_ResolveBtn.label = GlobalConfig.jifengTiaoyueLg.st100768;//`一键出售`
			this.m_bg.txtTitle.text = GlobalConfig.jifengTiaoyueLg.st100769;//`橙装出售`
			str = GlobalConfig.jifengTiaoyueLg.st100770;//"出售橙装可以返还钻石";
		}

		this.tipImg.text = str;
		this.updateData();
	};
	close() {
		this.m_ResolveBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onClickResolveBtn, this);
		//this.dialogCloseBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this._OnClick, this)
		this.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
		for (var i = 0; i < this.goList.length; i++) {
			if (this.goList[i].parent) {
				this.goList[i].removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onGo, this);
			}
		}
		MessageCenter.ins().removeAll(this);
	};
	private _OnClick(e: egret.TouchEvent) {
		ViewManager.ins().close(this);
	}
	updateData() {
		// var itemData = UserBag.ins().getBagEquipByLevelSort(this.quality);
		var itemData: any;
		if (this.quality == 1000)
			itemData = UserBag.ins().getBagEquipByZhuanZhiSplit();
		else
			itemData = UserBag.ins().getBagEquipByOrangeSplit(this.quality);

		itemData.sort(function (n1, n2) {
			var config1 = GlobalConfig.itemConfig[n1.configID];
			var config2 = GlobalConfig.itemConfig[n2.configID];
			if (config1.zsLevel > config2.zsLevel) {
				return 1;
			}
			if (config1.zsLevel < config2.zsLevel) {
				return -1;
			}
			if (config1.level > config2.level) {
				return 1;
			}
			if (config1.level < config2.level) {
				return -1;
			}
			return 0;
		});
		this.listData.source = itemData;
		if (itemData.length > 0) {
			this.m_MaxResolveGroup.visible = true;
			let debNum: number = 0;
			for (var i = 0; i < itemData.length; i++) {
				let itemConfig = itemData[i].itemConfig;
				var stoneNum: number = 0;
				if (itemConfig.type == ItemType.ZHUANZHI)//转职装备特殊处理
				{
					if (GlobalConfig.ins("SmeltConfig")[itemConfig.id])
						stoneNum = GlobalConfig.ins("SmeltConfig")[itemConfig.id].stoneNum;
				} else {
					if (BreakDownItemRenderer.getSmeltConfig(itemConfig))
						stoneNum = BreakDownItemRenderer.getSmeltConfig(itemConfig).stoneNum;
				}
				var smeltVo = BreakDownItemRenderer.getSmeltConfig(itemConfig);
				//只针对橙装修改  夏坤需求
				if (itemConfig.subType == 0)//武器
				{
					debNum += (stoneNum + (smeltVo.weaponStone ? smeltVo.weaponStone : 0));
				}
				else if (itemConfig.subType == 2)// 衣服
				{
					debNum += (stoneNum + (smeltVo.clotheStone ? smeltVo.clotheStone : 0));
				}
				else {
					debNum += stoneNum;
				}
			}
			if (this.quality == 1000) {
				this.m_MaxDebrisNum.textFlow = TextFlowMaker.getTextFlowByHtml(`<font color='#535557'>${GlobalConfig.jifengTiaoyueLg.st101112}：</font>${GlobalConfig.jifengTiaoyueLg.st100771}${debNum}`);
			}
			else if (this.quality == 5) {
				this.m_MaxDebrisNum.textFlow = TextFlowMaker.getTextFlowByHtml(`<font color='#535557'>${GlobalConfig.jifengTiaoyueLg.st101112}：</font>${GlobalConfig.jifengTiaoyueLg.st100496}X${debNum}`)
			}
			else {
				// this.m_MaxDebrisNum.textFlow = TextFlowMaker.getTextFlowByHtml(`<font color='#535557'>${GlobalConfig.languageConfig.st100772}：</font>${GlobalConfig.languageConfig.st100050}${debNum}`)
				this.m_MaxDebrisNum.text = "";
			}
		} else {
			this.m_MaxResolveGroup.visible = false;
		}

		if (this.gainItemConfig == null) {
			this.gainItemConfig = GlobalConfig.ins("GainItemConfig");
		}
		var gainItemData = this.gainItemConfig[this.itemID];
		var dataNum = 0;
		if (!Assert(gainItemData, "BreakDown GainItemConfig " + this.itemID + " null")) {
			dataNum = gainItemData.gainWay.length;
			for (var s = void 0, n = 0; n < this.goList.length; n++) {
				if (this.goList[n].parent) {
					this.goList[n].visible = false
				}
			}
			for (var n = 0; dataNum > n; n++) {
				if (!this.goList[n]) {
					this.goList.push(new GainGoodsItem)
				}
				var s = this.goList[n]
				this.addTouchEvent(this, this.onGo, s)
				s.visible = true
				s.data = gainItemData.gainWay[n]
				this.contrain.addChild(s)
				s.y = 57 * n
			}
		}
		//this.commonDialog.height = 433 + (dataNum -1)*45;
	};

	onTap(e) {
		switch (e.currentTarget) {
			default:
				if (e.target instanceof eui.Button) {
					switch (e.target.name) {
						case "breakDown":
							let itemData: ItemData = e.target.parent["data"]
							let configData = itemData.itemConfig
							if (configData && configData.quality == 5) {
								if (LegendModel.ins().CanEquipTip(itemData.configID)) {
									let str = GlobalConfig.jifengTiaoyueLg.st100773 + ItemBase.QUALITY_COLOR_STR[5] + "&T:" + itemData.itemConfig.name + "|\n" + GlobalConfig.jifengTiaoyueLg.st100774;
									WarnWin.show(TextFlowMaker.generateTextFlow(str), () => {
										UserEquip.ins().sendSmeltEquip(1, [itemData]);
									}, this)
									return
								}
							}
							UserEquip.ins().sendSmeltEquip(1, [itemData]);
							break;
					}
				}
		}
	};
	onGo(e) {
		var item = e.currentTarget;
		var data = item.userData;
		// ViewManager.ins().open(data[1], data[2]);
		ViewManager.ins().close(this);
		ViewManager.Guide(data[1][0], null)
	};
	private onClickResolveBtn() {
		if (this.listData.source && this.listData.source.length > 0) {
			let itemDatas = [];
			for (var i = 0; i < this.listData.source.length; i++) {
				let itemData: ItemData = this.listData.source[i]
				let configData = itemData.itemConfig
				if (configData && configData.quality == 5) {
					if (LegendModel.ins().CanEquipTip(itemData.configID)) {
						let str = GlobalConfig.jifengTiaoyueLg.st100773 + ItemBase.QUALITY_COLOR_STR[5] + "&T:" + itemData.itemConfig.name + "|\n" + GlobalConfig.jifengTiaoyueLg.st100774;
						WarnWin.show(TextFlowMaker.generateTextFlow(str), () => {
							UserEquip.ins().sendSmeltEquip(1, this.listData.source);
						}, this)
						return
					}
				}
			}
			UserEquip.ins().sendSmeltEquip(0, this.listData.source);
		}
	}
}

ViewManager.ins().reg(BreakDownListview, LayerManager.UI_Popup);

window["BreakDownListview"] = BreakDownListview