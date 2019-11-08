class ChaosBattleTagerData {
	public constructor() {
	}
	public id: number;
	public _name: string;
	public isRole: boolean = true;
	public atkValue = 0;
	private _modelData: EntityModel[] = [];
	private _maxHp: number = 0;
	private resTime: number = 0;
	private _job: number;
	private _sex: number;

	private _head: string;
	public get name() {
		if (this._name && this._name != "") {
			return this._name;
		} else {
			if (this.baseData()) {
				if (this.baseData().name) {
					this._name = this.baseData().name;
				}
				return this._name;
			}
		}
		return "";
	}
	public set name(value) {
		this._name = value;
	}

	public get job() {
		if (this._job != null) {
			return this._job;
		}
		if (this.isRole) {
			let data = this.baseData();
			if (data instanceof Role) {
				this._job = data.job;
				return data.job;
			}
		}
		return 1;
	}

	public get sex() {
		if (this._sex != null) {
			return this._sex;
		}
		if (this.isRole) {
			let data = this.baseData();
			if (data instanceof Role) {
				this._sex = data.sex;
				return data.sex;
			}
		}
		return 0;
	}
	public get maxHp() {
		let dataList = this.modelData();
		let maxHp = 0;
		for (var i = 0; i < dataList.length; i++) {
			maxHp += dataList[i].getAtt(AttributeType.atMaxHp);
		}
		maxHp = Math.max(this._maxHp, maxHp);
		this._maxHp = maxHp;
		return maxHp;
	}
	public get hp() {
		let dataList = this.modelData();
		let hp = 0;
		for (var i = 0; i < dataList.length; i++) {
			hp += dataList[i].getAtt(AttributeType.atHp);
		}
		return hp;
	}

	public get preHp() {
		if (this.hp == 0 || this.maxHp == 0) {
			return 0;
		}
		let prhp = Math.ceil(this.hp / this.maxHp * 100)
		return prhp;
	}

	public get lv() {
		return 0;
	}

	public get zslv() {
		return 0;
	}

	public get elementType() {
		if (this.modelData()[0])
			return this.modelData()[0].attrElementMianType;
		return 1;
	}

	public get maxBarNum() {
		if (this.isRole) {
			return 10;
		}
		if (this.modelData()[0]) {
			let config = GlobalConfig.ins("MonstersConfig")[this.modelData()[0].configID];
			return config.hpCount;
		}
		return 100;

	}

	public get head() {
		if (this.isRole) {
			return ResDataPath.GetHeadMiniImgName(this.job, this.sex);
		} else {
			if (!this._head) {
				if (this.modelData()[0]) {
					let config = GlobalConfig.ins("MonstersConfig")[this.modelData()[0].configID];
					this._head = config.head + "_y_png"
					return this._head;
				}
			} else {
				return this._head;
			}
		}
		return "";
	}

	public get atkBossVale() {
		if (this.isRole) {
			return "";
		} else {
			return GlobalConfig.jifengTiaoyueLg.st101380 + CommonUtils.overLength(this.atkValue);
		}

	}

	public baseData() {
		if (this.isRole) {
			for (var i = 0; i < this._modelData.length; i++) {
				let data = this._modelData[i];
				if (data && data instanceof Role) {
					if (data.roleID == 0) {
						return data;
					}
				}
			}
		} else {
			let data = this._modelData[0];
			if (data && data instanceof EntityModel) {
				return data;
			}
		}
		return null;
	}
	public modelData() {
		if (this.resTime <= egret.getTimer()) {
			this._modelData = [];
		}
		if (this._modelData.length > 0) {
			return this._modelData;
		}
		this.resTime = egret.getTimer() + 2000;
		let data = EntityManager.ins().entityList;
		this._modelData = [];
		for (let key in data) {
			if (data[key].infoModel.teamId == this.id) {
				this._modelData.push(data[key].infoModel);
			}
		}
		return this._modelData;
	}

	public getCharMonster(): CharMonster {
		let charMonster = EntityManager.ins().entityList[this.id];
		if (charMonster) {
			return charMonster;
		}
	}

	public get weight() {
		let weight = 0;
		if (!this.isRole) {
			// let charMonster = this.getCharMonster();
			// if (charMonster) {
			// 	let dis = ChaosBattleModel.getInstance.getDis(charMonster);
			weight = this.id;
			// }
		} else {
			weight = this.id + 1000000;
		}
		return weight;
	}

}