class ZhuanZhiJmPanel extends BaseView implements eui.UIComponent, ICommonWindowTitle, ICommonWindowRoleSelect {
	public constructor(rsView) {
		super();
		this.skinName = "ZhuanZhiJmPanelSkin";
		this.m_RoleSelectPanel = rsView;
	}
	m_RoleSelectPanel: RoleSelectPanel;
	private powerLabel: PowerLabel;
	private checkAttr: eui.Label;
	private stages: eui.Label;
	public consumeLabel: ConsumeLabel;
	public consumeLabel1: ConsumeLabel;
	private maxTips: eui.Label;
	private xiuwei: eui.Label;
	private link: eui.Image;

	private upLevelBtn: eui.Button;
	private attrLabel: AttrLabel;
	private pointList: eui.Image[] = [];
	private lineList: eui.Image[] = [];
	private zhenqiMc: MovieClip;
	private rect: egret.Rectangle;

	private cbLine8: eui.CheckBox;
	private cbLine5: eui.CheckBox;
	private cbLine2: eui.CheckBox;
	private icon8: JmIcon;
	private icon5: JmIcon;
	private icon2: JmIcon;
	private groupEffect: eui.Group
	private groupStars: eui.Group
	private isClick: boolean = false;

	protected childrenCreated(): void {
		super.childrenCreated();
		for (var t = 0; 8 > t; t++) {
			this.pointList.push(this["point" + t])
			if (this["line" + t])
				this.lineList.push(this["line" + t])
		}
		this.rect = new egret.Rectangle(-45, -45, 100, 100);
		this.checkAttr.text = GlobalConfig.jifengTiaoyueLg.st100095;
		this.maxTips.text = GlobalConfig.jifengTiaoyueLg.st100654;
	}

	public open(): void {
		this.initMc();
		this.addTouchEvent(this, this.onTap, this.upLevelBtn);
		this.addTouchEvent(this, this.seeAttr, this.checkAttr);
		this.addTouchEvent(this, this.getXiuwei, this.link);
		this.addTouchEvent(this, this.onIconTap, this.icon8);
		this.addTouchEvent(this, this.onIconTap, this.icon5);
		this.addTouchEvent(this, this.onIconTap, this.icon2);
		this.observe(ZhuanZhiModel.ins().postZhuanZhiJmUpdate, this.UpdateContent)
		this.observe(UserZs.ins().postZsData, this.UpdateContent);
		UIHelper.SetLinkStyleLabel(this.checkAttr)
	}

	public close(): void {
		DisplayUtils.dispose(this.zhenqiMc);
		this.zhenqiMc.mask = null;
		this.zhenqiMc = null;
		this.rect = null;

		this.removeEvents();
		this.removeObserve();
		for (let i = 0, len = this.groupStars.numChildren; i < len; i++) {
			let item = this.groupStars.getChildAt(i) as eui.Image
			item && egret.Tween.removeTweens(item)
		}
	}

	private initMc() {
		if (!this.zhenqiMc) {
			this.zhenqiMc = new MovieClip();
			this.zhenqiMc.x = this.groupEffect.width / 2;
			this.zhenqiMc.y = this.groupEffect.height / 2;
			this.groupEffect.addChild(this.zhenqiMc);
		}
		this.zhenqiMc.loadUrl(ResDataPath.GetUIEffePath("eff_changejob"), true, -1);
	}

	private onTap(e) {
		this.isClick = true;
		ZhuanZhiModel.ins().sendZhuanZhiJmUpLevel(this.curRole);
		if (this.upLevelBtn.label == GlobalConfig.jifengTiaoyueLg.st100242) {
			//this.isClick = true;
			ZhuanZhiModel.ins().sendZhuanZhiJmUpGrade(this.curRole);
		} else {
		}
		// ZhuanZhiModel.ins().sendZhuanZhiJmUpGrade(this.curRole);
	}

	private seeAttr(e) {
		ViewManager.ins().open(ZhuanZhiJmAttrWin, this.curRole);
	}

	private getXiuwei(e) {
		ViewManager.ins().open(GainZsWin);
	}

	private onIconTap(e: egret.TouchEvent) {
		let id = e.currentTarget.id;
		if (id > 0)
		{
          	// ViewManager.ins().open(BianShenSkillTipPanel, { skillid: id, lvl: 1 });
		}
		else
			ViewManager.ins().open(ZhuanZhiEquipWin,1);
	}

