class DrillPanel extends BaseView implements ICommonWindowTitle {

	private rank: any;
	private tier_one: any;
	private tier_two: any;
	private tier_three: any;
	private award: any;
	private progress_bar: any;

	private boss_one: MovieClip;
	private boss_two: MovieClip;
	private boss_three: MovieClip;
	private box_len: Number;

	private challengeRoadConfig;
	private challengeRoadBaseConfig;
	private challengeRoadAwardConfig;


	public constructor() {
		super();
		this.skinName = "DrillPanelSkin";

	}

	protected childrenCreated(): void {
		this.box_len = this.progress_bar.box_group.numChildren;
		this.progress_bar.bar.slideDuration = 0;
		this.progress_bar.bar.maximum = 50;
		this.progress_bar.bar.labelDisplay.visible = false;
		// UIHelper
		this.rank.m_Lan1.text = GlobalConfig.jifengTiaoyueLg.st100388;
		this.award.challenge_btn.label=GlobalConfig.jifengTiaoyueLg.st100376;
	}


	windowTitleIconName: string = GlobalConfig.jifengTiaoyueLg.st100382;
	UpdateContent(): void {
		this.initConfig();
		this.updataBox();

	}
	private updataBox(): void {
		let proNum: any = DrillModel.ins().sc_tryroad_datas.id;
		if (proNum > 50) {
			proNum = proNum - 50;
		}
		this.progress_bar.bar.value = proNum;

		for (var i = 0; i < this.box_len; i++) {
			let index = i;
			if (DrillModel.ins().sc_tryroad_datas.id > 50) {
				index += 5;
			}
			var state = this.getBoxRewardState(index);
			let btn = this.progress_bar.box_group.getChildAt(i) as eui.Button;
			if (state == RewardState.NotReached) {
				let nameStrNum = 7 + i;
				let nameStr = "comp_60_60_0";
				if (nameStrNum >= 10) {
					nameStr = "comp_60_60_";
				}
				// btn.icon = nameStr + `${nameStrNum}_png`;
				btn["redPoint"].visible = false;
				btn["stateImg"].visible = false;
			}
			else if (state == RewardState.CanGet) {
				// btn.icon = `comp_60_60_0${i + 1}_png`;
				btn["redPoint"].visible = true;
				btn["stateImg"].visible = false;
			}
			else if (state == RewardState.Gotten) {
				// btn.icon = `comp_60_60_0${i + 1}_png`;
				btn["redPoint"].visible = false;
				btn["stateImg"].visible = true;
			}
		}
	}
	//获取配置
	private initConfig(): void {
		if (this.challengeRoadConfig == null) {
			this.challengeRoadConfig = GlobalConfig.ins("ChallengeRoad");
		}
		if (this.challengeRoadBaseConfig == null) {
			this.challengeRoadBaseConfig = GlobalConfig.ins("challengeRoadBaseConfig");
		}
		if (this.challengeRoadAwardConfig == null) {
			this.challengeRoadAwardConfig = GlobalConfig.ins("challengeRoadAwardConfig");
		}

	}

	//初使化BOSS
	private initBoss(): void {
		if (!this.boss_one) {
			this.boss_one = this.creatMovie(this.tier_one);
		}
		if (!this.boss_three) {
			this.boss_three = this.creatMovie(this.tier_three);
		}
		if (!this.boss_two) {
			this.boss_two = this.creatMovie(this.tier_two);
		}
	}
	private creatMovie(parent: any): MovieClip {
		let mc: MovieClip = new MovieClip();
		mc.touchEnabled = false;
		mc.x = 70;
		mc.y = 20;
		mc.scaleX = -0.7;
		mc.scaleY = 0.7;
		parent.addChildAt(mc, 2);
		return mc;
	}
	open(): void {
		this.childrenCreated()
		this.initConfig();
		this.observe(MessageDef.TRYROAD_DATAS, this.tryroadData);
		this.observe(MessageDef.TRYROAD_RANK, this.tryroadRank);
		this.AddClick(this.award.challenge_btn, this.onChallenge);
		this.tryroadData();

		for (let i = 0; i < this.box_len; ++i) {
			this.AddClick(this.progress_bar.box_group.getChildAt(i), this.boxClick)
		}
		DrillModel.ins().drillRank();

		UIHelper.SetLinkStyleLabel(this.rank.check_rank, GlobalConfig.jifengTiaoyueLg.st100381);

		this.AddClick(this.rank.check_rank, this.openRankWin);

	}

	openRankWin() {
		ViewManager.ins().open(DrillRankPanel);
	};


	tryroadRank(): void {
		let rankData: Sproto.sc_get_tryroad_rank_request;
		rankData = DrillModel.ins().tryroad_rank;
		let len = rankData.data.length;
		if (len == 0) {
			this.rank.rank_one.visible = false;
			this.rank.rank_two.visible = false;
			this.rank.rank_three.visible = false;
		} else if (len == 1) {
			this.rank.rank_one.visible = true;
			this.setLableData(this.rank.rank_one, rankData.data[0]);
			this.rank.rank_two.visible = false;
			this.rank.rank_three.visible = false;
		} else if (len == 2) {
			this.setLableData(this.rank.rank_one, rankData.data[0]);
			this.setLableData(this.rank.rank_two, rankData.data[1]);
			this.rank.rank_one.visible = true;
			this.rank.rank_two.visible = true;
			this.rank.rank_three.visible = false;
		} else {
			this.setLableData(this.rank.rank_one, rankData.data[0]);
			this.setLableData(this.rank.rank_two, rankData.data[1]);
			this.setLableData(this.rank.rank_three, rankData.data[2]);
			this.rank.rank_one.visible = true;
			this.rank.rank_two.visible = true;
			this.rank.rank_three.visible = true;
		}


	}
	setLableData(dis: any, data: Sproto.tryroad_rank_data): void {
		dis.rank.text = data.rank + "";
		dis.name.text = data.name
		dis.vaule.text = data.lvl + GlobalConfig.jifengTiaoyueLg.st100383;
	}


