class Activity301Win extends BaseEuiPanel implements ICommonWindow, ICommonWindowTitle {
	public constructor() {
		super()
		this.skinName = "MainWinSkin";
	}

	public commonWindowBg: CommonWindowBg;
	public viewStack: eui.ViewStack;
	windowTitleIconName: string = GlobalConfig.jifengTiaoyueLg.st101273;

	private activity301Panel: Activity301Panel;
	initUI() {
		super.initUI();
		this.activity301Panel = new Activity301Panel();
		this.activity301Panel.name =GlobalConfig.jifengTiaoyueLg.st101348;
		this.commonWindowBg.AddChildStack(this.activity301Panel)
	}

	open(...param: any[]) {
		this.commonWindowBg.OnAdded(this, param && param[0]);
		this.addWinEvent();
		this.updateRedPoint();
	}
	close() {
		this.removeObserve();
		this.removeWinEvetn();
		this.commonWindowBg.OnRemoved();
	}
	private addWinEvent() {
	}

	private removeWinEvetn() {
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

ViewManager.ins().reg(Activity301Win, LayerManager.UI_Main);
window["Activity301Win"] = Activity301Win