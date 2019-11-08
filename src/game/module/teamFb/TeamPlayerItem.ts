class TeamPlayerItem extends eui.ItemRenderer {
	public constructor() {
		super();
	}
	public m_MainBtn: eui.Button;
	public m_Name: eui.Label;
	public m_Room: eui.Label;
	public m_Head: eui.Image;
	public createChildren() {
		super.createChildren();
		this.m_MainBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClickMainBtn, this)
	}
	public dataChanged() {
		super.dataChanged();
		let data: TeamLadderData = this.data;
		this.m_Name.text = data.name;
		this.m_Room.text = GlobalConfig.jifengTiaoyueLg.st101971 + data.playerNum + "/3";
		this.m_Head.source = ResDataPath.GetHeadMiniImgName2(data.job, data.sex);
	}

	public onClickMainBtn() {
		let data: TeamLadderData = this.data;
		TeamFbSproto.ins().sendCreateTeam(TeamFbModel.getInstance.teamFbSelectId, data.roomId);
	}
}

window["TeamPlayerItem"] = TeamPlayerItem