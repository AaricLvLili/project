// class ForgeGemPanel extends ForgeBoostPanel implements ICommonWindowTitle, ICommonWindowRoleSelect {
class ForgeGemPanel extends ForgeBasePanel {

	private m_ForgeItemView: ForgeItemView
	btnAutoUp: eui.Button
	_isAutoUp: boolean = false
	checkAttr: eui.Label
	public constructor() {
		super()
		this.skinName = "GemSkin";
		this.name = GlobalConfig.jifengTiaoyueLg.st101194;
		this.checkAttr.text = GlobalConfig.jifengTiaoyueLg.st100095;
		let itemList = []
		for (var i = 1; i <= 8; ++i) {
			itemList[i - 1] = this['itemForge' + i];
		}
		this.windowTitleIconName = GlobalConfig.jifengTiaoyueLg.st101194;
		this.m_ForgeItemView = new ForgeItemView(this, itemList)
		this.m_ForgeItemView.type = this.mForgeType
	}

	protected Init(): void {
		this.consumeLabel.consumeType = GlobalConfig.jifengTiaoyueLg.st101195;
		this.upGradeBtn.label = GlobalConfig.jifengTiaoyueLg.st101196;
		for (let i = 0; i < 4; ++i) {
			this.m_GemLabel[i] = this["gemLabel" + i]
		}
		//let e: eui.CheckBox = this.cbAutoBuy;
		// (e.labelDisplay as eui.Label).textColor = 0xdcc67d;
		// this.btnAutoUp.visible = this.canShow() && this.upGradeBtn.visible;
		// this.cbAutoBuy.visible = this.canShow() && this.upGradeBtn.visible;

	}
	open() {
		super.open();
		UIHelper.SetLinkStyleLabel(this.checkAttr)
	}
	close() {
		super.close();
		this.stopAutoUp();
	}
	/**满足2转才能显示 */
	canShow() {
		// var zs = UserZs.ins() ? UserZs.ins().lv : 0;
		// return zs > 1;
		//
		var autoLv = GlobalConfig.ins("StoneCommonConfig").autoLv;
		return GameGlobal.actorModel.level >= autoLv[0] || GameGlobal.actorModel.vipLv >= autoLv[1]
	};
	updateLevel() {
		// this.upGradeBtn.x = this.canShow() ? 275 : 190
		// this.boostPrice1.horizontalCenter = this.canShow() ? -52.5 : -145.5;
		// this.consumeLabel.x = this.canShow() ? 85 : 0
		// this.getItem.x = this.canShow() ? 585 : 513

	};
	protected m_GemLabel: any[] = []

