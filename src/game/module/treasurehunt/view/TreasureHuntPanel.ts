class TreasureHuntPanel extends BaseView implements ICommonWindowTitle {
	public constructor() {
		super();
		this.skinName = "Treasure";
	}
	mWindowHelpId=36
	list
	buy1: eui.Button
	buy10: eui.Button

	priceIcon01: PriceIcon
	priceIcon02: PriceIcon
	priceIcon03: PriceIcon
	priceIcon04: PriceIcon

	private item1: ItemBase;
	private item2: ItemBase;
	private dataGroupLeft: eui.DataGroup;
	private dataGroupRight: eui.DataGroup;
	private todayHuntCount: eui.Label;
	private bar: eui.ProgressBar;
	private getGroup: eui.Group;
	private maxIndex: number = 0;
	private warehouse: eui.Button;
	private boxGroup: eui.Group;
	private rewardId: number = -1;
	private poolOtherId: number = -1;
	public item1Name: eui.Label;
	public item2Name: eui.Label;

	windowTitleIconName: string = GlobalConfig.jifengTiaoyueLg.st100032;
	mc1: MovieClip
	mc2: MovieClip
	mc3: MovieClip
	mc4: MovieClip
	mc5: MovieClip
	mc6: MovieClip
	protected childrenCreated() {
		this.name = GlobalConfig.jifengTiaoyueLg.st100032;
		this.warehouse.label = GlobalConfig.jifengTiaoyueLg.st100036;
		this.buy1.label = LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st100037, [1]);
		this.buy10.label = LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st100037, [10]);
		this.priceIcon01.price = GlobalConfig.ins("TreasureHuntConfig").huntOnce
		this.priceIcon02.price = GlobalConfig.ins("TreasureHuntConfig").huntTenth
		this.priceIcon03.iconImg.source = ResDataPath.GetItemFullName("200015")
		this.priceIcon04.iconImg.source = ResDataPath.GetItemFullName("200015")

		this.list.itemRenderer = HuntListRenderer;
		this.listRefush([]);

		this.bar.slideDuration = 0;
		this.maxIndex = this.getGroup.numChildren;
		this.dataGroupLeft.itemRenderer = ItemBase;
		this.dataGroupRight.itemRenderer = ItemBase;

		var poolOtherReward = GlobalConfig.ins("TreasureHuntConfig").poolOtherReward;
		for (var i = 0; i < poolOtherReward.length; i++) {
			if (GameServer.serverOpenDay >= poolOtherReward[i].day) {
				if (poolOtherReward[i + 1] == undefined || GameServer.serverOpenDay < poolOtherReward[i + 1].day) {
					this.poolOtherId = poolOtherReward[i].id;
					break;
				}
			}
		}

		var showrReward = GlobalConfig.ins("TreasureHuntConfig").showrReward;
		for (var i = 0; i < showrReward.length; i++) {
			if (GameServer.serverOpenDay >= showrReward[i].day) {
				if (showrReward[i + 1] == undefined || GameServer.serverOpenDay < showrReward[i + 1].day) {
					this.rewardId = showrReward[i].id;
					break;
				}
			}
		}
	};

	open() {
		for (let i = 0; i < this.getGroup.numChildren; ++i) {
			let btn = this.getGroup.getChildAt(i);
			if (!this["mc" + (i + 1)]) {
				this["mc" + (i + 1)] = new MovieClip;
				this["mc" + (i + 1)].touchEnabled = false;
			}
			this["mc" + (i + 1)].x = -12;
			this["mc" + (i + 1)].y = -18;
		}
		this.buy1.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onBuy, this);
		this.buy10.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onBuy, this);
		this.warehouse.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onWarehouse, this);

		for (let i = 0; i < this.maxIndex; ++i) {
			this.AddClick(this.getGroup.getChildAt(i), this.boxClick)
		}

		MessageCenter.addListener(Hunt.postBestListInfo, this.listRefush, this);
		GameGlobal.MessageCenter.addListener(MessageDef.HUNT_ADDRECORD, this.listAddData, this);
		GameGlobal.MessageCenter.addListener(MessageDef.HUNT_BOX_INFO, this.UpdateContent, this);

		this.observe(MessageDef.CHANGE_ITEM, this._ItemUpdate)
		this.observe(MessageDef.DELETE_ITEM, this._ItemUpdate)
		this.observe(UserBag.postItemAdd, this._ItemUpdate)//zy
		this.listRefush([]);
		Hunt.ins().sendHuntList();
		this._ItemUpdate()
		this.updateShowData();
		this.bar.labelDisplay.visible = false
	};
	close() {
		for (let i = 0; i < this.getGroup.numChildren; ++i) {
			if (this["mc" + (i + 1)]) {
				DisplayUtils.dispose(this["mc" + (i + 1)])
				this["mc" + (i + 1)] = null;
			}
		}
		this.buy1.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onBuy, this);
		this.buy10.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onBuy, this);
		MessageCenter.ins().removeAll(this);
	};

	private _ItemUpdate() {
		let count = UserBag.ins().getBagGoodsCountById(UserBag.BAG_TYPE_OTHTER, ItemConst.TREASURE_HUNT)
		this.priceIcon03.text = `(${count}/1)`
		this.priceIcon04.text = `(${count}/10)`

		UIHelper.ShowRedPoint(this.buy1, LegendModel.ins().IsRedItem())
		this._UpdateRedPoint()
	}

	listRefush(datas) {
		this.list.dataProvider = new eui.ArrayCollection(datas);
	};
	listAddData(data) {
		this.list.dataProvider.addItemAt(data, 0)
	}
	onBuy(e) {
		switch (e.target) {
			case this.buy1:
				{
					this.buyHunt(0);
					break;
				}
			case this.buy10:
				{
					this.buyHunt(1);
					break;
				}
			default:
				break;
		}
	};

	buyHunt(type) {
		//过渠道测试，将钻石屏蔽，修改为道具寻宝
		var haveCount = UserBag.ins().getBagGoodsCountById(UserBag.BAG_TYPE_OTHTER, ItemConst.TREASURE_HUNT);
		if (type == 0) {
			if (haveCount >= 1) {
				Hunt.ins().sendHunt(type);
			}
			else {
				UserWarn.ins().setBuyGoodsWarn(ItemConst.TREASURE_HUNT, 1);
			}
		}
		else {
			if (haveCount >= 10) {
				Hunt.ins().sendHunt(type);
			}
			else {
				UserWarn.ins().setBuyGoodsWarn(ItemConst.TREASURE_HUNT, 10 - haveCount);
			}
		}

		if (1) return;//以下代码为正式服代码，渠道测试通过可能会修改回来


		var needYuanbao;
		var haveCount = UserBag.ins().getBagGoodsCountById(UserBag.BAG_TYPE_OTHTER, ItemConst.TREASURE_HUNT);
		if (type == 0) {
			needYuanbao = 0 < haveCount ? 0 : GlobalConfig.ins("TreasureHuntConfig").huntOnce;
		} else {
			var tempNeed = GlobalConfig.ins("TreasureHuntConfig").huntTenth;
			var haveCount = UserBag.ins().getBagGoodsCountById(UserBag.BAG_TYPE_OTHTER, ItemConst.TREASURE_HUNT);
			needYuanbao = 9 < haveCount ? 0 : GlobalConfig.ins("TreasureHuntConfig").huntOnce * (10 - haveCount);
			needYuanbao = tempNeed < needYuanbao && tempNeed || needYuanbao;//超过500钻石是有优惠的
		}
		if (Checker.Money(MoneyConst.yuanbao, needYuanbao, Checker.YUNBAO_FRAME)) {
			Hunt.ins().sendHunt(type);
		}
	};

	UpdateContent(): void {
		this.todayHuntCount.text = GlobalConfig.jifengTiaoyueLg.st100033 + Hunt.ins().todayHuntCount;
		this.bar.value = Hunt.ins().todayHuntCount;
		for (var i = 0; i < this.maxIndex; i++) {
			var state = this.getBoxRewardState(i);
			let btn = this.getGroup.getChildAt(i) as eui.Button;
			// if (state == RewardState.NotReached) {
			// 	let nameStrNum = 7 + i;
			// 	let nameStr = "comp_60_60_0";
			// 	if (nameStrNum >= 10) {
			// 		nameStr = "comp_60_60_";
			// 	}
			// 	btn.icon = nameStr+`${nameStrNum}_png`;
			// 	btn["redPoint"].visible = false;
			// 	btn["stateImg"].visible = false;
			// }
			// else if (state == RewardState.CanGet) {
			// 	btn.icon = `comp_60_60_0${i+1}_png`;
			// 	btn["redPoint"].visible = true;
			// 	btn["stateImg"].visible = false;
			// }
			// else if (state == RewardState.Gotten) {
			// 	btn.icon = `comp_60_60_0${i+1}_png`;
			// 	btn["redPoint"].visible = false;
			// 	btn["stateImg"].visible = true;
			// }
			btn["redPoint"].visible = state == RewardState.CanGet;
			btn["stateImg"].visible = state == RewardState.Gotten;
			this.playEffect(this["mc" + (i + 1)], state == RewardState.CanGet, btn)
		}
		this._UpdateRedPoint()
	}
	playEffect(e: MovieClip, isplay: boolean, btn: eui.Button) {
		// isplay ? (e.loadFile(RES_DIR_EFF + "eff_task_box", !0, 100), this.addChild(e)) : e.parent && DisplayUtils.removeFromParent(e)
		isplay ? (e.loadUrl(ResDataPath.GetUIEffePath("eff_task_box"), true), btn.addChild(e)) : e.parent && DisplayUtils.removeFromParent(e)
	}

	getBoxRewardState(index: number): RewardState {

		var config = GlobalConfig.ins("poolTotalrewardsConfig")[this.poolOtherId][index];
		if (config && Hunt.ins().todayHuntCount < config.time) {
			return RewardState.NotReached;
		}

		if (BitUtil.Has(Hunt.ins().rewardbin, index + 1)) {
			return RewardState.Gotten;
		}

		if (config && Hunt.ins().todayHuntCount >= config.time) {
			return RewardState.CanGet;
		}

		return RewardState.Undo
	}

	private boxClick(e: egret.TouchEvent) {
		let index = this.getGroup.getChildIndex(e.currentTarget);
		var state = this.getBoxRewardState(index);
		var config: Array<any> = GlobalConfig.ins("poolTotalrewardsConfig")[this.poolOtherId];

		let str: string = LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st100034, [config[index].time]);
		ViewManager.ins().open(GetReward2Panel, GlobalConfig.jifengTiaoyueLg.st100035, str, RewardData.ToRewardDatas(config[index].box), () => {
			Hunt.ins().getTreasureDailyAward(index + 1);
		}, state)
	}

	private onWarehouse(e: egret.TouchEvent): void {
		ViewManager.ins().open(TreasureStorePanel);
	}

	private _UpdateRedPoint() {
		UIHelper.ShowRedPoint(this.warehouse, TreasureHuntWin.IsRedPointByWarehouse())
	}

	private updateShowData(): void {
		var config: Array<any> = GlobalConfig.ins("TreasureHuntPoolConfig")[this.rewardId];
		this.item1.data = config[0].id;
		this.item2.data = config[1].id;
		this.item1.showItemEffect();
		this.item2.showItemEffect();
		this.item1.isShowName(false);
		this.item2.isShowName(false);
		this.item1Name.text = this.item1.nameTxt.text
		this.item2Name.text = this.item2.nameTxt.text

		this.dataGroupLeft.dataProvider = new eui.ArrayCollection(this.getPoolReward(2, 7, config));
		this.dataGroupRight.dataProvider = new eui.ArrayCollection(this.getPoolReward(8, 13, config));

		this.boxGroup.visible = this.getGroup.visible = this.poolOtherId != -1;
		if (config) {
			var config: Array<any> = GlobalConfig.ins("poolTotalrewardsConfig")[this.poolOtherId];
			for (let i = 0; i < this.maxIndex; ++i) {
				let btn = this.getGroup.getChildAt(i) as eui.Button;
				let info = config[i];
				btn["count"].text = info.time;
				// btn.x = 350*config.time/GlobalConfig.ins("poolTotalrewardsConfig")[this.getGroup.numChildren].time - btn.width/2;
			}
			this.bar.maximum = config[this.maxIndex - 1].time;
		}
	}

	private getPoolReward(s, e, config) {
		let list = [];
		for (let i = s; i <= e; ++i) {
			let id = config[i].id;
			list.push(id);
		}
		return list;
	}
}
window["TreasureHuntPanel"] = TreasureHuntPanel