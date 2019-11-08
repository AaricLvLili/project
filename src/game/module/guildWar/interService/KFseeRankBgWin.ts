/**跨服争霸中查看排名主view*/
class KFseeRankBgWin extends BaseEuiPanel implements ICommonWindow{
	public static LAYER_LEVEL = LayerManager.UI_Main

	private commonWindowBg: CommonWindowBg

	public constructor() {
		super()
		this.skinName = "GuildWarRewardSkin"
	}

	public open(...param: any[]) {
		this.addPanelList()
		this.commonWindowBg.OnAdded(this, param && param[0] || 0)
	}

	public close() {
		this.commonWindowBg.OnRemoved()
	}

	addPanelList() {
		this.commonWindowBg.AddChildStack(new KFseeGuildRankPanel)
		this.commonWindowBg.AddChildStack(new KFseePersonalInteRankPanel) 
	}

	OnOpenIndex?(openIndex: number): boolean {
		return true
	}
}
window["KFseeRankBgWin"]=KFseeRankBgWin