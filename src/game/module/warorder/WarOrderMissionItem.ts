class WarOrderMissionItem extends eui.ItemRenderer {
	public constructor() {
		super();
		this.skinName = "WarOrderMissionItemSkin";
	}
	public m_ItemBase: ItemBase;
	public m_MissionName: eui.Label;
	public m_MissionDesc: eui.Label;
	public m_MainBtn: eui.Button;
	public createChildren() {
		super.createChildren();
		this.m_MainBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClick, this);
	}
	public dataChanged() {
		super.dataChanged();
		let id = this.data.id;
		let warOrderModel = WarOrderModel.getInstance;
		let tokenTaskConfig = GlobalConfig.ins("TokenTaskConfig")[warOrderModel.showMissionType][id];
		if (tokenTaskConfig) {
			let cofData = tokenTaskConfig.award[0];
			let itemData = { type: cofData.type, id: cofData.id, count: cofData.count, isShowName: 2 }
			this.m_ItemBase.data = itemData;
			this.m_ItemBase.dataChanged();
			let missionData: WarOrderMissionData = warOrderModel.missionDic.get(warOrderModel.showMissionType).get(id);
			switch (missionData.state) {
				case 0:
					this.m_MainBtn.skinName = "Btn1Skin"
					this.m_MainBtn.label = GlobalConfig.jifengTiaoyueLg.st101245
					this.m_MainBtn.enabled = true;
					break;
				case 1:
					this.m_MainBtn.skinName = "btnRoSkin2";
					this.m_MainBtn.label = GlobalConfig.jifengTiaoyueLg.st101210
					this.m_MainBtn.enabled = true;
					break;
				default:
					this.m_MainBtn.skinName = "Btn1Skin"
					this.m_MainBtn.label = GlobalConfig.jifengTiaoyueLg.st100648
					this.m_MainBtn.enabled = false;
					break;
			}
			this.m_MissionName.textFlow = TextFlowMaker.generateTextFlow(tokenTaskConfig.desc + "(" + missionData.num + "/" + tokenTaskConfig.target + ")")
		}
	}

	private onClick() {
		let id=this.data.id;
		let warOrderModel = WarOrderModel.getInstance;
		let missionData: WarOrderMissionData = warOrderModel.missionDic.get(warOrderModel.showMissionType).get(id);
		if (missionData) {
			switch (missionData.state) {
				case 0:
					let tokenTaskConfig = GlobalConfig.ins("TokenTaskConfig")[warOrderModel.showMissionType][id];
					if (tokenTaskConfig) {
						if (tokenTaskConfig.funcopenId) {
							if (Deblocking.Check(tokenTaskConfig.funcopenId)) {
								ViewManager.Guide(tokenTaskConfig.controlTarget[0], tokenTaskConfig.controlTarget[1]);
							}
						} else {
							ViewManager.Guide(tokenTaskConfig.controlTarget[0], tokenTaskConfig.controlTarget[1]);
						}
					}
					break;
				case 1:
					WarOrderSproto.ins().sendCompMission(id);
					break;
				default:
					break;
			}
		}
	}

}
window["WarOrderMissionItem"] = WarOrderMissionItem