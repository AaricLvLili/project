class ZhuanZhiTfPanel extends BaseView implements eui.UIComponent, ICommonWindowTitle, ICommonWindowRoleSelect {
	public constructor(rsView) {
		super();
		this.skinName = "ZhuanZhiTfPanelSkin";
		this.m_RoleSelectPanel = rsView;
	}

	m_RoleSelectPanel: RoleSelectPanel;
	public upLevelBtn: eui.Button;
	public powerLabel: PowerLabel;
	public attrLabel: AttrLabel;
	public consumeLabel: ConsumeLabel;
	public consumeLabel1: ConsumeLabel;
	private m_TfGroup: ZhuanZhiTfItem[] = [];
	public unlockTips: eui.Label;
	public tfName: eui.Label;
	private link: eui.Image;

	protected childrenCreated(): void {
		super.childrenCreated();
		for (let i = 0; i < 22; ++i) {
			this.m_TfGroup[i] = this["item" + i];
			this.m_TfGroup[i].mIndex = i;
			this.m_TfGroup[i].selected = false;
		}
		this.m_TfGroup[ZhuanZhiModel.ins().tfItemIndex].selected = true;
		this.upLevelBtn.label = GlobalConfig.jifengTiaoyueLg.st100208;
	}

	public open(): void {
		this.addTouchEvent(this, this.onClick, this.upLevelBtn)
		this.addTouchEvent(this, this.getXiuwei, this.link);
		this.observe(MessageDef.ZHUANZHI_JM_ITEM_SELECT, this.onTfItemChange);
		this.observe(ZhuanZhiModel.ins().postZhuanZhiTfUpdate, this.UpdateContent);
		this.observe(UserZs.ins().postZsData, this.UpdateContent);
	}

	public close(): void {
		this.removeEvents();
		this.removeObserve();
	}

	private getXiuwei(e) {
		ViewManager.ins().open(GainZsWin);
	}

	private onClick(evt: egret.TouchEvent): void {
		var datas: Sproto.zhuanzhi_talent_info = this.m_TfGroup[ZhuanZhiModel.ins().tfItemIndex].data;
		var config = GlobalConfig.transferTalentConfig[datas.skillid][datas.level];
		if (config.rankUpItem && config.rankUpItem.length > 0) {
			if (!Checker.Money(config.rankUpItem[0].id, config.rankUpItem[0].count) || !Checker.Money(config.rankUpItem[1].id, config.rankUpItem[1].count))
				return;
		}
		ZhuanZhiModel.ins().sendZhuanZhiTfUpLevel(this.curRole, datas.skillid);
	}

	/**切换天赋item*/
	private onTfItemChange(index: number): void {
		this.m_TfGroup[ZhuanZhiModel.ins().tfItemIndex].selected = false;
		this.m_TfGroup[index].selected = true;
		ZhuanZhiModel.ins().tfItemIndex = index;
		this.updateAttrOrCost();
	}

	public UpdateContent() {
		var tfInfo: ZhuanZhiTfInfo = ZhuanZhiModel.ins().zhuanZhiTfList[this.curRole];
		for (let i = 0; i < this.m_TfGroup.length; i++) {
			let tfItem = this.m_TfGroup[i]
			tfItem.roldId = this.curRole;
			tfItem.data = tfInfo.list[i];
		}
		this.updateAttrOrCost();
		this.powerLabel.text = tfInfo.power.toString();
		this.updataRoleRedPoint();
	}

	private updateAttrOrCost(): void {
		var datas: Sproto.zhuanzhi_talent_info = this.m_TfGroup[ZhuanZhiModel.ins().tfItemIndex].data;
		var config = GlobalConfig.transferTalentConfig[datas.skillid][datas.level];
		this.tfName.text = GlobalConfig.jifengTiaoyueLg.st100662 + "：" + config.TalentName;

		if (config.rankUpItem && config.rankUpItem.length > 0) {
			this.consumeLabel.visible = true;
			this.consumeLabel.consumeType = GlobalConfig.jifengTiaoyueLg.st100266;//"修为";
			this.consumeLabel.curValue = UserZs.ins().exp;
			this.consumeLabel.consumeValue = config.rankUpItem[0].count;

			this.consumeLabel1.visible = true;
			this.consumeLabel1.consumeType = GlobalConfig.jifengTiaoyueLg.st100018;//"金币";
			this.consumeLabel1.curValue = GameLogic.ins().actorModel.gold;
			this.consumeLabel1.consumeValue = config.rankUpItem[1].count;
		}
		else {
			this.consumeLabel.visible = false;
			this.consumeLabel1.visible = false;
		}

		this.unlockTips.visible = false;
		this.attrLabel.visible = true;
		this.upLevelBtn.enabled = true;
		var len: number = config.condition.length;
		if (datas.level <= 0 && len > 0) {
			var showTips: boolean = false;
			var str: string = GlobalConfig.jifengTiaoyueLg.st100663 + "\n";//解锁条件
			for (let i = 0; i < len; i++) {
				let id = config.condition[i][0];
				let lvl = config.condition[i][1]
				let targetLvl = ZhuanZhiModel.ins().getTfLevelById(id)
				let conditionCfg = GlobalConfig.transferTalentConfig[id][lvl];
				
				str += conditionCfg.TalentName + LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st100664,[lvl]) + "\n";//达到{0}级
				if (targetLvl < lvl)
					showTips = true;
			}

			if (showTips) {
				this.attrLabel.visible = false;
				this.unlockTips.visible = true;
				this.unlockTips.textFlow = TextFlowMaker.generateTextFlow(str);
				this.upLevelBtn.enabled = false;
			}
		}

		if (config.skillTips && config.skillTips.length > 0) {
			var skillConfig = GlobalConfig.skillsConfig[config.skillTips[0]];
			var nextSkillConfig = GlobalConfig.skillsConfig[config.skillTips[1]];
			this.attrLabel.SetCurAttr(skillConfig.desc);
			if (nextSkillConfig)
				this.attrLabel.SetNextAttr(nextSkillConfig.desc);
			if (datas.level == 0)
				this.tfName.text = GlobalConfig.jifengTiaoyueLg.st100256 + ":" + skillConfig.skinName;//激活技能
		}
		else {
			this.attrLabel.SetCurAttr(AttributeData.getAttStr(config.attrs, 1));
			var nextConfig = GlobalConfig.transferTalentConfig[datas.skillid][datas.level + 1];
			if (nextConfig)
				this.attrLabel.SetNextAttr(AttributeData.getAttStr(nextConfig.attrs, 1));
		}
	}

	public get curRole(): number {
		return this.m_RoleSelectPanel.getCurRole()
	}

	/**更新角色头像红点*/
	private updataRoleRedPoint(): void {
		for (let i = 0, len = SubRoles.ins().subRolesLen; i < len; ++i) {
			this.m_RoleSelectPanel.showRedPoint(i, ZhuanZhiModel.ins().zhuanZhiTfRoleRedPqoint(i));
		}
	}
}

