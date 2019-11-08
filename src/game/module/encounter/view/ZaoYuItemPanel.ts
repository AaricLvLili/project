class ZaoYuItemPanel extends BaseView implements ICommonWindowTitle {

	private list: eui.List
	private revengeGroup: eui.Group
	private curTitle: eui.Label
	private revenge: eui.Label
	private broadcast: eui.Label
	private curRedPointValue: eui.Label
	private surplusTime: eui.Label
	private clearRedPoint: eui.Label
	private progressGroup: eui.Group
	private noGoods: eui.Label
	private noGoodsGroup: eui.Group
	private gotoBtn: eui.Button
	private curStateLabel: eui.Label

	private m_Shape: egret.Shape

	private m_ShowIndex: number = 0
	public m_Lan1: eui.Label;
	public m_AnimGroup: eui.Group;
	private mc: MovieClip;
	private static get TIP_LIST() {
		let list = [
			GlobalConfig.jifengTiaoyueLg.st100565,
			GlobalConfig.jifengTiaoyueLg.st100566,
			GlobalConfig.jifengTiaoyueLg.st100567,
		]
		return list;
	}

	// private static STATE_LIST = [
	// 	"被击败极小概率掉落秘宝",
	// 	"被击败可能掉落秘宝",
	// 	"被击败较大概率掉落秘宝",
	// 	"被击败必然掉落秘宝",
	// ]

	public constructor() {
		super()
		this.skinName = "ZaoYuItemPanelSkin"
		this.name = GlobalConfig.jifengTiaoyueLg.st100555;
		this.list.itemRenderer = ZaoYuItemPanelItem

		this.m_Lan1.text = GlobalConfig.jifengTiaoyueLg.st100574;
		this.revenge.text = GlobalConfig.jifengTiaoyueLg.st100575;
		this.clearRedPoint.text = GlobalConfig.jifengTiaoyueLg.st100576;
		this.noGoods.text = GlobalConfig.jifengTiaoyueLg.st100577;
		this.gotoBtn.label = GlobalConfig.jifengTiaoyueLg.st100578;
	}

	public open() {
		TimerManager.ins().doTimer(1000, 0, this._Update, this)
		this.AddClick(this.clearRedPoint, this._OnClick)
		this.AddClick(this.revenge, this._OnClick)
		this.AddClick(this.gotoBtn, this._OnClick)
		this.observe(MessageDef.ENCOUNTER_ITEM_INFO_UPDATE, this.UpdateContent);
		this.observe(MessageDef.PK_BOX_OPEN, this.playAnim);
		this.UpdateContent()
		Encounter.ins().SendGetItemInfo()
		Encounter.ins().ClearNewItem()
	}

	public close() {
		TimerManager.ins().removeAll(this)
		this.clearRedPoint.removeEventListener(egret.TouchEvent.TOUCH_TAP, this._OnClick, this)
		this.removeObserve()
		Encounter.ins().ClearNewItem()
		if (this.mc) {
			DisplayUtils.dispose(this.mc);
			this.mc = null;
		}
	}

	private _OnClick(e: egret.TouchEvent) {
		// Encounter.ins()["m_RedPoint"] = Encounter.ins()["m_RedPoint"] + 1
		// this._CreateProgress()

		// let data = new ZaoYuRedPointItem(200301)
		// UseShopItemPanel.Show("清除红名点", [data], [MessageDef.ENCOUNTER_ITEM_INFO_UPDATE])
		switch (e.target) {
			case this.clearRedPoint:
				let configData = GlobalConfig.ins("PublicPkrednamebaseConfig")
				UseShopItemPanel.Show(GlobalConfig.jifengTiaoyueLg.st100568, [
					new ZaoYuRedPointItem(configData.advanceredpill),
					new ZaoYuRedPointItem(configData.superredpill)
				], [MessageDef.ENCOUNTER_ITEM_INFO_UPDATE])
				break

			case this.revenge:
				/*
				let recentData = Encounter.ins().GetRecentRevenge()
				if (recentData == null) {
					return
				}
				Encounter.ins().SendRevenge(recentData.index);
				ViewManager.ins().close(EncounterWin)
				*/
				ViewManager.ins().open(ZaoYuRecordWin)
				break

			case this.gotoBtn:
				ViewManager.ins().close(ZaoYuItemWin)
				break
		}
	}

	private static START_PRO = -300
	private static START_CHUNK = 418

	private _CreateProgress() {
		let shape = this.m_Shape
		if (!shape) {
			shape = new egret.Shape();
			this.m_Shape = shape
			this.progressGroup.addChild(shape);
		}
		let point = Encounter.ins().redPoint;
		if (this.progressGroup == null)
			return;
		let width = this.progressGroup.width
		let height = this.progressGroup.height
		var graphics = shape.graphics;
		graphics.clear()
		var m = egret.Matrix.create();

		let progress = ZaoYuItemPanel.START_PRO
		if (point <= 100) {
			progress = ZaoYuItemPanel.START_PRO + (point * 0.01) * ZaoYuItemPanel.START_CHUNK
		} else {
			progress = ZaoYuItemPanel.START_PRO + ZaoYuItemPanel.START_CHUNK + (1 - 100 / point) * ZaoYuItemPanel.START_CHUNK * 0.5
		}

		m.createGradientBox(width, height, 50, progress);
		graphics.beginGradientFill(egret.GradientType.LINEAR, [0x1f7005, 0x1f7005, 0x1f7005], [1, 1, 1], [0, 125, 255], m);
		graphics.drawRect(0, 0, width, height)
		graphics.endFill();
	}

	private m_TempCounter = 0

	private _Update() {
		if (this.m_TempCounter++ % 6 == 0) {
			this.broadcast.text = ZaoYuItemPanel.TIP_LIST[this.m_ShowIndex++ % 3]
		}
		for (let i = 0; i < this.list.numChildren; ++i) {
			let item = this.list.getChildAt(i) as any
			if (item && item.UpdateTime) {
				item.UpdateTime()
			}
		}
		this.surplusTime.text = `${GameServer.GetSurplusTime(Encounter.ins().redPointTimestamp, DateUtils.TIME_FORMAT_5, 4)} ` + GlobalConfig.jifengTiaoyueLg.st100569;
	}

	UpdateContent(): void {
		let encounter = Encounter.ins()

		this.curRedPointValue.text = `${encounter.redPoint}`
		//this.surplusTime.visible = encounter.redPoint > 0
		this.surplusTime.visible = false

		let publicPkrednameData = ZaoYuItemPanel.GetPKRedConfig(encounter.redPoint)
		this.curStateLabel.text = publicPkrednameData.statedesc
		// this.surplusTime.text = `${GameServer.GetSurplusTime(encounter.redPointTimestamp)} 后解除红名状态`

		this.noGoodsGroup.visible = encounter.encounterItem.length == 0
		this.list.dataProvider = new eui.ArrayCollection(encounter.encounterItem)

		let recentData = encounter.GetRecentRevenge()
		if (recentData) {
			this.curTitle.text = `${recentData.beRob.actorData.name}` + GlobalConfig.jifengTiaoyueLg.st100570
			this.revengeGroup.visible = true
			this.list.top = this.revengeGroup.height
			this.revenge.visible = true
		} else {
			this.revengeGroup.visible = false
			this.revenge.visible = false
			this.list.top = 0
		}

		this._CreateProgress()
		this._Update()
	}

	public static GetPKRedConfig(redPoint: number): any {
		let lv = 4
		let publicPkrednameConfig = GlobalConfig.ins("PublicPkrednameConfig")
		for (let key in publicPkrednameConfig) {
			let data = publicPkrednameConfig[key]
			if (redPoint <= data.maxredNum) {
				lv = data.level
				break
			}
		}
		return publicPkrednameConfig[lv]
	}

	public CheckRedPoint() {
		return Encounter.CheckRedPointByType(EncounterRedPointType.ITEM)
	}

	private playAnim(t, cust, count, data) {
		if (!this.mc) {
			this.mc = new MovieClip();
			this.mc.touchEnabled=false;
		}
		this.mc.visible = true;
		this.mc.loadUrl(ResDataPath.GetUIEffePath("eff_box_open"), true, 1, () => {
			if (t > 0) {
				let yuanbao = cust * Math.ceil(t / 60)
				WarnWin.show(LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st100571, [yuanbao]), () => {
					if (Checker.Money(MoneyConst.yuanbao, yuanbao) && BagFullTipsPanel.CheckOpen(count)) {
						Encounter.ins().SendOpenItem(data.handle)
					}
				}, this)
			} else {
				if (BagFullTipsPanel.CheckOpen(count)) {
					Encounter.ins().SendOpenItem(data.handle)
				}
			}
			this.mc.visible = false;
		});
		this.m_AnimGroup.addChild(this.mc);
	}
}

