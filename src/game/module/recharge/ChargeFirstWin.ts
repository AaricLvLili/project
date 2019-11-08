class ChargeFirstWin extends BaseEuiPanel implements ICommonWindow, ICommonWindowTitle {
	public constructor() {
		super();
	}

	list
	scrollBar
	private title2: eui.Label;

	commonWindowBg: CommonWindowBg

	lastWin
	lastTab
	windowTitleIconName: string = GlobalConfig.jifengTiaoyueLg.st100227;

	UpdateContent(): void { };
	initUI() {

		super.initUI()
		this.skinName = "ChargeSkin";
		this.list.itemRenderer = ChargeItemRenderer;
		this.scrollBar.viewport = this.list;
		var dataList = StartGetUserInfo.isUsa ? GlobalConfig.ins("PayItemsUsaConfig") : GlobalConfig.ins("PayItemsConfig");
		var dataArr = [];
		let vipLv = UserVip.ins().lv || 0
		let has = false;

		let flg: boolean = true;//CySdk.ins()._ver == "oppoxmsy";//SdkMgr.appid == PlatformAppid.appid_12;快速处理下，后期优化
		for (var str in dataList) {
			let data = dataList[str]
			if (flg && data.cash >= 10000)//特殊屏蔽oppo拒绝大于10000的充值
				continue;
			if (data.cash == 1)//屏蔽一元充值
				continue;
			if (vipLv >= data.vipLv) {
				dataArr.push(data);
				if (data.vipLv > 0) {
					has = true
				}
			}
		}
		dataArr.sort((lhs, rhs) => {
			return lhs.amount - rhs.amount
		})
		this.list.dataProvider = new eui.ArrayCollection(dataArr);
		// this.title2.height = has ? 26 : 0
	};
	open(lastWin, lastTab) {
		super.open();
		this.lastWin = lastWin;
		this.lastTab = lastTab;
		this.commonWindowBg.OnAdded(this)
	};
	close() {
		super.close();
		this.commonWindowBg.OnRemoved()
		if (this.lastWin)
			ViewManager.ins().open(this.lastWin, this.lastTab);
	};

}

ViewManager.ins().reg(ChargeFirstWin, LayerManager.UI_Main);

window["ChargeFirstWin"] = ChargeFirstWin