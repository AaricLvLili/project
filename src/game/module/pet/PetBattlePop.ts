class PetBattlePop extends BaseEuiPanel {
	public constructor() {
		super()
		this.skinName = "PetBattlePopSkin";
	}
	public item1: PetBattlePopItem;
	public item2: PetBattlePopItem;
	public item3: PetBattlePopItem;
	public m_Lan1: eui.Label;

	public createChildren() {
		super.createChildren();
		this.m_Lan1.text = GlobalConfig.jifengTiaoyueLg.st101849;
		this.item1.numPoint = 0;
		this.item2.numPoint = 1;
		this.item3.numPoint = 2;
	}
	initUI() {
		super.initUI();
	}
	open(...param: any[]) {
		this.m_bg.init(`PetBattlePop`, GlobalConfig.jifengTiaoyueLg.st101162)
		MessageCenter.ins().addListener(PetEvt.PET_DATAUPDATE_MSG, this._updateData, this);
		this._updateView()
		this.checkGuide();
	}
	private _updateView(): void {
		let petModel = PetModel.getInstance;
		let petData = petModel.getNowSelectPetData();

		let list = PetModel.getInstance.battlePetList
		for (let i = 0; i < list.length; i++) {
			let item = this[`item${i + 1}`] as PetBattlePopItem
			item.init(i, petData.petid, petModel.battlePetList[i])
		}
	}
	private _updateData(id: number): void {
		this.checkGuideEnd();
		if (id == null) {
			return
		}
		this._updateView()
	}
	close() {
		this.item1.release()
		this.item2.release()
		this.item3.release()
		MessageCenter.ins().removeListener(PetEvt.PET_DATAUPDATE_MSG, this._updateData, this);
		this.item1.m_PetBattleBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onClick, this);
	}
	public checkGuide() {
		let petModel = PetModel.getInstance;
		if (petModel.checkGuideBattle() && petModel.selectIndex == petModel.guidePeiId && Setting.currPart == 17 && Setting.currStep == 1) {
			this.item1.m_PetBattleBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClick, this);
			GuideUtils.ins().show(this.item1.m_PetBattleBtn, 17, 1);
		}
	}

	public checkGuideEnd() {
		let petModel = PetModel.getInstance;
		if (petModel.selectIndex == petModel.guidePeiId && Setting.currPart == 17 && Setting.currStep == 2) {
			this.m_bg.closeButtomBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClickEnd, this);
			GuideUtils.ins().show(this.m_bg.closeButtomBtn, 17, 2);
		}
	}

	private onClick() {
		GuideUtils.ins().next(this.item1.m_PetBattleBtn);
		this.item1.m_PetBattleBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onClick, this);
	}

	private onClickEnd() {
		GuideUtils.ins().next(this.m_bg.closeButtomBtn);
		this.m_bg.closeButtomBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onClickEnd, this);
		MessageCenter.ins().dispatch(PetEvt.PET_GUIDE_MSG_END);
	}

}

ViewManager.ins().reg(PetBattlePop, LayerManager.UI_Popup);
window["PetBattlePop"] = PetBattlePop