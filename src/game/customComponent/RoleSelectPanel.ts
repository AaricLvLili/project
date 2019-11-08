class RoleSelectPanel extends BaseView {
	/** 当前选择的角色 */
	private _curRole: number = 0;
	private roles: eui.Button[];
	private roleMovie: MovieClip[];

	private role0: eui.Button;
	private role1: eui.Button;
	private role2: eui.Button;
	/** 是否是查看别的玩家的数据，如果有值就是查看其它玩家，没有就是查看自己的数据*/
	public mRoleData: any;
	public static get NAME_TXT() {
		let list = ["", GlobalConfig.jifengTiaoyueLg.st101408, GlobalConfig.jifengTiaoyueLg.st101409, GlobalConfig.jifengTiaoyueLg.st101410]
		return list;
	}

	open(...param: any[]) {
		this.roles = [this.role0, this.role1, this.role2];
		if (this.roleMovie == null) {
			this.roleMovie = [];
			for (var i = 0; i < 2; i++) {
				var mc = new MovieClip;
				mc.touchEnabled = false
				mc.x = 30;
				mc.y = 25;
				// mc.scaleX = mc.scaleY = 0.8;
				this.roles[i + 1].addChild(mc);
				this.roleMovie.push(mc);
			}
		}
		this.setCurRole(param && param.length > 0 ? param[0] : 0, false);
		this.updateRole();
		this.addEventListener(egret.Event.ADDED_TO_STAGE, this.updateRole, this);
		this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClick, this);

		MessageCenter.addListener(GameLogic.ins().postSubRoleChange, this.updateRole, this);
		MessageCenter.addListener(GameLogic.ins().postLevelChange, this.updateRole, this);
		GameGlobal.MessageCenter.addListener(MessageDef.UPDATA_VIP_AWARDS, this.updateRole, this);
	}

	close() {
		this.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onClick, this);
		this.removeEventListener(egret.Event.ADDED_TO_STAGE, this.updateRole, this);
		MessageCenter.ins().removeAll(this);

		var len = this.roleMovie.length;
		for (var i = 0; i < len; i++) {
			DisplayUtils.dispose(this.roleMovie[i]);
			this.roleMovie[i] = null;
		}
		this.roleMovie = null;
	}

	getCurRole(): number {
		return this._curRole;
	}

	get curRole(): number {
		return this._curRole
	}

	setCurRole(value: number, dispatch = true): void {
		this._curRole = value;
		for (var i = 0; i < this.roles.length; i++) {
			var element = this.roles[i];
			element["select"].visible = i == value;
		}
		if (dispatch) {
			this.dispatchEventWith(egret.Event.CHANGE, false, this._curRole);
		}
	}

	set curRole(value: number) {
		this._curRole = value
	}

	// private InRange(pos, range) {
	// 	if (pos < 10 || range - pos < 10) {
	// 		return false
	// 	}
	// 	return true
	// }

	onClick(e: egret.TouchEvent) {
		var index = this.roles.indexOf(e.target);
		if (index > -1) {
			// if (!this.InRange(e.localX, e.target.width) || !this.InRange(e.localY, e.target.height)) {
			// 	return
			// }
			if (e.localY < 10 || e.localY > e.target.height - 12) {
				return
			}
			var roleBtn = e.target;
			var model = this.mRoleData ? this.mRoleData[index] : SubRoles.ins().getSubRoleByIndex(index);
			if (model) {
				//切换角色
				this.setCurRole(index);
			} else {
				if (this.mRoleData) {
					UserTips.ErrorTip(GlobalConfig.jifengTiaoyueLg.st101411);
					return;
				}
				ViewManager.ins().open(NewRoleWin);
				roleBtn["select"].visible = false
			}
		}
	}

	updateRole() {
		var role;
		var roleData;
		var len = this.roles.length;
		for (var i = 0; i < len; i++) {
			role = this.roles[i];
			roleData = this.mRoleData ? this.mRoleData[i] : SubRoles.ins().getSubRoleByIndex(i);
			if (roleData) {
				// role['jobImg'].visible = true;
				// role['jobImg'].source = JobItemIconConst[roleData.job]
				role['groupName'].visible = true
				// role['name'].text = JobItemIconConst[roleData.job]
				role['name'].text = RoleSelectPanel.NAME_TXT[roleData.job]
				role['txt'].visible = false;
				// role.icon = "head_" + roleData.job + roleData.sex;
				role.icon = ResDataPath.GetHeadMiniImgName2(roleData.job, roleData.sex)
				if (this.roleMovie[i - 1]) {
					// DisplayUtils.removeFromParent(this.roleMovie[i - 1]);
					DisplayUtils.dispose(this.roleMovie[i - 1]);
					this.roleMovie.splice((i - 1), 1);
				}
			}
			else {
				var config = GlobalConfig.ins("NewRoleConfig")[i];
				// role['jobImg'].visible = false;
				role['groupName'].visible = false
				role['txt'].visible = true;
				if (config) {
					if (config.zsLevel) {
						if (UserZs.ins().lv < config.zsLevel)
							role['txt'].text = config.zsLevel + GlobalConfig.jifengTiaoyueLg.st101412;
						else
							role['txt'].text =GlobalConfig.jifengTiaoyueLg.st101413;
					}
					else {
						if (GameLogic.ins().actorModel.level < config.level)
							role['txt'].text = config.level + GlobalConfig.jifengTiaoyueLg.st101414;
						else
							role['txt'].text = GlobalConfig.jifengTiaoyueLg.st101413;
					}
					if (config.vip && UserVip.ins().lv >= config.vip)
						role['txt'].text = GlobalConfig.jifengTiaoyueLg.st101413;
					role.icon = "";
				}
				else {
					Main.errorBack("配置表NewRoleConfig id=" + i + " 错误");
				}

			}
			if (role['txt'].text == GlobalConfig.jifengTiaoyueLg.st101413) {
				if (this.roleMovie[i - 1]) {
					this.roleMovie[i - 1].loadUrl(ResDataPath.GetUIEffePath("eff_openrole"), true);
				}
				// this.roleMovie[i - 1].loadFile('eff_openrole', true);//修改lxh 内存回收
			}
		}
	}

	showRedPoint(index, b) {
		if (this.roles == null)
			return;
		let role = this.roles[index]
		if (role) {
			role['redPoint'].visible = b;
		}
	}

	clearRedPoint() {
		if (this.roles == null)
			return;
		for (var i = 0; i < this.roles.length; i++) {
			this.roles[i]['redPoint'].visible = false;
		}
	};
}

window["RoleSelectPanel"] = RoleSelectPanel