class ActivityType21Panel extends ActivityPanel {
	public constructor() {
		super()
		this.skinName = "ActivityType21Skin"
	}
	public groupInfo: eui.Group;
	public m_Lan0: eui.Label;
	public label_nname1: eui.Label;
	public label_value1: eui.Label;
	public img_title1: eui.Image;
	public list_item1: eui.List;
	public imgTitle: eui.Image;
	public list1: eui.List;
	public group_Rank: eui.Group;
	public list: eui.List;
	public m_Lan1: eui.Label;
	public btn_showRank: eui.Button;
	public labelCount: eui.Label;
	public labelRank: eui.Label;


	listData: eui.ArrayCollection
	listData1: eui.ArrayCollection
	private top1Cfg
	private activityConfig: any

	childrenCreated() {
		this.list.itemRenderer = ActivityType21ItemRenderer
		this.list1.itemRenderer = ActivityType21ItemRenderer
		this.list_item1.itemRenderer = ActivityItemShow
		this.listData = new eui.ArrayCollection, this.list.dataProvider = this.listData
		this.listData1 = new eui.ArrayCollection, this.list1.dataProvider = this.listData1
		this.m_Lan0.text = GlobalConfig.jifengTiaoyueLg.st101328;
		this.m_Lan1.text = GlobalConfig.jifengTiaoyueLg.st102060;
	}

