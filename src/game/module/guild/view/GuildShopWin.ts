class GuildShopWin extends BaseEuiPanel implements ICommonWindow, ICommonWindowTitle {

	public static LAYER_LEVEL = LayerManager.UI_Main
	windowTitleIconName = GlobalConfig.jifengTiaoyueLg.st100919;
	commonWindowBg: CommonWindowBg
	guildshopkaiqi
	useBtn
	guildMore: eui.Label
	boxopen: eui.Image
	boxclose: eui.Image
	guildshopitem_7

	guildshopopen
	guildshopclose
	guildshopshengyulabel: eui.Label;
	private consumeLabel: ConsumeLabel;
	private mc_lighting: MovieClip;

	list: eui.List;
	public m_Lan1: eui.Label;
	public m_Lan2: eui.Label;

	UpdateContent(): void { }

	public constructor() {
		super()
		this.skinName = "GuildStoreSkin";
	}

	initUI() {
		super.initUI()
		this.list.itemRenderer = GuildShopRecordItemRender;
		this.consumeLabel.consumeType = GlobalConfig.jifengTiaoyueLg.st101006;
		this.guildMore.text = GlobalConfig.jifengTiaoyueLg.st101012;
		UIHelper.SetLinkStyleLabel(this.guildMore);
		this.m_Lan1.text = GlobalConfig.jifengTiaoyueLg.st101013;
		this.m_Lan2.text = GlobalConfig.jifengTiaoyueLg.st101014;
		this.useBtn.text = GlobalConfig.jifengTiaoyueLg.st101015;
	}

	lightingEff() {
		// this.mc_lighting.loadFile(ResDataPath.GetUIEffePath("ui_box_eff"), true, 1); 
		if (!this.mc_lighting) {
			this.mc_lighting = new MovieClip;
		}
		this.mc_lighting.loadUrl(ResDataPath.GetUIEffePath("ui_box_eff"), true, -1, () => {
			DisplayUtils.dispose(this.mc_lighting);
			this.mc_lighting = null;
		});
		this.mc_lighting.x = 220;
		this.mc_lighting.y = 320;
		this.mc_lighting.scaleX = this.mc_lighting.scaleY = .8
		this.addChild(this.mc_lighting);
		this.boxopen.visible = true;
		this.boxclose.visible = false;
		this.isOpenEff = false;
	}

	open() {
		//UIHelper.SetLinkStyleLabel(this.guildshopkaiqi,"前往提升")
		this.guildshopkaiqi.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
		this.useBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
		this.guildMore.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
		GuildStore.ins().getGuildStoreInfo();
		GuildStore.ins().sendGuildStoreBoxInfo();
		MessageCenter.addListener(GuildStore.ins().postGuildStoreInfo, this.onupdateData, this);
		MessageCenter.addListener(GuildStore.ins().postGuildStoreBox, this.onItemInfo, this);
		MessageCenter.addListener(GuildStore.ins().postGuildStoreBoxInfo, this.onReadInfo, this);

		this.onupdateData();
		this.guildshopitem_7.visible = false;

		let x = 127
		let y = 239
		let width = 238
		let height = 232

		this.commonWindowBg.OnAdded(this)
	}

	close() {
		this.guildshopkaiqi.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
		this.useBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
		this.guildMore.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
		MessageCenter.ins().removeAll(this);
		this.commonWindowBg.OnRemoved();
		DisplayUtils.dispose(this.mc_lighting);
		this.mc_lighting = null;
	}

	onupdateData() {
		if (GuildStore.ins().guildStoreLv > 0) {
			this.guildshopopen.visible = true;
			this.guildshopclose.visible = false;
			this.guildshopclose.touchEnabled = false;
			this.guildshopopen.touchEnabled = true;

			this.consumeLabel.curValue = Guild.ins().myCon;
			this.consumeLabel.consumeValue = GlobalConfig.ins("GuildStoreConfig").needContrib;

			var totalNum = GlobalConfig.ins("GuildStoreConfig").time[GuildStore.ins().guildStoreLv - 1];
			var nextTotalNum = GlobalConfig.ins("GuildStoreConfig").time[GuildStore.ins().guildStoreLv];
			var str = "";
			if (GuildStore.ins().guildStoreNum <= 0) {
				str = "<font color='#f87372'>" + GuildStore.ins().guildStoreNum + "/" + totalNum + "</font>";
			}
			else {
				str = GuildStore.ins().guildStoreNum + "/" + totalNum;
			}
			if (nextTotalNum)
				//this.guildshopshengyulabel.textFlow = new egret.HtmlTextParser().parser("本日剩余次数:" + str + "<font color='#00FF00'>(" + (GuildStore.ins().guildStoreLv + 1) + "级公会商店每日次数+" + (nextTotalNum - totalNum) + ")</font>");
				this.guildshopshengyulabel.textFlow = TextFlowMaker.generateTextFlow(LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st101007, [str, GuildStore.ins().guildStoreLv + 1, nextTotalNum - totalNum]));
			else
				this.guildshopshengyulabel.textFlow = TextFlowMaker.generateTextFlow(LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st101008, [str]));
		}
		else {
			this.guildshopopen.visible = false;
			this.guildshopopen.touchEnabled = false;
			this.guildshopclose.touchEnabled = true;
			this.guildshopclose.visible = true;
			// this.guildshopkaiqi.textFlow = new egret.HtmlTextParser().parser("<u>前往提升</u>");
		}
		for (var k in GlobalConfig.ins("GuildStoreConfig").item) {
			this["guildshopitem_" + k].data = GlobalConfig.ins("GuildStoreConfig").item[k];
		}
		// this.guildMore.textFlow = new egret.HtmlTextParser().parser("<u>更多记录</u>");
	}

	onReadInfo() {
		var arr = GuildStore.ins().GetRecordInfos();
		let list = []
		for (let i = 0; i < 5; ++i) {
			let data = arr[i]
			if (!data) {
				break
			}
			list.push(data)
		}
		this.list.dataProvider = new eui.ArrayCollection(list)
	}

	onItemInfo() {

		this.guildshopitem_7.visible = true;
		var guildStoreItemData = GuildStore.ins().getGuildStoreItemData();
		this.guildshopitem_7.num = guildStoreItemData.num;
		this.guildshopitem_7.data = guildStoreItemData.itemId;
		this.onupdateData();
	};

	isOpenEff = false
	// openBoxEff: MovieClip

	startEff() {
		this.guildshopitem_7.visible = false;
		this.boxclose.visible = true;
		this.boxopen.visible = false;
		this.isOpenEff = true;
		egret.setTimeout(this.lightingEff, this, 100)
		GuildStore.ins().sendGuildStoreBox();
	};
	onTap(e) {
		switch (e.currentTarget) {
			case this.guildshopkaiqi:
				ViewManager.ins().open(GuildWin, 1);
				break;
			case this.useBtn:
				if (!Checker.OpenDay(GlobalConfig.ins("GuildStoreConfig").day)) {
					return
				}
				if (GuildStore.ins().guildStoreNum <= 0) {
					UserTips.ins().showTips(GlobalConfig.jifengTiaoyueLg.st101009);
					return;
				}
				if (GlobalConfig.ins("GuildStoreConfig").needContrib > Guild.ins().myCon) {
					UserTips.ins().showTips(GlobalConfig.jifengTiaoyueLg.st101010);
					return;
				}
				if (UserBag.ins().getSurplusCount() <= 0) {
					UserTips.ins().showTips(GlobalConfig.jifengTiaoyueLg.st101011);
					return;
				}
				if (this.isOpenEff == false)
					this.startEff();
				break;
			case this.guildMore:
				ViewManager.ins().open(GuildShopRecordWin);
				break;
		}
	}
}
window["GuildShopWin"] = GuildShopWin