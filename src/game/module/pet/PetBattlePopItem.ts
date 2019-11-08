class PetBattlePopItem extends eui.Component {
	public constructor() {
		super()
		this.skinName = "PetBattlePopItemSkin";
	}

	public m_PetBattleBtn: eui.Button;
	public m_AnimGroup: eui.Group;
	public m_PetName: eui.Label;
	public m_TopImg: eui.Image;
	public m_MainImg: eui.Image;
	public m_TipsTxt: eui.Label;

	private m_nameBg: eui.Image
	private _mc: MovieClip
	private _selectId: number
	private _curId: number
	private _index: number
	private isOpen: boolean;

	public numPoint: number;
	public createChildren() {
		super.createChildren();
		this.m_PetBattleBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onBattle, this);
		this.touchEnabled = false;
		this.m_AnimGroup.touchEnabled = false;
		this.m_AnimGroup.touchChildren = false;
	}

	public init(...param: any[]) {
		this._index = param[0];
		this._selectId = param[1];
		this._curId = param[2];
		this._updateView()
	}
	private _updateView(): void {
		// let len = SubRoles.ins().subRolesLen
		let isOpen = true;	//没有角色限制默认true
		if (this.numPoint > 0) {
			let prepare = GlobalConfig.ins("PetBasicConfig").prepare;
			let need = prepare[this.numPoint - 1];
			if (need.type == 1) {
				let playerlv = GameLogic.ins().actorModel.level;
				if (playerlv >= need.limit) {
					isOpen = true;
				} else {
					isOpen = false;
					this.m_TipsTxt.text = LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st101963, [need.limit]);
				}

			} else if (need.type == 2) {
				let playerzs = UserZs.ins() ? UserZs.ins().lv : 0;
				if (playerzs >= need.limit) {
					isOpen = true;
				} else {
					isOpen = false;
					this.m_TipsTxt.text = LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st101964, [need.limit]);
				}
			}
		}
		this.m_nameBg.visible = false
		this.m_TipsTxt.visible = !isOpen
		this.isOpen = isOpen;
		if (isOpen) {
			this.m_PetBattleBtn.visible = true;
			if (this._curId <= 0) {
				this.m_PetBattleBtn.label = GlobalConfig.jifengTiaoyueLg.st101164;
			} else if (this._curId == this._selectId) {
				this.m_PetBattleBtn.label = GlobalConfig.jifengTiaoyueLg.st100313;
			} else {
				this.m_PetBattleBtn.label = GlobalConfig.jifengTiaoyueLg.st101165
			}
		} else {
			this.m_PetBattleBtn.visible = false;
			// this.m_PetBattleBtn.label = GlobalConfig.languageConfig.st101166
		}
		let petConfig = GlobalConfig.ins("PetConfig")[this._curId]
		this.m_TopImg.source = `comp_96_49_${this._index + 1}_png`
		if (isOpen && petConfig && this._curId != 0) {
			this.m_PetName.text = petConfig.name
			this.initMc();
			this._mc.loadUrl(ResDataPath.GetMonsterBodyPath(petConfig.avatar + "_3" + EntityAction.STAND), true, -1);
			this._mc.visible = true
			this.m_nameBg.visible = true
			this.m_MainImg.visible = false
		} else {
			this.initMc();
			this._mc.visible = false
			this.m_PetName.text = ''
			this.m_MainImg.visible = true
		}
	}



	public release() {
		DisplayUtils.dispose(this._mc)
		this._mc = null;
	}

	private onBattle() {
		if (this.isOpen) {
			this._goBattle()
		}
		// else {
		// 	ViewManager.ins().open(NewRoleWin)
		// 	ViewManager.ins().close(PetBattlePop)
		// }
	}
	private _goBattle(): void {
		let petModel = PetModel.getInstance;
		let petData = petModel.getNowSelectPetData();
		if (petModel.isAttachPet(this._selectId)) {
			WarnWin.show(GlobalConfig.jifengTiaoyueLg.st101167,
				function () { PetSproto.ins().sendFightPet(petData.petid, this._index); },
				this)
		} else
			PetSproto.ins().sendFightPet(petData.petid, this._index);
	}

	private initMc() {
		if (!this._mc) {
			this._mc = new MovieClip
			this.m_AnimGroup.addChild(this._mc);
			this._mc.x = this.m_AnimGroup.width / 2;
			this._mc.y = this.m_AnimGroup.height / 2;
			this._mc.touchEnabled = false;
		}
	}
}
window["PetBattlePopItem"] = PetBattlePopItem