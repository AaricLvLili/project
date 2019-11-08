class RankingPanel extends BaseView implements ICommonWindowTitle {
	public constructor() {
		super()
		this.skinName = "RankingSkin";
	}

	private list: eui.List
	public m_RankScroller: eui.Scroller;
	tab: eui.TabBar
	detail
	firstItem

	scroller: eui.Scroller;
	rankType: number

	selfPos
	posImg

	praiseGroup

	titleImg
	eff

	praiseBtn: eui.Button
	praise: eui.Group
	pariseGold: eui.Label
	pariseExp: eui.Label
	worship_count: eui.Label;

	roleShowPanel: RoleShowPanel
	childrenCreated() {
		this.list.itemRenderer = RankItemRenderer
		this.tab.itemRenderer = RankTabItemRenderer
		let data1 = { name: GlobalConfig.jifengTiaoyueLg.st101351, type: "0", title: "", t10: "comp_83_48_01_png", power: GlobalConfig.jifengTiaoyueLg.st101360 + "：{value}" }
		let data2 = { name: GlobalConfig.jifengTiaoyueLg.st101352, type: "5", title: "", t10: "", skin: "RankItemLevelSkin" }
		let data3 = { name: GlobalConfig.jifengTiaoyueLg.st101353, type: "6", title: "", t10: "", power: GlobalConfig.jifengTiaoyueLg.st101361 + "：{value}" }
		let data4 = { name: GlobalConfig.jifengTiaoyueLg.st101354, type: "11", title: "", t10: "", skin: "RankItemLadderSkin", challgeLevel: "ladder_rank_{value}", winNum: "{value}" + GlobalConfig.jifengTiaoyueLg.st100812 }
		let data5 = { name: GlobalConfig.jifengTiaoyueLg.st101355, type: "7", title: "", t10: "", power: GlobalConfig.jifengTiaoyueLg.st101362 + "：{value}" }
		let data6 = { name: GlobalConfig.jifengTiaoyueLg.st101356, type: "8", title: "", t10: "", power: GlobalConfig.jifengTiaoyueLg.st101363 + "：{value}" }
		let data7 = { name: GlobalConfig.jifengTiaoyueLg.st101357, type: "9", title: "", t10: "", power: GlobalConfig.jifengTiaoyueLg.st101364 + "：{value}" }
		let data8 = { name: GlobalConfig.jifengTiaoyueLg.st101358, type: "2", title: "", t10: "comp_83_48_01_png", skin: "RankItemSkirmishSkin", count: GlobalConfig.jifengTiaoyueLg.st101365 + "：{value}" }
		let data9 = { name: GlobalConfig.jifengTiaoyueLg.st101359, type: "20", title: "", t10: "", power: GlobalConfig.jifengTiaoyueLg.st101246 + "：{value}" }
		let datas = [data1, data2, data3, data4, data5, data6, data7, data8, data9];
		this.tab.dataProvider = new eui.ArrayCollection(datas);
	}

	open(...param: any[]) {
		Rank.ins().sendGetPraiseData(0)
		this.addTouchEvent(this, this.onClick, this.detail)
		this.addTouchEvent(this, this.onClick, this.firstItem)
		// this.addTouchEvent(this, this.onClick, this.list)
		this.addItemTapEvent(this, this._ListTap, this.list)
		this.addTouchEvent(this, this.onClick, this.praiseBtn)
		this.addItemTapEvent(this, this.onTouchTab, this.tab)

		// var lastSelect = void 0 == param[0] ? 0 : param[0];
		var lastSelect = Rank.ins().mRankIndex;
		if (lastSelect == this.tab.dataProvider.length - 1 || lastSelect == this.tab.dataProvider.length - 2) {
			this.tab.validateNow()
			this.tab.scrollV = 125
		}
		if (lastSelect >= this.tab.dataProvider.length) {
			lastSelect = this.tab.dataProvider.length - 1
		}

		this.setOpenIndex(lastSelect)
		this.observe(Rank.postPraiseResult, this.updatePraiseBtn)
		// this.observe(Rank.ins().sendGetPraiseData,this.setMoBaiCishu)
		this.observe(Rank.postRankingData, this.updateList)
		this.observe(Rank.postPraiseData, this.updateShapes)
		// this.observe(UserReadPlayer.ins().postPlayerResult, this.openOtherPlayerView)
		this.observe(MessageDef.SHOW_RANK_OTHER_ACTOR, this.openOtherPlayerView)

		if (param && 7 == param[0]) {
			if (this.scroller && this.scroller.viewport && 58 == this.scroller.viewport.scrollV) {
				return;
			}
			egret.Tween.get(this.scroller.viewport).wait(300).to({ scrollV: 58 }, 400).call(() => {
				egret.Tween.removeTweens(this.scroller.viewport);
			});
		}

	}

	close() {
		// this.removeObserve()
		DisplayUtils.dispose(this.eff);
		this.eff = null;
	}

	public release() {
		this.close();
		this.roleShowPanel.release();
		this.m_RankScroller.stopAnimation();
		this.scroller.stopAnimation();
	}

	updateList(rankModel: RankModel) {
		if (rankModel.type != this.rankType)
			return;
		this.selfPos.text = 0 < rankModel.selfPos && rankModel.selfPos <= 1000 ? rankModel.selfPos + '' : GlobalConfig.jifengTiaoyueLg.st100086;
		var arr = rankModel.getDataList();
		this.firstItem.data = arr[0];
		this.list.dataProvider = new eui.ArrayCollection(arr.slice(1));
		this.posImg.visible = this.firstItem.data != null;
		var view = <RankingWin>ViewManager.ins().getView(RankingWin);
		if (view) {
			view.updateRedPoint()
		}
	}

	onTouchTab(t) {
		this.setOpenIndex(this.tab.selectedIndex)
	}

	updateShapes(rankType) {
		if (rankType == this.rankType) {
			this.setMoBaiCishu();
			var subRole = null
			var i = Rank.ins().getRankModel(rankType)
			// this.roleShowPanel.SetWeapon(null);
			// this.roleShowPanel.SetBody(null);
			// this.roleShowPanel.SetWing(null);
			if (i.praise.id > 0 && this.firstItem.data) {
				var jobType = 0;

				if (rankType == RankDataType.TYPE_JOB_ZS) {
					jobType = JobConst.ZhanShi
				} else if (rankType == RankDataType.TYPE_JOB_FS) {
					jobType = JobConst.FaShi
				} else if (rankType == RankDataType.TYPE_JOB_DS) {
					jobType = JobConst.DaoShi
				}
				subRole = i.praise.getRoleByJob(jobType)

				// this.roleShowPanel.Set(DressType.ARM, subRole);
				// this.roleShowPanel.Set(DressType.ROLE, subRole);
				// this.roleShowPanel.Set(DressType.WING, subRole);
				this.roleShowPanel.creatAnim(subRole);
			}
			this.praiseGroup.visible = null != subRole
		}
	}

	updatePraiseBtn() {
		let index = this.tab.selectedIndex
		// let rankType = this.tab.selectedItem.type;
		// if (null == Rank.ins().rankModel[rankType]) {
		// 	return void Rank.ins().sendGetPraiseData(0)
		// }
		// var praiseData: PraiseData = Rank.ins().rankModel[rankType].praise;
		// var count:number = praiseData.getLastMobaiNum();
		Rank.ins().sendGetPraiseData(this.rankType);
		if (Rank.ins().canPraiseByType(Rank.RANK_PANEL_TEYPS[index])) {
			this.praiseBtn.enabled = true
			this.praiseBtn.label = GlobalConfig.jifengTiaoyueLg.st100087;
		} else {
			this.praiseBtn.enabled = false
			this.praiseBtn.label = GlobalConfig.jifengTiaoyueLg.st100088
		}
	}
	setMoBaiCishu() {
		let data = Rank.ins().getRankModel(this.rankType);
		var praise: PraiseData = data.praise;
		this.worship_count.text = GlobalConfig.jifengTiaoyueLg.st100089 + (praise.praiseCount || 0);
	}
	setOpenIndex(t) {
		if (this.list.parent && (this.list.parent as eui.Scroller).stopAnimation) {
			(this.list.parent as eui.Scroller).stopAnimation()
		}
		this.list.scrollH = 0
		this.tab.selectedIndex = t;
		this.updatePraiseBtn()

		// var e = <RankingWin>ViewManager.ins().getView(RankingWin);
		// if (e) {
		// 	e.tabIndex = this.tab.selectedIndex
		// }
		var i = this.tab.selectedItem;
		this.rankType = i.type

		RankItemRenderer.dataFormat = i
		this.praiseGroup.visible = this.posImg.visible = !1
		this.selfPos.text = null
		this.list.dataProvider = null
		this.firstItem.data = null
		this.list.itemRendererSkinName = this.firstItem.skinName = i.skin || "RankItemPowerSkin";
		var titleConfig = null;
		if (this.rankType == RankDataType.TYPE_POWER) {
			titleConfig = Title.ins().getTitleByActivityId(3)
		} /*
		else if (this.rankType == RankDataType.TYPE_LADDER) {
			// titleConfig = Title.ins().getTitleByActivityId(24)
			titleConfig = Title.ins().getTitleByActivityId(5)
		} */
		else if (this.rankType == RankDataType.TYPE_SKIRMISH) {
			titleConfig = Title.ins().getTitleByActivityId(1)
		}
		Rank.ins().sendGetRankingData(this.rankType)

		this.titleImg.source = null
		if (this.eff) {
			this.eff.visible = false
		}
		if (titleConfig) {
			if (Title.IsEffName(titleConfig.img)) {
				this.eff = this.eff || new MovieClip
				if (null == this.eff.parent) {
					this.addChild(this.eff)
					this.eff.x = 235;
					this.eff.y = 50;
					this.eff.scaleX = .8
					this.eff.scaleY = .8
					this.eff.touchEnabled = false
				}
				this.eff.loadUrl(ResDataPath.GetUIEffePath(titleConfig.img), true, -1)
				this.addChild(this.eff)
			} else {
				this.titleImg.source = titleConfig.img;
			}




		}
		Rank.ins().sendGetPraiseData(this.rankType)


		let gold = null
		let exp = null
		let morshipConfig = GlobalConfig.ins("MorshipConfig")[this.rankType]
		if (morshipConfig) {
			let lv = GameGlobal.actorModel.level
			let zsLv = GameGlobal.zsModel.lv
			let config = null
			if (zsLv > 0) {
				config = morshipConfig[zsLv * 1000]
			} else {
				config = morshipConfig[lv]
			}
			if (config) {
				gold = config.awards[0].count
				exp = config.awards[1].count
			}
		}
		if (gold) {
			CommonUtils.labelIsOverLenght(this.pariseGold, gold)
			CommonUtils.labelIsOverLenght(this.pariseExp, exp)
			this.praise.visible = true
		} else {
			this.praise.visible = false
		}
	}

	_ListTap(e: eui.ItemTapEvent) {
		let child = this.list.getElementAt(e.itemIndex) as any
		if (!child) {
			return
		}
		let id = child.data[RankDataType.DATA_ID]
		let rolid = 0;
		UserReadPlayer.ins().LookPlayer(id, rolid)
		UserReadPlayer.ins().actorId = id
	}

	onClick(t) {
		switch (t.currentTarget) {
			case this.detail:
			case this.firstItem:
				this.firstItem.data && UserReadPlayer.ins().LookPlayer(this.firstItem.data[RankDataType.DATA_ID], 0);
				UserReadPlayer.ins().actorId = this.firstItem.data[RankDataType.DATA_ID]
				break;
			// case this.list:
			// break;
			case this.praiseBtn:
				Rank.ins().sendPraise(Rank.RANK_PANEL_TEYPS[this.tab.selectedIndex])
				break;
		}
	}
	openOtherPlayerView(t) {
		ViewManager.ins().open(TrRoleWin, t)
		// ViewManager.ins().open(RRoleWin, t)
	}

	static openCheck() {
		var lv = GameLogic.ins().actorModel.level;
		if (lv < 60) {
			UserTips.ins().showTips(GlobalConfig.jifengTiaoyueLg.st100090);
			return false;
		}
		return true;
	};

	static GetBodyResName(job: string, sex: number): string {
		return "" + RES_DIR_BODY + job + "_" + sex + "_c_png"
	}

	static GetBodyResNameByJob(job: number, sex: number): string {
		return RES_DIR_BODY + "body" + job + "00_" + sex + "_c_png";
	}

	static GetWeaponResName(job: string): string {
		return "" + RES_DIR_WEAPON + job + "_c_png"
	}

	static GetWeaponResNameByJob(job: number): string {
		return RES_DIR_WEAPON + "weapon" + job + "00_c_png"
	}

	static GetWingResName(configData): string {
		return RES_DIR_WING + configData + "_png"
	}

	windowTitleIconName?: string = GlobalConfig.jifengTiaoyueLg.st100091
	UpdateContent(): void {

	}
}
window["RankingPanel"] = RankingPanel