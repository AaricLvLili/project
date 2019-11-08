class PetClimbTowerPanel extends BaseView implements ICommonWindowTitle {
	windowTitleIconName?: string;
	public constructor(data?: any) {
		super();
		this.name = GlobalConfig.jifengTiaoyueLg.st100364;
		this.windowTitleIconName = GlobalConfig.jifengTiaoyueLg.st100389;
		this.skinName = "PetClimbTowerSkin";
		this.touchEnabled = false;
	}
	public m_TitleLayerLab: eui.Label;
	public m_AnimGroup: eui.Group;
	public m_TitleLab: eui.Label;
	public m_AllBattleBtn: eui.Button;
	public m_BattleBtn: eui.Button;
	public m_VIPLab: eui.Label;
	public m_TopBattleLab: eui.Label;
	public m_ItemList: eui.List;
	public m_FirstItemList: eui.List;
	public m_ClimbProBox: ClimbProBox;

	public m_CompImg: eui.Image;

	private m_ListData: eui.ArrayCollection;

	private m_FirstListData: eui.ArrayCollection;

	public m_LeftImg: eui.Image;
	public m_RightImg: eui.Image;

	public m_NeedLab: eui.Label;

	public m_LockRankLab: eui.Label;

	public m_Lan1: eui.Label;
	public m_Lan2: eui.Label;

	protected childrenCreated() {
		super.childrenCreated();
		UIHelper.SetLinkStyleLabel(this.m_LockRankLab, GlobalConfig.jifengTiaoyueLg.st100381);
		this.m_ItemList.itemRenderer = ItemBase;
		this.m_ListData = new eui.ArrayCollection();
		this.m_ItemList.dataProvider = this.m_ListData;

		this.m_FirstItemList.itemRenderer = ItemBase;
		this.m_FirstListData = new eui.ArrayCollection();
		this.m_FirstItemList.dataProvider = this.m_FirstListData;

		this.m_AllBattleBtn.label = GlobalConfig.jifengTiaoyueLg.st100398;
		this.m_BattleBtn.label = GlobalConfig.jifengTiaoyueLg.st100046;
		this.m_Lan1.text = GlobalConfig.jifengTiaoyueLg.st100377;
		this.m_Lan2.text = GlobalConfig.jifengTiaoyueLg.st100399
	};
	private addViewEvent() {
		this.observe(ClimbTowerEvent.CLIMBPET_DATAUPDATE_MSG, this.initData);
		this.AddClick(this.m_AllBattleBtn, this.onClickAllBattle);
		this.AddClick(this.m_BattleBtn, this.onClickBattle);
		this.AddClick(this.m_LeftImg, this.onClickLeftImg);
		this.AddClick(this.m_RightImg, this.onClickRightImg);
		this.AddClick(this.m_LockRankLab, this.onClickRank);
	}
	private removeEvent() {
	}

	public open() {
		ClimbTowerSproto.ins().sendGetTowerInit(ClimbType.PET);
		this.addViewEvent();
		this.initData();
	};
	public close() {
		this.removeEvent();
	};

	public release() {
		for (var i = 0; i < this.m_AnimGroup.numChildren; i++) {
			let child = this.m_AnimGroup.getChildAt(i);
			if (child && child instanceof PetClimbAnim) {
				child.release();
			}
		}
		this.removeEvent();
		this.m_ClimbProBox.release();
	}

	private initData() {
		let climbTowerModel = ClimbTowerModel.getInstance;
		let data: Sproto.sc_tower_init_res_request = climbTowerModel.ClimbTowerPetData;
		let petTowerConfig = GlobalConfig.ins("PetTowerConfig")[climbTowerModel.petSelectIndex];
		this.m_BattleBtn.enabled = true;
		if (!data) {
			return;
		}
		if (petTowerConfig) {
			this.m_TitleLayerLab.text = petTowerConfig.layersTips + " " + LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st100386, [petTowerConfig.layersId]);
			this.m_TitleLab.text = LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st100390, [petTowerConfig.id]);
			let dic = climbTowerModel.climbPetLayerDic.get(petTowerConfig.layersId);
			for (var i = 0; i < 6; i++) {
				if (dic.values[i]) {
					let child = this.m_AnimGroup.getChildAt(i);
					if (child && child instanceof PetClimbAnim) {
						child.setData(dic.values[i]);
					}
				} else {
					let child = this.m_AnimGroup.getChildAt(i);
					if (child && child instanceof PetClimbAnim) {
						child.setData(null);
					}
				}
			}
			this.m_ListData.removeAll();
			this.m_ListData.replaceAll(petTowerConfig.sweepAward);
			this.m_ListData.refresh();
			this.m_FirstListData.removeAll();
			this.m_FirstListData.replaceAll(petTowerConfig.firstAward);
			this.m_FirstListData.refresh();
			if (petTowerConfig.id <= data.maxlevel) {
				this.m_CompImg.visible = true;
			} else {
				this.m_CompImg.visible = false;
			}
			let config = GlobalConfig.ins("PetTowerAwardConfig");
			if (config) {
				this.m_ClimbProBox.setData(ClimbType.PET);
			}
			let petTowerBaseConfig = GlobalConfig.ins("PetTowerBaseConfig");
			this.m_VIPLab.text = "VIP" + petTowerBaseConfig.openSweepLimit + GlobalConfig.jifengTiaoyueLg.st100391;
			if (UserVip.ins().lv >= petTowerBaseConfig.openSweepLimit) {
				this.m_VIPLab.text = GlobalConfig.jifengTiaoyueLg.st100392 + (1 - data.sweep) + "/" + 1;
			}
			if (petTowerConfig.id <= data.maxlevel + 1) {
				let isBattle = climbTowerModel.getIsBattle(data.pass, petTowerConfig.id);
				if (isBattle == true) {
					this.m_BattleBtn.enabled = true;
				} else {
					this.m_BattleBtn.enabled = false;
				}
			} else {
				this.m_BattleBtn.enabled = false;
			}
			this.m_TopBattleLab.text = LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st100393, [data.maxlevel]);
			this.initAttr();
			if (petTowerConfig.zsLv > 0) {
				this.m_NeedLab.text = LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st100394, [petTowerConfig.zsLv]) + petTowerConfig.lv + GlobalConfig.jifengTiaoyueLg.st100093;
				if (petTowerConfig.zsLv > GameLogic.ins().actorModel.zsLv) {
					this.m_BattleBtn.enabled = false;
				} else
					if (petTowerConfig.lv > GameLogic.ins().actorModel.level) {
						this.m_BattleBtn.enabled = false;
						return;
					}
			} else {
				this.m_NeedLab.text = LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st100395, [petTowerConfig.lv]);
				if (petTowerConfig.lv > GameLogic.ins().actorModel.level) {
					this.m_BattleBtn.enabled = false;
					return;
				}
			}

		}
	}

	private onClickAllBattle() {
		let petTowerBaseConfig = GlobalConfig.ins("PetTowerBaseConfig");
		let climbTowerModel = ClimbTowerModel.getInstance;
		let data: Sproto.sc_tower_init_res_request = climbTowerModel.ClimbTowerPetData;
		if (UserVip.ins().lv >= petTowerBaseConfig.openSweepLimit) {
			if ((1 - data.sweep) > 0) {
				ClimbTowerSproto.ins().sendGetSweep(ClimbType.PET);
			} else {
				UserTips.ins().showTips(GlobalConfig.jifengTiaoyueLg.st100396);
			}

		} else {
			UserTips.ins().showTips(LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st100397, [petTowerBaseConfig.openSweepLimit]));
		}
	}

	private onClickBattle() {
		let climbTowerModel = ClimbTowerModel.getInstance;
		ClimbTowerSproto.ins().sendTowerEnter(ClimbType.PET, climbTowerModel.petSelectIndex);
		ViewManager.ins().close(FbWin)
	}


	private initAttr() {
		let climbTowerModel = ClimbTowerModel.getInstance;
		let petTowerConfig = GlobalConfig.ins("PetTowerConfig")[climbTowerModel.petSelectIndex];
		if (petTowerConfig.layersId == 1) {
			this.m_LeftImg.visible = false;
		} else {
			this.m_LeftImg.visible = true;
		}
		let dic = climbTowerModel.climbPetLayerDic.get(petTowerConfig.layersId + 1);
		let maxPetTowerConfig = GlobalConfig.ins("PetTowerConfig")[climbTowerModel.ClimbTowerPetData.maxlevel + 1];
		if (!dic || !maxPetTowerConfig) {
			this.m_RightImg.visible = false;
		} else if (petTowerConfig.layersId > maxPetTowerConfig.layersId) {
			this.m_RightImg.visible = false;
		} else {
			this.m_RightImg.visible = true;
		}
	}


	private onClickLeftImg() {
		let climbTowerModel = ClimbTowerModel.getInstance;
		let petTowerConfig = GlobalConfig.ins("PetTowerConfig")[climbTowerModel.petSelectIndex];
		let dic = climbTowerModel.climbPetLayerDic.get(petTowerConfig.layersId - 1);
		climbTowerModel.petSelectIndex = dic.values[0].id;
		GameGlobal.MessageCenter.dispatch(ClimbTowerEvent.CLIMBPET_DATAUPDATE_MSG);
	}

	private onClickRightImg() {
		let climbTowerModel = ClimbTowerModel.getInstance;
		let petTowerConfig = GlobalConfig.ins("PetTowerConfig")[climbTowerModel.petSelectIndex];
		let dic = climbTowerModel.climbPetLayerDic.get(petTowerConfig.layersId + 1);
		climbTowerModel.petSelectIndex = dic.values[0].id;
		GameGlobal.MessageCenter.dispatch(ClimbTowerEvent.CLIMBPET_DATAUPDATE_MSG);
	}

	private onClickRank() {
		ViewManager.ins().open(ClimbRankWin, ClimbType.PET);
	}



	UpdateContent(): void {

	}

}
window["PetClimbTowerPanel"] = PetClimbTowerPanel