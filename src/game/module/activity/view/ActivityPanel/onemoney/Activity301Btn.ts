class Activity301Btn extends eui.ItemRenderer {
	public constructor() {
		super();
		this.skinName = "Activity301BtnSkin";
	}
	public m_MainBtn: eui.Button;

	public createChildren() {
		super.createChildren();
		this.m_MainBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClick, this);
	}
	dataChanged() {
		super.dataChanged();
		let data = this.data;
		this.m_MainBtn["labelDisplay"].text = data.tips1;
		this.m_MainBtn["labelDisplay0"].text = data.tips2;
		if (this.itemIndex == Activity301Panel.selectIndex) {
			this.m_MainBtn.enabled = false;
		} else {
			this.m_MainBtn.enabled = true;
		}
	}
	private onClick() {
		Activity301Panel.selectIndex = this.itemIndex;
		MessageCenter.ins().dispatch(MessageDef.UPDATE_ACTIVITY_PANEL);
	}
}
window["Activity301Btn"]=Activity301Btn