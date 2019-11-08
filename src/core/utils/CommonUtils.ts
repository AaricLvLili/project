/**
 * 通用工具类
 */
class CommonUtils extends BaseClass {

    public constructor() {
        super();
    }
    /**
     * 给字体添加描边
     * @param lable	  文字
     * @param color	  表示文本的描边颜色
     * @param width	  描边宽度。
     */
    public static addLableStrokeColor (lable, color, width) {
        lable.strokeColor = color;
        lable.stroke = width;
    };
    /**
     * 获取一个对象的长度
     * @param list
     */
    public static getObjectLength (list) {
        var num = 0;
        for (var i in list) {
            num++;
        }
        return num;
    };
    /**
     * 深度复制
     * @param _data
     */
    public static copyDataHandler (obj) {
        var newObj;
        if (obj instanceof Array) {
            newObj = [];
        }
        else if (obj instanceof Object) {
            newObj = {};
        }
        else {
            return obj;
        }
        var keys = Object.keys(obj);
        for (var i = 0, len = keys.length; i < len; i++) {
            var key = keys[i];
            newObj[key] = this.copyDataHandler(obj[key]);
        }
        return newObj;
    }

    /** 克隆object对象*/
    public static cloneObj(obj): any {
		var result = {};
		for (var key in obj) {
			result[key] = obj[key];
		}
		return result;
	}
    
    /**
     * 锁屏
     */
    public static lock () {
        StageUtils.ins().getStage().touchEnabled = StageUtils.ins().getStage().touchChildren = false;
    };
    /**
     * 解屏
     */
    public static unlock () {
        StageUtils.ins().getStage().touchEnabled = StageUtils.ins().getStage().touchChildren = true;
    };
    /**
     * 万字的显示
     * @param label
     * @param num
     */
    public static labelIsOverLenght (label, num) {
        label.text = this.overLength(num);
    };
    public static overLength (num) {
        var str = null;
        if (num < 100000) {
            str = num;
        }
        else if (num > 100000000) {
            num = (num / 100000000);
            num = Math.floor(num * 10) / 10;
            str = num + GlobalConfig.jifengTiaoyueLg.st100704;//"亿";
        }
        else {
            num = (num / 10000);
            num = Math.floor(num * 10) / 10;
            str = num + GlobalConfig.jifengTiaoyueLg.st100066;//"万";
        }
        return str;
    };

    public static GetArray(dict: any, sortKey: string = null, ascendingOrder = true): any[] {
        if (dict == null) {
            return []
        }
        let list = []
        for (let key in dict) {
            let data = dict[key]
            list.push(data)
        }
        if (sortKey) {
            try {
                if (ascendingOrder) {
                    list.sort(function(lhs, rhs) {
                        return lhs[sortKey] - rhs[sortKey]
                    })
                } else {
                    list.sort(function(lhs, rhs) {
                        return rhs[sortKey] - lhs[sortKey]
                    })
                }
            } catch (e) {

            }
        }
    }

    /**增加滤镜*/
	public static toGrayScale(obj:any):void
	{
		var colorMatrix = [0.3,0.6,0,0,0,0.3,0.6,0,0,0,0.3,0.6,0,0,0,0,0,0,1,0];
		var colorFlilter = new egret.ColorMatrixFilter(colorMatrix);
        obj.filters = [colorFlilter];
	}
	
     /**取消滤镜*/
	public static toOriginalColors(obj:any):void
	{
		var colorMatrix = [0.3,0.6,0,0,0,0.3,0.6,0,0,0,0.3,0.6,0,0,0,0,0,0,1,0];
		var originalFilter = new egret.ColorMatrixFilter(colorMatrix);
		obj.filters = [originalFilter];
	}
}
window["CommonUtils"]=CommonUtils