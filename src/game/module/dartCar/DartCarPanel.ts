class DartCarPanel extends BaseView implements ICommonWindowTitle, eui.UIComponent {

	windowTitleIconName: string = GlobalConfig.jifengTiaoyueLg.st100824;
	private logBtn: eui.Button;
	private refBtn: eui.Button;
	private startBtn: eui.Button;
	private fsNum: eui.Label;
	private robNum: eui.Label;

	public timeBg: eui.Group;
	public timeLabel: eui.Label;

	private outTime: number = 0;
	private typeDesc: string;

	private dartCarSpList: Array<DartCarItem>;
	private groupCar: eui.Group
	private dartCarMove: DartCarMove;
	public m_Lan1: eui.Label;

	protected childrenCreated() {
		this.name = GlobalConfig.jifengTiaoyueLg.st100824;
		this.skinName = "DartCarPanelSkin"
		this.dartCarSpList = [];

		this.dartCarMove = new DartCarMove();
		this.groupCar.addChild(this.dartCarMove);

		this.startBtn.label = GlobalConfig.jifengTiaoyueLg.st100831;
		this.m_Lan1.text = GlobalConfig.jifengTiaoyueLg.st100832;
	}

	open() {
		this.AddClick(this.startBtn, this.onTap);
		this.AddClick(this.logBtn, this.onTap);
		this.AddClick(this.refBtn, this.onTap);
		this.observe(MessageDef.DARTCAR_STATU_CHANGE, this.refushPanelInfo);
		this.observe(MessageDef.UPDATA_DARTCAR_LIST, this.updataDartCarList);
		DartCarModel.ins().sendDartCarList();
		this.refushPanelInfo();
	}

	close() {
		this.removeObserve();
		this.removeEvents();
		this.doClear();
	}

	private doClear(): void {
		for (var item of this.dartCarSpList) {
			item.destruct();
		}
		this.dartCarSpList = [];
		this.dartCarMove.destruct();
	}

	private onTap(e): void {
		switch (e.target) {
			case this.startBtn:
				if (DartCarModel.ins().endTime > 0)
					return void UserTips.ins().showTips(GlobalConfig.jifengTiaoyueLg.st100825);
				if (DartCarModel.ins().exploitCnt < GlobalConfig.ins("CaiKuangConfig").maxcaikuangcount)
					ViewManager.ins().open(DartCarRefushWin)
				else
					UserTips.ins().showTips(GlobalConfig.jifengTiaoyueLg.st100826);
				break;
			case this.logBtn:
				ViewManager.ins().open(DartCarReportInfoWin);
				break;
			case this.refBtn:
				DartCarModel.ins().sendDartCarList();
				break;
		}
	}

	private refushTime() {
		--this.outTime;
		this.timeLabel.textFlow = TextFlowMaker.generateTextFlow(this.typeDesc + DateUtils.getFormatBySecond(this.outTime, 9));
	}
	private refushPanelInfo(): void {
		this.startBtn.visible = this.fsNum.visible = MineExploitType.NONE == DartCarModel.ins().exploitStatus;
		var config = GlobalConfig.ins("BiaoCheConfig");
		var count = config.maxrobotcount - DartCarModel.ins().robNum;
		if (count > 0)
			this.robNum.text = GlobalConfig.jifengTiaoyueLg.st100827 + count + "/" + config.maxrobotcount;
		else
			this.robNum.textFlow = (new egret.HtmlTextParser).parser(GlobalConfig.jifengTiaoyueLg.st100827 + "<font color = '#f87372'>" + count + "/" + config.maxrobotcount + "</font>");

		count = config.maxcaikuangcount - DartCarModel.ins().exploitCnt;
		if (count > 0)
			this.fsNum.text = GlobalConfig.jifengTiaoyueLg.st100828 + count + "/" + config.maxcaikuangcount;
		else
			this.fsNum.textFlow = (new egret.HtmlTextParser).parser(GlobalConfig.jifengTiaoyueLg.st100828 + "<font color = '#f87372'>" + count + "/" + config.maxcaikuangcount + "</font>")

		if (DartCarModel.ins().endTime > 0 && DartExsploitType.EXPLOIT == DartCarModel.ins().exploitStatus) {
			this.timeBg.visible = true;
			this.outTime = Math.ceil(DartCarModel.ins().endTime - GameServer.serverTime);

			this.typeDesc = GlobalConfig.jifengTiaoyueLg.st100829 + "[" + StringUtils.addColor(GlobalConfig.ins("BiaoCheTypeConfig")[DartCarModel.ins().DartCarType].name, ItemBase.QUALITY_COLOR[DartCarModel.ins().DartCarType]) + "]" + GlobalConfig.jifengTiaoyueLg.st100830 + "...";
			this.timeLabel.textFlow = TextFlowMaker.generateTextFlow(this.typeDesc + DateUtils.getFormatBySecond(this.outTime, 9));
			TimerManager.ins().doTimer(1e3, this.outTime, this.refushTime, this)
		}
		else {
			this.timeBg.visible = false
			TimerManager.ins().remove(this.refushTime, this);
		}

		if (MineExploitType.FINISH == DartCarModel.ins().exploitStatus) {
			ViewManager.ins().open(DartCarCompleteWin);
		}
	}

	private updataDartCarList(): void {
		this.doClear();
		var len = DartCarModel.ins().dartCarList.length;
		for (var i = 0; i < len; i++) {
			this.dartCarSpList[i] = new DartCarItem;
			this.dartCarSpList[i].setMineInfo(DartCarModel.ins().dartCarList[i]);
		}
		this.dartCarMove.startPerformance(this.dartCarSpList);
	}

	public CheckRedPoint() {
		return DartCarModel.ins().carRedPoint.IsRed();
	}

	public static openCheck() {
		return Deblocking.Check(DeblockingType.TYPE_27)
	}

	UpdateContent(): void {

	}
}
window["DartCarPanel"] = DartCarPanel