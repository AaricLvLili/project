class StrongItem extends eui.ItemRenderer {
	public constructor() {
		super();
	}
	public m_MainBtn: eui.Button;
	public m_Icon: eui.Image;
	public m_Lan1: eui.Label;
	public m_Cont: eui.Label;
	public m_StarGroup: eui.Group;

	protected createChildren() {
		super.createChildren();
		this.m_MainBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClick, this);

	}


	protected dataChanged() {
		super.dataChanged();
		let config = this.data;
		this.m_Icon.source = config.icon + "_png";
		for (var i = 0; i < this.m_StarGroup.numChildren; i++) {
			let child = this.m_StarGroup.getChildAt(i);
			if (child && child instanceof eui.Image) {
				child.visible = false;
				if (i < config.start) {
					child.visible = true;
				}
			}
		}
		this.m_Cont.text = config.des;
		this.m_MainBtn.label = config.btnname;
	}

	private onClick() {
		let config = this.data;
		if (Deblocking.Check(config.openid)) {
			ViewManager.Guide(config.taget[0], config.taget[1]);
			ViewManager.ins().close(StrongWin);
		}
	}
}
window["StrongItem"]=StrongItem