	close(): void {
		// this.removeEvents();
		// this.removeObserve();

		DisplayUtils.dispose(this.boss_one);
		this.boss_one = null;
		// ObjectPool.push(this.boss_one)
		DisplayUtils.dispose(this.boss_three);
		this.boss_three = null;
		// ObjectPool.push(this.boss_three)
		DisplayUtils.dispose(this.boss_two);
		this.boss_two = null;
		// ObjectPool.push(this.boss_two)
	}
	//宝箱点击事件
	private boxClick(e: egret.TouchEvent) {
		let index = this.progress_bar.box_group.getChildIndex(e.currentTarget);
		if (DrillModel.ins().sc_tryroad_datas.id > 50) {
			index += 5;
		}

		var state = this.getBoxRewardState(index);

		var config: Array<any> = this.challengeRoadAwardConfig[(index + 1)]["boxAward"];
		let count: Number = this.challengeRoadAwardConfig[(index + 1)]["time"]

		let str: string = LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st100384, [count]);
		ViewManager.ins().open(GetReward2Panel, GlobalConfig.jifengTiaoyueLg.st100385, str, RewardData.ToRewardDatas(config), () => {
			DrillModel.ins().drillAward(index + 1);
		}, state)
	}

	getBoxRewardState(index: number): RewardState {

		let len = DrillModel.ins().sc_tryroad_datas.rewards.length;

		if (DrillModel.ins().sc_tryroad_datas.rewards.length == 0 || len <= index) {
			return RewardState.NotReached;
		} else {
			if (DrillModel.ins().sc_tryroad_datas.rewards[index].status == 0) {
				return RewardState.CanGet;
			} else {
				return RewardState.Gotten;
			}
		}
	}

	//挑战
	private onChallenge(e: egret.TouchEvent): void {
		DrillModel.ins().enterCopy(DrillModel.ins().sc_tryroad_datas.id);
	}

	private tryroadData(): void {
		let data: Sproto.sc_tryroad_datas_request = DrillModel.ins().sc_tryroad_datas;

		this.updataBox();
		let index_one: Number;
		let index_two: Number;
		let index_three: Number;
		this.tier_one.completed_img.visible = false;
		this.tier_two.completed_img.visible = false;
		this.tier_three.completed_img.visible = false;
		if (data.id == 99) {
			index_one = data.id - 2;
			index_two = data.id - 1;
			index_three = data.id;
			this.tier_one.completed_img.visible = true;
			this.tier_two.completed_img.visible = true;
			this.tier_three.completed_img.visible = true;
			this.award.complete_label.visible = true;
			this.award.challenge_btn.visible = false;

		} else if (data.id % 3 == 0) {
			index_one = data.id + 1;
			index_two = data.id + 2;
			index_three = data.id + 3;
		} else if (data.id % 3 == 1) {
			index_one = data.id;
			index_two = data.id + 1;
			index_three = data.id + 2;
			this.tier_one.completed_img.visible = true;
		} else if (data.id % 3 == 2) {
			index_one = data.id - 1;
			index_two = data.id;
			index_three = data.id + 1;
			this.tier_one.completed_img.visible = true;
			this.tier_two.completed_img.visible = true;
		}
		this.tier_one.tier_lab.text = LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st100386, [index_one]);
		this.tier_two.tier_lab.text = LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st100386, [index_two]);
		this.tier_three.tier_lab.text = LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st100386, [index_three]);
		this.initBoss();
		this.setMovieClipData(this.boss_one, index_one, this.tier_one.m_ElementImg);
		this.setMovieClipData(this.boss_two, index_two, this.tier_two.m_ElementImg);
		this.setMovieClipData(this.boss_three, index_three, this.tier_three.m_ElementImg);

		//初始化奖励
		this.award.award_list.itemRenderer = ItemBase;//奖励预览
		let config;
		let tier: Number
		if (data.id == 99) {
			config = this.challengeRoadConfig[99]["award"];
			tier = data.id;
		} else {
			config = this.challengeRoadConfig[(data.id + 1)]["award"];
			tier = data.id + 1;
		}
		this.award.award_list.dataProvider = new eui.ArrayCollection(config);

		let currentTier: string = LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st100387, [tier]);
		this.award.tier_label.text = currentTier;

		for (let i = 0; i < this.box_len; ++i) {
			let btn = this.progress_bar.box_group.getChildAt(i) as eui.Button;
			let index: Number;
			if (data.id > 50) {
				index = this.challengeRoadAwardConfig[(i + 5 + 1)]["time"];
			} else {
				index = this.challengeRoadAwardConfig[(i + 1)]["time"];
			}
			btn["count"].text = index + GlobalConfig.jifengTiaoyueLg.st100383;
		}

	}
	private setMovieClipData(mc: MovieClip, id: Number, img: eui.Image): void {
		let config = this.challengeRoadConfig[id + ""];
		let monster = GlobalConfig.monstersConfig[config["monsterId"]];
		mc.loadUrl(ResDataPath.GetMonsterBodyPath(monster.avatar + "_3s"), true, -1)
		//mc.loadUrl(ResDataPath.GetUIEffePath("caiquan01"), true, -1)
		img.source = ResDataPath.GetElementImgName(monster.elementType);

	}
}

window["DrillPanel"] = DrillPanel