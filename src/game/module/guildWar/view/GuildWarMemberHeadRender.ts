class GuildWarMemberHeadRender extends eui.ItemRenderer {

	////////////////////////////////////////////////////////////////////////////////////////////////////
	// MemberHeadSkin.exml
	////////////////////////////////////////////////////////////////////////////////////////////////////
	private roleHead: eui.Image
	private roleName: eui.Label
	private guildName: eui.Label
	private num: eui.Label
	////////////////////////////////////////////////////////////////////////////////////////////////////

	clickEffc: MovieClip
	attEffect
	public m_EffGroup: eui.Group;

	public constructor() {
		super()
		this.skinName = "MemberHeadSkin"
		this.clickEffc = new MovieClip
		this.clickEffc.x = 30
		this.clickEffc.y = 30
	}

	dataChanged() {
		if (egret.is(this.data, "SelectInfoData")) {
			let data = this.data as SelectInfoData
			this.currentState = "panel"
			this.num.textFlow = (new egret.HtmlTextParser).parser(this.data.num + GlobalConfig.jifengTiaoyueLg.st101567)
			this.roleName.text = data.data.name
			this.roleHead.source = ResDataPath.GetHeadMiniImgName2(data.data.job, data.data.sex)
		} else {
			let data = this.data as Sproto.gdwar_targeter
			this.currentState = "war"
			this.guildName.text = data.guildName
			this.roleName.text = data.actorName
			this.roleHead.source = ResDataPath.GetHeadMiniImgName2ById(data.actorHead)
			GuildWar.ins().HasAttack() && GuildWar.ins().GetAttHandle() == data.actorId && this.addAttEffect()
			// GuildWar.ins().HasAttack() && GuildWar.ins().GetAttHandle() == data.actorId && this.addAttEffect()
			// let e = EntityManager.ins().getEntityBymasterhHandle(data.actorId);
			// if (e) {
			// 	var infoModel = e.infoModel;
			// 	this.guildName.textFlow = (new egret.HtmlTextParser).parser(infoModel.guildName)
			// 	this.roleName.textFlow = (new egret.HtmlTextParser).parser(infoModel.name)
			// 	this.roleHead.source = infoModel.GetHeadImgName2()
			// 	GuildWar.ins().HasAttack() && GuildWar.ins().GetAttHandle() == data.actorId && this.addAttEffect()
			// } else {
			// 	console.log("not guild war memer, actorId = > " + data.actorId)
			// }
		}
	}

	addAttEffect() {
		this.attEffect || (this.attEffect = new MovieClip, this.attEffect.x = 40, this.attEffect.y = 38)
		this.attEffect.loadUrl(ResDataPath.GetUIEffePath("FightingEff"), !0)
		this.addChild(this.attEffect)
	}

	showEffect() {
		this.clickEffc.loadUrl(ResDataPath.GetUIEffePath("tapCircle"), !0, 1)
		this.clickEffc.x = this.m_EffGroup.width / 2;
		this.clickEffc.y = this.m_EffGroup.height / 2+3;
		this.m_EffGroup.addChild(this.clickEffc)
	}

	clearEffect() {
		DisplayUtils.removeFromParent(this.clickEffc)
		DisplayUtils.removeFromParent(this.attEffect)
	}
}
window["GuildWarMemberHeadRender"] = GuildWarMemberHeadRender