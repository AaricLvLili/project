class StrongWin extends BaseEuiPanel implements ICommonWindow, ICommonWindowTitle {
	public constructor() {
		super()
		this.skinName = "MainWinSkin";
	}
	public commonWindowBg: CommonWindowBg;
	windowTitleIconName: string = GlobalConfig.jifengTiaoyueLg.st100794;

	initUI() {
		super.initUI();
		let config = GlobalConfig.ins("BianQiangMethodConfig");

		for (let i in config) {
			let bianQiangMethodConfig = config[i];
			let strongPanel = new StrongPanel();
			let list = [];
			for (let f in bianQiangMethodConfig) {
				if (!strongPanel.name) {
					strongPanel.name = bianQiangMethodConfig[f].typeName;
				}
				list.push(bianQiangMethodConfig[f])
			}
			strongPanel.config = list;
			this.commonWindowBg.AddChildStack(strongPanel);
		}
	}

	open(...param: any[]) {
		this.commonWindowBg.OnAdded(this, param && param[0]);
		this.updateRedPoint();
	}
	close() {
		this.removeObserve();
		this.commonWindowBg.OnRemoved();
	}


	private updateRedPoint() {
		// this.commonWindowBg.ShowTalRedPoint(0, petModel.checkPetStateRedPoint())
	};

	OnBackClick(clickType: number): number {
		return 0
	}
	OnOpenIndex(openIndex: number): boolean {
		return true
	}

	UpdateContent(): void { }

}

ViewManager.ins().reg(StrongWin, LayerManager.UI_Main);
window["StrongWin"] = StrongWin