class ZaoYuItemPanelItem extends eui.ItemRenderer {

	private openBtn: eui.Button
	private item: ItemBase
	private time: eui.Label
	private newFlag: eui.Image

	public childrenCreated() {
		this.openBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnClick, this)
	}

	private OnClick() {

	}
	private _OnClick() {
		let data = this.data as Sproto.encounter_item_data;
		let t = data.timestamp - GameServer.serverTime
		let itemConfigData = GlobalConfig.itemConfig[data.itemId || 600001]
		let cust = GlobalConfig.ins("PublicPkrednamebaseConfig").custper[itemConfigData.quality]
		let count = 3

		//橙色秘宝有开启动画
		if (itemConfigData.quality == 4) {
			MessageCenter.ins().dispatch(MessageDef.PK_BOX_OPEN, t, cust, count, data);
		}
		else {
			if (t > 0) {
				let yuanbao = cust * Math.ceil(t / 60)
				WarnWin.show(LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st100571, [yuanbao]), () => {
					if (Checker.Money(MoneyConst.yuanbao, yuanbao) && BagFullTipsPanel.CheckOpen(count)) {
						Encounter.ins().SendOpenItem(data.handle)
					}
				}, this)
			} else {
				if (BagFullTipsPanel.CheckOpen(count)) {
					Encounter.ins().SendOpenItem(data.handle)
				}
			}
		}

	}

	public dataChanged() {
		let data = this.data as Sproto.encounter_item_data
		this.UpdateTime()
		this.item.clear()
		this.item.data = data.itemId || 600001
		// if (this.time.visible = GameServer.serverTime < data.timestamp) {
		// 	this.openBtn.label = "快速开启"
		// } else {
		// 	this.openBtn.label = "开启"
		// }
		this.newFlag.visible = Encounter.ins().IsNewItem(data.handle)
	}

	public UpdateTime() {
		let time = this.data ? this.data.timestamp : 0
		if (this.time.visible = GameServer.serverTime < time) {
			this.openBtn.label = GlobalConfig.jifengTiaoyueLg.st100572;
		} else {
			this.openBtn.label = GlobalConfig.jifengTiaoyueLg.st100391;
		}
		this.time.text = `${GameServer.GetSurplusTime(this.data.timestamp)}` + GlobalConfig.jifengTiaoyueLg.st100573;
	}
}

class ZaoYuRedPointItem implements IUseShopItemAdapter {

	private m_ItemId: number
	public constructor(itemId: number) {
		this.m_ItemId = itemId
	}

	GetItemId(): number {
		return this.m_ItemId
	}

	// GetSurplusCount(): number {
	// 	return 0
	// }

	// GetToDayStr(): string {
	// return "今日还可以使用{0}次"
	// }

	GetDes(): string {
		// return "清除红名点"
		return null
	}

	DoUse(): void {
		Encounter.ins().SendClearRedPoint(this.m_ItemId)
	}
}
window["ZaoYuItemPanel"] = ZaoYuItemPanel
window["ZaoYuItemPanelItem"] = ZaoYuItemPanelItem
window["ZaoYuRedPointItem"] = ZaoYuRedPointItem