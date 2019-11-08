class PetSmeltSelectPanel extends BaseView implements ICommonWindowTitle {
	windowTitleIconName?: string;
	public constructor(data?: any) {
		super();
		this.name = GlobalConfig.jifengTiaoyueLg.st101111;
		this.windowTitleIconName = GlobalConfig.jifengTiaoyueLg.st101111;
		this.skinName = "PetSmeltSelectPanelSkin";
		this.touchEnabled = false;
	}
	public m_MainBtn: eui.Button;
	public m_Scroller: eui.Scroller;
	public m_List: eui.List;
	public m_RBox: eui.CheckBox;
	public m_SRBox: eui.CheckBox;
	public m_SSRBox: eui.CheckBox;
	public m_SSSRBox: eui.CheckBox;
	public m_SSSSRBox: eui.CheckBox;
	public m_OnGridNum: eui.Label;
	public m_BoxGroup: eui.Group;


	private listData: eui.ArrayCollection;

	protected childrenCreated() {
		super.childrenCreated();
		this.m_List.itemRenderer = PetSmeltSelectItem;
		this.listData = new eui.ArrayCollection();
		this.m_List.dataProvider = this.listData;
	};
	private addViewEvent() {
		this.AddClick(this.m_RBox, this.initData);
		this.AddClick(this.m_SRBox, this.initData);
		this.AddClick(this.m_SSRBox, this.initData);
		this.AddClick(this.m_SSSRBox, this.initData);
		this.AddClick(this.m_SSSSRBox, this.initData);
		this.observe(PetEvt.PET_SMELTSELECT_MSG, this.initData);
	}
	public open() {
		this.addViewEvent();
		this.initData();
	};
	public close() {
	};

	public release() {
		let petModel: PetModel = PetModel.getInstance;
		petModel.selectSmeltData.clear();
		let len = this.m_List.numChildren;
		for (var i = 0; i < len; i++) {
			let child = this.m_List.getChildAt(i);
			if (child && child instanceof PetSmeltSelectItem) {
				child.release();
			}
		}
	}



	private initData() {
		this.onChangeData();
		let petModel: PetModel = PetModel.getInstance;
		let petItemData = petModel.selectSmeltData.values;
		// if (petItemData.length != this.listData.source.length) {
		// 	this.m_Scroller.viewport.scrollV = 0;
		// }
		this.listData.removeAll();
		this.listData.replaceAll(petItemData);
		this.listData.refresh();
	}
	private onChangeData() {
		let petModel: PetModel = PetModel.getInstance;
		let petItemData: ItemData[] = petModel.getAllPetItme();
		let selectNum: number = 0;
		let isSelectTager: boolean = false;
		for (var i = 0; i < this.m_BoxGroup.numChildren; i++) {
			let child = this.m_BoxGroup.getChildAt(i);
			if (child instanceof eui.CheckBox) {
				if (child.selected == true) {
					selectNum += 1;
				}
			}
		}
		this.setSRBox(this.m_RBox, 1);
		this.setSRBox(this.m_SRBox, 2);
		this.setSRBox(this.m_SSRBox, 3);
		this.setSRBox(this.m_SSSRBox, 4);
		this.setSRBox(this.m_SSSSRBox, 5);
		if (selectNum == 0 || selectNum == 5) {
			this.setAllData();
		}
	}

	private setSRBox(box: eui.CheckBox, quality: number) {
		let petModel: PetModel = PetModel.getInstance;
		let petItemData: ItemData[] = petModel.getAllPetItme();
		if (box.selected) {
			for (var i = 0; i < petItemData.length; i++) {
				if (petItemData[i].itemConfig.quality == quality) {
					petModel.selectSmeltData.set(petItemData[i].handle, petItemData[i]);
				}
			}
		} else {
			for (var i = 0; i < petItemData.length; i++) {
				if (petItemData[i].itemConfig.quality == quality) {
					petModel.selectSmeltData.remove(petItemData[i].handle);
				}
			}
		}
	}
	private setAllData() {
		let petModel: PetModel = PetModel.getInstance;
		let petItemData: ItemData[] = petModel.getAllPetItme();
		petModel.selectSmeltData.clear();
		for (var i = 0; i < petItemData.length; i++) {
			if (!petItemData[i]["smeltSelectNum"]) {
				petItemData[i]["smeltSelectNum"] = 1;
			}
			petModel.selectSmeltData.set(petItemData[i].handle, petItemData[i]);
		}
	}

	UpdateContent(): void {

	}

}
window["PetSmeltSelectPanel"] = PetSmeltSelectPanel