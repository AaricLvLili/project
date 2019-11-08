class TeamFbItem extends eui.ItemRenderer {
	public constructor() {
		super();
		this.skinName = "TeamFbItemSkin";
	}
	public m_AnimGroup: eui.Group;
	public m_Name: eui.Label;
	public m_Cont: eui.Label;
	public m_List: eui.List;
	public m_SelectImg: eui.Image;

	private m_Eff: MovieClip;
	private isCanClick: boolean = false;

	private dataList: eui.ArrayCollection;
	public createChildren() {
		super.createChildren();
		this.m_List.itemRenderer = ItemBase;
		this.dataList = new eui.ArrayCollection();
		this.m_List.dataProvider = this.dataList;
		this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClick, this);
	}
	public dataChanged() {
		super.dataChanged();
		let teamFbModel = TeamFbModel.getInstance;
		let key = this.data.key;
		let teamFbConfig = GlobalConfig.ins("teamFbConfig")[key];
		if (teamFbConfig) {
			let monstersConfig = GlobalConfig.ins("MonstersConfig")[teamFbConfig.bossid];
			if (monstersConfig) {
				this.playEff(monstersConfig.avatar + "_3" + EntityAction.STAND);
			}
			this.m_Name.text = teamFbConfig.fbName;
			let rolesModel = SubRoles.ins().rolesModel;
			let maxWingLv = 0;
			for (var i = 0; i < rolesModel.length; i++) {
				let role = rolesModel[i];
				let lv = role.wingsData.lv
				if (lv) {
					maxWingLv = Math.max(lv, maxWingLv);
				}
			}
			this.isCanClick = false;
			if (maxWingLv < (teamFbConfig.wingLevel - 1)) {
				this.m_Cont.text = LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st101972, [teamFbConfig.wingLevel]);
				this.m_Cont.textColor = 0xff1717;
			} else {
				if (teamFbConfig.zslevel) {
					let playerzs = UserZs.ins() ? UserZs.ins().lv : 0;
					if (playerzs < teamFbConfig.zslevel) {
						this.m_Cont.text = LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st101973, [teamFbConfig.zslevel]);
						this.m_Cont.textColor = 0xff1717;
					} else {
						if (teamFbModel.isShouTong(teamFbConfig.id)) {
							this.m_Cont.text = GlobalConfig.jifengTiaoyueLg.st101989;
						} else {
							this.m_Cont.text = GlobalConfig.jifengTiaoyueLg.st100399;
						}
						this.m_Cont.textColor = 0xF15901;
						this.isCanClick = true;
					}
				} else {
					if (GameLogic.ins().actorModel.level < teamFbConfig.level) {
						this.m_Cont.text = LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st101974, [teamFbConfig.level]);
						this.m_Cont.textColor = 0xff1717;
					} else {
						if (teamFbModel.isShouTong(teamFbConfig.id)) {
							this.m_Cont.text = GlobalConfig.jifengTiaoyueLg.st101989;
						} else {
							this.m_Cont.text = GlobalConfig.jifengTiaoyueLg.st100399;
						}
						this.m_Cont.textColor = 0xF15901;
						this.isCanClick = true;
					}
				}
			}
			let reAllData = [];
			if (teamFbModel.isShouTong(teamFbConfig.id)) {
				for (var i = 0; i < teamFbConfig.firstRewards.length; i++) {
					let redata = teamFbConfig.firstRewards[i]
					let re = { type: redata.type, id: redata.id, count: redata.count, isShowName: 2 };
					reAllData.push(re);
				}
			} else {
				for (var i = 0; i < teamFbConfig.normalRewards.length; i++) {
					let redata = teamFbConfig.normalRewards[i]
					let re = { type: redata.type, id: redata.id, count: redata.count, isShowName: 2 };
					reAllData.push(re);
				}
			}
			this.dataList.removeAll();
			this.dataList.replaceAll(reAllData);
			this.dataList.refresh();
		}
		if (teamFbModel.teamFbSelectId == parseInt(this.data.key)) {
			this.m_SelectImg.visible = true
		} else {
			this.m_SelectImg.visible = false;
		}
	}

	private playEff(name: string) {
		this.initEffData();
		this.m_Eff.loadUrl(ResDataPath.GetMonsterBodyPath(name), true, -1);
	}

	private initEffData() {
		if (!this.m_Eff) {
			this.m_Eff = new MovieClip();
			this.m_Eff.touchEnabled = false;
			this.m_AnimGroup.addChild(this.m_Eff);
			this.m_Eff.x = this.m_AnimGroup.width / 2;
			this.m_Eff.y = this.m_AnimGroup.height / 2;
		}
	}

	private onClick() {
		let teamFbModel = TeamFbModel.getInstance;
		if (this.isCanClick && !TeamFbModel.getInstance.isInRoom) {
			teamFbModel.teamFbSelectId = parseInt(this.data.key);
			MessageCenter.ins().dispatch(TeamFbEvt.TEAMFB_UPDATE_DATA);
			TeamFbSproto.ins().sendGetTeamMsg(teamFbModel.teamFbSelectId);
		} else if (!this.isCanClick) {
			UserTips.ins().showTips(this.m_Cont.text);
		} else {
			UserTips.ins().showTips(GlobalConfig.jifengTiaoyueLg.st102005);
		}
	}
	public release() {
		if (this.m_Eff) {
			DisplayUtils.dispose(this.m_Eff)
			this.m_Eff = null;
		}
	}




}
window["TeamFbItem"] = TeamFbItem