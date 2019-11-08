class SubRoles extends BaseSystem {

	public static readonly MAX_COUNT = 3

	public rolesModel: Array<Role> = [];

	static ins(): SubRoles {
		return super.ins();
	}
	/**
     * 子角色列表
     * 0-2
     * @param bytes
     */
	public doSubRole(data: Sproto.sub_roles_request) {
		var count = data.roleList.length;
		var roleLen = SubRoles.ins().subRolesLen;
		let power = 0
		for (var i = 0; i < count; i++) {
			var model: Role = this.rolesModel[i];
			if (!model)
				model = new Role();
			model.roleID = i;
			model.parser(data.roleList[i]);
			if (!this.rolesModel[i]) {
				this.rolesModel.push(model);
			}
			power += model.power;
		}

		this.m_JobToRole = {}

		// GameLogic.ins().actorModel.power = power;
		if (roleLen && roleLen < this.rolesModel.length)
			UserTips.ins().showTips(GlobalConfig.jifengTiaoyueLg.st101756);
		else {
			// if (this.rolesModel[0].equipsData[EquipPos.WEAPON].item.configID == 0
			// 	&& !GuideUtils.ins().isShow()) {
			// 	Setting.currPart = 1;
			// 	Setting.currStep = 1;
			// 	(<UIView2>ViewManager.ins().getView(UIView2)).guideUpgrade();
			// }
		}

	};
    /**
     * 处理属性变化
     * 0-8
     * @param bytes
     */
	public doSubRoleAtt(rsp: Sproto.sub_role_att_change_request) {
		var roleID = rsp.roleID;
		var power = 0;
		var len = this.rolesModel.length;
		for (var i = 0; i < len; i++) {
			var model = this.getSubRoleByIndex(i);
			if (model.index == roleID) {
				if (GameMap.IsNoramlLevel()) {
					rsp.attributeData[0] = rsp.attributeData[2];
				}
				model.parserAtt(rsp.attributeData);
				model.power = rsp.power;
				model.attrElementData = rsp.elements;
			}
			power += model.power;
		}
		model.attrElementData = rsp.elements;
		// GameLogic.ins().actorModel.power = power;
	};

	/** 更新人物属性，用于副本*/
	public updateAttRoleCopy(rsp): void {
		var roleID = rsp.roleID;
		var len = this.rolesModel.length;
		for (var i = 0; i < len; i++) {
			var model = this.getSubRoleByIndex(i);
			if (model.index == roleID) {
				model.parserAtt(rsp.attributeData);
			}
		}
	}

	public getSubRoleByIndex(index: number): Role {
		return this.rolesModel[index];
	};

	/**根据subIndex部位和职业取玩家身上装备*/
	public getEquipMinLevelByIndex(subIndex, job): EquipsData {
		var len = this.rolesModel.length;
		var tempData: EquipsData;
		for (var i = 0; i < len; i++) {
			var role: Role = this.rolesModel[i];
			if (role) {
				//job:0通用
				if (role.job == job || job == 0) {
					tempData = role.getEquipByIndex(subIndex);
					break;
				}
			}
		}
		return tempData;

	}

	private m_JobToRole: { [key: number]: Role } = {}

	public GetSubRoleByJob(job: JobConst): Role {
		let subRole: any = this.m_JobToRole[job]
		if (subRole != null) {
			return subRole || null
		}
		subRole = false
		for (let i = 0; i < this.rolesModel.length; ++i) {
			let role = this.rolesModel[i]
			if (role == null) {
				continue
			}
			if (role.job == job) {
				subRole = role
				break
			}
		}
		this.m_JobToRole[job] = subRole
		return subRole || null
	}

	// public getSubRoleByHandle(handle) {
	// 	return;
	// };
	public get subRolesLen(): number {
		return this.rolesModel.length;
	}
	public resetRolesModel() {
		this.rolesModel.length = 0;
	};

	public GetZhuZaiData(index: number): ZhuZaiData[] {
		let data = this.rolesModel[index]
		if (data) {
			return data.zhuZaiData
		}
		return null
	}
}
window["SubRoles"] = SubRoles