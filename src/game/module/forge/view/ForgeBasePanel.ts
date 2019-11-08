class ForgeBasePanel extends BaseView implements ICommonWindowTitle, ICommonWindowRoleSelect {

	protected upGradeBtn: eui.Button
	protected powerLabel: PowerLabel
	protected consumeLabel: ConsumeLabel
	protected maxLvTF: eui.Label
	protected getItem: any
	protected btnAutoUp: eui.Button
	protected pos = 0
	protected lv = 0
	protected itemNum = 0
	protected cost = 0

	protected config
	protected nextConfig
	protected mForgeType: number = 0
	protected checkAttr: eui.Label;

	protected saveCurRole: any;

	public m_DashiBtn: eui.Button;

	public group: eui.Group;
	public m_AutoBuy: eui.CheckBox;
	public SetComp(powerLabel: PowerLabel, consumeLabel: ConsumeLabel, upGradeBtn: eui.Button, btnAutoUp: eui.Button, maxLvTF: eui.Label, getItem: any, group: eui.Group, m_AutoBuy) {
		this.powerLabel = powerLabel
		this.consumeLabel = consumeLabel
		this.upGradeBtn = upGradeBtn
		this.btnAutoUp = btnAutoUp
		this.maxLvTF = maxLvTF
		this.getItem = getItem
		this.group = group;
		this.m_AutoBuy = m_AutoBuy;
	}

	setPower() {
		var model = SubRoles.ins().getSubRoleByIndex(this.m_RoleSelectPanel.getCurRole());
		let power = model.getForgeTotalPower(this.mForgeType);
		this.powerLabel.text = power
		// BitmapNumber.ins().changeNum(this.totalPower, this._totalPower, "1");
	};

	public constructor() {
		super()
	}

	protected Init(): void { }

	windowTitleIconName: string = ""

	m_RoleSelectPanel: RoleSelectPanel

	open() {
		this.maxLvTF.visible = true;
		this.group.visible = true;
		this.powerLabel.visible = true;
		this.upGradeBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouch, this)
		this.btnAutoUp.addEventListener(egret.TouchEvent.TOUCH_TAP, this.btnAutoUpClick, this)
		this.getItem.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onGetWay, this)
		this.observe(UserBag.postItemChange, this.setCount); //道具变更
		this.observe(UserBag.postItemAdd, this.setCount);
		this.observe(GameLogic.ins().postSoulChange, this.setCount)
		this.checkAttr.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClickCheckAttr, this);
		this.AddClick(this.m_DashiBtn, this.onClickDaShi);
	}

	close() {
		this.upGradeBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouch, this)
		this.btnAutoUp.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.btnAutoUpClick, this)
		this.getItem.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onGetWay, this)
		this.checkAttr.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onClickCheckAttr, this);
		this.clear();
	}

	UpdateContent(): void {
		this.Init()
		let curRole = this.m_RoleSelectPanel.getCurRole();
		if (this.saveCurRole != null && this.saveCurRole != curRole) {
			this.stopAutoUp();
		}
		this.saveCurRole = curRole;
		var role = SubRoles.ins().getSubRoleByIndex(curRole);

		let index = role.getMinEquipIndexByType(this.mForgeType);
		this.pos = index
		// if (!bool) {
		// 	this.pos = index == 0 ? 7 : index - 1
		// }
		this.lv = role.GetEquipLevelByType(this.pos, this.mForgeType)
		this.config = UserForge.ins().getForgeConfigByPos(this.pos, this.lv, this.mForgeType);
		this.nextConfig = UserForge.ins().getForgeConfigByPos(this.pos, this.lv + 1, this.mForgeType);
		this.setPower();
		// this.btnAutoUp.visible = false
		// this.cbAutoBuy.visible = false
		if (this.nextConfig) {

			this.setCount();

			this.btnAutoUp.visible = true
			this.upGradeBtn.visible = true;
			this.consumeLabel.visible = true
			this.maxLvTF.visible = false
		} else {
			this.upGradeBtn.visible = false
			this.consumeLabel.visible = false
			this.maxLvTF.visible = true
			this.btnAutoUp.visible = false
		}
		// this.upGradeBtn.x = 190
		// this.boostPrice1.horizontalCenter = this.canShow() ? -52.5 : -145.5;
		//this.consumeLabel.x = 0
		// this.getItem.x = 500

		this.setAttrData(this.config, this.nextConfig);
		//this.playEffectPic(this.mForgeType, this);
	}

	private playEffectPic(forgeType: number, tipIndexView: ForgeBasePanel) {
		// forgeType-类型：0-强化 1-宝石 2-注灵 3-突破
		if ([0].indexOf(forgeType) == -1) return;
		this.m_RoleSelectPanel.getCurRole()
		var role = SubRoles.ins().getSubRoleByIndex(this.m_RoleSelectPanel.getCurRole());
		// var role = SubRoles.ins().getSubRoleByIndex(this.commonWindowBg.getCurRole());
		let pos = role.getMinEquipIndexByType(forgeType);
		// pos = (pos==0)?7:pos-1;
		for (var i = 0; i < 8; i++) {
			let visible: boolean = false;
			if (pos == i) visible = true;
			tipIndexView["imgPart" + i].visible = visible;
		}
	}
	setCount() {
		// var cost = 0;
		// var costConfig = UserForge.ins().getEnhanceCostConfigByLv(this.lv + 1);
		// if (costConfig) {
		// 	this.itemNum = UserBag.ins().getBagGoodsCountById(0, costConfig.stoneId);
		// 	cost = costConfig.stoneNum;
		// }
		// var colorStr = "";
		// if (this.itemNum >= cost)
		// 	colorStr = "|C:0x00ff00&T:";
		// else
		// 	colorStr = "|C:0xf87372&T:";

		this.SetItemCount()
		this.consumeLabel.consumeValue = this.cost
		this.consumeLabel.curValue = this.itemNum
		// this.countLabel.textFlow = TextFlowMaker.generateTextFlow(colorStr + this.itemNum + "| / " + cost);
	}

	protected SetItemCount() { }

	public curRole(): number {
		return this.m_RoleSelectPanel.getCurRole()
	}


	protected setAttrData(config, nextConfig): void { }

	protected onTouch(): void { }

	protected onGetWay(): void { }

	protected moveAttr(): void { }

	protected btnAutoUpClick(): void { }


	protected clear(): void { }

	protected onClickCheckAttr(): void { }

	protected stopAutoUp() { };
	protected onClickDaShi() { };
}
enum ForgeType {
	TYPE0 = 0,
	TYPE1 = 1,
	TYPE2 = 2,
}
window["ForgeBasePanel"] = ForgeBasePanel