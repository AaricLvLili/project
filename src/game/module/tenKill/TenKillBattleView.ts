class TenKillBattleView extends BaseEuiView {

	public m_LeftHeadImg: eui.Image;
	public m_LeftNameLvLab: eui.Label;
	public m_RightNameLvLab: eui.Label;
	public m_RightHeadImg: eui.Image;
	public m_BeginGroup: eui.Group;
	public m_LeftBeginBg: eui.Image;
	public m_RightBeginBg: eui.Image;

	public m_MainRightGroup: eui.Group;

	public m_MainGroup: eui.Group;
	public m_VSImg: eui.Image;
	public m_BuffImg: eui.Image;


	public bossinfo_group: eui.Group;
	public head: eui.Image;
	public lvTxt: eui.Label;
	public no_blood: eui.Label;
	public nameTxt: eui.Label;
	public hudun: eui.Group;
	public hudunbloodBar: eui.ProgressBar;
	public name_label: eui.Label;
	public head_image: eui.Image;
	private monstersConfig: any;
	private currentBoss: any;

	public m_LeftBloodBar: eui.ProgressBar;
	public m_RightBloodBar: eui.ProgressBar;
	public bloodBar: BossBloodBar;

	public constructor() {
		super();
	}
	public initUI() {
		super.initUI();
		this.skinName = "TenKillBattleSkin";
		this.touchEnabled = false;
		if (Main.isLiuhai) {
			this.bossinfo_group.y = 140;
			this.m_MainGroup.y = 147;
		}
	};

	public open(...param: any[]) {
		super.open(param);
		this.observe(MessageDef.TENKILL_BLOOD_UPDATE, this.refushTargetHp);
		this.observe(MessageDef.ON_HOOK_ROLE_UPDATE, this.updateRoleState);
		this.observe(MessageDef.TENKILL_BOSS_INIT, this.onBoss);
		this.observe(MessageDef.TENKILL_PANEL_UPDATE, this.initUIstate);
		this.m_BuffImg.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClickBuff, this);
		this.initUIstate();
		this.updateRoleState();
		this.m_LeftBloodBar.labelDisplay.visible = false;
		this.m_RightBloodBar.labelDisplay.visible = false;
	};
	public close(...param: any[]) {
		super.close(param);
		this.m_BuffImg.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onClickBuff, this);
		this.removeObserve();
		this.release();
	};

	private release() {
		this.removeTween();
	}

	private removeTween() {
		egret.Tween.removeTweens(this.m_LeftBeginBg);
		egret.Tween.removeTweens(this.m_RightBeginBg);
	}

	private initTenkillRole() {
		let roleList: any[] = EntityManager.ins().getRolesList(true, true);
		for (var i = 0; i < roleList.length; i++) {
			let teamRole: any[] = roleList[i];
			for (var f = 0; f < teamRole.length; f++) {
				var role: CharRole = teamRole[f];
				if (role) {
					role.playAction(EntityAction.STAND);
				}
			}
		}
	}

	private initUIstate() {
		this.m_MainGroup.visible = false;
		this.m_BeginGroup.visible = true;
		this.m_BuffImg.visible = false;
		this.m_VSImg.visible = false;
		this.m_LeftBeginBg.x = -720;
		this.m_RightBeginBg.x = 720;
		this.bossinfo_group.visible = false;
		let tenKillModel = TenKillModel.getInstance;
		if (tenKillModel.raidType == RaidType.Type2) {
			egret.Tween.get(this.m_LeftBeginBg).wait(300).to({ x: 0 }, 1500).call(() => {
				this.m_VSImg.visible = true
			}).wait(500).call(() => {
				this.m_BeginGroup.visible = false;
				TenKillSproto.ins().sendContinueFB();
				this.m_MainGroup.visible = true;
				if (TenKillModel.getInstance.isBuyBuff()) {
					this.m_BuffImg.visible = true;
				}
			});
			egret.Tween.get(this.m_RightBeginBg).wait(300).to({ x: 0 }, 1500);
		} else if (tenKillModel.raidType == RaidType.Type3) {
			this.bossinfo_group.visible = true;
			TenKillSproto.ins().sendContinueFB();
			if (TenKillModel.getInstance.isBuyBuff()) {
				this.m_BuffImg.visible = true;
			}
		}
		this.updateRoleState();

	}

	private updateRoleState() {
		this.name_label.text = GameLogic.ins().actorModel.name;
		let role = SubRoles.ins().getSubRoleByIndex(0)
		if (role) {
			this.head_image.source = ResDataPath.GetHeadMiniImgName2(role.job, role.sex)
		}
		let myTeam: Array<CharRole> = EntityManager.ins().getRolesList(true, false);
		let otehrTeam: Array<CharRole> = EntityManager.ins().getRolesList(false, true);
		if (myTeam.length > 0) {
			let role = SubRoles.ins().getSubRoleByIndex(0);
			this.m_LeftNameLvLab.text = role.name;
			this.m_LeftHeadImg.source = ResDataPath.GetHeadMiniImgName2(role.job, role.sex);
		}
		if (otehrTeam.length > 0) {
			let model = otehrTeam[0][0].infoModel;
			this.m_RightNameLvLab.text = model.name;
			this.m_RightHeadImg.source = ResDataPath.GetHeadMiniImgName2(model.job, model.sex);
		}
		if (TenKillModel.getInstance.raidType == RaidType.Type3) {
			this.m_MainRightGroup.visible = false;
		} else {
			this.m_MainRightGroup.visible = true;
		}
		this.refushTargetHp();
		this.initTenkillRole();
	}

	private refushTargetHp() {
		let myTeam: Array<CharRole> = EntityManager.ins().getRolesList(true, false);
		let otehrTeam: Array<CharRole> = EntityManager.ins().getRolesList(false, true);
		let myTeamHpPer = this.getHp(myTeam, TenKillModel.getInstance.myTeamMaxBlood);
		let otehrTeamHpPer = this.getHp(otehrTeam, TenKillModel.getInstance.otherTeamMaxBlood);
		this.m_LeftBloodBar.value = 100 * myTeamHpPer;
		this.m_RightBloodBar.value = 100 * otehrTeamHpPer;
		this.refushTargetRoleHp();
		let monsters = EntityManager.ins().getMonstersList();
		if (monsters.length > 0) {
			for (var i = 0; i < monsters.length; i++) {
				let charMonster: CharMonster = monsters[i];
				if (charMonster && charMonster.infoModel.monstersType == 1) {
					this.upDataBossHP(charMonster.infoModel);
				}
			}
		}
	}
	private getHp(roleArr: Array<CharRole>, maxHp: number) {
		var char: CharRole;
		var value: number = 0;
		var total: number = 0;
		var temp1;
		let percentage = 0;
		for (var i: number = 0; i < roleArr.length; i++) {
			temp1 = roleArr[i];
			for (var k: number = 0; k < temp1.length; k++) {
				char = temp1[k];
				let roleHp = char.infoModel.getAtt(AttributeType.atHp);
				if (roleHp > 0) {
					value += roleHp;
				}
				// total += char.infoModel.getAtt(AttributeType.atMaxHp);
			}
		}
		if (value > 0) {
			return value / maxHp;
		}
		return 0;

	}
	//boss出现
	private onBoss(e) {
		this.showBossinfo(e);
	}
	//更新人物血量
	private refushTargetRoleHp() {
		var char: CharRole;
		var value: number = 0;
		var total: number = 0;
		var temp: Array<CharRole> = EntityManager.ins().getRolesList(true);
		var temp1;
		for (var i: number = 0; i < temp.length; i++) {
			temp1 = temp[i];
			for (var k: number = 0; k < temp1.length; k++) {
				char = temp1[k];
				value += char.infoModel.getAtt(AttributeType.atHp);
				total += char.infoModel.getAtt(AttributeType.atMaxHp);
			}
		}
		this.hudunbloodBar.maximum = total;
		this.hudunbloodBar.value = value;
	}

	//是否显示BOSS信息
	private showBossinfo(e: EntityModel): void {
		this.bossinfo_group.visible = true;
		this.hudun.visible = true;
		if (this.monstersConfig == null)
			this.monstersConfig = GlobalConfig.monstersConfig;
		this.currentBoss = this.monstersConfig[e.configID];
		this.nameTxt.text = this.currentBoss.name;
		this.head.source = ResDataPath.getBossHeadImage(this.currentBoss.head);//this.currentBoss.head + "_png";
		this.lvTxt.text = this.currentBoss.level + "";
		this.bloodBar.changeMaxBarNum = this.currentBoss.hpCount;
		this.bloodBar.changeMaximum = e.getAtt(AttributeType.atMaxHp);
		this.bloodBar.changeValue = e.getAtt(AttributeType.atHp);
		this.no_blood.visible = false;
	}

	private upDataBossHP(e: EntityModel) {
		let value = e.getAtt(AttributeType.atHp);
		let total = e.getAtt(AttributeType.atMaxHp);
		this.bloodBar.changeMaximum = total;
		this.bloodBar.changeValue = value;
	}

	private onClickBuff() {
		let config = GlobalConfig.ins("PropertyLibraryConfig");
		let tips = "<font color='#00FF3F'>" + config[1].tips2 + "</font>";
		WarnWin.show(config[1].tips2, null, this, null, null, "sure");
	}

}
ViewManager.ins().reg(TenKillBattleView, LayerManager.UI_HUD);
window["TenKillBattleView"] = TenKillBattleView