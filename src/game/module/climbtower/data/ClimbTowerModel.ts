class ClimbTowerModel {
	private static s_instance: ClimbTowerModel;
	public static get getInstance(): ClimbTowerModel {
		if (!ClimbTowerModel.s_instance) {
			ClimbTowerModel.s_instance = new ClimbTowerModel();
		}
		return ClimbTowerModel.s_instance;
	}
	public constructor() {
		this.m_climbPetLayerDic = new Dictionary<Dictionary<any>>();
		this.m_climbMountLayerDic = new Dictionary<Dictionary<any>>();
	}

	public mountSelectIndex: number = 1;
	public petSelectIndex: number = 1;
	public ClimbTowerPetData: Sproto.sc_tower_init_res_request;
	public ClimbTowerMountData: Sproto.sc_tower_init_res_request;

	public petBattleId: number = 1;
	public mountBattleId: number = 1;

	public reward: Sproto.reward_data[] = [];
	public setData(bytes: Sproto.sc_tower_init_res_request) {
		switch (bytes.type) {
			case ClimbType.PET:
				this.ClimbTowerPetData = bytes;
				this.changePetSelectIndex();
				break;
			case ClimbType.MOUNT:
				this.ClimbTowerMountData = bytes;
				this.changeMountSelectIndex()
				break;
		}
	}
	public changePetSelectIndex() {
		let bytes = this.ClimbTowerPetData;
		let petSelectIndex = this.getMinIndex(bytes.pass);
		this.petSelectIndex = petSelectIndex;
		if (petSelectIndex == -1) {
			if (bytes.maxlevel == 29) {
				this.petSelectIndex = bytes.maxlevel + 1;
			} else {
				this.petSelectIndex = bytes.maxlevel;
			}
		}
		let maxLv = GlobalConfig.ins("PetTowerBaseConfig").maxFloor;
		if (maxLv) {
			if (this.petSelectIndex > maxLv) {
				this.petSelectIndex = maxLv;
			}
		} else
			if (this.petSelectIndex > 1000) {
				this.petSelectIndex = 1000;
			}
	}
	public changeMountSelectIndex() {
		let bytes = this.ClimbTowerMountData;
		let mountSelectIndex = this.getMinIndex(bytes.pass);
		this.mountSelectIndex = mountSelectIndex;
		if (mountSelectIndex == -1) {
			if (bytes.maxlevel == 29) {
				this.mountSelectIndex = bytes.maxlevel + 1;
			} else {
				this.mountSelectIndex = bytes.maxlevel;
			}
		}
		let maxLv = GlobalConfig.ins("MountsTowerBaseConfig").maxFloor;
		if (maxLv) {
			if (this.mountSelectIndex > maxLv) {
				this.mountSelectIndex = maxLv;
			}
		} else
			if (this.mountSelectIndex > 1000) {
				this.mountSelectIndex = 1000;
			}
	}

	private m_climbPetLayerDic: Dictionary<Dictionary<any>>;

	public get climbPetLayerDic() {
		if (this.m_climbPetLayerDic.values.length <= 0) {
			let config = GlobalConfig.ins("PetTowerConfig");
			for (let key in config) {
				let petTowerConfig = config[key];
				if (petTowerConfig) {
					let dic: Dictionary<any> = this.m_climbPetLayerDic.get(petTowerConfig.layersId);
					if (dic) {
						dic.set(petTowerConfig.id, petTowerConfig);
					} else {
						dic = new Dictionary<any>();
						dic.set(petTowerConfig.id, petTowerConfig);
						this.m_climbPetLayerDic.set(petTowerConfig.layersId, dic);
					}
				}
			}
		}
		return this.m_climbPetLayerDic;
	}

	private m_climbMountLayerDic: Dictionary<Dictionary<any>>;
	public m_MountLayerNum = 3;
	public get climbMountLayerDic() {
		if (this.m_climbMountLayerDic.values.length <= 0) {
			let config = GlobalConfig.ins("MountsTowerConfig");
			for (let key in config) {
				let mountsTowerConfig = config[key];
				if (mountsTowerConfig) {
					let layersId = Math.ceil(mountsTowerConfig.id / this.m_MountLayerNum);
					let dic: Dictionary<any> = this.m_climbMountLayerDic.get(layersId);
					if (dic) {
						dic.set(mountsTowerConfig.id, mountsTowerConfig);
					} else {
						dic = new Dictionary<any>();
						dic.set(mountsTowerConfig.id, mountsTowerConfig);
						this.m_climbMountLayerDic.set(layersId, dic);
					}
				}
			}
		}
		return this.m_climbMountLayerDic;
	}


	/**获取当前可战斗的最低关卡 */
	public getMinIndex(pass: number[]) {
		for (var i = 0; i < pass.length; i++) {
			let num = 0;
			if (i == 0) {
				num = 1;
			}
			for (var f = i * 30 + num; f < i * 30 + 30; f++) {
				if ((pass[i] & 1 << (f - i * 30)) == 0) {
					return f;
				}
			}
		}
		return -1;
	}

	public getIsBattle(pass: number[], lv: number): boolean {
		let index = Math.floor(lv / 30);
		let re = pass[index] & 1 << (lv - index * 30);
		if (re > 0) {
			return false;
		}
		return true;
	}


}

enum ClimbType {
	/**宠物爬塔 */
	PET = 1001,
	/**坐骑爬塔 */
	MOUNT = 1002,
}

window["ClimbTowerModel"] = ClimbTowerModel