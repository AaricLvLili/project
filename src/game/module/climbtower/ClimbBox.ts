class ClimbBox extends eui.Component {
	public constructor() {
		super();
		this.skinName = "ClimbBoxSkin";
	}

	public data: any;

	public m_Bg: eui.Image;
	public m_BoxImg: eui.Image;
	public m_CompImg: eui.Image;
	public m_LayerLab: eui.Label;
	public m_MainGroup: eui.Group;

	private type: number;
	private isClick: boolean = false;

	private state: RewardState;
	public createChildren() {
		super.createChildren();
		this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClick, this);
	}


	public release() {
		this.m_MainGroup.filters = null;
	}
	public setData(configData: any, type: number) {
		this.type = type;
		this.data = configData;
		let climbTowerModel = ClimbTowerModel.getInstance;
		this.isClick = false;
		this.m_MainGroup.filters = null;
		switch (type) {
			case ClimbType.PET: {
				let climbPetData = climbTowerModel.ClimbTowerPetData;
				if (climbPetData) {
					let isOpen = false;
					let state: number = climbPetData.rewards[configData.index - 1];
					if (state && state != 0) {
						isOpen = true;
					}
					if (isOpen == true) {
						this.m_CompImg.visible = true;
						this.state = RewardState.Gotten;
					} else {
						this.m_CompImg.visible = false;
						if (climbPetData.maxlevel >= configData.time) {
							this.m_MainGroup.filters = null;
							this.isClick = true;
							this.state = RewardState.CanGet;
						} else {
							FilterUtil.setGayFilter(this.m_MainGroup);
							this.state = RewardState.NotReached;
						}
					}
					this.m_LayerLab.text = configData.time + GlobalConfig.jifengTiaoyueLg.st100369;
				}
				break;
			}
			case ClimbType.MOUNT: {
				let climbMountData = climbTowerModel.ClimbTowerMountData;
				if (climbMountData) {
					let isOpen = false;
					let state: number = climbMountData.rewards[configData.index - 1];
					if (state && state != 0) {
						isOpen = true;
					}
					if (isOpen == true) {
						this.m_CompImg.visible = true;
						this.state = RewardState.Gotten;
					} else {
						this.m_CompImg.visible = false;
						if (climbMountData.maxlevel >= configData.time) {
							this.m_MainGroup.filters = null;
							this.isClick = true;
							this.state = RewardState.CanGet;
						} else {
							FilterUtil.setGayFilter(this.m_MainGroup);
							this.state = RewardState.NotReached;
						}
					}
					this.m_LayerLab.text = configData.time + GlobalConfig.jifengTiaoyueLg.st100369;
				}
				break;
			}
		}


	}
	private onClick() {
		// if (!this.isClick) {
		// 	return;
		// }
		switch (this.type) {
			case ClimbType.PET: {
				let str: string = LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st101720, [this.data.time])
				let index = this.data.index;
				ViewManager.ins().open(GetReward2Panel, GlobalConfig.jifengTiaoyueLg.st101721, str, this.data.boxAward, function () {
					ClimbTowerSproto.ins().sendGetTowerAward(ClimbType.PET, index);
				}, this.state);
				break;
			}
			case ClimbType.MOUNT: {
				let str: string = LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st101720, [this.data.time])
				let index = this.data.index;
				ViewManager.ins().open(GetReward2Panel, GlobalConfig.jifengTiaoyueLg.st101721, str, this.data.boxAward, function () {
					ClimbTowerSproto.ins().sendGetTowerAward(ClimbType.MOUNT, index);
				}, this.state);
				break;
			}
		}
	}
}
window["ClimbBox"] = ClimbBox