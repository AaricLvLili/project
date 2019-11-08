class ZhuZaiEquipGrowPanel extends BaseView implements ICommonWindowTitle, ICommonWindowRoleSelect {

	private star: StarList
	upgradeBtn0
	useTxt
	useTxt0
	countTxt0
	useTxt1 :eui.Label;
	upFailLable:eui.Label;
	public m_ItemTab: ZhuzaiEquipItemTab

	private powerLabel: PowerLabel
	private attrLabel: AttrLabel
	private EquipPointGrowUpConfig;

	private guardName:eui.Label;
	private guardUse:eui.Label;
	private link1:eui.Label;
	private link: eui.Label
	private cbAutoBuy:eui.CheckBox;
	private txt0:eui.Label;
	private txt1:eui.Label;
	private countTxt:eui.Label;

	public constructor() {
		super()
		this.skinName = "ZhuzaiEquipPromoteSkin";
		this.windowTitleIconName = GlobalConfig.jifengTiaoyueLg.st100207;
	}

	childrenCreated() {
		this.attrLabel.showBg();
		this.star.listLength = 5
		this.star.starNum = 0
		this.txt0.text = GlobalConfig.jifengTiaoyueLg.st100232 + "：";
		this.txt1.text = GlobalConfig.jifengTiaoyueLg.st100234;
		this.countTxt.text = GlobalConfig.jifengTiaoyueLg.st100233 + "：";
		this.link.text = GlobalConfig.jifengTiaoyueLg.st100108;
		this.link1.text = GlobalConfig.jifengTiaoyueLg.st100108;
		UIHelper.SetLinkStyleLabel(this.link);
		UIHelper.SetLinkStyleLabel(this.link1);
	}

	open() {
		this.m_ItemTab.AddListener(this.setData, this)
		this.setEquipPoint()

		this.link.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClick, this)
		this.link1.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClick, this)
		this.upgradeBtn0.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClick, this)
		this.cbAutoBuy.addEventListener(egret.Event.CHANGE, this.cbAutoChange, this);

		GameGlobal.MessageCenter.addListener(MessageDef.ZHUZAI_UP_RESULT, this.UpdateContent, this)
		GameGlobal.MessageCenter.addListener(MessageDef.ZHUZAI_DATA_UPDATE, this.UpdateContent, this)
		MessageCenter.addListener(UserBag.postItemChange, this.UpdateContent, this); //道具变更
		MessageCenter.addListener(UserBag.postItemAdd, this.UpdateContent, this);
	}

	close() {
		this.link.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onClick, this)
		this.link1.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onClick, this)
		this.upgradeBtn0.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onClick, this)
		this.cbAutoBuy.removeEventListener(egret.Event.CHANGE, this.cbAutoChange, this);

		this.m_ItemTab.RemoveListener(this.setData, this)
		this.removeObserve()
	}


	setData() {
		if(this.EquipPointGrowUpConfig  == null)
			this.EquipPointGrowUpConfig  = GlobalConfig.ins("EquipPointGrowUpConfig");
		var e = this.m_ItemTab.GetSelectIndex() + 1,
			t = this.m_RoleSelectPanel.getCurRole(),
			i = SubRoles.ins().GetZhuZaiData(t)[this.m_ItemTab.GetSelectIndex()],
			n = i.lv,
			r = this.EquipPointGrowUpConfig[e][n],
			o = this.EquipPointGrowUpConfig[e][n + 1],
			s = r.needLevel;
		this.useTxt.text = (s / 1e3 >> 0) + GlobalConfig.jifengTiaoyueLg.st100067;
		var a = 1e3 * GameGlobal.zsModel.lv + GameGlobal.actorModel.level;
		this.useTxt.textColor = s > a ? 16711680 : 3066402, this.currentState = i.isMaxLevel() ? "max" : "normal", 
		this.attrLabel.SetCurAttr(AttributeData.getAttStr(r.attrs, 1)+"\n<font color = '0xBF7D00'>"+AttributeData.getAttStrForZhuzai(r.slotAttrs,1))+"</font>", 
		o && (this.attrLabel.SetNextAttr(AttributeData.getAttStr(o.attrs, 1)+"\n<font color = '0xBF7D00'>"+AttributeData.getAttStrForZhuzai(o.slotAttrs,1)))+"</font>";
		this.attrLabel.ShowSolaAttr(r.string , r.attrs.length);
		var l = r.growUpItem.id,
			h = UserBag.ins().getBagGoodsCountById(0, l);
		this.useTxt0.text = h + " / " + r.growUpItem.count;
		this.useTxt0.textColor = h < r.growUpItem.count ? 16711680 : 3066402;
		if(GlobalConfig.itemConfig[l])
			this.countTxt0.text = GlobalConfig.jifengTiaoyueLg.st100218 + GlobalConfig.itemConfig[l].name + "：";
		this.useTxt1.text = r.growUpProbability / 100 + "%"; 
		this.star.starNum = r.star;
		this.upgradeBtn0.label = r.growUpItem.count ? n ? GlobalConfig.jifengTiaoyueLg.st100211 : GlobalConfig.jifengTiaoyueLg.st100212 : GlobalConfig.jifengTiaoyueLg.st100213, this.powerLabel.text = UserBag.getAttrPower(r.attrs)
		if(r.star == 5)
			this.upgradeBtn0.label = GlobalConfig.jifengTiaoyueLg.st100214;

		if(r.growUpProbability == 10000)
		{
			this.upFailLable.visible = false;
		}else
		{
			this.upFailLable.visible = true;
			var tempConfig = this.EquipPointGrowUpConfig[e][r.brokenDownlv];
			if(tempConfig)
			{	
				this.upFailLable.text = LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st100215,[r.growlevel - tempConfig.growlevel]);
			}
		}

		var bfId = r.sbprotect[0].id;
		var bfCount = UserBag.ins().getBagGoodsCountById(0, bfId);
		this.guardName.text = GlobalConfig.itemConfig[bfId].name + "："; 
		this.guardUse.text = bfCount + " / " + r.sbprotect[0].count;
		if(bfCount < r.sbprotect[0].count)
		{
			this.guardUse.textColor = 16711680;
			this.cbAutoBuy.selected = false;
		}
		else
		{
			this.guardUse.textColor = 3066402;
		}
		this.cbAutoBuy.labelDisplay.text = LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st100216,[this.guardName.text]);
	}

	private cbAutoChange(evt) {
		if(this.cbAutoBuy.selected)
		{
			var index = this.m_ItemTab.GetSelectIndex() + 1;
			var t = this.m_RoleSelectPanel.getCurRole();
			var i = SubRoles.ins().GetZhuZaiData(t)[this.m_ItemTab.GetSelectIndex()];
			var r = this.EquipPointGrowUpConfig[index][i.lv];
			var bfId = r.sbprotect[0].id;
			var costCount = r.sbprotect[0].count
			var bfCount = UserBag.ins().getBagGoodsCountById(0, bfId);
			if(bfCount < costCount)
			{
				this.cbAutoBuy.selected = false;
				UserWarn.ins().setBuyGoodsWarn(bfId,costCount);
			}
		}
	}

	setEquipPoint() {
		this.m_ItemTab.setEquipPoint(SubRoles.ins().GetZhuZaiData(this.m_RoleSelectPanel.getCurRole()), "canLevelup")

		for (var i = 0; i < GameGlobal.rolesModel.length; i++)
			this.m_RoleSelectPanel.showRedPoint(i, GameGlobal.zhuZaiModel.canLevelup(i))
	}

	onClick(e) {
		if(this.EquipPointGrowUpConfig == null)
			this.EquipPointGrowUpConfig = GlobalConfig.ins("EquipPointGrowUpConfig");
		var i = SubRoles.ins().GetZhuZaiData(this.m_RoleSelectPanel.getCurRole())[this.m_ItemTab.GetSelectIndex()].lv,
			n = this.EquipPointGrowUpConfig[this.m_ItemTab.GetSelectIndex() + 1][i];
		if (!ErrorLog.Assert(n, "ZhuZaiEquipGrowPanel   config  null") && !ErrorLog.Assert(n.growUpItem, "ZhuZaiEquipGrowPanel   config.growUpItem  null")) {
			var r = n.growUpItem.id;
			switch (e.currentTarget) {
				case this.link:
					UserWarn.ins().setBuyGoodsWarn(r, n.growUpItem.count)
					break;
				case this.link1:
					UserWarn.ins().setBuyGoodsWarn(n.sbprotect[0].id, n.sbprotect[0].count)
					break;
				case this.upgradeBtn0:
					var o = n.needLevel / 1e3 >> 0,
						s = n.needLevel % 1e3;
					if (o && GameGlobal.zsModel.lv < o || GameGlobal.actorModel.level < s) {
                        UserTips.ins().showTips(GlobalConfig.jifengTiaoyueLg.st100219)
						return
					}
					if (UserBag.ins().getBagGoodsCountById(0, r) < n.growUpItem.count) {
                        UserTips.ins().showTips(GlobalConfig.jifengTiaoyueLg.st100217)
						return
					}
					ZhuzaiEquip.ins().sendGrow(this.m_RoleSelectPanel.getCurRole(), this.m_ItemTab.GetSelectIndex() + 1,this.cbAutoBuy.selected)
			}
		}
	}

	windowTitleIconName: string = ""

	UpdateContent(): void {
		this.setEquipPoint(), this.setData()
	}

	m_RoleSelectPanel: RoleSelectPanel
}
window["ZhuZaiEquipGrowPanel"]=ZhuZaiEquipGrowPanel