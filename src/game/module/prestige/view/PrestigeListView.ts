class PrestigeListView extends BaseEuiPanel {

    // 定义view对象的层级
    public static LAYER_LEVEL = LayerManager.UI_Popup

	private prestigeLevelConfig:any;

	private list: eui.List

	public constructor() {
		super()
		this.skinName = "PrestigeListViewSkin"
		this.list.itemRenderer = PrestigeListViewItem
	}

	open() {
		this.m_bg.init(`PrestigeListView`,GlobalConfig.jifengTiaoyueLg.st101258)
		if (this.prestigeLevelConfig == null)
			this.prestigeLevelConfig = GlobalConfig.ins("PrestigeLevelConfig");
		let config = this.prestigeLevelConfig;
		let list = []
		for (let key in config) {
			let data = config[key]
			let level = data.level
			if (!list[level]) {
				list.push({"id":level,"num":data.growUpNeed})
			}
		}
		this.list.dataProvider = new eui.ArrayCollection(list)
	}

	close() {
		
	}
	
}
window["PrestigeListView"]=PrestigeListView