class MapViewBg extends egret.Sprite {
	lastUpdateX: number;
	lastUpdateY: number;

	thumbnail: eui.Image;

	_imageList: Array<any>;

	// isThumbnailComplete: boolean;
	mapName: string
	maxImagX: number;
	maxImagY: number;

	IMG_SIZE:number = 512;//256


	public constructor() {
		super();

		this.lastUpdateX = 0;
		this.lastUpdateY = 0;
		this.touchChildren = false;
		this.touchEnabled = false;

		this._imageList = [];

	}

	private dispose() {
		for (let i = 0; i < this._imageList.length; i++) {
			if (this._imageList[i] == null) continue;
			for (let j = 0; j < this._imageList[i].length; j++) {
				if (this._imageList[i][j]) {
					// ResMgr.ins().destroyRes(this._imageList[i][j].source);
					DisplayUtils.dispose(this._imageList[i][j]);
					this._imageList[i][j] = null;
				}
			}
		}

		// DisplayUtils.disposeAll(this.thumbnail);
		this._imageList = [];
		this.removeChildren();
		// if(this.thumbnail)
		// 	ResMgr.ins().destroyRes(this.thumbnail.source);
		this.thumbnail = null;
	}

	public onThumbnailComplete(e) {
		// this.isThumbnailComplete = true;
		this.updateHDMap({ x: this.lastUpdateX, y: this.lastUpdateY }, true);
	}

	public initThumbnail(w, h, fName) {
		if (this.mapName != fName) {
			this.dispose();
			this.thumbnail = new eui.Image();
			this.addChild(this.thumbnail);
			// this.thumbnail.addEventListener(egret.Event.COMPLETE, this.onThumbnailComplete, this);
			// this.isThumbnailComplete = false;
		}
		if (this.thumbnail == null)
			return null;
		this.mapName = fName;
		this.thumbnail.width = w;
		this.thumbnail.height = h;
		this.thumbnail.source = fName+"_jpg";//ResDataPath.GetMapThumbnailPath(this.mapName)
		var imgSize = this.IMG_SIZE;
		this.maxImagX = Math.ceil(w / imgSize);
		this.maxImagY = Math.ceil(h / imgSize);
		this.updateHDMap({ x: this.lastUpdateX, y: this.lastUpdateY }, true);
	}

	public updateHDMap(point: any, force: boolean = false) {
		if (force || Math.abs(this.lastUpdateX - point.x) > this.IMG_SIZE / 4 || Math.abs(this.lastUpdateY - point.y) > this.IMG_SIZE / 4 || this.lastUpdateX == 0) {
			this.lastUpdateX = point.x;
			this.lastUpdateY = point.y;
			// if (!this.isThumbnailComplete)
			// 	return;

			var ww = StageUtils.ins().getWidth();
			var hh = StageUtils.ins().getHeight();
			var imgX = Math.max(Math.floor(-point.x / this.IMG_SIZE), 0);
			var imgY = Math.max(Math.floor(-point.y / this.IMG_SIZE), 0);
			var imgXCount = imgX + Math.floor(ww / this.IMG_SIZE) + 1;
			var imgYCount = imgY + Math.floor(hh / this.IMG_SIZE) + 1;
			for (var i = imgX; i <= imgXCount && i < this.maxImagX; i++) {
				for (var j = imgY; j <= imgYCount && j < this.maxImagY; j++) {
					let sourceName = ResDataPath.GetMapPath(this.mapName, i, j)
					this._imageList[j] = this._imageList[j] || [];
					var s:eui.Image = this._imageList[j][i] || new eui.Image();//ObjectPool.pop("eui.Image");
					if (s.source != sourceName) {
						s.source = sourceName;
						// egret.log("加载地图："+sourceName);
						s.name = sourceName;
						s.x = i * this.IMG_SIZE;
						s.y = j * this.IMG_SIZE;
						s.width = this.IMG_SIZE;
						s.height = this.IMG_SIZE;
						this._imageList[j][i] = s;
						ResMgr.ins().saveMap(this.mapName,sourceName);
					}
					if (!s.parent)
						this.addChild(s);
				}
			}

			// if(this.thumbnail)
			// {
			// 	ResMgr.ins().destroyRes(this.thumbnail.source);
			// 	this.thumbnail.source = null;
			// 	this.thumbnail = null;
			// }

		}
	}
}
window["MapViewBg"]=MapViewBg