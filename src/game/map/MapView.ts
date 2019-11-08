class MapView extends egret.DisplayObjectContainer {
	public constructor() {
		super();
	}

	_stepIndex
	_mapImage: MapViewBg;
	_dropLayer: egret.DisplayObjectContainer;
	_entityLayer: egret.DisplayObjectContainer;
	_bloodLayer: BloodView;
	_shapeContainer;
	_shape: egret.Shape;

	public get dropLayer(): egret.DisplayObjectContainer {
		return this._dropLayer;
	}

	public get entityLayer(): egret.DisplayObjectContainer {
		return this._entityLayer;
	}

	public initMap() {
		this._stepIndex = {};
		this._mapImage = new MapViewBg();

		if (DEBUG) {
			this.touchEnabled = true;
			this.touchChildren = true;
			this._mapImage.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onGridClick, this);
			this._mapImage.touchEnabled = true
		}

		this.addChild(this._mapImage);
		this._dropLayer = new egret.DisplayObjectContainer;
		this.addChild(this._dropLayer);
		this._entityLayer = new egret.DisplayObjectContainer;
		this.addChild(this._entityLayer);
		this._bloodLayer = new BloodView;
		this.addChild(this._bloodLayer);
		DropHelp.init(this._dropLayer);
		//定时排序实体层
		TimerManager.ins().doTimer(500, 0, this.sortEntity, this);
		//监听实体移动时间
		MessageCenter.addListener(GameLogic.ins().postMoveEntity, this.moveEntity, this);
		MessageCenter.addListener(GameLogic.ins().postMoveCamera, this.lookAt, this);
	};
	public sortEntity() {
		this._entityLayer.$children.sort(this.sortF);
	};
	public sortF(d1, d2) {
		if (d1.y > d2.y) {
			return 1;
		}
		else if (d1.y < d2.y) {
			return -1;
		}
		else {
			return 0;
		}
	};
	public addEntity(entity: egret.DisplayObject, num = 100): void {
		this._entityLayer.addChildAt(entity, num);
	};
	public checkEntityAlpha(obj: egret.Event) {
		var thisObject: MapView = this["this"];
		var entity: CharMonster = this['entity'];
		var sx = Math.floor(entity.x / GameMap.CELL_SIZE);
		var sy = Math.floor(entity.y / GameMap.CELL_SIZE);
		entity.alpha = GameMap.checkAlpha(sx, sy) ? 0.7 : 1;
		if (entity == EntityManager.ins().getNoDieRole()) {
			thisObject.lookAt();
		}
	};
    /**
     * 移动实体
     */
	public moveEntity(param) {
		var entity: CharMonster = param[0];
		var path: AStarNode[] = param[1];
		if (path && path.length) {
			this._stepIndex[entity.hashCode] = path.length - 1;
			this.moveNextStep(entity, path);
		}
		else {
			entity.playAction(EntityAction.STAND);
		}
	};
	public moveNextStep(entity: CharMonster, path: AStarNode[]) {
		// var _this = this;
		egret.Tween.removeTweens(entity);
		if (this._stepIndex[entity.hashCode] < 0) {
			entity.moveTween = null
			entity.playAction(EntityAction.STAND);
			return;
		}
		//每秒200像素的移动速度
		var moveSpeed = entity.moveSpeed / 1000;
		var node = path[this._stepIndex[entity.hashCode]];
		var nextPoint = new egret.Point(node.nX * GameMap.CELL_SIZE + (GameMap.CELL_SIZE >> 1), node.nY * GameMap.CELL_SIZE + (GameMap.CELL_SIZE >> 1));
		var xbX = nextPoint.x - entity.x;
		var xbY = nextPoint.y - entity.y;
		var xb = Math.sqrt(xbX * xbX + xbY * xbY);
		entity.dir = node.nDir;
		entity.playAction(EntityAction.RUN);
		var t = egret.Tween.get(entity, {
			"onChange": this.checkEntityAlpha,
			"onChangeObj": { "this": this, "entity": entity },
		});
		t.to({
			"x": nextPoint.x,
			"y": nextPoint.y
		}, xb / moveSpeed).call(() => {
			this._stepIndex[entity.hashCode]--;
			this.moveNextStep(entity, path);
		}, this);
		entity.moveTween = t
	};
    /**
     * Handles the click event on the GridView. Finds the clicked on cell and toggles its walkable state.
     */
	public onGridClick(event) {
		var role = EntityManager.ins().getNoDieRole();
		if (role == null || role.isHardStraight)
			return;
		// console.log("onGridClick", role, event.localX, event.localY);
		GameMap.moveEntity(role, event.localX, event.localY);
	};
	public lookAt(): void {
		var role = EntityManager.ins().getNoDieRole();
		if (role == null) {
			return;
		}
		this.x = -Math.min(Math.max(role.x - (StageUtils.ins().getWidth() >> 1), 0), GameMap.MAX_WIDTH - StageUtils.ins().getWidth());
		this.y = -Math.min(Math.max(role.y - 50 - (StageUtils.ins().getHeight() >> 1), 0), GameMap.MAX_HEIGHT - StageUtils.ins().getHeight()) - MapView.CAMERA_HEI;
		if (this._mapImage) {
			this._mapImage.updateHDMap(this);
		}
		else {
			Main.errorBack("MapView lookAt _mapImage=null mapId=" + GameMap.fubenID + " " + GameMap.fbName);
		}
	};
	public static CAMERA_HEI: number = 0;
	public looAtTween(): void {
		var role = EntityManager.ins().getNoDieRole();
		if (role == null)
			return;
		var tx = -Math.min(Math.max(role.x - (StageUtils.ins().getWidth() >> 1), 0), GameMap.MAX_WIDTH - StageUtils.ins().getWidth());
		var ty = -Math.min(Math.max(role.y - 50 - (StageUtils.ins().getHeight() >> 1), 0), GameMap.MAX_HEIGHT - StageUtils.ins().getHeight()) - MapView.CAMERA_HEI;
		var t = egret.Tween.get(this, {
			"onChange": this.tweenSyncFun,
			"onChangeObj": this
		});
		t.to({ x: tx, y: ty }, 300).call(() => {
			egret.Tween.removeTweens(this)
		});
	};
	public tweenSyncFun() {
		this._mapImage.updateHDMap(this);
	};
    /**
     * 切换地图会清除场景上的所有显示
     */
	public changeMap() {
		// 移除震屏动画
		// egret.Tween.removeTweens(this)
		if (MapView.DRAW_GRID)
			this.drawGrid();
		else if (this._shapeContainer && this._shapeContainer.parent)
			this.removeChild(this._shapeContainer);
		this._mapImage.initThumbnail(GameMap.MAX_WIDTH, GameMap.MAX_HEIGHT, GameMap.getFileName());
		this.x = -Math.min(Math.max(GameMap.mapX - (StageUtils.ins().getWidth() >> 1), 0), GameMap.MAX_WIDTH - StageUtils.ins().getWidth());
		this.y = -Math.min(Math.max(GameMap.mapY - 50 - (StageUtils.ins().getHeight() >> 1), 0), GameMap.MAX_HEIGHT - StageUtils.ins().getHeight()) - MapView.CAMERA_HEI;
		this._mapImage.updateHDMap(this, true);
	};
    /**
     * Draws the given grid, coloring each cell according to its state.
     */
	public drawGrid() {
		var rect = this._shape || new egret.Shape();
		this._shapeContainer = this._shapeContainer || new egret.DisplayObjectContainer();
		this._shapeContainer.cacheAsBitmap = true;
		this._shapeContainer.touchEnabled = false;
		this._shapeContainer.touchChildren = false;
		rect.graphics.clear();
		rect.graphics.lineStyle(0.1);
		var maxX = GameMap.COL;
		var maxY = GameMap.ROW;
		for (var i = 0; i < maxX; i++) {
			for (var j = 0; j < maxY; j++) {
				if (GameMap.checkAlpha(i, j))
					rect.graphics.beginFill(0x00ff00, 0.3);
				else if (GameMap.checkWalkable(i, j))
					rect.graphics.beginFill(0xcccccc, 0.3);
				else
					rect.graphics.beginFill(0xf87372, 0.3);
				rect.graphics.drawRect(i * GameMap.CELL_SIZE, j * GameMap.CELL_SIZE, GameMap.CELL_SIZE, GameMap.CELL_SIZE);
				rect.graphics.endFill();
				var text = new eui.Label();
				text.size = 12;
				text.text = i + "," + j;
				text.x = i * GameMap.CELL_SIZE;
				text.y = j * GameMap.CELL_SIZE;
				this._shapeContainer.addChild(text);
			}
		}
		this._shapeContainer.addChild(rect);
		this.addChild(this._shapeContainer);
		this._shape = rect;
	};
	public clearBloodLayer() {
		this._bloodLayer.removeChildren();
	};
	public static DRAW_GRID = false;
}
window["MapView"] = MapView