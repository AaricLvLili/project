class ForgeDashiWin extends BaseEuiPanel {
	public constructor() {
		super()
		this.skinName = "ForgeDashiWinSkin";
	}
	public m_Bg: eui.Image;
	public m_CloseBtn1: eui.Button;
	public m_CloseBtn2: eui.Button;
	public m_Title1: eui.Label;
	public m_FirGroup: eui.Group;
	public m_LeftAttrGroup: eui.Group;
	public m_CfgLab1: eui.Label;
	public m_CfgLab2: eui.Label;
	public m_CfgLab3: eui.Label;
	public m_CfgLab4: eui.Label;
	public m_NowTitleLab: eui.Label;
	public m_SecGroup: eui.Group;
	public m_SecLeftAttrGroup: eui.Group;
	public m_SecCfgLab1: eui.Label;
	public m_SecCfgLab2: eui.Label;
	public m_SecCfgLab3: eui.Label;
	public m_SecCfgLab4: eui.Label;
	public m_NextTitleLab: eui.Label;
	public m_Rect: eui.Rect;
	public m_CfgGroup: eui.Group;
	public m_SecCfgGroup: eui.Group;
	public m_CfgAddGroup: eui.Group;
	public m_TipsLab: eui.Group;
	public m_SecCfgAddGroup: eui.Group;


	public m_FirTips: eui.Label;


	private type: DaShiType;
	private roleId: number;
	public m_Lan1: eui.Label;
	public m_Lan2: eui.Label;

	public createChildren() {
		super.createChildren();
		this.m_Title1.text = GlobalConfig.jifengTiaoyueLg.st101186;
		this.m_FirTips.text = GlobalConfig.jifengTiaoyueLg.st101187;
		this.m_Lan1.text = GlobalConfig.jifengTiaoyueLg.st101188;
		this.m_Lan2.text = GlobalConfig.jifengTiaoyueLg.st101188;
	}
	initUI() {
		super.initUI();
	}
	open(...param: any[]) {
		this.addViewEvent();
		this.type = param[0];
		this.roleId = param[1];
		this.setData();
	}
	close() {
		this.release();
	}
	public release() {
		this.removeViewEvent();
	}
	private addViewEvent() {
		this.AddClick(this.m_CloseBtn1, this.onClickClose);
		this.AddClick(this.m_CloseBtn2, this.onClickClose);
	}
	private removeViewEvent() {

	}
	private setData() {
		let type = this.type;
		let roleId = this.roleId;
		let nowLv = UserForge.ins().getMaxLv(type, roleId);
		let maxLv = UserForge.ins().getDashiMinMaxLv(type, true);
		let minLv = UserForge.ins().getDashiMinMaxLv(type, false);
		let nowCongfig = UserForge.ins().getDashiConfig(type, nowLv);
		let nextConfig = UserForge.ins().getNextDashiConfig(type, nowCongfig.id);
		this.m_TipsLab.visible = true;
		this.m_CfgGroup.visible = true;
		this.m_CfgAddGroup.visible = true;
		this.m_SecGroup.visible = true;
		this.m_FirTips.visible = true;
		if (nowLv < minLv) {
			this.m_SecGroup.visible = false;
			this.m_Bg.height = 255;
			this.m_NowTitleLab.text = LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st101189, [nowLv, nowCongfig.rank]);
			AttributeData.setAttrGroup(nowCongfig.attr, this.m_LeftAttrGroup, 16, 0x3b3b3b, false);
			for (var i = 0; i < this.m_CfgGroup.numChildren; i++) {
				let str = nowCongfig.tisheng[i];
				let child = this.m_CfgGroup.getChildAt(i);
				let child2 = this.m_CfgAddGroup.getChildAt(i);
				if (str && child && child instanceof eui.Label) {
					child.text = str;
					if (child2 && child2 instanceof eui.Image) {
						child2.visible = true;
					}
				} else if (child && child instanceof eui.Label) {
					child.text = "";
					if (child2 && child2 instanceof eui.Image) {
						child2.visible = false;
					}
				}
			}
		} else if (nowLv >= minLv && nowLv < maxLv) {
			this.m_FirTips.visible = false;
			this.m_TipsLab.visible = false;
			this.m_CfgGroup.visible = false;
			this.m_CfgAddGroup.visible = false;
			this.m_Bg.height = 410;
			this.m_NowTitleLab.text = LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st101190, [nowLv, nowCongfig.rank]);
			AttributeData.setAttrGroup(nowCongfig.attr, this.m_LeftAttrGroup, 16, 0x3b3b3b, false);
			this.m_NextTitleLab.text = LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st101189, [nowLv, nextConfig.rank]);
			AttributeData.setAttrGroup(nextConfig.attr, this.m_SecLeftAttrGroup, 16, 0x3b3b3b, false);
			for (var i = 0; i < this.m_SecCfgGroup.numChildren; i++) {
				let str = nextConfig.tisheng[i];
				let child = this.m_SecCfgGroup.getChildAt(i);
				let child2 = this.m_SecCfgAddGroup.getChildAt(i);
				if (str && child && child instanceof eui.Label) {
					child.text = str;
					if (child2 && child2 instanceof eui.Image) {
						child2.visible = true;
					}
				} else if (child && child instanceof eui.Label) {
					child.text = "";
					if (child2 && child2 instanceof eui.Image) {
						child2.visible = false;
					}
				}
			}
		} else if (nowLv >= maxLv) {
			this.m_Bg.height = 255;
			this.m_CfgGroup.visible = false;
			this.m_CfgAddGroup.visible = false;
			this.m_FirTips.visible = false;
			this.m_SecGroup.visible = false;
			this.m_NowTitleLab.text = LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st101190, [nowLv, nowCongfig.rank]);
			AttributeData.setAttrGroup(nowCongfig.attr, this.m_LeftAttrGroup, 16, 0x3b3b3b, false);
		}

		switch (type) {
			case DaShiType.forge:
				this.m_Title1.text = GlobalConfig.jifengTiaoyueLg.st101191;
				break;
			case DaShiType.gem:
				this.m_Title1.text = GlobalConfig.jifengTiaoyueLg.st101192;
				break;
			case DaShiType.zhulin:
				this.m_Title1.text = GlobalConfig.jifengTiaoyueLg.st101193;
				break;
		}
	}

	private onClickClose() {
		ViewManager.ins().close(this);
	}
}
ViewManager.ins().reg(ForgeDashiWin, LayerManager.UI_Popup);
window["ForgeDashiWin"] = ForgeDashiWin