class ChaosBattleModel {
	public constructor() {
	}
	private static s_instance: ChaosBattleModel;
	public static get getInstance(): ChaosBattleModel {
		if (!ChaosBattleModel.s_instance) {
			ChaosBattleModel.s_instance = new ChaosBattleModel();
		}
		return ChaosBattleModel.s_instance;
	}
	/**排行榜数据 */
	public rankDic: Dictionary<ChaosBattleRankData> = new Dictionary<ChaosBattleRankData>();
	/**剩余开启时间 */
	public openTime: number = 0;
	/**结束时间 */
	public endTime: number = 0;
	public myRankNum: number = 0;
	public myPoint: number = 0;
	/**层次领取奖励状态 */
	public layerAwardData: number[] = [1, 1, 1, 1, 1, 1, 1, 1, 1];
	/**死亡时间 */
	public deathTime: number = 0;

	/**当前层数 */
	public nowLayer: number = 1;

	/**到达过的最高层数 */
	public maxLayer: number = 0;

	/**被击杀的名字 */
	public killName: string = "";
	/**第一个登顶的名字 */
	public firstTopPlayer: string = "";
	/**第一个击杀顶层boss的名字 */
	public firstTopKillBoss: string = "";
	/**攻击对象的id */
	public atkTager: number = 0;
	/**受击对象的id列表 */
	public deAtkTager: number[] = [];
	/**战功 */
	public battlePoint: number = 0;
	/**积分 */
	public point: number = 0;
	// /**积分id */
	// public _nowPointId: number = 1;
	public pointList: number[] = [];
	/**可以攻击的目标数据 */
	public roleDic: Dictionary<ChaosBattleTagerData> = new Dictionary<ChaosBattleTagerData>();

	public isDead: boolean = false;

	public addRoleData(data: Sproto.actor_info[]) {
		let idData = [];
		for (var i = 0; i < this.roleDic.values.length; i++) {
			let roleData = this.roleDic.values[i];
			if (roleData.isRole) {
				idData.push(roleData.id)
			}
		}
		for (var i = 0; i < idData.length; i++) {
			this.roleDic.remove(idData[i])
		}
		for (var i = 0; i < data.length; i++) {
			let roleData = new ChaosBattleTagerData();
			roleData.id = data[i].dbid;
			roleData.name = data[i].name;
			roleData.isRole = true;
			this.roleDic.set(roleData.id, roleData);
		}
	}

	public addBossData(data: Sproto.boss_info[]) {
		let idData = [];
		for (var i = 0; i < this.roleDic.values.length; i++) {
			let roleData = this.roleDic.values[i];
			if (!roleData.isRole) {
				idData.push(roleData.id)
			}
		}
		for (var i = 0; i < idData.length; i++) {
			this.roleDic.remove(idData[i])
		}
		for (var i = 0; i < data.length; i++) {
			let roleData = new ChaosBattleTagerData();
			roleData.id = data[i].handle;
			roleData.isRole = false;
			this.roleDic.set(roleData.id, roleData);
		}
	}


	public setRankDic(data: Sproto.sorce_info[]) {
		this.rankDic.clear();
		for (var i = 0; i < data.length; i++) {
			let renkData = new ChaosBattleRankData();
			renkData.rankNum = i + 1;
			renkData.setData(data[i]);
			this.rankDic.set(i + 1, renkData);
		}
	}

	public checkRedPoint() {
		if (this.openTime) {
			if ((this.openTime - GameServer.serverTime) < 0 && Deblocking.Check(DeblockingType.TYPE_91, true) && (this.endTime - GameServer.serverTime) > 0) {
				return true;
			}
		}
		return false;
	}
	public get nowPointId(): number {
		if (this.pointList[0] != null && this.pointList[0] == 0) {
			return 1;
		}
		for (var i = 0; i < this.pointList.length; i++) {
			if (this.pointList[i] == 1) {
				return (i + 1);
			} else if (this.pointList[i] == 2 && this.pointList[i + 1] != null && this.pointList[i + 1] == 0) {
				return (i + 2);
			} else if (this.pointList[i] == 2 && this.pointList[i + 1] == null) {
				return (i + 1);
			}
		}
		return 1;
	}

	public release() {
		this.roleDic.clear();
		this.atkTager = null;
		this.deAtkTager = [];
		this.deathTime = 0;
	}

	public getDis(charMonster: CharMonster) {
		if (charMonster) {
			var myBaseRole: CharRole = EntityManager.ins().getMyBaseRole();
			if (myBaseRole) {
				let dis = MathUtils.getDistance(myBaseRole.x, myBaseRole.y, charMonster.x, charMonster.y);
				return dis;
			}
		}
		return 10000;
	}

	public resultRelease() {
		this.firstTopPlayer = "";
		this.firstTopKillBoss = "";
		this.battlePoint = 0;
		this.point = 0;
		this.release();
	}
}
window["ChaosBattleModel"] = ChaosBattleModel