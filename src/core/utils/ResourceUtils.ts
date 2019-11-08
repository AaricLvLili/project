/**
 * 资源加载工具类，
 * 支持多个resource.json文件加载
 * 封装Group的加载
 * 增加静默加载机制
 */
class ResourceUtils extends BaseClass {
    _groupIndex = 0;
    _configs = new Array();
    _groups = {};
    _urlResorce = {};
    _onConfigComplete: any;
    _onConfigCompleteTarget: any;



    public constructor() {
        super();

        RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceLoadProgress, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
    }

    public static ins(): ResourceUtils {
        return super.ins();
    };
    /**
     * 添加一个配置文件
     * @param jsonPath resource.json路径
     * @param filePath 访问资源路径
     */
    public addConfig(jsonPath, filePath) {
        this._configs.push([jsonPath, filePath]);
    };
    /**
     * 开始加载配置文件
     * @param $onConfigComplete 加载完成执行函数
     * @param $onConfigCompleteTarget 加载完成执行函数所属对象
     */
    public loadConfig($onConfigComplete, $onConfigCompleteTarget) {
        this._onConfigComplete = $onConfigComplete;
        this._onConfigCompleteTarget = $onConfigCompleteTarget;
        this.loadNextConfig();
    };
    /**
     * 加载
     */
    public loadNextConfig() {
        //加载完成
        if (this._configs.length == 0) {
            this._onConfigComplete.call(this._onConfigCompleteTarget);
            this._onConfigComplete = null;
            this._onConfigCompleteTarget = null;
            return;
        }
        var arr = this._configs.shift();
        RES.addEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigCompleteHandle, this);

