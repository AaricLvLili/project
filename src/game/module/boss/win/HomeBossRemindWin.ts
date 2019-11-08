class HomeBossRemindWin extends BaseEuiPanel {

	public static LAYER_LEVEL = LayerManager.UI_Popup

	public constructor() {
		super()
	}

	private listDatas: eui.ArrayCollection;
	private list0: eui.List;

	//private dialogCloseBtn: eui.Button;



	protected createChildren() {
		super.createChildren();
	}
	initUI() {
		super.initUI()
		this.skinName = "PubBossRemindSkin";
		this.list0.itemRenderer = HomeBossRemindItem;
		this.listDatas = new eui.ArrayCollection;
		this.list0.dataProvider = this.listDatas;

	};
	open() {
		this.m_bg.init(`HomeBossRemindWin`, GlobalConfig.jifengTiaoyueLg.st101498)
		var param = [];
		for (var _i = 0; _i < arguments.length; _i++) {
			param[_i - 0] = arguments[_i];
		}
		UserBoss.ins().sendGetVipRemindMsg();
		//this.dialogCloseBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnClick, this);
		GameGlobal.MessageCenter.addListener(MessageDef.HOMEBOSS_REMIND_UPDATE, this.setData, this);
		this.setData();
	};
	close() {
		var param = [];
		for (var _i = 0; _i < arguments.length; _i++) {
			param[_i - 0] = arguments[_i];
		}
		//this.dialogCloseBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this._OnClick, this);
		GameGlobal.MessageCenter.removeListener(MessageDef.HOMEBOSS_REMIND_UPDATE, this.setData, this);
	};
	private setData() {
		let homeModel: HomeBossModel = HomeBossModel.getInstance;
		let bossConfigData: any[] = homeModel.vipBossConfigData.values;
		let vipLv = UserVip.ins().lv;
		let playerlv = GameLogic.ins().actorModel.level;
		let playerzs = UserZs.ins() ? UserZs.ins().lv : 0;
		let playerlvzs: number = playerzs ? 10 * playerzs + 80 : playerlv;
		let publicBossBaseConfig: any = GlobalConfig.ins("PublicBossBaseConfig");
		let data1: any[] = [];
		let data2: any[] = [];
		for (var i = 0; i < bossConfigData.length; i++) {
			let bossData = bossConfigData[i];
			bossData["zlv"] = bossData.zsLevel ? bossData.zsLevel * 10 + 80 : bossData.level;
			bossData["isCanBattle"] = 1;
			bossData["context"] = GlobalConfig.jifengTiaoyueLg.st101499;
			if (vipLv < publicBossBaseConfig.vipOpenlLimit[bossData.LevelType - 1]) {
				bossData["isCanBattle"] = 2;
				bossData["context"] = GlobalConfig.jifengTiaoyueLg.st101330;
				data2.push(bossData);
				continue;
			}
			let bosslvzs: number = bossData.zsLevel ? 10 * bossData.zsLevel + 80 : bossData.level;
			let bosszs: number = bossData.zsLevel;
			let bosslv: number = bossData.level;
			if (bosszs) {
				if (playerzs >= bosszs) {
					if (playerlvzs >= bosslvzs + 50) {
						bossData["context"] = GlobalConfig.jifengTiaoyueLg.st100520;
						bossData["isCanBattle"] = 2;
						data2.push(bossData);
						continue;
					}
				} else {
					bossData["context"] = GlobalConfig.jifengTiaoyueLg.st100506;
					bossData["isCanBattle"] = 2;
					data2.push(bossData);
					continue;
				}
			} else {
				if (playerlvzs >= bosslv + 50) {
					bossData["context"] = GlobalConfig.jifengTiaoyueLg.st100520;
					bossData["isCanBattle"] = 2;
					data2.push(bossData);
					continue;
				} else if (playerlvzs < bosslv) {
					bossData["context"] = GlobalConfig.jifengTiaoyueLg.st100506;
					bossData["isCanBattle"] = 2;
					data2.push(bossData);
					continue;
				}
			}
			data1.push(bossData);
		}
		data1.sort(this.sorLv);
		data2.sort(this.sorLv);
		let datasor = data1.concat(data2);
		this.listDatas.replaceAll(datasor);
	}
	private _OnClick(e: egret.TouchEvent) {
		ViewManager.ins().close(this);
	}
	/**关联排序 */
	private sorLv(item1: { zlv: number }, item2: { zlv: number }): number {
		return item2.zlv - item1.zlv;
	}
}

window["HomeBossRemindWin"]=HomeBossRemindWin