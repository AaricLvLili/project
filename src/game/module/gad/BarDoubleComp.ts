class BarDoubleComp extends eui.ProgressBar {
	public constructor() {
		super();
	}
	public thumb0: eui.Image;
	public m_ExpBar: eui.ProgressBar;
	public thumb: eui.Image;
	public labelDisplay: eui.Label;

	public setLelDisp() {
		this.labelDisplay.text = this.m_ExpBar.labelDisplay.text;
	}

	public childrenCreated() {
		super.childrenCreated();
		this.m_ExpBar.labelDisplay.visible = false;
		this.m_ExpBar.labelDisplay.addEventListener(egret.Event.CHANGE, this.setLelDisp, this);
	}

}
window["BarDoubleComp"]=BarDoubleComp