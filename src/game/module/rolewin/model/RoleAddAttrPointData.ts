class RoleAddAttrPointData {

	/**角色ID*/
	public roldid = 0;
	/**剩余潜能点*/
	public point = 0;
	/**潜能属性值表 1力量，2 敏捷 3 智慧 4 根骨*/
	public points: Array<number> = [];
	/**战斗力*/
	public power = 0;

	parse(info: Sproto.sc_zs_point_info_request) {
		if (info) {
			this.roldid = info.roldid;
			this.point = info.point;
			this.points = info.points;
			this.power = info.power;
		}
	}
}
window["RoleAddAttrPointData"] = RoleAddAttrPointData