	open() {
		this.top1Cfg = this.getDataList(this.activityID, 1)
		Rank.ins().sendGetRankingData(this.top1Cfg.rankType)
		for (var e = [], t = 0; t < arguments.length; t++) e[t] = arguments[t];
		this.btn_showRank.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClick, this)
		GameGlobal.MessageCenter.addListener(MessageDef.PAY_SPEND_RANK_UPDATE, this.getRankData, this)
		this.group_Rank.visible = false;
		this.groupInfo.visible = true;
		this.btn_showRank.label = this.group_Rank.visible ? GlobalConfig.jifengTiaoyueLg.st101318 : GlobalConfig.jifengTiaoyueLg.st100381
		this.updateData()
	}


	close() {
		for (var e = [], t = 0; t < arguments.length; t++) e[t] = arguments[t];
		this.btn_showRank.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onClick, this)
		GameGlobal.MessageCenter.removeListener(MessageDef.PAY_SPEND_RANK_UPDATE, this.getRankData, this)
	}
	private getRankData(type) {
		this.top1Cfg = this.getDataList(this.activityID, 1)
		if (this.top1Cfg.rankType == type) {
			this.updateData()
		}
	}
	updateData() {
		if (!this.top1Cfg) {
			console.error(`activityID${this.activityID}: config rankType not found`)
			return;
		}
		let rankData = Rank.ins().rankModel[this.top1Cfg.rankType]
		// if(!rankData){
		// 	return
		// }
		let rankDataList: Array<RankDataInfo> = [];
		if (rankData && rankData._dataList.length > 0) {
			rankDataList = [...rankData._dataList];
			let len = rankData._dataList.length
			if (len < 20) {
				let arr = this.createData(len, rankData._dataList)
				rankDataList = [...rankData._dataList, ...arr]
				rankDataList.sort((a, b) => {
					return a.idx - b.idx
				})
			}
		}
		else {
			rankDataList = this.createData(1)
		}
		if (!rankDataList) {
			return
		}
		for (let i = 0, len = rankDataList.length; i < len; i++) {
			let item = rankDataList[i] as RankDataInfo
			item.activityId = this.activityID
		}
		let data = GameGlobal.activityData[this.activityID] as any; //获取当前ID活动数据
		this.listData.replaceAll(rankDataList);
		this.listData1.replaceAll([rankDataList[1], rankDataList[2]]);

		//刷新第一的信息
		this.list_item1.dataProvider = new eui.ArrayCollection(this.top1Cfg["rewards"])
		this.label_nname1.text = rankDataList[0].name == '' ? GlobalConfig.jifengTiaoyueLg.st101034 : rankDataList[0].name
		this.label_value1.text = rankDataList[0].name == '' ? GlobalConfig.jifengTiaoyueLg.st102063 +CommonUtils.overLength(this.top1Cfg.value) + GlobalConfig.jifengTiaoyueLg.st100050 : CommonUtils.overLength(rankDataList[0].value) + GlobalConfig.jifengTiaoyueLg.st100050
		// this.label_value1.text = rankDataList[0].name == '' ? "达标需求\n" + this.top1Cfg.value + "元宝" : rankDataList[0].value + "元宝"


		this.activityConfig = this.getActivityConfig()
		this.img_title1.source = this.activityConfig.source2
		if (rankData) {
			this.labelRank.textFlow = new egret.HtmlTextParser().parse(GlobalConfig.jifengTiaoyueLg.st100403 + `<font color="#008f22">${rankData.selfPos == 0 ? GlobalConfig.jifengTiaoyueLg.st100086 : rankData.selfPos}</font>`)
			this.labelCount.textFlow = new egret.HtmlTextParser().parse(GlobalConfig.jifengTiaoyueLg.st102064 + `${this.getTypeDesc()}：<font color="#008f22">${rankData.value}</font>` + GlobalConfig.jifengTiaoyueLg.st100050)
		} else {
			this.labelRank.text = GlobalConfig.jifengTiaoyueLg.st100403 + GlobalConfig.jifengTiaoyueLg.st100086;
			this.labelCount.text = GlobalConfig.jifengTiaoyueLg.st102064 + `${this.getTypeDesc()}：0` + GlobalConfig.jifengTiaoyueLg.st100050
		}

	}
	private getActivityConfig() {
		let cfg = GlobalConfig.activityConfig[this.activityID];
		if (cfg == null) {
			cfg = GlobalConfig.activityAConfig[this.activityID];
		}
		if (cfg == null) {
			cfg = GlobalConfig.activitySumConfig[this.activityID];
		}
		return cfg
	}


	private getDataList(type, id) {
		let config = GlobalConfig.activityType4Config[type];
		if (config == null) {
			config = GlobalConfig.activityType4AConfig[type];
		}
		if (config == null) {
			config = GlobalConfig.activityType4BConfig[type];
		}
		for (var n in config) {
			if (config[n].ranking == id) {
				return config[n]
			}
		}
		return null
	}
	private createData(idx: number, arr = []): Array<RankDataInfo> {
		let list = []
		let flag = true
		if (arr != []) {
			for (let i = 1; i < 21; i++) {
				for (let k = 0, len = arr.length; k < len; k++) {
					if (i == arr[k].pos) {
						flag = false
						break;
					}
				}
				if (flag) {
					let item = new RankDataInfo()
					item.create(this.activityID, i)
					list.push(item)
					flag = true
				}
			}
		} else {
			for (let i = idx; i < 21; i++) {
				let item = new RankDataInfo()
				item.create(this.activityID, i)
				list.push(item)
			}
		}
		return list
	}

	onClick(e) {
		switch (e.currentTarget) {
			case this.btn_showRank:
				this.group_Rank.visible = !this.group_Rank.visible
				this.groupInfo.visible = !this.group_Rank.visible
				this.btn_showRank.label = this.group_Rank.visible ? GlobalConfig.jifengTiaoyueLg.st101318 : GlobalConfig.jifengTiaoyueLg.st101319
				break
		}
	}
	getTypeDesc(): string {
		if (this.activityConfig == null) {
			return ''
		}
		switch (this.activityConfig.activityType) {
			case 21:
				return GlobalConfig.jifengTiaoyueLg.st100227;
			case 22:
				return GlobalConfig.jifengTiaoyueLg.st102065;
		}

	}
}

window["ActivityType21Panel"] = ActivityType21Panel