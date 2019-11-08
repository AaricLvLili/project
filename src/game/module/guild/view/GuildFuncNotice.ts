class GuildFuncNotice extends BaseEuiPanel implements ICommonWindow {

	public static LAYER_LEVEL = LayerManager.UI_Main

	private commonWindowBg: CommonWindowBg
	private dataGroup: eui.DataGroup
	private roleShowPanel: RoleShowPanel
	private group: eui.Group
	private guildBattleConst: any;

	public constructor() {
		super()
		this.skinName = "GuildFuncNoticeSkin"
		this.dataGroup.itemRenderer = ItemBaseEffe

		let mc = new MovieClip
		mc.loadUrl(ResDataPath.GetUIEffePath("eff_ui_sczbui_001"), true, -1)
		this.group.addChild(mc)
	}

	public open() {
		this.commonWindowBg.OnAdded(this)
		if (this.guildBattleConst == null)
			this.guildBattleConst = GlobalConfig.ins("GuildBattleConst");
		this.dataGroup.dataProvider = new eui.ArrayCollection(RewardData.ToRewardDatas(this.guildBattleConst.occupationAwardShow))
		this.roleShowPanel.SetWing(ResDataPath.GetUIEffePath("eff_ui_god_wing"), null, true)
		this.roleShowPanel.SetBody(ResDataPath.GetUIEffePath("eff_ui_body800_1"), null, null, true)
		this.roleShowPanel.SetWeapon(ResDataPath.GetUIEffePath("eff_ui_weapon800_1"), null, true)

		this.roleShowPanel.OffsetBody(64)
		this.roleShowPanel.OffsetWeapon(64)
		this.roleShowPanel.OffsetWing(15, -190)
		// this.roleShowPanel.SetWeapon(ResDataPath.GetUIEffePath(data[2]), null, true)
	}


	public close() {
		this.commonWindowBg.OnRemoved()
	}
}
window["GuildFuncNotice"] = GuildFuncNotice