class PubBossRemindItem extends eui.ItemRenderer {
	public constructor() {
		super()
	}

	public txt: eui.Label;
	public bossName: eui.Label;
	public levelShow: eui.Label;
	public checkBoxs: eui.CheckBox;

	private publicBossConfig: any;
	private monstersConfig: any;

	public createChildren() {
		super.createChildren();
		this.txt.text = GlobalConfig.jifengTiaoyueLg.st100506;
		this.checkBoxs.label = GlobalConfig.jifengTiaoyueLg.st100507;
	}
	dataChanged() {
		if (this.publicBossConfig == null)
			this.publicBossConfig = GlobalConfig.publicBossConfig;
		if (this.monstersConfig == null)
			this.monstersConfig = GlobalConfig.monstersConfig;
		var e = this.data,
			t = this.publicBossConfig[e.id][0];
		this.checkBoxs.visible = t.level <= GameGlobal.actorModel.level
		t.level <= GameGlobal.actorModel.level && t.zsLevel <= GameGlobal.zsModel.lv
			? (this.checkBoxs.visible = t.level <= GameGlobal.actorModel.level, this.checkBoxs.selected = UserBoss.ins().getRemindByIndex(this.itemIndex))
			: this.checkBoxs.visible = !1, this.txt.visible = !this.checkBoxs.visible, this.checkBoxs.name = e.id - 1 + "";
		var i = this.monstersConfig[t.bossId];
		this.bossName.text = i.name, this.levelShow.text = t.zsLevel > 0 ? t.zsLevel + GlobalConfig.jifengTiaoyueLg.st100067 : t.level + GlobalConfig.jifengTiaoyueLg.st100093;
	}
}
window["PubBossRemindItem"] = PubBossRemindItem