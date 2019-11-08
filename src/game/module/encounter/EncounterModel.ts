class EncounterModel {

	// subRole: Array<Role>
	name: string;

	index: number;
	posIndex: number;
	lv: number;
	zsLv: number;

	job: number
	sex: number
	itemCount: number
	itemId: number

	type: EntityType;
	state: EncounterModelState

	redPoint = 0

	public mainEle: number;

	// public static lastTime: number;
	// public static refreshTimes: number;

	public constructor(name?: string) {
		this.name = name;
	}

	public parser(bytes: Sproto.sc_encounter_deal_data_request): void {
		let data = bytes.encounterData

		this.index = data.index
		this.posIndex = data.posIndex
		this.lv = data.lv
		this.zsLv = data.zsLv
		this.name = data.name
		this.itemCount = data.itemCount
		this.itemId = data.itemId || 600001
		this.job = data.job
		this.sex = data.sex
		// this.state = data.state || 0
		// 全部都可以挑战
		this.state = EncounterModelState.CAN_PK
		this.redPoint = data.redPoint || 0
		this.mainEle = data.mainEle;
		// this.subRole = [];
		/*
        for (let i = 0, len = data.subRoles.length; i < len; ++i) {
			let role: Role = this.subRole[i] = new Role()
			role.parser(data.subRoles[i])
			role.name = this.name
		}
		*/
	}
}

enum EncounterModelState {
	CAN_PK = 0, 		// 0、可挑战
	PROTECT = 1,		// 1、保护中
	FIGHT = 2,		// 2、战斗中
}
window["EncounterModel"]=EncounterModel