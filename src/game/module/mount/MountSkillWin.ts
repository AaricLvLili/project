class MountSkillWin extends BaseEuiPanel {
	public constructor() {
		super()
		this.skinName = "MountSkillWinSkin";
	}
	public m_NowTips: eui.Label;
	public m_NextTips: eui.Label;
	public m_SkillNameLab: eui.Label;
	public m_FightGroup: eui.Group;
	public m_FightLab: eui.Label;
	public m_LvUpGroup: eui.Group;
	public m_LvUpBtn: eui.Button;
	public m_NowGroup: eui.Group;
	public m_NowCont: eui.Label;
	public m_NextGroup: eui.Group;
	public m_NextCont: eui.Label;
	public m_LvFullLab: eui.Label;
	public m_Scroller: eui.Scroller;
	public m_List: eui.List;
	public m_NoActivate: eui.Image;


	private roleId: number;

	private m_SkillData: eui.ArrayCollection;

	private itemNum: number;
	private needNum: number;
	private skillLv: number;
	private itemId: number;

	public m_NowAttrGroup: eui.Group;
	public m_NextAttrGroup: eui.Group;

	// public m_ItemList:eui.List;
	// public m_NameLab:eui.Label;
	// public m_NeedItemLab:eui.Label;
	// public m_GetLab:eui.Label;
	public m_NeedItem: MainNeedItem;
	public m_AutoBuy: eui.CheckBox;

	public createChildren() {
		super.createChildren();

		this.m_List.itemRenderer = MountSkillIconItem;
		this.m_SkillData = new eui.ArrayCollection;
		this.m_List.dataProvider = this.m_SkillData;


		this.m_LvUpBtn.label = GlobalConfig.jifengTiaoyueLg.st100296;
		this.m_LvFullLab.text = GlobalConfig.jifengTiaoyueLg.st100327;
		this.m_bg.init(`MountSkillWin`, GlobalConfig.jifengTiaoyueLg.st100671);
		this.m_AutoBuy.label = GlobalConfig.jifengTiaoyueLg.st101147;
	}
	initUI() {
		super.initUI();
	}
	open(...param: any[]) {
		MountModel.getInstance.skillSelect = 0;
		this.addViewEvent();
		this.roleId = param[0];
		this.setData();
	}
	close() {
		MountModel.getInstance.skillSelect = -1;
		this.release();
	}
	public release() {
		DisplayUtils.dispose(this.m_NewEff);
		this.m_NewEff = null;
		DisplayUtils.dispose(this.m_ItemEff);
		this.m_ItemEff = null;
		DisplayUtils.dispose(this.m_SkillEff);
		this.m_SkillEff = null
		this.removeViewEvent();
	}
	private addViewEvent() {
		this.m_NeedItem.addEvent();
		this.m_List.addEventListener(eui.ItemTapEvent.ITEM_TAP, this.onClickItem, this);
		this.observe(MessageDef.ITEM_COUNT_CHANGE, this.setData);
		this.AddClick(this.m_LvUpBtn, this.onClickLvUpBtn);
		this.observe(MountEvt.MOUNT_DATAUPDATE_MSG, this.setData);
		this.observe(MountEvt.MOUNT_SKILLDATAUPDATE_MSG, this.playUpEff);

	}
	private removeViewEvent() {
		this.m_NeedItem.removeEvent();
		this.m_List.removeEventListener(eui.ItemTapEvent.ITEM_TAP, this.onClickItem, this);
	}
	private setData() {
		let mountModel = MountModel.getInstance;
		let mountData: MountData = mountModel.mountDic.get(this.roleId);
		this.m_LvUpGroup.visible = false;
		this.m_LvFullLab.visible = false;
		this.m_NoActivate.visible = false;
		this.m_NextGroup.visible = true;
		this.m_NextCont.visible = false;
		this.m_NextAttrGroup.visible = false;
		this.m_FightGroup.visible = false;
		if (mountData) {
			let skillData = [0, 0, 0, 0];
			for (var i = 0; i < mountData.skill.length; i++) {
				skillData[i] = mountData.skill[i];
			}
			this.m_SkillData.replaceAll(skillData);
			let skillLv = skillData[mountModel.skillSelect];
			this.skillLv = skillLv;
			if (skillLv <= 0) {
				this.m_NowTips.text = GlobalConfig.jifengTiaoyueLg.st100676;//"下级效果";
				this.m_NextTips.text = GlobalConfig.jifengTiaoyueLg.st100676;//"下级效果"
				let skillSoltData: { slot: number, lv: number, skillId: number } = mountModel.skillSoltDic.get(mountModel.skillSelect + 1);
				if (skillSoltData) {
					this.m_NextCont.visible = true;
					this.m_NextTips.text = GlobalConfig.jifengTiaoyueLg.st100677;//"激活条件"
					this.m_NextCont.text = LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st100678, [skillSoltData.lv]);//"坐骑达到" + skillSoltData.lv + "阶激活";
					this.m_NoActivate.visible = true;
				}
				let mountsSkillsUpgradeConfig = GlobalConfig.ins("MountsSkillsUpgradeConfig")[skillSoltData.skillId][0];
				this.m_SkillNameLab.text = mountsSkillsUpgradeConfig.skillName + " Lv." + skillLv;
				// this.m_NowCont.text = skillsConfig.desc;
				AttributeData.setAttrGroup(mountsSkillsUpgradeConfig.attrs, this.m_NowAttrGroup);

			} else {
				this.m_NowTips.text = GlobalConfig.jifengTiaoyueLg.st100260;//"当前效果";
				this.m_NextTips.text = GlobalConfig.jifengTiaoyueLg.st100676;//"下级效果"
				let skillSoltData: { slot: number, lv: number, skillId: number } = mountModel.skillSoltDic.get(mountModel.skillSelect + 1);
				let skillData = GlobalConfig.ins("MountsSkillsUpgradeConfig")[skillSoltData.skillId][skillLv - 1];
				if (skillData) {
					this.m_SkillNameLab.text = skillData.skillName + " Lv." + skillLv;
					// this.m_NowCont.text = skillsConfig.desc;
					let power = Math.floor(UserBag.getAttrPower(skillData.attrs));
					this.m_FightLab.text = GlobalConfig.jifengTiaoyueLg.st100306 + power;
					this.m_FightGroup.visible = true;
					AttributeData.setAttrGroup(skillData.attrs, this.m_NowAttrGroup);
					let itemData = [];
					itemData.push(skillData.cost);
					let itemId = skillData.cost.id;
					let itemNum = UserBag.ins().getBagGoodsCountById(0, itemId);
					this.itemId = itemId;
					this.m_NeedItem.setData(itemId, skillData.cost.count)
					this.itemNum = itemNum;
					this.needNum = skillData.cost.count;
				}
				let nextSkillsConfig = GlobalConfig.ins("MountsSkillsUpgradeConfig")[skillSoltData.skillId][skillLv];
				if (nextSkillsConfig) {
					// this.m_NextCont.text = nextSkillsConfig.desc;
					this.m_NextAttrGroup.visible = true;
					this.m_NextGroup.visible = true;
					AttributeData.setAttrGroup(nextSkillsConfig.attrs, this.m_NextAttrGroup);
					this.m_LvUpGroup.visible = true;

				} else {
					this.m_LvFullLab.visible = true;
					this.m_NextGroup.visible = false;
				}
			}
		}
	}
	private static isTips = false;
	private onClickLvUpBtn() {
		let mountModel = MountModel.getInstance;
		if (this.m_AutoBuy.selected && this.itemNum < this.needNum) {
			let yb = Shop.ins().getShopPrice(this.itemId, this.needNum);
			if (Checker.Money(MoneyConst.yuanbao, yb, Checker.YUNBAO_FRAME)) {
				if (MountSkillWin.isTips == false) {
					MountSkillWin.isTips = true;
					WarnWin.show(LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st102089, [yb, GlobalConfig.jifengTiaoyueLg.st100208]), function () {
						MountSproto.ins().sendGetMountSkillUp(this.roleId, mountModel.skillSelect + 1, true);
					}, this)
				} else {
					MountSproto.ins().sendGetMountSkillUp(this.roleId, mountModel.skillSelect + 1, true);
				}
			}
			return;
		}
		if (this.itemNum >= this.needNum && this.skillLv > 0) {
			MountSproto.ins().sendGetMountSkillUp(this.roleId, mountModel.skillSelect + 1, false);
		} else {
			UserTips.ins().showTips(GlobalConfig.jifengTiaoyueLg.st100217);
		}
	}
	private onClickItem(evt: eui.ItemTapEvent) {
		let mountModel = MountModel.getInstance;
		mountModel.skillSelect = evt.itemIndex;
		this.setData();
	}
	private onClickClose() {
		ViewManager.ins().close(this);
	}
	public m_EffGroup: eui.Group;
	public m_ItemEffGroup: eui.Group;
	private m_ItemEff: MovieClip;
	private m_NewEff: MovieClip;
	public m_MainSkillGroup: eui.Group;
	public m_SkillEff: MovieClip;
	public m_SkillGroup1: eui.Group;
	public m_SkillGroup0: eui.Group;
	public m_SkillGroup2: eui.Group;
	public m_SkillGroup3: eui.Group;
	public playUpEff() {
		// this.initEffData2();
		// this.initEffData1();
		// this.initEffData3();
		// this.m_ItemEff.visible = true;
		// this.m_NewEff.visible = true;
		// this.m_SkillEff.visible = true
		// this.m_NewEff.loadUrl(ResDataPath.GetUIEffePath("eff_ui_success"), true, 1);
		// this.m_ItemEff.loadUrl(ResDataPath.GetUIEffePath("eff_ui_icon"), true, 1);
		// this.m_SkillEff.loadUrl(ResDataPath.GetUIEffePath("eff_ui_iconUpgrade"), true, 1);
		let child = this.m_MainSkillGroup.getChildAt(MountModel.getInstance.skillSelect);
		if (child && child instanceof eui.Group) {
			// child.addChild(this.m_SkillEff);
			this.m_SkillEff = ViewManager.ins().createEff(this.m_SkillEff, child, "eff_ui_iconUpgrade");
		}
		this.m_ItemEff = ViewManager.ins().createEff(this.m_ItemEff, this.m_ItemEffGroup, "eff_ui_icon");
		this.m_NewEff = ViewManager.ins().createEff(this.m_NewEff, this.m_EffGroup, "eff_ui_success");

	}
	private onClickGetBtn() {
		UserWarn.ins().setBuyGoodsWarn(this.itemId);
	}


}

ViewManager.ins().reg(MountSkillWin, LayerManager.UI_Popup);
window["MountSkillWin"] = MountSkillWin