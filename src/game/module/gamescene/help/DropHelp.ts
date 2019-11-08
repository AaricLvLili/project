class DropHelp {
	static dropContainer: any;
	static starting: boolean;
	// static curTarget: any;
	static completeFunc: any;

	static m_DropData: {
		[key: number]: CharItem
	}

	static m_DropItem: { [key: number]: boolean } = {}

	public static init(parent) {
		this.dropContainer = parent;
		// MessageCenter.ins().addListener(MessagerEvent.CREATE_DROP, this.addDrop, this);
		MessageCenter.addListener(Encounter.postCreateDrop, this.addDrop, this);
	};
	public static start() {
		// TimerManager.ins().doTimer(100, 0, this.findDrop, this);
		TimerManager.ins().doTimer(100, 0, this.findDrop, this);
		//EntityManager.ins().stopMoveAll();
		this.starting = true;
	};
	public static stop() {
		TimerManager.ins().remove(this.findDrop, this);
		this.starting = false;
	};

	public static addDrop(arr, isEnd: boolean = true) {
		var x_Grid = arr[0], y_Grid = arr[1], itemData = arr[2];
		// console.log(x_Grid, y_Grid)
		if (this.itemPos[x_Grid + flag + y_Grid]) {
			return;
		}
		var charItem: CharItem = ObjectPool.ins().pop("CharItem");
		charItem.setData(itemData);
		charItem.tx = x_Grid;
		charItem.ty = y_Grid;
		var x_g = 0;
		var y_g = 0;
		var i = 0;
		var flag = "|";
		if (this.itemPos[x_Grid + flag + y_Grid] || !this._CheckWalkable(x_Grid, y_Grid)) {
			for (i = 0; i < this.orderX.length; i++) {
				x_g = x_Grid + this.orderX[i];
				y_g = y_Grid + this.orderY[i];
				if (this._CheckWalkable(x_g, y_g) == false)
					continue;
				if (this.itemPos[x_g + flag + y_g] == null)
					break;
			}
			//超过9个，第二圈用遍历
			if (i >= this.orderX.length) {
				var index = 2;
				var b = true;
				let tempCounter = 0
				while (b && ++tempCounter < 99) {
					for (var i_1 = x_Grid - index; i_1 < x_Grid + index && b; i_1++) {
						for (var j = y_Grid - index; j < y_Grid + index && b; j++) {
							x_g = i_1;
							y_g = j;
							if (this._CheckWalkable(x_g, y_g) == false)
								continue;
							if (this.itemPos[x_g + flag + y_g] == null)
								b = false;
						}
					}
					index++;
				}
				if (tempCounter > 99) {
					console.error("addDrop while error!!!")
				}
			}
		} else {
			x_g = x_Grid;
			y_g = y_Grid;
		}
		charItem.x = GameMap.CELL_SIZE * x_g + (GameMap.CELL_SIZE >> 1);
		charItem.y = GameMap.CELL_SIZE * y_g + (GameMap.CELL_SIZE >> 1);
		charItem.scaleX = charItem.scaleY = 0.3
		charItem.alpha = 0
		egret.Tween.removeTweens(charItem)
		let delay = Math.random() * 300
		egret.Tween.get(charItem).wait(delay).to({
			"scaleX": 1,
			"scaleY": 1,
			"alpha": 1,
		}, 100).call(() => {
			egret.Tween.removeTweens(charItem);
		});
		let tempy = charItem.y
		charItem.y = tempy - 10
		egret.Tween.get(charItem).wait(delay).to({
			"y": tempy,
		}, 150).call(() => {
			egret.Tween.removeTweens(charItem);
		});
		this.itemPos[x_g + flag + y_g] = charItem;
		if (this.dropContainer) {
			this.dropContainer.addChild(charItem);
			if (GameMap.fbType == UserFb.FB_TYPE_PERSONAL_BOSS || GameMap.fbType == UserFb.FB_TYPE_GUANQIABOSS || GameMap.fbType == UserFb.FB_TYPE_MATERIAL) {
				let len: number = this.dropContainer.numChildren;
				if (len >= UserFb.ins().rewardNum || isEnd == false) {
					this.timeOut = egret.setTimeout(this.autoFlyDrop, this, 500, isEnd);
				}
			}
		}
	};
	/** 清空掉落物 */
	public static clearDrop() {
		this.stop();
		this.itemPos = {};
		this.m_DropItem = {}
		this.m_DropData = {}
		// this.curTarget = null;
		if (this.dropContainer)
			this.dropContainer.removeChildren();
		this.completeFunc = null;
	};

	private static _MoveEntity(char: CharMonster, x: number, y: number) {
		if (GameMap.IsNoramlLevel()) {
			GameMap.moveEntity(char, x, y);
		} else {
			GameMap.moveEntity(char, x, y, true);
		}
	}

	private static _CheckWalkable(x: number, y: number): boolean {
		if (GameMap.IsNoramlLevel()) {
			return GameMap.checkWalkable(x, y)
		}
		return true
	}

	private static SingleDrop(charRole: CharRole) {
		if (!charRole || !charRole.infoModel) {
			return
		}
		let handle = charRole.infoModel.handle
		let dropData = DropHelp.m_DropData[handle]
		if (dropData) {
			// 如果在运动或者攻击，则等待完成
			if (charRole.action == EntityAction.RUN || charRole.atking) {
				return
			}

			if (MathUtils.getDistance(charRole.x, charRole.y, dropData.x, dropData.y) < Const.CELL_SIZE) {
				//拾取
				for (var i in this.itemPos) {
					if (this.itemPos[i].index == dropData.index) {
						delete this.itemPos[i];
						break;
					}
				}
				//拾取完成

				delete DropHelp.m_DropData[handle]
				delete DropHelp.m_DropItem[dropData.index]
				// DisplayUtils.removeFromParent(dropData);
				DisplayUtils.dispose(dropData);
				dropData = null;
			} else {
				if (charRole.action != EntityAction.RUN) {
					this._MoveEntity(charRole, dropData.x, dropData.y);
				}
			}
		} else {
			let xb = Number.MAX_VALUE;
			let target: CharItem;
			for (var i in this.itemPos) {
				let item = this.itemPos[i];
				// 正在被拾取
				if (this.m_DropItem[item.index]) {
					continue
				}
				//计算距离
				if (xb > MathUtils.getDistance(charRole.x, charRole.y, item.x, item.y)) {
					xb = MathUtils.getDistance(charRole.x, charRole.y, item.x, item.y);
					target = item;
				}
			}
			if (target) {
				DropHelp.m_DropData[handle] = target
				DropHelp.m_DropItem[target.index] = true
				this._MoveEntity(charRole, target.x, target.y);
				// 如果没有拾取的物品，就靠近正在拾取的对象
			} else {

				let nearTarget: CharRole = null
				let xb = Number.MAX_VALUE;
				for (let key in DropHelp.m_DropData) {
					let targetHandle = parseInt(key)
					if (handle == targetHandle) {
						continue
					}
					let element = <CharRole>EntityManager.ins().getEntityByHandle(targetHandle)
					if (element != null) {
						var value = MathUtils.getDistance(element.x, element.y, charRole.x, charRole.y);
						if (value > 2 * Const.CELL_SIZE && value < xb) {
							xb = value
							nearTarget = element
						}
					}
				}

				if (nearTarget != null) {
					if (2 * GameMap.CELL_SIZE < value) {
						var p = DirUtil.getGridByDir(nearTarget.dir + 1);
						let newPosx = nearTarget.x + p.x
						let newPosy = nearTarget.y + p.y
						if (!this._CheckWalkable(newPosx, newPosx)) {
							newPosx = nearTarget.x
							newPosy = nearTarget.y
						}
						this._MoveEntity(charRole, newPosx, newPosy);
					}
				}
			}
		}
		// for (let key in this.itemPos) {
		// 	// 有正在拾取的对象
		// 	return
		// }
		// this.stop();
		// if (this.completeFunc) {
		// 	this.completeFunc.func.call(this.completeFunc.funcThis);
		// 	this.completeFunc = null;
		// 	return;
		// }
		// if (GameMap.fubenID == 0) {
		// 	//普通挂机场景发送请求下一波怪
		// 	UserFb.ins().sendWaveComplete();
		// }
		// return true
	}

	/*普通场景拾取*/
	public static findDrop() {
		//普通挂机场景拾取处理
		if (GameMap.fubenID == 0&& !EntityManager.ins().checkHaveEnemy()) {

			for (let i = 0; i < SubRoles.ins().subRolesLen; ++i) {
				this.SingleDrop(EntityManager.ins().getMainRole(i));
			}

			// 有正在拾取的对象
			for (let key in this.itemPos) {
				return;
			}

			this.stop();
			if (this.completeFunc) {
				this.completeFunc.func.call(this.completeFunc.funcThis);
				this.completeFunc = null;
				return;
			}
			//普通挂机场景发送请求下一波怪
			UserFb.ins().sendWaveComplete();
		}
	}

	private static timeOut: number;
	/*副本场景自动飞拾取*/
	public static autoFlyDrop(isEnd: boolean = true): void {
		// egret.clearTimeout(this.timeOut);
		let objNum: number = 0;
		var flyX: number = 240;
		var flyY: number = 400;
		let newObjNum: number = 0;
		var role: CharMonster = EntityManager.ins().getNoDieRole();
		if (role) {
			flyX = role.x;
			flyY = role.y - 50;
		}
		for (let i in this.itemPos) {
			let charItem: CharItem = this.itemPos[i];
			if (charItem && !charItem.parent) {
				delete this.itemPos[i];
			}
		}
		for (let i in this.itemPos) {
			let charItem: CharItem = this.itemPos[i];
			let tween: egret.Tween = egret.Tween.get(charItem);
			objNum++;
			let rtime = MathUtils.limit(800, 1100);
			tween.to({
				x: flyX,
				y: flyY
			}, rtime, egret.Ease.backIn).call(() => {
				newObjNum++;
				// let newObjNum = charItem.index;
				// egret.Tween.removeTweens(charItem);
				// DisplayUtils.removeFromParent(charItem);

				delete DropHelp.m_DropData[charItem.hashCode]
				delete DropHelp.m_DropItem[charItem.index]
				// DisplayUtils.removeFromParent(dropData);
				DisplayUtils.dispose(charItem);
				charItem = null;
				if (newObjNum == objNum && isEnd) {
					this.itemPos = {};
					if (this.completeFunc) {
						this.completeFunc.func.call(this.completeFunc.funcThis);
						this.completeFunc = null;
					}
				}
			});
		}
	}

	// /**普通拾取*/
	// public static findDrop() {

	// 	for (let i = 0; i < SubRoles.ins().subRolesLen; ++i) {
	// 		this.SingleDrop(EntityManager.ins().getMainRole(i))
	// 	}
	// 	for (let key in this.itemPos) {
	// 		// 有正在拾取的对象
	// 		return
	// 	}
	// 	this.stop();
	// 	if (this.completeFunc) {
	// 		this.completeFunc.func.call(this.completeFunc.funcThis);
	// 		this.completeFunc = null;
	// 		return;
	// 	}

	// 	if (GameMap.fubenID == 0) {
	// 		//普通挂机场景发送请求下一波怪
	// 		UserFb.ins().sendWaveComplete();
	// 	}
	// };

	public static addCompleteFunc(f, funcThis) {
		this.completeFunc = { func: f, funcThis: funcThis };
	};
	/** 最后一个死亡的实体坐标 */
	public static tempDropPoint = new egret.Point();

	public static setTempDropPoint(x: number, y: number): void {
		DropHelp.tempDropPoint.x = x
		DropHelp.tempDropPoint.y = y
		// console.error("setTempDropPoint", x, y)
	}

	public static itemPos: { [key: number]: CharItem } = {};
    /**
     *  6   7   8
     *  5   0   1
     *  4   3   2
     */
	public static orderX = [-1, 1, -1, 0, 1, -1, 0, 1];
	public static orderY = [0, 0, 1, 1, 1, -1, -1, -1];
}

window["DropHelp"] = DropHelp