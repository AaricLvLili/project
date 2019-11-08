class BossItem extends eui.ItemRenderer {
	public constructor() {
		super();
	}

	config
	list: eui.List
	infoTxt
	infoTxt0
	levelRequire
	bar: eui.ProgressBar
	timeTxt
	challengeBtn
	item: ItemBase;
	btnTips: eui.Label
	m_autoEnter: eui.CheckBox;
	//private m_checkbox_bg: eui.Image;
	// barBg
	head: eui.Image
	nameTxt
	bg: eui.Image
	needLv
	private chanceTxt: eui.Label
	private tips: eui.Label;
	private yueka: eui.Image;

	m_AutoEffect: eui.Group;
	private listData: eui.ArrayCollection;
	public m_ElementImg: eui.Image;
	public chuanQiTxt:eui.Label;

	protected createChildren(): void {
		super.createChildren();
		this.list.itemRenderer = ItemBase
		this.listData = new eui.ArrayCollection();
		this.list.dataProvider = this.listData;

		this.m_autoEnter.label = GlobalConfig.jifengTiaoyueLg.st100495;
		this.chuanQiTxt.text=GlobalConfig.jifengTiaoyueLg.st100496;
		this.challengeBtn.label=GlobalConfig.jifengTiaoyueLg.st100046;
	}

	public static SetRewardData(item: ItemBase, label: eui.Label, config) {
		let rewardData = config.winnerReward[0]
		item.data = RewardData.ToRewardData(rewardData)
		item.validateNow();
		if (rewardData.rate == 100) {
			label.text = GlobalConfig.jifengTiaoyueLg.st100480;
		} else {
			label.text = GlobalConfig.jifengTiaoyueLg.st100481;
		}
		item.showLegendEffe();

		// item.data = RewardData.ToRewardData(rewardData)
	}
	autoEffe: MovieClip;
	checkAutoEffect(b: boolean) {
		if (this.autoEffe) {
			this.m_AutoEffect.removeChild(this.autoEffe);
			this.autoEffe = null;
		}
		if (!b)
			return;
		if (this.autoEffe == null) {
			this.autoEffe = new MovieClip();
		}
		this.autoEffe.loadUrl(ResDataPath.GetUIEffePath("eff_btn_bosschoice"), true, -1)
		this.autoEffe.x = 90;
		this.autoEffe.y = 9;
		this.m_AutoEffect.addChild(this.autoEffe);
	}
	private monstersConfig: any;

	public destroy(): void {
		TimerManager.ins().remove(this.updateTime, this);
		TimerManager.ins().remove(this.updateCDTime, this);
		this.infoTxt.removeEventListener(egret.TextEvent.LINK, this.onLink, this);
		this.infoTxt0.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.infoTxtKill, this);
		this.item.destroy();
		if (this.autoEffe) {
			DisplayUtils.dispose(this.autoEffe);
			this.autoEffe = null;
		}
		var len = this.list.numChildren;
		for (var i = 0; i < len; i++) {
			let child = this.list.getChildAt(i);
			if (child instanceof ItemBase) {
				child.destroy();
			}

		}
	}


	dataChanged() {
		super.dataChanged();
		var limitStr = '';
		var color = '';
		var canChallenge;
		var bossConfig;
		this.m_autoEnter.selected = false;
		this.listData.removeAll();
		if (this.monstersConfig == null)
			this.monstersConfig = GlobalConfig.monstersConfig;

		if (this.autoEffe) {
			this.m_AutoEffect.removeChild(this.autoEffe);
			this.autoEffe = null;
		}
		let str = "";
		if (this.data instanceof PublicBossInfo) {
			var model = this.data;

			var config1 = GlobalConfig.publicBossConfig[model.id];
			var config = this.config = config1[0];

			// if(config.zsLevel >=4)
			// {
			BossItem.SetRewardData(this.item, this.chanceTxt, this.config)
			this.currentState = "all";
			// }else
			// {
			// 	this.currentState = "person";
			// }
			this.validateNow();
			// this.list.dataProvider = new eui.ArrayCollection(config.desc);
			this.listData.replaceAll(config.desc);
			var isDie = model.isDie;
			this.infoTxt.touchEnabled = true;
			this.infoTxt.addEventListener(egret.TextEvent.LINK, this.onLink, this);
			this.infoTxt0.touchEnabled = true;
			this.infoTxt0.addEventListener(egret.TouchEvent.TOUCH_TAP, this.infoTxtKill, this);


			// let idx = parseInt(this.itemIndex);
			// console.log("index="+model.index +" name="+model.id);

			this.m_autoEnter.selected = UserBoss.ins().getAutoFightByIndex(model.id - 1);

			this.checkAutoEffect(this.m_autoEnter.selected);

			// console.log("index="+model.index+"  selected="+this.m_autoEnter.selected + "  id="+model.id);

			this.m_autoEnter.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onAutoEnter, this);

			var lv = GameLogic.ins().actorModel.level;
			var zs = UserZs.ins() ? UserZs.ins().lv : 0;
			if (zs >= config.zsLevel && lv >= config.level) {
				//this.m_checkbox_bg.visible = this.m_autoEnter.visible = true;
				this.m_autoEnter.visible = false;//1.5版本先屏蔽自动挑战
			}
			else {
				//this.m_checkbox_bg.visible = this.m_autoEnter.visible = false;
				this.m_autoEnter.visible = false;
			}

			if (config.zsLevel > 0) {
				canChallenge = UserZs.ins().lv >= config.zsLevel;
				color = canChallenge ? "008f22" : "FFB051";
				limitStr = config.zsLevel + GlobalConfig.jifengTiaoyueLg.st100482;
				str = config.zsLevel + GlobalConfig.jifengTiaoyueLg.st100067;
			}
			else {
				canChallenge = GameLogic.ins().actorModel.level >= config.level;
				color = canChallenge ? "008f22" : "FFB051";
				limitStr = config.level + GlobalConfig.jifengTiaoyueLg.st100483;
				str = config.level + GlobalConfig.jifengTiaoyueLg.st100093;
			}
			this.levelRequire.text = limitStr;
			//limitStr += model.challengeing ? `<font color="#008f22">（挑战中）</font>` : ``;
			this.infoTxt.textFlow = (new egret.HtmlTextParser()).parser(GlobalConfig.jifengTiaoyueLg.st100484 + "：<u><a href=\"event:2\">" + model.people + "人</a></u>" + (model.challengeing ? "<font color=\"#008f22\">" + GlobalConfig.jifengTiaoyueLg.st100485 + "</font>" : ""))//+ "\n\n掉落：");
			this.infoTxt0.textFlow = (new egret.HtmlTextParser()).parser("<u><a href=\"event:1\" color=\"#00ff00\">" + GlobalConfig.jifengTiaoyueLg.st100486 + "</a></u>")//\n\n<font color=\"#cecdcc\">掉落：</font>");
			this.infoTxt.visible = !isDie;
			this.infoTxt0.visible = isDie;
			this.bar.value = model.hp;
			bossConfig = this.monstersConfig[config.bossId];
			this.timeTxt.visible = isDie;
			if (this.timeTxt.visible) {
				this.updateTime();
				TimerManager.ins().doTimer(100, 0, this.updateTime, this);
			}
			this.challengeBtn.visible = !isDie;
			this.challengeBtn.name = "publicChallenge";
			if (this.challengeBtn.visible) {
				var cdTime = (UserBoss.ins().cdTime - egret.getTimer()) / 1000;
				if (model.challengeing && cdTime > 0) {
					this.challengeBtn.enabled = false;
					this.challengeBtn.touchEnabled = false;
					this.updateCDTime();
					TimerManager.ins().doTimer(100, 0, this.updateCDTime, this);
				}
				else {
					this.challengeBtn.label = GlobalConfig.jifengTiaoyueLg.st100046;
					this.challengeBtn.enabled = true;
					this.challengeBtn.touchEnabled = true;
					TimerManager.ins().remove(this.updateCDTime, this);
				}
			}
			this.bar.visible = true;
		} else if (DailyFubenConfig.isContains(this.data)) {
			this.currentState = "person";
			this.validateNow();
			var tData = this.data;
			this.config = tData;
			this.tips.visible = this.infoTxt0.visible = false;
			// this.list.dataProvider = new eui.ArrayCollection(tData.showItem);
			this.listData.replaceAll(tData.showItem);
			this.yueka.visible = false;
			if (tData.id == 3121) {//月卡BOSS
				canChallenge = Recharge.ins().flag == 1;
				this.yueka.visible = true;
				this.yueka.source = "yueka_png";
				var color_1 = canChallenge ? "008f22" : "FFB051";
				limitStr = GlobalConfig.jifengTiaoyueLg.st100487;
				this.tips.visible = canChallenge;
				this.tips.text = GlobalConfig.jifengTiaoyueLg.st100488;
				this.btnTips.text = GlobalConfig.jifengTiaoyueLg.st100488;
				if (tData.zsLevel > 0) {
					str = tData.zsLevel + GlobalConfig.jifengTiaoyueLg.st100067
				} else {
					str = tData.levelLimit + GlobalConfig.jifengTiaoyueLg.st100093;
				}
			} else if (tData.id == 3122) {
				this.yueka.visible = true;
				this.yueka.source = "zhizun_png";
				canChallenge = Recharge.ins().zunCard;
				var color_1 = canChallenge ? "008f22" : "FFB051";
				limitStr = GlobalConfig.jifengTiaoyueLg.st100489;
				this.tips.visible = canChallenge;
				this.tips.text = GlobalConfig.jifengTiaoyueLg.st100490;
				this.btnTips.text = GlobalConfig.jifengTiaoyueLg.st100491;
				if (tData.zsLevel > 0) {
					str = tData.zsLevel + GlobalConfig.jifengTiaoyueLg.st100067
				} else {
					str = tData.levelLimit + GlobalConfig.jifengTiaoyueLg.st100093;
				}
			}
			else if (tData.zsLevel > 0) {
				canChallenge = UserZs.ins().lv >= tData.zsLevel;
				var color_1 = canChallenge ? "008f22" : "FFB051";
				limitStr = tData.zsLevel + GlobalConfig.jifengTiaoyueLg.st100482;
				str = tData.zsLevel + GlobalConfig.jifengTiaoyueLg.st100067;
			}
			else {
				canChallenge = GameLogic.ins().actorModel.level >= tData.levelLimit;
				var color_2 = canChallenge ? "008f22" : "FFB051";
				limitStr = tData.levelLimit + GlobalConfig.jifengTiaoyueLg.st100483;
				str = tData.levelLimit + GlobalConfig.jifengTiaoyueLg.st100093;
			}
			this.levelRequire.text = limitStr;
			var m: FbModel = UserFb.ins().getFbDataById(tData.id);
			if (m == null) return;//处理报错
			var count = m.getCount();
			var color_3 = count > 0 ? "#008f22" : "#cecdcc";
			this.infoTxt.textFlow = (new egret.HtmlTextParser()).parser(
				// limitStr + `\n\n` +
				// ("剩余次数：<font color=\"" + color_3 + "\">" + count + "次</font>\n\n") + "掉落：");
				(GlobalConfig.jifengTiaoyueLg.st100492 + "<font color=\"" + color_3 + "\">" + count + GlobalConfig.jifengTiaoyueLg.st100024 + "</font>\n\n"));
			bossConfig = this.monstersConfig[tData.bossId];
			this.challengeBtn.visible = canChallenge;
			this.challengeBtn.name = "pChallenge";

			this.challengeBtn.enabled = count > 0;
			this.challengeBtn.touchEnabled = this.challengeBtn.enabled;
			// this.timeTxt.text = this.challengeBtn.visible ? `` : `转生或等级不足`;
			this.timeTxt.text = "";
			this.bar.visible = false;
		}

		if (bossConfig) {
			this.head.source = ResDataPath.getBossHeadImage(bossConfig.head);//bossConfig.head + "_png";
			this.nameTxt.text = str + " " + bossConfig.name;
			this.m_ElementImg.source = ResDataPath.GetElementImgName(bossConfig.elementType);
		}

		let rect = null
		if (canChallenge) {
			//this.bg.source = 'Common_Under_037'
			// rect.left = 0
			// rect.right = 0
			// rect.top = 0
			// rect.bottom = 0
		} else {
			//this.bg.source = 'zyz_02';
			rect = new egret.Rectangle()
			rect.left = 25
			rect.right = 25
			rect.top = 25
			rect.bottom = 25
		}
		//this.bg.scale9Grid = rect
		this.needLv.visible = !canChallenge;
		this.challengeBtn.visible = this.challengeBtn.visible && canChallenge;
	};

	public onAutoEnter(e) {
		if (this.m_autoEnter.selected)
			UserBoss.ins().setAutoFight(1 << this.data.id);//+1
		else
			UserBoss.ins().setAutoFight(0);
	}

	public get selectedAutoEnter(): boolean {
		return this.m_autoEnter.selected;
	}

	updateCDTime() {
		var cdTime = (UserBoss.ins().cdTime - egret.getTimer()) / 1000;
		this.challengeBtn.label = GlobalConfig.jifengTiaoyueLg.st100493 + "（" + cdTime.toFixed(0) + "）";
		if (cdTime <= 0) {
			this.challengeBtn.label = GlobalConfig.jifengTiaoyueLg.st100046;
			this.challengeBtn.enabled = true;
			this.challengeBtn.touchEnabled = true;
			TimerManager.ins().remove(this.updateCDTime, this);
		}
	};
	updateTime() {
		var model = this.data;
		var time = model.reliveTime - egret.getTimer();
		this.timeTxt.text = DateUtils.getFormatBySecond(Math.floor(time / 1000), 1) + GlobalConfig.jifengTiaoyueLg.st100494;
		if (time <= 0) {
			UserBoss.ins().sendBossList();
			TimerManager.ins().remove(this.updateTime, this);
		}
	};

	infoTxtKill(e) {
		ViewManager.ins().open(WildBossRecordWin, this.data.id);
	}

	onLink(e) {
		var model = this.data;
		switch (e.text) {
			case "1":
				ViewManager.ins().open(WildBossRecordWin, model.id);
				break;
			case "2":
				ViewManager.ins().open(WildBossJoinWin, model.id);
				break;
		}
	};
}

window["BossItem"] = BossItem