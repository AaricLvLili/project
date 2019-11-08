class ChaosBattleAtkHead extends eui.ItemRenderer {
	public constructor() {
		super();
	}
	public m_Head: eui.Image;
	public m_Name: eui.Label;
	public m_Bar: eui.ProgressBar;
	private clickEffc: MovieClip;
	public m_AnimGroup: eui.Group;
	public m_AtkGroup: eui.Group;
	private m_AtkAnim: MovieClip;
	public createChildren() {
		super.createChildren();
		this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClick, this);
	}

	public dataChanged() {
		super.dataChanged();
		let data: ChaosBattleTagerData = this.data;
		this.m_Head.source = data.head;
		let name = data.name;
		this.m_Name.text = name;
		this.m_Bar.maximum = 100;
		this.m_Bar.value = data.preHp;
		if (this.m_AtkGroup && data.id == ChaosBattleModel.getInstance.atkTager) {
			if (!this.m_AtkAnim)
				this.m_AtkAnim = ViewManager.ins().createEff(this.m_AtkAnim, this.m_AtkGroup, "eff_attack", -1)
		} else {
			if (this.m_AtkAnim) {
				DisplayUtils.dispose(this.m_AtkAnim);
				this.m_AtkAnim = null;
			}
		}
	}

	private onClick() {
		this.clickEffc = ViewManager.ins().createEff(this.clickEffc, this.m_AnimGroup, "tapCircle")
		let data: ChaosBattleTagerData = this.data;
		if (data.isRole) {
			ChaosBattleSproto.ins().sendChaosAtkRole(data.id);
		} else {
			ChaosBattleSproto.ins().sendChaosAtkBoss(data.id);
		}
	}

	public release() {
		if (this.clickEffc) {
			DisplayUtils.dispose(this.clickEffc);
			this.clickEffc = null;
		}
		if (this.m_AtkAnim) {
			DisplayUtils.dispose(this.m_AtkAnim);
			this.m_AtkAnim = null;
		}
	}

}