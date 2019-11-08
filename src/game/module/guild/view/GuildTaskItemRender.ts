class GuildTaskItemRender extends eui.ItemRenderer {
	public constructor() {
		super();


		this.skinName = "GuildTaskItemSkin";
	}

	conBtn: eui.Button
	goBtn
	taskIcon: eui.Image
	nameLab
	descLab
	conGroup
	getGroup
	numLab
	wcimg: eui.Image

	public createChildren() {
		super.createChildren();
		this.goBtn.label = GlobalConfig.jifengTiaoyueLg.st100976;
		this.conBtn.label = GlobalConfig.jifengTiaoyueLg.st100931;
	}

	onTap(e) {
		switch (e) {
			case this.conBtn:
			case this.goBtn:
				this.conBtnOnCLick();
				break;
		}
	};
	conBtnOnCLick() {
		var info = this.data;
		switch (info.stdTask.type) {
			case 31:
				if (Guild.ins().GetConCount(0) >= Guild.ins().GetMaxConCount(0))
					UserTips.ins().showTips(GlobalConfig.jifengTiaoyueLg.st100977);
				// else if (GameLogic.ins().actorModel.yb > info.stdTask.param) {
				if (GuildConWin.DonateYb() == 1) {
					ViewManager.ins().open(VipWin);
				}
				// }
				// else
				// 	UserTips.ins().showTips("钻石不足");

				// let config = GlobalConfig.ins("GuildDonateConfig")[1].dayCount
				// let vipLv = UserVip.ins().lv
				// var num = config[vipLv];
				// var nextNum = config[vipLv + 1];
				// if (Guild.ins().GetSurplusConCount(0) <= 0) {
				// 	if (nextNum && (nextNum - num > 0)) {
				// 		this.count0.textFlow = new egret.HtmlTextParser().parser("<font color='#f87372'>VIP" + (UserVip.ins().lv + 1) + "</font>额外捐献" + (nextNum - num) + "次");
				// 		this.btn0.label = UserVip.ins().lv == 0 ? "成为VIP" : "提升VIP"
				// 	} else {
				// 		this.count0.text = Guild.ins().GetConCount(0) + "/" + Guild.ins().GetMaxConCount(0)
				// 		this.btn0.label = "捐 献";
				// 	}
				// 	//  vip有跳转
				// 	// this.btn0.enabled = UserVip.ins().lv == 0
				// }
				// else {
				// 	// this.btn0.enabled = true;
				// 	this.count0.text = Guild.ins().GetConCount(0) + "/" + Guild.ins().GetMaxConCount(0)
				// }

				break;
			case 32:
				if (info.param >= info.stdTask.target)
					UserTips.ins().showTips(GlobalConfig.jifengTiaoyueLg.st100977);
				else if (GameLogic.ins().actorModel.gold > info.stdTask.param) {
					Guild.ins().sendCon(info.stdTask.conID);
				}
				else
					UserWarn.ins().setBuyGoodsWarn(1);
				break;
			case 33:
				if (info.param >= info.stdTask.target)
					UserTips.ins().showTips(GlobalConfig.jifengTiaoyueLg.st100977);
				else if (UserBag.ins().getBagGoodsCountById(0, info.stdTask.param) >= 1) {
					Guild.ins().sendCon(info.stdTask.conID);
				}
				else
					UserTips.ins().showTips(GlobalConfig.jifengTiaoyueLg.st100217);
				break;
			default:
				let data = info.stdTask.controlTarget
				GameGuider.guidance(data[0], data[1])
				break;
		}
	};
	goBtnOnClick() {
		var info = this.data;
		switch (info.state) {
			case 0:
				let data = info.stdTask.controlTarget
				GameGuider.guidance(data[0], data[1])
				break;
			case 1:
				Guild.ins().sendGetTaskAward(info.taskID);
				break;
			case 2:
				break;
		}
	};
	dataChanged() {
		if (this.data instanceof GuildTaskInfo) {
			var info = this.data;
			if (info) {
				let icon = ""
				if (info.taskID == 1) {
					icon = "propIcon_030_png"
				} else if (info.taskID == 2) {
					icon = "propIcon_025_png"
				} else {
					//icon = "guildtask_" + info.taskID;
					icon = "propIcon_035_png"
				}
				this.taskIcon.source = icon
				this.nameLab.text = info.stdTask.name;
				this.descLab.text = info.stdTask.desc;
				//this.conGroup.visible = true;
				this.getGroup.visible = false;
				this.numLab.text = info.param + "/" + info.stdTask.target;
				this.conBtn.enabled = info.param < info.stdTask.target;
				this.wcimg.visible = !this.conBtn.enabled;
				this.conBtn.visible = info.param < info.stdTask.target;
				this.conGroup.visible = info.param < info.stdTask.target;
				UIHelper.ShowRedPoint(this.conBtn, info.taskID == 2 && this.data.state == RewardState.NotReached)
				if (info.stdTask.type == 31 && Guild.ins().GetConCount(0) < Guild.ins().GetMaxConCount(0)) {
					this.conBtn.label = GlobalConfig.jifengTiaoyueLg.st100931;
					this.numLab.text = Guild.ins().GetConCount(0) + "/" + Guild.ins().GetMaxConCount(0)
					this.conBtn.enabled = Guild.ins().GetConCount(0) < Guild.ins().GetMaxConCount(0);
					this.wcimg.visible = !this.conBtn.enabled;
					this.conBtn.visible = Guild.ins().GetConCount(0) < Guild.ins().GetMaxConCount(0);
					this.conGroup.visible = Guild.ins().GetConCount(0) < Guild.ins().GetMaxConCount(0);
					let config = GlobalConfig.ins("GuildDonateConfig")[1].dayCount
					let vipLv = UserVip.ins().lv
					var num = config[vipLv];
					var nextNum = config[vipLv + 1];
					if (Guild.ins().GetSurplusConCount(0) <= 0) {
						this.conBtn.visible = !WxSdk.ins().isHidePay();
						this.numLab.visible = !WxSdk.ins().isHidePay();
						if (nextNum && (nextNum - num > 0)) {
							this.numLab.textFlow = new egret.HtmlTextParser().parser(LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st100978, [UserVip.ins().lv + 1, nextNum - num]));
							this.conBtn.label = UserVip.ins().lv == 0 ? GlobalConfig.jifengTiaoyueLg.st100944 : GlobalConfig.jifengTiaoyueLg.st100945;
						}
					}
				} else if (info.param < info.stdTask.target) {
					switch (info.stdTask.type) {
						case 32: //捐献金币
						case 33:
							this.conBtn.label = GlobalConfig.jifengTiaoyueLg.st100931;
							break;
						default:
							this.conBtn.label = GlobalConfig.jifengTiaoyueLg.st100976;
							break;
					}
				}
				else
					this.conBtn.label = GlobalConfig.jifengTiaoyueLg.st100979;

			}
		}
	};
}
window["GuildTaskItemRender"] = GuildTaskItemRender