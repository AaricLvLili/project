class ZhuanZhiTaskPane extends BaseView implements ICommonWindowTitle, ICommonWindowRoleSelect {
	public constructor() {
		super();
		this.skinName = "ZhuanZhiTaskPanelSkin";
	}

	windowTitleIconName: string = GlobalConfig.jifengTiaoyueLg.st100643;
	m_RoleSelectPanel: RoleSelectPanel;
	private list: eui.List;
	private changeBtn: eui.Button;
	private dec: eui.Label;
	public static currRoleId: number = 0

	public m_MainScroller: eui.Scroller;
	public m_MainList: eui.List;
	public m_CompLab: eui.Label;
	public m_CompNowJobLab: eui.Label;
	public lockTips: eui.Label;
	public m_Attr: eui.Image;
	public m_LeftJobLab: eui.Label;
	public m_LeftJobImg: eui.Image;
	public m_RightJobLab: eui.Label;
	public m_RightJobImg: eui.Image;
	public m_MissionGroup: eui.Group;
	private listData = new eui.ArrayCollection;
	private mainListData = new eui.ArrayCollection;
	public m_NoChangeLab: eui.Label;
	public m_SkillRoleAnim: SkillRoleAnim;
	private languageTxt: eui.Label;
	private languageTxt0: eui.Label;
	/**这个界面的转生等级 */
	public zsLv = 1;

	protected childrenCreated(): void {
		super.childrenCreated();
		this.list.itemRenderer = ZhuanZhiTaskItem
		this.listData = new eui.ArrayCollection();
		this.list.dataProvider = this.listData;
		this.m_MainList.itemRenderer = ZhuanZhiTaskSkillIconItem;
		this.mainListData = new eui.ArrayCollection();
		this.m_MainList.dataProvider = this.mainListData;
		this.changeBtn.label = GlobalConfig.jifengTiaoyueLg.st100649;
		this.languageTxt.text = GlobalConfig.jifengTiaoyueLg.st100650;
		this.languageTxt0.text = GlobalConfig.jifengTiaoyueLg.st100643;
	}

	public open(): void {
		this.AddClick(this.changeBtn, this._OnClick);
		this.observe(MessageDef.ZHUANZHI_UPLEVEL_RESULT, this.UpdateContent);
		this.observe(MessageDef.ZHUANZHI_TASKLIST, this.UpdateContent);
		ZhuanZhiModel.ins().sendZhuanZhiTaskList();
		this.m_RoleSelectPanel.y = 135;
	}

	public close(): void {
		this.removeEvents();
		this.removeObserve();
		this.m_RoleSelectPanel.y = 158;
	}

	public release() {
		this.m_SkillRoleAnim.release();
		this.removeEvents();
		this.m_RoleSelectPanel.y = 0;
	}

	private _OnClick(e: egret.TouchEvent) {
		if (ZhuanZhiModel.ins().canZhuanZhiByRoleId(this.m_RoleSelectPanel.getCurRole(), true))
			ZhuanZhiModel.ins().sendZhuanZhiActive(this.m_RoleSelectPanel.getCurRole());
	}

	public UpdateContent() {
		let curRole = this.m_RoleSelectPanel.getCurRole();
		var subRole = SubRoles.ins().getSubRoleByIndex(curRole);
		ZhuanZhiTaskPane.currRoleId = curRole;
		this.m_MissionGroup.visible = true;
		var datas: Sproto.zhuanzhi_task[] = [];
		let lv: number = 0;
		let zzlevel = ZhuanZhiModel.ins().getZhuanZhiLevel(curRole);
		switch (this.zsLv) {
			case 1:
				lv = 1;
				break;
			case 2:
				lv = 2;
				break;
			case 3:
				lv = 3;
				break;
		}
		if (lv - 1 == zzlevel) {
			let zhuanZhiData = ZhuanZhiModel.ins().getZhuanZhiTaskData(curRole);
			datas = zhuanZhiData;
		} else {
			let config = GlobalConfig.ins("TransferTaskConfig");
			for (let key in config) {
				let transferTaskConfig = config[key];
				if (subRole.job == transferTaskConfig.roletype && lv - 1 == transferTaskConfig.level) {
					let newData = new Sproto.zhuanzhi_task();
					newData.id = transferTaskConfig.id;
					newData.value = 0;
					newData.state = -1;
					datas.push(newData);
				}
			}
		}
		this.listData.removeAll();
		this.listData.replaceAll(datas);
		this.listData.refresh();

		let nowConfig = GlobalConfig.ins("TransferAppearanceConfig")[subRole.job][zzlevel]
		if (nowConfig) {
			this.m_CompNowJobLab.text = GlobalConfig.jifengTiaoyueLg.st100644 + nowConfig.targetJob;//当前职业
		}
		let frontTransferAppearanceConfig = GlobalConfig.ins("TransferAppearanceConfig")[subRole.job][lv - 1];
		if (frontTransferAppearanceConfig) {
			this.m_LeftJobLab.text = frontTransferAppearanceConfig.targetJob;
			let jobLv = lv - 1;
			if (jobLv < 0) {
				jobLv = 1;
			}
			this.m_LeftJobImg.source = "zsjob_" + subRole.job + "_" + jobLv + "_png";
			this.m_NoChangeLab.text = GlobalConfig.jifengTiaoyueLg.st100645 + frontTransferAppearanceConfig.targetJob;//请先转职成XX
			this.m_MissionGroup.visible = false;
		}
		let transferAppearanceConfig = GlobalConfig.ins("TransferAppearanceConfig")[subRole.job][lv];
		if (transferAppearanceConfig) {
			this.dec.textFlow = TextFlowMaker.generateTextFlow(transferAppearanceConfig.TransferTips);
			let skillData: { job: number, level: number, curRole: number }[] = [];
			let config = GlobalConfig.ins("SkillsOpenConfig")[subRole.job];
			for (var i = 0; i < config.length; i++) {
				if (config[i].level == lv) {
					let newConfigData = { job: subRole.job, level: lv, curRole: curRole, index: config[i].index };
					skillData.push(newConfigData);
				}
			}
			this.mainListData.replaceAll(skillData);
			this.m_RightJobLab.text = transferAppearanceConfig.targetJob;
			this.m_RightJobImg.source = "zsjob_" + subRole.job + "_" + lv + "_png";
		} else {
			this.dec.text = "";
		}

		if (zzlevel >= lv) {
			this.changeBtn.visible = false;
			this.m_CompLab.visible = true;
			this.m_CompLab.text = LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st100646, [lv]);//"恭喜完成" + lv + "转";
			this.m_CompNowJobLab.visible = true;
		} else {
			this.changeBtn.visible = true;
			this.m_CompLab.visible = false;
			this.m_CompNowJobLab.visible = false;
		}
		if (zzlevel == lv - 1) {
			this.m_MissionGroup.visible = true;
		} else {
			this.m_MissionGroup.visible = false;
		}
		this.m_NoChangeLab.visible = false;
		if (zzlevel + 1 < lv) {
			this.changeBtn.visible = false;
			this.m_NoChangeLab.visible = true;
		}

		this.lockTips.visible = false;
		if (this.changeBtn.visible) {
			if (!ZhuanZhiModel.ins().zhuanZhiTaskIsOpen(this.m_RoleSelectPanel.getCurRole())) {
				this.changeBtn.visible = false;
				this.lockTips.visible = true;
				let level = ZhuanZhiModel.ins().getZhuanZhiLevel(this.m_RoleSelectPanel.getCurRole());
				let transferConfig = GlobalConfig.ins("TransferConfig").zslevel;
				this.lockTips.text = LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st100647, [transferConfig[level]]);//`转生${transferConfig[level]}转后开启`;
			}
		}
		this.m_SkillRoleAnim.setData(curRole, lv, subRole.job, true);
	}
}

