class GuanQiaBossItem extends eui.ItemRenderer {
	public constructor() {
		super();
	}
	public m_ItemList: eui.List;
	public m_BossHead: eui.Image;
	public m_MainBtn: eui.Button;
	public m_NameLab: eui.Label;
	public m_CountLab: eui.Label;
	public listData: eui.ArrayCollection;
	public createChildren() {
		super.createChildren();
		this.m_ItemList.itemRenderer = ItemBase;
		this.listData = new eui.ArrayCollection();
		this.m_ItemList.dataProvider = this.listData;
		this.addEvt();
		this.m_MainBtn.label = GlobalConfig.jifengTiaoyueLg.st100046;
	}
	public addEvt() {
		this.m_MainBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClick, this);
	}
	public dataChanged() {
		super.dataChanged();
		let data: { groupId: number, mapId: number } = this.data;
		let key2 = data.mapId;
		if (data.groupId <= 1) {
			key2 = data.mapId - 1;
		}
		let chaptersBossConfig = GlobalConfig.ins("ChaptersBossConfig")[data.groupId][key2];
		if (chaptersBossConfig) {
			let guanqiaId = UserFb.ins().guanqiaID;
			let chaptersRewardConfig = GlobalConfig.ins("ChaptersRewardConfig")[data.mapId];
			if (chaptersRewardConfig) {
				if (guanqiaId > chaptersRewardConfig.needLevel) {
					this.m_MainBtn.enabled = true;
					this.m_CountLab.textFlow = TextFlowMaker.generateTextFlow(chaptersBossConfig.bossTips);
					// let isBattle = GuanQiaModel.getInstance.checkBossIsBattle(data.mapId);
					// if (isBattle) {
						this.m_MainBtn.label = GlobalConfig.jifengTiaoyueLg.st100046;//"挑战";
					// } else {
					// 	this.m_MainBtn.label = GlobalConfig.languageConfig.st100352;//"扫荡";
					// }
				} else {
					this.m_MainBtn.enabled = false;
					this.m_CountLab.textFlow = TextFlowMaker.generateTextFlow(chaptersBossConfig.openTips);
				}
			}
			let monstersConfig = GlobalConfig.ins("MonstersConfig")[chaptersBossConfig.bossId];
			if (monstersConfig) {
				this.m_NameLab.text = "Lv." + monstersConfig.level + " " + monstersConfig.name;
				this.m_BossHead.source = ResDataPath.getBossHeadImage(monstersConfig.head);//monstersConfig.head + "_png";
			}
			this.listData.removeAll();
			this.listData.replaceAll(chaptersBossConfig.showReward);
			this.listData.refresh();
		
		}
		this.checkIsBossGuide();
	}

	private onClick() {
		let guanQiaModel = GuanQiaModel.getInstance;
		GuideUtils.ins().next(this.m_MainBtn)
		if (guanQiaModel.tiliNum > 0) {
			let data: { groupId: number, mapId: number } = this.data;
			// let isBattle = guanQiaModel.checkBossIsBattle(data.mapId);
			// if (isBattle) {
				UserFb.ins().sendQuanQiaBossBattle(data.mapId);
				ViewManager.ins().close(GuanQiaBossWin);
				ViewManager.ins().close(GuanQiaMapWin);
				ViewManager.ins().close(GuanQiaWin);
			// } else {
			// 	UserFb.ins().sendQuanQiaBossQuick(data.mapId);
			// }
		} else {
			UserTips.ins().showTips(GlobalConfig.jifengTiaoyueLg.st100761);
		}
	}
	private checkIsBossGuide() {
		let guanQiaModel = GuanQiaModel.getInstance;
		let data: { groupId: number, mapId: number } = this.data;
		if (data.mapId == 1) {
			let dialogueSetConfig = GuanQiaModel.getInstance.guideConfig;
			if (dialogueSetConfig && dialogueSetConfig.groupId == 10) {
				GuideUtils.ins().show(this.m_MainBtn, dialogueSetConfig.groupId, 3)
			}
		}
	}

}
window["GuanQiaBossItem"] = GuanQiaBossItem