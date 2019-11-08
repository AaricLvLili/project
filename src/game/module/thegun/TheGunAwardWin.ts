class TheGunAwardWin extends BaseEuiPanel {
	public constructor() {
		super()
		this.skinName = "MountLvUpAwardWinSkin";
	}
	public m_Scroller: eui.Scroller;
	public m_List: eui.List;
	private m_ListData: eui.ArrayCollection;

	public createChildren() {
		super.createChildren();
		this.m_List.itemRenderer = TheGunAwardItem;
		this.m_ListData = new eui.ArrayCollection();
		this.m_List.dataProvider = this.m_ListData;
		this.m_bg.init(`TheGunAwardWin`, GlobalConfig.jifengTiaoyueLg.st102042);
	}
	initUI() {
		super.initUI();
	}
	open(...param: any[]) {
		this.addViewEvent();
		this.setData();
	}
	close() {
		this.release();
	}
	public release() {
		this.removeViewEvent();
	}
	private addViewEvent() {
		this.observe(TheGunEvt.THEGUN_AWARD_MSG, this.setData);
	}
	private removeViewEvent() {
	}
	private setData() {
		let theGunModel = TheGunModel.getInstance;
		let list = [];
		for (var i = 0; i < theGunModel.achieve.length; i++) {
			list.push(theGunModel.achieve[i]);
		}
		this.m_ListData.replaceAll(list);
	}


	private onClickClose() {
		ViewManager.ins().close(this);
	}
}

ViewManager.ins().reg(TheGunAwardWin, LayerManager.UI_Popup);
window["TheGunAwardWin"] = TheGunAwardWin