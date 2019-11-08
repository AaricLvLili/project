class ResVersionManager extends BaseClass {

    private resVersionData: {[key: string]: number}
    private tempDict: {[key: string]: number} = {}

	public constructor() {
		super();
        this.resVersionData = window["verData"]
		this.res_loadByVersion();
	}

	public static ins() {
        return super.ins.call(this);
    };

    private _GetVer(fullName: string): number {
        if (fullName == null || fullName.length == 0 || this.resVersionData == null) {
            return 0
        }
        let code = this.tempDict[fullName]
        if (code == null) {
            let array = fullName.split("/")
            let dict: any = this.resVersionData
            for (let value of array) {
                dict = dict[value]
                if (dict == null) {
                    break
                }
            }
            if (dict == null || typeof(dict) != "number") {
                code = 0
            } else {
                code = dict
            }
            this.tempDict[fullName] = code
        }
        return code
    }

    /**
     * Res加载使用版本号的形式
     */
    public res_loadByVersion  () {
        // let loadLocal = Main.isDebug
        // if (loadLocal) {
        //     RES.web.Html5VersionController.prototype.getVirtualUrl = (url) => {
        //         var strArr = euiextension.DropDownList.resData.split("=");
        //         return (url.indexOf(".exml") ? strArr[1] : "") + url;
        //     };
        // } else {
        //     let resVersionData = this.resVersionData
        //     let resUrl = LocationProperty.resAdd
        //     if (resUrl == null || resUrl.length == 0) {
        //         resUrl = Const.RES_URL
        //     }
        //     RES.web.Html5VersionController.prototype.getVirtualUrl = (url) => {
        //         if (url.lastIndexOf("http") == -1) {
        //             var version = 0;
        //             if (url.indexOf("resource/assets/map/") != -1) {
        //                 let name = "resource/assets/map/"+url.split("/")[3]+"/small.jpg"
        //                 version = this._GetVer(name)
        //             } else {
        //                 version = this._GetVer(url)
        //             }
        //             // url = resUrl + version + "/" + url//有版本号控制
        //             //暂时没有版本号
        //             url = resUrl + url
        //         } else {
        //             url = resUrl + url
        //         }
        //         // egret.log("const+"+Const.RES_URL + "---url:"+url);
        //         return url
        //     }
        // }
    };
    /**
     * 加载资源版本号配置文件
     * @param url 配置文件路径
     * @param complateFunc 加载完成执行函数
     * @param complateFuncTarget 加载完成执行函数所属对象
     */
    // public loadConfig  (url, complateFunc, complateFuncTarget) {
    //     this.complateFunc = complateFunc;
    //     this.complateFuncTarget = complateFuncTarget;
    //     RES.getResByUrl(url, this.loadResVersionComplate, this);
    // };
    /**
     * 配置文件加载完成
     * @param data
     */
    // public loadResVersionComplate  (data) {
    //     ResVersionManager.resVersionData = data;
    //     this.complateFunc.call(this.complateFuncTarget);
    // };

	// static resVersionData: any;
	// complateFunc: any;
	// complateFuncTarget: any;
}
window["ResVersionManager"]=ResVersionManager