class TeamFbPanel extends BaseView implements ICommonWindowTitle {
	windowTitleIconName?: string;
	mWindowHelpId = 35;
	public constructor(data?: any) {
		super();
		this.name = GlobalConfig.jifengTiaoyueLg.st101969;
		this.windowTitleIconName = GlobalConfig.jifengTiaoyueLg.st101969;
		this.skinName = "TeamFbPanelSkin";
		this.touchEnabled = false;
	}
	public m_Scroller: eui.Scroller;
	public m_FbList: eui.List;
	public m_RightBtn: eui.Button;
	public m_LeftBtn: eui.Button;
	public m_AwardList: eui.List;
	public m_Lan2: eui.Label;
	public m_Lan1: eui.Label;
	public m_FbName: eui.Label;
	public m_NoTeamLab: eui.Label;
	public m_PlayerScroller: eui.Scroller;
	public m_PlayerList: eui.List;
	public m_InRoomPlayerScroller: eui.Scroller;
	public m_InRoomPlayerList: eui.List;
	public m_OpenTog: eui.ToggleButton;
	public m_GoTog1: eui.ToggleButton;
	public m_GoTog2: eui.ToggleButton;
	public m_MainBtn: eui.Button;
	public m_MainBtn2: eui.Button;
	public m_HaveLab: eui.Label;

	private fbData: eui.ArrayCollection;

	private awardData: eui.ArrayCollection;
	private ladderData: eui.ArrayCollection;

	private inRoomPlayerData: eui.ArrayCollection;

	private autoQuickTIme: number = 0;
	private autoFightTime: number = 0;
	private autoStartTime: number = 0;

	private isInRoomOld: boolean = false;


	private resTime = 60;
	private initTime = 15;
	private initPoint = 0;
	protected childrenCreated() {
		super.childrenCreated();
		this.m_Lan2.text = GlobalConfig.jifengTiaoyueLg.st101968;

		this.m_FbList.itemRenderer = TeamFbItem;
		this.fbData = new eui.ArrayCollection();
		this.m_FbList.dataProvider = this.fbData;

		this.m_AwardList.itemRenderer = ItemBase;
		this.awardData = new eui.ArrayCollection();
		this.m_AwardList.dataProvider = this.awardData;

		this.m_PlayerList.itemRenderer = TeamPlayerItem;
		this.ladderData = new eui.ArrayCollection();
		this.m_PlayerList.dataProvider = this.ladderData;

		this.m_InRoomPlayerList.itemRenderer = TeamPlayerState;
		this.inRoomPlayerData = new eui.ArrayCollection();
		this.m_InRoomPlayerList.dataProvider = this.inRoomPlayerData;


		this.m_Lan1.text = GlobalConfig.jifengTiaoyueLg.st101976;
		this.m_NoTeamLab.text = GlobalConfig.jifengTiaoyueLg.st101988;
	};
	private addViewEvent() {
		this.AddClick(this.m_OpenTog, this.onClickTog);
		this.AddClick(this.m_GoTog1, this.onClickTog);
		this.AddClick(this.m_GoTog2, this.onClickTog);
		this.AddClick(this.m_MainBtn, this.onClickMain);
		this.AddClick(this.m_MainBtn2, this.onClickMain);
		this.AddClick(this.m_RightBtn, this.onClickAttrBtn);
		this.AddClick(this.m_LeftBtn, this.onClickAttrBtn);
		this.observe(TeamFbEvt.TEAMFB_UPDATE_DATA, this.initData);
	}
	private removeEvent() {
	}

	public open() {
		if (!TeamFbModel.getInstance.isInRoom) {
			this.setOpenIndex();
		}
		this.resTime = this.initTime;
		let teamFbBaseConfig = GlobalConfig.ins("teamFbBaseConfig");
		this.autoQuickTIme = teamFbBaseConfig.autoQuickTIme;
		this.autoFightTime = teamFbBaseConfig.autoFightTime;
		this.autoStartTime = teamFbBaseConfig.autoStartTime;
		this.addViewEvent();
		this.addTime();
		this.initData();
		TeamFbSproto.ins().sendGetTeamMsg(TeamFbModel.getInstance.teamFbSelectId);
	};
	public close() {
		this.removeEvent();
		let numChild = this.m_FbList.numChildren;
		for (var i = 0; i < numChild; i++) {
			let child = this.m_FbList.getChildAt(i);
			if (child && child instanceof TeamFbItem) {
				child.release();
			}
		}
		this.removeTime();
	};

	public release() {
		this.removeEvent();
	}

	public addTime() {
		this.removeTime();
		TimerManager.ins().doTimer(1000, 0, this.runTime, this);
	}

	public removeTime() {
		TimerManager.ins().remove(this.runTime, this);
	}

