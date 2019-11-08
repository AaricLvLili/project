class MountLvUpAwardWin extends BaseEuiPanel {
	public constructor() {
		super()
		this.skinName = "MountLvUpAwardWinSkin";
	}
	public m_Scroller: eui.Scroller;
	public m_List: eui.List;
	private m_ListData: eui.ArrayCollection;

	public createChildren() {
		super.createChildren();
		this.m_List.itemRenderer = MountLvUpAwardItem;
		this.m_ListData = new eui.ArrayCollection();
		this.m_List.dataProvider = this.m_ListData;
		this.m_bg.init(`MountLvUpAwardWin`, GlobalConfig.jifengTiaoyueLg.st100679);
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
		this.observe(MountEvt.MOUNT_AWARD_MSG, this.setData);
	}
	private removeViewEvent() {
	}
	private setData() {
		let mountModel = MountModel.getInstance;
		let list = [];
		for (var i = 0; i < mountModel.achieve.length; i++) {
			list.push(mountModel.achieve[i]);
		}
		this.m_ListData.replaceAll(list);
	}


	private onClickClose() {
		ViewManager.ins().close(this);
	}
}

ViewManager.ins().reg(MountLvUpAwardWin, LayerManager.UI_Popup);
window["MountLvUpAwardWin"] = MountLvUpAwardWin