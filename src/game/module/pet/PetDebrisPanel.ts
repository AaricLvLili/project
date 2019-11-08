class PetDebrisPanel extends BaseView implements ICommonWindowTitle {
	windowTitleIconName?: string;
	// mWindowHelpId = 31;
	public constructor(data?: any) {
		super();
		this.name = GlobalConfig.jifengTiaoyueLg.st101123;
		this.windowTitleIconName = GlobalConfig.jifengTiaoyueLg.st101124;
		this.skinName = "PetDebrisPanelSkin";
		this.touchEnabled = false;
	}

	public m_Scroller: eui.Scroller;
	public m_List: eui.List;
	public m_BtnScroller: eui.Scroller;
	public m_BtnList: eui.List;

	private listData: eui.ArrayCollection;
	private btnListData: eui.ArrayCollection;

	private petDebrisBtnIndex: number = 1;

	protected childrenCreated() {
		super.childrenCreated();
		this.m_List.itemRenderer = PetDebrisItem;
		this.listData = new eui.ArrayCollection();
		this.m_List.dataProvider = this.listData;

		this.m_BtnList.itemRenderer = PetDebrisBtnItem;
		this.btnListData = new eui.ArrayCollection();
		this.m_BtnList.dataProvider = this.btnListData;
	};
	private addViewEvent() {
		MessageCenter.ins().addListener(PetEvt.PET_DEBRIS_MSG, this.initData, this);
	}
	private removeEvent() {
		MessageCenter.ins().removeListener(PetEvt.PET_DEBRIS_MSG, this.initData, this);
	}

	public open() {
		this.addViewEvent();
		this.initData();
	};
	public close() {
		this.removeEvent();
	};

	public release() {
		this.removeEvent();
	}

	private initData() {
		let petModel: PetModel = PetModel.getInstance;

		if (this.petDebrisBtnIndex != petModel.petDebrisBtnIndex) {
			this.petDebrisBtnIndex = petModel.petDebrisBtnIndex;
			this.m_Scroller.stopAnimation();
			if (this.m_Scroller && this.m_Scroller.viewport) {
				this.m_Scroller.viewport.scrollV = 0;
			}
			egret.setTimeout(function () {
				if (this.m_Scroller && this.m_Scroller.viewport) {
					this.m_Scroller.viewport.scrollV = 0;
				}
			}, this, 50);
		}
		let debrisDataIdList = [];
		let cof = GlobalConfig.ins("PetComposeConfig");
		let itemConfig = GlobalConfig.ins("ItemConfig");
		for (let key in cof) {
			let item = itemConfig[key];
			if (item.type == ItemType.TYPE15 && item.quality == (petModel.petDebrisBtnIndex + 1)) {
				let petComposeConfig = GlobalConfig.ins("PetComposeConfig")[item.id];
				let itemDebrisCount = UserBag.ins().getBagGoodsCountById(0, item.id);
				let weight = item.id;
				if (itemDebrisCount >= petComposeConfig.count) {
					weight = item.id + 10000;
				}
				let newlistdata = { id: item.id, weight: weight };
				debrisDataIdList.push(newlistdata);
			}
		}
		debrisDataIdList.sort(this.sorLvUp);
		let sorIdList = [];
		for (var i = 0; i < debrisDataIdList.length; i++) {
			sorIdList.push(debrisDataIdList[i].id);
		}
		this.listData.replaceAll(sorIdList);
		let list = [2, 3, 4, 5];
		this.btnListData.replaceAll(list);
	}

	private sorLvUp(item1: { weight: number }, item2: { weight: number }): number {
		return item2.weight - item1.weight;
	}



	UpdateContent(): void {

	}

}
window["PetDebrisPanel"] = PetDebrisPanel