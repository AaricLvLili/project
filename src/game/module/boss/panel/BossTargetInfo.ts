class BossTargetInfo extends eui.Component {
	public constructor() {
		super()
		this.skinName = "BossTargetSkin"
	}

	model: Role
	bloodBar: eui.ProgressBar
	nameLabel: eui.Label
	head: eui.Image

	refushTargetInfo(e) {
		this.model = e.infoModel
		this.bloodBar.maximum = this.model.getAtt(AttributeType.atMaxHp)
		this.bloodBar.value = e.getHP()
		this.model.team == Team.My ? this.nameLabel.text = GameGlobal.actorModel.name : this.nameLabel.text = this.model.name + ""
		this.head.source = ResDataPath.GetHeadMiniImgName2(this.model.job, this.model.sex)
	}

	// FreshOwnerInfo() {
	// 	let data = UserBoss.ins().GetCurOwnerData()
	// 	this.head.source = ResDataPath.GetHeadMiniImgName(data.job, data.sex)
	// 	// this.nameLabel.text = data.actorid == GameGlobal.actorModel.actorID ? GameGlobal.actorModel.name : data.name
	// 	this.nameLabel.text = data.name
	// 	this.bloodBar.value = this.bloodBar.maximum = 1
	// }

	// private m_ShowType = 0

	// public ShowType(type: number) {
	// 	if (this.m_ShowType == type) {
	// 		return
	// 	}
	// 	this.m_ShowType = type
	// 	this.currentState = "type" + type
	// }
}
window["BossTargetInfo"]=BossTargetInfo