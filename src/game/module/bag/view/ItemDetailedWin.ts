class ItemDetailedWin extends BaseEuiPanel {

	itemIcon: ItemIcon;
	nameLabel: eui.Label;
	lv: eui.Label;
	num: eui.Label;
	description: eui.Label;
	power: eui.Label;
	BG: any;
	public m_Lan1: eui.Label;
	public m_Lan2: eui.Label;
	public m_StarGroup: eui.Group;

	public initUI() {
		super.initUI();
		this.skinName = "ItemTipsSkin";
		this.itemIcon.imgJob.visible = false;
		this.m_Lan1.text = GlobalConfig.jifengTiaoyueLg.st101883;
		this.m_Lan2.text = GlobalConfig.jifengTiaoyueLg.st101882;
	};
	public open() {
		var param = [];
		for (var _i = 0; _i < arguments.length; _i++) {
			param[_i - 0] = arguments[_i];
		}
		var type = param[0];
		var id = param[1];
		var num = param[2];
		let moneyType = param[3];
		this.addEventListener(egret.TouchEvent.TOUCH_END, this.otherClose, this);
		if (moneyType == null) {
			this.setData(type, id, num);
		} else {
			this.setMoneyData(moneyType);
		}
	};
	public close() {
		var param = [];
		for (var _i = 0; _i < arguments.length; _i++) {
			param[_i - 0] = arguments[_i];
		}
		this.removeEventListener(egret.TouchEvent.TOUCH_END, this.otherClose, this);
	};
	public otherClose(evt) {
		ViewManager.ins().close(this);
	};
	public setData(type, id, num) {
		var numStr = "";
		if (num == undefined) {
			var data = UserBag.ins().getBagGoodsByTypeAndId(type, id);
			numStr = data ? (data.count + "") : "";
		}
		else
			numStr = num + "";
		var config = GlobalConfig.itemConfig[id];
		this.nameLabel.text = config.name;
		// this.nameLabel.textColor = ItemBase.QUALITY_COLOR[config.quality];
		this.nameLabel.textColor = 0x2f333b
		this.itemIcon.setData(config);
		if (config.level) this.lv.text = LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st101368, [config.level]);
		else this.lv.text = '';
		this.num.text = numStr;
		this.description.textFlow = TextFlowMaker.generateTextFlow(config.desc);
		if (config.type == 2) {
			var info = MiJiSkillConfig.getXinFaByItemId(config.id);
			if (info) this.power.text = GlobalConfig.jifengTiaoyueLg.st100070 + "：" + info.power;
		}
		else
			this.power.text = "";
		if (config.type == 14) {
			this.m_Lan1.text = GlobalConfig.jifengTiaoyueLg.st100315;
			let gadconfig = GlobalConfig.ins("COAwordproduceConfig")[id];
			if (gadconfig) {
				this.num.text = gadconfig.site + GlobalConfig.jifengTiaoyueLg.st101967;
			}
			this.m_StarGroup.visible = true;
			GadModel.getInstance.setStarNum(config.quality, this.m_StarGroup, 0.8)
		} else {
			this.m_StarGroup.visible = false;
			this.m_Lan1.text = GlobalConfig.jifengTiaoyueLg.st101883;
		}
		this.BG.height = 200 + this.description.height;
	};

	public setMoneyData(id: number) {
		let config = GlobalConfig.ins("LanResourcesConfig")[id];
		if (config) {
			this.power.visible = false;
			this.num.text = ""
			this.m_Lan1.text = config.typeDes;
			this.lv.text = LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st101368, [1]);
			this.description.text = config.describe;
			this.nameLabel.text = MoneyManger.MoneyConstToName(id);
			this.m_StarGroup.visible = false;
			this.itemIcon.setItemImg(MoneyManger.MoneyConstToSource(id))
			this.itemIcon.setItemBg(ResDataPath.GetItemQualityName(MoneyManger.MoneyConstToQuality(id)))
		}

	}

}

ViewManager.ins().reg(ItemDetailedWin, LayerManager.UI_Popup);
window["ItemDetailedWin"] = ItemDetailedWin