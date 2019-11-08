class ForgeZhulingPanel extends ForgeBasePanel {

	private m_ForgeItemView: ForgeItemView

	private attrLabel: AttrLabel
	checkAttr: eui.Label
	_isAutoUp: boolean = false
	public constructor() {
		super();
		this.skinName = "GemZhulingPanelSkin"
		this.name = GlobalConfig.jifengTiaoyueLg.st101198;
		this.windowTitleIconName = GlobalConfig.jifengTiaoyueLg.st101198;
		this.checkAttr.text = GlobalConfig.jifengTiaoyueLg.st100095;
		let itemList = []
		for (var i = 0; i < 8; ++i) {
			itemList[i] = this['itemForge' + i];
		}
		this.m_ForgeItemView = new ForgeItemView(this, itemList)
		this.m_ForgeItemView.type = this.mForgeType
	}

	Init() {
		this.consumeLabel.consumeType = GlobalConfig.jifengTiaoyueLg.st100657;
		this.upGradeBtn.label = GlobalConfig.jifengTiaoyueLg.st101199;
	}
	open() {
		super.open();
		UIHelper.SetLinkStyleLabel(this.checkAttr)
	}
	close() {
		super.close()
		this.stopAutoUp();
	}
	private static isTips: boolean = false;
	onTouch() {
		var costConfig = UserForge.ins().getZhulingCostConfigByLv(this.lv + 1);
		if (costConfig == null) {
			UserTips.ins().showTips(GlobalConfig.jifengTiaoyueLg.st101098);
			return;
		}
		if (this.m_AutoBuy.selected && this.itemNum < costConfig.soulNum) {
			let yb = Shop.ins().getShopPrice(4, costConfig.soulNum);
			if (Checker.Money(MoneyConst.yuanbao, yb, Checker.YUNBAO_FRAME)) {
				if (ForgeZhulingPanel.isTips == false) {
					ForgeZhulingPanel.isTips = true;
					WarnWin.show(LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st102089, [yb, GlobalConfig.jifengTiaoyueLg.st100208]), function () {
						UserZhuLing.ins().sendUpGrade(this.curRole(), this.pos, true);
					}, this)
				} else {
					UserZhuLing.ins().sendUpGrade(this.curRole(), this.pos, true);
				}
			}
			return;
		}
		if (this.itemNum >= costConfig.soulNum) {
			UserZhuLing.ins().sendUpGrade(this.curRole(), this.pos);
		} else {
			UserWarn.ins().setBuyGoodsWarn(4, 1);
		}
	}

	onGetWay() {
		UserWarn.ins().setBuyGoodsWarn(4, 1);
	}

	setAttrData(config, nextConfig) {
		this.m_ForgeItemView.setValue()
		this.m_ForgeItemView.setPos(this.pos)
		this["equipItemIcon"].source = ResDataPath.GetEquipDefaultPIcon(this.pos)
		// var nextConfig;
		if (config) {
			// nextConfig = UserForge.ins().getForgeConfigByPos(this.pos, this.lv + 1, this.mForgeType);
			var attr = AttributeData.getAttrStrAdd(config.attr, this.mForgeType == 0 ? 11 : 12);
			this.attrLabel.SetCurAttr(AttributeData.getAttStr(attr, 1))
		} else {
			// nextConfig = UserForge.ins().getForgeConfigByPos(this.pos, 1, this.mForgeType);
			var attr = [];
			for (var a = 0; a < nextConfig.attr.length; a++) {
				var attrData = new AttributeData;
				attrData.type = nextConfig.attr[a].type;
				attrData.value = 0;
				attr.push(attrData);
			}
			this.attrLabel.SetCurAttr(AttributeData.getAttStr(attr, 1))
		}
		if (nextConfig) {
			var numStr = "";
			for (var i = 0; i < nextConfig.attr.length; i++) {
				numStr += nextConfig.attr[i].value;
				if (i < nextConfig.attr.length - 1)
					numStr += "\n";
			}
			this.attrLabel.SetNextAttr(numStr)
		}
	};

	protected SetItemCount() {
		this.cost = 0;
		this.itemNum = parseInt(GameLogic.ins().actorModel.soul.toString())
		var costConfig = UserForge.ins().getZhulingCostConfigByLv(this.lv + 1);
		if (costConfig) {
			this.cost = costConfig.soulNum;
		}
	}

	public clear() {
		this.m_ForgeItemView.clear();
	}

	protected mForgeType: number = 2

	// windowTitleIconName: string = "铸灵"
	btnAutoUpClick() {
		if (!Deblocking.Check(DeblockingType.TYPE_86)) {
			return;
		}
		var costConfig = UserForge.ins().getZhulingCostConfigByLv(this.lv + 1);
		if (costConfig == null) {
			UserTips.ins().showTips(GlobalConfig.jifengTiaoyueLg.st101098);
			return;
		}

		if (this.itemNum >= costConfig.soulNum) {
			/**一键强化 */
			WarnWin.show(GlobalConfig.jifengTiaoyueLg.st100243, () => {
				UserForge.ins().sendEssenceOneKey(this.curRole());
			}, this);
		}
		else {
			if (this.m_AutoBuy.selected) {
				let yb = Shop.ins().getShopPrice(4, costConfig.soulNum);
				if (Checker.Money(MoneyConst.yuanbao, yb, Checker.YUNBAO_FRAME)) {
					if (ForgeZhulingPanel.isTips == false) {
						ForgeZhulingPanel.isTips = true;
						WarnWin.show(LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st102089, [yb, GlobalConfig.jifengTiaoyueLg.st100208]), function () {
							UserZhuLing.ins().sendUpGrade(this.curRole(), this.pos, true);
						}, this)
					} else {
						UserZhuLing.ins().sendUpGrade(this.curRole(), this.pos, true);
					}
				}
				return;
			}
			UserWarn.ins().setBuyGoodsWarn(4, 1);
		}
	}

	public onClickCheckAttr() {
		ViewManager.ins().open(RoleZBAttrPanel, this.m_RoleSelectPanel.getCurRole(), ForgeType.TYPE2);
	}

	protected onClickDaShi() {
		super.onClickDaShi();
		ViewManager.ins().open(ForgeDashiWin, 2, this.curRole())
	};
}
window["ForgeZhulingPanel"] = ForgeZhulingPanel