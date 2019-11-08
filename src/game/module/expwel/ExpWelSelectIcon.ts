class ExpWelSelectIcon extends eui.Component {
	public constructor() {
		super();
		this.skinName = "ExpWelSelectIconSkin";
	}
	public m_Cont: eui.Label;
	public m_SelectImg: eui.Image;
	public configData: any;
	public m_CompGroup: eui.Group;
	private m_bgImg: eui.Image


	public createChildren() {
		super.createChildren();
		this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClick, this);
	}

	public setData(configData: any) {
		this.m_CompGroup.visible = false;
		this.configData = configData;
		if (OnlineRewardsModel.ins().expSelectIndex == configData.ID) {
			this.m_SelectImg.visible = true;
		} else {
			this.m_SelectImg.visible = false;
		}
		let data = OnlineRewardsModel.ins().expDic.get(configData.ID);
		if (data.time == -1) {
			this.m_CompGroup.visible = true;
		} else {
			this.m_Cont.text = configData.multiple + GlobalConfig.jifengTiaoyueLg.st101265;
		}
		this.m_bgImg.source = `pf_yewai_0${configData.ID}_png`
	}

	private onClick() {
		if (this.configData && OnlineRewardsModel.ins().isHave == false) {
			OnlineRewardsModel.ins().expSelectIndex = this.configData.ID;
			GameGlobal.MessageCenter.dispatch(MessageDef.EXPWEL_INIT_MSG);
		}
	}
}
window["ExpWelSelectIcon"]=ExpWelSelectIcon