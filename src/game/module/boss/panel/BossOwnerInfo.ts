class BossOwnerInfo extends eui.Component {
	public constructor() {
		super()
		this.skinName = "BossOwnerSkin"
	}

	bloodBar: eui.ProgressBar
	nameLabel: eui.Label
	head: eui.Image
	model: Role
	challenge: eui.Button
	public m_ElementImg: eui.Image;

	private static m_PreClickTimer = 0

	childrenCreated() {
		this.challenge.addEventListener(egret.TouchEvent.TOUCH_TAP, BossOwnerInfo.ClickOwner, this)
		this.challenge.label=GlobalConfig.jifengTiaoyueLg.st101692;
	}

	public static ClickOwner() {
		if (BossOwnerInfo.m_PreClickTimer + 500 > egret.getTimer()) {
			console.log("操作过于频繁")
			return
		}
		BossOwnerInfo.m_PreClickTimer = egret.getTimer()
		if (GameMap.IsPublicBoss() || GameMap.IsHomeBoss() || GameMap.IsSyBoss() || GameMap.IsKfBoss() || GameMap.IsXbBoss()) {
			let targetHandle = UserBoss.ins().GetCurOwnerHandler()
			if (!targetHandle) {
				UserTips.ins().showTips(GlobalConfig.jifengTiaoyueLg.st101690)
				return
			}
			if (targetHandle == GameGlobal.actorModel.actorID) {
				UserTips.ins().showTips(GlobalConfig.jifengTiaoyueLg.st101691)
				return
			}
			UserBoss.ins().SendChallengeOwner()
		}
	}

	refushTargetInfo(e: Sproto.sc_public_boss_cur_owner_request) {
		// this.bloodBar.maximum = e.dhp;//this.model.getAtt(AttributeType.atMaxHp)
		// this.bloodBar.value = e.hp;//e.getHP()
		// this.model.team == Team.My ? this.nameLabel.text = GameGlobal.actorModel.name : this.nameLabel.text = e.name + ""
		this.nameLabel.text = e.name + ""
		this.head.source = ResDataPath.GetHeadMiniImgName(e.job, e.sex);
		this.m_ElementImg.source = ResDataPath.GetElementImgName(e.mainEle);
		this.refushTargetHp();
	}

	refushTargetHp() {
		var char: CharRole;
		var value: number = 0;
		var total: number = 0;
		var temp: Array<CharRole> = EntityManager.ins().getRolesList(true);
		var temp1;
		for (var i: number = 0; i < temp.length; i++) {
			temp1 = temp[i];
			if (temp1[0].infoModel.name == this.nameLabel.text) {
				for (var k: number = 0; k < temp1.length; k++) {
					char = temp1[k];
					value += char.infoModel.getAtt(AttributeType.atHp);
					total += char.infoModel.getAtt(AttributeType.atMaxHp);
				}
				break;
			}
		}
		this.bloodBar.maximum = total;
		this.bloodBar.value = value;
	}
}
window["BossOwnerInfo"]=BossOwnerInfo