        // egret.log("正在加载："+arr[0]+"     --- "+arr[1]);
        
        
        RES.loadConfig(arr[0], arr[1]);
    };
    /**
     * 加载完成
     * @param event
     */
    public onConfigCompleteHandle(event) {
        RES.removeEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigCompleteHandle, this);
        this.loadNextConfig();
    };
    /**
     * 加载资源组
     * @param $groupName 资源组名称
     * @param $onResourceLoadComplete 资源加载完成执行函数
     * @param $onResourceLoadProgress 资源加载进度监听函数
     * @param $onResourceLoadTarget 资源加载监听函数所属对象
     */
    public loadGroup($groupName, $onResourceLoadComplete, $onResourceLoadProgress, $onResourceLoadTarget) {
        this._groups[$groupName] = [$onResourceLoadComplete, $onResourceLoadProgress, $onResourceLoadTarget];
        RES.loadGroup($groupName);
    };
    /**
     * 同时加载多个组
     * @param $groupName 自定义的组名称
     * @param $subGroups 所包含的组名称或者key名称数组
     * @param $onResourceLoadComplete 资源加载完成执行函数
     * @param $onResourceLoadProgress 资源加载进度监听函数
     * @param $onResourceLoadTarget 资源加载监听函数所属对象
     */
    public loadGroups($groupName, $subGroups, $onResourceLoadComplete, $onResourceLoadProgress, $onResourceLoadTarget) {
        RES.createGroup($groupName, $subGroups, true);
        this.loadGroup($groupName, $onResourceLoadComplete, $onResourceLoadProgress, $onResourceLoadTarget);
    };
    /**
     * 静默加载
     * @param $groupName 资源组名称
     * @param $groupName 所包含的组名称或者key名称数组
     */
    public pilfererLoadGroup($groupName, $subGroups) {
        if ($subGroups === void 0) { $subGroups = null; }
        //添加前缀，防止与正常加载组名重复
        var useGroupName = "pilferer_" + $groupName;
        if (!$subGroups) {
            $subGroups = [$groupName];
        }
        RES.createGroup(useGroupName, $subGroups, true);
        RES.loadGroup(useGroupName, -1);
    };
    /**
     * 资源组加载完成
     */
    public onResourceLoadComplete(event) {
        var groupName = event.groupName;
        if (this._groups[groupName]) {
            var loadComplete = this._groups[groupName][0];
            var loadCompleteTarget = this._groups[groupName][2];
            if (loadComplete != null) {
                loadComplete.call(loadCompleteTarget);
            }
            this._groups[groupName] = null;
            delete this._groups[groupName];
        }
    };
    /**
     * 资源组加载进度
     */
    // private tttt:number = egret.getTimer();
    public onResourceLoadProgress(event) {
        var groupName = event.groupName;
        if (this._groups[groupName]) {
            var loadProgress = this._groups[groupName][1];
            var loadProgressTarget = this._groups[groupName][2];
            // egret.log(`资源[ ${event.resItem.name} : ${event.resItem.url} ] 加载完成 ${egret.getTimer()-this.tttt}`);
            // this.tttt = egret.getTimer();
            if (loadProgress != null) {
                loadProgress.call(loadProgressTarget, event.itemsLoaded, event.itemsTotal);
            }
        }
    };
    /**
     * 资源组加载失败
     * @param event
     */
    public onResourceLoadError(event) {
        Logger.trace(event.groupName + "资源组有资源加载失败");
        this.onResourceLoadComplete(event);
    };
    /**
     * 混合加载资源组
     * @param $resources 资源数组
     * @param $groups 资源组数组
     * @param $onResourceLoadComplete 资源加载完成执行函数
     * @param $onResourceLoadProgress 资源加载进度监听函数
     * @param $onResourceLoadTarget 资源加载监听函数所属对象
     */
    public loadResource($resources, $groups, $onResourceLoadComplete, $onResourceLoadProgress, $onResourceLoadTarget) {
        if ($resources === void 0) { $resources = []; }
        if ($groups === void 0) { $groups = []; }
        if ($onResourceLoadComplete === void 0) { $onResourceLoadComplete = null; }
        if ($onResourceLoadProgress === void 0) { $onResourceLoadProgress = null; }
        if ($onResourceLoadTarget === void 0) { $onResourceLoadTarget = null; }
        var needLoadArr = $resources.concat($groups);
        var groupName = "loadGroup" + this._groupIndex++;
        RES.createGroup(groupName, needLoadArr, true);
        this._groups[groupName] = [$onResourceLoadComplete, $onResourceLoadProgress, $onResourceLoadTarget];
        RES.loadGroup(groupName);
    }

    /**
     * 动态加载资源
     * @param url
     */
    public loadUrlResource(url, type, compFun, thisObj) {
        let urlData = this._urlResorce[url]
        if (urlData == null) {
            urlData = {
                "data": null,
                "listener": [],
                "state": 0,
            }
            this._urlResorce[url] = urlData
        }
        if (urlData.state == 2) {
            if (compFun != null) {
                compFun.call(thisObj, urlData.data, url)
            }
            return
        }
        urlData.listener.push({"fun": compFun, "obj": thisObj})
        if (urlData.state == 1) {
            return
        }
        urlData.state = 1
        RES.getResByUrl(url, (data) => {
            let resultData = this._urlResorce[url]
            resultData.state = 2
            resultData.data = data
            for (let value of resultData.listener) {
                if (value.fun) {
                    value.fun.call(value.obj, data, url)
                }
            }
            resultData.listener = []
        }, this, type);

        // if (this._urlResorce[url] == null) {
        //     this._urlResorce[url] = {
        //         "data": null,
        //         "compFun": compFun,
        //         "thisObj": thisObj
        //     };
        //     RES.getResByUrl(url, (data) => {
        //         this._urlResorce[url]["data"] = data;
        //         if (compFun != null)
        //             compFun.call(this._urlResorce[url]["thisObj"], data, url);
        //     }, this, type);
        // } else if (compFun != null) {
        //     compFun.call(thisObj, this._urlResorce[url]["data"], url);
        // }
    }

    public getUrlResource(url) {
        if (this._urlResorce[url] == null) {
            console.log("资源未加载", url);
            return null;
        }
        return this._urlResorce[url]["data"];
    }
}
window["ResourceUtils"]=ResourceUtils