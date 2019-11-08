/**跨服上届战况主view*/
class KFlastFightingBgWin extends BaseEuiPanel implements ICommonWindow
{
	public static LAYER_LEVEL = LayerManager.UI_Main
	private commonWindowBg: CommonWindowBg
	public constructor() 
	{
		super();
	}

	public initUI() {
		super.initUI();
		this.skinName = "KFlastFightingBgSkin";
		this.commonWindowBg.AddChildStack(new KFlastFighting2Panel());
		this.commonWindowBg.AddChildStack(new KFlastFighting1Panel());
	};

	public open(...param: any[]) {
		this.commonWindowBg.OnAdded(this)
	}

	public close() {
		this.commonWindowBg.OnRemoved()
	}

	public OnOpenIndex?(openIndex: number): boolean {
		return true
	}
}
window["KFlastFightingBgWin"]=KFlastFightingBgWin