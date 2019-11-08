class DayLoginPanel extends BaseEuiView implements ICommonWindow, ICommonWindowTitle {
	public static LAYER_LEVEL = LayerManager.UI_Main

	private getBtn: eui.Button
	private list: eui.List
	private group: eui.Group
	private loginDayLabel: eui.Label
	private stateImg2: eui.Image

	private index: number = 0
	private curRewardData;

	private ActivityType5Config: any;
	private m_DayItem: {
		m_ItemList: eui.DataGroup;
		select: eui.Image;
		stateImg2: eui.Image;
		dayimg: eui.Label;
		stateImg: eui.Image;
		isReward: boolean;
		groupEff: eui.Group;
		_mc: MovieClip
	}[]
	private m_mc: MovieClip[] = [];

	private m_ActivityData: ActivityType5Data

	public constructor() {
		super()
		this.skinName = "DayLoginPanel2Skin"
		this.m_DayItem = this.group.$children as any
		this.list.itemRenderer = ItemBase

		this.getBtn.label = GlobalConfig.jifengTiaoyueLg.st100004;
	}
	public UpdateContent() {

	}

	open() {
		// this.commonWindowBg.OnAdded(this)
		this.AddClick(this.getBtn, this._OnClick)
		this.observe(MessageDef.UPDATE_ACTIVITY_PANEL, this._UpdateContent)
		// var sx = this.group.x + 97;
		// var sy = this.group.y + 80;
		for (let i = 0; i < 8; ++i) {
			let comp = this.group.getChildAt(i)
			comp.addEventListener(egret.TouchEvent.TOUCH_TAP, this._ClickBox, this);
			// 	let mc = this.m_mc[i] = new MovieClip;
			// 	mc.x = (i % 4) * 172 + sx;
			// 	mc.y = Math.floor(i / 4) * 202 + sy;
			// 	mc.scaleX = 2;
			// 	mc.scaleY = 2;
		}
		this._UpdateContent(true)
	}

	close() {
		this.release();
		// this.commonWindowBg.OnRemoved()
	}

	private release() {
		this.removeObserve();
		for (var i = 0; i < this.m_DayItem.length; i++) {
			this.m_DayItem[i].m_ItemList.dataProvider = null;
			this.m_DayItem[i]._mc && DisplayUtils.removeFromParent(this.m_DayItem[i]._mc)
		}
		let childNum = this.group.numChildren;
		for (let i = 0; i < childNum; ++i) {
			let child = this.group.removeChildAt(0);
			if (child) {
				child.removeEventListener(egret.TouchEvent.TOUCH_TAP, this._ClickBox, this);
			}
		}
	}

	private _OnClick() {
		if (!this.m_ActivityData || !this.curRewardData) {
			return
		}
		if (this.m_ActivityData.checkOneDayStatu(this.curRewardData.index) == RewardState.CanGet) {
			ActivityModel.ins().sendReward(this.m_ActivityData.id, this.curRewardData.index)
		}
	}

	private _UpdateRewards(index) {
		this.m_DayItem[this.index].select.visible = false;
		this.m_DayItem[this.index].stateImg.visible = false;
		this.index = index;
		let dayItem = this.m_DayItem[this.index]
		// dayItem.select.source = index <= 5 ? "ui_7t_bx_xz" : "ui_7t_bx_b_xz"
		// dayItem.select.visible = !this._IsGotten(index + 1)
		dayItem.select.visible = true;
		// dayItem.stateImg.visible = dayItem.select.visible;
		dayItem.stateImg.visible = false;
		this.curRewardData = this.m_ActivityData.GetConfigByIndex(this.index + 1)
		let enabled = this.m_ActivityData.logTime >= this.curRewardData.day
		this.stateImg2.visible = dayItem.isReward
		this.getBtn.visible = !dayItem.isReward
		if (this.getBtn.visible) {
			this.getBtn.enabled = enabled
			// this.getBtn.icon = enabled && "ui_7t_lqjl" || "ui_mrhd_btn_lqjl_no"
		}
		UIHelper.SetBtnNormalEffe(this.getBtn, this.getBtn.visible && enabled)
		this.list.dataProvider = new eui.ArrayCollection(this.curRewardData.rewards)
	}

	private _ClickBox(e: egret.TouchEvent): void {
		this._UpdateRewards(this.group.getChildIndex(e.target))
	}

	private _UpdateContent(isInit: boolean = false) {
		this.m_ActivityData = ActivityModel.ins().GetActivityDataByType(5) as ActivityType5Data
		if (!this.m_ActivityData) {
			ViewManager.ins().close(this)
			return
		}

		if (this.ActivityType5Config == null)
			this.ActivityType5Config = GlobalConfig.ins("ActivityType5Config");
		var config = GlobalConfig.ins("ActivityType5Config")[this.m_ActivityData.id]
		let rewardIndex = null
		let isNextHave: boolean = false;
		for (let i = 1; i <= 8; ++i) {
			let configData = this.m_ActivityData.GetConfigByIndex(i)
			let isReward = false
			let isEff = false
			if (this.m_ActivityData.logTime >= configData.day) {
				if (BitUtil.Has(this.m_ActivityData.record, i)) {
					isReward = true
				} else {
					isEff = true
				}
			}
			if (rewardIndex == null && !isReward) {
				rewardIndex = i - 1
				if (isEff) {
					isNextHave = true;
				}
			}
			// this.playEffect(this.m_mc[i - 1], isEff)
			let dayItem = this.m_DayItem[i - 1]
			dayItem.dayimg.text = LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st100002, [configData.day])
			// if (SdkMgr.tag == "wdws_lezhong_android_wdws" && i == 8) {
			// 	dayItem.dayimg.source = `ui_7t_8t_test`;
			// }
			dayItem.isReward = isReward
			// if (i >= 7) {
			// 	dayItem.stateImg.source = isReward ? "ui_7t_bx_b_k" : "ui_7t_bx_b"
			// } else {
			// 	dayItem.stateImg.source = isReward ? "ui_7t_bx_k" : "ui_7t_bx"
			// }
			// dayItem.stateImg.source = isReward ? "ui_7t_bx_k" : isEff ? "ui_7t_bx" : "ui_7t_bx_b";
			if (isReward == true) {
				//已经领取
				dayItem.stateImg2.visible = true;
				if (dayItem._mc)
					dayItem._mc.visible = false
				dayItem.stateImg2.source = "comp_84_62_01_png";
			} else if (isEff == true) {
				//可领取
				dayItem.stateImg2.visible = false;
				if (dayItem._mc == null) {
					dayItem._mc = new MovieClip
					dayItem._mc.x = dayItem.groupEff.width / 2
					dayItem._mc.y = dayItem.groupEff.height / 2
					// dayItem._mc.scaleX = dayItem._mc.scaleY = .65
					dayItem.groupEff.addChild(dayItem._mc)
					dayItem._mc.visible = true
					dayItem._mc.loadUrl(ResDataPath.GetUIEffePath("quaeff4"), true, -1);
				}
				//dayItem.stateImg2.source = "comp_84_62_02_png";
			} else {
				//不能领取
				dayItem.stateImg2.visible = false;
				if (dayItem._mc)
					dayItem._mc.visible = false
			}
			dayItem.m_ItemList.itemRenderer = ItemBase;
			dayItem.m_ItemList.dataProvider = new eui.ArrayCollection([config[i - 1].showRewards]);
		}
		if ((rewardIndex != null && isNextHave == true) || isInit == true) {
			this._UpdateRewards(rewardIndex || 0);
		} else if (rewardIndex != null && isNextHave == false) {
			this._UpdateRewards(rewardIndex - 1 || 0);
		} else {
			this._UpdateRewards(7);
		}
		this.loginDayLabel.text = GlobalConfig.jifengTiaoyueLg.st100003 + this.m_ActivityData.logTime;
	}

	private _IsGotten(i: number): boolean {
		let configData = this.m_ActivityData.GetConfigByIndex(i)
		let gotten = false
		let isEff = false
		if (this.m_ActivityData.logTime >= configData.day) {
			if (BitUtil.Has(this.m_ActivityData.record, i)) {
				gotten = true
			}
		}
		return gotten
	}

	playEffect(e: MovieClip, isplay: boolean) {
		// isplay ? (e.loadFile(RES_DIR_EFF + "taskBox", !0, 100), this.addChild(e)) : e.parent && DisplayUtils.removeFromParent(e)
		isplay ? (e.loadUrl(ResDataPath.GetUIEffePath("eff_task_box"), true, 100), this.addChild(e)) : e.parent && DisplayUtils.dispose(e), e = null;
	}
}
window["DayLoginPanel"] = DayLoginPanel