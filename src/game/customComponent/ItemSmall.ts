//
class ItemSmall extends eui.Component {

	public constructor() {
		super();
		this.skinName = "ItemSmallSkin";
	}

	private imgIcon: eui.Image;
	imgBg: eui.Image;
	imgBottom: eui.Image;
	private imgJob: eui.Image;
	private effect: MovieClip;
	redPoint: eui.Image;

	public ResetScale() {
		if (this.imgIcon) {
			this.imgIcon.scaleX = this.imgIcon.scaleY = 1
		}
	}

	public setItemImg(imgName: string): void {
        this.imgIcon.source = imgName
	}

	public setItemBg(imgName: string): void {
		this.imgBg.source = imgName
	}

	public setJobImg(imgName: string): void {
        this.imgJob.source = imgName
	}

	public isShowJob(visible: boolean): void {
		this.imgJob.visible = visible
	}

	public setImgBottom(imgName: string): void {
        this.imgBottom.source = imgName
	}

	public showImgBottom(visible: boolean): void {
		this.imgBottom.visible = visible
	}

	public showRedPoint(visible: boolean): void {
		this.redPoint.visible = visible
	}

	public setData(config: any): void {
		if (config != null) {
			this.imgIcon.source = ResDataPath.GetItemFullName(config.icon);
			this.imgBg.source = ResDataPath.GetItemQualityName(config.quality)

			this.imgJob.source = (config.type == 0 || config.type == 4 || config.type == 5 || config.type == 6) && config.job && this.imgJob.visible ? JobItemIconConst[config.job] : ResDataPath.EMPTY_STR;
			
			if (GlobalConfig.clientGlobalConfig.effectItems.indexOf(config.id) >= 0) {
				if (this.effect == null) {
					this.effect = new MovieClip;
					this.effect.x = 35;
					this.effect.y = 35;
					this.addChildAt(this.effect, 2);
					this.effect.addEventListener(egret.Event.ADDED_TO_STAGE, this.resumePlay, this);
				}
				var eName = ResDataPath.GetItemQualityEffeName(config.quality);
				this.effect.loadUrl(ResDataPath.GetUIEffePath(eName), true);
				//修改lxh 内存回收
				// this.effect.loadFile(ResDataPath.GetItemQualityEffeName(config.quality), true);
			} else if (this.effect != null) {
				// this.effect.clearCache();
				DisplayUtils.dispose(this.effect);
				this.effect = null;
			}
		} else {
			this.imgIcon.source = ResDataPath.EMPTY_STR;
			this.imgBg.source = ResDataPath.DEFAULT_QUALITY;
			this.imgJob.source = ResDataPath.EMPTY_STR;
			if (this.effect != null) {
				// this.effect.clearCache();
				DisplayUtils.dispose(this.effect);
				this.effect = null;
			}
		}
	}

	private resumePlay(): void {
		if(this.effect)
			this.effect.play(-1);
	}
}
window["ItemSmall"]=ItemSmall