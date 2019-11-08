class LuckGiftBagWin extends BaseEuiPanel implements ICommonWindow, ICommonWindowTitle {
	public constructor() {
		super()
		this.skinName = "MainWinSkin";
	}

	public commonWindowBg: CommonWindowBg;




	windowTitleIconName: string = GlobalConfig.jifengTiaoyueLg.st101761;
	initUI() {
		super.initUI();
	}

	open(...param: any[]) {
		this.initPanelData(param);
		this.addWinEvent();
		this.updateRedPoint();
	}
	close() {
		this.removeObserve();
		this.removeWinEvetn();
		this.commonWindowBg.OnRemoved();
		this.removePanel();
	}
	private addWinEvent() {
		GameGlobal.MessageCenter.addListener(MessageDef.LUCKGIFTBAG_DATA_UPDATE, this.updateRedPoint, this);
	}

	private removeWinEvetn() {
		GameGlobal.MessageCenter.removeListener(MessageDef.LUCKGIFTBAG_DATA_UPDATE, this.updateRedPoint, this);
	}

	private updateRedPoint() {
		let numChild = this.commonWindowBg.comViewStack.numChildren;
		for (var i = 0; i < numChild; i++) {
			let child = this.commonWindowBg.comViewStack.getChildAt(i);
			if (child && child instanceof LuckGiftBagPanel) {
				this.commonWindowBg.ShowTalRedPoint(i, LuckGiftBagModel.getInstance.cleckRedPoint(child.configDataId))
			}
		}
	};



	private initPanelData(...param: any[]) {
		let luckGiftData: Sproto.luckypackage_row[] = LuckGiftBagModel.getInstance.luckGiftData.values;
		let luckConfigDatas = GlobalConfig.ins("ActivityGiftConfig");
		for (var i = 0; i < luckGiftData.length; i++) {
			let t = Math.max(0, (luckGiftData[i].time || 0) - GameServer.serverTime);
			if (t <= 0) {
				LuckGiftBagModel.getInstance.luckGiftData.remove(luckGiftData[i].id);
				continue;
			}
			let luckPanel = new LuckGiftBagPanel();
			let luckConfigDataId = luckGiftData[i].id;
			let luckConfigData = luckConfigDatas[luckConfigDataId];
			luckPanel.name = luckConfigData.tabName;
			luckPanel.configDataId = luckConfigDataId;
			this.commonWindowBg.AddChildStack(luckPanel);
		}
		this.commonWindowBg.OnAdded(this, param.length ? param[0] : 0)
	}


	private removePanel() {
		let childNum = this.commonWindowBg.comViewStack.numChildren;
		for (var i = 0; i < childNum; i++) {
			let child = this.commonWindowBg.comViewStack.removeChildAt(0);
			if (child instanceof LuckGiftBagPanel) {
				child.release();
			}
		}
	}

	OnBackClick(clickType: number): number {
		return 0
	}
	OnOpenIndex(openIndex: number): boolean {
		return true
	}

	UpdateContent(): void { }

}

ViewManager.ins().reg(LuckGiftBagWin, LayerManager.UI_Main);
window["LuckGiftBagWin"] = LuckGiftBagWin