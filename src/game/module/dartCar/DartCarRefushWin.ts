class DartCarRefushWin extends BaseEuiPanel {

	static LAYER_LEVEL = LayerManager.UI_Main
	private commonWindowBg: CommonWindowBg;
	private group: eui.Group;
	private reward: eui.List;
	private refushBtn: eui.Button;
	private starBtn: eui.Button;
	private bar: eui.ProgressBar;
	private fsNum: eui.Label;
	private costNum: eui.Label;

	public static isTips: boolean = false;
	public m_Lan1: eui.Label;
	public m_Lan2: eui.Label;
	public m_Lan3: eui.Label;

	private m_refItem: {
		imgBg: eui.Image,
		select: eui.Image,
		currImg: eui.Image,
		isDouble: eui.Label
	}[]

	public constructor() {
		super()
	}

	initUI() {
		super.initUI()
		this.skinName = "DartCarRefushWinSkin";
		this.bar.labelDisplay.visible = false;
		this.m_refItem = this.group.$children as any;
		this.reward.itemRenderer = ItemBase;

		this.m_Lan1.text = GlobalConfig.jifengTiaoyueLg.st100839;
		this.m_Lan2.text = GlobalConfig.jifengTiaoyueLg.st100840;
		this.m_Lan3.text = GlobalConfig.jifengTiaoyueLg.st100841;
		this.refushBtn.label = GlobalConfig.jifengTiaoyueLg.st100842;
		this.starBtn.label = GlobalConfig.jifengTiaoyueLg.st100843;
	}

	open() {
		this.commonWindowBg.OnAdded(this);
		this.AddClick(this.starBtn, this.onTap);
		this.AddClick(this.refushBtn, this.onTap);
		this.observe(MessageDef.DARTCAR_STATU_CHANGE, this.updateDartCar);
		this.observe(MessageDef.REFUSH_DARTCAR_SUCCESS, this.updateDartCar);

		this.refushList();
		this.updateDartCar();
	}

	close() {
		this.commonWindowBg.OnRemoved();
		this.removeObserve();
		this.removeEvents();
	}

	private refushList() {
		for (let i = 0; i < 4; i++) {
			let comp = this.group.getChildAt(i)
			this.AddClick(comp, this.onClickRefCar);
			this.m_refItem[i].imgBg.source = `comp_117_288_0${i + 1}_png`;
			this.m_refItem[i].select.visible = false;
			this.m_refItem[i].currImg.visible = false;
			this.m_refItem[i].isDouble.visible = DartCarModel.ins().isDoubleDartCar;
			this.m_refItem[i].isDouble.text = GlobalConfig.jifengTiaoyueLg.st100844;
		}

		let maxNum = GlobalConfig.ins("BiaoCheConfig").maxcaikuangcount;
		this.fsNum.text = GlobalConfig.jifengTiaoyueLg.st100828 + (maxNum - DartCarModel.ins().exploitCnt) + "/" + maxNum;
	}

	private updateDartCar(): void {
		var refreshType = DartCarModel.ins().refreshType;
		var maxTimes = GlobalConfig.ins("BiaoCheTypeConfig")[refreshType].maxTimes;
		var refreshNum = DartCarModel.ins().refreshNum;
		this.bar.maximum = maxTimes;
		if (refreshType < 4 && refreshNum != 0)
			this.bar.value = refreshNum;
		else
			this.bar.value = 0;

		this.selectCarHandle(refreshType - 1);

		var config = GlobalConfig.ins("BiaoCheConfig");
		var ybArr = config.refreshkuangyuanyuanbao;
		if (refreshType >= ybArr.length)
			refreshType = ybArr.length - 1;

		var str = "";
		var bagItem = UserBag.ins().getBagGoodsById(0, config.refreshkuangitem);

		if (bagItem) {
			str = GlobalConfig.jifengTiaoyueLg.st100022 + bagItem.itemConfig.name + "(" + bagItem.count + "/1)";
		}
		else {
			if (GameGlobal.actorModel.yb >= DartCarModel.ins().refreshCost)
				str = GlobalConfig.jifengTiaoyueLg.st100845 + DartCarModel.ins().refreshCost
			else
				str = GlobalConfig.jifengTiaoyueLg.st100845 + "<font color = '#f87372'>" + DartCarModel.ins().refreshCost + "</font>";
		}
		this.costNum.textFlow = (new egret.HtmlTextParser).parser(str);
		UIHelper.SetBtnNormalEffe(this.starBtn, DartCarModel.ins().refreshType == 4);
	}

	private onClickRefCar(e: egret.TouchEvent): void {
		this.selectCarHandle(this.group.getChildIndex(e.target));
	}

	private selectCarHandle(index: number = 0): void {
		for (let i = 0; i < 4; i++) {
			this.m_refItem[i].select.visible = false;
			this.m_refItem[i].currImg.visible = false;
		}

		var refreshType = DartCarModel.ins().refreshType;
		this.m_refItem[index].select.visible = true;
		this.m_refItem[refreshType - 1].currImg.visible = true;
		var config = GlobalConfig.ins("BiaoCheTypeConfig")[index + 1];
		let data1 = DartCarModel.countRewardList(index + 1);
		let data = data1.concat(config.item)
		this.reward.dataProvider = new eui.ArrayCollection(data);
	}

	private onTap(evt: egret.TouchEvent): void {
		switch (evt.currentTarget) {
			case this.starBtn:
				var config = GlobalConfig.ins("BiaoCheTypeConfig")[DartCarModel.ins().refreshType]
				if (DartCarModel.ins().refreshType < 4) {
					WarnWin.show(LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st100846, [config.name]), function () {
						DartCarModel.ins().sendStartDartCar();
					}, this)
					return;
				}
				DartCarModel.ins().sendStartDartCar();
				break;
			case this.refushBtn:
				if (DartCarModel.ins().refreshType == 4)
					return void UserTips.ins().showTips(GlobalConfig.jifengTiaoyueLg.st100847);

				var itemNum = UserBag.ins().getBagGoodsCountById(0, GlobalConfig.ins("BiaoCheConfig").refreshkuangitem);
				if (DartCarModel.ins().refreshCost > 0 && DartCarRefushWin.isTips == false) {
					WarnWin.show(LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st100848, [DartCarModel.ins().refreshCost]), function () {
						DartCarRefushWin.isTips = true;
						GameGlobal.actorModel.yb >= DartCarModel.ins().refreshCost || this.itemCount > 0 ? DartCarModel.ins().sendUpLevelDartCar() : UserTips.ins().showTips(GlobalConfig.jifengTiaoyueLg.st100008)
					}, this)
				}
				else if (GameGlobal.actorModel.yb >= DartCarModel.ins().refreshCost || itemNum > 0)
					DartCarModel.ins().sendUpLevelDartCar();
				else
					UserTips.ins().showTips(GlobalConfig.jifengTiaoyueLg.st100008);
				break;
		}
	}

}
window["DartCarRefushWin"] = DartCarRefushWin