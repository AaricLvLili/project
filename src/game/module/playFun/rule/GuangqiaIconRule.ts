class GuangqiaIconRule extends RuleIconBase {

	private chaptersRewardConfig: any;
	private mcGroup: eui.Group
	public mc1: MovieClip
	public mc2: MovieClip
	public mc3: MovieClip
	public star2: eui.Group
	public star3: eui.Group

	public starImg1: eui.Image;
	public starImg2: eui.Image;
	public starImg3: eui.Image;
	public starImg4: eui.Image;
	public starImg5: eui.Image;

	public m_Group1: eui.Group = new eui.Group();
	public m_Group2: eui.Group = new eui.Group();
	public m_Group3: eui.Group = new eui.Group();
	public constructor(t: eui.Component) {
		super(t);
		this.updateMessage = [
			UserFb.ins().postWaveChange,
			UserFb.ins().postGuanKaIdChange,
			MessageDef.RAID_KILL_MONSTER_COUNT
		];
		this.layerCount = t.parent.getChildIndex(t)
		this.mcGroup = t.getChildByName("group") as eui.Group
		this.star2 = t.getChildByName("starGroup2") as eui.Group
		this.star3 = t.getChildByName("starGroup3") as eui.Group

		this.starImg1 = this.star2.getChildByName("star1") as eui.Image;
		this.starImg2 = this.star2.getChildByName("star2") as eui.Image;
		this.starImg3 = this.star3.getChildByName("star3") as eui.Image;
		this.starImg4 = this.star3.getChildByName("star4") as eui.Image;
		this.starImg5 = this.star3.getChildByName("star5") as eui.Image;

		this.mc1 = new MovieClip
		this.mc2 = new MovieClip
		this.mc3 = new MovieClip

		this.mc1.scaleX = this.mc1.scaleY = .8
		this.mc2.scaleX = this.mc2.scaleY = .8
		this.mc3.scaleX = this.mc3.scaleY = .8

		this.mcGroup.addChild(this.m_Group1)
		this.mcGroup.addChild(this.m_Group2)
		this.mcGroup.addChild(this.m_Group3)
		this.mc1.loadUrl(ResDataPath.GetUIEffePath("eff_can_challenge"), true, -1)
		this.mc2.loadUrl(ResDataPath.GetUIEffePath("eff_can_challenge"), true, -1)
		this.mc3.loadUrl(ResDataPath.GetUIEffePath("eff_can_challenge"), true, -1)
		this.m_Group1.addChild(this.mc1);
		this.m_Group2.addChild(this.mc2);
		this.m_Group3.addChild(this.mc3);
	}
	public updateMcPos(isTwoStar: boolean): void {
		if (isTwoStar) {
			if (this.star2) {
				this.m_Group1.x = 50
				this.m_Group2.x = 101
				this.m_Group1.y = 25
				this.m_Group2.y = 25
				this.star2.visible = true
				this.star3.visible = false
			}
		} else {
			if (this.star2) {
				this.m_Group1.x = 36
				this.m_Group2.x = 75
				this.m_Group3.x = 113
				this.m_Group1.y = 48
				this.m_Group2.y = 25
				this.m_Group3.y = 49
				this.star2.visible = false
				this.star3.visible = true
			}
		}
	}

	public setStar(num: number) {
		let str1 = "comp_450_01_001_png";
		let str2 = "comp_450_01_02_png";
		switch (num) {
			case 1:
				this.starImg1.source = str2
				this.starImg3.source = str2
				this.starImg2.source = str1
				this.starImg4.source = str1
				this.starImg5.source = str1
				break;
			case 2:
				this.starImg1.source = str2
				this.starImg3.source = str2
				this.starImg2.source = str2
				this.starImg4.source = str2
				this.starImg5.source = str1
				break;
			case 3:
				this.starImg1.source = str2
				this.starImg3.source = str2
				this.starImg2.source = str2
				this.starImg4.source = str2
				this.starImg5.source = str2
				break;
			default:
				this.starImg1.source = str1
				this.starImg3.source = str1
				this.starImg2.source = str1
				this.starImg4.source = str1
				this.starImg5.source = str1
				break;
		}
	}
	update() {
		super.update();
		this._UpdataGuanqiaKill();
	}
	private starType: number = -1;
	private starNum: number = -1;
	public _UpdataGuanqiaKill() {
		let type = UserFb.ins().killMonstType;
		let statNum = 0;
		if (this.starType != type) {
			this.starType = type;
			switch (type) {
				case 2:
					this.updateMcPos(true);
					break;
				default:
					this.updateMcPos(false);
					break;
			}
		}
		statNum = UserFb.ins().startNum(type);
		if (this.starNum != statNum) {
			this.starNum = statNum;
			switch (statNum) {
				case 1:
					this.m_Group1.visible = true
					this.m_Group2.visible = false
					this.m_Group3.visible = false
					break;
				case 2:
					this.m_Group1.visible = true
					this.m_Group2.visible = true
					this.m_Group3.visible = false
					break;
				case 3:
					this.m_Group1.visible = true
					this.m_Group2.visible = true
					this.m_Group3.visible = true
					break;
				default:
					this.m_Group1.visible = this.m_Group2.visible = this.m_Group3.visible = false
					break;
			}
		}
	}


	checkShowIcon() {
		return true;
	};
	checkShowRedPoint() {
		return false;
	};
	getEffName(redPointNum) {
		// var eff;
		// var b = UserFb.ins().isShowBossPK();
		// //能挑战boss && boss没打过
		// if (b && !UserFb.ins().bossIsChallenged) {
		// 	eff = "eff_main_icon01";
		// 	this.effX = 36;
		// 	this.effY = 38;
		// }
		// return eff;
	};
	tapExecute() {
		GuideUtils.ins().next(this.tar);
		if (GuanQiaModel.getInstance.checkIsCanGoNextLayer()) {
			ViewManager.ins().open(GuanQiaMapWin);
		} else {
			ViewManager.ins().open(GuanQiaWin);
		}
	}
}
window["GuangqiaIconRule"] = GuangqiaIconRule