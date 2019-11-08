class HomeBossRemindItem extends eui.ItemRenderer {
	public constructor() {
		super()
	}
	private txt: eui.Label;
	private bossName: eui.Label;
	private levelShow: eui.Label;
	private checkBoxs: eui.CheckBox;

	protected childrenCreated() {
		super.childrenCreated();
		this.checkBoxs.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchBox, this);
	}
	private onTouchBox() {
		let remindStats: Sproto.reminds[] = HomeBossModel.getInstance.remindStats;
		if (this.checkBoxs.selected == false) {
			for (var i = 0; i < remindStats.length; i++) {
				if (remindStats[i].id == this.data.groupId) {
					remindStats[i].state = 2;
					break;
				}
			}
			UserBoss.ins().sendGetVipBossTipsMsg(this.data.groupId, 2);
		} else {
			let have: boolean = false;
			for (var i = 0; i < remindStats.length; i++) {
				if (remindStats[i].id == this.data.groupId) {
					remindStats[i].state = 1;
					have = true;
					break;
				}
			}
			if (!have) {
				let remindStatsData = new Sproto.reminds();
				remindStatsData.id = this.data.groupId;
				remindStatsData.state = 1;
				remindStats.push(remindStatsData);
			}
			UserBoss.ins().sendGetVipBossTipsMsg(this.data.groupId, 1);
		}

	}
	public dataChanged() {
		let data = this.data;
		let monstersConfig = GlobalConfig.monstersConfig;
		if (data.isCanBattle == 1) {
			this.txt.visible = false;
			this.checkBoxs.visible = true;
		} else {
			this.txt.text = data.context;
			this.txt.visible = true;
			this.checkBoxs.visible = false;
		}
		this.levelShow.text = data.zsLevel > 0 ? LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st101367, [data.zsLevel]) : LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st101367, [data.level]);
		this.bossName.text = monstersConfig[data.bossId].name;
		let bossremindslist: Sproto.reminds[] = HomeBossModel.getInstance.remindStats;
		this.checkBoxs.selected = false;
		for (var i = 0; i < bossremindslist.length; i++) {
			if (bossremindslist[i].id == data.groupId && bossremindslist[i].state == 1) {
				this.checkBoxs.selected = true;
			}
		}

		// var e = this.data,
		// 	t = this.publicBossConfig[e.id][0];
		// this.checkBoxs.visible = t.level <= GameGlobal.actorModel.level
		// t.level <= GameGlobal.actorModel.level && t.zsLevel <= GameGlobal.zsModel.lv
		// 	? (this.checkBoxs.visible = t.level <= GameGlobal.actorModel.level, this.checkBoxs.selected = UserBoss.ins().getRemindByIndex(this.itemIndex))
		// 	: this.checkBoxs.visible = !1, this.txt.visible = !this.checkBoxs.visible, this.checkBoxs.name = e.id - 1 + "";
		// var i = this.monstersConfig[t.bossId];
		// this.bossName.text = i.name, this.levelShow.text = t.zsLevel > 0 ? t.zsLevel + "转" : t.level + "级"
	}
}
window["HomeBossRemindItem"] = HomeBossRemindItem