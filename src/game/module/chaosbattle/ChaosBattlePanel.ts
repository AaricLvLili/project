class ChaosBattlePanel extends BaseView implements ICommonWindowTitle {
	windowTitleIconName?: string;
	public constructor(data?: any) {
		super();
		this.name = GlobalConfig.jifengTiaoyueLg.st102007;
		this.windowTitleIconName = GlobalConfig.jifengTiaoyueLg.st102007;
		this.skinName = "ChaosBattlePanelSkin";
	}

	public m_MainBtn: eui.Button;
	public m_AwardBtn: eui.Button;
	public m_TitleLab: eui.Label;
	public m_Tips0: eui.Label;
	public m_Tips1: eui.Label;
	public m_Tips2: eui.Label;
	public m_Tips3: eui.Label;
	public m_Tips4: eui.Label;
	public m_Tips5: eui.Label;
	public m_Lan: eui.Label;
	public m_List: eui.List;
	private m_ListData: eui.ArrayCollection;
	public m_Time: eui.Label;

	private isOpen: boolean = true;
	protected childrenCreated() {
		super.childrenCreated();
		this.m_TitleLab.textFlow = (new egret.HtmlTextParser).parser(GlobalConfig.jifengTiaoyueLg.st102008);
		this.m_Tips0.textFlow = (new egret.HtmlTextParser).parser(GlobalConfig.jifengTiaoyueLg.st102009);
		this.m_Tips1.textFlow = (new egret.HtmlTextParser).parser(GlobalConfig.jifengTiaoyueLg.st102010);
		this.m_Tips2.textFlow = (new egret.HtmlTextParser).parser(GlobalConfig.jifengTiaoyueLg.st102011);
		this.m_Tips3.textFlow = (new egret.HtmlTextParser).parser(GlobalConfig.jifengTiaoyueLg.st102012);
		this.m_Tips4.textFlow = (new egret.HtmlTextParser).parser(GlobalConfig.jifengTiaoyueLg.st102013);
		this.m_Tips5.textFlow = (new egret.HtmlTextParser).parser(GlobalConfig.jifengTiaoyueLg.st102014);
		this.m_Lan.text = GlobalConfig.jifengTiaoyueLg.st102015;
		this.m_MainBtn.label = GlobalConfig.jifengTiaoyueLg.st100046;
		this.m_List.itemRenderer = ItemBase;
		this.m_ListData = new eui.ArrayCollection();
		this.m_List.dataProvider = this.m_ListData;
		let awardShow = GlobalConfig.ins("CompetitionConst").awardShow;
		this.m_ListData.replaceAll(awardShow);
		this.m_Time.visible = true;
	};
	private addViewEvent() {
		this.AddClick(this.m_MainBtn, this.onClickMianBten);
		this.AddClick(this.m_AwardBtn, this.onClickAwardBtn);
		this.observe(ChaosBattleEvt.CHAOSBATTLE_DATAUPDATE_MSG, this.initData)
	}
	private removeEvent() {
	}

	public open() {
		this.addViewEvent();
		this.initData();
		this.addTime();
	};
	public close() {
		this.removeEvent();
		this.removeTime();
	};

	public release() {
		this.removeEvent();
	}

	private addTime() {
		this.removeTime();
		TimerManager.ins().doTimer(1000, 0, this.playTime, this);
		this.playTime();
	}
	private removeTime() {
		TimerManager.ins().remove(this.playTime, this);
	}

	private playTime() {
		let chaosBattleModel = ChaosBattleModel.getInstance;
		if (this.isOpen) {
			let endTime = chaosBattleModel.endTime - GameServer.serverTime;
			if (endTime <= 0) {
				this.m_Time.text = "";
				this.isOpen = false;
				// this.m_MainBtn.enabled = this.isOpen;
				return;
			}
			this.m_Time.text = DateUtils.GetFormatSecond(endTime, DateUtils.TIME_FORMAT_1) + GlobalConfig.jifengTiaoyueLg.st102016;
		} else {
			let openTime = chaosBattleModel.openTime - GameServer.serverTime;
			if (openTime <= 0) {
				let endTime = chaosBattleModel.endTime - GameServer.serverTime;
				if (endTime <= 0) {
					this.m_Time.text = "";
					this.isOpen = false;
					// this.m_MainBtn.enabled = this.isOpen;
					return;
				} else {
					this.isOpen = true;
					this.m_Time.text = DateUtils.GetFormatSecond(endTime, DateUtils.TIME_FORMAT_1) + GlobalConfig.jifengTiaoyueLg.st102016;
					return;
				}
			}
			this.m_Time.text = DateUtils.GetFormatSecond(openTime, DateUtils.TIME_FORMAT_1) + GlobalConfig.jifengTiaoyueLg.st100573;
		}
	}

	private initData() {
		let chaosBattleModel = ChaosBattleModel.getInstance;
		if ((chaosBattleModel.openTime - GameServer.serverTime) <= 0 && (chaosBattleModel.endTime - GameServer.serverTime) > 0) {
			this.isOpen = true;
			// this.m_MainBtn.enabled = this.isOpen;
		} else {
			if ((chaosBattleModel.endTime - GameServer.serverTime) <= 0) {
				this.m_Time.text = "";
			}
			this.isOpen = false;
			// this.m_MainBtn.enabled = this.isOpen;
		}
		this.playTime();
	}

	UpdateContent(): void {

	}

	private onClickMianBten() {
		if (!ChaosBattleModel.getInstance.checkRedPoint()) {
			UserTips.ins().showTips(GlobalConfig.jifengTiaoyueLg.st101885);
		}
		ChaosBattleSproto.ins().sendChaosBattleAtkMsg();
	}

	private onClickAwardBtn() {
		ViewManager.ins().open(ChaosBattleRankWin);
	}

	public CheckRedPoint() {
		let chaosBattleModel = ChaosBattleModel.getInstance;
		return chaosBattleModel.checkRedPoint();
	}
}
window["ChaosBattlePanel"] = ChaosBattlePanel