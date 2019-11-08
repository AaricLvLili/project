class GameApp {
	main;
	private cfgSuffix: string = "";
	/** 是否资源加载完成*/
	public static IsLoadComplete: boolean = false;
	private type: string = "json";
	public constructor(thisObj) {

		this.main = thisObj;
		var groupName = "preload";
		// var subGroups = [];
		// ResourceUtils.ins().loadGroups(groupName, subGroups, this.onResourceLoadComplete, this.onResourceLoadProgress, this);
		this.type = Main.isDebug ? "json" : "zz";
		var suffix = Main.isDebug ? "" : "_zz";
		if (LocationProperty.urlParam["iosiddd"] != null) {
			groupName = "ios";
			this.cfgSuffix = "ios_";
		}
		else {
			groupName = "preload";
			this.cfgSuffix = "";
		}

		egret.log("读取配置表" + groupName + " 后缀：" + suffix);
		ResourceUtils.ins().loadGroups("basepreload", [groupName + suffix, "basepreload"], this.advanceData, this.onResourceLoadProgress, this);
	}

	/** 加载必备资源完成*/
	public onResBase(): void {
		// ResourceUtils.ins().loadGroups("basepreload", [], this.onResourceLoadComplete, this.onResourceLoadProgress, this);
	}

	/**
     * 资源组加载完成
     */
	public onResourceLoadComplete() {
		egret.log("资源组加载完成");
		GameApp.IsLoadComplete = true;
		// this.init();
		this.callbackFun(this.main);
	};
	public callbackFun(thisObj) {
	};

	private advanceData() {
		this.init();
		let str = [];
		for (var i = 0; i < 3; i++) {
			let job = parseInt(LocalStorageData.getItem(LocalDataKey.job + "_" + i));
			let sex = parseInt(LocalStorageData.getItem(LocalDataKey.sex + "_" + i)) || 0;
			let zhuangbei4 = parseInt(LocalStorageData.getItem(LocalDataKey.zhuangbei4 + "_" + i)) || 0;
			let zhuangbei0 = parseInt(LocalStorageData.getItem(LocalDataKey.zhuangbei0 + "_" + i)) || 0;
			let zhuanzhiLv = parseInt(LocalStorageData.getItem(LocalDataKey.zhuanzhiLv + "_" + i)) || 0;
			let mountLv = parseInt(LocalStorageData.getItem(LocalDataKey.mountLv + "_" + i)) || 1;
			let zhuangBanId = GlobalConfig.ins("ZhuangBanId");
			if (i == 0 && !job) {
				job = 1;
			}
			if (!job) {
				break;
			}
			let roleRes = "";
			if (zhuangbei4 > 0) {
				let resName = zhuangBanId[zhuangbei4].res;
				roleRes = ResDataPath.GetBodyName01(resName, sex)
			}
			else if (zhuangbei0 > 0) {
				let resName = zhuangBanId[zhuangbei0].res;
				roleRes = ResDataPath.GetBodyName01(resName, sex)
			}
			else if (zhuanzhiLv > 0) {
				let transferAppearanceConfig = GlobalConfig.ins("TransferAppearanceConfig")[job][zhuanzhiLv];
				if (transferAppearanceConfig) {
					let res = transferAppearanceConfig.bodyAppearance
					roleRes = ResDataPath.GetBodyName01(res, sex)
				}
			} else {
				roleRes = ResDataPath.GetBodyName01(ResDataPath.GetDefaultBodyName(job, 0), sex)
			}

			str = this.geAdvanceDatatList(str, ResDataPath.GetRoleBodyPath(roleRes), 4);
			let mountsLevelConfig = GlobalConfig.ins("MountsLevelConfig")[mountLv];
			if (mountsLevelConfig) {
				str = this.geAdvanceDatatList(str, ResDataPath.GetMountBodyPath(mountsLevelConfig.appearance), 4)
			}
		}
		let guanqiaId = parseInt(LocalStorageData.getItem(LocalDataKey.guanqiaId + "_")) || 1;
		let chaptersConfig = GlobalConfig.ins("ChaptersConfig")[guanqiaId]
		let monsterId = chaptersConfig.waveMonsterId;
		if (monsterId) {
			let avatar = GlobalConfig.ins("MonstersConfig")[monsterId].avatar;
			str = this.geAdvanceDatatList(str, ResDataPath.GetMonsterBodyPath(avatar))
		}
		let bossId = chaptersConfig.bossId;
		if (bossId) {
			let avatar = GlobalConfig.ins("MonstersConfig")[bossId].avatar;
			str = this.geAdvanceDatatList(str, ResDataPath.GetMonsterBodyPath(avatar))
		}
		let sid = chaptersConfig.sid;
		if (sid) {
			let mapName = GlobalConfig.ins("ScenesConfig")[sid].mapfilename;
			let baseUrl = ResDataPath.ROOT_MAP + mapName + "/image/"
			for (var i = 0; i < 3; i++) {
				for (var f = 0; f < 3; f++) {
					let mapUrl = baseUrl + i + "_" + f + ".jpg";
					str.push(mapUrl);
				}
			}
		}
		this.maxNum = str.length;
		for (var i = 0; i < str.length; i++) {
			this.onGetResByUrl(str[i]);
		}
	}

	private geAdvanceDatatList(str, avatar, num = 3) {
		for (var i = 0; i < num; i++) {
			let state = "s";
			switch (i) {
				case 0:
					state = "s"
					break;
				case 1:
					state = "r"
					break;
				case 2:
					state = "a"
					break;
				case 3:
					state = "c"
					break;
			}
			for (var f = 0; f < 2; f++) {
				let lei = "json";
				switch (f) {
					case 0:
						lei = "json";
						break;
					case 1:
						lei = "png";
						break;
				}
				for (var k = 0; k < 2; k++) {
					let direction = 1;
					switch (k) {
						case 0:
							direction = 1;
							break;
						case 1:
							direction = 3;
							break;
					}
					str.push(avatar + "_" + direction + state + "." + lei);
				}
			}
		}
		return str;
	}
	private maxNum = 0;
	private nowNum = 0;
	private onGetResByUrl(name: string) {
		let data = RES.getResByUrl(name, this.onAdvanceDataLoadComplete, this)
	}
	private onAdvanceDataLoadComplete(evt) {
		this.nowNum++;
		GameLoadingView.m_Instance.removeTime();
		GameLoadingView.m_Instance.ShowLoadProgress2(this.nowNum, this.maxNum);
		if (this.nowNum == this.maxNum) {
			this.onResourceLoadComplete();
		}
	}
    /**
     * 初始化函数
     */
	public init() {
		// GameLoadingView.ShowLoadProgress(90, "初始化数据")
		// let a = egret.getTimer();
		//全局配置数

		// let config1Zip = new JSZip(RES.getRes("config1_" + this.cfgSuffix + "zz"));
		// GlobalConfig.config1 = JSON.parse(config1Zip.file("config.json").asText());
		// 
		// let config2Zip = new JSZip(RES.getRes("config2_" + this.cfgSuffix + "zz"));
		// GlobalConfig.config2 = JSON.parse(config2Zip.file("config.json").asText());


		// let config3Zip = new JSZip(RES.getRes("config3_" + this.cfgSuffix + "zz"));
		// GlobalConfig.config3 = JSON.parse(config3Zip.file("config.json").asText());

		// let config4Zip = new JSZip(RES.getRes("config4_" + this.cfgSuffix + "zz"));
		// GlobalConfig.config4 = JSON.parse(config4Zip.file("config.json").asText());

		// var b = RES.destroyRes("config1_" + this.cfgSuffix + "zz");
		// b = RES.destroyRes("config2_" + this.cfgSuffix + "zz");
		// b = RES.destroyRes("config3_" + this.cfgSuffix + "zz");
		// b = RES.destroyRes("config4_" + this.cfgSuffix + "zz");

		// var b = RES.destroyRes("config1_" + this.cfgSuffix + "json");
		// b = RES.destroyRes("config2_" + this.cfgSuffix + "json");
		// b = RES.destroyRes("config3_" + this.cfgSuffix + "json");
		// b = RES.destroyRes("config4_" + this.cfgSuffix + "json");

		if (Main.isDebug) {
			GlobalConfig.config1 = RES.getRes("config1_" + this.cfgSuffix + this.type);
			GlobalConfig.config2 = RES.getRes("config2_" + this.cfgSuffix + this.type);
			GlobalConfig.config3 = RES.getRes("config3_" + this.cfgSuffix + this.type);
			GlobalConfig.config4 = RES.getRes("config4_" + this.cfgSuffix + this.type);

			GlobalConfig.config5 = RES.getRes("config5_" + this.cfgSuffix + this.type);
			GlobalConfig.config6 = RES.getRes("config6_" + this.cfgSuffix + this.type);
			GlobalConfig.config7 = RES.getRes("config7_" + this.cfgSuffix + this.type);
			GlobalConfig.config8 = RES.getRes("config8_" + this.cfgSuffix + this.type);
			GlobalConfig.config9 = RES.getRes("config9_" + this.cfgSuffix + this.type);
			GlobalConfig.config10 = RES.getRes("config10_" + this.cfgSuffix + this.type);
		}
		else {
			let config1Zip = new JSZip(RES.getRes("config1_" + this.cfgSuffix + "zz"));
			GlobalConfig.config1 = JSON.parse(config1Zip.file("config.json").asText());

			let config2Zip = new JSZip(RES.getRes("config2_" + this.cfgSuffix + "zz"));
			GlobalConfig.config2 = JSON.parse(config2Zip.file("config.json").asText());

			let config3Zip = new JSZip(RES.getRes("config3_" + this.cfgSuffix + "zz"));
			GlobalConfig.config3 = JSON.parse(config3Zip.file("config.json").asText());

			let config4Zip = new JSZip(RES.getRes("config4_" + this.cfgSuffix + "zz"));
			GlobalConfig.config4 = JSON.parse(config4Zip.file("config.json").asText());


			let config5Zip = new JSZip(RES.getRes("config5_" + this.cfgSuffix + "zz"));
			GlobalConfig.config5 = JSON.parse(config5Zip.file("config.json").asText());

			let config6Zip = new JSZip(RES.getRes("config6_" + this.cfgSuffix + "zz"));
			GlobalConfig.config6 = JSON.parse(config6Zip.file("config.json").asText());

			let config7Zip = new JSZip(RES.getRes("config7_" + this.cfgSuffix + "zz"));
			GlobalConfig.config7 = JSON.parse(config7Zip.file("config.json").asText());

			let config8Zip = new JSZip(RES.getRes("config8_" + this.cfgSuffix + "zz"));
			GlobalConfig.config8 = JSON.parse(config8Zip.file("config.json").asText());
			let config9Zip = new JSZip(RES.getRes("config9_" + this.cfgSuffix + "zz"));
			GlobalConfig.config9 = JSON.parse(config9Zip.file("config.json").asText());

			let config10Zip = new JSZip(RES.getRes("config10_" + this.cfgSuffix + "zz"));
			GlobalConfig.config10 = JSON.parse(config10Zip.file("config.json").asText());
		}


		var temp = egret.setTimeout(() => {
			egret.clearTimeout(temp);
			RES.destroyRes("config1_" + this.cfgSuffix + this.type);
			RES.destroyRes("config2_" + this.cfgSuffix + this.type);
			RES.destroyRes("config3_" + this.cfgSuffix + this.type);
			RES.destroyRes("config4_" + this.cfgSuffix + this.type);
			RES.destroyRes("config5_" + this.cfgSuffix + this.type);
			RES.destroyRes("config6_" + this.cfgSuffix + this.type);
			RES.destroyRes("config7_" + this.cfgSuffix + this.type);
			RES.destroyRes("config8_" + this.cfgSuffix + this.type);
			RES.destroyRes("config9_" + this.cfgSuffix + this.type);
			RES.destroyRes("config10_" + this.cfgSuffix + this.type);
		}, this, 10000)

		// let b = egret.getTimer();
		// Main.errorBack(`配置表初始化：${(b-a)}`);

		//地图网格初始化
		GameMap.init();

	};
    /**
     * 资源组加载进度
     */
	public onResourceLoadProgress(itemsLoaded, itemsTotal) {
		// let p = (itemsLoaded / itemsTotal)
		// console.log(p + "loading ... ")
		GameLoadingView.m_Instance.ShowLoadProgress(itemsLoaded, itemsTotal, "资源加载");
	};
}

window["GameApp"] = GameApp