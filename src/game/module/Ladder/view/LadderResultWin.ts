class LadderResultWin extends BaseEuiPanel {

	_rotation = 0;
	listData: eui.ArrayCollection = new eui.ArrayCollection
	// mc: MovieClip
	isWin
	// bg
	result
	// closeBtn
	s
	list
	// starList: LadderResultStarlistView
	upLevel
	upId
	lastlevel
	lastRank
	// star1
	// star2
	delayTime


	private fightResultBg: FightResultPanel
	private get closeBtn(): eui.Button {
		return this.fightResultBg["closeBtn"]
	}

	public constructor() {
		super();

	}
	public laddericon1: eui.Image;
	public level1img: eui.Label;
	public duanwei1Img: eui.Label;
	public winImg: eui.Image;
	public starGroup: eui.Group;
	public diamondNum: eui.Group;
	public starNum: eui.Label;
	private tianTiConstConfig
	/**刷新 自己的挑战数据*/
	private duanweiList: Array<string> = [GlobalConfig.jifengTiaoyueLg.st100590, GlobalConfig.jifengTiaoyueLg.st100591, GlobalConfig.jifengTiaoyueLg.st100592, GlobalConfig.jifengTiaoyueLg.st100593, GlobalConfig.jifengTiaoyueLg.st100594];
	initUI() {
		super.initUI()
		this.skinName = "LadderResiltWinSkin"
		this.lastlevel = VIEW_LAYER_LEVEL.TOP
		this.list.dataProvider = this.listData
		this.list.itemRenderer = ItemBase
		// this.mc = new MovieClip
		// this.mc.x = 242
		// this.mc.y = 261
		this.layerLevel = VIEW_LAYER_LEVEL.TOP;
		(this.closeBtn.labelDisplay as eui.Label).size = 18;
	};
	UpdateContent() {
		if (this.tianTiConstConfig == null)
			this.tianTiConstConfig = GlobalConfig.ins("TianTiConstConfig");
		var config = Ladder.ins().getLevelConfig();
		if (config) {
			this.level1img.text = this.duanweiList[config.level];//"ladderlv_" + config.level;
			this.laddericon1.source = "comp_95_78_0" + config.level + "_png";
			if (config.level == 4) {
				this.starNum.text = GlobalConfig.jifengTiaoyueLg.st100050 + " * " + Ladder.ins().nowId;
				this.diamondNum.visible = true;
			} else {
				this.diamondNum.visible = false;
			}


			if (config.showDan > 0) {
				this.duanwei1Img.text = config.showDan + GlobalConfig.jifengTiaoyueLg.st100103;
			}
			else {
				this.duanwei1Img.text = "";
			}
			this.showStar(config);
		}
		this.winImg.visible = Ladder.ins().lianWin;
	};
    /**
     * @param isWin: boolean  		是否胜利
     * @param list: RewardData[]  	奖励数据列表
     * @param upLevel: number 		之前的level
     * @param upId: number   		之前的id
     * @param upStar: number   		加了多少星
     */
	open(...param: any[]) {
		super.open(param)
		this.isWin = param[0]; //是否胜利	
		var list = param[1]; //奖励数据列表	
		var upLevel = param[2]; //之前的level
		var upId = param[3]; //之前的id
		var upStar = param[4]; //加了多少星
		this.UpdateContent();
		this.currentState = this.isWin ? "win" : "lose";
		this.fightResultBg.SetState(this.isWin ? "win" : "lose");
		if (this.fightResultBg["closeBtn"])
			(this.fightResultBg["closeBtn"].labelDisplay as eui.Label).size = 18;
		// this.closeBtn.name = this.isWin ? "领取奖励" : "退出",
		this.s = 5;
		this.updateCloseBtnLabel();
		TimerManager.ins().doTimer(1e3, 5, this.updateCloseBtnLabel, this);
		this.listData.source = list;
		this.list.validateNow()
		this.refushStarInfo(upLevel, upId, upStar);

		this.addTouchEvent(this, this.onTap, this.closeBtn);
		// var info = Ladder.ins().getLevelConfig(upLevel, upId);
		var info = Ladder.ins().getLevelConfig();
		this.showStar(info);
		let len = this.list.numChildren;
		for (let i = 0; i < len; ++i) {
			let child = this.list.getChildAt(i);
			if (child && child instanceof ItemBase) {
				child.nameTxt.strokeColor = Color.White;
				child.nameTxt.stroke = 1;
			}
		}

	};
	close() {
		TimerManager.ins().remove(this.updateCloseBtnLabel, this);
		this.closeBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
		// egret.Tween.removeTweens(this.starList);
		// DisplayUtils.removeFromParent(this.mc);
		if (GameMap.fubenID > 0) {
			UserFb.ins().sendExitFb();
		}
		ViewManager.ins().open(LadderWin, 4);
	};
    /**
     * 更新界面
     * @param level		等级
     * @param id		id
     * @param starNum	加了多少星
     */
	refushStarInfo(level, id, starNum) {
		var info = Ladder.ins().getLevelConfig(level, id);
		this.upLevel = level;
		this.upId = id;
		//更新段位星星
		// this.starList.updataStarInfo(info);
		// this.starList.setLvAndRank(info);
		this.lastlevel = info.showDan;
		this.lastRank = info.level;

		//设置星星状态
		if (this.isWin) {
			// this.star1.visible = starNum >= 1;
			// this.star1.currentState = "light";
			// this.star2.visible = starNum >= 2;
			// this.star2.currentState = "light";
		}
		else {
			// this.star1.visible = starNum >= 1;
			// this.star1.currentState = "black";
			// this.star2.visible = starNum >= 2;
			// this.star2.currentState = "black";
		}
		// if (this.starList) {
		// 	this.starList.x = 142;
		// }
		//延迟0.5秒播放星星改变动画
		if (level != 4) {
			this.delayTime = egret.setTimeout(() => {
				egret.clearTimeout(this.delayTime);
				this.setStarInfoChange(info.showStar, starNum);
			}, this, 500);
		}
	};
    /**
     * 星星数量改变
     * @param index	当前数量
     * @param num	增加数量
     */
	setStarInfoChange(index, num) {
		if (num > 0) {
			// this.starList.upStarStatu(index + 1, num, this.isWin);
		}
	};

	private showStar(info) {
		this.starGroup.removeChildren();
		var starNum: number = Ladder.ins().getStatuByLevel(info.level);
		var showStar: number = info.showStar;
		var img: eui.Image;
		for (var i: number = 0; i < starNum; i++) {
			img = new eui.Image();
			if (i < showStar) {
				img.source = "comp_15_15_01_png";
			}
			else {
				img.source = "comp_15_15_03_png";//";
			}
			this.starGroup.addChild(img);
		}
	}

	cheackIsChangeLevel(num: number) {
		if (this.upLevel == Ladder.ins().level && this.upId == Ladder.ins().nowId) {
			return;
		}
		// var t = egret.Tween.get(this.starList);
		// t.to({ "alpha": 1 }, 600).call(() => {
		// 	egret.Tween.removeTweens(this.starList);
		// 	var info = Ladder.ins().getLevelConfig();
		// 	this.starList.updataStarInfo(info, false);
		// 	if (this.isWin && num >= 1) {
		// 		this.starList.upStarStatu(1, num, this.isWin);
		// 	}

		// 	var currentLevel = info.showDan;
		// 	var currentRank = info.level;
		// 	if (this.lastRank < currentRank) {
		// 		this.starList.showRankUp(currentRank);
		// 		this.starList.showLvUp(currentLevel);
		// 	}
		// 	else {
		// 		if (this.lastlevel < currentLevel) {
		// 			this.starList.showLvDown(currentLevel);
		// 		}
		// 		else if (this.lastlevel > currentLevel) {
		// 			this.starList.showLvUp(currentLevel);
		// 		}
		// 	}

		// }, this);
	};
    /**
     * 触摸事件
     */
	onTap(e) {
		switch (e.currentTarget) {
			case this.closeBtn:
				ViewManager.ins().close(this);
				break;
		}
	};
    /**
     * 倒计时关闭界面
     */
	updateCloseBtnLabel() {
		this.s--;
		if (this.s <= 0)
			ViewManager.ins().close(this);
		this.closeBtn.label = this.closeBtn.name + "(" + this.s + "s)";
	};
}


ViewManager.ins().reg(LadderResultWin, LayerManager.UI_Popup);
window["LadderResultWin"] = LadderResultWin