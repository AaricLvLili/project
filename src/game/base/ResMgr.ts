class ResMgr extends BaseClass {
	public resList: {} = {};
	private objList: {} = {};
	private mapList: Array<Object> = [];
	private monsterList: Array<Object> = [];
	private wingList: Array<Object> = [];
	private weaponList: Array<Object> = [];
	private roleList: Array<Object> = [];
	private textureJsonDataList: {} = {};
	private loadingList: {} = {};
	public pool: {} = {};
	private cacheNum: number = 6;
	private _isLog: boolean = false;
	// private textureList:{} = {};
	public static ins(): ResMgr {
		return super.ins();
	}
	constructor() {
		super();
	}

	public clearConfig():void{
		// if (!Main.isDebug) {
		// 	TimerManager.ins().doTimer(20000, 0, this.testCheck, this);
		// }
		// TimerManager.ins().doTimer(60000, 0, this.testCheck, this);
	}

	public getCache(key: string): any {
		return this.pool[key];
	}

	public setCache(key: string, data: any): void {
		this.pool[key] = data;
	}

	public delCache(key: string): void {
		delete this.pool[key];
	}

	private testCheck(): void {

		// this.memoryWarning();
		if(1==1) return ;
		// egret.log("--------------start--------------");
		// egret.log("当前缓存怪物数量："+this.monsterList.length);
		// egret.log("当前缓存地图数量："+this.mapList.length);
		// egret.log("--------------end--------------");

		// egret.log(`当前其他玩家数量：${EntityManager.ins().getCharDummyLen()}`);
		if (UserFb.ins().guanqiaID > 0) {
			let isComp = this.destroyConfig(GlobalConfig.ins("ChaptersConfig"), UserFb.ins().guanqiaID);
			if (isComp) {
				TimerManager.ins().remove(this.testCheck, this);
			}
		}
	}

	public saveLoadingRes(resName: string) {
		this.loadingList[resName] = resName;
	}

	public clearLoadingRes() {
		for (var key in this.loadingList) {
			if (this._isLog) {
				var b = RES.destroyRes(key);
				delete this.loadingList[key];
				egret.log("释放登录资源[" + key + "]=" + b);
			}
			else {
				RES.destroyRes(key);
				delete this.loadingList[key];
			}
		}
		if (RES.destroyRes("createrole")) {
			console.log(`destroty createrole res`)
		}
		GameLogic.ins().sendReadyComple();
	}

	/**除主角外只缓存6个人*/
	public saveRole(rolePath: string, fileName: string) {
		var index: number = this.hasRoleRes(fileName);
		if (index != -1) {
			this.roleList[index]["time"] = egret.getTimer();
			this.roleList[index][rolePath] = rolePath;
		}
		else {
			var obj: Object = { "time": egret.getTimer(), "roleName": fileName };
			obj[rolePath] = rolePath;
			this.roleList.push(obj);

			if (this.roleList.length > 7) {
				this.roleList.sort(this.sort);
				var delObj: Object = this.roleList.pop();
				if (this._isLog) {
					egret.log("销毁：" + delObj["roleName"]);
				}
				this.clear(delObj, "roleName");
			}
		}
	}
	/**除主角外只缓存6个人*/
	public saveWing(wingPath: string, fileName: string) {
		var index: number = this.hasWingRes(fileName);
		if (index != -1) {
			this.wingList[index]["time"] = egret.getTimer();
			this.wingList[index][wingPath] = wingPath;
		}
		else {
			var obj: Object = { "time": egret.getTimer(), "wingName": fileName };
			obj[wingPath] = wingPath;
			this.wingList.push(obj);

			if (this.wingList.length > this.cacheNum) {
				this.wingList.sort(this.sort);
				var delObj: Object = this.wingList.pop();
				if (this._isLog) {
					egret.log("销毁：" + delObj["wingName"]);
				}
				this.clear(delObj, "wingName");
			}
		}
	}

	/**除主角外只缓存6个人*/
	public saveWeapon(weaponPath: string, fileName: string) {
		var index: number = this.hasWeaponRes(fileName);
		if (index != -1) {
			this.weaponList[index]["time"] = egret.getTimer();
			this.weaponList[index][weaponPath] = weaponPath;
		}
		else {
			var obj: Object = { "time": egret.getTimer(), "weaponName": fileName };
			obj[weaponPath] = weaponPath;
			this.weaponList.push(obj);

			if (this.weaponList.length > this.cacheNum) {
				this.weaponList.sort(this.sort);
				var delObj: Object = this.weaponList.pop();
				if (this._isLog) {
					egret.log("销毁：" + delObj["weaponName"]);
				}
				this.clear(delObj, "weaponName");
			}
		}
	}

	/**只缓存20只怪物*/
	public saveMonster(monsterPath: string, fileName: string) {
		var index: number = this.hasMonsterRes(fileName);

		if (index != -1) {
			this.monsterList[index]["time"] = egret.getTimer();
			this.monsterList[index][monsterPath] = monsterPath;
		}
		else {
			var obj: Object = { "time": egret.getTimer(), "monsterName": fileName };
			obj[monsterPath] = monsterPath;
			this.monsterList.push(obj);

			if (this.monsterList.length > 4) {
				this.monsterList.sort(this.sort);
				var delObj: Object = this.monsterList.pop();
				if (this._isLog) {
					egret.log("销毁：" + delObj["monsterName"]);
				}
				this.clearMonster(delObj);
			}
		}
	}
	/**内存预警，大幅度销毁释放内存，否则会导致闪退或者异常关闭*/
	public memoryWarning():void{
		egret.log(`内存预警................`);
		// WarnWin.show("内存预警了...",()=>{},this);
		this.monsterList.sort(this.sort);
		while(this.monsterList.length > 2){
			let delObj: Object = this.monsterList.pop();
			if (this._isLog) {
				egret.log("销毁：" + delObj["monsterName"]);
			}
			this.clearMonster(delObj);
		}

		this.mapList.sort(this.sort);
		while(this.mapList.length > 1){
			let delObj: Object = this.mapList.pop();
			if (this._isLog) {
				egret.log("销毁地图：" + delObj["mapName"]);
			}
			this.clearMap(delObj);
		}

		this.roleList.sort(this.sort);
		while(this.roleList.length > 3){
			let delObj: Object = this.roleList.pop();
			if (this._isLog) {
				egret.log("销毁角色：" + delObj["roleName"]);
			}
			this.clear(delObj, "roleName");
		}

		this.weaponList.sort(this.sort);
		while(this.weaponList.length > 3){
			let delObj: Object = this.weaponList.pop();
			if (this._isLog) {
				egret.log("销毁武器：" + delObj["weaponName"]);
			}
			this.clear(delObj, "weaponName");
		}
		this.wingList.sort(this.sort);
		while(this.wingList.length > 3){
			let delObj: Object = this.wingList.pop();
			if (this._isLog) {
				egret.log("销毁翅膀：" + delObj["wingName"]);
			}
			this.clear(delObj, "wingName");
		}

	}	

	private hasMonsterRes(monsterName: string): number {
		var len: number = this.monsterList.length;
		var obj: Object = null;
		for (var i: number = 0; i < len; i++) {
			obj = this.monsterList[i];
			if (obj["monsterName"] == monsterName)
				return i;
		}
		return -1;
	}

	private hasRoleRes(roleName): number {
		var len: number = this.roleList.length;
		var obj: Object = null;
		for (var i: number = 0; i < len; i++) {
			obj = this.roleList[i];
			if (obj["roleName"] == roleName)
				return i;
		}
		return -1;
	}

	private hasWingRes(wingName): number {
		var len: number = this.wingList.length;
		var obj: Object = null;
		for (var i: number = 0; i < len; i++) {
			obj = this.wingList[i];
			if (obj["wingName"] == wingName)
				return i;
		}
		return -1;
	}

	private hasWeaponRes(weaponName): number {
		var len: number = this.weaponList.length;
		var obj: Object = null;
		for (var i: number = 0; i < len; i++) {
			obj = this.weaponList[i];
			if (obj["weaponName"] == weaponName)
				return i;
		}
		return -1;
	}

	private hasMapRes(mapName: string): number {
		var len: number = this.mapList.length;
		var obj: Object = null;
		for (var i: number = 0; i < len; i++) {
			obj = this.mapList[i];
			if (obj["mapName"] == mapName)
				return i;
		}
		return -1;
	}
	/**缓存3张地图，如重复使用*/
	public saveMap(mapName: string, mapFile: string) {
		var index: number = this.hasMapRes(mapName);
		if (index != -1) {
			this.mapList[index]["time"] = egret.getTimer();
			// this.mapList[index]["mapName"] = mapName;
			this.mapList[index][mapFile] = mapFile;
		}
		else {
			var obj = { "time": egret.getTimer(), "mapName": mapName };
			this.mapList.push(obj);
			obj[mapFile] = mapFile;
			if (this.mapList.length > 3) {
				this.mapList.sort(this.sort);
				var delObj: Object = this.mapList.pop();
				if (this._isLog) {
					egret.log("销毁地图：" + delObj["mapName"]);
				}
				this.clearMap(delObj);
			}
		}
	}

	private sort(a, b) {
		return b.time - a.time;
	}

	private clear(obj: Object, keyName: string) {
		if (obj == null) return;
		var role = <CharRole>EntityManager.ins().getNoDieRole();
		if (role && role.infoModel) {
			var bodyName: string = role._fileName;
			var wingName: string = role._wingFileName;
			var weaponName: string = role._weaponFileName;
			if (obj[keyName] == bodyName || obj[keyName] == wingName || obj[keyName] == weaponName) {
				obj["time"] = egret.getTimer();
				return;
			}
		}
		for (var key in obj) {
			if (key == "time" || key == keyName)
				continue;
			if (this._isLog) {
				var b = RES.destroyRes(key + ".png");
				egret.log("释放[" + key + "]资源：" + b.toString());
			}
			else {
				RES.destroyRes(key + ".png");
			}
			this.delCache(key + ".png");
		}
	}

	private clearMonster(obj: Object) {
		if (obj == null) return;
		var mapType = GameMap.IsGuildCopy();
		for (var key in obj) {
			if (key == "time" || key == "monsterName")
				continue;

			if (mapType) {
				if (key.indexOf("monster20026") >= 0) {
					obj["time"] = egret.getTimer();
					this.monsterList.push(obj);
					break;
				}
			}
			if (this._isLog) {
				var b = RES.destroyRes(key + ".png");
				egret.log("释放[" + key + "]资源：" + b.toString());
			}
			else {
				RES.destroyRes(key + ".png");
			}
			this.delCache(key + ".png");
		}
	}

	private clearMap(obj: Object) {
		if (obj == null) return;
		var currMapName: string = GameMap.getFileName();

		for (var key in obj) {
			if (key == "time" || key == "mapName") continue;
			if (key.indexOf(currMapName) >= 0) {
				return;
			}
			else {
				if (this._isLog) {
					var b = RES.destroyRes(key);
					egret.log("释放[" + key + "]地图资源：" + b.toString());
				}
				else {
					RES.destroyRes(key);
				}
				this.delCache(key);
			}
		}
	}

	public delRes(url: string) {
		var info: ResInfo = ResMgr.ins().resList[url];
		delete ResMgr.ins().resList[url];
		info.dispose();
		info = null;
	}

	public destroyRes(file: any) {
		if (file == null) {
			egret.log("资源回收失败");
			return;
		}
		if (this._isLog) {
			var b = RES.destroyRes(file, false);
			egret.log("销毁资源：" + file + "--->" + b);
		}
		else {
			RES.destroyRes(file, false);
		}
	}

	/**
	 * 动态消耗无用配置数据
	*/
	public destroyConfig(config: any, id: any) {
		if (config == null) return;
		var minId = id - 10;
		var maxId = id + 500;
		var t = egret.getTimer();
		let a = true;
		for (var key in config) {
			if (config[key].cid < minId || config[key].cid > maxId) {
				a = false;
				if (this._isLog) {
					egret.log("删除数据：" + "第" + config[key].cid + "关 " + config[key].desc);
				}
				config[key] = null;
				delete config[key];
				if (egret.getTimer() - t > 5) {
					break;
				}
			}
		}
		return a;
	}
	private configList = [];
	private loadObject: any = null;
	private loading: boolean = false;
	public loadConfig(groupName: string, callback: Function): void {
		var loadTarget = {
			groupName: groupName,
			onComplte: callback
		};
		if (this.loadObject && this.loadObject.groupName == groupName || this.hasLoaded(loadTarget)) {
			// egret.log(`${this.loadObject.groupName} 已经加载了，或者正在加载`);
			return;
		}
		this.configList.push(loadTarget);
		if (this.loading) {
			egret.log(`正在加载[ ${this.loadObject.groupName} ]`);
			return;
		}
		this.loading = true;
		this.loadObject = this.configList.length ? this.configList.pop() : loadTarget;
		this.loadStart();
	}

	private hasLoaded(loadTarget): boolean {
		for (var i = 0; i < this.configList.length; i++) {
			let obj = this.configList[i];
			if (obj.groupName == loadTarget.groupName) {
				return true;
			}
		}
		return false;
	}

	private loadStart(): void {
		this.loading = true;
		RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onConfigCompleteHandle, this);
		RES.loadGroup(this.loadObject.groupName);
	}

	private onConfigLoadError(event: egret.IOErrorEvent): void {
		var target = event.currentTarget;
		egret.log(`target`);
	}

	private onConfigCompleteHandle(event: RES.ResourceEvent): void {
		RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onConfigCompleteHandle, this);
		var target = event.currentTarget;
		this.loadObject.onComplte(event.groupName);
		this.loading = false;
		if (this.configList.length) {
			this.loadObject = this.configList.pop();
			this.loadStart();
		}

	}

}
window["ResMgr"] = ResMgr