	attrJob = ["", "attr_zs", "attr_fs", "attr_ds"];
	skillJob = ["", "skillid_zs", "skillid_fs", "skillid_ds"];
	public UpdateContent() {
		let self = this;
		var role = SubRoles.ins().getSubRoleByIndex(this.curRole);
		var datas: JingMaiData = role.zhuanZhiJm;

		var attrStr: string = this.attrJob[role.job];
		var stagesConfig = GlobalConfig.meridianStageConfig[datas.stage]
		var lvConfig = GlobalConfig.meridianLevelConfig[datas.level]
		this.attrLabel.SetCurAttr(AttributeData.getAttStr(AttributeData.AttrAddition(stagesConfig[attrStr], lvConfig[attrStr]), 1));
		this.powerLabel.text = role.jMPower;

		var flag = datas.level / 8 - stagesConfig.stage
		let showCount = datas.level % 8
		if (flag == 1) {
			showCount = 8
		}

		for (let i = 0; i < 8; ++i) {
			this.pointList[i].visible = i < showCount
			if (this.lineList[i])
				this.lineList[i].visible = i < (showCount - 1);
		}


		// if (showCount <= self.groupStars.numChildren) {
		// 	if (this.isClick) {
		// 		self._playLevelUpAni(showCount)
		// 	} else {
		// 		for (let i = 0, len = self.groupStars.numChildren; i < len; i++) {
		// 			let item = self.groupStars.getChildAt(i) as eui.Image
		// 			item.visible = i < showCount
		// 		}
		// 	}
		// }



		if (stagesConfig.stage < GlobalConfig.ins("MeridianCommonConfig").stageMax) {

			var nextStagesConfig = void 0;
			var nextLvConfig = void 0;

			if (datas.level > 0 && datas.level % 8 == 0 && flag) {
				nextStagesConfig = GlobalConfig.meridianStageConfig[datas.stage + 1];
				nextLvConfig = lvConfig;
			} else {
				nextStagesConfig = stagesConfig;
				nextLvConfig = GlobalConfig.meridianLevelConfig[datas.level + 1];
			}
			this.attrLabel.SetNextAttr(AttributeData.getAttStr(AttributeData.AttrAddition(nextStagesConfig[attrStr], nextLvConfig[attrStr]), 1));

			this.upLevelBtn.visible = true;
			this.consumeLabel.visible = true;
			this.consumeLabel1.visible = true;
			this.maxTips.visible = false;

			if (datas.level > 0 && datas.level % 8 == 7) {
				this.upLevelBtn.label = GlobalConfig.jifengTiaoyueLg.st100242;//"升阶";
			} else {
				this.upLevelBtn.label = GlobalConfig.jifengTiaoyueLg.st100208;//"升级";
			}
		}
		else {
			this.upLevelBtn.visible = false;
			this.consumeLabel.visible = false;
			this.consumeLabel1.visible = false;
			this.maxTips.visible = true;
			flag = 1;
		}

		this.xiuwei.text = UserZs.ins().exp + "\n" + GlobalConfig.jifengTiaoyueLg.st100266;
		this.stages.text = datas.stage + GlobalConfig.jifengTiaoyueLg.st100103 + showCount + GlobalConfig.jifengTiaoyueLg.st100093;
		this.consumeLabel.consumeType = GlobalConfig.jifengTiaoyueLg.st100266;//"修为";
		this.consumeLabel.curValue = UserZs.ins().exp;
		this.consumeLabel.consumeValue = lvConfig.rankUpItem[0].count;

		this.consumeLabel1.consumeType = GlobalConfig.jifengTiaoyueLg.st100018;//"金币";
		this.consumeLabel1.curValue = GameLogic.ins().actorModel.gold;
		this.consumeLabel1.consumeValue = lvConfig.rankUpItem[1].count;

		let value = 1 - UserZs.ins().exp / 150000;//最大基数是150000
		this.rect.y = -45 + 90 * (value > 0 ? value : 0);
		this.zhenqiMc.mask = this.rect;
		this.updateJmIcon(datas, role.job);
		this.updataRoleRedPoint();
	}
	private _playLevelUpAni(showCount: number): void {
		let self = this
		if (showCount == 0) {
			for (let i = 0, len = self.groupStars.numChildren; i < len; i++) {
				let item = self.groupStars.getChildAt(i) as eui.Image
				item.visible = true
				item.scaleX = 3;
				item.scaleY = 3;
				egret.Tween.get(item).to({ scaleX: 1, scaleY: 1 }, 350).call(() => {
					egret.Tween.removeTweens(item)
					item.visible = false
					this.isClick = false
				})
			}
		} else {
			for (let i = 0, len = self.groupStars.numChildren; i < len; i++) {
				let item = self.groupStars.getChildAt(i) as eui.Image
				item.visible = i < showCount
			}
			let idx = showCount == 0 ? 0 : showCount - 1
			let aniItem = self.groupStars.getChildAt(idx) as eui.Image
			aniItem.scaleX = 3;
			aniItem.scaleY = 3;
			egret.Tween.get(aniItem).to({ scaleX: 1, scaleY: 1 }, 200).call(() => {
				egret.Tween.removeTweens(aniItem)
				this.isClick = false
			})
		}
	}

