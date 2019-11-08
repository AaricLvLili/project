class TrRoleInfoPanel extends BaseView implements ICommonWindowTitle, ICommonWindowRoleSelect {

	equips: RoleItem[];
	zhuzaiArr: RoleItem[];

	private totalPower: eui.BitmapLabel

	private roleShowPanel: RoleShowPanel

	private m_Context: TrRoleWin;

	windowTitleIconName: string;
	private m_State: eui.Button;

	public strenLogo: eui.Group;
	public strenLevel: eui.Label;
	public gemLogo: eui.Group;
	public gemLevel: eui.Label;
	public zhuLingLogo: eui.Group;
	public zhuLingLevel: eui.Label;
	windowCommonBg = "pic_bj_20_png";

	public constructor(context: TrRoleWin) {
		super()
		this.m_Context = context
		this.skinName = "TrRoleInfoSkin"
		this.name = GlobalConfig.jifengTiaoyueLg.st100100;
		this.windowTitleIconName = GlobalConfig.jifengTiaoyueLg.st100100;
	}

	protected childrenCreated(): void {
		this.touchEnabled = false;
		this.touchChildren = true;
		this.equips = [];
		for (var i = 0; i < EquipPos.MAX; i++) {
			this.equips[i] = this['item' + i];
			this.equips[i].touchEnabled = true;
			this.equips[i].isShowJob(false);
		}
		this.zhuzaiArr = [];
		for (var i = 0; i < 4; i++) {
			this.zhuzaiArr[i] = this['zhuzai' + i];
		}
		this.m_State.label=GlobalConfig.jifengTiaoyueLg.st100095;
	}

	open() {
		this.strenLevel.text = 0 + "";
		this.gemLevel.text = 0 + "";
		this.zhuLingLevel.text = 0 + "";
		this.m_State.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClick, this);
		Sproto.SprotoReceiver.AddHandler(S2cProtocol.sc_rank_player_info, this.sc_rank_player_info, this);
	}

	close() {
		this.roleShowPanel.release();
	}

	private onClick(e) {
		switch (e.currentTarget) {
			case this.m_State:
				ViewManager.ins().open(TrTreasureHuntWin, this.m_Context.mActorData, this.m_Context.mRoleData, this.m_RoleSelectPanel.curRole);
				GameLogic.ins().SendGetOtherActorBaseInfo(UserReadPlayer.ins().actorId, this.m_RoleSelectPanel.curRole);
				break;
		}
	}
	/**玩家培养图标 */
	public sc_rank_player_info(bytpy: Sproto.sc_rank_player_info_request): void {
		let QHItem = bytpy.infos[0];
		let BSItem = bytpy.infos[1];
		let ZLItem = bytpy.infos[2];
		// let YSItem = bytpy.infos[3];
		this.strenLevel.text = QHItem.sum + "";//强化等级总和
		this.gemLevel.text = BSItem.sum + ""; //宝石等级总和
		this.zhuLingLevel.text = ZLItem.sum + ""; //注灵等级总和
		// this.yuanShenLevel.text = YSItem.sum + ""; //元神等级总和

		// this.gemLogo.visible = (bytpy.level > 70) ? true : false;
		// this.zhuLingLogo.visible = (bytpy.level > 35) ? true : false;
		// this.yuanShenLogo.visible = (bytpy.level > 70) ? true : false;

		/**转职名称 */
		// let transferConfig = GlobalConfig.ins("TransferConfig");
		// this.zhuanZhiImg.source = transferConfig[`ch${this.m_RoleSelectPanel.curRole + 1}${bytpy.zzid}`];

		/**武魂*/
		// if (bytpy.shapeid == 0) {
		// 	this.jihuo.visible = false;
		// } else {
		// 	this.jihuo.visible = true;
		// 	let shapeid = bytpy.shapeid;
		// 	let ShapeShiftConfig = GlobalConfig.ins("ShapeShiftConfig")[shapeid];
		// 	this.wuhung.source = (`${73000 + shapeid}_png`);
		// 	this.nameTxt.text = ShapeShiftConfig.name;
		// }
	}

	setEquip(role: Role) {
		if (!role)
			return;

		var len = role.getEquipLen2();
		for (var i = 0; i < len; i++) {
			var element = role.equipsData[i];
			this.equips[i].model = role;
			this.equips[i].data = element.item;
			this.equips[i].showItemEffect();
			if (element.item.configID == 0) {
				this.equips[i].setItemImg(i >= 8 ? 'role_25' : ResDataPath.GetEquipDefaultIcon(i));
			}
		}

		let subRole = role.GetSubRoleData()
		// this.roleShowPanel.Set(DressType.WING, subRole)
		// this.roleShowPanel.Set(DressType.ARM, subRole)
		// this.roleShowPanel.Set(DressType.ROLE, subRole)
		this.roleShowPanel.creatAnim(subRole);
		this.totalPower.text = GlobalConfig.jifengTiaoyueLg.st100094 + role.power
	}

	EquipPointConstConfig: any;
	setEquipPoint(role: Role, isOther: boolean = false) {
		if (this.EquipPointConstConfig == null)
			this.EquipPointConstConfig = GlobalConfig.ins("EquipPointGrowUpConfig");
		var config = GlobalConfig.equipPointBasicConfig;
		for (var i = 0; i < 4; i++) {
			let zhuzaiData = role.zhuZaiData[i]
			if (zhuzaiData.lv) {

				var temp = this.EquipPointConstConfig[zhuzaiData.id][zhuzaiData.lv]
				if (temp)
					this.zhuzaiArr[i].nameTxt.text = temp.rank +  GlobalConfig.jifengTiaoyueLg.st100103;
				// this.zhuzaiArr[i].nameTxt.text = zhuzaiData.lv + "级"
			}
			else {
				this.zhuzaiArr[i].nameTxt.text = (config[i + 1].activationLevel / 1000 >> 0) + GlobalConfig.jifengTiaoyueLg.st100104;
			}
			let [img, bgImg] = ZhuzaiEquip.GetBgIconByData(zhuzaiData)
			this.zhuzaiArr[i].setItemImg(img)
			this.zhuzaiArr[i].setItemBg(bgImg)
			this.zhuzaiArr[i].showZhuZaiItemEffect(temp);
			if (!isOther)
				this.zhuzaiArr[i].IsShowRedPoint(zhuzaiData.canLevelup() || zhuzaiData.canAdvance())
		}
	}

	updataEquip() {
		this.setEquip(this.GetRoleData());
		this.setEquipPoint(this.GetRoleData(), true);
	}

	private GetRoleData(): Role {
		return this.m_Context.mRoleData[this.m_RoleSelectPanel.curRole]
	}

	public UpdateContent(): void {
		for (var i = 0; i < this.zhuzaiArr.length; i++) {
			this.zhuzaiArr[i].visible = this.m_Context.mActorData.actorData.level >= 80;
			this.zhuzaiArr[i].count.text = ""
		}
		this.updataEquip();
		GameLogic.ins().SendGetOtherPlayerInfo(UserReadPlayer.ins().actorId, this.m_RoleSelectPanel.curRole)
	}

	m_RoleSelectPanel: RoleSelectPanel
}
window["TrRoleInfoPanel"] = TrRoleInfoPanel