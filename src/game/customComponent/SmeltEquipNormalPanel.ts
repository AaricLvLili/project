class SmeltEquipNormalPanel extends BaseView implements ICommonWindowTitle {
	windowTitleIconName: string = GlobalConfig.jifengTiaoyueLg.st101447;
	UpdateContent(): void {
		this.setItemData();
	}

	private effectMc: MovieClip;
	public constructor() {
		super()
		this.skinName = "SmeltMainSkin";
	}

	itemScroller
	smeltEquips
	itemList
	dataInfo
	smeltBtn//熔炼按钮
	// mc_group: eui.Group;
	viewIndex = 0
	// mc: MovieClip;
	/** 自动熔炼勾选*/
	private autoCheck: eui.CheckBox;
	/** 熔炼说明*/
	private descTf: eui.Label;
	BlockItemConfig: any;
	blockList;
	public static currentClickCanshow: boolean;
	public m_Lan1: eui.Label;

	childrenCreated() {
		this.name = GlobalConfig.jifengTiaoyueLg.st101447;
		this.smeltEquips = [];
		this.smeltEquips.length = Const.SMELT_COUNT;
		this.blockList = [];
		this.itemList.itemRenderer = SmeltEquipItemForRonglu;
		this.dataInfo = new eui.ArrayCollection(this.smeltEquips);
		this.itemList.dataProvider = this.dataInfo;
		// this.mc = new MovieClip;
		// this.mc.blendMode = egret.BlendMode.ADD;
		// this.mc.x = 0;
		// this.mc.y =	0;
		// this.mc.loadUrl(ResDataPath.GetUIEffePath("eff_ui_rlui_001"), true, -1),this.mc_group.addChild(this.mc);

		UIHelper.SetLinkStyleLabel(this.descTf, GlobalConfig.jifengTiaoyueLg.st101448);

		this.itemScroller.viewport = this.itemList;
		this.autoCheck.label = GlobalConfig.jifengTiaoyueLg.st101453;
		this.smeltBtn.label = GlobalConfig.jifengTiaoyueLg.st101454;
		this.descTf.text = GlobalConfig.jifengTiaoyueLg.st101455;
		this.m_Lan1.text = GlobalConfig.jifengTiaoyueLg.st101456;
	};
	open() {
		this.smeltBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
		this.itemList.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
		// this.setItemData();
		MessageCenter.addListener(UserEquip.ins().postSmeltEquipComplete, this.smeltComplete, this);
		MessageCenter.addListener(UserEquip.ins().postEquipCheckList, this.setItemList, this);
		this.autoCheck.addEventListener(egret.Event.CHANGE, this.checkChange, this);
		this.descTf.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
		this.autoCheck.selected = UserBag.ins().isAuto;
	};
	close() {
		this.smeltBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
		this.itemList.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
		this.autoCheck.removeEventListener(egret.Event.CHANGE, this.checkChange, this);
		this.descTf.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
		MessageCenter.ins().removeAll(this);
	};
	private checkChange(e: egret.TouchEvent): void {
		if (GameLogic.ins().actorModel.vipLv < 6) {
			UserTips.ErrorTip(GlobalConfig.jifengTiaoyueLg.st101449);
			this.autoCheck.selected = false;
			return;
		}
		// this.autoCheck.selected = (!this.autoCheck.selected);
		UserBag.ins().setAutoBag(this.autoCheck.selected);
	}
	smeltComplete() {
		// var n = this.itemList.numChildren;
		// while (n--) {
		// 	this.itemList.getChildAt(n).playEff();
		// }
		let num = this.itemList.numChildren;
		for (var i = 0; i < num; i++) {
			let child = this.itemList.getChildAt(i);
			if (child && child instanceof SmeltEquipItemForRonglu) {
				child.playEff();
			}
		}
		if (this.effectMc == null) {
			this.effectMc = new MovieClip();
			this.effectMc.x = 240;
			this.effectMc.y = 340;
			this.addChild(this.effectMc);
			this.effectMc.loadUrl(ResDataPath.GetUIEffePath("eff_power_fire"), true, 1, () => {
				DisplayUtils.dispose(this.effectMc);
				this.effectMc = null;
			});
		}

		this.setItemData();
	};
	setItemData() {

		this.blockList.length = 0;
		//获取熔炉已经解锁的个数
		this.BlockItemConfig = GlobalConfig.ins("RongLuUnlockConfig");
		if (!this.BlockItemConfig) return;
		var currentLv = GameLogic.ins().actorModel.level;
		var currentZsLv = GameLogic.ins().actorModel.zsLv;
		var maxIndex = 0; //解锁到最大的index
		var maxGrid = 0;//最大格子数
		var tempConfig = this.BlockItemConfig;
		Object.keys(tempConfig).forEach(
			function (key) {
				var entry = tempConfig[key];
				let temp = 1000 <= entry.param ? entry.param / 1000 <= currentZsLv : entry.param <= currentLv;
				if (temp && maxIndex < entry.nId) {
					maxIndex = entry.nId;
				}
				if (maxGrid < entry.nId)
					maxGrid = entry.nId;
			}
		);
		Const.SMELT_COUNT = maxIndex;

		//根据解锁个数获取背包能熔炉的列表
		var list1 = UserBag.ins().getOutEquips();
		if (list1.length < Const.SMELT_COUNT) {
			let list2 = UserBag.ins().getOutFuwenEquips(Const.SMELT_COUNT - list1.length);
			for (let i = 0; i < list2.length; ++i)
				list1.push(list2[i]);
			UserBag.ins().creatListLength(list1);
		}
		this.smeltEquips = list1;

		//最大熔炉50，不足的用锁补上
		while (maxIndex < maxGrid) {
			var temp = tempConfig[maxIndex + 1];
			list1.push(temp);
			this.blockList.push(temp);

			maxIndex++
		}
		this.dataInfo.replaceAll(list1);
	};
	setItemList(list) {
		var templist = list.concat(this.blockList);
		this.dataInfo.replaceAll(templist);
		this.itemList.dataProvider = this.dataInfo;
	};
	onTap(e) {
		switch (e.currentTarget) {
			case this.smeltBtn:
				UserEquip.ins().sendSmeltEquip(this.viewIndex, this.smeltEquips);
				break;
			case this.descTf:
				var s: string = GlobalConfig.jifengTiaoyueLg.st101450;
				WarnWin.show(s, () => {
				}, this, null, null, "sure", {
						btnName: GlobalConfig.jifengTiaoyueLg.st100040,
						title: GlobalConfig.jifengTiaoyueLg.st100367
					})
				break;
			case this.itemList:
				var item = e.target;
				if (item && item.data) {
					var i = this.smeltEquips.indexOf(item.data);
					if (i >= 0) {
						this.smeltEquips.splice(i, 1);
						item.data = null;
					}
				}
				else {
					if (!SmeltEquipNormalPanel.currentClickCanshow) {
						UserTips.ins().showTips(GlobalConfig.jifengTiaoyueLg.st101451);
						break;
					}

					// var smeltList = UserBag.ins().getBagSortQualityEquips(this.viewIndex == 0 ? 3 : 5, 0, 0, this.viewIndex == 0 ? UserBag.ins().canSmeltNormalFilter : UserBag.ins().otherEquipSmeltFilter, [ItemType.RINGSOUL, ItemType.ZHUANZHI, ItemType.MOUNTEQUIP]);
					let smeltList = UserBag.ins().getCanSmeltEquips();
					if (smeltList.length > 0) {
						var smeltSelectWin = <SmeltSelectWin>ViewManager.ins().open(SmeltSelectWin, smeltList, Const.SMELT_COUNT, this.smeltEquips);
						// smeltSelectWin.setSmeltEquipList(this.smeltEquips);
					}
					else {
						UserTips.ins().showTips(GlobalConfig.jifengTiaoyueLg.st101452);
					}
				}
				break;
		}
	};
}
window["SmeltEquipNormalPanel"] = SmeltEquipNormalPanel