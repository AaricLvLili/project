class ActivityType303Panel extends BaseView {
	public constructor() {
		super()
	}
	public m_Scroller: eui.Scroller;

	public m_List: eui.List;
	public m_ItemList: eui.List;
	public m_LevelLab: eui.Label;
	public m_AnimGroup: eui.Group;

	public m_MainBtn: eui.Button;

	private listData: eui.ArrayCollection;
	private itemListData: eui.ArrayCollection;

	public static selectIndex: number = 0;

	private m_Eff: MovieClip;
	public m_TipsLab: eui.Label;
	public m_CompImg: eui.Image;

	public activityGroup: eui.Group;
	public descBg: eui.Image;
	public desc: eui.Label;
	public date: eui.Label;

	public m_RightBtn: eui.Button;
	public m_LeftBtn: eui.Button;


	public m_Lan1: eui.Label;

	public createChildren() {
		super.createChildren();
		this.skinName = "Activity303PanelSkin";
		this.m_ItemList.itemRenderer = ItemBase;
		this.itemListData = new eui.ArrayCollection();
		this.m_ItemList.dataProvider = this.itemListData;

		this.m_List.itemRenderer = ActivityType303Item;
		this.listData = new eui.ArrayCollection();
		this.m_List.dataProvider = this.listData;
		this.m_MainBtn.label = GlobalConfig.jifengTiaoyueLg.st100046;
		this.m_Lan1.text = GlobalConfig.jifengTiaoyueLg.st101297;
	}
	initUI() {

	}

	open(e) {
		this.check();
		this.updateView();
		egret.setTimeout(function () {
			this.checkPoint();
		}, this, 100);
		GameGlobal.MessageCenter.addListener(MessageDef.UPDATE_ACTIVITY_PANEL, this.updateView, this);
		GameGlobal.MessageCenter.addListener(MessageDef.UPDATE_ACTIVITY303_PANEL, this.updataTips, this);
		this.m_MainBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClick, this);
		this.m_RightBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClickRight, this);
		this.m_LeftBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClickLeft, this);
		this.m_Scroller.addEventListener(egret.Event.CHANGE, this.onSaveScrData, this);
	}

	close() {
		GameGlobal.MessageCenter.removeListener(MessageDef.UPDATE_ACTIVITY_PANEL, this.updateView, this);
		GameGlobal.MessageCenter.removeListener(MessageDef.UPDATE_ACTIVITY303_PANEL, this.updataTips, this);
		this.m_MainBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onClick, this);
		this.m_RightBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onClickRight, this);
		this.m_LeftBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onClickLeft, this);
		this.m_Scroller.removeEventListener(egret.Event.CHANGE, this.onSaveScrData, this);
	}

	public release() {
	}

	onChange() {
		this.updateTopList()
	}

	updateView() {
		this.updateTopList()
	}

	updateTopList() {
		var activityData = <ActivityType303Data>GameGlobal.activityData[303];
		let config = ActivityType303Data.getConfig(303);
		this.listData.replaceAll(config);
		let configData = config[ActivityType303Panel.selectIndex];
		if (configData) {
			this.itemListData.removeAll()
			this.itemListData.replaceAll(configData.rewards);
			this.m_TipsLab.textFlow = TextFlowMaker.generateTextFlow(configData.tips);
			this.playEff(configData.showMovies + "_3" + EntityAction.STAND);
			this.m_Eff.scaleX = this.m_Eff.scaleY = configData.moviesProportion;
			let state = activityData.isCanBattle(configData.index);
			if (state == battleType303.TYPE1 || state == battleType303.TYPE2) {
				this.m_MainBtn.label = GlobalConfig.jifengTiaoyueLg.st100046;
				this.m_CompImg.visible = false;
				this.m_MainBtn.visible = true;
			} else {
				this.m_MainBtn.label = GlobalConfig.jifengTiaoyueLg.st100991;
				this.m_CompImg.visible = true;
				this.m_MainBtn.visible = false;
			}
		}
		this.m_LevelLab.text = LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st101295, [(ActivityType303Panel.selectIndex + 1)]);
		this.updataTips();
	}

	private initEffData() {
		if (!this.m_Eff) {
			this.m_Eff = new MovieClip();
			this.m_Eff.touchEnabled = false;
			this.m_AnimGroup.addChild(this.m_Eff);
			this.m_Eff.x = this.m_AnimGroup.width / 2;
			this.m_Eff.y = this.m_AnimGroup.height / 2;
		}
	}
	private playEff(name: string) {
		this.initEffData();
		this.m_Eff.loadUrl(ResDataPath.GetMonsterBodyPath(name), true, -1);
	}
	private onClick() {
		var activityData = <ActivityType303Data>GameGlobal.activityData[303];
		let config = ActivityType303Data.getConfig(303);
		let configData = config[ActivityType303Panel.selectIndex];
		let state = activityData.isCanBattle(configData.index);
		if (state == battleType303.TYPE2) {
			UserTips.ins().showTips(GlobalConfig.jifengTiaoyueLg.st101296);
			return;
		}
		ViewManager.ins().close(ActivityWin);
		ActivityModel.ins().sendReward(configData.Id, configData.index)
	}

	private updataTips() {
		let view = <ActivityWin>ViewManager.ins().getView(ActivityWin);
		this.desc.text = view.desc.text;
		this.date.text = view.date.text;
	}

	private onClickRight() {
		if (this.m_Scroller && this.m_Scroller.viewport) {
			let maxWidth = (this.listData.source.length - 3.5) * 106 - 6;
			let nowPoint = this.m_Scroller.viewport.scrollH;
			let nextPoibt = nowPoint + (3.5 * 106);
			if (nextPoibt > maxWidth) {
				nextPoibt = maxWidth;
			}
			this.m_Scroller.viewport.scrollH = nextPoibt;
		}
	}

	private onClickLeft() {
		if (this.m_Scroller && this.m_Scroller.viewport) {
			let nowPoint = this.m_Scroller.viewport.scrollH;
			let nextPoibt = nowPoint - (3.5 * 106);
			if (nextPoibt <= 0) {
				nextPoibt = 0;
			}
			this.m_Scroller.viewport.scrollH = nextPoibt;
		}
	}

	private onSaveScrData() {
		if (this.m_Scroller && this.m_Scroller.viewport) {
			if (this.m_Scroller.viewport.scrollH < ((this.listData.source.length - 3.5) * 106)) {
				this.m_RightBtn.visible = true;
			} else {
				this.m_RightBtn.visible = false;
			}
			if (this.m_Scroller.viewport.scrollH > 106) {
				this.m_LeftBtn.visible = true;
			} else {
				this.m_LeftBtn.visible = false;
			}
		}
	}

	public check() {
		var activityData = <ActivityType303Data>GameGlobal.activityData[303];
		let config = ActivityType303Data.getConfig(303);
		for (let key in config) {
			let data = config[key];
			let isCanBattle = activityData.isCanBattle(data.index);
			if (isCanBattle == battleType303.TYPE1) {
				ActivityType303Panel.selectIndex = parseInt(key);
				return;
			}
		}
	}

	public checkPoint() {
		if (this.m_Scroller && this.m_Scroller.viewport) {
			var activityData = <ActivityType303Data>GameGlobal.activityData[303];
			let config = ActivityType303Data.getConfig(303);
			let max = (config.length - 3.5) * 106;
			let nowPoint = ActivityType303Panel.selectIndex * 106;
			if (nowPoint > max) {
				nowPoint = max;
			}
			this.m_Scroller.viewport.scrollH = nowPoint;
		}
	}

	public updateData() {

	}

}
window["ActivityType303Panel"] = ActivityType303Panel