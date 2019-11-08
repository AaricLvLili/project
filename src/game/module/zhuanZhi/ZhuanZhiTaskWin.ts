
class ZhuanZhiTaskWin extends BaseEuiPanel implements ICommonWindow {
	public constructor() {
		super();
		this.skinName = "MainWinSkin";
	}

	public viewStack: eui.ViewStack;
	private commonWindowBg: CommonWindowBg
	public zhuanZhiTaskPane1: ZhuanZhiTaskPane;
	public zhuanZhiTaskPane2: ZhuanZhiTaskPane;
	public zhuanZhiTaskPane3: ZhuanZhiTaskPane;

	initUI() {
		super.initUI()
		this.zhuanZhiTaskPane1 = new ZhuanZhiTaskPane();
		this.zhuanZhiTaskPane1.zsLv = 1;
		this.zhuanZhiTaskPane1.name = GlobalConfig.jifengTiaoyueLg.st101947;
		this.commonWindowBg.AddChildStack(this.zhuanZhiTaskPane1);

		this.zhuanZhiTaskPane2 = new ZhuanZhiTaskPane();
		this.zhuanZhiTaskPane2.zsLv = 2;
		this.zhuanZhiTaskPane2.name = GlobalConfig.jifengTiaoyueLg.st101948;
		this.commonWindowBg.AddChildStack(this.zhuanZhiTaskPane2);

		this.zhuanZhiTaskPane3 = new ZhuanZhiTaskPane();
		this.zhuanZhiTaskPane3.zsLv = 3;
		this.zhuanZhiTaskPane3.name = GlobalConfig.jifengTiaoyueLg.st101949;
		this.commonWindowBg.AddChildStack(this.zhuanZhiTaskPane3);
	};

	destoryView() {
		super.destoryView()
	};

	public open(...param: any[]) {
		this.commonWindowBg.OnAdded(this, param ? param[0] : 0)
		this.updateRedPoint();
	};

	public close() {
		this.commonWindowBg.OnRemoved()
		this.zhuanZhiTaskPane1.release();
		this.zhuanZhiTaskPane2.release();
		this.zhuanZhiTaskPane3.release();
	}

	public updateRedPoint() {

	}

	onTap(e) {
		ViewManager.ins().close(this);
	};

	public static openCheck() {
		return true;
	};

	OnBackClick(clickType: number): number {
		return 0
	}

	OnOpenIndex(openIndex: number): boolean {
		return true
	}

	UpdateContent(): void {

	}
}
ViewManager.ins().reg(ZhuanZhiTaskWin, LayerManager.UI_Main);

window["ZhuanZhiTaskWin"] = ZhuanZhiTaskWin