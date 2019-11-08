class GrowUpRoadconRule extends RuleIconBase {
	private bar: eui.ProgressBar
	private lab: eui.Label
	private roleShowPanel: RoleShowPanel
	private m_groupMc: eui.Group
	private reddot: eui.Image
	private mc: MovieClip
	public constructor(t) {
		super(t)
		this.firstTap = true
		this.updateMessage = [
			MessageDef.LEVEL_CHANGE,
			MessageDef.GUANQIA_CHANGE,
			MessageDef.FUNC_OPEN_UPDATE,
		]
		this.bar = t.getChildByName("bar")
		this.lab = t.getChildByName("lab")
		this.roleShowPanel = t.getChildByName("role")
		this.m_groupMc = t.getChildByName("mcGroup")
		this.reddot = t.getChildByName("red")
		this.bar.labelDisplay.size = 12
	}

	checkShowIcon() {
		let isShow = !FuncOpenModel.ins().AllRewardIsGet()
		if (isShow == false) {
			this.roleShowPanel.release()
			DisplayUtils.dispose(this.mc)
			ObjectPool.ins().push(this.mc)
			// this.mc = null;
		}
		return isShow
	}

	checkShowRedPoint() {
		return FuncOpenModel.ins().GetCurCanRewardIndex() != -1
	}

	getEffName(e) {
		//return this.DefEffe(e)
	}
	update() {
		super.update()
		let index = FuncOpenModel.ins().GetNextIndex()
		if (index == -1) {
			index = FuncOpenModel.ins().GetCurCanRewardIndex()
		}
		this.reddot.visible = FuncOpenModel.ins().GetCurCanRewardIndex() != -1
		if (index == -1) return
		let cfg = GlobalConfig.funcNoticeConfig[index]
		this.lab.textFlow = TextFlowMaker.getTextFlowByHtml(FuncOpenModel.GetTipStr3(cfg.openLv[0], cfg.openLv[1], cfg.name))
		this._initRoleShow(cfg)
		this.bar.maximum = cfg.openLv[1]
		this.bar.value = cfg.openLv[0] == 1 ? UserFb.ins().guanqiaID : GameGlobal.actorModel.level
	}
	private _initRoleShow(cfg: any): void {
		if (cfg.movieBody || cfg.movieMounts || cfg.movieWeapon || cfg.movieWing) {
			let role = SubRoles.ins().getSubRoleByIndex(0);
			this.roleShowPanel.creatAnim(role);
			this.roleShowPanel.setCharSexJob(role.sex, role.job, cfg.movieBody, cfg.movieWeapon, cfg.movieMounts, cfg.movieWing)
			this.roleShowPanel.visible = true
			this.m_groupMc.visible = false
		} else if (cfg.moviePet) {
			this.roleShowPanel.visible = false
			this.m_groupMc.visible = true
			if (this.mc == null) {
				this.mc = ObjectPool.ins().pop("MovieClip")
				this.mc.x = this.m_groupMc.width / 2
				this.mc.y = this.m_groupMc.height / 2
				this.mc.scaleX = this.mc.scaleY = .7
				this.m_groupMc.addChild(this.mc)
			}
			this.mc.loadUrl(ResDataPath.GetMonsterBodyPath(cfg.moviePet + "_3" + EntityAction.STAND), true, -1);
		}

	}

	tapExecute() {
		let index = FuncOpenModel.ins().GetCurCanRewardIndex()
		if (index == -1) {
			index = FuncOpenModel.ins().GetNextIndex()
		}
		ViewManager.ins().open(GrowUpRoadWin, index)
		this.firstTap = false
		this.update()
	}
}
window["GrowUpRoadconRule"]=GrowUpRoadconRule