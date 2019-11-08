class SimpleMovieClip extends egret.DisplayObjectContainer implements IResObject {

	private isStopped = true
	lastTime
	playTimes

	private frameIntervalTime = 0.125
	private passedTime = 0
	private nextFrameNum = 0

	private m_Bitmap: egret.Bitmap
	private m_Texture: egret.Texture[]
	private m_Urls: string[]

	public constructor(urls: string[]) {
		super()
		this.m_Texture = []
		this.m_Urls = urls
		this.frameIntervalTime = 1 / urls.length * 1000
		this.nextFrameNum = 0
		this.m_Bitmap = new egret.Bitmap

		this.addChild(this.m_Bitmap)

		// let analyzer = RES.getAnalyzer(RES.ResourceItem.TYPE_IMAGE)
		for (let url of urls) {
			// let obj = analyzer.getRes(url)
			let obj = RES.getRes(url)
			if (!obj) {
				RES.getResByUrl(url, this._OnLoaded, this, RES.ResourceItem.TYPE_IMAGE)
			} else {
				this._OnLoaded(obj, url)
			}
		}
	}
    
	private _OnLoaded(obj, path: string) {
		if (!obj) {
			return
		}
		for (let i = 0; i < this.m_Urls.length; ++i) {
			if (this.m_Urls[i] == path) {
				this.m_Texture[i] = obj
				break
			}
		}
	}

	private advanceTime(timeStamp: number): boolean {
		let self = this;

		let advancedTime: number = timeStamp - self.lastTime;
		self.lastTime = timeStamp;

		let frameIntervalTime: number = self.frameIntervalTime;
		let currentTime = self.passedTime + advancedTime;
		self.passedTime = currentTime % frameIntervalTime;

		let num: number = currentTime / frameIntervalTime;
		if (num < 1) {
			return false;
		}
		while (num >= 1) {
			num--;
			let frame = this.nextFrameNum++
			// _Log("----------------------", frame)
			let texture = this.m_Texture[frame % this.m_Urls.length]
			if (texture) {
				this.m_Bitmap.texture = texture
			}
		}
		return false;
	}

	$onAddToStage(stage: egret.Stage, nestLevel: number): void {
		super.$onAddToStage(stage, nestLevel);
		this.setIsStopped(false);
	}

	/**
	 * @private
	 *
	 */
	$onRemoveFromStage(): void {
		super.$onRemoveFromStage();
		this.setIsStopped(true);
	}

	private setIsStopped(value: boolean) {
		if (this.isStopped == value) {
			return;
		}
		this.isStopped = value;
		if (value) {
			// egret.sys.$ticker.$stopTick(this.advanceTime, this);
			egret.stopTick(this.advanceTime,this);
		} else {
			this.playTimes = this.playTimes == 0 ? 1 : this.playTimes;
			this.lastTime = egret.getTimer();
			// egret.sys.$ticker.$startTick(this.advanceTime, this);
			egret.startTick(this.advanceTime,this);
		}
	}

	public OnResUnload(): boolean {
		this.setIsStopped(true);
		for (let url of this.m_Urls) {
			SimpleResMgr.DestroyRes(url)
		}
		this.m_Urls = []
		this.m_Texture = []
		this.m_Bitmap = new egret.Bitmap
		return true
	}
}
window["SimpleMovieClip"]=SimpleMovieClip