	protected mForgeType: number = 1
	private static isTips: boolean = false;
	onTouch() {
		var costConfig = UserForge.ins().getStoneLevelCostConfigByLv(this.lv + 1);
		if (costConfig == null) {
			UserTips.ins().showTips(GlobalConfig.jifengTiaoyueLg.st101098);
			return;
		}
		if (this.m_AutoBuy.selected && this.itemNum < costConfig.count) {
			let yb = Shop.ins().getShopPrice(costConfig.itemId, costConfig.count);
			if (Checker.Money(MoneyConst.yuanbao, yb, Checker.YUNBAO_FRAME)) {
				if (ForgeGemPanel.isTips == false) {
					ForgeGemPanel.isTips = true;
					WarnWin.show(LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st102089, [yb, GlobalConfig.jifengTiaoyueLg.st100208]), function () {
						UserGem.ins().sendUpGrade(this.curRole(), this.pos, true);
					}, this)
				} else {
					UserGem.ins().sendUpGrade(this.curRole(), this.pos, true);
				}
			}
			return;
		}
		if (this.itemNum >= costConfig.count) {
			UserGem.ins().sendUpGrade(this.curRole(), this.pos);
		}
		else {
			UserWarn.ins().setBuyGoodsWarn(costConfig.itemId, costConfig.count - this.itemNum);
		}
	}
	btnAutoUpClick() {
		if (!Deblocking.Check(DeblockingType.TYPE_85)) {
			return;
		}
		var costConfig = UserForge.ins().getStoneLevelCostConfigByLv(this.lv + 1);
		if (costConfig == null) {
			UserTips.ins().showTips(GlobalConfig.jifengTiaoyueLg.st101098);
			return;
		}

		if (this.itemNum >= costConfig.count) {
			/**一键强化 */
			WarnWin.show(GlobalConfig.jifengTiaoyueLg.st100243, () => {
				UserForge.ins().sendGemOneKey(this.curRole());
			}, this);
		} else {
			if (this.m_AutoBuy.selected) {
				let yb = Shop.ins().getShopPrice(costConfig.itemId, costConfig.count);
				if (Checker.Money(MoneyConst.yuanbao, yb, Checker.YUNBAO_FRAME)) {
					if (ForgeGemPanel.isTips == false) {
						ForgeGemPanel.isTips = true;
						WarnWin.show(LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st102089, [yb, GlobalConfig.jifengTiaoyueLg.st100208]), function () {
							UserGem.ins().sendUpGrade(this.curRole(), this.pos, true);
						}, this)
					} else {
						UserGem.ins().sendUpGrade(this.curRole(), this.pos, true);
					}
				}
				return;
			}
			UserWarn.ins().setBuyGoodsWarn(costConfig.itemId, costConfig.count - this.itemNum);
		}
	}

	onGetWay() {
		var costConfig = UserForge.ins().getStoneLevelCostConfigByLv(this.lv + 1);
		if (costConfig == null) {
			UserTips.ErrorTip(GlobalConfig.jifengTiaoyueLg.st101098);
			return;
		}
		if (costConfig)
			UserWarn.ins().setBuyGoodsWarn(costConfig.itemId, costConfig.count - this.itemNum);
	}

	setAttrData(config, nextConfig) {
		this.m_ForgeItemView.setValue()
		this.m_ForgeItemView.setPos(this.pos)

		this["equipItemIcon"].source = ResDataPath.GetEquipDefaultPIcon(this.pos)

		var lv = this.lv;

		var attrName = "";
		if (config) {
			var attr = AttributeData.getAttrStrAdd(config.attr, 15);
			// nextConfig = UserForge.ins().getForgeConfigByPos(this.pos, this.lv + 1, this.mForgeType);
			attrName = AttributeData.getAttrStrByType(config.attr[0].type);

			for (let i = 1; i <= this.m_GemLabel.length; ++i) {
				let item = this.m_GemLabel[i - 1]
				let showItem = this["item" + i]
				if (config.attr.length < i) {
					showItem["iconImg"].source = ""
					this.SetGemLabel(item, "bs_00_png", attrName, null, null)
				} else {
					let showLv = lv
					if (config.attr.length > i) {
						showLv = 20
						lv -= 20
					}
					let icon = "bs_" + config.attr[0].type + showLv + "_png"
					showItem["iconImg"].source = icon
					this.SetGemLabel(item, icon, attrName, showLv, attr[i - 1].value)
				}
			}
		} else {
			// nextConfig = UserForge.ins().getForgeConfigByPos(this.pos, 1, this.mForgeType);
			attrName = AttributeData.getAttrStrByType(nextConfig.attr[0].type);
			for (let i = 0; i < this.m_GemLabel.length; ++i) {
				this["item" + (i + 1)]["iconImg"].source = ""
				let item = this.m_GemLabel[i]
				this.SetGemLabel(item, "bs_00_png", attrName, null, null)
			}
		}
		// this.btnAutoUp.visible = this.canShow() && this.upGradeBtn.visible;
		// this.cbAutoBuy.visible = this.canShow() && this.upGradeBtn.visible;
		this.updateLevel();
	}

	private SetGemLabel(label: { gem: eui.Image, lvLabel: eui.Label }, icon: string, attr: string, lv: string | number, value: string): void {
		label.gem.source = icon || "bs_00_png";
		if (value) {
			label.lvLabel.textColor = Color.Black
			label.lvLabel.text = "Lv" + lv + "    " + attr + "+" + value
		} else {
			label.lvLabel.textColor = Color.Red
			label.lvLabel.text = attr + GlobalConfig.jifengTiaoyueLg.st101197;
		}
	}

    /**
     * 移动属性
     */
	moveAttr() {
		// var t = egret.Tween.get(this.lvLabel);
		// t.to({ "x": this.lvLabel.x + 200, "alpha": 0 }, 200).to({ "x": 0 }, 200).to({ "x": 149, "alpha": 1 }, 200);
		// var t1 = egret.Tween.get(this.attrLabel);
		// t1.to({ "x": this.attrLabel.x + 200, "alpha": 0 }, 200).to({ "x": 50 }, 200).to({ "x": 199, "alpha": 1 }, 200);
	};
	onGetItem(e) {
		UserWarn.ins().setBuyGoodsWarn(UserForge.ins().getStoneLevelCostConfigByLv(this.lv + 1).itemId, 1);
	};

	protected SetItemCount() {
		this.cost = 0;
		var costConfig = UserForge.ins().getStoneLevelCostConfigByLv(this.lv + 1);
		if (costConfig) {
			this.itemNum = UserBag.ins().getBagGoodsCountById(0, costConfig.itemId);
			this.cost = costConfig.count;
		}
	}
	cbAutoBuyClick() {
		var costConfig = UserForge.ins().getStoneLevelCostConfigByLv(this.lv + 1);
		if (costConfig == null) {
			UserTips.ins().showTips(GlobalConfig.jifengTiaoyueLg.st101098);
			return;
		}
		if (this.itemNum >= costConfig.count) {
			UserForge.ins().sendForgeOneKey(this.curRole());
		} else {
			UserWarn.ins().setBuyGoodsWarn(costConfig.itemId, costConfig.count - this.itemNum);
		}
	}

	public clear() {
		this.m_ForgeItemView.clear();
	}

	public onClickCheckAttr() {
		ViewManager.ins().open(RoleZBAttrPanel, this.m_RoleSelectPanel.getCurRole(), ForgeType.TYPE1);
	}

	protected onClickDaShi() {
		super.onClickDaShi();
		ViewManager.ins().open(ForgeDashiWin, 1, this.curRole())
	};
}

window["ForgeGemPanel"] = ForgeGemPanel