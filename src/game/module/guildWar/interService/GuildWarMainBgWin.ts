/**跨服战主View*/
class GuildWarMainBgWin extends BaseEuiPanel implements ICommonWindow{
	public constructor() {
		super();
	}

	public static LAYER_LEVEL = LayerManager.UI_Main;
	private commonWindowBg: CommonWindowBg;

	public initUI() {
		super.initUI();
		this.skinName = "MainWinSkin"; 
		this.commonWindowBg.AddChildStack(new GuildWarMainPanel());
		this.commonWindowBg.AddChildStack(new KFguildWarMainPanel());
	};

	public open(...param: any[]) {
		this.commonWindowBg.OnAdded(this, param[0] ? param[0] : 0);
	};

	public close() {
		this.commonWindowBg.OnRemoved();
	};

	public OnOpenIndex?(openIndex: number): boolean {
		return true
	}
	mWindowHelpId = null;
}

ViewManager.ins().reg(GuildWarMainBgWin, LayerManager.UI_Main);

window["GuildWarMainBgWin"]=GuildWarMainBgWin