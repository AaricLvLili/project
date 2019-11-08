class CreateRoleView extends BaseEuiView {

	public static LAYER_LEVEL = LayerManager.UI_Main;
	public static startTime: number;

	public constructor() {
		super();
		this.skinName = "CreateRolSkin";
		this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
	}

	private onAddToStage() {
		this.removeEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
		CreateRoleView.startTime = egret.getTimer();
		StatisticsUtils.isSetdata = true;
		StatisticsUtils.setPhpLoading(1);
		this.onConfigComplete();
	}

	public onConfigComplete() {
		this.onLoaded();
	}

	private onLoaded() {
		SdkMgr.setExtData(SdkMgr.extDataType_5);
		this.openView();
	}

	private dice: eui.Button = null;
	private nameInput: eui.TextInput = null;
	private curBtn: eui.Button = null;
	private listH: number = 0;
	private readonly startIdx: number = 3;

	private btnBoy: eui.RadioButton
	private btnGirl: eui.RadioButton
	private job: number
	private sex: number

	private selectBg: eui.Image
	private roleList: Array<number> = [JobConst.ZhanShi, JobConst.FaShi, JobConst.DaoShi]
	private groupRole: eui.Group
	public groupEff: eui.Group;
	/**注意由于不能禁止点击特效（_mc测试不能禁止点击）所以弄的点击区域 特效会导致点击范围错误*/
	public m_TouchScope: eui.Rect;

	private _mc: MovieClip

	public m_RoleImg: eui.Image;
	private dbObject: any;
	public static isOpen: boolean = false;
	public static localJob: number;
	public static localSex: number;
	public openView(): void {
		if (window["__RemoveBg"])
			window["__RemoveBg"]();

		this.sex = 0
		RoleMgr.ins().sendRandomName(this.sex);

		this.nameInput.maxChars = 6;
		/**注意由于不能禁止点击特效_mc所以弄的点击区域 特效会导致点击范围错误 */
		this.m_TouchScope.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClick, this);
		this.dice.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClick, this);
		//this.selectGroup.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClick, this);
		this.btnBoy.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClick, this);
		this.btnGirl.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClick, this);
		this.nameInput.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClick, this);
		GameGlobal.MessageCenter.addListener(MessageDef.RANDOEM_NAME, this.setName, this);

		this.btnGirl.selected = false
		this.btnBoy.selected = true
		this._updateContent(1)

		this._saveSource()
		CreateRoleView.isOpen = true;
	}
	private _saveSource(): void {
		if (!this._mc) {
			this._mc = new MovieClip
		}
		this._mc.x = this.groupEff.width / 2
		this._mc.y = this.groupEff.height / 2 - 10
		this._mc.loadUrl(ResDataPath.GetUIEffePath("eff_btn_star"), true, -1)
		this._mc.touchEnabled = false;/**不知道为啥没效果 父级禁止点击子对象也没效果 */
		this.groupEff.addChildAt(this._mc, -1);

	}

	private _updateContent(id, changeSex = false) {
		if (this.job == id && !changeSex) {
			return
		}
		let self = this
		this.job = id
		// if (SdkMgr.isWxGame()) {
		this.m_RoleImg.visible = true;
		// for (let i = 0; i < self.roleList.length; ++i) {
		// 	let item = self[`btn${i + 1}`] as eui.Button
		// 	item.icon = `btn_${i + 1}_${self.sex}_${self.roleList[i]}_png`
		// }
		this.m_RoleImg.source = "createRole_" + this.sex + this.job + "_png";

		// }
		// else {
		// 	this.m_RoleImg.visible = false;
		// 	if (this.dbObject) {
		// 		this.dbObject.destroy();
		// 	}
		// 	if (this.sex != null && this.job != null) {
		// 		this.dbObject = DBUIManager.createDBAnim(this.groupRole, "eff_role_" + this.sex + this.job, this, 0);
		// 		this.dbObject.playTimeScale(0.7);
		// 	}
		// }
	}

	// private releaseDb() {
	// 	if (this.dbObject) {
	// 		this.dbObject.destroy();
	// 		this.dbObject = null;
	// 	}
	// 	DBCharacterMgr.getIns().release();
	// }

	public close(): void {
		super.close();
		this.m_TouchScope.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onClick, this);
		this.dice.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onClick, this);
		this.nameInput.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onClick, this);
		//this.selectGroup.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onClick, this);
		this.btnBoy.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onClick, this);
		this.btnGirl.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onClick, this);
		this.removeEvents();
		MessageCenter.ins().removeAll(this);
		if (this._mc) {
			DisplayUtils.dispose(this._mc)
			this._mc = null;
		}
		// this.releaseDb();
	}

	/** 按钮点击*/
	public onClick(e) {
		let item
		switch (e.currentTarget) {
			case this.m_TouchScope:
				this.sendCreateRole();
				// SoundManager.ins().stopBg();
				StatisticsUtils.setPhpClick(3);
				break;
			case this.dice:
				// var lastStr: string = this.curBtn.name.substring(this.curBtn.name.length - 2, this.curBtn.name.length - 1);
				// RoleMgr.ins().sendRandomName(parseInt(lastStr));
				RoleMgr.ins().sendRandomName(this.sex);
				StatisticsUtils.setPhpClick(1);
				break;
			case this.nameInput:
				StatisticsUtils.setPhpClick(2);
				break;
			case this.btnBoy:
				if (this.sex == 0) return
				this._changeSex(0)
				break;
			case this.btnGirl:
				if (this.sex == 1) return
				this._changeSex(1)
				break;
			default:
				break;
		}
	}
	private _changeSex(id): void {
		this.sex = id
		RoleMgr.ins().sendRandomName(this.sex);
		this._updateContent(this.job, true)
		//this._playRoleImgAni()
	}


	/** 请求创角*/
	private sendCreateRole(): void {
		let aa = this.nameInput.text
		let content: string = this.nameInput.text.trim();
		if (content == null || content == "") {
			alert("名称不能为空");//名称不能为空
			return;
		}
		if (StringUtils.isSpecialCharacter(content)) {
			alert("姓名不能含有特殊字符");//姓名不能含有特殊字符
			return;
		}

		if (StringUtils.isEmojiCharacter(content)) {
			alert("姓名含有表情符号");//姓名含有表情符号
			return;
		}
		CreateRoleView.localJob = this.job;
		CreateRoleView.localSex = this.sex;
		function createSend() {
			RoleMgr.ins().sendCreateRole(this.nameInput.text, //角色名字
				this.sex,// parseInt(sex),//性别0男1女，
				this.job,// parseInt(job),//职业1战2法3道
				0, //头像
				0, //阵营
				"" //平台
			);
		}

		// if (SdkMgr.isWxGame())
		// 	WxSdk.ins().checkMsg(content, createSend.bind(this));
		// else
			createSend.bind(this)();
	}

	/** 服务器返回随机名字*/
	public setName(str) {
		this.nameInput.text = str;
		GameLogic.ins().actorModel.name = str;
	}
}

ViewManager.ins().reg(CreateRoleView, LayerManager.UI_Main);
window["CreateRoleView"] = CreateRoleView