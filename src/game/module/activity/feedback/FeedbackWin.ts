class FeedbackWin extends BaseEuiPanel implements ICommonWindowTitle {
	public constructor() {
		super();
		this.skinName = "FeedbackWinSkin";
	}

	windowTitleIconName: string = GlobalConfig.jifengTiaoyueLg.st101683;
	mWindowHelpId = 27;
	private commonWindowBg: CommonWindowBg;
	public showImg: eui.Image;
	private getBtn: eui.Button;

	private times: eui.Label;
	private dec: eui.Label;
	private itemName: eui.Label;

	public priceGroup: eui.Group;
	private price: PriceIcon;
	private price1: PriceIcon;
	public feedTips: eui.Label;
	private groupTips: eui.Group;

	initUI() {
		this.commonWindowBg.SetTabDatas(new eui.ArrayCollection(this.getTableData()));
		// for (var i = 0; i < 7; i++) {
		// 	if (GameServer.serverOpenDay == i + 1)
		// 		(this["tips" + i] as eui.Image).source = `comp_feedback_142_14_p${i}_png`;
		// 	else
		// 		(this["tips" + i] as eui.Image).source = `comp_feedback_142_14_n${i}_png`;
		// }
		let item = this.groupTips.getChildAt(GameServer.serverOpenDay - 1) as eui.Label;
		if (item) {
			item.textColor = 0xbf7d00;
			item.size = 16;
		}
		this.price1.labelColor = "0xbf7d00";
		this.price.labelColor = "0xbf7d00";
	}

	open(...param: any[]) {
		this.commonWindowBg.OnAdded(this, param[0] || 0);
		this.AddClick(this.getBtn, this.onTouchTab);
		this.observe(MessageDef.UPDATE_ACTIVITY_PANEL, this.UpdateContent);
	}

	close() {
		this.commonWindowBg.OnRemoved();
		this.removeEvents();
		this.removeObserve();
	}

	private onTouchTab(): void {
		var config: any = this.getConfig();
		if (Checker.Money(MoneyConst.yuanbao, config.yuanjia, Checker.YUNBAO_FRAME)) {
			//身上钻石还足够
			ActivityModel.ins().sendReward(200, this.selectedIndex + 1);
		}
	}

	public static SHOW_IMG_LIST = [
		"comp_243_267_01_png",
		"comp_243_267_06_png",
		"comp_243_267_03_png",
		"comp_243_267_02_png",
		"comp_243_267_05_png",
		"comp_243_267_04_png",
	]

	UpdateContent(): void {
		var activityData = <ActivityType15Data>GameGlobal.activityData[200];
		this.times.textFlow = TextFlowMaker.generateTextFlow(GlobalConfig.jifengTiaoyueLg.st100025 + StringUtils.addColor(activityData.getRemindTimeString(), Color.Green));

		this.showImg.source = FeedbackWin.SHOW_IMG_LIST[this.selectedIndex];
		var config: any = this.getConfig();
		var itemId = config.reward[0].id;
		var itemConfig = GlobalConfig.itemConfig[itemId];
		this.itemName.text = itemConfig.name;
		this.dec.text = config.tips;

		var discount = config.ratio[GameServer.serverOpenDay - 1];
		var feedYb = config.yuanjia * discount / 100;

		this.price.price = config.yuanjia;
		this.price1.price = feedYb;

		let flg = false;
		let buyids;
		for (var info of activityData.buyids) {
			if (info.id == this.selectedIndex + 1) {
				flg = true;
				buyids = info;
				break;
			}
		}

		if (flg) {
			this.getBtn.label = GlobalConfig.jifengTiaoyueLg.st101342;
			this.getBtn.enabled = false;
			this.priceGroup.visible = false;
			this.feedTips.visible = true;

			let discount1 = config.ratio[buyids.buyServerRunDay - 1];
			let feedYb1 = buyids.buyPrice * discount1 / 100;
			let str1 = StringUtils.addColor(`${buyids.buyServerRunDay}` + GlobalConfig.jifengTiaoyueLg.st100006 + `,`, Color.Green);
			let str2 = StringUtils.addColor(`${discount1}%`, Color.Green);
			let str3 = StringUtils.addColor(`${feedYb1}`, Color.Green);
			this.feedTips.textFlow = TextFlowMaker.generateTextFlow(LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st101684, [str1, str2, str3]));
		}
		else {
			this.getBtn.label = GlobalConfig.jifengTiaoyueLg.st100069;
			this.getBtn.enabled = true;
			this.priceGroup.visible = true;
			this.feedTips.visible = false;
		}
	}

	OnOpenIndex(openIndex: number): boolean {
		return true
	}

	private get selectedIndex(): number {
		return this.commonWindowBg.GetSelectedIndex();
	}

	private getConfig(): void {
		var config = GlobalConfig.ins("ActivityType15Config")[200];
		return config[this.selectedIndex];
	}

	private getTableData() {
		var config = GlobalConfig.ins("ActivityType15Config")[200];
		var tData = [];
		for (var info of config) {
			tData.push(info.tabName);
		}
		return tData;
	}
}
ViewManager.ins().reg(FeedbackWin, LayerManager.UI_Main);
window["FeedbackWin"] = FeedbackWin