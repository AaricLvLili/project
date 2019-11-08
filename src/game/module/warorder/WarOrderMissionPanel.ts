class WarOrderMissionPanel extends BaseView implements ICommonWindowTitle {
	windowTitleIconName?: string;
	public constructor(data?: any) {
		super();
		this.name = GlobalConfig.jifengTiaoyueLg.st100975;
		this.windowTitleIconName = GlobalConfig.jifengTiaoyueLg.st102071;
		this.skinName = "WarOrderMissionPanelSkin";
		this.touchEnabled = false;
	}

	public m_Lan0: eui.Label;
	public m_Lan1: eui.Label;
	public m_BuyLvBtn: eui.Button;
	public m_WarOrderJinJieBtn: eui.Button;
	public m_ExpBtn: eui.Button;
	public m_LvLab: eui.Label;
	public m_ExpBar: eui.ProgressBar;
	public m_List: eui.List;
	public m_Btn1: eui.ToggleButton;
	public m_Btn2: eui.ToggleButton;
	public m_Btn3: eui.ToggleButton;
	public m_BtnList: eui.List;

	private listData: eui.ArrayCollection;
	private btnListData: eui.ArrayCollection;
	public m_Scroller: eui.Scroller;

	protected childrenCreated() {
		super.childrenCreated();
		this.m_BuyLvBtn.label = GlobalConfig.jifengTiaoyueLg.st102073;
		this.m_WarOrderJinJieBtn.label = GlobalConfig.jifengTiaoyueLg.st102074;
		this.m_List.itemRenderer = WarOrderMissionItem;
		this.m_BtnList.itemRenderer = WarOrderBtn;
		this.listData = new eui.ArrayCollection();
		this.btnListData = new eui.ArrayCollection();
		this.m_List.dataProvider = this.listData;
		this.m_BtnList.dataProvider = this.btnListData;
		this.m_Lan1.text = GlobalConfig.jifengTiaoyueLg.st102088;
	};
	private addViewEvent() {
		this.AddClick(this.m_BuyLvBtn, this.onClickBuyBtn);
		this.AddClick(this.m_WarOrderJinJieBtn, this.onClickJinJieBtn);
		this.AddClick(this.m_ExpBtn, this.onClickExpBtn);
		this.observe(WarOrderEvt.WARORDEREVT_DATAUPDATE_MSG, this.initData);
		this.observe(WarOrderEvt.WARORDEREVT_DATAUPDATEMISSIONTYPE_MSG, this.changeMissionType);
	}
	private removeEvent() {
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
		let warOrderModel = WarOrderModel.getInstance;
		this.setTopData();
		this.btnListData.replaceAll([1, 2, 3])
		let config = GlobalConfig.ins("TokenTaskConfig")[warOrderModel.showMissionType];
		let listId = [];
		let dic = warOrderModel.missionDic.get(warOrderModel.showMissionType);
		if (dic) {
			let dicData = dic.values;
			for (var i = 0; i < dicData.length; i++) {
				let id = dicData[i].id;
				let missionData = dic.get(id);
				let wight = missionData.state + 10;
				if (missionData.state == 1) {
					wight = 1;
				}
				let needData = { id: id, state: wight }
				listId.push(needData)
			}
		}
		listId.sort(this.sorLvUp)
		this.listData.replaceAll(listId);
	}

	private changeMissionType() {
		this.m_Scroller.stopAnimation();
		egret.setTimeout(function () {
			if (this.m_Scroller.viewport)
				this.m_Scroller.viewport.scrollV = 0;
		}, this, 100)

		this.initData();
	}

	private setTopData() {
		let warOrderModel = WarOrderModel.getInstance;
		this.m_ExpBtn["redPoint"].visible = warOrderModel.checkCanGetExpBag();
		let tokenBaseConfig = GlobalConfig.ins("TokenBaseConfig")[warOrderModel.mainId];
		if (tokenBaseConfig) {
			this.m_Lan0.text = tokenBaseConfig.activityTimeTips;
		}
		this.m_LvLab.text = warOrderModel.lv + "";
		this.m_ExpBar.value = warOrderModel.exp;
		this.m_ExpBar.maximum = warOrderModel.maxExp;
	}
	private onClickBuyBtn() {
		let warOrderModel = WarOrderModel.getInstance;
		if (warOrderModel.isLvMax()) {
			UserTips.ins().showTips(GlobalConfig.jifengTiaoyueLg.st102077)
		} else {
			ViewManager.ins().open(WarOrderLvUpWin);
		}

	}
	private onClickJinJieBtn() {
		ViewManager.ins().open(WarOrderJinJieWin);
	}
	private onClickExpBtn() {
		let warOrderModel = WarOrderModel.getInstance;
		if (!warOrderModel.isUpWarOrder) {
			ViewManager.ins().open(WarOrderJinJieWin);
			return
		}
		if (warOrderModel.checkCanGetExpBag()) {
			WarOrderSproto.ins().sendGetExpBag();
		} else {
			UserTips.ins().showTips(GlobalConfig.jifengTiaoyueLg.st102076)
		}
	}

	/**关联排序 */
	private sorLvUp(item1: { state: number }, item2: { state: number }): number {
		return item1.state - item2.state;
	}
	UpdateContent(): void { }

}
window["WarOrderMissionPanel"] = WarOrderMissionPanel