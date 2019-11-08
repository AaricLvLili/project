class MountClimbTowerPanel extends BaseView implements ICommonWindowTitle {
	windowTitleIconName?: string;
	public constructor(data?: any) {
		super();
		this.name = GlobalConfig.jifengTiaoyueLg.st100365;
		this.windowTitleIconName = GlobalConfig.jifengTiaoyueLg.st100389;
		this.skinName = "MountClimbTowerSkin";
		this.touchEnabled = false;
	}
	public m_ClimbProBox: ClimbProBox;
	public m_AnimGroup: eui.Group;
	public m_Scroller: eui.Scroller;
	public m_List: eui.List;
	public m_AllBattleBtn: eui.Button;
	public m_BattleBtn: eui.Button;
	public m_VIPLab: eui.Label;
	public m_TopBattleLab: eui.Label;
	public m_LeftImg: eui.Image;
	public m_RightImg: eui.Image;
	public m_NeedLab: eui.Label;
	public m_LockRankLab: eui.Label;

	public m_TitleLab: eui.Label;
	public m_ItemList: eui.List;
	public m_FirstItemList: eui.List;
	public m_CompImg: eui.Image;


	private listData: eui.ArrayCollection;

	private m_ListData: eui.ArrayCollection;

	private m_FirstListData: eui.ArrayCollection;
	public m_Lan1: eui.Label;
	public m_Lan2: eui.Label;
	public m_Lan3: eui.Label;


	protected childrenCreated() {
		super.childrenCreated();
		UIHelper.SetLinkStyleLabel(this.m_LockRankLab, GlobalConfig.jifengTiaoyueLg.st100381);
		this.m_List.itemRenderer = MountClimbRankItem;
		this.listData = new eui.ArrayCollection();
		this.m_List.dataProvider = this.listData;

		this.m_ItemList.itemRenderer = ItemBase;
		this.m_ListData = new eui.ArrayCollection();
		this.m_ItemList.dataProvider = this.m_ListData;

		this.m_FirstItemList.itemRenderer = ItemBase;
		this.m_FirstListData = new eui.ArrayCollection();
		this.m_FirstItemList.dataProvider = this.m_FirstListData;
		this.m_Lan1.text = GlobalConfig.jifengTiaoyueLg.st100380;
		this.m_Lan2.text = GlobalConfig.jifengTiaoyueLg.st100377;
		this.m_Lan3.text = GlobalConfig.jifengTiaoyueLg.st100399;
		this.m_AllBattleBtn.label = GlobalConfig.jifengTiaoyueLg.st100398;
		this.m_BattleBtn.label = GlobalConfig.jifengTiaoyueLg.st100046;
	};
	private addViewEvent() {
		this.observe(ClimbTowerEvent.CLIMBMOUNT_DATAUPDATE_MSG, this.initData);
		this.AddClick(this.m_AllBattleBtn, this.onClickAllBattle);
		this.AddClick(this.m_BattleBtn, this.onClickBattle);
		this.AddClick(this.m_LeftImg, this.onClickLeftImg);
		this.AddClick(this.m_RightImg, this.onClickRightImg);
		this.AddClick(this.m_LockRankLab, this.onClickRank);
	}
	private removeEvent() {

	}

	public open() {
		ClimbTowerSproto.ins().sendGetTowerInit(ClimbType.MOUNT);
		this.addViewEvent();
	};
	public close() {
		this.removeEvent();
	};

	public release() {
		for (var i = 0; i < this.m_AnimGroup.numChildren; i++) {
			let child = this.m_AnimGroup.getChildAt(i);
			if (child && child instanceof MountClimbAnim) {
				child.release();
			}
		}
		this.removeEvent();
		this.m_ClimbProBox.release();
	}

	private initData() {
		let climbTowerModel = ClimbTowerModel.getInstance;
		let data: Sproto.sc_tower_init_res_request = climbTowerModel.ClimbTowerMountData;
		let mountTowerConfig = GlobalConfig.ins("MountsTowerConfig")[climbTowerModel.mountSelectIndex];
		if (!data) {
			return;
		}
		if (mountTowerConfig) {
			this.m_TitleLab.text = LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st100390, [mountTowerConfig.id]);
			let layersId = Math.ceil(mountTowerConfig.id / climbTowerModel.m_MountLayerNum);
			let dic = climbTowerModel.climbMountLayerDic.get(layersId);
			for (var i = 0; i < 3; i++) {
				if (dic.values[i]) {
					let child = this.m_AnimGroup.getChildAt(i);
					if (child && child instanceof MountClimbAnim) {
						child.setData(dic.values[i]);
					}
				} else {
					let child = this.m_AnimGroup.getChildAt(i);
					if (child && child instanceof MountClimbAnim) {
						child.setData(null);
					}
				}
			}
			this.m_ListData.removeAll();
			this.m_ListData.replaceAll(mountTowerConfig.sweepAward);
			this.m_ListData.refresh();
			this.m_FirstListData.removeAll();
			this.m_FirstListData.replaceAll(mountTowerConfig.firstAward);
			this.m_FirstListData.refresh();
			if (mountTowerConfig.id <= data.maxlevel) {
				this.m_CompImg.visible = true;
			} else {
				this.m_CompImg.visible = false;
			}
			this.m_ClimbProBox.setData(ClimbType.MOUNT);
			let mountTowerBaseConfig = GlobalConfig.ins("MountsTowerBaseConfig");
			this.m_VIPLab.text = "VIP" + mountTowerBaseConfig.openSweepLimit + GlobalConfig.jifengTiaoyueLg.st100391;
			if (UserVip.ins().lv >= mountTowerBaseConfig.openSweepLimit) {
				this.m_VIPLab.text = GlobalConfig.jifengTiaoyueLg.st100392 + (1 - data.sweep) + "/" + 1;
			}
			if (mountTowerConfig.id <= data.maxlevel + 1) {
				let isBattle = climbTowerModel.getIsBattle(data.pass, mountTowerConfig.id);
				if (isBattle == true) {
					this.m_BattleBtn.enabled = true;
				} else {
					this.m_BattleBtn.enabled = false;
				}
			} else {
				this.m_BattleBtn.enabled = false;
			}
			this.m_TopBattleLab.text = LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st100393, [data.maxlevel])
			this.initAttr();

			if (mountTowerConfig.zsLv > 0) {
				this.m_NeedLab.text = LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st100394, [mountTowerConfig.zsLv]) + mountTowerConfig.lv + GlobalConfig.jifengTiaoyueLg.st100093;
				if (mountTowerConfig.zsLv > GameLogic.ins().actorModel.zsLv) {
					this.m_BattleBtn.enabled = false;
				} else
					if (mountTowerConfig.lv > GameLogic.ins().actorModel.level) {
						this.m_BattleBtn.enabled = false;
					}
			} else {
				this.m_NeedLab.text = LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st100395, [mountTowerConfig.lv]);
				if (mountTowerConfig.lv > GameLogic.ins().actorModel.level) {
					this.m_BattleBtn.enabled = false;
				}
			}
			let rankdata: Sproto.tower_rank_data[] = []
			for (var i = 0; i < 3; i++) {
				let rank = data.ranks[i];
				if (rank) {
					rankdata.push(rank);
				}
			}
			this.listData.replaceAll(rankdata);

		}
	}

	private onClickAllBattle() {
		let mountTowerBaseConfig = GlobalConfig.ins("MountsTowerBaseConfig");
		let climbTowerModel = ClimbTowerModel.getInstance;
		let data: Sproto.sc_tower_init_res_request = climbTowerModel.ClimbTowerMountData;
		if (UserVip.ins().lv >= mountTowerBaseConfig.openSweepLimit) {
			if ((1 - data.sweep) > 0) {
				ClimbTowerSproto.ins().sendGetSweep(ClimbType.MOUNT);
			} else {
				UserTips.ins().showTips(GlobalConfig.jifengTiaoyueLg.st100396);
			}
		} else {
			UserTips.ins().showTips(LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st100397, [mountTowerBaseConfig.openSweepLimit]));
		}
	}

	private onClickBattle() {
		let climbTowerModel = ClimbTowerModel.getInstance;
		ClimbTowerSproto.ins().sendTowerEnter(ClimbType.MOUNT, climbTowerModel.mountSelectIndex);
		ViewManager.ins().close(FbWin)
	}


	private initAttr() {
		let climbTowerModel = ClimbTowerModel.getInstance;
		let mountTowerConfig = GlobalConfig.ins("MountsTowerConfig")[climbTowerModel.mountSelectIndex];
		let layersId = Math.ceil(mountTowerConfig.id / climbTowerModel.m_MountLayerNum);
		if (layersId == 1) {
			this.m_LeftImg.visible = false;
		} else {
			this.m_LeftImg.visible = true;
		}
		let maxMountTowerConfig = GlobalConfig.ins("MountsTowerConfig")[climbTowerModel.ClimbTowerMountData.maxlevel + 1];
		let maxLayersId = null;
		if (maxMountTowerConfig) {
			maxLayersId = Math.ceil(maxMountTowerConfig.id / climbTowerModel.m_MountLayerNum);
		}
		let dic = climbTowerModel.climbMountLayerDic.get(layersId + 1);
		if (!dic || maxLayersId == null) {
			this.m_RightImg.visible = false;
		} else if (layersId > maxLayersId) {
			this.m_RightImg.visible = false;
		} else {
			this.m_RightImg.visible = true;
		}
	}


	private onClickLeftImg() {
		let climbTowerModel = ClimbTowerModel.getInstance;
		let mountTowerConfig = GlobalConfig.ins("MountsTowerConfig")[climbTowerModel.mountSelectIndex];
		let layersId = Math.ceil(mountTowerConfig.id / climbTowerModel.m_MountLayerNum);
		let dic = climbTowerModel.climbMountLayerDic.get(layersId - 1);
		climbTowerModel.mountSelectIndex = dic.values[0].id;
		GameGlobal.MessageCenter.dispatch(ClimbTowerEvent.CLIMBMOUNT_DATAUPDATE_MSG);
	}

	private onClickRightImg() {
		let climbTowerModel = ClimbTowerModel.getInstance;
		let mountTowerConfig = GlobalConfig.ins("MountsTowerConfig")[climbTowerModel.mountSelectIndex];
		let layersId = Math.ceil(mountTowerConfig.id / climbTowerModel.m_MountLayerNum);
		let dic = climbTowerModel.climbMountLayerDic.get(layersId + 1);
		climbTowerModel.mountSelectIndex = dic.values[0].id;
		GameGlobal.MessageCenter.dispatch(ClimbTowerEvent.CLIMBMOUNT_DATAUPDATE_MSG);
	}

	private onClickRank() {
		ViewManager.ins().open(ClimbRankWin, ClimbType.MOUNT);
	}



	UpdateContent(): void {

	}

}
window["MountClimbTowerPanel"] = MountClimbTowerPanel