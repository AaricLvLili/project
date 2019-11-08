class JingMaiPanel extends BaseView implements ICommonWindowTitle, ICommonWindowRoleSelect {

	shape = new egret.Shape
	shape2 = new egret.Shape
	shape3 = new egret.Shape

	itemList: eui.Image[] = []
	// lightItems = []
	isUpgrade = false
	oldIndexTemp = -1
	_startX = 0
	_startY = 0
	_lineX = 0
	_lineY = 0
	danItemID
	// cursor: MovieClip
	successEff: MovieClip
	// totalPower
	group: eui.Group
	isChangeTab
	_data

	boostBtn: eui.Button;
	upgradeBtn: eui.Button;
	bigUpLevelBtn
	private getItem2: eui.Image;
	isOtherPlayer: boolean = false;
	stages
	private attrLabel: AttrLabel
	private powerLabel: PowerLabel
	private consumeLabel: ConsumeLabel
	windowTitleIconName: string;
	/** 球特效*/
	private barList: Array<MovieClip>;
	/** 球升级特效*/
	private barUpMc: MovieClip;
	/** 记录当前等级*/
	private currLv: number = -1;

	public constructor() {
		super()
		this.skinName = "JinMaiSkin";
	}
	private jingMaiCommonConfig: any;
	protected childrenCreated(): void {

		super.childrenCreated()

		this.consumeLabel.consumeType = GlobalConfig.jifengTiaoyueLg.st100298;//"元神丹"
		if (this.jingMaiCommonConfig == null) {
			this.jingMaiCommonConfig = GlobalConfig.ins("JingMaiCommonConfig");
		}
		this.danItemID = this.jingMaiCommonConfig.levelItemid

		this.group.addChildAt(this.shape3, 0)
		this.group.addChild(this.shape)
		this.group.addChild(this.shape2)
		for (var t = 0; 8 > t; t++) {
			this.itemList.push(this["point" + t])
		}
		this.shape.blendMode = egret.BlendMode.ADD

		this.barList = [];
		this.boostBtn.label = GlobalConfig.jifengTiaoyueLg.st100596;
		this.upgradeBtn.label = GlobalConfig.jifengTiaoyueLg.st100214;
	};
	open() {
		this.addTouchEvent(this, this.onTap, this.boostBtn)
		this.addTouchEvent(this, this.onTap, this.getItem2)
		this.addTouchEvent(this, this.onTap, this.upgradeBtn)
		this.addTouchEvent(this, this.onTap, this.bigUpLevelBtn)
		this.observe(UserJingMai.ins().postUpdate, this.setForgeData)
		this.observe(UserBag.postItemAdd, this.setForgeData)
		this.observe(UserBag.postItemChange, this.setForgeData);
		egret.setTimeout(() => {
			this.setForgeData(null);
		}, this, 20);
		this.isUpgrade = false
		this.isChangeTab = true
	};
	close() {
		this.removeObserve()
		this.removeEvents();
		egret.Tween.removeTweens(this.shape)
		egret.Tween.removeTweens(this.shape2)
		this._destory()
		DisplayUtils.dispose(this.successEff);
		this.successEff = null;
	};
	private _destory(): void {
		for (let i = 0, len = this.barList.length; i < len; i++) {
			let item = this.barList[i]
			DisplayUtils.removeFromParent(item)
			DisplayUtils.dispose(item)
		}
		this.barList = []

		DisplayUtils.dispose(this.barUpMc);
		this.barUpMc = null;
	}

	onTap(e) {
		switch (e.currentTarget) {
			case this.boostBtn:
				var i = GlobalConfig.jingMaiLevelConfig[this._data.level];
				UserBag.ins().getBagGoodsCountById(0, i.itemId) >= i.count ? UserJingMai.ins().sendBoost(this.curRole) : UserWarn.ins().setBuyGoodsWarn(i.itemId);
				break;
			case this.upgradeBtn:
				this.isUpgrade = !0,
					UserJingMai.ins().sendUpgrade(this.curRole);
				break;
			case this.bigUpLevelBtn:

				if (this.jingMaiCommonConfig == null) {
					this.jingMaiCommonConfig = GlobalConfig.ins("JingMaiCommonConfig");
				}
				var s = GlobalConfig.itemConfig[this.danItemID].name;
				WarnWin.show(LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st100595,
					[s, this.jingMaiCommonConfig.levelItemidStage, this.jingMaiCommonConfig.levelItemChange])
					+ GlobalConfig.itemConfig[this.jingMaiCommonConfig.itemid].name,
					() => {
						UserJingMai.ins().sendBigUpLevel(this.curRole)
					},
					this);
				break;
			case this.getItem2:
				var i = GlobalConfig.jingMaiLevelConfig[this._data.level];
				UserWarn.ins().setBuyGoodsWarn(i.itemId)
			//console.log(i.itemId);

		}
	};
	setForgeData(t) {
		if (this.isOtherPlayer) {
			this._data = t
		}

		this.stages.text = "" + (this._data.stage + 1) + " " + GlobalConfig.jifengTiaoyueLg.st100103;

		var stagesConfig = GlobalConfig.ins("JingMaiStageConfig")[this._data.stage]
		var lvConfig = GlobalConfig.jingMaiLevelConfig[this._data.level]
		// this.attr.text = AttributeData.getAttStr(AttributeData.AttrAddition(stagesConfig.attr, lvConfig.attr), 1)
		this.attrLabel.SetCurAttr(AttributeData.getAttStr(AttributeData.AttrAddition(stagesConfig.attr, lvConfig.attr), 1))
		// this._totalPower = UserBag.getAttrPower(AttributeData.AttrAddition(stagesConfig.attr, lvConfig.attr))
		// BitmapNumber.ins().changeNum(this.totalPower, this._totalPower, "1")
		this.powerLabel.text = UserBag.getAttrPower(AttributeData.AttrAddition(stagesConfig.attr, lvConfig.attr))
		var flag = this._data.level / 8 - stagesConfig.stage

		let showCount = this._data.level % 8
		if (flag == 1) {
			showCount = 8
		}
		if (this.currLv == -1)
			this.currLv = showCount;

		for (let i = 0; i < 8; ++i) {
			// this.itemList[i].visible = i < showCount
			this.itemList[i].alpha = i < showCount ? 1 : .3

			if (this.barList[i] == null) {
				this.barList[i] = new MovieClip;
				this.barList[i].loadUrl(ResDataPath.GetUIEffePath("eff_soul_success"), true, -1);
				// this.itemList[i].parent.addChild(this.barList[i]);
				this.barList[i].x = this["m_G" + i].width / 2;
				this.barList[i].y = this["m_G" + i].height / 2;
				this["m_G" + i].addChild(this.barList[i]);

			}
			if (this.currLv - 1 != showCount - 1 && showCount - 1 == i) {//播放升级
				if (this.barUpMc == null) {
					this.barUpMc = new MovieClip();
					this.barUpMc.loadUrl(ResDataPath.GetUIEffePath("eff_soul"), true, 1, () => {
						// DisplayUtils.dispose(this.barUpMc);
						// this.barUpMc = null;
					});
					this.group.addChild(this.barUpMc);
				} else {
					this.barUpMc.gotoAndPlay(0, 1)
				}

				this.barUpMc.x = this.itemList[i].x + (this.itemList[i].width >> 1);
				this.barUpMc.y = this.itemList[i].y + (this.itemList[i].height >> 1);

			}
			if (i < showCount) {
				this.barList[i].gotoAndPlay(0, -1);
				this.barList[i].visible = true
				this["m_G" + i].visible = true;
			}
			else {
				this.barList[i].stop();
				this.barList[i].visible = false;
				this["m_G" + i].visible = false;
			}
		}
		this.currLv = showCount;
		if (this.jingMaiCommonConfig == null) {
			this.jingMaiCommonConfig = GlobalConfig.ins("JingMaiCommonConfig");
		}

		if (stagesConfig.stage < this.jingMaiCommonConfig.stageMax) {
			var nextStagesConfig = void 0
			var nextLvConfig = void 0;

			if (this._data.level > 0 && this._data.level % 8 == 0 && flag) {
				nextStagesConfig = GlobalConfig.ins("JingMaiStageConfig")[this._data.stage + 1]
				nextLvConfig = lvConfig
			} else {
				nextStagesConfig = stagesConfig
				nextLvConfig = GlobalConfig.jingMaiLevelConfig[this._data.level + 1]
			}
			// if (false == this.nextAttr.visible) {
			// 	this.nextAttr.visible = true
			// }
			// this.nextAttr.text = AttributeData.getAttStr(AttributeData.AttrAddition(nextStagesConfig.attr, nextLvConfig.attr), 1)
			this.attrLabel.SetNextAttr(AttributeData.getAttStr(AttributeData.AttrAddition(nextStagesConfig.attr, nextLvConfig.attr), 1))
			this.drawLight(this._data.level % 8), this._data.level > 0

			if (this._data.level > 0 && this._data.level % 8 == 0 && flag) {
				this.boostBtn.visible = false
				this.upgradeBtn.visible = true
				this.oldIndexTemp = -1
				this.consumeLabel.ShowMaxTip(GlobalConfig.jifengTiaoyueLg.st100299)
				// this.countLabel.text = "元神等级已满,可进阶"
				// this.cursor.visible = false
				// for (var r = 0; 8 > r; r++) {
				// 	var o = this.lightItems[r];
				// 	o && (o.visible = !1)
				// }
			} else {
				this.boostBtn.visible = true
				this.upgradeBtn.visible = false
				var h = UserBag.ins().getBagGoodsCountById(0, lvConfig.itemId)
				var l = "";
				l = h >= lvConfig.count ? "|C:0x00ff00&" : "|C:0xf87372&"
				// this.countLabel.textFlow = TextFlowMaker.generateTextFlow("消耗元神丹:" + l + h + "|/" + lvConfig.count)
				if (h < lvConfig.count) {
					this.m_RoleSelectPanel.clearRedPoint()
				}


				this.consumeLabel.curValue = h
				this.consumeLabel.consumeValue = lvConfig.count
			}
			if (this.isUpgrade) {
				this.isUpgrade = false
				if (!this.successEff) {
					this.successEff = new MovieClip();
					this.successEff.x = 240
					this.successEff.y = 200
					this.addChild(this.successEff)
				}
				this.successEff.visible = true;
				this.successEff.loadUrl(ResDataPath.GetUIEffePath("eff_success"), true, 1, () => {
					if (this.successEff)
						this.successEff.visible = false;
				})

			}
		} else {
			// this.nextAttr.text = "元神已满阶"
			this.boostBtn.visible = false
			this.upgradeBtn.visible = false
			// this.cursor.parent && this.removeChild(this.cursor)
			// this.countLabel.text = ""
			this.consumeLabel.ShowMaxTip("")
			flag = 1
		}
		var u = UserBag.ins().getBagGoodsCountById(0, this.danItemID)
		if (this.bigUpLevelBtn.redPoint) {
			this.bigUpLevelBtn.redPoint.visible = u ? true : false
			if (this.bigUpLevelBtn.txt) {
				this.bigUpLevelBtn.txt.text = u
			}
		}
	};

	drawLight(t) {

	}

	showSelect(selectIndex: number): void {

	}

	get lineX() {
		return this._lineX
	}
	set lineX(t) {
		this._lineX = t
	}
	get lineY() {
		return this._lineY
	}
	set lineY(t) {
		this._lineY = t
		DisplayUtils.drawLine(this.shape, this._startX, this._startY, this._lineX, this._lineY, 3, 195576)
	}

	public UpdateContent(): void {
		// this.cursor.loadFile(RES_DIR_EFF + "jingmaiCursor", !0, -1)
		var i = SubRoles.ins().getSubRoleByIndex(this.curRole)
		this._data = i.jingMaiData
		this.setForgeData(this._data)
		let isReds = UserJingMai.ins().canGradeupJingMai()
		for (let i = 0; i < isReds.length; ++i) {
			this.m_RoleSelectPanel.showRedPoint(i, isReds[i])
		}

		// this.tweenLine()
	}

	m_RoleSelectPanel: RoleSelectPanel

	public get curRole(): number {
		return this.m_RoleSelectPanel.getCurRole()
	}



}
window["JingMaiPanel"] = JingMaiPanel