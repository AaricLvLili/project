class LadderKingList extends BaseEuiView implements ICommonWindow {
	//private dialogCloseBtn:eui.Button;
	private kingListDtail: eui.Scroller;
	private ListDtail: eui.List;
	private m_bg

	public constructor() {
		super();
	}


	UpdateContent() {

	}

	initUI() {
		super.initUI();
		this.skinName = "LadderListSkin";


	};
	open() {
		this.m_bg.init(`LadderKingList`, GlobalConfig.jifengTiaoyueLg.st100808)
		//this.dialogCloseBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnClick, this);
		this.ListDtail.itemRenderer = LadderDetailList;
		// var obj:any = {};
		// obj.recordType = 2;
		// obj.isWin = 1;
		// obj.recordTime = 45564545;
		// obj.name = "ashin";
		// obj.power = 32232323;
		// obj.awardType = 2;
		// obj.zhuansheng_lv = 12;
		// obj.lv = 120;

		var arr = Ladder.ins().recordList.sort((a, b) => {
			if (a.recordTime > b.recordTime)
				return -1;
			else
				return 1;
		});

		this.ListDtail.dataProvider = new eui.ArrayCollection(arr);//Ladder.ins().recordList   [obj]  
	}

	close() {
		// this.dialogCloseBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this._OnClick, this)
	}

	private _OnClick(e: egret.TouchEvent) {
		ViewManager.ins().close(this);
	}

}
ViewManager.ins().reg(LadderKingList, LayerManager.UI_Main);
window["LadderKingList"]=LadderKingList