class TeamPlayerState extends eui.ItemRenderer {
	public constructor() {
		super();
		this.skinName = "TeamPlayerStateSkin";
	}
	public m_Name: eui.Label;
	public m_Lv: eui.Label;
	public m_Power: eui.Label;
	public m_Head: eui.Image;
	public m_LadderImg: eui.Image;
	public m_TBtn: eui.Image;


	public createChildren() {
		super.createChildren();
		this.m_TBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClickTBtn, this)
	}
	public dataChanged() {
		super.dataChanged();
		let data: TeamPlayerData = this.data;
		this.m_Name.text = data.name;
		this.m_Lv.text = data.zslv + GlobalConfig.jifengTiaoyueLg.st100067 + data.lv + GlobalConfig.jifengTiaoyueLg.st100093
		this.m_Head.source = ResDataPath.GetHeadMiniImgName2(data.job, data.sex);
		this.m_LadderImg.visible = data.isLadder;
		this.m_Power.text = GlobalConfig.jifengTiaoyueLg.st101117 + data.power
		if (TeamFbModel.getInstance.isMyLadder && !data.isLadder) {
			this.m_TBtn.visible = true;
		} else {
			this.m_TBtn.visible = false;
		}
	}

	private onClickTBtn() {
		let data: TeamPlayerData = this.data;
		TeamFbSproto.ins().sendTRole(data.dbid);
	}
}

window["TeamPlayerState"] = TeamPlayerState