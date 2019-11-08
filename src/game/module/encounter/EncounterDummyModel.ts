class EncounterDummyModel {
	static INDEX = 0

	subRole: Array<Role> = []
	name: string;

	lv: number;
	zsLv: number;

	type = EntityType.WillDummy
	team = Team.PASSERBY

	index: number = ++EncounterDummyModel.INDEX

	// public constructor(name: string, lv: number, zsLv: number) {
	// 	this.name = name;
	// 	this.lv = lv
	// 	this.zsLv = zsLv
	// }
	public constructor(rsp: Sproto.actor_base_data) {
		this.name = rsp.name
		this.lv = rsp.level
		this.zsLv = rsp.zhuan
	}

	public AddRoleByData(rsp: Sproto.role_data) {
		let role = new Role
		role.parser(rsp)

		if (role["attributeData"] == null) {
			let attr = []
			for (let i = 0; i < AttributeType.atCount; ++i) {
				attr.push(999)
			}
			attr[AttributeType.atMoveSpeed] = 3750
			role.parserAtt(attr)

			let attrEx = []
			for (let i = 0; i < AttributeType.atCount; ++i) {
				attrEx.push(999)
			}
			role.parserExAtt(attrEx)
		}
		this.subRole.push(role)
	}
}
window["EncounterDummyModel"]=EncounterDummyModel