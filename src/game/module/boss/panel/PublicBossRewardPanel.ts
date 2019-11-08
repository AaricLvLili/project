class PublicBossRewardPanel extends BaseEuiPanel {

	public static LAYER_LEVEL = LayerManager.UI_Popup

	bossTitle: eui.Label
	curName: eui.Label
	list: eui.List
	challenge: eui.Button
	list1: eui.List
	//private dialogCloseBtn: eui.Button;
	item: ItemBase;
	private chanceTxt: eui.Label
	private languageTxt: eui.Label;
	private languageTxt0: eui.Label;
	private languageTxt1: eui.Label;

	public constructor() {
		super()
		this.skinName = "PublicBossRewardSkin"
	}

	initUI() {
		super.initUI();
		this.list.itemRenderer = ItemBase
		this.list1.itemRenderer = ItemBase
		this.languageTxt.text = GlobalConfig.jifengTiaoyueLg.st101820;
		this.languageTxt0.text = GlobalConfig.jifengTiaoyueLg.st100525;
		this.languageTxt1.text = GlobalConfig.jifengTiaoyueLg.st101821;
		this.challenge.label = GlobalConfig.jifengTiaoyueLg.st101692;
	}

	open(...param: any[]) {
		let bossId = param[0]
		this.m_bg.init(`PublicBossRewardPanel`, GlobalConfig.jifengTiaoyueLg.st101387)
		//this.dialogCloseBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.OnClose, this);
		let config = null;
		let bossConfig;
		if (GameMap.IsPublicBoss() || GameMap.IsHomeBoss())
			bossConfig = GlobalConfig.publicBossConfig;
		else if (GameMap.IsSyBoss()) {
			bossConfig = GlobalConfig.ins("PaidBossConfig");
		}
		else
			bossConfig = GlobalConfig.kuafuBossConfig;

		var temp: Array<any>;
		for (let key in bossConfig) {
			if (config) break;
			temp = bossConfig[key];
			for (var i: number = 0; i < temp.length; i++)
				if (temp[i] && temp[i].bossId == bossId) {
					config = temp[i];
					break;
				}
		}
		if (config == null) {
			return
		}

		this.AddClick(this.challenge, this._OnClick)
		this.observe(MessageDef.PUBLIC_BOSS_OWNER_CHNAGE, this._UpdateOwner)

		if (config.zsLevel > 0) {
			this.bossTitle.text = LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st101367, [config.zsLevel])
		} else {
			this.bossTitle.text = LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st101368, [config.level])
		}

		if (GameMap.IsPublicBoss()) {
			BossItem.SetRewardData(this.item, this.chanceTxt, config)
			this.bossTitle.text += GlobalConfig.jifengTiaoyueLg.st101388
		} else if (GameMap.IsHomeBoss()) {
			BossItem.SetRewardData(this.item, this.chanceTxt, config)
			this.bossTitle.text += GlobalConfig.jifengTiaoyueLg.st100467
		} else if (GameMap.IsSyBoss()) {
			BossItem.SetRewardData(this.item, this.chanceTxt, config)
			this.bossTitle.text += GlobalConfig.jifengTiaoyueLg.st100524;
		}
		else {
			KfBossItem.SetRewardData(this.item, this.chanceTxt, config)
			this.bossTitle.text += GlobalConfig.jifengTiaoyueLg.st101389
		}

		this.list.dataProvider = new eui.ArrayCollection(config.desc);
		this.list1.dataProvider = new eui.ArrayCollection(config.desc);

		this._UpdateOwner()
	}

	close() {
		//this.dialogCloseBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.OnClose, this)
	}
	private OnClose(e: egret.TouchEvent) {
		ViewManager.ins().close(this);
	}

	private _UpdateOwner() {
		let data = UserBoss.ins().GetCurOwnerData()
		if (data && data.name && data.name != "") {
			this.curName.text = data.name
		} else {
			this.curName.text = GlobalConfig.jifengTiaoyueLg.st100280
		}
	}

	private _OnClick() {
		BossOwnerInfo.ClickOwner()
	}
}

window["PublicBossRewardPanel"] = PublicBossRewardPanel