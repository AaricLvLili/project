class EntityModel {

	/**
	 * 属性集
	 */
	protected attributeData: number[] = [];
	protected attributeExData: number[] = [];

	protected _attrElementData: number[] = [];
	protected _attrElementMianType: number;

	protected _name: string;
	protected _lv: number;
	configID: number;

	type: EntityType;
	handle: number;
	masterHandle: number;
	x: number;
	y: number;
	/** 配置表怪物类型，0是小怪，1是BOSS*/
	monstersType: number;

	team: Team;
	index: number = 0;

	guildName: string;
	/** 召唤类型的技能id*/
	summonSkillId: number;

	public inRoleId: number = -1;
	public teamId: number;

	public constructor() {
	}

	public Parser(entityModelBase: Sproto.entity_model_base, attrs: number[]): void {
		this.inRoleId = -1;
		this.parserBase(entityModelBase)
		this.parserAtt(attrs)
	}

	public parserBase(entityModelBase: Sproto.entity_model_base) {
		this.type = entityModelBase.type
		this.handle = entityModelBase.handle
		this.configID = entityModelBase.configID;
		this.setElementByConfig();
		this.masterHandle = entityModelBase.masterHandle
		this.x = entityModelBase.x
		this.y = entityModelBase.y;
		if (GlobalConfig.monstersConfig[this.configID])
			this.monstersType = GlobalConfig.monstersConfig[this.configID].type;
	}

	public set attrElementData(value: number[]) {
		if (!value) {
			return;
		}
		this._attrElementData = value;
	}
	public get attrElementData() {
		return this._attrElementData;
	}

	public set attrElementMianType(value: number) {
		if (!value) {
			return;
		}
		this._attrElementMianType = value;
	}

	public get attrElementMianType() {
		return this._attrElementMianType;
	}

	public parserAtt(attrs: number[]) {
		this.attributeData = attrs
	}

	public getAtt(attType: AttributeType): number {
		if (attType < 100) {
			return this.attributeData[attType] || 0;
		} else {
			let type = attType - 101;
			return this.attrElementData[type] || 0;
		}
	}

	public setAtt(attType: AttributeType, value: number): void {
		this.attributeData[attType] = value;
	}

	public get getattributeData() {
		return this.attributeData;
	}

	private monstersConfig: any;

	public get avatarFileName() {
		if (this.monstersConfig == null)
			this.monstersConfig = GlobalConfig.monstersConfig;
		return this.monstersConfig[this.configID].avatar;
	}

	public set name(value) {
		this._name = value;
	}

	public get name() {
		if (this._name) {
			return this._name;
		}
		if (this.monstersConfig == null)
			this.monstersConfig = GlobalConfig.monstersConfig;
		if (this.monstersConfig[this.configID].type == 3) {
			return this._name;
		}
		return this.monstersConfig[this.configID].name;
	}

	public set lv(value) {
		this._lv = value;
	}

	public get lv() {
		if (this.monstersConfig == null)
			this.monstersConfig = GlobalConfig.monstersConfig;
		if (this.monstersConfig[this.configID].type == 3) {
			return this._lv;
		}
		return this.monstersConfig[this.configID].level;
	}

	public get configType() {
		if (this.monstersConfig == null)
			this.monstersConfig = GlobalConfig.monstersConfig;
		if (!this.configID) {
			return null;
		}
		return this.monstersConfig[this.configID].type;
	}

	public setPos(x: number, y: number) {
		this.x = x;
		this.y = y;
	}

	public getAttEx(attExType: ExAttributeType): number {
		return this.attributeExData[attExType] || 0;
	}

	public setAttEx(attExType: ExAttributeType, value: number): void {
		this.attributeExData[attExType] = value;
	}

	public GetHeadImgName(): string {
		return ""
	}

	public GetHeadImgName2(): string {
		return ""
	}

	public get isPet() {
		if (this.monstersConfig == null)
			this.monstersConfig = GlobalConfig.monstersConfig;
		if (this.monstersConfig[this.configID] && this.monstersConfig[this.configID].type == 3) {
			return true;
		}
		return false;
	}

	public setElementByConfig() {
		if (!this._attrElementMianType || this._attrElementData) {
			if (this.monstersConfig == null)
				this.monstersConfig = GlobalConfig.monstersConfig;
			let monstersVo = this.monstersConfig[this.configID];
			if (monstersVo) {
				this.attrElementMianType = monstersVo.elementType;
				let attrElemt = [];
				for (var i = 0; i < monstersVo.elementValue.length; i++) {
					attrElemt.push(monstersVo.elementValue[i]);
				}
				this.attrElementData = attrElemt;
			}
		}
	}


}
window["EntityModel"] = EntityModel