class GuildActityItemRender extends eui.ItemRenderer {
	public constructor() {
		super();
	}
	goBtn0
	taskIcon
	nameLab
	descLab
	label
	callNumLabel


	public createChildren() {
		super.createChildren();
		this.goBtn0.label = GlobalConfig.jifengTiaoyueLg.st100976;
	}
	onTap(e) {
		switch (e) {
			case this.goBtn0:
				this.conBtnOnCLick();
				break;
		}
	};
	conBtnOnCLick() {
		var info = this.data;
		if (info.id == 1) {
			if (GuildRobber.ins().GetRobTotal() - GuildRobber.ins().GetRobDeadNum() <= 0) {
				UserTips.ins().showTips("|C:0xf87372&T:" + GlobalConfig.jifengTiaoyueLg.st101792 + "|");
				return;
			} else {
				ViewManager.ins().close(GuildActivityWin);
			}
		}
		else if (info.id == 2) {
			ViewManager.ins().close(GuildActivityWin);
			if (GuildBoss.ins().IsOpen()) {
				ViewManager.ins().open(GuildBossReadyPanel)
			} else {
				ViewManager.ins().open(GuildBossCallPanel)
			}
		}
	};

	private _UpateCallNum(cur: number, max: number) {
		this.callNumLabel.text = `${cur}/${max}`
	}

	dataChanged() {
		var info = this.data;
		if (info) {
			if (info.id)
				//this.taskIcon.source = "guildActity_" + info.id;
				if (info.context)
					this.nameLab.textFlow = new egret.HtmlTextParser().parser(info.context);
			if (info.id == 1) {
				this.descLab.text = GlobalConfig.jifengTiaoyueLg.st101793 + "：" + (GuildRobber.ins().GetRobTotal() - GuildRobber.ins().GetRobDeadNum()) + "/" + GuildRobber.ins().GetRobTotal();
				this.label.text = (GlobalConfig.robberfbconfig.challengeMax - GuildRobber.ins().robberChanllge) + "/" + GlobalConfig.robberfbconfig.challengeMax;
				this.callNumLabel.visible = false;
			}
			this._UpateCallNum(GuildBoss.ins().times(), GuildBoss.ins().GetMaxCallTimes())
			if (info.id == 2) {
				this.callNumLabel.visible = this.descLab.visible = false
				this.label.text = this.callNumLabel.text
			}
		}
	};
}
window["GuildActityItemRender"] = GuildActityItemRender