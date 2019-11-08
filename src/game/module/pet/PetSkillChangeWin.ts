class PetSkillChangeWin extends BaseEuiPanel implements ICommonWindow, ICommonWindowTitle {
	public constructor() {
		super()
		this.skinName = "MainWinSkin";
	}

	public commonWindowBg: CommonWindowBg;


	windowTitleIconName: string = GlobalConfig.jifengTiaoyueLg.st101140;

	private petSkillChange: PetSkillChangePanel;
	initUI() {
		super.initUI();
		this.petSkillChange = new PetSkillChangePanel();
		this.petSkillChange.name = GlobalConfig.jifengTiaoyueLg.st101140;
		this.commonWindowBg.AddChildStack(this.petSkillChange);
	}

	open(...param: any[]) {
		this.commonWindowBg.OnAdded(this, param && param[0])
		this.updateRedPoint();
	}
	close() {
		this.removeObserve();
		this.commonWindowBg.OnRemoved();
	}

	private updateRedPoint() {
		// let numChild = this.viewStack.numChildren;
		// for (var i = 0; i < numChild; i++) {
		// 	let child = this.viewStack.getChildAt(i);
		// 	if (child && child instanceof LuckGiftBagPanel) {
		// 		this.commonWindowBg.ShowTalRedPoint(i, LuckGiftBagModel.getInstance.cleckRedPoint(child.configDataId))
		// 	}
		// }
	};

	OnBackClick(clickType: number): number {
		return 0
	}
	OnOpenIndex(openIndex: number): boolean {
		return true
	}

	UpdateContent(): void { }

}

ViewManager.ins().reg(PetSkillChangeWin, LayerManager.UI_Main);
window["PetSkillChangeWin"] = PetSkillChangeWin