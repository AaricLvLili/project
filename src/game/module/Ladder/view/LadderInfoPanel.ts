class LadderInfoPanel extends BaseView implements ICommonWindowTitle {
	lastNum
	winNum
	list
	level1img: eui.Label;
	duanwei1Img: eui.Label;
	// starInfo: LadderStarListView
	winImg
	truceIng
	flowPlayer
	buyTime
	updatatimetext
	starNum: eui.Label;
	diamondNum: eui.Group;
	private laddericon1: eui.Image;
	private stateGroup: eui.Group
	private ui_wz_wzjl: eui.Label
	private wz_open_time: eui.Label
	private ListBtn0: eui.Button;
	private starGroup: eui.Group;

	windowTitleIconName: string = GlobalConfig.jifengTiaoyueLg.st100579;
	private tianTiConstConfig: any;
	private roleMan = ["comp_rw_01_png", "comp_rw_02_png", "comp_rw_03_png"];
	private roleWomen = ["comp_rw_11_png", "comp_rw_12_png", "comp_rw_13_png"];

	private role_one_image: eui.Image;
	private role_two_image: eui.Image;

	public scrollGroup: eui.Group;
	public rectMask: eui.Rect;
	private timeOut: number;
	public match_label: eui.Label;
	private isMatch = false;

	public seeRank: eui.Button;
	public lastWeek: eui.Button;

	public m_Lan1: eui.Label;
	public m_Lan2: eui.Label;
	public m_Lan3: eui.Label;
	public m_Lan4: eui.Label;

	public constructor() {
		super()
		this.name = GlobalConfig.jifengTiaoyueLg.st100579;
		this.skinName = "LadderInfoPanelSkin"
		this.lastWeek.label = GlobalConfig.jifengTiaoyueLg.st100801;
		this.seeRank.label = GlobalConfig.jifengTiaoyueLg.st100497;
		this.wz_open_time.text = GlobalConfig.jifengTiaoyueLg.st100803;
		this.m_Lan1.text = GlobalConfig.jifengTiaoyueLg.st100804;
		this.m_Lan2.text = GlobalConfig.jifengTiaoyueLg.st100492;
		this.flowPlayer.label = GlobalConfig.jifengTiaoyueLg.st100805;
		this.m_Lan3.text = GlobalConfig.jifengTiaoyueLg.st100806;
		this.truceIng.text = GlobalConfig.jifengTiaoyueLg.st100807;
		this.m_Lan4.text = GlobalConfig.jifengTiaoyueLg.st102087;
	}
	private getSource(index, indexone): string {
		if (indexone == 0) {
			return this.roleMan[index];
		} else {
			return this.roleWomen[index];
		}
	}
	private fightHead(): void {
		let len = this.scrollGroup.numChildren;
		for (let i = 0; i < len; i++) {
			this.scrollGroup.removeChildAt(0);
		}
		for (var e = 0; 10 > e; e++) {
			var img = new eui.Image;

			img.source = this.getSource((MathUtils.randomArray([1, 2, 3]) - 1), MathUtils.randomArray([0, 1]));
			img.width = 208;
			img.height = 190;

			this.scrollGroup.addChild(img),
				img.y = e * img.height + 10
		}

	}

	childrenCreated() {
		this.list.itemRenderer = ItemBase;
	}

	open() {
		this.ListBtn0.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
		this.flowPlayer.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
		this.buyTime.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
		MessageCenter.addListener(Ladder.ins().postTadderChange, this.UpdateContent, this);
		this.buyTime.textFlow = new egret.HtmlTextParser().parser("<font color = '#23C42A'><u>" + GlobalConfig.jifengTiaoyueLg.st100580 + "</u></fomt>");
		TimerManager.ins().doTimer(1000, 0, this._updateNextTime, this);

		this.lastWeek.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnClickGo, this)
		this.seeRank.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnClickGo, this)

		this.observe(Ladder.ins().postPlayerBack, this.matchSuccessful);

		this.scrollGroup.mask = this.rectMask;
		this.scrollGroup.visible = false;
		this.role_two_image.visible = true;
		//初使化角色0 男1 女
		var model = SubRoles.ins().getSubRoleByIndex(0);
		if (model.sex == 0) {
			this.role_one_image.source = this.roleMan[model.job - 1];
		} else {
			this.role_one_image.source = this.roleWomen[model.job - 1];
		}
	}
	//匹配成功
	matchSuccessful() {
		this.isMatch = true;
		var t = Ladder.ins().getActorInfo();
		if (!t) {
			console.error("showPointPlayerInfo,ladder data is null")
			return;
		}
		if (t[0] != false || t[1] != false) {
			if (this.scrollGroup.numChildren == 10) {
				var image = <eui.Image>this.scrollGroup.getChildAt(9);
				image.source = this.getSource(t[3] - 1, t[4]);
			}

		}
	}


	playerBack() {
		//this.setPlayerHead();
		this.role_two_image.visible = false;
		this.scrollGroup.visible = true;
		this.fightHead();
		egret.Tween.get(this.scrollGroup).to({
			y: -9 * 255
		}, 3500).call(() => {
			egret.Tween.removeTweens(this.scrollGroup);
			this.scrollGroup.y = 0;
			if (this.isMatch == false) {
				this.role_two_image.visible = true;
				this.scrollGroup.visible = false;
				this.match_label.visible = false;
				this.flowPlayer.visible = true;
				UserTips.ins().showTips(GlobalConfig.jifengTiaoyueLg.st100581);
				return;
			}

			if (Ladder.ins().getActorInfo(1) == 0 && Ladder.ins().getActorInfo(0)) {
				UserTips.ins().showTips(GlobalConfig.jifengTiaoyueLg.st100582);
				this.role_two_image.visible = true;
				this.scrollGroup.visible = false;

				this.match_label.visible = false;
				this.flowPlayer.visible = true;
			}
			else {
				UserTips.ins().showTips(GlobalConfig.jifengTiaoyueLg.st100583);
				this.timeOut = egret.setInterval(this.sendStarPlay, this, 1500);

			}
			//this.rollOver()
		},
			this)
	}

	//开始战斗
	sendStarPlay() {
		egret.clearInterval(this.timeOut);
		Ladder.ins().sendStarPlay(Ladder.ins().getActorInfo(1), Ladder.ins().getActorInfo(0));
		this.match_label.visible = false;
		this.flowPlayer.visible = true;
		this.isMatch = false;
	};

	close() {
		// this.starInfo.destroy();
		this.flowPlayer.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
		this.buyTime.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
		this.ListBtn0.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
		this.lastWeek.removeEventListener(egret.TouchEvent.TOUCH_TAP, this._OnClickGo, this)
		this.seeRank.removeEventListener(egret.TouchEvent.TOUCH_TAP, this._OnClickGo, this)
	}


	/**触摸事件 */
	onTap(e) {
		switch (e.currentTarget) {
			case this.flowPlayer:
				if (Ladder.ins().challgeNum <= 0) {
					UserTips.ins().showTips(GlobalConfig.jifengTiaoyueLg.st100584);
					return;
				}
				Ladder.ins().sendGetSomeOne();
				this.playerBack();
				this.match_label.visible = true;
				this.flowPlayer.visible = false;
				// if (ViewManager.ins().isShow(LadderChallengeWin)) {
				// 	//不允许重复打开 匹配面板
				// 	return;
				// }
				// ViewManager.ins().open(LadderChallengeWin);
				break;
			case this.buyTime:
				if (this.tianTiConstConfig == null)
					this.tianTiConstConfig = GlobalConfig.ins("TianTiConstConfig");

				if (Ladder.ins().todayBuyTime == this.tianTiConstConfig.maxBuyChallengesCount) {
					UserTips.ins().showTips(GlobalConfig.jifengTiaoyueLg.st100585);
					return;
				}
				if (GameLogic.ins().actorModel.yb < this.tianTiConstConfig.buyChallengesCountYuanBao) {
					UserTips.ins().showTips(GlobalConfig.jifengTiaoyueLg.st100014);
					return;
				}
				if (Ladder.ins().isTipsFlag) {
					Ladder.ins().sendBuyChallgeTime();
				}
				else {
					let tips = LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st100586, [this.tianTiConstConfig.buyChallengesCountYuanBao]) +
						GlobalConfig.jifengTiaoyueLg.st100587 + Ladder.ins().todayBuyTime + "/" + this.tianTiConstConfig.maxBuyChallengesCount;
					if (Ladder.ins().isTipsFlag == false) {
						tips = tips + "\n\n<font color='#FFB82A'>" + GlobalConfig.jifengTiaoyueLg.st100550;
					}
					WarnWin.show(tips, function () {
						Ladder.ins().isTipsFlag = true;
						Ladder.ins().sendBuyChallgeTime();
					}, this);
				}

				break;
			case this.ListBtn0:
				Ladder.ins().sendChangeList();

				break;
		}
	};

	//更新时间
	_updateNextTime() {
		if (this.tianTiConstConfig == null)
			this.tianTiConstConfig = GlobalConfig.ins("TianTiConstConfig");

		if (Ladder.ins().challgeNum >= this.tianTiConstConfig.maxRestoreChallengesCount) {
			this.updatatimetext.text = GlobalConfig.jifengTiaoyueLg.st100589
		} else {
			if (Ladder.ins().NextTime - GameServer.serverTime > 0) {
				this.updatatimetext.text = `(${GameServer.GetPkTime(Ladder.ins().NextTime)})` + GlobalConfig.jifengTiaoyueLg.st100543
			} else {
				this.updatatimetext.text = GlobalConfig.jifengTiaoyueLg.st100589;
			}
		}
	}

	/**刷新 自己的挑战数据*/
	private duanweiList: Array<string> = [GlobalConfig.jifengTiaoyueLg.st100590, GlobalConfig.jifengTiaoyueLg.st100591, GlobalConfig.jifengTiaoyueLg.st100592, GlobalConfig.jifengTiaoyueLg.st100593, GlobalConfig.jifengTiaoyueLg.st100594];
	UpdateContent() {
		if (this.tianTiConstConfig == null)
			this.tianTiConstConfig = GlobalConfig.ins("TianTiConstConfig");

		this.lastNum.text = "" + Ladder.ins().challgeNum + "/" + this.tianTiConstConfig.maxRestoreChallengesCount;
		if (Ladder.ins().challgeNum > 0) {
			this.lastNum.textColor = 0x2ECA22;
		}
		else {
			this.lastNum.textColor = 0xf87372;
		}
		this.winNum.text = GlobalConfig.jifengTiaoyueLg.st100800 + Ladder.ins().winNum;
		var config = Ladder.ins().getLevelConfig();
		if (config) {
			var list = [Ladder.ins().creatRewardData(config.danAward[0])];
			this.list.dataProvider = new eui.ArrayCollection(list);
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
			// this.starInfo.updataStarInfo(config);
			// this.starInfo.setLvAndRank(config);
			// if (this.starInfo.parent == null) {
			// 	this.addChildAt(this.starInfo, 3);
			// }
			this.showStar(config);
		}
		this.winImg.visible = Ladder.ins().lianWin;
		this.truceUIChange();
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



	truceUIChange() {
		this.stateGroup.visible = Ladder.ins().isOpen
		this.ui_wz_wzjl.visible = !Ladder.ins().isOpen;
		this.wz_open_time.visible = !Ladder.ins().isOpen;
	};

	private _OnClickGo(evt: egret.TouchEvent): void {
		switch (evt.currentTarget) {
			case this.lastWeek:
				ViewManager.ins().open(LadderRankWin, 0);
				break;
			case this.seeRank:
				ViewManager.ins().open(LadderRankWin, 1);
				break;
		}
	}

	public CheckRedPoint() {
		return Ladder.ins().checkRedShow();
	}

	public static openCheck() {
		return Deblocking.Check(DeblockingType.TYPE_02)
	}
}
window["LadderInfoPanel"] = LadderInfoPanel