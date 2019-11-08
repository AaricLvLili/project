class EncounterInfoWin extends BaseView implements ICommonWindowTitle {

	recordBtn: eui.Button
	mibaoBtn: eui.Button;
	//mb_dian:eui.Image;

	private refreshGroup: eui.Group
	private refreshLabel: eui.Label
	private surplusCount: eui.Label
	private buyCountBtn: eui.Group;
	private consumeLabel: PriceIcon
	private refreshBtn: eui.Group;
	private roleItems: eui.Group
	private m_RoleItems: EncounterRoleItem[];
	// private fc_dian:eui.Image
	private newsGroup: eui.Group
	private newsLabel: eui.Label

	private m_SurplusCountStr = ""

	public dayPrestige: eui.Label;
	public rank: eui.Label;
	public money: PriceIcon;
	public prestige: PriceIcon;
	public m_Lan1: eui.Label;
	public m_Lan2: eui.Label;
	public m_Lan3: eui.Label;

	private m_RankComp: {
		dayPrestige: eui.Label,
		rank: eui.Label,
		money: PriceIcon,
		prestige: PriceIcon,
	}
	windowTitleIconName: string = "LPKR"
	public constructor() {
		super()
		this.name = "PK"
		this.skinName = "ZaoYuSkin"
		// this.layerLevel = VIEW_LAYER_LEVEL.TOP;

		// this.myFace.source = "head_" + GameGlobal.rolesModel[0].job + GameGlobal.rolesModel[0].sex
		// this.listData = new eui.ArrayCollection
		// this.list.dataProvider = this.listData
		//资源回收lxh
		// for (let i = 0; i < this.roleItems.numChildren; i++) {
		// 	this.m_RoleItems.push(new EncounterRoleItem(this.roleItems.getChildAt(i)))
		// }
		this.mibaoBtn.label = GlobalConfig.jifengTiaoyueLg.st100555;
		this.m_Lan1.text = GlobalConfig.jifengTiaoyueLg.st100556;
		this.recordBtn.label = GlobalConfig.jifengTiaoyueLg.st100557;
		this.m_Lan2.text = GlobalConfig.jifengTiaoyueLg.st100492;
		this.m_Lan3.text = GlobalConfig.jifengTiaoyueLg.st100558;
	}
	private chaptersConfig: any;
	open() {
		// App.ControllerManager.applyFunc(ControllerConst.Encounter, EncounterFunc.SEND_INQUIRE_PRESTIGE)
		this.m_RoleItems = [];
		for (let i = 0; i < this.roleItems.numChildren; i++) {
			this.m_RoleItems.push(new EncounterRoleItem(this.roleItems.getChildAt(i)))
		}

		this.updatePrestigeRank()
		Encounter.ins().sendInquireRecord()
		Encounter.ins().sendInquirePrestige()
		// this.setData()
		// this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this)
		// this.addTouchEvent(this, this.onTap, this)
		this.AddClick(this.refreshBtn, this.onTap)
		this.AddClick(this.recordBtn, this.onTap)
		this.AddClick(this.buyCountBtn, this.onTap)
		this.AddClick(this.mibaoBtn, this.onTap)
		this.AddClick(this.newsGroup, this.onTap)
		// this.observe(Encounter.ins().postEncounterDataChange, this.setData)
		this.observe(MessageDef.ENCOUNTER_DATA_CHANGE, this.UpdateContent)
		this.observe(Encounter.ins().postDataUpdate, this.updatePrestigeRank)
		this.observe(MessageDef.ENCOUNTER_NEWS, this.UpdateNews)
		for (let item of this.m_RoleItems) {
			this.AddClick(item.mItem as any, this._RoleItemClick)
		}
		TimerManager.ins().doTimer(1000, 0, this._RefreshTime, this);

		if (this.chaptersConfig == null)
			this.chaptersConfig = GlobalConfig.ins("ChaptersConfig");

		let config = this.chaptersConfig[UserFb.ins().guanqiaID];
		if (config == null) return;
		this.UpdateNews()
		this.updateData()
	}

	close() {
		this.newsLabel.text = ""
		egret.Tween.removeTweens(this.newsLabel)
		this.removeEvents()
		this.removeObserve()
		var len = this.m_RoleItems.length;
		for (let i = 0; i < len; i++) {
			this.m_RoleItems[i].dispose();
			this.m_RoleItems[i] = null;
		}
		this.m_RoleItems = null;
		TimerManager.ins().removeAll(this)
	}

	private _SetLabelText() {
		if (Encounter.ins().pkCount >= GlobalConfig.ins("PublicPkrednamebaseConfig").residuedegree) {
			this.surplusCount.text = this.m_SurplusCountStr
		} else {
			this.surplusCount.text = this.m_SurplusCountStr + `(${GameServer.GetSurplusTime(Encounter.ins().nextTime)}` + GlobalConfig.jifengTiaoyueLg.st100543 + `)`
		}
		this.refreshLabel.text = `${GameServer.GetSurplusTime(Encounter.ins().lastTime)}` + GlobalConfig.jifengTiaoyueLg.st100544;
	}

	private _RefreshTime() {
		this._SetLabelText()
	}

	updatePrestigeRank() {
		let encounter = Encounter.ins()
		this.m_SurplusCountStr = encounter.pkCount + "/" + GlobalConfig.ins("PublicPkrednamebaseConfig").residuedegree
		this._SetLabelText();
	}

	private _RoleItemClick(e: egret.TouchEvent) {
		if (!(e.target instanceof eui.Button)) {
			return
		}
		let index = -1
		for (let i = 0; i < this.m_RoleItems.length; ++i) {
			if (this.m_RoleItems[i].mItem == e.currentTarget) {
				index = i
				break
			}
		}
		if (index != -1) {
			if (!GameMap.IsNoramlLevel()) {
				UserTips.ErrorTip(GlobalConfig.jifengTiaoyueLg.st100545)
				return
			}
			if (Encounter.ins().pkCount < 1) {
				UserTips.ErrorTip(GlobalConfig.jifengTiaoyueLg.st100546)
				return
			}
			let data = this.m_RoleItems[index].mData
			if (data.state == EncounterModelState.PROTECT) {
				UserTips.ErrorTip(GlobalConfig.jifengTiaoyueLg.st100547)
				return
			}
			if (data.state == EncounterModelState.FIGHT) {
				UserTips.ErrorTip(GlobalConfig.jifengTiaoyueLg.st100548)
				return
			}
			Encounter.ins().sendFightResult(data.index);
			// ViewManager.ins().close(EncounterWin)
		}
	}

	onTap(e): void {
		switch (e.target) {
			case this.newsGroup:
				ViewManager.ins().open(EncounterNewsPanel)
				break
			case this.recordBtn:
				ViewManager.ins().open(ZaoYuRecordWin)
				break
			case this.mibaoBtn:
				ViewManager.ins().open(ZaoYuItemWin)
				break
			case this.refreshBtn: {
				if (Checker.Money(this.consumeLabel.type, this.consumeLabel.price)) {
					Encounter.ins().sendRefresh()
				} else {
					UserTips.ins().showTips(GlobalConfig.jifengTiaoyueLg.st100222);
				}
			} break
			case this.buyCountBtn: {
				let yunbao = Encounter.ins().buyPKConsume
				let maxCount = GlobalConfig.ins("PublicPkrednamebaseConfig").maxBuy
				if (Encounter.ins().isTipsFlag) //本次登录不需要弹确认框了
				{
					if (Encounter.ins().buyPKCount >= maxCount) {
						UserTips.ErrorTip(GlobalConfig.jifengTiaoyueLg.st100427)
					}
					else if (Checker.Money(MoneyConst.yuanbao, yunbao)) {
						Encounter.ins().SendBuyPKCount()
					}
				}
				else {
					let tips = LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st100549, [yunbao]) + `${Encounter.ins().buyPKCount}/${maxCount}`;
					if (Encounter.ins().isTipsFlag == false)
						tips = tips + "\n\n<font color='#FFB82A'>" + GlobalConfig.jifengTiaoyueLg.st100550;
					WarnWin.show(tips, () => {
						Encounter.ins().isTipsFlag = true;
						if (Encounter.ins().buyPKCount >= maxCount) {
							UserTips.ErrorTip(GlobalConfig.jifengTiaoyueLg.st100427)
							return true
						}
						if (Checker.Money(MoneyConst.yuanbao, yunbao)) {
							Encounter.ins().SendBuyPKCount()
							return false
						}
						return true
					}, this)
				}
			} break
		}
	}

	UpdateContent(): void {
		let zyPos = [{ x: 13, y: 25 }, { x: 26, y: 25 }, { x: 24, y: 14 }, { x: 14, y: 15 }];

		if (this.chaptersConfig == null)
			this.chaptersConfig = GlobalConfig.ins("ChaptersConfig");

		let config = this.chaptersConfig[UserFb.ins().guanqiaID];
		if (config == null) return;
		let sceneConfig = GlobalConfig.ins("ScenesConfig")[config.sid]

		zyPos = sceneConfig ? (sceneConfig.zyPos || zyPos) : zyPos
		let w = sceneConfig ? sceneConfig.sizeX : 44
		let h = sceneConfig ? sceneConfig.sizeY : 44

		let encounterModelDict = Encounter.ins().encounterModel
		let index = 0
		for (let key in encounterModelDict) {
			let modelData = encounterModelDict[key]
			if (!modelData) {
				continue
			}
			let item = this.m_RoleItems[index]
			if (!item) {
				break
			}
			item.visible = true
			item.SetData(modelData)
			let pos = zyPos[index]
			item.SetPos(Math.floor(pos.x / w * 445), Math.floor(pos.y / h * 288))
			++index
		}
		for (let i = index; i < this.m_RoleItems.length; ++i) {
			this.m_RoleItems[i].visible = false
		}
		this.consumeLabel.type = MoneyConst.gold
		this.consumeLabel.price = GlobalConfig.ins("PublicPkrednamebaseConfig").refreshCost
	}

	private lookfc_dian(datas: EncounterRecordData[]) {
		let res = datas
		//this.fc_dian.visible=false
		this.recordBtn["redPoint"].visible = false;
		for (let i = 0; i < res.length; i++) {
			if (res[i].beRob != null && !res[i].beRob.isRevenge) {
				//this.fc_dian.visible=true
				this.recordBtn["redPoint"].visible = true;
			}
		}
	}
	private UpdateNews() {
		this.observe(Encounter.postZaoYuRecord, this.lookfc_dian)
		Encounter.ins().sendInquireRecord()
		this.lookfc_dian(Encounter.ins().inquireRecord)
		let news = Encounter.ins().News
		if (news == null) {
			let c = ItemBase.QUALITY_COLOR_STR[4]
			// |C:${}&T:${itemConfig.name}|
			this.newsLabel.textFlow = TextFlowMaker.generateTextFlow(LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st100551, [c, c, c]))
		} else {
			this.newsLabel.textFlow = EncounterNewsPanel.GetInfoLabel(news.itemId, news.name)
		}
		// this.newsGroup.visible = true
		this.newsLabel.x = 444
		egret.Tween.removeTweens(this.newsLabel)
		var t = egret.Tween.get(this.newsLabel);
		t.to({ "x": - this.newsLabel.width }, (this.newsLabel.x + this.newsLabel.width) * 25).call(() => {
			egret.Tween.removeTweens(this.newsLabel);
			this.UpdateNews()
		}, this);

	}

	public CheckRedPoint() {
		let flg: boolean = Encounter.CheckRedPointByType(EncounterRedPointType.ITEM);
		//this.mb_dian.visible = flg;
		this.mibaoBtn["redPoint"].visible = flg;
		return Encounter.CheckRedPointByType(EncounterRedPointType.PK) || flg;
	}
	//更新排名
	private updateData() {
		let encounter = Encounter.ins();
		let prestige = encounter.prestige
		let rank = encounter.rank
		this.dayPrestige.text = GlobalConfig.jifengTiaoyueLg.st100552 + prestige
		this.rank.text = 0 == rank ? GlobalConfig.jifengTiaoyueLg.st100553 : LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st100554, [rank]);
		this.money.type = MoneyConst.gold
		this.prestige.type = MoneyConst.soul
		this.money.text = "0"
		this.prestige.text = "0"
		var publicPkrednamerankConfig = GlobalConfig.ins("PublicPkrednamerankConfig");
		for (var i in publicPkrednamerankConfig) {
			let configData = publicPkrednamerankConfig[i]
			if (configData.minRank <= rank && configData.maxRank >= rank) {
				this.money.text = configData.rewards[1].count + ""
				this.prestige.text = configData.rewards[0].count + ""
				break
			}
		}
	}

	public static openCheck() {
		return Deblocking.Check(DeblockingType.TYPE_07)
	}
}

