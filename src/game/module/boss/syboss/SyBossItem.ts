class SyBossItem extends eui.ItemRenderer {
	public constructor() {
		super();
	}

	public m_BossHead: eui.Image;
	public m_BossName: eui.Label;
	public m_BossLv: eui.Label;
	public m_Time: eui.Label;
	public m_KillImg: eui.Image;
	public m_selectImg: eui.Image;
	public m_RedPoint: eui.Image;
	public m_ElementImg: eui.Image;

	private isCanFlage: boolean = false;
	public createChildren() {
		super.createChildren();
		this.addEvent();
		this.m_Time.visible = true;
	}

	private addEvent() {
		this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClick, this);
	}

	public release() {
		this.removeTick();
	}


	public dataChanged() {
		super.dataChanged();
		let syBossModel = SyBossModel.getInstance;
		this.m_selectImg.visible = false;
		let groupId: number = this.data;
		let paidBossConfig = GlobalConfig.ins("PaidBossConfig")[groupId][0];
		if (paidBossConfig) {
			let monstersConfig = GlobalConfig.ins("MonstersConfig")[paidBossConfig.bossId];
			this.m_BossHead.source = ResDataPath.getBossHeadImage(monstersConfig.head);//monstersConfig.head + "_png";
			this.m_BossName.text = monstersConfig.name;
			this.m_ElementImg.source = ResDataPath.GetElementImgName(monstersConfig.elementType);
			// this.m_BossLv.text = "等级：" + monstersConfig.level;
		}
		if (syBossModel.selectBossIndex == this.itemIndex) {
			this.m_selectImg.visible = true;
		}
		if (paidBossConfig.zsLevel > 0) {
			this.m_BossLv.text = GlobalConfig.jifengTiaoyueLg.st100536 + paidBossConfig.zsLevel;
			let playerzs = UserZs.ins() ? UserZs.ins().lv : 0;
			if (playerzs >= paidBossConfig.zsLevel) {
				this.m_BossLv.textColor = Color.FontColor;
				this.m_Time.textColor = Color.Green;
				this.isCanFlage = true;
			} else {
				this.m_BossLv.textColor = Color.Red;
				this.m_Time.textColor = Color.Red;
				this.isCanFlage = false;
				this.m_Time.text = GlobalConfig.jifengTiaoyueLg.st100219;
			}
		} else {
			this.m_BossLv.text = "Lv." + paidBossConfig.level;
			let playerlv = GameLogic.ins().actorModel.level;
			if (playerlv >= paidBossConfig.level) {
				this.m_BossLv.textColor = Color.FontColor;
				this.m_Time.textColor = Color.Green;
				this.isCanFlage = true;
			} else {
				this.m_BossLv.textColor = Color.Red;
				this.m_Time.textColor = Color.Red;
				this.isCanFlage = false;
				this.m_Time.text = GlobalConfig.jifengTiaoyueLg.st100219;
			}
		}
		let syBossData = syBossModel.syBossDic.get(groupId);
		if (syBossData) {
			if (syBossData.isBossDead) {
				this.m_KillImg.visible = true;
			} else {
				this.m_KillImg.visible = false;
			}
			this.addTick();
		}
		let isShow = syBossModel.checkRedPoint(groupId);
		if (isShow) {
			this.m_RedPoint.visible = true;
		} else {
			this.m_RedPoint.visible = false;
		}
	}

	public addTick() {
		this.playTime();
	}

	private removeTick() {
		let syBossModel = SyBossModel.getInstance;
		let groupId: number = this.data;
		let syBossData = syBossModel.syBossDic.get(groupId);
		if (syBossData.isBossDead) {
			this.m_KillImg.visible = true;
		} else {
			this.m_KillImg.visible = false;
		}
	}

	private playTime() {
		if (!this.isCanFlage) {
			return;
		}
		let syBossModel = SyBossModel.getInstance;
		let groupId: number = this.data;
		let syBossData = syBossModel.syBossDic.get(groupId);
		if (!syBossData) {
			return;
		}
		if (syBossData.isBossDead) {
			this.m_KillImg.visible = true;
			this.m_Time.textColor = Color.Red;
			this.m_Time.text = GameServer.GetSurplusTime(syBossData.reliveTime, DateUtils.TIME_FORMAT_1) + GlobalConfig.jifengTiaoyueLg.st102002;
			let time = Math.max(0, (syBossData.reliveTime || 0) - GameServer.serverTime)
			this.m_Time.visible = true;
			if (time <= 0) {
				if (syBossModel.isSendGetData) {
					syBossModel.isSendGetData = false;
					SyBossSproto.ins().sendGetSyBossInitMsg();
				}
				this.m_Time.visible = false;
				this.removeTick();
			}
		} else {
			this.m_KillImg.visible = false;
			this.m_Time.textColor = Color.Green;
			this.m_Time.text = GameServer.GetSurplusTime(syBossData.runTime, DateUtils.TIME_FORMAT_1) + GlobalConfig.jifengTiaoyueLg.st102003;
			let time = Math.max(0, (syBossData.runTime || 0) - GameServer.serverTime)
			this.m_Time.visible = true;
			if (time <= 0) {
				if (syBossModel.isSendGetData) {
					syBossModel.isSendGetData = false;
					SyBossSproto.ins().sendGetSyBossInitMsg();
				}
				this.m_Time.visible = false;
				this.removeTick();
			}
		}
	}

	private onClick() {
		SyBossModel.getInstance.selectBossIndex = this.itemIndex;
		GameGlobal.MessageCenter.dispatch(SyBossEvt.SYBOSS_DATAUPDATE_MSG);
	}

}
window["SyBossItem"] = SyBossItem