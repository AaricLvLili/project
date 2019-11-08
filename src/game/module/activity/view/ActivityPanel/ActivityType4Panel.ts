class ActivityType4Panel extends ActivityPanel implements ICommonWindowTitle {
	public constructor() {
		super()
		this.skinName = "ActRaceSkin"
		this.list.itemRenderer = ActivityType4ItemRenderer
		this.list1.itemRenderer = ActivityItemShow
	}

	list: eui.List
	listData
	list1
	btn_showRank
	btn_showRank0
	group_Rank
	groupInfo

	imgTitle
	img_title1
	/** 我的总属性*/
	labelFinish
	rankName
	rankDesc
	private dabiaoConfig
	label_DabiaoTarget
	public groupTitle: eui.Group;
	private _mc: MovieClip

	public m_Lan1: eui.Label;
	public m_Lan2: eui.Label;

	childrenCreated() {
		this.listData = new eui.ArrayCollection, this.list.dataProvider = this.listData;
		this.btn_showRank.label = GlobalConfig.jifengTiaoyueLg.st100497;
		this.m_Lan1.text = GlobalConfig.jifengTiaoyueLg.st101328;
		this.m_Lan2.text = GlobalConfig.jifengTiaoyueLg.st101320;
	}

	open() {
		for (var e = [], t = 0; t < arguments.length; t++) e[t] = arguments[t];
		this.btn_showRank.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClick, this)
		this.btn_showRank0.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClick, this)
		GameGlobal.MessageCenter.addListener(MessageDef.ACTIVITY4_IS_GET_AWARDS, this.sendDabiaoInfo, this)
		GameGlobal.MessageCenter.addListener(MessageDef.ACTIVITY4_UPDATE, this.updateData, this)
		this.group_Rank.visible = false;
		this.groupTitle.visible = this.groupInfo.visible = true;
		this.btn_showRank.label = this.group_Rank.visible ? GlobalConfig.jifengTiaoyueLg.st101318 : GlobalConfig.jifengTiaoyueLg.st101319;
		this.sendDabiaoInfo()
	}

	sendDabiaoInfo() {
		ActivityModel.ins().sendDabiaoInfo(this.activityID)
	}
	public UpdateContent() {
		this.updateData()
	}

	close() {
		for (var e = [], t = 0; t < arguments.length; t++) e[t] = arguments[t];
		this.btn_showRank.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onClick, this)
		this.btn_showRank0.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onClick, this)
		GameGlobal.MessageCenter.removeListener(MessageDef.ACTIVITY4_IS_GET_AWARDS, this.sendDabiaoInfo, this)
		GameGlobal.MessageCenter.removeListener(MessageDef.ACTIVITY4_UPDATE, this.updateData, this)
		DisplayUtils.dispose(this._mc)
		this._mc = null;
	}

	private initMc() {
		if (!this._mc) {
			this._mc = new MovieClip
			this._mc.x = this.groupTitle.width / 2
			this._mc.y = this.groupTitle.height / 2
			this._mc.scaleX = this._mc.scaleY = .7
			this.groupTitle.addChild(this._mc)
		}
	}

	updateData() {
		var config = GameGlobal.activityData[this.activityID];
		var listConfig = this.getDataList(config.id);
		this.listData.replaceAll(listConfig);
		var i = this.getCurRewards();
		this.list1.dataProvider = new eui.ArrayCollection(i)
		this.refreshBtnStatu();

		//刷新第二和第三的信息
		// var data :any = GameGlobal.activityModel.rankInfoList[2];
		// this["label_value2"].text = data? data.value : "暂无";
		//刷新第二和第三的信息
		for (var n = 0; 4 > n; n++) try {
			var r = listConfig[n],
				o = GameGlobal.activityModel.rankInfoList[n],
				s = n + 1,
				a = this["list_item" + s],
				l = this["label_nname" + s],
				h = this["label_value" + s],
				p = GlobalConfig.jifengTiaoyueLg.st100378,
				u = "";
			if (o) switch (o.name != "" ? p = o.name : GlobalConfig.jifengTiaoyueLg.st100378, r.rankType) {
				case 12:
				case 16:
				case 14:
				case 13:
				case 5:
					u = ActivityType4Panel.GetLevelStr(o.numType);
					break
				case 6:
				case 0:
					u = CommonUtils.overLength(o.numType)
					break
				default:
					if (o.numType == 0) {
						// egret.log(2);
					} else {
						u = CommonUtils.overLength(o.numType);
					}
					break;
				// case RankDataType.TYPE_LEVEL:
				// 	u = o.zsLevel > 0 ? o.zsLevel + "转" + o.level + "级" : o.level + "级";
				// 	break;
				// case RankDataType.TYPE_POWER:
				// 	u = CommonUtils.overLength(o.numType);
				// 	break;
				// case RankDataType.TYPE_WING:
				// 	u = CommonUtils.overLength(o.numType);
				// 	break;
				// case RankDataType.TYPE_JOB_ZS:
				// 	u = CommonUtils.overLength(o.numType);
				// 	break;
				// case RankDataType.TYPE_JOB_FS:
				// 	u = CommonUtils.overLength(o.numType);
				// 	break;
				// case RankDataType.TYPE_JOB_DS:
				// 	u = CommonUtils.overLength(o.numType);
				// 	break;
				// case RankDataType.TYPE_BAOSHI:
				// 	u = o.numType + "级";
				// 	break;
				// case RankDataType.TYPE_ZHANLING:
				// 	u = o.numType[0] + "阶" + o.numType[1] + "星";
				// 	break;
				// case RankDataType.TYPE_LONGHUN:
				// 	u = o.numType + "级";
				// 	break;
				// case RankDataType.TYPE_XIAOFEI:
				// 	u = o.numType + "钻石"
			}
			if (u == "") {
				u = GlobalConfig.jifengTiaoyueLg.st101321 + CommonUtils.overLength(listConfig[n].value);
			}
			a && (a.itemRenderer = ActivityItemShow, a.dataProvider = new eui.ArrayCollection(r.rewards)), l && (l.text = p), h && (h.text = u)
		} catch (c) {
			egret.log("达标面板预览报错"), egret.log(c)
		}
		var d = GlobalConfig.ins("ActivityConfig")[this.activityID];
		//this.imgTitle.source = d.source1
		//this.img_title1.source = d.source2;
		this.initMc();
		this._mc.loadUrl(ResDataPath.GetUIEffePath(d.source2), true, -1)
		var g = GlobalConfig.jifengTiaoyueLg.st101322 + this.getTypeDesc() + "|C:0x00FF00&T:" + this.getSelfInfo() + "|";
		this.labelFinish.text = GlobalConfig.jifengTiaoyueLg.st100084 + d.noticeName + "：" + GameGlobal.activityModel.myDabiaoInfo;
	}

	refreshBtnStatu() {
		var state = this.getCurStatus(),
			t = this.getCurValue();
		if (state == 2) state = 0;//目前不需要状态2，状态会隐藏，wjh
		switch (this.currentState = "" + state, this.rankName.text = GameGlobal.actorModel.name, this.rankDesc.text = this.getSelfInfo(), this.dabiaoConfig.rankType) {
			case 12: // 宝石榜
			case 16:
			case 14: // 龙纹榜
			case 13: // 龙魂榜
			// this.label_DabiaoTarget && (this.label_DabiaoTarget.text = "达到等级\n" + t)
			// break
			case 5:	 // 等级榜
				this.label_DabiaoTarget && (this.label_DabiaoTarget.text = GlobalConfig.jifengTiaoyueLg.st101324 + "\n" + ActivityType4Panel.GetLevelStr(t))
				break
			case 6:	 // 翅膀榜
			case 0:  // 战力榜
				this.label_DabiaoTarget && (this.label_DabiaoTarget.text = GlobalConfig.jifengTiaoyueLg.st101325 + "\n" + t);
				break
			// case RankDataType.TYPE_LEVEL:
			// 	var i = Math.floor(t / 1e3),
			// 		n = t % 1e3;
			// 	this.label_DabiaoTarget && (this.label_DabiaoTarget.text = "达到等级\n" + (i ? i + "转" : "") + (n + "级"));
			// 	break;
			// case RankDataType.TYPE_POWER:
			// case RankDataType.TYPE_WING:
			// case RankDataType.TYPE_JOB_ZS:
			// case RankDataType.TYPE_JOB_FS:
			// case RankDataType.TYPE_JOB_DS:
			// 	this.label_DabiaoTarget && (this.label_DabiaoTarget.text = "达到战力\n" + t);
			// 	break;
			// case RankDataType.TYPE_BAOSHI:
			// 	this.label_DabiaoTarget && (this.label_DabiaoTarget.text = "达到等级\n" + t);
			// 	break;
			// case RankDataType.TYPE_ZHANLING:
			// 	var r = Math.floor(t / 1e3),
			// 		o = t % 1e3;
			// 	this.label_DabiaoTarget && (this.label_DabiaoTarget.text = "达到星阶\n" + (r ? r + "阶" : "") + (o + "星"));
			// 	break;
			// case RankDataType.TYPE_LONGHUN:
			// 	this.label_DabiaoTarget && (this.label_DabiaoTarget.text = "达到等级\n" + t);
			// 	break;
			// case RankDataType.TYPE_XIAOFEI:
			// 	this.label_DabiaoTarget && (this.label_DabiaoTarget.text = "消费\n" + t + "钻石")
		}
	}

	getDataList(id) {
		var config = GlobalConfig.ins("ActivityType4Config")[id],
			list = [];
		for (var n in config)
			0 == config[n].ranking
				? this.dabiaoConfig = config[n]
				: list.push(config[n]);
		return list
	}

	onClick(e) {
		switch (e.currentTarget) {
			case this.btn_showRank:
			case this.btn_showRank0:
				this.group_Rank.visible = !this.group_Rank.visible, this.btn_showRank.label = this.group_Rank.visible ? GlobalConfig.jifengTiaoyueLg.st101318 : GlobalConfig.jifengTiaoyueLg.st101319
				this.groupTitle.visible = !this.group_Rank.visible
				var state = this.getCurStatus();
				if (state == 2) {
					this.groupInfo.visible = false;
				}
				else {
					this.groupInfo.visible = !this.group_Rank.visible;
				}

		}
	}

	getCurValue() {
		let config = this.GetRecentConfig()
		if (config) {
			return config.value
		}
		return 0
	}

	getCurRewards() {
		let config = this.GetRecentConfig()
		if (config) {
			return config.rewards
		}
		return []
	}

	private GetRecentConfig() {
		let activityModel = GameGlobal.activityModel;
		let index = activityModel.indexCurrDabiao
		for (let i = activityModel.indexCurrDabiao; i > 0; --i) {
			if (!BitUtil.Has(activityModel.isDaBiao, i)) {
				index = i - 1
			}
		}
		return this.dabiaoConfig.value[index]
	}

	getCurStatus(): RewardState {
		let activityModel = GameGlobal.activityModel;
		for (let i = 1; i <= activityModel.indexCurrDabiao; ++i) {
			if (!BitUtil.Has(activityModel.isDaBiao, i)) {
				return RewardState.CanGet
			}
		}
		if (activityModel.indexCurrDabiao >= this.dabiaoConfig.value.length) {
			return RewardState.Gotten
		}
		return RewardState.NotReached
	}

	getTypeDesc() {
		var e = "";
		switch (this.dabiaoConfig.rankType) {
			// case RankDataType.TYPE_LEVEL:
			// 	e = "等级:";
			// 	break;
			// case RankDataType.TYPE_WING:
			// 	e = "羽翼等级：";
			// 	break;
			// case RankDataType.TYPE_POWER:
			// case RankDataType.TYPE_JOB_ZS:
			// case RankDataType.TYPE_JOB_FS:
			// case RankDataType.TYPE_JOB_DS:
			// 	e = "总战斗力:";
			// 	break;
			// case RankDataType.TYPE_BAOSHI:
			// 	e = "宝石等级:";
			// 	break;
			// case RankDataType.TYPE_ZHANLING:
			// 	e = "战灵阶级:";
			// 	break;
			// case RankDataType.TYPE_LONGHUN:
			// 	e = "龙魂等级:";
			// 	break;
			// case RankDataType.TYPE_XIAOFEI:
			// 	e = "钻石消费:"
			case 12:
			case 16:
			case 14:
			case 13:
			case 5:
				e = GlobalConfig.jifengTiaoyueLg.st101326
				break
			case 6:
			case 0:
				e = GlobalConfig.jifengTiaoyueLg.st101327
				break
		}
		return e
	}

	getSelfInfo() {
		var e = "";
		switch (this.dabiaoConfig.rankType) {
			// case RankDataType.TYPE_LEVEL:
			// 	e = GameGlobal.zsModel.lv > 0 ? GameGlobal.zsModel.lv + "转" + GameGlobal.actorModel.level + "级" : GameGlobal.actorModel.level + "级";
			// 	break;
			// case RankDataType.TYPE_POWER:
			// case RankDataType.TYPE_WING:
			// case RankDataType.TYPE_JOB_ZS:
			// case RankDataType.TYPE_JOB_FS:
			// case RankDataType.TYPE_JOB_DS:
			// 	e = CommonUtils.overLength(GameGlobal.activityModel.myDabiaoInfo);
			// 	break;
			// case RankDataType.TYPE_BAOSHI:
			// 	e = GameGlobal.activityModel.myDabiaoInfo + "级";
			// 	break;
			// case RankDataType.TYPE_ZHANLING:
			// 	var t = GameGlobal.activityModel.myDabiaoInfo[0],
			// 		i = GameGlobal.activityModel.myDabiaoInfo[1];
			// 	e = t + "阶" + i + "星";
			// 	break;
			// case RankDataType.TYPE_LONGHUN:
			// 	e = GameGlobal.activityModel.myDabiaoInfo + "级";
			// 	break;
			// case RankDataType.TYPE_XIAOFEI:
			// 	e = GameGlobal.activityModel.myDabiaoInfo + "钻石"
			case 12:
			case 16:
			case 14:
			case 13:
			// e = GameGlobal.activityModel.myDabiaoInfo + "级"
			// break
			case 5:
				e = ActivityType4Panel.GetLevelStr(GameGlobal.activityModel.myDabiaoInfo)
				break
			case 6:
			case 0:
				e = CommonUtils.overLength(GameGlobal.activityModel.myDabiaoInfo);
				break
		}
		return e
	}

	public static GetLevelStr(value): string {
		let zsLv = Math.floor(value / 1000)
		let lv = value % 1000
		let str = ""
		if (zsLv > 0) {
			// str = zsLv + "转"
			return zsLv + GlobalConfig.jifengTiaoyueLg.st100067
		}
		return lv + GlobalConfig.jifengTiaoyueLg.st100093
		// str += lv + "级"
		// return str
	}

	// public GetActivityTimeAndDes() {
	// 	GameGlobal.activityData[this.activityID]
	// }
	// this.date.text = config.getRemindTimeString()
	// 	this.desc.text = GlobalConfig.ins("ActivityConfig")[this.activityID].desc;

}

window["ActivityType4Panel"] = ActivityType4Panel