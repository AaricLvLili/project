class StartGamePreload extends egret.DisplayObjectContainer {//此类作废，wjh，主要没看出来有撒用
	
    private resCount = 0
    private resList: any[] = []

	public constructor() {
		super()
	}

	public AddComplete(obj: egret.DisplayObject) {
        if (obj == null) {
            return
        }
        ++this.resCount
        obj.addEventListener(egret.Event.COMPLETE, this._OnComplete, this)
        this.resList.push(obj)
    }

	public Close() {
		for (let obj of this.resList) {
            if (obj) {
                obj.removeEventListener(egret.Event.COMPLETE, this._OnComplete, this)
            }
        }
        this.resList = []
	}

	private _OnComplete() {
        if (--this.resCount == 0) {
            let img = new eui.Image
            img.source = "startgame1_bg_001_jpg"
            this.addChild(img)

			let img2 = new eui.Image
            img2.source = "ui_loding_di"
            this.addChild(img2)
        }
    }
}
window["StartGamePreload"]=StartGamePreload