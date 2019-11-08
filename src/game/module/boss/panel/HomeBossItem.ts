class HomeBossItem extends eui.ItemRenderer {
	private m_Tab: eui.Image;
	private m_BossHead: eui.Image;
	private m_BossNameLvLab: eui.Label;
	private m_Bar: eui.ProgressBar;
	private m_ItemGroup: eui.Group;
	private m_BossHaver: eui.Label;
	private m_DeadImg: eui.Label;
	private m_BattleBtn: eui.Button;
	private m_NoBattleLab: eui.Label;
	private m_ItemList: eui.List;
	private state_label: eui.Label;
	public m_ElementImg: eui.Image;
	public m_Lan1: eui.Label;

	public m_Lan2: eui.Label;

	private listData: eui.ArrayCollection;

	public constructor() {
		super();
	}
	public childrenCreated() {
		super.childrenCreated();
		this.m_ItemList.itemRenderer = ItemBase;
		this.listData = new eui.ArrayCollection();
		this.m_ItemList.dataProvider = this.listData;
		this.m_Lan1.text = GlobalConfig.jifengTiaoyueLg.st100521;
		this.m_DeadImg.text = GlobalConfig.jifengTiaoyueLg.st100522;
		this.m_Lan2.text = GlobalConfig.jifengTiaoyueLg.st100523;
		this.m_BattleBtn.label = GlobalConfig.jifengTiaoyueLg.st100046;
	}

	public dataChanged() {
		super.dataChanged();
		this.m_DeadImg.visible = false;
		this.m_BattleBtn.visible = false;
		this.m_NoBattleLab.visible = false;
		let data: Sproto.public_boss_info = this.data;
		let homeModel: HomeBossModel = HomeBossModel.getInstance;
		let bossConfigData: any = homeModel.vipBossConfigData.get(data.id);
		if (bossConfigData) {
			this.listData.removeAll();
			this.listData.replaceAll(bossConfigData.desc);
			this.listData.refresh();
			let monstersConfig: any = GlobalConfig.ins("MonstersConfig");
			let monstersConfigData: any = monstersConfig[bossConfigData.bossId];
			let text = bossConfigData.zsLevel ? bossConfigData.zsLevel + GlobalConfig.jifengTiaoyueLg.st100067 : bossConfigData.level + GlobalConfig.jifengTiaoyueLg.st100093;
			this.m_BossNameLvLab.textFlow = <Array<egret.ITextElement>>[
				{ text: text, style: { "stroke": 1, "strokeColor": 0xffffff } },
				{ text: monstersConfigData.name + "", style: { "textColor": 0xE1BA68, "stroke": 1, "strokeColor": 0x3b3b3b } }
			]
			this.m_ElementImg.source = ResDataPath.GetElementImgName(monstersConfigData.elementType);
			this.m_BossHead.source = ResDataPath.getBossHeadImage(monstersConfigData.head);//monstersConfigData.head + "_png";
		}
		this.m_Bar.value = data.hp;
		if (data.ownerNmae) {
			this.m_BossHaver.text = data.ownerNmae;
		} else {
			this.m_BossHaver.text = GlobalConfig.jifengTiaoyueLg.st100280;
		}
		this.m_Tab.source = "comp_22_53_2_png";
		this.state_label.text = GlobalConfig.jifengTiaoyueLg.st100518;
		let playerlv = GameLogic.ins().actorModel.level;
		let playerzs = UserZs.ins() ? UserZs.ins().lv : 0;
		let bosslv = bossConfigData.level
		let bosszs = bossConfigData.zsLevel;
		let playerlvzs = playerzs ? playerzs * 10 + 80 : playerlv;
		let bosslvzs = bossConfigData.zsLevel ? bossConfigData.zsLevel * 10 + 80 : bossConfigData.level;
		if (data.hp <= 0) {
			// this.m_DeadImg.visible = true;
			this.m_Tab.source = "comp_22_53_1_png";
			this.state_label.text = GlobalConfig.jifengTiaoyueLg.st100519;
		}
		if (bossConfigData) {
			if (bosszs) {
				if (playerzs >= bosszs) {
					if (playerlvzs >= bosslvzs + 50) {
						this.m_NoBattleLab.visible = true;
						this.m_NoBattleLab.text = GlobalConfig.jifengTiaoyueLg.st100520;
					} else {
						if (data.hp <= 0) {
							this.m_DeadImg.visible = true;
						} else {
							this.m_BattleBtn.visible = true;
						}
					}
				} else if (playerzs < bosszs) {
					this.m_NoBattleLab.visible = true;
					this.m_NoBattleLab.text = bosszs + GlobalConfig.jifengTiaoyueLg.st100309
				}
			} else {
				if (playerlvzs >= bosslv + 50) {
					this.m_NoBattleLab.visible = true;
					this.m_NoBattleLab.text = GlobalConfig.jifengTiaoyueLg.st100520
				} else if (playerlvzs < bosslv) {
					this.m_NoBattleLab.visible = true;
					this.m_NoBattleLab.text = bosslv + GlobalConfig.jifengTiaoyueLg.st100310
				} else {
					if (data.hp <= 0) {
						this.m_DeadImg.visible = true;
					} else {
						this.m_BattleBtn.visible = true;
					}
				}
			}
		}

		this.m_BattleBtn.name = "homeBossBtn";
	}

	private onClickBattle() {
		UserBoss.ins().sendChallenge(this.data.id);
	}




}
window["HomeBossItem"] = HomeBossItem