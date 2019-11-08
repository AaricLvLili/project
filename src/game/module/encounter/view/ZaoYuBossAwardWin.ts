class ZaoYuBossAwardWin extends BaseEuiView {
	public constructor() {
		super()
		this.skinName = "ZaoYuBossAwardSkin";
	}

	public m_Item1: ZaoYuBossAwardItem;
	public m_Item2: ZaoYuBossAwardItem;
	public m_Item3: ZaoYuBossAwardItem;
	public m_Item4: ZaoYuBossAwardItem;
	public m_Item5: ZaoYuBossAwardItem;
	public m_Item6: ZaoYuBossAwardItem;
	public m_PointGroup1: eui.Group;
	public m_PointGroup2: eui.Group;
	public m_PointGroup3: eui.Group;
	public m_PointGroup4: eui.Group;
	public m_PointGroup5: eui.Group;
	public m_PointGroup6: eui.Group;
	public m_TimeBitLab: eui.BitmapLabel;
	public m_StartBtnGroup: eui.Group;
	public m_TimeLab: eui.Label;
	public m_CloseBtnGroup: eui.Group;
	public m_CloseTimeLab: eui.Label;
	public m_AllGetBtnGroup: eui.Group;
	public m_NeedItemGroup: eui.Group;
	public m_LvUpItemImg1: eui.Image;
	public m_LvUpItemNum0: eui.Label;
	public m_CPoint: eui.Group;


	private itemList: ZaoYuBossAwardItem[] = [];
	private pointList: eui.Group[] = [];

	private time: number = 30;
	private state: number = 1;

	private rList = [];

	private openTime: number;
	private rewardTime: number;
	private closeTime: number;
	public groupEff: eui.Group;
	private _mc: MovieClip
	private languageBtn: eui.Button;
	private languageBtn0: eui.Button;
	private languageBtn1: eui.Button;
	private languageTxt: eui.Label;

	private getNum: number = 0;
	public createChildren() {
		super.createChildren();
		this.rList = this.getRlist(6);
		this.itemList.push(this.m_Item1, this.m_Item2, this.m_Item3, this.m_Item4, this.m_Item5, this.m_Item6);
		this.pointList.push(this.m_PointGroup1, this.m_PointGroup2, this.m_PointGroup3, this.m_PointGroup4, this.m_PointGroup5, this.m_PointGroup6);
		let fieldBossBasicConfig = GlobalConfig.ins("FieldBossBasicConfig");
		this.openTime = fieldBossBasicConfig.openTime
		this.rewardTime = fieldBossBasicConfig.rewardTime;
		this.closeTime = fieldBossBasicConfig.closeTime

		this.languageBtn.label = GlobalConfig.jifengTiaoyueLg.st100742;
		this.languageBtn0.label = GlobalConfig.jifengTiaoyueLg.st100741;
		this.languageBtn1.label = GlobalConfig.jifengTiaoyueLg.st100743;
		this.languageTxt.text = GlobalConfig.jifengTiaoyueLg.st100218;
	}
	initUI() {
		super.initUI();
	}
	open(...param: any[]) {
		this.addViewEvent();
		this.setData();
		this._mc = ObjectPool.ins().pop("MovieClip")
		this._mc.x = this.groupEff.width >> 1
		this._mc.y = this.groupEff.height >> 1
		this._mc.loadUrl(ResDataPath.GetUIEffePath("eff_jiesuan"), true, -1)
		this.groupEff.addChild(this._mc)
	}
	close() {
		this.release();
		DisplayUtils.removeFromParent(this._mc)
		ObjectPool.ins().push(this._mc)
		ViewManager.ins().releaseView(ZaoYuBossAwardWin);
	}
	public release() {
		this.removeItem();
		this.removeTimer();
		this.removeViewEvent();
	}
	private removeItem() {
		for (var i = 0; i < this.itemList.length; i++) {
			let pai = this.itemList[i];
			pai.release();
		}
	}
	private addViewEvent() {
		this.m_StartBtnGroup.addEventListener(egret.TouchEvent.TOUCH_TAP, this.goState2, this);
		this.m_CloseBtnGroup.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClickClose, this);
		this.m_AllGetBtnGroup.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClickAllGet, this);
		MessageCenter.ins().addListener(MessageDef.WILLBOSS_AWARD_UPDATE, this.getAward, this);
	}
	private removeViewEvent() {
		this.m_StartBtnGroup.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.goState2, this);
		this.m_CloseBtnGroup.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onClickClose, this);
		this.m_AllGetBtnGroup.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onClickAllGet, this);
		MessageCenter.ins().removeListener(MessageDef.WILLBOSS_AWARD_UPDATE, this.getAward, this);
	}

	private setData() {
		let award: Sproto.reward_data[] = Encounter.ins().getZyBossDate().dropRewards;
		for (var i = 0; i < this.itemList.length; i++) {
			this.itemList[i].setData(award[i]);
			this.itemList[i].m_MaskImg.visible = false;
			this.itemList[i].point = i + 1;
			this.itemList[i].index = i + 1;
		}
		this.setStateSH();
		this.setAddTimer(this.openTime);
	}

	private setAddTimer(time: number) {
		this.time = time;
		TimerManager.ins().doTimer(1000, time, this.setTime, this);
		this.setTime();
	}

	private removeTimer() {
		TimerManager.ins().remove(this.setTime, this);
	}

	private setTime() {
		this.m_TimeBitLab.text = this.time + "";
		this.m_TimeLab.text = "(" + this.time + "s)";
		this.m_CloseTimeLab.text = "(" + this.time + "s)";
		if (this.time <= 0) {
			this.removeTimer();
			switch (this.state) {
				case 1:
					this.goState2();
					break;
				case 2:
					this.goState3();
					break;
				case 3:
					this.onClickClose();
					break;
				case 4:
					this.onClickClose();
					break;
			}
		}
		this.time -= 1;
	}

	private setStateSH() {
		switch (this.state) {
			case 1:
				this.m_StartBtnGroup.visible = true;
				this.m_TimeBitLab.visible = false;
				this.m_AllGetBtnGroup.visible = false;
				this.m_CloseBtnGroup.visible = false;
				this.removeItmeEvt();
				break;
			case 2:
				this.m_AllGetBtnGroup.visible = true;
				this.m_StartBtnGroup.visible = false;
				this.m_TimeBitLab.visible = true;
				this.m_CloseBtnGroup.visible = false;
				this.m_AllGetBtnGroup.horizontalCenter = 0;
				this.setAllGetGold();
				break;
			case 3:
				this.m_AllGetBtnGroup.visible = true;
				this.m_StartBtnGroup.visible = false;
				this.m_TimeBitLab.visible = false;
				this.m_CloseBtnGroup.visible = true;
				this.m_AllGetBtnGroup.horizontalCenter = 151;
				this.m_CloseBtnGroup.horizontalCenter = -148;
				this.setAllGetGold();
				break;
			case 4:
				this.m_AllGetBtnGroup.visible = false;
				this.m_StartBtnGroup.visible = false;
				this.m_TimeBitLab.visible = false;
				this.m_CloseBtnGroup.visible = true;
				this.m_CloseBtnGroup.horizontalCenter = 0;
				this.removeItmeEvt();
				break;
		}
	}

	private goState2() {
		this.removeTimer();
		this.m_StartBtnGroup.visible = false;
		for (var i = 0; i < this.itemList.length; i++) {
			let pai = this.itemList[i];
			if (i == 0) {
				egret.Tween.get(pai).to({ scaleX: 0, skewY: 90 }, 300).call(() => { pai.m_MaskImg.visible = !pai.m_MaskImg.visible }).to({ scaleX: 1, skewY: 0 }, 300).wait(300).call(() => {
					this.mergeItem();
				});
			} else {
				egret.Tween.get(pai).to({ scaleX: 0, skewY: 90 }, 300).call(() => { pai.m_MaskImg.visible = !pai.m_MaskImg.visible }).to({ scaleX: 1, skewY: 0 }, 300).wait(300);
			}
		}
	}

	private mergeItem() {
		for (var i = 0; i < this.itemList.length; i++) {
			let pai = this.itemList[i];
			if (i == 0) {
				egret.Tween.get(pai).to({ x: this.m_CPoint.x, y: this.m_CPoint.y }, 300).call(() => { this.assignItem() });
			} else {
				egret.Tween.get(pai).to({ x: this.m_CPoint.x, y: this.m_CPoint.y }, 300);
			}
		}
	}

	private assignItem() {
		for (var i = 0; i < this.itemList.length; i++) {
			let pai = this.itemList[i];
			pai.point = this.rList[i];
			if (i == 0) {
				egret.Tween.get(pai).to({ x: this.pointList[pai.point - 1].x, y: this.pointList[pai.point - 1].y }, 300).call(() => {
					this.setState2();
				});
			} else {
				egret.Tween.get(pai).to({ x: this.pointList[pai.point - 1].x, y: this.pointList[pai.point - 1].y }, 300);
			}
		}
	}

	private setState2() {
		this.state = 2;
		this.setStateSH();
		this.setAddTimer(this.rewardTime);
		for (var i = 0; i < this.itemList.length; i++) {
			this.itemList[i].addEvt();
			this.itemList[i].setGood(0);
		}
	}


	private getRlist(listLen: number, list: number[] = []): number[] {
		if (list.length >= listLen) {
			return list;
		}
		let num = Math.ceil(Math.random() * listLen);
		for (var i = 0; i < list.length; i++) {
			if (list[i] == num) {
				return this.getRlist(listLen, list);
			}
		}
		list.push(num);
		return this.getRlist(listLen, list);
	}

	private onClickClose() {
		ViewManager.ins().close(this);
	}

	public removeItmeEvt() {
		for (var i = 0; i < this.itemList.length; i++) {
			this.itemList[i].removeEvt();
		}
	}
	private goState3() {
		let num = Math.floor(Math.random() * 6);
		let item = this.itemList[num];
		item.sendGetItem();
		// this.state = 3;
		// this.setStateSH();
		// this.setAddTimer(this.closeTime);
	}

	private getAward(...param: any[]) {
		let data: Sproto.reward_data[] = param[0];
		let index = param[1];
		if (data.length > 1) {
			this.removeTimer();
			for (var i = 0; i < this.itemList.length; i++) {
				let item = this.itemList[i];
				if (item.m_MaskImg.visible == true) {
					item.isGet = true;
					let award: Sproto.reward_data = data.shift();
					item.setData(award);
					egret.Tween.get(item).to({ scaleX: 0, skewY: 90 }, 300).call(() => { item.m_MaskImg.visible = !item.m_MaskImg.visible }).to({ scaleX: 1, skewY: 0 }, 300);
				}
			}
			this.state = 4;
			this.setStateSH();
			this.setAddTimer(this.closeTime);
		} else {
			this.getNum += 1;
			for (var i = 0; i < this.itemList.length; i++) {
				let item = this.itemList[i];
				if (item.index == index) {
					item.isGet = true;
					let award: Sproto.reward_data = data.shift();
					item.setData(award);
					egret.Tween.get(item).to({ scaleX: 0, skewY: 90 }, 300).call(() => { item.m_MaskImg.visible = !item.m_MaskImg.visible }).to({ scaleX: 1, skewY: 0 }, 300);
				}
				let fieldBossBasicConfig = GlobalConfig.ins("FieldBossBasicConfig");
				let value = fieldBossBasicConfig.cost[this.getNum - 1];
				item.setGood(value);
			}
			if (this.getNum == 1) {
				this.removeTimer();
				this.state = 3
				this.setStateSH();
			}
			this.setAllGetGold();
			if (this.getNum == 6) {
				this.state = 4;
				this.setStateSH();
			}
			this.setAddTimer(this.closeTime);
		}
	}

	private getFreeAward() {
		for (var i = 0; i < this.itemList.length; i++) {
			let item = this.itemList[i];
			item.removeEvt();
		}
	}

	private setAllGetGold() {
		let fieldBossBasicConfig = GlobalConfig.ins("FieldBossBasicConfig");
		let value = 0;
		let num = this.getNum - 1;
		for (var i = num; i < fieldBossBasicConfig.cost.length; i++) {
			if (fieldBossBasicConfig.cost[i]) {
				value += fieldBossBasicConfig.cost[i];
			}
		}
		let needItemData = [];
		let needData: { type: number, id: number, count: number } = { type: 0, id: 2, count: value };
		needItemData.push(needData);
		UserBag.ins().setNeedItem(needItemData, this.m_NeedItemGroup, 22, 16, 0x3b3b3b, 1);
	}

	private onClickAllGet() {
		let fieldBossBasicConfig = GlobalConfig.ins("FieldBossBasicConfig");
		let value = 0;
		for (var i = this.getNum; i < fieldBossBasicConfig.cost.length; i++) {
			value += fieldBossBasicConfig.cost[i];
		}
		let yb: number = GameLogic.ins().actorModel.yb;
		if (yb >= value) {
			Encounter.ins().sendZaoYuBossAward(-1);
		} else {
			UserTips.ins().showTips(GlobalConfig.jifengTiaoyueLg.st100008);
		}

	}
}
ViewManager.ins().reg(ZaoYuBossAwardWin, LayerManager.UI_Popup);
window["ZaoYuBossAwardWin"] = ZaoYuBossAwardWin