class MovieClip extends egret.MovieClip implements IResObject {

	_mcFactory: egret.MovieClipDataFactory = new egret.MovieClipDataFactory();
	_autoPlay: boolean;
	_playCount: number;
	_compFun: Function;
	_fileName: string;

	public mNotRemove: boolean

	public constructor() {
		super();
		this._mcFactory.enableCache = false;
		this.touchEnabled = false;
	}

	/**
     * 加载动画
     * @param fileName  文件名
     * @param autoPlay  是否自动播放
     * @param playCount 播放次数（有播放次数的情况下，播放完成后会自动移除舞台）
     * @param compFun   完成回调
     */
	public loadFile(fileName: string, autoPlay?: true, playCount?: number, compFun?: Function) {
		this._autoPlay = autoPlay;
		this._playCount = playCount || -1;
		this._compFun = compFun;
		this._fileName = fileName;
		this.m_Url = fileName;
		RES.getResAsync(this._fileName + "_json", this.createBody, this);
		RES.getResAsync(this._fileName + "_png", this.createBody, this);
	};

	public m_Url: string
	private bool = false;
	public loadUrl(fileName: string, autoPlay?: boolean, playCount?: number, compFun?: Function, isTimeOut = 0) {
		if (!fileName) {
			return
		}
		this._autoPlay = autoPlay;
		this._playCount = playCount || -1;
		this._compFun = compFun;
		this.bool = true;

		this.m_Url = fileName
		let splitIndex = fileName.lastIndexOf("/")
		if (splitIndex != -1) {
			this._fileName = fileName.substring(splitIndex + 1)
		}
		else {
			this._fileName = fileName
		}

		if (fileName.indexOf("movie/skillEff") >= 0) {//2051
			this.scaleX = this.scaleY = GameLogic.SKILL_EFF_SCALE;
		}
		//  ResMgr.ins().getRes(fileName,this);

		let obj01 = ResMgr.ins().getCache(fileName + ".png");
		if (!obj01) {
			obj01 = this._Load(fileName + ".png", RES.ResourceItem.TYPE_IMAGE, isTimeOut);
		}
		let obj02 = ResMgr.ins().getCache(fileName + ".json");
		if (!obj02) {
			obj02 = this._Load(fileName + ".json", RES.ResourceItem.TYPE_JSON, isTimeOut);
		}
		if (obj01 && obj02) {
			this.OnCreateBody(obj02, obj01);
		}

	};
	private currUrl: string;
	private _Load(url: string, type: string, timeOut: number): boolean {
		let obj = this._GetRes(url, type)
		if (!obj) {
			// RES.getResByUrl(url, this.createBodyByUrl, this)
			let time = egret.getTimer();
			RES.getResByUrl(url, (data, loadOverUrl) => {
				if (loadOverUrl) {
					if (this.m_Url + ".json" != loadOverUrl && this.m_Url + ".png" != loadOverUrl) {
						if (loadOverUrl.indexOf("body") >= 0) {
							this.clearCache();
						}
						return;
					}
				}
				if (egret.getTimer() - time > timeOut && timeOut != 0) {
					this.clearCache();
					return;
				}
				ResMgr.ins().setCache(loadOverUrl, data);
				this.OnCreateBody(this._GetRes(this.m_Url + ".json", RES.ResourceItem.TYPE_JSON), this._GetRes(this.m_Url + ".png", RES.ResourceItem.TYPE_IMAGE))

			}, this);
			return null
		}
		return obj
	}

	private _GetRes(url: string, type: string): any {
		// let analyzer = RES.getAnalyzer(type)
		// return analyzer.getRes(url)
		return RES.getRes(url)
	}

	public clearCache() {
		this._mcFactory.clearCache();
		this.scaleX = this.scaleY = 1;
		this.rotation = 0;
		this.movieClipData = null;
		this.x = this.y = 0;
		this.alpha = 1;
		this.visible = false;
		this.stop();
		TimerManager.ins().remove(this.playComp, this);
	};
    /**
     * 创建主体动画
     */
	public createBody(data, key) {
		if (key) {
			if (this._fileName + "_json" != key && this._fileName + "_png" != key)
				return;
		}
		this.OnCreateBody(RES.getRes(this._fileName + "_json"), RES.getRes(this._fileName + "_png"))
	}

	public createBodyByUrl(data, url): void {
		if (url) {
			if (this.m_Url + ".json" != url && this.m_Url + ".png" != url) {
				if (url.indexOf("body") >= 0) {
					this.clearCache();
					egret.log("加载完成回调" + url + "   当前加载" + this.m_Url);
				}
				return;
			}
		}
		this.OnCreateBody(this._GetRes(this.m_Url + ".json", RES.ResourceItem.TYPE_JSON), this._GetRes(this.m_Url + ".png", RES.ResourceItem.TYPE_IMAGE))

	}

	public OnCreateBody(mcJson: any, mcTexture: any, self: MovieClip = null): void {
		if (!mcJson || !mcTexture)
			return;
		if (self == null)
			self = this;
		self.visible = true;
		self._mcFactory.mcDataSet = mcJson;
		self._mcFactory.texture = mcTexture;
		self.movieClipData = self._mcFactory.generateMovieClipData(self._fileName);

		//自动播放
		if (self._autoPlay) {
			//从第一帧开始自动播放
			if (self.totalFrames > 0)
				self.gotoAndPlay(1, self._playCount);
			if (self._playCount > 0) {
				//监听播放次数完成
				//this.addEventListener(egret.MovieClipEvent.COMPLETE, this.playComp, this);
				egret.setTimeout(self.playComp, self, self.playTime * self._playCount, self);
				// TimerManager.ins().doTimer(self.playTime * self._playCount, 1, self.playComp, self);
			}
		}

		//抛出内容已经改变事件
		self.dispatchEventWith(egret.Event.CHANGE);
	}

    /**
     * 自动播放次数完成处理
     * @param e
     */
	public playComp(param) {
		// TimerManager.ins().remove(this.playComp, this);
		if (param._compFun) {
			param._compFun(param);
			param._compFun = null
		}
	};

	/** 播放总时长(毫秒) */
	public get playTime() {
		if (!this.movieClipData)
			return 0;
		return 1 / this.frameRate * this.totalFrames * 1000;
	}

	public OnResUnload(): boolean {
		if (this.m_Url) {
			return SimpleResMgr.DestroyRes(this.m_Url + ".png") && SimpleResMgr.DestroyRes(this.m_Url + ".json")
		}
		return false
	}
}
window["MovieClip"] = MovieClip