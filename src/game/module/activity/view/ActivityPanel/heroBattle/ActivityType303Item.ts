class ActivityType303Item extends eui.ItemRenderer {
	public constructor() {
		super();
		this.skinName = "Activity303ItemSkin";
	}
	public m_ItemList: eui.List;
	public m_LevelLab: eui.Label;
	public m_NameLab: eui.Label;
	public m_Bg: eui.Image;
	public m_Head: eui.Image;
	public m_CompImg: eui.Image;

	private itemListData: eui.ArrayCollection;
	public m_SelectImg: eui.Image;

	public createChildren() {
		super.createChildren();
		this.m_ItemList.itemRenderer = ItemBase;
		this.itemListData = new eui.ArrayCollection();
		this.m_ItemList.dataProvider = this.itemListData;
		this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClick, this);
	}

	public dataChanged() {
		super.dataChanged();
		let data = this.data;
		this.m_LevelLab.text = LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st100390, [(this.itemIndex + 1)]);
		var activityData = <ActivityType303Data>GameGlobal.activityData[303];
		this.itemListData.removeAll();
		this.itemListData.replaceAll(data.price);
		let isCanBattle = activityData.isCanBattle(data.index);
		if (isCanBattle == battleType303.TYPE3) {
			this.m_CompImg.visible = true;
		} else {
			this.m_CompImg.visible = false;
		}
		if (this.itemIndex == ActivityType303Panel.selectIndex) {
			this.m_SelectImg.visible = true;
		} else {
			this.m_SelectImg.visible = false;
		}
	}

	private onClick() {
		ActivityType303Panel.selectIndex = this.itemIndex;
		MessageCenter.ins().dispatch(MessageDef.UPDATE_ACTIVITY_PANEL);
	}

}
window["ActivityType303Item"] = ActivityType303Item