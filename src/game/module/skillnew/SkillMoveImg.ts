class SkillMoveImg extends eui.Image {
	public constructor() {
		super();
	}

	public data: { job: number, level: number, curRole: number, index: number };
	public type: number = 1;

	public setData(data: { job: number, level: number, curRole: number, index: number }) {
		this.data = data;
		var subRole = SubRoles.ins().getSubRoleByIndex(data.curRole);
		let skillLv = UserSkill.ins().getskillLv(data.curRole, data.index);
		let skillID = UserSkill.ins().getSkillId(data.job, data.index, skillLv);
		let skillsConfig = GlobalConfig.ins("SkillsConfig")[skillID];
		if (skillsConfig) {
			this.source = skillsConfig.icon + "_png";
		}
	}
	/**移动的图片要烧毁 */
	public release() {
		this.data = null;
		DisplayUtils.dispose(this);
	}

}
window["SkillMoveImg"]=SkillMoveImg