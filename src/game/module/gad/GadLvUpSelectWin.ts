class GadLvUpSelectWin extends BaseEuiPanel {
	public constructor() {
		super()
		this.skinName = "GadLvUpSelectWinSkin";
	}
	public m_MainBtn: eui.Button;
	public m_Scroller: eui.Scroller;
	public m_List: eui.List;
	public m_TogGroup: eui.Group;
	public m_LvTog: eui.ToggleButton;
	public m_StarTog: eui.ToggleButton;
	public m_PointTog: eui.ToggleButton;
	public m_SortGroup: eui.Group;
	public m_SortImg: eui.Image;
	public m_SortLab: eui.Label;
	public m_SelectNumLab: eui.Label;
	public m_AllAddBtn: eui.Button;


	private listData: eui.ArrayCollection;

	private isUPSort: boolean = false;

	public m_Lan1: eui.Label;


	public createChildren() {
		super.createChildren();
		this.m_List.itemRenderer = GadLvUpSelectItem;
		this.listData = new eui.ArrayCollection();
		this.m_List.dataProvider = this.listData;
		for (var i = 0; i < this.m_TogGroup.numChildren; i++) {
			let child = this.m_TogGroup.getChildAt(i);
			if (child && child instanceof eui.ToggleButton) {
				if (child.selected == true) {
					child.touchEnabled = false;
				}
			}
		}
		this.m_LvTog.label = GlobalConfig.jifengTiaoyueLg.st100333;
		this.m_StarTog.label = GlobalConfig.jifengTiaoyueLg.st100334;
		this.m_PointTog.label = GlobalConfig.jifengTiaoyueLg.st100335;
		this.m_Lan1.text = GlobalConfig.jifengTiaoyueLg.st100337;
		this.m_MainBtn.label = GlobalConfig.jifengTiaoyueLg.st100040;
		this.m_AllAddBtn.label = GlobalConfig.jifengTiaoyueLg.st100338;
		this.m_bg.init(`GadLvUpSelectWin`, GlobalConfig.jifengTiaoyueLg.st100336);
	}
	initUI() {
		super.initUI();
		this.m_SortLab.text = GlobalConfig.jifengTiaoyueLg.st100332;
	}
	open(...param: any[]) {
		this.addViewEvent();
		this.setData();
	}
	close() {
		this.release();
		GameGlobal.MessageCenter.dispatch(GadEvent.GAD_SURESELECT_DATAUPDATE_MSG);
	}
	public release() {
		this.removeViewEvent();
	}
	private addViewEvent() {
		this.observe(GadEvent.GAD_SELECT_DATAUPDATE_MSG, this.changeSelect);
		this.AddClick(this.m_MainBtn, this.onClickMainBtn);
		this.AddClick(this.m_LvTog, this.onClickTog);
		this.AddClick(this.m_StarTog, this.onClickTog);
		this.AddClick(this.m_PointTog, this.onClickTog);
		this.AddClick(this.m_SortGroup, this.onClickSort);
		this.AddClick(this.m_AllAddBtn, this.onClickAddAll);
	}
	private removeViewEvent() {
	}
	private setData() {
		let gadModel = GadModel.getInstance;
		let gadBagDatas: GadBagData[] = gadModel.gadBagDic.values;
		if (this.m_LvTog.selected == true) {
			if (this.isUPSort == true) {
				gadBagDatas.sort(this.sorUpLevel);
			} else {
				gadBagDatas.sort(this.sorDownLevel);
			}
		} else if (this.m_StarTog.selected == true) {
			if (this.isUPSort == true) {
				gadBagDatas.sort(this.sorUpStar);
			} else {
				gadBagDatas.sort(this.sorDownStar);
			}
		} else if (this.m_PointTog.selected == true) {
			if (this.isUPSort == true) {
				gadBagDatas.sort(this.sorUpSlot);
			} else {
				gadBagDatas.sort(this.sorDownSlot);
			}
		}
		this.listData.replaceAll(gadBagDatas);
		let selectNum = gadModel.lvUpSelectData.values.length;
		this.m_SelectNumLab.text = GlobalConfig.jifengTiaoyueLg.st100330 + selectNum + "/20";
		this.checkGuide();
	}

	private onClickMainBtn() {
		this.onClickClose();
	}
	private onClickTog(e: egret.TouchEvent) {
		for (var i = 0; i < this.m_TogGroup.numChildren; i++) {
			let child = this.m_TogGroup.getChildAt(i);
			if (child && child instanceof eui.ToggleButton) {
				if (child.selected == true) {
					child.touchEnabled = true;
					child.selected = false
				}
			}
		}
		let btn: eui.ToggleButton = e.currentTarget;
		btn.touchEnabled = false;
		btn.selected = true;
		this.setData();
	}

	private onClickSort() {
		this.isUPSort = !this.isUPSort;
		if (this.isUPSort) {
			this.m_SortImg.source = "rect_btn_39_28_png";
			this.m_SortLab.text = GlobalConfig.jifengTiaoyueLg.st100331;
		} else {
			this.m_SortImg.source = "rect_btn_39_28_02_png";
			this.m_SortLab.text = GlobalConfig.jifengTiaoyueLg.st100332;
		}
		this.setData();
	}
	private onClickClose() {
		ViewManager.ins().close(this);
	}

	/**关联排序 */
	private sorUpLevel(item1: { level: number }, item2: { level: number }): number {
		return item1.level - item2.level;
	}
	/**关联排序 */
	private sorDownLevel(item1: { level: number }, item2: { level: number }): number {
		return item2.level - item1.level;
	}

	/**关联排序 */
	private sorUpStar(item1: { star: number }, item2: { star: number }): number {
		return item1.star - item2.star;
	}
	/**关联排序 */
	private sorDownStar(item1: { star: number }, item2: { star: number }): number {
		return item2.star - item1.star;
	}

	/**关联排序 */
	private sorUpSlot(item1: { slot: number }, item2: { slot: number }): number {
		return item1.slot - item2.slot;
	}
	/**关联排序 */
	private sorDownSlot(item1: { slot: number }, item2: { slot: number }): number {
		return item2.slot - item1.slot;
	}

	private changeSelect() {
		let gadModel = GadModel.getInstance;
		let selectNum = gadModel.lvUpSelectData.values.length;
		this.m_SelectNumLab.text = GlobalConfig.jifengTiaoyueLg.st100330 + selectNum + "/20";
	}

	private onClickAddAll() {
		let gadModel = GadModel.getInstance;
		let gadBagDatas: GadBagData[] = this.listData.source;
		gadModel.lvUpSelectData.clear();
		let len = 20;
		if (gadBagDatas.length < 20) {
			len = gadBagDatas.length;
		}
		for (var i = 0; i < len; i++) {
			gadModel.lvUpSelectData.set(gadBagDatas[i].handle, gadBagDatas[i]);
		}
		this.setData();
	}

	private checkGuide() {
		if (Setting.currPart == 20 && Setting.currStep == 7) {
			GuideUtils.ins().show(this.m_AllAddBtn, 20, 7);
			this.m_AllAddBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.nextGuide, this, true, 10);
		} else if (Setting.currPart == 20 && Setting.currStep == 8) {
			GuideUtils.ins().show(this.m_MainBtn, 20, 8);
			this.m_MainBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.nextGuide2, this, true, 10);
		}
	}
	private nextGuide() {
		GuideUtils.ins().next(this.m_AllAddBtn);
		this.m_AllAddBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.nextGuide, this, true);
	}
	private nextGuide2() {
		GuideUtils.ins().next(this.m_MainBtn);
		this.m_MainBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.nextGuide2, this, true);
	}

}
ViewManager.ins().reg(GadLvUpSelectWin, LayerManager.UI_Popup);
window["GadLvUpSelectWin"] = GadLvUpSelectWin