class ZhuanZhiTfItem extends eui.ItemRenderer {
	public constructor() {
		super();
		this.skinName = "ZhuanZhiTfItemSkin";
		this.addEventListener(egret.TouchEvent.TOUCH_END, this.selectedHandle, this);
	}

	/**item索引*/
	public mIndex: number = 0;
	public roldId: number = 0;
	private isSelected: boolean;
	public icon: eui.Image;
	public select: eui.Image;
	public redPoint: eui.Image;
	public level: eui.Label;
	public lockBg: eui.Image;


	protected dataChanged(): void {
		var info: Sproto.zhuanzhi_talent_info = this.data;
		var config = GlobalConfig.transferTalentConfig[info.skillid][info.level];
		var objectConfig = GlobalConfig.transferTalentConfig[info.skillid];
		let count = 0;
		for (let key in objectConfig)
			count++;
		this.level.text = info.level + "/" + (count - 1);
		// this.title.text = config.TalentName;

		this.lockBg.visible = false;
		this.icon.source = `${config.TalentID}_png`;

		var len: number = config.condition.length;
		if (info.level <= 0 && len > 0) {
			let showLock: boolean = false;
			for (let i = 0; i < len; i++) {
				let id = config.condition[i][0];
				let lvl = config.condition[i][1]
				let targetLvl = ZhuanZhiModel.ins().getTfLevelById(id)
				if (targetLvl < lvl) {
					showLock = true;
					break;
				}
			}

			if (showLock)
				this.lockBg.visible = true;
		}

		this.redPoint.visible = false;
		if (!this.lockBg.visible) {
			if (ZhuanZhiModel.ins().isOpenZhuanZhiTfByRoleId(this.roldId)) {
				if (info.level < (count - 1)) {
					if (Checker.Money(config.rankUpItem[0].id, config.rankUpItem[0].count, false) && Checker.Money(config.rankUpItem[1].id, config.rankUpItem[1].count, false))
						this.redPoint.visible = true;
				}
			}
		}
	}

	private selectedHandle(evt: egret.TouchEvent): void {
		if (!this.isSelected)
			GameGlobal.MessageCenter.dispatch(MessageDef.ZHUANZHI_JM_ITEM_SELECT, this.mIndex);
	}

	public set selected(value: boolean) {
		if (this.isSelected == value) return;
		this.isSelected = value;
		this.select.visible = value;
	}
}
window["ZhuanZhiTfPanel"] = ZhuanZhiTfPanel
window["ZhuanZhiTfItem"] = ZhuanZhiTfItem