/** 人物残影动画*/
class GhostShadow extends egret.DisplayObjectContainer {
	public constructor() {
		super();
		// if(taget.bodyCon==null ||taget.bodyCon.$bitmapData == null) return;
		// var t = taget.bodyCon.movieClipData.getTextureByFrame(taget.bodyCon.currentFrame);

		// var renderTexture: egret.RenderTexture = new egret.RenderTexture();
		// renderTexture.drawToTexture(taget.bodyCon, new egret.Rectangle(-taget.bodyCon.width / 2 + taget.bodyCon.x, -taget.bodyCon.height + taget.bodyCon.y , taget.bodyCon.width, taget.bodyCon.height + 60));

		// bmp.texture = renderTexture;

		// bmp.alpha = 1;

		// var mc = <MovieClip>taget.bodyCon.getChildAt(1)
		// if(mc.movieClipData == null) 
		// return;
		// var tempTexture = mc.movieClipData.getTextureByFrame(mc.currentFrame);
		// var o :any = mc.movieClipData.frames[mc.currentFrame-1];


		// public isPixelClick(stageX: number,stageY: number): Boolean
		// {
		//     // this.globalToLocal(stageX,stageY,this._clickPoint);
		//     this._tempTexture = this._mc.movieClipData.getTextureByFrame(this._mc.currentFrame);

		//     //
		//     var renderTexture: egret.RenderTexture = new egret.RenderTexture();
		//     renderTexture.drawToTexture(this._mc,new egret.Rectangle(this._tempTexture._offsetX,this._tempTexture._offsetY,this._tempTexture.textureWidth,this._tempTexture.textureHeight));
		//     // var nums3: Array<number> = renderTexture.getPixel32(this._clickPoint.x - this._tempTexture._offsetX,this._clickPoint.y - this._tempTexture._offsetY);

		// }
	}

	/** 播放残影*/
	public start(taget: CharMonster): void {
		var bmp = this.getBtm();
		var mc: MovieClip;
		var poX: number = 0;
		var poY: number = 0;
		var bodyCon :egret.DisplayObjectContainer = taget.getBodyCon;
		for (var i: number = 0; i < bodyCon.numChildren; i++) {
			if (bodyCon.getChildAt(i) instanceof MovieClip) {
				mc = <MovieClip>bodyCon.getChildAt(i);
				if (mc.movieClipData != null && mc.currentFrame) {
					var tempTexture = mc.movieClipData.getTextureByFrame(mc.currentFrame);
					var o: any = mc.movieClipData.frames[mc.currentFrame - 1];
					if (o.x < poX)
						poX = o.x;
					if (o.y < poY)
						poY = o.y;
				}
			}
		}

		bmp.x = taget.x + bodyCon.x + poX - (bodyCon.width / 2 * 0.3) + 7;
		bmp.y = taget.y + bodyCon.y + poY - (bodyCon.height * 0.3) + 4;

		var renderTexture: egret.RenderTexture = new egret.RenderTexture();
		renderTexture.drawToTexture(bodyCon, new egret.Rectangle(poX, poY, bodyCon.width, bodyCon.height));
		bmp.texture = renderTexture;
		if(taget.parent){
			// taget.dir>=4?  taget.parent.addChildAt(bmp, taget.parent.getChildIndex(taget)-1) : taget.parent.addChild(bmp);
			taget.dir!=0?  taget.parent.addChildAt(bmp, taget.parent.getChildIndex(taget)-1) : taget.parent.addChild(bmp);
		}	
		else {
			ObjectPool.ins().push(this);
			return;
		}
		egret.Tween.get(bmp).to({ alpha: 0 }, 1000).call(function (b: egret.Bitmap) {
			egret.Tween.removeTweens(bmp);
			b.texture.dispose();
			b.parent.removeChild(b);
			b.alpha = 1;
			ObjectPool.ins().push(this);
		}, this, [bmp]);
	}

	private bit: egret.Bitmap;
	private getBtm(): egret.Bitmap {
		if (this.bit == null) {
			this.bit = new egret.Bitmap();
			this.bit.scaleX = this.bit.scaleY = 1.3;
			var colorMatrix = [
				0, 0, 0, 0, 0,// red
				0, 0, 0, 0, 0, // green
				0, 0, 95, 0, 0, // blue
				0, 0, 0, 1, 0// alpha
			];
			var colorFlilter: egret.ColorMatrixFilter = new egret.ColorMatrixFilter(colorMatrix);
			this.bit.filters = [colorFlilter];
		}
		return this.bit;
	}
}
window["GhostShadow"]=GhostShadow