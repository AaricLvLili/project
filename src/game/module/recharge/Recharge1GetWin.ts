class Recharge1GetWin extends RechargeBaseWin {

	private group: eui.Group
	private group0: eui.Group
	private tj_img: eui.Image
	public static showParent: eui.Group;
	private effGroup: eui.Group
	private tabBar: eui.TabBar = null;
	private _index: number = 0
	private _day: number = 0
	private _data
	private txtTitle: eui.Label
	private txtDay: eui.Label
	private m_Eff: MovieClip;
	private petConfig: any;
	public m_PetAnimGroup: eui.Group;
	public m_PetSkillAnimGroup: eui.Group;
	public m_Lan1: eui.Image;
	public m_Lan0: eui.Image;
	public m_TitleImg: eui.Image;

	public constructor() {
		super()

	}

	public initUI(): void {
		super.initUI();
		var config: any = GlobalConfig.ins("FirstPayConfig");
		var arr: Array<number> = GameServer.serverMergeTime > 0 ? [40001, 40002, 40003, 40004] : [30001, 30002, 30003, 30004];
		var len: number = this.group0.numChildren;
		var label: eui.Label;
		var data: any;
		var btn: eui.Button;
		for (var i: number = 0; i < len; i++) {
			data = config[arr[i]];
			btn = <eui.Button>this.group.getChildAt(i);
			btn.label = GlobalConfig.jifengTiaoyueLg.st101923 + data.cash;
			label = <eui.Label>this.group0.getChildAt(i);
			label.text = LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st101924, [(data.cash * 10), (data.cash * 40)]);
		}
	}


	getConfig(index: number) {
		if (this.chongZhi1Config == null)
			this.chongZhi1Config = GlobalConfig.ins("ChongZhi1Config");
		return (GameServer.serverMergeTime > 0) ? this.chongZhi1Config[99][0][0] : this.chongZhi1Config[0][0][0];
	}

	setSkinName() {
		this.skinName = "DailyRechargeSkin"
	}

	private loaderEffect() {
		let mc = new MovieClip
		mc.loadUrl(ResDataPath.GetUIEffePath("eff_firstCharge_weapon_02"), true, -1)
		mc.scaleX = mc.scaleY = .8
		this.effGroup.addChild(mc)
	}

	open() {
		super.open();
		for (let i = 0; i < this.group.numChildren; ++i) {
			this.group.getChildAt(i).addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnClick, this);
		}
		this.setWinData()
		GameGlobal.MessageCenter.addListener(MessageDef.UPDATE_FIRSTRECHARGE, this.setWinData, this);
		this.AddClick(this.m_Lan1, this.onClickVip);
		this.AddClick(this.m_Lan0, this.onClickVip);
		this.playEff();
	}
	private onClickVip(e: egret.TouchEvent) {
		switch (e.currentTarget) {
			case this.m_Lan0:
				ViewManager.ins().open(VipWin, 7);
				break;
			case this.m_Lan1:
				ViewManager.ins().open(VipWin, 10);
				break;
		}

	}
	setWinData() {
		let _data = this.GetRewardData()
		var isRemind = this.getRemindByIndex(this.GetRewardIndex()),
			t = this.GetRewardIndex() + 1;
		var config = this.getConfig(this.GetRewardIndex())
		if (!config) {
			return
		}
		let listData = [];
		if (config.awardList.length >= 6) {
			for (var i = 0; i < 6; i++) {
				listData.push(config.awardList[i]);
			}
		} else {
			listData = config.awardList
		}
		this.list.dataProvider = new eui.ArrayCollection(listData)
		let data = GameGlobal.firstRechargeData;
		if (!data) {
			return
		}
		this.awardsBtn.label = data.statau ? GlobalConfig.jifengTiaoyueLg.st100004 : GlobalConfig.jifengTiaoyueLg.st100981;
		this.awardsBtn.enabled = data.statau;
		this._SetGoBtnState(data.awards == AwardStatus.unfinish)
		this.awardsBtn.visible = data.awards != AwardStatus.unfinish
		this.setEff(this.GetRewardIndex())
	}

	close() {
		super.close();
		for (let i = 0; i < this.group.numChildren; ++i) {
			this.group.getChildAt(i).removeEventListener(egret.TouchEvent.TOUCH_TAP, this._OnClick, this);
		}
		GameGlobal.MessageCenter.removeListener(MessageDef.UPDATE_FIRSTRECHARGE, this.setWinData, this)
		DisplayUtils.dispose(this.m_Eff);
		this.m_Eff = null;
	}
	private _OnClick(e: egret.TouchEvent) {
		let index = this.group.getChildIndex(e.target)
		if (index == -1) {
			return
		}
		let num = GameServer.serverMergeTime > 0 ? 40001 : 30001
		Recharge.ins().TestReCharge(index + num, true)
	}
	private _getReaward(): void {

	}
	onTouch(e) {
		switch (e.currentTarget) {
			case this.awardsBtn:
				let idx = 0
				for (var t = this.getConfig(idx), i = 0, r = 0; r < t.awardList.length; r++) 1 == t.awardList[r].type && t.awardList[r].id < 2e5 && i++;
				if (i > UserBag.ins().getSurplusCount()) return void UserTips.ins().showTips(GlobalConfig.jifengTiaoyueLg.st100051);
				Recharge.ins().sendGetAwards(2, idx)
				break;
			case this.returnBtn:
				ViewManager.ins().close(this);
				break;
		}
	}

	protected _SetGoBtnState(visible: boolean) {
		this.group.visible = visible
		this.group0.visible = visible
		this.tj_img.visible = visible
		this.m_Lan1.visible = visible;
		this.m_Lan0.visible = visible;
	}
	private playEff() {

		if (GameServer.serverMergeTime > 0) {
			this.m_TitleImg.source = "comp_hfsc_png";
			let name = GlobalConfig.ins("UniversalConfig").showRes;
			this.m_Eff = ViewManager.ins().createEff(this.m_Eff, this.m_PetAnimGroup, name, -1, ResAnimType.TYPE1)
		} else {
			this.m_TitleImg.source = "comp_schl_png";
			let name = GlobalConfig.ins("UniversalConfig").showResHf;
			this.m_Eff = ViewManager.ins().createEff(this.m_Eff, this.m_PetAnimGroup, name, -1, ResAnimType.TYPE1)
		}

	}
}
ViewManager.ins().reg(Recharge1GetWin, LayerManager.UI_Popup);
window["Recharge1GetWin"] = Recharge1GetWin