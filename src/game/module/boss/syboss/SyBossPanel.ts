class SyBossPanel extends BaseView implements ICommonWindowTitle {
	windowTitleIconName?: string;
	public constructor(data?: any) {
		super();
		this.name = GlobalConfig.jifengTiaoyueLg.st100524;
		this.windowTitleIconName = GlobalConfig.jifengTiaoyueLg.st100524;
		this.skinName = "SyBossPanelSkin";
	}
	public m_SyBossAnim: SyBossAnim;
	public m_SeeBox: eui.CheckBox;
	public m_GetBossPlayer: eui.Label;
	public m_ItemList: eui.List;
	public m_List: eui.List;
	public m_NeedLab2: eui.Label;
	public m_NeedLab1: eui.Label;
	public m_MainBtn: eui.Button;
	public m_NeedImg2: eui.Image;
	public m_NeedImg1: eui.Image;
	private itemListData: eui.ArrayCollection;
	private listData: eui.ArrayCollection;

	private nowSelectId: number = 0;
	private nowSelectConfig: any;
	public m_Lan1: eui.Label;
	public m_Lan2: eui.Label;
	public m_Lan4: eui.Label;
	public m_Lan3: eui.Label;

	private sendMsgTime: number = 0;
	protected childrenCreated() {
		super.childrenCreated();
		this.m_ItemList.itemRenderer = ItemBase;
		this.itemListData = new eui.ArrayCollection();
		this.m_ItemList.dataProvider = this.itemListData;

		this.m_List.itemRenderer = SyBossItem;
		this.listData = new eui.ArrayCollection();
		this.m_List.dataProvider = this.listData;

		this.m_SeeBox.label = GlobalConfig.jifengTiaoyueLg.st100530;
		this.m_Lan1.text = GlobalConfig.jifengTiaoyueLg.st100531;
		this.m_Lan2.text = GlobalConfig.jifengTiaoyueLg.st100532;
		this.m_MainBtn.label = GlobalConfig.jifengTiaoyueLg.st100533;
		this.m_Lan3.text = GlobalConfig.jifengTiaoyueLg.st100534;
		this.m_Lan4.text = GlobalConfig.jifengTiaoyueLg.st100535;

	};
	private addViewEvent() {
		MessageCenter.ins().addListener(SyBossEvt.SYBOSS_DATAUPDATE_MSG, this.initData, this);
		this.m_SeeBox.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClickBox, this);
		this.m_MainBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClickMainBtn, this);
	}
	private removeEvent() {
		MessageCenter.ins().removeListener(SyBossEvt.SYBOSS_DATAUPDATE_MSG, this.initData, this);
		this.m_SeeBox.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onClickBox, this);
		this.m_MainBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onClickMainBtn, this);
	}
	public open() {
		SyBossModel.getInstance.isSendGetData = true;
		this.addViewEvent();
		this.initData();
		this.addTick();
	};
	public close() {
		this.removeEvent();
		this.removeTick();
	};

	private addTick() {
		this.removeTick();
		TimerManager.ins().doTimer(1000, 0, this.playTime, this);
		this.playTime();
	}

	private removeTick() {
		TimerManager.ins().remove(this.playTime, this);
	}

	private playTime() {
		if (!SyBossModel.getInstance.isSendGetData) {
			this.sendMsgTime++
			if (this.sendMsgTime >= 10) {
				this.sendMsgTime = 0;
				SyBossModel.getInstance.isSendGetData = true;
			}
		}
		let numChild = this.m_List.numChildren;
		for (var i = 0; i < numChild; i++) {
			let child = this.m_List.getChildAt(i);
			if (child && child instanceof SyBossItem) {
				child.addTick();
			}
		}
	}

	public release() {
		this.removeEvent();
		let numChild = this.m_List.numChildren;
		this.m_SyBossAnim.release();
	}

	private initData() {
		let syBossModel = SyBossModel.getInstance;
		let config = GlobalConfig.ins("PaidBossConfig");
		let data = [];
		let i: number = 0;
		let nowSelectConfig: any;
		for (let key in config) {
			data.push(parseInt(key));
			if (syBossModel.selectBossIndex == i) {
				nowSelectConfig = config[key][0];
				let desc = nowSelectConfig.desc;
				this.itemListData.removeAll();
				this.itemListData.replaceAll(desc);
				this.itemListData.refresh();
			}
			i++;
		}
		this.listData.replaceAll(data);
		if (nowSelectConfig) {
			this.nowSelectConfig = nowSelectConfig;
			let haveNum = UserBag.ins().getBagGoodsCountById(0, nowSelectConfig.ticket.id);
			let itemConfig = GlobalConfig.ins("ItemConfig")[nowSelectConfig.ticket.id];
			if (itemConfig) {
				this.m_NeedImg1.source = itemConfig.icon + "_png";
			}
			this.m_NeedLab1.text = haveNum + "/" + nowSelectConfig.ticket.count;
			let yb: number = GameLogic.ins().actorModel.yb;
			this.m_NeedLab2.text = nowSelectConfig.cost.count + "/" + yb;
			this.m_SyBossAnim.setData(nowSelectConfig.bossId, nowSelectConfig.groupId);
			let isSee = syBossModel.checkIsRemind(nowSelectConfig.groupId);
			this.nowSelectId = nowSelectConfig.groupId;
			if (isSee) {
				this.m_SeeBox.selected = true;
			} else {
				this.m_SeeBox.selected = false;
			}
			let syBossData = syBossModel.syBossDic.get(nowSelectConfig.groupId);
			if (syBossData) {
				if (syBossData.ownerNmae && syBossData.ownerNmae != "") {
					this.m_GetBossPlayer.text = GlobalConfig.jifengTiaoyueLg.st100525 + syBossData.ownerNmae;
				} else {
					this.m_GetBossPlayer.text = GlobalConfig.jifengTiaoyueLg.st100525 + GlobalConfig.jifengTiaoyueLg.st100280;
				}
			}
			if (nowSelectConfig.zsLevel > 0) {
				let playerzs = UserZs.ins() ? UserZs.ins().lv : 0;
				if (playerzs >= nowSelectConfig.zsLevel) {
					this.m_MainBtn.enabled = true;
				} else {
					this.m_MainBtn.enabled = false;
				}
			} else {
				let playerlv = GameLogic.ins().actorModel.level;
				if (playerlv >= nowSelectConfig.level) {
					this.m_MainBtn.enabled = true;
				} else {
					this.m_MainBtn.enabled = false;
				}
			}
		}
	}

	private onClickBox() {
		let syBossModel = SyBossModel.getInstance;
		let newRemind = 0;
		if (this.m_SeeBox.selected == true) {
			newRemind = syBossModel.syBossRemind + (1 << this.nowSelectId);
		} else {
			newRemind = syBossModel.syBossRemind - (1 << this.nowSelectId);
		}
		SyBossSproto.ins().sendGetSyBossSettingMsg(newRemind);
	}

	private onClickMainBtn() {
		let syBossModel = SyBossModel.getInstance;
		let nowSelectConfig = this.nowSelectConfig;
		let syBossData = syBossModel.syBossDic.get(nowSelectConfig.groupId);
		if (!syBossData) {
			UserTips.ins().showTips(GlobalConfig.jifengTiaoyueLg.st100526);
			return;
		}
		if (syBossData.isBossDead) {
			UserTips.ins().showTips(GlobalConfig.jifengTiaoyueLg.st100527);
			return;
		}
		let haveNum = UserBag.ins().getBagGoodsCountById(0, nowSelectConfig.ticket.id);
		if (haveNum >= nowSelectConfig.ticket.count) {
			SyBossSproto.ins().sendGetSyBossFight(nowSelectConfig.groupId);
			ViewManager.ins().close(BossWin);
			return;
		}
		let yb: number = GameLogic.ins().actorModel.yb;
		if (yb >= nowSelectConfig.cost.count) {
			WarnWin.show(LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st100528, [nowSelectConfig.cost.count]), function () {
				SyBossSproto.ins().sendGetSyBossFight(nowSelectConfig.groupId);
				ViewManager.ins().close(BossWin);
			}, this);
		} else {
			UserTips.ins().showTips(GlobalConfig.jifengTiaoyueLg.st100529);
		}
	}

	UpdateContent(): void {

	}




}
window["SyBossPanel"] = SyBossPanel