	//激活线条、装备固定在2,5,8位置
	private updateJmIcon(datas, job): void {
		var lev2 = datas.stage * 8 + 2;
		var lev5 = datas.stage * 8 + 5;
		var lev8 = datas.stage * 8 + 8;

		var config2 = GlobalConfig.meridianLevelConfig[lev2];
		var config5 = GlobalConfig.meridianLevelConfig[lev5];
		var config8 = GlobalConfig.meridianLevelConfig[lev8];
		var skillStr: string = this.skillJob[job];

		if (config2 && (config2[skillStr] || config2.equip_id)) {
			this.cbLine2.visible = true;
			this.icon2.visible = true;
			this.icon2.id = -1;//-1默认代表是转职装备
			if (config2[skillStr])
				this.icon2.id = (config2[skillStr].length > 1) ? config2[skillStr][1] : config2[skillStr][0];

			let info = this.getJmIconInfo(config2[skillStr], config2.equip_id, job);
			this.icon2.icon.source = info.res;
			if (datas.level >= lev2) {
				this.cbLine2.selected = true;
				this.icon2.title.text = info.title;
				this.icon2.lock.visible = false;
			}
			else {
				this.cbLine2.selected = false;
				this.icon2.title.text = lev2 + GlobalConfig.jifengTiaoyueLg.st100310;
				this.icon2.lock.visible = true;
			}
		}
		else {
			this.cbLine2.visible = false;
			this.icon2.visible = false;
		}

		if (config5 && (config5[skillStr] || config5.equip_id)) {
			this.cbLine5.visible = true;
			this.icon5.visible = true;
			this.icon5.id = -1;//-1默认代表是转职装备
			if (config5[skillStr])
				this.icon5.id = (config5[skillStr].length > 1) ? config5[skillStr][1] : config5[skillStr][0];

			let info = this.getJmIconInfo(config5[skillStr], config5.equip_id, job);
			this.icon5.icon.source = info.res;
			if (datas.level >= lev5) {
				this.cbLine5.selected = true;
				let info = this.getJmIconInfo(config5[skillStr], config5.equip_id, job);
				this.icon5.title.text = info.title;
				this.icon5.lock.visible = false;
			}
			else {
				this.cbLine5.selected = false;
				this.icon5.title.text = lev5 + GlobalConfig.jifengTiaoyueLg.st100310;
				this.icon5.lock.visible = true;
			}
		}
		else {
			this.cbLine5.visible = false;
			this.icon5.visible = false;
		}

		if (config8 && (config8[skillStr] || config8.equip_id)) {
			this.cbLine8.visible = true;
			this.icon8.visible = true;
			this.icon8.id = -1;//-1默认代表是转职装备
			if (config8[skillStr])
				this.icon8.id = (config8[skillStr].length > 1) ? config8[skillStr][1] : config8[skillStr][0];

			let info = this.getJmIconInfo(config8[skillStr], config8.equip_id, job);
			this.icon8.icon.source = info.res;
			if (datas.level >= lev8) {
				this.cbLine8.selected = true;
				this.icon8.title.text = info.title;
				this.icon8.lock.visible = false;
			}
			else {
				this.cbLine8.selected = false;
				this.icon8.title.text = lev8 + GlobalConfig.jifengTiaoyueLg.st100310;
				this.icon8.lock.visible = true;
			}
		}
		else {
			this.cbLine8.visible = false;
			this.icon8.visible = false;
		}
	}

	/**从配置表获取经脉icon资源和名称描述*/
	private getJmIconInfo(skillId: Array<number>, equipId: Array<number>, job: number) {
		var info: any = {};
		if (equipId) {
			let id = equipId[job - 1];
			let uplevelConfig = GlobalConfig.ins("TransferEquipGrowUpConfig")[id];
			let transferEquipConfig = GlobalConfig.ins("TransferEquipConfig")[id];
			let itemID: number;
			for (let key in uplevelConfig) {
				itemID = parseInt(key);
				break;
			}
			let itemConfig = GlobalConfig.itemConfig[itemID];
			info.res = `${itemConfig.icon}_png`;
			info.title = transferEquipConfig.name;
			return info;
		}

		if (skillId) {
			let id = (skillId.length > 1) ? skillId[1] : skillId[0];
			let skillsConfig = GlobalConfig.skillsConfig[id];
			info.res = `${skillsConfig.icon}_png`;
			info.title = skillsConfig.skinName;
			return info;
		}
	}

	public get curRole(): number {
		return this.m_RoleSelectPanel.getCurRole()
	}

	/**更新角色头像红点*/
	private updataRoleRedPoint(): void {
		for (let i = 0, len = SubRoles.ins().subRolesLen; i < len; ++i) {
			this.m_RoleSelectPanel.showRedPoint(i, ZhuanZhiModel.ins().zhuanZhiJmRoleRedPqoint(i));
		}
	}
}

class JmIcon extends eui.Component {
	id: number;
	icon: eui.Image;
	lock: eui.Image;
	title: eui.Label;
}
window["ZhuanZhiJmPanel"]=ZhuanZhiJmPanel
window["JmIcon"]=JmIcon