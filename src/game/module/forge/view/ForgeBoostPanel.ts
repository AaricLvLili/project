class ForgeBoostPanel extends ForgeBasePanel {

	getItemTxt
	private attrLabel: AttrLabel
	private circleRun: CircleRunView
	protected mForgeType: number = 0;

	public imgPart0: eui.Image;
	public imgPart1: eui.Image;
	public imgPart2: eui.Image;
	public imgPart3: eui.Image;
	public imgPart4: eui.Image;
	public imgPart5: eui.Image;
	public imgPart6: eui.Image;
	public imgPart7: eui.Image;
	public checkAttr: eui.Label
	windowCommonBg = "pic_bj_20_png"
	private imgRole: eui.Image
	_isAutoUp: boolean = false
	public constructor() {
		super()

		this.skinName = "BoostSkin";
		this.name = GlobalConfig.jifengTiaoyueLg.st100317;
		this.windowTitleIconName = GlobalConfig.jifengTiaoyueLg.st100317;
		this.checkAttr.text = GlobalConfig.jifengTiaoyueLg.st100095;
		this.getItemTxt.textFlow = (new egret.HtmlTextParser).parser("<a href=\"event:\"><u>" + this.getItemTxt.text + "</u></a>");

	}

	protected Init(): void {
		this.consumeLabel.consumeType = GlobalConfig.jifengTiaoyueLg.st101181;
		this.upGradeBtn.label = GlobalConfig.jifengTiaoyueLg.st101180;
		this.circleRun.mPanel = this;
		this.circleRun.type = this.mForgeType;
		// this.imgRole.width = 240
		// this.imgRole.height = 277
	}
	UpdateContent() {
		super.UpdateContent()
		let model = SubRoles.ins().getSubRoleByIndex(this.m_RoleSelectPanel.getCurRole());
		this.imgRole.source = `comp_rw_${model.sex}${model.job}_png`;
	}

	open() {
		super.open();
		this.getItemTxt.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onGetItem, this);
		UIHelper.SetLinkStyleLabel(this.checkAttr)
	}

	close() {
		super.close()
		this.getItemTxt.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onGetItem, this);
		MessageCenter.ins().removeAll(this);
		this.stopAutoUp();
	}
	private static isTips: boolean = false;
	onTouch() {
		var costConfig = UserForge.ins().getEnhanceCostConfigByLv(this.lv + 1);
		if (costConfig == null) {
			UserTips.ins().showTips(GlobalConfig.jifengTiaoyueLg.st101098);
			return;
		}
		if (this.m_AutoBuy.selected && this.itemNum < costConfig.stoneNum) {
			let yb = Shop.ins().getShopPrice(costConfig.stoneId, costConfig.stoneNum);
			if (Checker.Money(MoneyConst.yuanbao, yb, Checker.YUNBAO_FRAME)) {
				if (ForgeBoostPanel.isTips == false) {
					ForgeBoostPanel.isTips = true;
					WarnWin.show(LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st102089, [yb, GlobalConfig.jifengTiaoyueLg.st100208]), function () {
						UserForge.ins().sendUpGrade(this.curRole(), this.pos, true);
					}, this)
				} else {
					UserForge.ins().sendUpGrade(this.curRole(), this.pos, true);
				}
			}
			return;
		}
		if (this.itemNum >= costConfig.stoneNum) {
			UserForge.ins().sendUpGrade(this.curRole(), this.pos);
		}
		else {
			UserWarn.ins().setBuyGoodsWarn(costConfig.stoneId, costConfig.stoneNum - this.itemNum);
		}
	};

	onGetWay() {
		var costConfig = UserForge.ins().getEnhanceCostConfigByLv(this.lv + 1);
		if (costConfig == null) {
			UserTips.ErrorTip(GlobalConfig.jifengTiaoyueLg.st101098);
			return;
		}
		UserWarn.ins().setBuyGoodsWarn(costConfig.stoneId, costConfig.stoneNum - this.itemNum);
	}

	onGetItem(e) {
		UserWarn.ins().setBuyGoodsWarn(UserForge.ins().getEnhanceCostConfigByLv(this.lv + 1).stoneId, 1);
	};

    /**
     * 移动属性
     */
	moveAttr() {
		this.attrLabel.moveAttr()
	};
	setAttrData(config, nextConfig) {
		this.circleRun.setValue()
		// this.circleRun.setPos(this.pos)
		this.circleRun.setPos(this.pos)
		var nextConfig;
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
		var costConfig = UserForge.ins().getEnhanceCostConfigByLv(this.lv + 1);
		if (costConfig) {
			this.itemNum = UserBag.ins().getBagGoodsCountById(0, costConfig.stoneId);
			this.cost = costConfig.stoneNum;
		}
	}

	public clear() {
		this.circleRun.clear();
	}

	btnAutoUpClick() {
		if (!Deblocking.Check(DeblockingType.TYPE_84)) {
			return;
		}
		var costConfig = UserForge.ins().getEnhanceCostConfigByLv(this.lv + 1);
		if (costConfig == null) {
			UserTips.ins().showTips(GlobalConfig.jifengTiaoyueLg.st101098);
			return;
		}
		if (this.itemNum >= costConfig.stoneNum) {
			/**一键强化 */
			WarnWin.show(GlobalConfig.jifengTiaoyueLg.st100243, () => {
				UserForge.ins().sendForgeOneKey(this.curRole());
			}, this);
		}
		else {
			if (this.m_AutoBuy.selected) {
				let yb = Shop.ins().getShopPrice(costConfig.stoneId, costConfig.stoneNum);
				if (Checker.Money(MoneyConst.yuanbao, yb, Checker.YUNBAO_FRAME)) {
					if (ForgeBoostPanel.isTips == false) {
						ForgeBoostPanel.isTips = true;
						WarnWin.show(LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st102089, [yb, GlobalConfig.jifengTiaoyueLg.st100208]), function () {
							UserForge.ins().sendUpGrade(this.curRole(), this.pos, true);
						}, this)
					} else {
						UserForge.ins().sendUpGrade(this.curRole(), this.pos, true);
					}
				}
				return;
			}
			UserWarn.ins().setBuyGoodsWarn(costConfig.stoneId, costConfig.stoneNum - this.itemNum);
		}
	}


	public onClickCheckAttr() {
		ViewManager.ins().open(RoleZBAttrPanel, this.m_RoleSelectPanel.getCurRole(), ForgeType.TYPE0);
	}

	protected onClickDaShi() {
		super.onClickDaShi();
		ViewManager.ins().open(ForgeDashiWin, 0, this.curRole())
	};

}
window["ForgeBoostPanel"] = ForgeBoostPanel