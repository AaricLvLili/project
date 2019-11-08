class GuanQiaMapIcon extends eui.Component {
	public constructor() {
		super();
		this.skinName = "GuanQiaMapIconSkin";
	}

	public m_Icon: eui.Image;
	public m_Name: eui.Label;
	public m_NowAttrImg: eui.Image;
	public m_CompImg: eui.Image;
	public m_RedPoint: eui.Image;

	public m_TipsGroup: eui.Group;
	public m_TipsLab: eui.Label;
	public m_ExpLab: eui.Label;
	public config: any;
	public m_ExpGroup: eui.Group;

	public roleShowPanel: RoleShowPanel;
	public m_box: eui.Image;

	public isGuide: boolean = false;
	public createChildren() {
		super.createChildren();
		this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClick, this);
		if (this.x > 280) {
			this.m_box.x = -55;
		} else {
			this.m_box.x = 100;
		}
	}

	public setData(config: any) {
		this.config = config;
		let guanQiaId: number = UserFb.ins().guanqiaID;
		let needLevel = config.needLevel;
		this.m_CompImg.visible = false;
		this.m_ExpGroup.visible = false;
		let chaptersConfig = GlobalConfig.ins("ChaptersConfig")[guanQiaId];
		if (chaptersConfig) {
			let nextChaptersRewardConfig = GlobalConfig.ins("ChaptersRewardConfig")[chaptersConfig.mapid + 1];
			if (nextChaptersRewardConfig) {
				if (nextChaptersRewardConfig.id == config.id) {
					this.m_ExpGroup.visible = true;
					this.m_ExpLab.text = LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st100753, [config.expEff]);//"经验:" + config.expEff + "/小时";
				}
			}
			let nowChaptersRewardConfig = GlobalConfig.ins("ChaptersRewardConfig")[chaptersConfig.mapid];
			if (nowChaptersRewardConfig) {
				if (nowChaptersRewardConfig.needLevel == needLevel) {
					this.m_NowAttrImg.visible = true;
					this.m_ExpGroup.visible = true;
					this.m_ExpLab.text = LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st100753, [config.expEff]);//"经验:" + config.expEff + "/小时";
					let role = SubRoles.ins().getSubRoleByIndex(0);
					this.roleShowPanel.creatAnim(role);
					this.roleShowPanel.setCharRoleMountLv(15);
					this.roleShowPanel.m_ElementImg.visible = false;
				} else {
					this.m_NowAttrImg.visible = false;
					this.roleShowPanel.release();
				}
				if (GuanQiaModel.getInstance.checkIsComp(config.id)) {
					this.m_CompImg.visible = true;
				}
				if (nowChaptersRewardConfig.needLevel < needLevel || !needLevel) {
					FilterUtil.setGayFilter(this.m_Icon);
				} else {
					this.m_Icon.filters = null;
				}
			}
			if (GuanQiaModel.getInstance.checkGetAwardRedPoint(config.id)) {
				this.m_RedPoint.visible = true;
				this.m_box.visible = true;
			} else {
				this.m_RedPoint.visible = false;
				this.m_box.visible = false;
			}
		}
		this.m_Name.text = config.name;
		this.m_Icon.source = config.icon;
		this.chickIsShowTips();
	}

	private onClick() {
		let guanQiaId: number = UserFb.ins().guanqiaID;
		let guanQiaModel = GuanQiaModel.getInstance;
		if (guanQiaModel.checkIsCanGoNextLayer()) {
			let nextGuanQiaId = guanQiaId + 1;
			let nextChaptersConfig = GlobalConfig.ins("ChaptersConfig")[nextGuanQiaId];
			if (nextChaptersConfig.mapid == this.config.id) {
				UserFb.ins().sendGoNextChapter();
				return;
			}
		}
		ViewManager.ins().open(GuanQiaTipsWin, this.config.id);
	}

	private chickIsShowTips() {
		this.m_TipsGroup.visible = false;
		let guanQiaModel = GuanQiaModel.getInstance;
		if (guanQiaModel.checkIsCanGoNextLayer()) {
			let nextGuanQiaId = UserFb.ins().guanqiaID + 1;
			let nextChaptersConfig = GlobalConfig.ins("ChaptersConfig")[nextGuanQiaId];
			if (nextChaptersConfig) {
				if (nextChaptersConfig.mapid == this.config.id && !guanQiaModel.checkIsFirstGuide()) {
					this.m_TipsGroup.visible = true;
					this.m_TipsLab.text = GlobalConfig.jifengTiaoyueLg.st101245 + this.config.name;
				}
			}
		}
	}

	public release() {
		this.roleShowPanel.release();
		this.m_Icon.filters = null;
	}
}
window["GuanQiaMapIcon"] = GuanQiaMapIcon