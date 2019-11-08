class WildBossWin extends BaseEuiPanel {
	public constructor() {
		super();
		this.skinName = "ZaoYuBossSkin";
	}

	public dataGroup: eui.DataGroup;
	public challengeBtn: eui.Button;
	public bossName: eui.Label;
	public m_AnimBg: eui.Image;
	public m_AnimGroup: eui.Group;
	public bossEff: MovieClip;
	private languageTxt: eui.Label;
	private languageTxt0: eui.Label;
	private languageTxt1: eui.Label;
	private languageTxt2: eui.Label;

	initUI() {
		super.initUI()
		this.dataGroup.itemRenderer = ItemBase;
		this.challengeBtn.label = GlobalConfig.jifengTiaoyueLg.st100736;
		this.languageTxt.text = GlobalConfig.jifengTiaoyueLg.st100736;
		this.languageTxt0.text = GlobalConfig.jifengTiaoyueLg.st100431;
		this.languageTxt1.text = GlobalConfig.jifengTiaoyueLg.st100738;
		this.languageTxt2.text = GlobalConfig.jifengTiaoyueLg.st100739;
		this.m_bg.init(`WildBossWin`, GlobalConfig.jifengTiaoyueLg.st100735);
	};
	private initMc() {
		if (!this.bossEff) {
			this.bossEff = new MovieClip;
			this.bossEff.scaleX = -1;
			this.bossEff.x = this.m_AnimGroup.width / 2;
			this.bossEff.y = this.m_AnimGroup.height / 2;
			this.m_AnimGroup.addChild(this.bossEff);
		}
	}
	open() {
		this.challengeBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);

		if (EntityManager.ins().willBoss && EntityManager.ins().willBoss.infoModel) {
			var bossID = EntityManager.ins().willBoss.infoModel.configID;
			var boss = GlobalConfig.monstersConfig[bossID];
			this.initMc();
			this.bossEff.loadUrl(ResDataPath.GetMonsterBodyPath(boss.avatar + "_3s"), true, -1);
			this.bossName.text = boss.name + " Lv." + boss.level;

			var attrs: Array<any> = [];
			var obj: any = {};
			obj.type = 2;
			obj.value = boss.hp;
			attrs.push(obj);

			var obj1: any = {};
			obj1.type = 4;
			obj1.value = boss.atk;
			attrs.push(obj1);
			// this.powerLabel.text = Math.floor(UserBag.getAttrPower(attrs));
			var info = Encounter.ins().getZyBossDate();
			if (info) {
				// this.desTips.text = info.name;
				this.dataGroup.dataProvider = new eui.ArrayCollection(info.rewards);
			}
		}
		else {
			Main.errorBack("遭遇BOSS数据错误! mapID = " + GameMap.mapID + "遭遇BOSS 唯一ID = " + Encounter.ins().zyKeyId);
		}

	};
	close() {
		this.challengeBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
		DisplayUtils.dispose(this.bossEff);
		this.bossEff = null;
	};
	public static openCheck() {
		if (EntityManager.ins().getTeamCount(Team.WillBoss)) {
			UserTips.ins().showTips(GlobalConfig.jifengTiaoyueLg.st100734);
			return false;
		}
		return true;
	};
	onTap(e) {
		switch (e.currentTarget) {
			case this.challengeBtn:
				if (EntityManager.ins().willBoss)
					EntityManager.ins().willBoss.dispatchEventWith(egret.TouchEvent.TOUCH_BEGIN);
				ViewManager.ins().close(WildBossWin);
				break;
		}
	};
}

ViewManager.ins().reg(WildBossWin, LayerManager.UI_Popup);

window["WildBossWin"] = WildBossWin