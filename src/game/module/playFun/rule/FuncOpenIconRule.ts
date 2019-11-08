class FuncOpenIconRule extends RuleIconBase {

	private funcLabel: eui.Label
	private funcIcon: eui.Image

	public constructor(t) {
		super(t)
		t['redPoint'] = t.getChildByName("redPoint")
		this.updateMessage = [
			MessageDef.LEVEL_CHANGE,
			// MessageDef.GUILDWAR_STARTSTATU_CHANGE,
			// MessageDef.ZS_BOSS_OPEN,
			// MessageDef.WORLD_BOSS_OPEN,
			// MessageDef.DOUBLE_DARTCAR_NOTICE,
			// MessageDef.DOUBLE_MINING_NOTICE,
			MessageDef.ONLINE_REWARDS_STATE,
		]
		t.addEventListener(egret.Event.ADDED_TO_STAGE, this.addTick, this);
		t.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.removeTick, this);
		let group = t.getChildByName("lebGroup");
		this.funcLabel = group.getChildByName("funcLabel")
		this.funcIcon = t.getChildByName("icon")
		this.funcIcon.source = "fun_lqvip_01_png";
		this.addTick();
	}

	checkShowIcon() {
		// if (GuildWar.ins().getIsShowGuildWarBtn())
		// 	return false
		// if (GuildWar.ins().getIsShowKfGuildWarBtn())
		// 	return false
		// if(ZsBoss.ins().acIsOpen)
		// 	return false;
		// if(ZsBoss.ins().wAcIsOpen)
		// 	return false;
		// if(DartCarModel.ins().isDoubleDartCar)
		// 	return false;
		// if(MineModel.ins().isDoubleMining)
		// 	return false;
		return !OnlineRewardsModel.ins().onlineRewardComplete();
	}

	checkShowRedPoint() {
		return OnlineRewardsModel.ins().canOnlineReward();
	}

	update() {
		super.update();
	}

	getEffName(e) {
		if (OnlineRewardsModel.ins().canOnlineReward()) {
			return (this.effX = 34, this.effY = 34, "eff_main_icon02")
		}
		return false
	}

	tapExecute() {
		ViewManager.ins().open(OnlineRewardsWin)
	}

	private addTick() {
		this.removeTick();
		TimerManager.ins().doTimer(1000, 0, this.setTime, this);
	}

	private removeTick() {
		TimerManager.ins().remove(this.setTime, this);
	}

	private setTime() {
		if (OnlineRewardsModel.ins().canOnlineReward()) {
			this.funcLabel.text = GlobalConfig.jifengTiaoyueLg.st100001;
			this.removeTick();
		}
		else
			this.funcLabel.text = OnlineRewardsModel.ins().getOnlineNearlyTime();
	}

	// 传世之路换为在线奖励
	// public constructor(t) {
	// 	super(t)
	// 	t['redPoint'] = t.getChildByName("redPoint")
	// 	this.updateMessage = [ MessageDef.LEVEL_CHANGE, MessageDef.GUANQIA_CHANGE,
	// 	MessageDef.FUNC_OPEN_UPDATE, MessageDef.GUILDWAR_STARTSTATU_CHANGE,
	// 	MessageDef.ZS_BOSS_OPEN,MessageDef.WORLD_BOSS_OPEN,MessageDef.DOUBLE_DARTCAR_NOTICE,MessageDef.DOUBLE_MINING_NOTICE]

	// 	this.funcLabel = t.getChildByName("funcLabel")
	// 	this.funcIcon = t.getChildByName("icon")
	// }

	// checkShowIcon() {
	// 	if (GuildWar.ins().getIsShowGuildWarBtn())
	// 		return false
	// 	if (GuildWar.ins().getIsShowKfGuildWarBtn())
	// 		return false
	// 	if(ZsBoss.ins().acIsOpen)
	// 		return false;
	// 	if(ZsBoss.ins().wAcIsOpen)
	// 		return false;
	// 	if(DartCarModel.ins().isDoubleDartCar)
	// 		return false;
	// 	if(MineModel.ins().isDoubleMining)
	// 		return false;

	// 	if (FuncOpenModel.ins().GetNextIndex() != -1) {
	// 		return true
	// 	}
	// 	if (FuncOpenModel.ins().HasReward()) {
	// 		return true
	// 	}
	// 	return false
	// }

	// checkShowRedPoint () {
	// 	return FuncOpenModel.ins().HasReward()
	// }

	// update() {
	// 	super.update()
	// 	let index = FuncOpenModel.ins().GetNextIndex()
	// 	if (index != -1) {
	// 		this.funcIcon.source = FuncOpenPanel.ICON_LIST[index - 1]
	// 		this.funcIcon.width = 96;
	// 		this.funcIcon.height = 103;
	// 		this.funcLabel.text = FuncOpenModel.GetTipStrByIndex(index)
	// 	} else {
	// 		this.funcIcon.source = "ui_zjm_icon_cszl"
	// 		this.funcLabel.text = "开启所有"
	// 		this.funcIcon.width = 96;
	// 		this.funcIcon.height = 103;
	// 	}
	// }

	// getEffName(e) {
	// 	if (FuncOpenModel.ins().HasReward()) {
	// 		return (this.effX = 190, this.effY = 52, "eff_main_icon03")
	// 	}
	// 	return false
	// }

	// tapExecute() {
	// 	ViewManager.ins().open(FuncOpenPanel)
	// }
}
window["FuncOpenIconRule"] = FuncOpenIconRule