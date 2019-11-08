class PetAttachItem extends eui.ItemRenderer {
	public constructor() {
		super();
	}
	public m_Name: eui.Label;
	public m_Lv: eui.Label;
	public m_AttachBtn: eui.Button;
	public m_PetIconBase: PetIconBase;
	public m_AttachLab: eui.Label;
	public m_Rect: eui.Rect;

	public createChildren() {
		super.createChildren();
		this.addEvent();
	}

	private addEvent() {
		this.m_AttachBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClickAttachBtn, this);
	}
	public dataChanged() {
		super.dataChanged();
		let petModel: PetModel = PetModel.getInstance;
		let petData: PetData = this.data;
		this.m_AttachBtn.visible = true;
		this.m_AttachLab.y = 65;
		this.m_Rect.visible = false;
		switch (petData.inRoleId) {
			case -1:
				this.m_AttachLab.text = "";
				if (petData.isFight == true) {
					this.m_AttachBtn.visible = true;
					this.m_AttachBtn.label = GlobalConfig.jifengTiaoyueLg.st101160;
					if (petData.isBeiZhan) {
						this.m_AttachLab.text = GlobalConfig.jifengTiaoyueLg.st101965;
					} else {
						this.m_AttachLab.text = GlobalConfig.jifengTiaoyueLg.st101151;
					}
				} else {
					this.m_AttachBtn.visible = true;
					this.m_AttachBtn.label = GlobalConfig.jifengTiaoyueLg.st101160;
				}
				break;
			default:
				let role: Role = SubRoles.ins().getSubRoleByIndex(petData.inRoleId);
				let str: string;
				switch (role.job) {
					case JobConst.ZhanShi:
						str = Role.jobNumberToName(JobConst.ZhanShi);
						break;
					case JobConst.FaShi:
						str = Role.jobNumberToName(JobConst.FaShi);
						break;
					case JobConst.DaoShi:
						str = Role.jobNumberToName(JobConst.DaoShi);
						break;
				}
				// let data: Sproto.pet_attch_data = PetModel.getInstance.petAttachData.get(role.roleID)
				this.m_AttachLab.text = GlobalConfig.jifengTiaoyueLg.st101159 + str;
				this.m_AttachBtn.label = GlobalConfig.jifengTiaoyueLg.st101160;
				if (petModel.attachSelectIndex == petData.inRoleSlot && petModel.attachSelectRoleId == petData.inRoleId) {
					this.m_AttachBtn.label = GlobalConfig.jifengTiaoyueLg.st100313
					this.m_Rect.visible = true;
				}
				break;
		}
		this.m_PetIconBase.setData(petData.petid, 0);
		this.m_Name.text = petData.name;
		this.m_Lv.text = "Lv." + petData.level;
	}
	private onClickAttachBtn() {
		let petData: PetData = this.data;
		let petModel: PetModel = PetModel.getInstance;
		//petid传0表示取消附身
		// if (petData.inRoleId > -1) {
		// 	PetSproto.ins().sendPetAttachMsg(petData.inRoleId, petData.inRoleId > -1 ? 0 : petData.petid, petData.inRoleSlot + 1);
		// } else {
		// 	PetSproto.ins().sendPetAttachMsg(petModel.attachSelectRoleId, petData.inRoleId > -1 ? 0 : petData.petid, petModel.attachSelectIndex + 1);
		// }
		if (petModel.attachSelectIndex == petData.inRoleSlot && petModel.attachSelectRoleId == petData.inRoleId) {
			/**前端的孔位0开始 后端的1开始 发消息要+1 */
			PetSproto.ins().sendPetAttachMsg(petModel.attachSelectRoleId, 0, petModel.attachSelectIndex + 1);
		} else {
			PetSproto.ins().sendPetAttachMsg(petModel.attachSelectRoleId, petData.petid, petModel.attachSelectIndex + 1);
		}
	}

}
window["PetAttachItem"] = PetAttachItem