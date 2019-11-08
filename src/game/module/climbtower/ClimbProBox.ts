class ClimbProBox extends eui.Component {
	public constructor() {
		super();
	}
	/**1001宠物 1002坐骑 */
	public type: number;

	public m_ExpBar: eui.ProgressBar;
	public m_BoxGroup: eui.Group;

	public createChildren() {
		super.createChildren();
		this.m_ExpBar.labelDisplay.visible = false;
	}

	public release() {
		this.removeBoxGroup();
	}
	public setData(type: number) {
		this.m_ExpBar.maximum = 0;
		this.removeBoxGroup();
		let climbTowerModel = ClimbTowerModel.getInstance;
		switch (type) {
			case ClimbType.PET: {
				let config = GlobalConfig.ins("PetTowerAwardConfig");
				for (let key in config) {
					let petTowerAwardConfig = config[key];
					let pr = petTowerAwardConfig.time / 1000;
					let x = 3000 * pr;
					this.m_ExpBar.maximum = Math.max(this.m_ExpBar.maximum, petTowerAwardConfig.time);
					let climbBox = new ClimbBox();
					climbBox.x = x;
					this.m_BoxGroup.addChild(climbBox);
					climbBox.setData(petTowerAwardConfig, ClimbType.PET);
				}
				this.m_ExpBar.value = Math.min(climbTowerModel.ClimbTowerPetData.maxlevel, this.m_ExpBar.maximum);
				break;
			}
			case ClimbType.MOUNT: {
				let config = GlobalConfig.ins("MountsTowerAwardConfig");
				for (let key in config) {
					let mountTowerAwardConfig = config[key];
					let pr = mountTowerAwardConfig.time / 1000;
					let x = 3000 * pr;
					this.m_ExpBar.maximum = Math.max(this.m_ExpBar.maximum, mountTowerAwardConfig.time);
					let climbBox = new ClimbBox();
					climbBox.x = x;
					this.m_BoxGroup.addChild(climbBox);
					climbBox.setData(mountTowerAwardConfig, ClimbType.MOUNT);
				}
				this.m_ExpBar.value = Math.min(climbTowerModel.ClimbTowerMountData.maxlevel, this.m_ExpBar.maximum);
				break;
			}
		}
	}

	public removeBoxGroup() {
		for (var i = 0; i < this.m_BoxGroup.numChildren; i++) {
			let child = this.m_BoxGroup.getChildAt(i);
			if (child && child instanceof ClimbBox) {
				child.release();
			}
		}
		this.m_BoxGroup.removeChildren();
	}
}
window["ClimbProBox"] = ClimbProBox