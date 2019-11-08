class FindAssetsPanel extends eui.Component {

	private list: eui.List
	private getallFlag: eui.Image
	private onekeyYb: eui.Button
	private onkeyGold: eui.Button
	public m_Lan1: eui.Label;

	public constructor() {
		super()
		this.skinName = "FindAssetsPanelSkin"
		this.list.itemRenderer = FindAssetsItem
		this.m_Lan1.text = GlobalConfig.jifengTiaoyueLg.st101305;
		this.onekeyYb.label = GlobalConfig.jifengTiaoyueLg.st101306;
		this.onkeyGold.label = GlobalConfig.jifengTiaoyueLg.st101307;
	}

	public open() {
		this.onekeyYb.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnClick, this)
		this.onkeyGold.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnClick, this)
		GameGlobal.MessageCenter.addListener(MessageDef.FIND_ASSETS_UPDATE, this._DoEvent, this)
		FindAssetsModel.ins().SendInit()
		this.UpdateContent()
	}

	public close() {
		this.onekeyYb.removeEventListener(egret.TouchEvent.TOUCH_TAP, this._OnClick, this)
		this.onkeyGold.removeEventListener(egret.TouchEvent.TOUCH_TAP, this._OnClick, this)
		GameGlobal.MessageCenter.removeListener(MessageDef.FIND_ASSETS_UPDATE, this._DoEvent, this)
	}

	private _DoEvent() {
		this.UpdateContent()
	}

	private _OnClick(e: egret.TouchEvent) {
		let useType = null
		switch (e.currentTarget) {
			case this.onekeyYb:
				useType = MoneyConst.yuanbao
				break;

			case this.onkeyGold:
				useType = MoneyConst.gold
				break
		}
		if (useType) {
			let retrieveConfig = GlobalConfig.ins("RetrieveConfig")
			let consume = 0
			let types = []
			for (let data of FindAssetsModel.ins().assets) {
				if (data.state == FindAssetsState.NONE) {
					types.push(data.type)
					let configData = retrieveConfig[data.type]
					let c = useType == MoneyConst.yuanbao ? configData.yuanbao : configData.gold
					c = c * data.size
					consume += c
				}
			}
			FindAssetsPanel.FindAssetsTip(true, useType, consume, () => {
				if (Checker.Money(useType, consume)) {
					for (let assetType of types) {
						FindAssetsModel.ins().SendAssetsGet(assetType, useType)
					}
				}
			}, null)
		}
	}

	private UpdateContent() {
		let datas = FindAssetsModel.ins().assets

		if (datas.length > 0) {
			this.getallFlag.visible = true
			for (let data of datas) {
				if (data.state == FindAssetsState.NONE) {
					this.getallFlag.visible = false
					break
				}
			}
		} else {
			this.getallFlag.visible = false
		}
		this.onekeyYb.enabled = !this.getallFlag.visible;
		this.onkeyGold.enabled = !this.getallFlag.visible;
		this.list.dataProvider = new eui.ArrayCollection(datas)
	}

	public static FindAssetsTip(isAll: boolean, type: number, count: number, func, obj) {
		let moneyTypeStr = type == MoneyConst.gold ? GlobalConfig.jifengTiaoyueLg.st100018 : GlobalConfig.jifengTiaoyueLg.st100050;
		let str = isAll ? GlobalConfig.jifengTiaoyueLg.st100288 : ''
		let tipStr = LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st101301, [count, moneyTypeStr, str]);
		WarnWin.show(tipStr, func, obj)
	}
}

class FindAssetsItem extends eui.ItemRenderer {
	static get NAME_TITLE() {
		let list = {
			[1]: GlobalConfig.jifengTiaoyueLg.st101302,
			[2]: GlobalConfig.jifengTiaoyueLg.st101303,
			[3]: GlobalConfig.jifengTiaoyueLg.st100349,
			[4]: GlobalConfig.jifengTiaoyueLg.st100362,
			[5]: GlobalConfig.jifengTiaoyueLg.st101304,
			[6]: "",
			[7]: "",
		}
		return list;
	}
	private title: eui.Label
	private group: eui.Group
	private ybGet: eui.Button
	private goldGet: eui.Button
	private getFlag: eui.Image
	private m_ItemBase: ItemBase[]
	public m_Lan1: eui.Label;

	protected childrenCreated() {
		this.m_ItemBase = this.group.$children as ItemBase[]
		this.ybGet.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnClick, this)
		this.goldGet.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnClick, this)
		this.m_Lan1.text = GlobalConfig.jifengTiaoyueLg.st101308;
		this.ybGet.label = GlobalConfig.jifengTiaoyueLg.st101306;
		this.goldGet.label = GlobalConfig.jifengTiaoyueLg.st101307;
	}

	private _OnClick(e: egret.TouchEvent) {
		let data: Sproto.find_assets_data = this.data
		if (data.state != FindAssetsState.NONE) {
			return
		}
		let useType = null
		switch (e.currentTarget) {
			case this.ybGet:
				useType = MoneyConst.yuanbao
				break;

			case this.goldGet:
				useType = MoneyConst.gold
				break
		}
		if (useType) {
			let assetsType = data.type
			let configData = GlobalConfig.ins("RetrieveConfig")[assetsType]
			let consume = useType == MoneyConst.yuanbao ? configData.yuanbao : configData.gold
			consume = consume * ((data.size == null || data.size == 0) ? 1 : data.size)
			FindAssetsPanel.FindAssetsTip(false, useType, consume, () => {
				if (Checker.Money(useType, consume)) {
					FindAssetsModel.ins().SendAssetsGet(assetsType, useType)
				}
			}, null)
		}
	}

	protected dataChanged(): void {
		let data: Sproto.find_assets_data = this.data
		this.title.text = FindAssetsItem.NAME_TITLE[data.type]
		let isGet = data.state == FindAssetsState.GET
		this.getFlag.visible = isGet
		this.ybGet.enabled = !isGet
		this.goldGet.enabled = !isGet
		let config = GlobalConfig.ins("RetrieveConfig")[data.type]
		let rewardConfig
		if (config) {
			rewardConfig = config.showreward
		} else {
			rewardConfig = []
		}
		for (let i = 0; i < this.m_ItemBase.length; ++i) {
			let item = this.m_ItemBase[i]
			let rewardConfigData = rewardConfig[i]
			if (rewardConfigData) {
				item.visible = true
				let reward = new RewardData()
				reward.id = rewardConfigData.id
				reward.type = rewardConfigData.type
				reward.count = rewardConfigData.count
				item.data = reward
				item.showLegendEffe();
			} else {
				item.visible = false
			}
		}
	}
}
window["FindAssetsPanel"] = FindAssetsPanel
window["FindAssetsItem"] = FindAssetsItem