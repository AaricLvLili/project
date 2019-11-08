class SkillEff extends eui.Component {
	public constructor() {
		super();
		this.skinName = "SkillEffSkin"
	}
	public m_MainGroup: eui.Group;

	public initEff(skillName: string) {
		let numChild = this.m_MainGroup.numChildren;
		for (var i = 0; i < numChild; i++) {
			let child = this.m_MainGroup.getChildAt(i);
			if (child && child instanceof eui.Group) {
				let nChild: any;
				if (child.numChildren > 0) {
					nChild = child.getChildAt(0);
				}

				if (!nChild) {
					nChild = ObjectPool.ins().pop("MovieClip");
				}
				if (nChild instanceof MovieClip) {
					nChild.loadUrl(ResDataPath.GetSkillPathByID(skillName), true, -1);
				}
				child.addChild(nChild);
			}
		}
	}
	/**跑的总时间 */
	public runTime: number = 4000;
	public initX: number = -480;
	public initY: number = -800;
	public endX: number = 480;
	public endY: number = 800;
	public playEff(skillName) {
		this.initEff(skillName);
		this.m_MainGroup.x = this.initX;
		this.m_MainGroup.y = this.initY;
		let endX = this.endX + StageUtils.ins().getWidth() - 480;
		let endY = this.endY + StageUtils.ins().getHeight() - 800;
		egret.Tween.get(this.m_MainGroup).to({ x: endX, y: endY }, this.runTime).call(() => { this.release() });
	}

	private release() {
		let numChild = this.m_MainGroup.numChildren;
		for (var i = 0; i < numChild; i++) {
			let child = this.m_MainGroup.getChildAt(i);
			if (child && child instanceof eui.Group) {
				let nChild: any;
				if (child.numChildren > 0) {
					nChild = child.getChildAt(0);
				}
				if (nChild && nChild instanceof MovieClip) {
					DisplayUtils.dispose(nChild);
					ObjectPool.ins().push(nChild);
				}
			}
		}
	}
}
window["SkillEff"] = SkillEff;