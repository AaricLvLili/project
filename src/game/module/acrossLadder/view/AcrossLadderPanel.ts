class AcrossLadderPanel extends BaseView implements ICommonWindowTitle {

	windowTitleIconName: string = GlobalConfig.jifengTiaoyueLg.st100873;
	public headBG: eui.Image;
	public head: eui.Image;
	public labelPower: eui.Label;
	public labelRank: eui.Label;
	public labelWinLost: eui.Label;
	public labelChallengeNum: eui.Label;
	public buttonRecord: eui.Button;
	public buttonRank: eui.Button;
	public buttonRankReward: eui.Button;
	public buttonRefresh: eui.Button;
	public buttonBuyTimes: eui.Button;
	public labelDayWin: eui.Label;

	public m_ElementImg: eui.Image;

	public itemList: Array<AcrossLadderPlayerItem>;
	private itemsGroup: eui.Group;

	private readonly xyList: Array<any> = [{ x: 240, y: 70 }, { x: 0, y: 250 }, { x: 460, y: 250 }];
	public m_Lan1: eui.Label;
	public m_Lan2: eui.Label;
	public m_Lan3: eui.Label;
	public m_Lan4: eui.Label;
	public m_Lan6: eui.Label;
	public m_Lan5: eui.Label;

	constructor() {
		super();
		this.skinName = "AcrossLadderPanelSkin";
		this.name = GlobalConfig.jifengTiaoyueLg.st100873;
		this.itemList = [];

		this.m_Lan1.text = GlobalConfig.jifengTiaoyueLg.st100867;
		this.m_Lan2.text = GlobalConfig.jifengTiaoyueLg.st100868;
		this.m_Lan3.text = GlobalConfig.jifengTiaoyueLg.st100869;
		this.m_Lan4.text = GlobalConfig.jifengTiaoyueLg.st100870;
		this.m_Lan5.text = GlobalConfig.jifengTiaoyueLg.st100871;
		this.m_Lan6.text = GlobalConfig.jifengTiaoyueLg.st100872;
		this.buttonRefresh.label = GlobalConfig.jifengTiaoyueLg.st100877;
	}

	open(...param: any[]) {
		this.buttonRecord.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
		this.buttonRank.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
		this.buttonRankReward.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
		this.buttonRefresh.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
		this.buttonBuyTimes.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);

		MessageCenter.ins().addListener(MessageDef.ACROSSLADDER_REFRESH_PLAYER_INFO, this.updateSelfInfo, this);
		MessageCenter.ins().addListener(MessageDef.ACROSSLADDER_REFRESH_ITEMS, this.updateItemsInfo, this);
		this.updateItemsInfo();
		this.updateSelfInfo();
		AcrossLadderCenter.ins().reqAcrossLadderInfo();
	}

	private updateSelfInfo() {
		var panelModel = AcrossLadderPanelData.ins();
		this.head.source = panelModel.head;
		this.m_ElementImg.source = ResDataPath.GetElementImgName(panelModel.m_ElementType);
		this.labelPower.text = panelModel.power.toString();
		this.labelDayWin.text = panelModel.win.toString();
		this.labelRank.text = (panelModel.rank == AcrossLadderPanelData.DEFAULT_RANK) ? AcrossLadderPanelData.DEFAULT_RANK + GlobalConfig.jifengTiaoyueLg.st100874 : panelModel.rank.toString();
		this.labelWinLost.textFlow = <Array<egret.ITextElement>>[
			{ text: panelModel.win.toString() + GlobalConfig.jifengTiaoyueLg.st100875, style: { "textColor": 0x00FF00 } },
			{ text: " / ", style: { "textColor": 0x535557 } },
			{ text: panelModel.lost.toString() + GlobalConfig.jifengTiaoyueLg.st100876, style: { "textColor": 0xf87372 } }
		];
		this.labelChallengeNum.text = panelModel.challengeNum.toString();
	}

	public updateItemsInfo() {
		var dataList: Array<AcrossLadderItemData> = AcrossLadderPanelData.ins().playerList;
		var len: number = dataList.length;
		for (var i: number = 0; i < len; i++) {
			// if (this.xyList[i] == null) continue;
			if (this.itemList[i] == null) {
				this.itemList[i] = new AcrossLadderPlayerItem();
				// this.itemList[i].x = this.xyList[i].x;
				// this.itemList[i].y = this.xyList[i].y;
				this.itemsGroup.addChild(this.itemList[i]);
			}
			this.itemList[i].updateItem(dataList[i]);
		}
	}

	private buyTimes() {
		let baseConfig = AcrossLadderPanelData.ins().getBaseCfg();
		if (AcrossLadderPanelData.ins().todayBuyTimes == baseConfig.vipBuyCount[UserVip.ins().lv]) {
			UserTips.ins().showTips(GlobalConfig.jifengTiaoyueLg.st100585);
			return;
		}
		if (GameLogic.ins().actorModel.yb < baseConfig.buyChallengesCountYuanBao) {
			UserTips.ins().showTips(GlobalConfig.jifengTiaoyueLg.st100014);
			return;
		}
		if (AcrossLadderPanelData.ins().flagBuyTips) {
			AcrossLadderCenter.ins().reqBuyCombatNum(1);
		}
		else {
			let tips = LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st100878, [baseConfig.buyChallengesCountYuanBao]) + AcrossLadderPanelData.ins().todayBuyTimes + "/" + baseConfig.vipBuyCount[UserVip.ins().lv];
			if (AcrossLadderPanelData.ins().flagBuyTips == false) {
				tips = tips + "\n\n<font color='#FFB82A'>" + GlobalConfig.jifengTiaoyueLg.st100550;
			}
			WarnWin.show(tips, function () {
				AcrossLadderPanelData.ins().flagBuyTips = true;
				AcrossLadderCenter.ins().reqBuyCombatNum(1);
			}, this);
		}
	}

	private onTap(e) {
		switch (e.currentTarget) {
			case this.buttonRecord:
				AcrossLadderCenter.ins().reqAcrossLadderRecord();
				break;
			case this.buttonRank:
				AcrossLadderCenter.ins().reqAcrossLadderRank();
				break;
			case this.buttonRankReward:
				ViewManager.ins().open(AcrossLadderRankReward);
				break;
			case this.buttonRefresh:
				AcrossLadderCenter.ins().reqAcrossLadderInfo(true);
				break;
			case this.buttonBuyTimes:
				this.buyTimes();
				break;
		}
	}

	close() {
		this.buttonRecord.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
		this.buttonRank.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
		this.buttonRankReward.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
		this.buttonRefresh.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
		this.buttonBuyTimes.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
		MessageCenter.ins().removeListener(MessageDef.ACROSSLADDER_REFRESH_ITEMS, this.updateItemsInfo, this);
		MessageCenter.ins().removeListener(MessageDef.ACROSSLADDER_REFRESH_PLAYER_INFO, this.updateSelfInfo, this);

	}

	public static openCheck() {
		return Deblocking.Check(DeblockingType.TYPE_26)
	}

	UpdateContent() {

	}

	public CheckRedPoint() {
		var flg = AcrossLadderCenter.ins().rankRewardRedPoint();
		UIHelper.ShowRedPoint(this.buttonRankReward, flg);
		return flg;
	}
}
window["AcrossLadderPanel"] = AcrossLadderPanel