class ZhuanZhiTaskItem extends eui.ItemRenderer {
	private conditionLabel: eui.Label
	private goLabel: eui.Label
	private finishImg: eui.Label

	protected childrenCreated() {
		this.touchEnabled = false
		this.goLabel.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnClick, this);
		UIHelper.SetLinkStyleLabel(this.goLabel);
		this.goLabel.text = GlobalConfig.jifengTiaoyueLg.st100651;
		this.finishImg.text = GlobalConfig.jifengTiaoyueLg.st100648;
	}

	private _OnClick() {
		let config = GlobalConfig.ins("TransferTaskConfig")[this.data.id];
		if (config.type != 80)
			ViewManager.ins().close(ZhuanZhiTaskWin);

		if (config.type == 75)//杀怪任务
			return;

		if (config.type == 80)//捐献任务
			ViewManager.ins().open(ZhuanZhiTaskConWin, config, ZhuanZhiTaskPane.currRoleId);
		else if (config.type == 76)//技能任务
			ViewManager.ins().open(ZsWin, 0, ZhuanZhiTaskPane.currRoleId);
		else if (config.type == 37)//器灵任务
			ViewManager.ins().open(ForgeWin, 1, ZhuanZhiTaskPane.currRoleId)
		else if (config.type == 21)//宝石任务
			ViewManager.ins().open(ForgeWin, 2, ZhuanZhiTaskPane.currRoleId);
		else if (config.arg)//挑战副本任务
			ZhuanZhiModel.ins().sendZhuanZhiEnterRaid(ZhuanZhiTaskPane.currRoleId, config.id);
		else {
			if (Deblocking.Check(config.openid)) {
				ViewManager.Guide(config.controlTarget[0], config.controlTarget[1])
			}
		}
	}

	protected dataChanged() {
		var info: Sproto.zhuanzhi_task = this.data;
		let config = GlobalConfig.ins("TransferTaskConfig")[info.id];
		if (info.state > 0) {
			this.conditionLabel.text = config.desc + `(${GlobalConfig.jifengTiaoyueLg.st100648})`
		} else {
			// let targetValue = config.type == 8 ? Math.floor(config.target * 0.001) : config.target
			this.conditionLabel.text = config.desc + `(${info.value}/${config.target})`
		}
		this.finishImg.visible = (info.state > 0);
		this.goLabel.visible = !(info.state > 0);
	}
}
window["ZhuanZhiTaskPane"] = ZhuanZhiTaskPane
window["ZhuanZhiTaskItem"] = ZhuanZhiTaskItem