class EncounterRoleItem {
	public mItem: {
		name: eui.Label
		lv: eui.Label
		group_mc: eui.Group;
		head: EncounterRoleHead
		stateImg: eui.Image
		btnLoot: eui.Button;
	}

	// public mItem: EncounterRoleHead
	public mData: EncounterModel
	private mc: MovieClip;

	public dispose() {
		DisplayUtils.dispose(this.mc);
		this.mc = null;
		this.mData = null;
		this.mItem = null;
	}

	public set visible(value) {
		(this.mItem as any).visible = value
	}

	public SetPos(x: number, y: number) {
		let item = <any>this.mItem as eui.Component
		item.x = x - 85 * 0.5
		item.y = y - 115 * 0.5

		// _Log(item.x, item.y)
	}

	public constructor(comp) {
		this.mItem = comp
		comp.btnLoot.label = GlobalConfig.jifengTiaoyueLg.st100559;
	}
	public SetData(data: EncounterModel) {
		this.mData = data
		this.mItem.name.text = data.name
		// this.mc = new MovieClip;
		// this.mc.x = 46;
		// this.mc.y = 5;//lxh资源
		// this.mc.loadUrl(ResDataPath.GetUIEffePath("ketiaozhan"), true, -1);
		// this.mItem.group_mc.addChild(this.mc);

		this.mItem.lv.text = ResDataPath.GetLvName(data.zsLv, data.lv)
		this.mItem.stateImg.visible = data.state == EncounterModelState.CAN_PK
		this.mItem.head.SetData(data)

	}
}

