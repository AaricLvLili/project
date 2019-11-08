class AcrossLadderPlayerItem extends eui.Component {
	public m_HeadImg: eui.Image;
	public m_TurnLvLab: eui.Label;
	public m_PlayerName: eui.Label;
	public m_PowerLab: eui.Label;
	public m_RankLab: eui.Label;
	public m_BattleBtn: eui.Button;

	private playerId: number;
	public m_ElementImg: eui.Image;
	public constructor() {
		super();
		this.skinName = "AcrossLadderPlayerItemSkin";
		this.m_BattleBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouch, this);
		this.m_BattleBtn.addEventListener(egret.Event.REMOVED, this.removeEvent, this);
	}

	private removeEvent() {
		this.m_BattleBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouch, this);
		this.m_BattleBtn.removeEventListener(egret.Event.REMOVED, this.removeEvent, this);
	}

	public release() {
		this.removeEvent();
	}


	public updateItem(data: AcrossLadderItemData) {
		this.playerId = data.playerId;
		this.m_RankLab.text = data.rank.toString();
		this.m_PowerLab.text = data.power.toString();
		this.m_PlayerName.text = data.playerName;
		this.m_TurnLvLab.text = LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st101443, [data.zsLv.toString(), data.lv.toString()]);
		this.m_HeadImg.source = ResDataPath.GetHeadMiniImgName(data.job, data.sex);
		this.m_ElementImg.source = ResDataPath.GetElementImgName(data.m_ElementType);
		// this.roleShowPanel.SetBody(data.clothesId, data.sex);
		// this.roleShowPanel.SetWeapon(data.weaponId);
		// if (data.wingOpenState)
		// 	this.roleShowPanel.SetWing(data.wingLevel);
	}

	private onTouch(e: egret.TouchEvent) {
		AcrossLadderPanelData.ins().setTargetPlayerId(this.playerId);
		ViewManager.ins().open(AcrossLadderChallengeTip);
	}
}
window["AcrossLadderPlayerItem"] = AcrossLadderPlayerItem