	private runTime() {
		let teamFbBaseConfig = GlobalConfig.ins("teamFbBaseConfig");
		let teamFbModel = TeamFbModel.getInstance;
		if (!teamFbModel.isInRoom) {
			if (this.m_GoTog1.selected) {
				this.autoQuickTIme -= 1;
				if (this.autoQuickTIme < 0) {
					this.autoQuickTIme = teamFbBaseConfig.autoQuickTIme;
					// let teamLadderData = teamFbModel.teamLadderDic.values[0];
					// if (teamLadderData) {
					// 	TeamFbSproto.ins().sendCreateTeam(teamFbModel.teamFbSelectId, teamLadderData.roomId);
					// } else {
					TeamFbSproto.ins().sendCreateTeam(teamFbModel.teamFbSelectId, -1);
					// }
				}
				this.m_GoTog1.label = LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st101977, [this.autoQuickTIme]);
			}
			this.resTime--;
			if (this.resTime <= 0) {
				this.resTime = this.initTime;
				TeamFbSproto.ins().sendGetTeamMsg(TeamFbModel.getInstance.teamFbSelectId);
			}
		} else {
			if (teamFbModel.isMyLadder) {
				if (teamFbModel.isMyRoomFull) {
					if (this.m_OpenTog.selected) {
						this.autoStartTime -= 1;
						if (this.autoStartTime < 0) {
							this.autoStartTime = teamFbBaseConfig.autoStartTime;
							TeamFbSproto.ins().sendFight();
						}
						this.m_OpenTog.label = LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st101978, [this.autoStartTime]);
					} else {
						this.m_OpenTog.label = GlobalConfig.jifengTiaoyueLg.st101970;
					}
				} else {
					if (this.m_GoTog2.selected) {
						this.autoFightTime -= 1;
						if (this.autoFightTime < 0) {
							this.autoFightTime = teamFbBaseConfig.autoFightTime;
							TeamFbSproto.ins().sendFight();
						}
						this.m_GoTog2.label = LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st101979, [this.autoFightTime]);
					} else {
						this.m_GoTog2.label = LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st101979, [this.autoFightTime]);
					}
					this.m_OpenTog.label = GlobalConfig.jifengTiaoyueLg.st101970;
				}
			}
		}
	}

	private initData() {
		let teamFbBaseConfig = GlobalConfig.ins("teamFbBaseConfig");
		let teamFbModel = TeamFbModel.getInstance;
		this.m_PlayerScroller.visible = false;
		this.m_InRoomPlayerScroller.visible = false;
		this.m_NoTeamLab.visible = false;
		this.m_GoTog1.visible = false;
		this.m_GoTog2.visible = false;
		this.m_OpenTog.visible = false;
		this.m_MainBtn2.visible = true;
		this.setFBData();
		if (!teamFbModel.isInRoom) {
			let teamLadder: TeamLadderData[] = teamFbModel.teamLadderDic.values;
			this.m_GoTog1.visible = true;
			if (teamLadder.length > 0) {
				this.ladderData.removeAll();
				this.ladderData.replaceAll(teamLadder);
				this.m_PlayerScroller.visible = true;
			} else {
				this.m_NoTeamLab.visible = true;
			}
			if (this.isInRoomOld != teamFbModel.isInRoom) {
				this.autoFightTime = teamFbBaseConfig.autoFightTime;
				this.autoStartTime = teamFbBaseConfig.autoStartTime;
			}
			this.m_MainBtn.label = GlobalConfig.jifengTiaoyueLg.st101980;
			this.m_MainBtn2.label = GlobalConfig.jifengTiaoyueLg.st101981;
		} else {
			let playerData: TeamPlayerData[] = teamFbModel.teamPlayerDic.values;
			this.m_InRoomPlayerScroller.visible = true;
			this.inRoomPlayerData.removeAll();
			this.inRoomPlayerData.replaceAll(playerData);
			this.inRoomPlayerData.refresh();
			if (teamFbModel.isMyLadder) {
				this.m_GoTog2.visible = true;
				this.m_OpenTog.visible = true;
			} else {
				this.m_MainBtn2.visible = false;
			}
			if (this.isInRoomOld != teamFbModel.isInRoom) {
				this.autoQuickTIme = teamFbBaseConfig.autoQuickTIme;
			}
			this.m_MainBtn.label = GlobalConfig.jifengTiaoyueLg.st101982;
			this.m_MainBtn2.label = GlobalConfig.jifengTiaoyueLg.st101983;
		}
		let vipLv = UserVip.ins().lv;
		let maxNum = teamFbBaseConfig.rewardCount[vipLv]
		this.m_HaveLab.text = LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st101984, [teamFbModel.rewardCount, maxNum]);
		this.isInRoomOld = teamFbModel.isInRoom;
		this.resTime = this.initTime;
	}
	private setFBData() {
		let teamFbModel = TeamFbModel.getInstance;
		let config = GlobalConfig.ins("teamFbConfig");
		let guanQiaData = [];
		for (let key in config) {
			let data = { key: key, weight: 1 };
			// let fbid = parseInt(key);
			// let isFbOpen = teamFbModel.isFbOpen(fbid);
			// if (isFbOpen) {
			// 	data.weight = fbid + 1000;
			// } else {
			// 	data.weight = 100 - fbid;
			// }
			guanQiaData.push(data)
		}
		// guanQiaData.sort(this.sorData);/**不排序了 */
		this.fbData.replaceAll(guanQiaData);
		if (!teamFbModel.teamFbSelectId) {
			teamFbModel.teamFbSelectId = parseInt(this.fbData.source[0].key);
			this.fbData.refresh();
		}
		let teamFbConfig = config[teamFbModel.teamFbSelectId];
		let reAllData = [];
		for (var i = 0; i < teamFbConfig.luckRewards.length; i++) {
			let redata = teamFbConfig.luckRewards[i]
			let re = { type: redata.type, id: redata.id, count: redata.count, isShowName: 2 };
			reAllData.push(re);
		}
		this.awardData.removeAll();
		this.awardData.replaceAll(reAllData);
		this.awardData.refresh();
		this.m_FbName.text = teamFbConfig.fbName;
	}

	private onClickTog(e: egret.TouchEvent) {
		let teamFbBaseConfig = GlobalConfig.ins("teamFbBaseConfig");
		switch (e.currentTarget) {
			case this.m_OpenTog:
				if (this.m_OpenTog.selected) {
					this.autoStartTime = teamFbBaseConfig.autoStartTime;
				}
				break;
			case this.m_GoTog1:
				if (this.m_GoTog1.selected) {
					this.autoQuickTIme = teamFbBaseConfig.autoQuickTIme;
				}
				break;
			case this.m_GoTog2:
				if (this.autoFightTime) {
					this.autoFightTime = teamFbBaseConfig.autoFightTime;
				}
				break;
		}
	}

	private onClickMain(e: egret.TouchEvent) {
		let teamFbModel = TeamFbModel.getInstance
		switch (e.currentTarget) {
			case this.m_MainBtn:
				if (!teamFbModel.isInRoom) {
					TeamFbSproto.ins().sendCreateTeam(teamFbModel.teamFbSelectId, 0);
				} else {
					TeamFbSproto.ins().sendQuitTeam();
				}
				break;
			case this.m_MainBtn2:
				if (!teamFbModel.isInRoom) {
					// let teamLadderData = teamFbModel.teamLadderDic.values[0];
					// if (teamLadderData) {
					// 	TeamFbSproto.ins().sendCreateTeam(teamFbModel.teamFbSelectId, teamLadderData.roomId);
					// } else {
					// 	TeamFbSproto.ins().sendCreateTeam(teamFbModel.teamFbSelectId, 0);
					// }
					TeamFbSproto.ins().sendCreateTeam(teamFbModel.teamFbSelectId, -1);

				} else {
					TeamFbSproto.ins().sendFight();
				}
				break;
		}
	}
	/**关联排序 */
	private sorData(item1: { weight: number }, item2: { weight: number }): number {
		return item2.weight - item1.weight;
	}
	UpdateContent(): void {

	}
	private setOpenIndex() {
		let teamFbModel = TeamFbModel.getInstance;
		let config = GlobalConfig.ins("teamFbConfig");
		let guanQiaData = [];
		let weight = 0;
		let teamFbSelectId = 0;
		for (let key in config) {
			let data = { key: key, weight: 1 };
			let fbid = parseInt(key);
			let isShouTong = teamFbModel.isShouTong(fbid);
			let isFbOpen = teamFbModel.isFbOpen(fbid);
			if (isShouTong && isFbOpen) {
				data.weight = (100 - fbid) + 10000;
			} else if (isFbOpen) {
				data.weight = fbid + 1000;
			} else {
				data.weight = 100 - fbid;
			}
			if (data.weight > weight) {
				weight = data.weight;
				teamFbSelectId = fbid;
			}
			guanQiaData.push(data);
		}
		teamFbModel.teamFbSelectId = teamFbSelectId;
		let maxNum = guanQiaData.length;
		let maxWidth = (maxNum - 3) * this.changeNum - 6;
		if (teamFbModel.teamFbSelectId <= 2) {
			this.initPoint = 0;
		} else {
			let changeNum = (teamFbModel.teamFbSelectId - 2) * this.changeNum;
			if (changeNum > maxWidth) {
				changeNum = maxWidth;
			}
			this.initPoint = changeNum;
		}
		this.m_Scroller.stopAnimation();
		this.m_Scroller.viewport.scrollH = this.initPoint;
	}
	private changeNum = 136;
	private onClickAttrBtn(e: egret.TouchEvent) {
		this.m_Scroller.stopAnimation();
		switch (e.currentTarget) {
			case this.m_RightBtn:
				let maxNum = this.fbData.source.length;
				let maxWidth = (maxNum - 3) * this.changeNum - 6;
				let changeNum = this.m_Scroller.viewport.scrollH + (this.changeNum * 3);
				if (changeNum > maxWidth) {
					changeNum = maxWidth;
				}
				this.m_Scroller.viewport.scrollH = changeNum;
				break;
			case this.m_LeftBtn:
				let changeNum2 = this.m_Scroller.viewport.scrollH - (this.changeNum * 3);
				if (changeNum2 < 0) {
					changeNum2 = 0;
				}
				this.m_Scroller.viewport.scrollH = changeNum2;
				break;
		}
	}

}
window["TeamFbPanel"] = TeamFbPanel