class EncounterRoleHead extends eui.Component {
	icon: eui.Image
	// roleName: eui.Label
	// lv: eui.Label
	rewardGroup: eui.Group
	rewardCount: eui.Label
	itemImg: eui.Image
	public m_ElementImg: eui.Image;


	public SetData(data: EncounterModel) {
		// this.roleName.text = data.name
		// this.lv.text = ResDataPath.GetLvName(data.zsLv, data.lv)
		// this.m_Item.icon.source = ResDataPath.GetHeadMiniImgName(data.job, data.sex)

		this.SetHead(data.job, data.sex)
		this.SetCount(data.itemCount, data.itemId)
		if (data.mainEle) {
			this.m_ElementImg.visible = true;
			this.m_ElementImg.source = ResDataPath.GetElementImgName(data.mainEle);
		} else {
			this.m_ElementImg.visible = false;
		}
	}

	public SetHead(job: number, sex: number) {
		this.icon.source = ResDataPath.GetHeadMiniImgName(job, sex)
	}

	public SetCount(count: number, itemId: number): void {
		if (this.rewardGroup.visible = count > 0) {
			this.rewardCount.text = count.toString()
			let config = GlobalConfig.itemConfig[itemId]
			this.itemImg.source = ResDataPath.GetItemFullName(config ? config.icon : "600001")
		}
	}
}

ViewManager.ins().reg(EncounterInfoWin, LayerManager.UI_Main);
window["EncounterInfoWin"] = EncounterInfoWin
window["EncounterRoleItem"] = EncounterRoleItem
window["EncounterRoleHead"] = EncounterRoleHead