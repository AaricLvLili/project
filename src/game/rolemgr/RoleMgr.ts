class RoleMgr extends BaseSystem {

	errorCode = ["",
		"sql错误",
		"用户没登陆",
		"游戏服务没准备好",
		"角色上一次保存数据是否出现异常",
		"客户端选择角色的常规错误",
		"角色名称重复",
		"角色不存在",
		"错误的性别",
		"随机生成的名字已经分配完",
		"客户端上传的角色阵营参数错误",
		"客户端上传的角色职业参数错误",
		"名称无效，名称中包含非法字符或长度不合法",
		"如果玩家是帮主，不能删除该角色，需要玩家退帮",
		"已经登陆到其他服务器",
		"已经超过最大可建角色数量"
	];

	// entering: eui.Label;


	public static CheckAccount = false
	public static Checking = false

	private m_FirstVerify = true
	private static _actorid = 0

	public static get actorid() {
		return RoleMgr._actorid;
	}
	public static set actorid(value) {
		LocalStorageData.setHashID(value + "");
		this._actorid = value;
	}

	public static actorname;

	public constructor() {
		super()

		this.sysId = PackageID.Login;
		Sproto.SprotoReceiver.AddHandler(S2cProtocol.checkAccountRet, this.doCheckAccount, this)
	}

	public static ins(): RoleMgr {
		return super.ins()
	}

    /**
     * 连接服务器
     * @param account
     */
	public connectServer(account, uid, passWord, serverID, ip) {
		GameSocket.ins().login(account, uid, passWord, serverID, ip);
		// StatisticsUtils.login();
	};
    /**
     * 处理登录认证
     * 255-1
     * @param bytes
     */
	public doCheckAccount(data: Sproto.checkAccountRet_request) {
		RoleMgr.Checking = false
		let result = data.result
		StartGetUserInfo.isUsa = String(data.ipRegion).indexOf("美国") != -1 || (LocationProperty.urlParam && LocationProperty.urlParam["iosiddd"] != null); //iosid不为空，一定是美国审核啦
		RoleMgr.CheckAccount = result == 0
		if (result == 0) {
			egret.log("验证成功")
			let QueryList = new Sproto.QueryList_request();
			GameSocket.ins().Rpc(C2sProtocol.QueryList, QueryList, this.doRoleList, this);
			GameGlobal.MessageCenter.dispatch(MessageDef.SOCKE_RENEECTED_SUCCESS)
		}
		else {
			egret.log("验证失败" + data.result)
			UserTips.ErrorTip("验证失败状态为：" + data.result);
			// this.startBtnEnable(true);
			// alert("Connect failed:" + RoleMgr.LONGIN_ERROR_CODE[result]);
			if (Main.instance.mStartView && Main.instance.mStartView.stage == null) //如果为空，添加到舞台
			{
				if (Main.instance)
					StageUtils.ins().getUIStage().addChild(Main.instance.mStartView);
			}
			// GameSocket.ins().close()
			//被顶号
			// if (result == 3) {
			// window["connectError"]();
			// }
		}
	};
    /**
     * 处理角色列表
     * 255-4
     * @param bytes
     */
	public doRoleList(data: Sproto.QueryList_response) {
		if (Const.IsLoadType01) {
			if (this.m_FirstVerify) {
				this.m_FirstVerify = false
				Main.CloseView()
				egret.log("角色列表", data.code)

				if (data.code) {
					RoleMgr.actorid = data.actorid
					// 有角色，开始加载资源
					Main.LoadResVersionComplate();
				} else {
					// 没有角色，进入创建界面
					if (GameLoadingView.m_Instance == null)
						GameLoadingView.m_Instance = new GameLoadingView(null)
					ResourceUtils.ins().loadGroup("createrole", this._onRoleResourceLoadComplete, this._onRoleResourceLoadProgress, this);
					// Main.AddCreateRoleView();
					// StatisticsUtils.create();
				}
			} else {
				if (data.code) {
					if (GameApp.IsLoadComplete)//在额外判断是否资源加载完成，在考虑是否请求登录服务器
						this.sendEnterGame(data.actorid);
				}
				else SceneManager.ins().runScene(CreateRoleScene);
			}
		} else {
			if (data.code) {
				if (GameApp.IsLoadComplete)
					this.sendEnterGame(data.actorid);
			}
			else {
				let name = LocationProperty.urlParam["crn"]
				name = decodeURI(name)
				let createRoleJobIndex = LocationProperty.urlParam["crji"]
				let sex = createRoleJobIndex % 2
				let job = Math.floor(createRoleJobIndex / 2) + 1
				// let sex = LocationProperty.urlParam["crs"]
				// let job = LocationProperty.urlParam["crj"]
				if (name != null && createRoleJobIndex != null) {
					console.log("创建初始角色中!!!")
					this.sendCreateRole(name, (sex), (job), 0, 0, "")
				} else {
					SceneManager.ins().runScene(CreateRoleScene);
				}
			}
		}
	};

	public static EnterGame() {
		if (RoleMgr.actorid == 0) {
			console.log("RoleMgr roleid == 0")
			return
		}
		RoleMgr.ins().sendEnterGame(RoleMgr.actorid)
	}

    /**
     * 请求进入游戏
     * 255-5
     */
	public sendEnterGame(actorID) {
		console.log("RoleMgr.sendEnterGame actor = ", actorID)
		let EnterGame = new Sproto.EnterGame_request();
		EnterGame.actorid = actorID;
		GameSocket.ins().Rpc(C2sProtocol.EnterGame, EnterGame, this.doEnterGame, this);

		// EasyLoading.ins().showLoading()
	};
    /**
     * 处理进入游戏
     * 255-5
     * @param bytes
     */
	public doEnterGame(data: Sproto.EnterGame_response) {
		switch (data.result) {
			case 0:
				//验证成功，正在登录游戏
				console.log("进入游戏成功");
				SceneManager.ins().runScene(MainScene);
				if (GuideUtils.ins().isShow()) {
					GuideUtils.ins().hide()
				}
				EntityManager.ins().removeAll();
				Encounter.ins().clearEncounterModel();
				TeamFbModel.getInstance.releaseTeamData();
				break;
			default:
				if (data.result == 4) {
					alert("帐号被封停，请联系客服QQ：" + Const.QQ);
				} else {
					alert("进入游戏错误码:" + data.result);
				}
				break;
		}
	};
    /**
     * 请求创建角色
     * 255-2
     * @param actorname
     * @param sex
     * @param job
     * @param head
     * @param camp
     * @param pf
     */
	public sendCreateRole(actorname, sex, job, head, camp, pf) {
		let CreateActor = new Sproto.CreateActor_request();
		CreateActor.actorname = actorname;
		CreateActor.sex = sex;
		CreateActor.job = job;
		CreateActor.icon = head;
		CreateActor.pf = pf;
		console.log('请求创建角色', WxSdk.ins().query)
		if (SdkMgr.isWxGame() && WxSdk.ins().query && WxSdk.ins().query.heId) {
			var n = Number(WxSdk.ins().query.heId)
			if (n) {
				CreateActor.inviteid = n;//
				CreateActor.imgurl = WxSdk.ins().imgURL//
				if (WxSdk.ins().query.imgtag) CreateActor.imgtag = WxSdk.ins().query.imgtag;//
				console.log('请求创建角色', CreateActor.inviteid, CreateActor.imgurl)
			}
		}
		GameSocket.ins().Rpc(C2sProtocol.CreateActor, CreateActor, this.doCreateRole, this);

	};
    /**
     * 处理创建角色
     * 255-2
     */
	public doCreateRole(data: Sproto.CreateActor_response) {
		if (data.result == 0) {
			RoleMgr.actorid = data.actorid
			if (CreateRoleView.isOpen) {
				LocalStorageData.setItem(LocalDataKey.job + "_" + 0, CreateRoleView.localJob + "")
				LocalStorageData.setItem(LocalDataKey.sex + "_" + 0, CreateRoleView.localSex + "")
			}
			if (Const.IsLoadType01) {
				console.log("创建完成，开始加载资源!!!")
				Main.LoadResVersionComplate();
			} else {
				console.log("创建完成，进入游戏!!!")
				this.sendEnterGame(data.actorid);
			}
			console.log("createRole id(%d)", data.actorid);
			if (GameLogic.ins().actorModel.actorID == 0) //没有id,先存储
				GameLogic.ins().actorModel.actorID = data.actorid;
			SdkMgr.setExtData(SdkMgr.extDataType_2);
			// ReportData.getIns().reportSDK("create_role");
			if (SdkMgr.isWxGame())
				WxSdk.ins().sdkRole();
		}
		else {
			if (!egret.is(SceneManager.ins().getCurrScene(), "CreateRoleScene")) {
				SceneManager.ins().runScene(CreateRoleScene);
			}
			this.showErrorTips(data.result);
		}
	};
    /**
     * 请求随机名字
     * 255-6
     * @param sex
     */
	public sendRandomName(sex) {
		let RandName = new Sproto.RandName_request();
		RandName.sex = sex;
		GameSocket.ins().Rpc(C2sProtocol.RandName, RandName, this.doRandom, this);
	};
    /**
     * 处理随即名字
     * 255-6
     * @param bytes
     */
	public doRandom(data: Sproto.RandName_response) {
		if (data.result == 0) {
			GameGlobal.MessageCenter.dispatch(MessageDef.RANDOEM_NAME, data.actorname);
			GameLogic.ins().actorModel.name = data.actorname;
			// this.setName(data.actorname);
		}
	};
	public hideLabel() {
		GameLoadingView.CloseLoad();
		DisplayUtils.dispose(GameLoadingView.m_Instance);
		// DisplayUtils.removeFromParent(this.entering);
	};
	public hideCommonLoadView() {
		GameLoadingView.CloseLoad();
		DisplayUtils.dispose(GameLoadingView.m_Instance);
	};

    /**
     * 弹出错误提示
     */
	public showErrorTips(result: number) {
		if (result == 0)
			return;
		console.warn("showErrorTips" + result)
		alert(RoleMgr.Create_Actor_Error(result))
	};

	static Create_Actor_Error(result) {
		let errList = [
			"",
			"角色不存在",
			"重复创建角色",
			"创建角色失败",
			"性别职业错误",
			"角色名称重复",
			"角色名含特殊字符",
			"角色名过长",
			"角色名含有屏蔽字",
			"角色名称重复",
		]
		return errList[result];
	}

	private _onRoleResourceLoadComplete(): void {
		egret.log("创建角色资源组加载完成");
		this.hideCommonLoadView()
		Main.AddCreateRoleView();
		StatisticsUtils.create();
	}
	private _onRoleResourceLoadProgress(itemsLoaded, itemsTotal): void {

		GameLoadingView.m_Instance.ShowLoadProgress(itemsLoaded, itemsTotal, "资源加载");
	}
}
window["RoleMgr"] = RoleMgr