class SkillsConfig {
	/** 是否物理攻击 */
    public static isPhysical  (skill) {
        return skill.args.type == 1;
    };
    /** 是否法术攻击 */
    public static isMagic  (skill) {
        return skill.args.type == 2;
    };
}
window["SkillsConfig"]=SkillsConfig