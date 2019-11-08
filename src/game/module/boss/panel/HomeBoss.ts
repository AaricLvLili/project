class HomeBoss extends eui.Component {
	/**显示层数 */
	private m_LayerBossLab: eui.Label;
	/**选择图片 */
	private m_LayerSelectImg: eui.Image;
	/**点击1层 */
	private m_LayerBossBtn1: eui.Group;
	/**点击2层 */
	private m_LayerBossBtn2: eui.Group;
	/**点击3层 */
	private m_LayerBossBtn3: eui.Group;
	/**vip等级文本 */
	private m_VipLab: eui.Label;
	/**刷新时间 */
	private m_RefCDLab: eui.Label;
	/**挑战时间文本 */
	public m_BattleTimeLab: eui.Label;

	public m_BattleTimeMLab: eui.Label;
	/**清空挑战时间文本 */
	public m_ClearLab: eui.Label;
	/**boss提醒设置文本 */
	private m_BossTipsLab: eui.Label;
	private m_Scroller: eui.Scroller;
	private m_List: eui.List;
	private m_ListData: eui.ArrayCollection;

	public homeBossLayer: HomeBossLayerType = 1;
	public constructor() {
		super();
	}
	protected childrenCreated() {
		super.childrenCreated();
		this.m_List.itemRenderer = HomeBossItem;
		this.m_ListData = new eui.ArrayCollection();
		this.m_List.dataProvider = this.m_ListData;
		this.addEvent();
		this.m_BattleTimeMLab.text = GlobalConfig.jifengTiaoyueLg.st100516;
		this.m_ClearLab.text = GlobalConfig.jifengTiaoyueLg.st100517;
		this.m_BossTipsLab.text = GlobalConfig.jifengTiaoyueLg.st100479;
	}
	private addEvent() {
		this.m_LayerBossBtn1.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClickLayer, this);
		this.m_LayerBossBtn2.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClickLayer, this);
		this.m_LayerBossBtn3.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClickLayer, this);

		MessageCenter.ins().addListener(MessageDef.HOMEBOSS_BOSSMSG_UPDATE, this.refBossMsg, this);
		this.m_ClearLab.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClearCD, this);
		this.m_BossTipsLab.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClickBossTips, this);
	}
	public release() {
		this.m_Scroller.stopAnimation();
	}
	public setData(layer: HomeBossLayerType) {
		this.homeBossLayer = layer;
		this.m_LayerBossLab.text = GlobalConfig.jifengTiaoyueLg.st100467 + layer + GlobalConfig.jifengTiaoyueLg.st100383;
		let publicBossBaseConfig: any = GlobalConfig.ins("PublicBossBaseConfig");
		// let publicBossConfig: any = GlobalConfig.ins("PublicBossConfig");
		if (publicBossBaseConfig) {
			let vipOpenlLimit = publicBossBaseConfig.vipOpenlLimit[layer - 1];
			if (vipOpenlLimit) {
				this.m_VipLab.text = "VIP" + vipOpenlLimit + GlobalConfig.jifengTiaoyueLg.st100512;
			}
		}
		switch (layer) {
			case HomeBossLayerType.LAYERTYPE1:
				this.m_LayerBossBtn1.addChild(this.m_LayerSelectImg);
				break;
			case HomeBossLayerType.LAYERTYPE2:
				this.m_LayerBossBtn2.addChild(this.m_LayerSelectImg);
				break;
			case HomeBossLayerType.LAYERTYPE3:
				this.m_LayerBossBtn3.addChild(this.m_LayerSelectImg);
				break;
		}
		this.refBossMsg();
	}
	private onClickLayer(e: egret.TouchEvent) {
		let vipLv = UserVip.ins().lv;
		let publicBossBaseConfig: any = GlobalConfig.ins("PublicBossBaseConfig");
		// let publicBossConfig: any = GlobalConfig.ins("PublicBossConfig");
		if (!publicBossBaseConfig) {
			return;
		}
		switch (e.currentTarget) {
			case this.m_LayerBossBtn1: {
				let vipOpenlLimit = publicBossBaseConfig.vipOpenlLimit[HomeBossLayerType.LAYERTYPE1 - 1];
				if (vipOpenlLimit) {
					if (vipLv >= vipOpenlLimit) {
						this.setData(HomeBossLayerType.LAYERTYPE1);
					} else {
						UserTips.ins().showTips(LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st100509, [vipOpenlLimit, HomeBossLayerType.LAYERTYPE1]));
					}
				}
				break;
			}
			case this.m_LayerBossBtn2: {
				let vipOpenlLimit = publicBossBaseConfig.vipOpenlLimit[HomeBossLayerType.LAYERTYPE2 - 1];
				if (vipOpenlLimit) {
					if (vipLv >= vipOpenlLimit) {
						this.setData(HomeBossLayerType.LAYERTYPE2);
					} else {
						UserTips.ins().showTips(LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st100509, [vipOpenlLimit, HomeBossLayerType.LAYERTYPE2]));
					}
				}
				break;
			}
			case this.m_LayerBossBtn3: {
				let vipOpenlLimit = publicBossBaseConfig.vipOpenlLimit[HomeBossLayerType.LAYERTYPE3 - 1];
				if (vipOpenlLimit) {
					if (vipLv >= vipOpenlLimit) {
						this.setData(HomeBossLayerType.LAYERTYPE3);
					} else {
						UserTips.ins().showTips(LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st100509, [vipOpenlLimit, HomeBossLayerType.LAYERTYPE3]));
					}
				}
				break;
			}
		}
	}
	private refBossMsg() {
		let bossData: any[] = [];
		let homeBossModel: HomeBossModel = HomeBossModel.getInstance;
		switch (this.homeBossLayer) {
			case HomeBossLayerType.LAYERTYPE1:
				bossData = homeBossModel.layerBossData1.values;
				break;
			case HomeBossLayerType.LAYERTYPE2:
				bossData = homeBossModel.layerBossData2.values;
				break;
			case HomeBossLayerType.LAYERTYPE3:
				bossData = homeBossModel.layerBossData3.values;
				break;
		}
		let homeModel: HomeBossModel = HomeBossModel.getInstance;
		let data1: any[] = [];
		let data2: any[] = [];
		let data3: any[] = [];
		let data4: any[] = [];
		for (var i = 0; i < bossData.length; i++) {
			let data: Sproto.public_boss_info = bossData[i];
			let bossConfigData: any = homeModel.vipBossConfigData.get(data.id);
			let playerlv = GameLogic.ins().actorModel.level;
			let playerzs = UserZs.ins() ? UserZs.ins().lv : 0;
			let bosslv = bossConfigData.level;
			let bosszs = bossConfigData.zsLevel;
			let bosslvzs = bossConfigData.zsLevel ? bossConfigData.zsLevel * 10 + 80 : bossConfigData.level;
			let playerlvzs = playerzs ? playerzs * 10 + 80 : playerlv;
			data["zlv"] = bosslvzs;
			if (bosszs) {
				if (playerzs >= bosszs) {
					if (playerlvzs >= bosslvzs + 50) {
						data3.push(data);
					} else {
						if (data.hp <= 0) {
							data2.push(data);
						} else {
							data1.push(data);
						}
					}
				} else if (playerzs < bosszs) {
					data4.push(data);
				}
			} else {
				if (playerlvzs >= bosslv + 50) {
					data3.push(data)
				} else if (playerlvzs < bosslv) {
					data4.push(data);
				} else {
					if (data.hp <= 0) {
						data2.push(data);
					} else {
						data1.push(data);
					}
				}
			}
		}
		data1.sort(this.sorLvUp);
		data2.sort(this.sorLvUp);
		data3.sort(this.sorLvUp);
		data4.sort(this.sorLvDown);
		let datasor = data1.concat(data2, data3, data4);
		this.m_Scroller.stopAnimation();
		if (this.m_Scroller && this.m_Scroller.viewport) {
			this.m_Scroller.viewport.scrollV = 0;
		}
		this.m_ListData.replaceAll(datasor);
	}

	/**关联排序 */
	private sorLvUp(item1: { zlv: number }, item2: { zlv: number }): number {
		return item2.zlv - item1.zlv;
	}
	/**关联排序 */
	private sorLvDown(item1: { zlv: number }, item2: { zlv: number }): number {
		return item1.zlv - item2.zlv;
	}

	private onClearCD() {
		let price: number = HomeBossModel.getInstance.battleCDPrice
		if (price > 0) {
			WarnWin.show(LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st100513, [price]), function () {
				let yb: number = GameLogic.ins().actorModel.yb;
				let price = HomeBossModel.getInstance.battleCDPrice;
				if (yb > price) {
					UserBoss.ins().sendClearVipBossCD();
				} else {
					UserTips.ins().showTips(GlobalConfig.jifengTiaoyueLg.st100008);
				}
			}, this);
		} else {
			UserTips.ins().showTips(GlobalConfig.jifengTiaoyueLg.st100514);
		}
	}
	private onClickBossTips() {
		ViewManager.ins().open(HomeBossRemindWin);
	}

	public set refCDLab(str: string) {
		this.m_RefCDLab.text = str + GlobalConfig.jifengTiaoyueLg.st100515;
	}

}
window["HomeBoss"] = HomeBoss