/**
 * 显示对象工具类
 */
class DisplayUtils {

    static shakingList = {};

    /**
     * 创建一个Bitmap
     * @param resName resource.json中配置的name
     * @returns {egret.Bitmap}
     */
    public static createBitmap(resName) {
        var result = new egret.Bitmap();
        var texture = RES.getRes(resName);
        result.texture = texture;
        return result;
    };
    /**
     * 创建一张Gui的图片
     * @param resName
     * @returns {egret.Bitmap}
     */
    public static createEuiImage(resName) {
        var result = new eui.Image();
        var texture = RES.getRes(resName);
        result.source = texture;
        return result;
    };
    /**
     * 从父级移除child
     * @param child
     */
    public static removeFromParent(child: egret.DisplayObject) {
        if (!child || child.parent == null) {
            // egret.log("对象未被回收"+child);
            child = null;
            return;
        }
        child.parent.removeChild(child);
        if (child instanceof MovieClip) {
            (child as MovieClip).clearCache();
        }
        child = null;
    };

    public static disposeAll(child: egret.DisplayObject) {
        if (child == null) return;
        //将子元素一起销毁
        if (child instanceof eui.List) {
            child.removeChildren();
        }
        else if (child instanceof egret.DisplayObjectContainer) {
            let t;
            while (child.numChildren > 0) {
                t = child.getChildAt(0);
                this.dispose(t);
                t = null;
            }
        }
        else if (child instanceof MovieClip) {
            child.clearCache();
        }
        else if (child instanceof eui.Image) {
            var url: any = child.source;
            var b = ResMgr.ins().destroyRes(url);
            egret.log("Image dispose = " + b + "   " + url);
            if (child.texture)
                child.texture.dispose();
            url = null;
            child.source = null;

        }
        else if (child instanceof eui.Label) {
            child.text = null;
        }
        TimerManager.ins().removeAll(child);
        if (child.parent) {
            child.parent.removeChild(child);
            child = null;
        }
    }

    /**销毁包含所以子集(Image数据不会被销毁)*/
    public static dispose(child: egret.DisplayObject) {
        if (child == null) return;
        // egret.log("移除对象"+egret.getQualifiedClassName(child));
        if (child instanceof CharRole || child instanceof CharMonster) {
            child.destruct();
        }
        else if (child instanceof egret.DisplayObjectContainer) { //将子元素一起销毁
            while (child.numChildren > 0) {
                // egret.log("removeFromParent child.numChildren = "+child.numChildren);
                this.dispose(child.getChildAt(0));
            }
        }
        else if (child instanceof MovieClip) {
            child.clearCache();
        }

        else if (child instanceof eui.Image) {
            // var url:any= child.source;
            // ResMgr.ins().destroyRes(url);
            // if(child.texture)
            //     child.texture.dispose();
            // url = null;
            child.source = null;

        }
        else if (child instanceof eui.Label) {
            child.text = null;
        }
        TimerManager.ins().removeAll(child);
        if (child.parent) {
            child.parent.removeChild(child);
            child = null;
        }
    }

    static drawCir(t, e, i, s) {
        function n() {
            t.graphics.clear()
            t.graphics.beginFill(65535, 1)
            t.graphics.moveTo(0, 0)
            t.graphics.lineTo(e, 0)
            t.graphics.drawArc(0, 0, e, 0, i * Math.PI / 180, s)
            t.graphics.lineTo(0, 0)
            t.graphics.endFill()
        }
        if (t == null) {
            t = new egret.Shape();
        }
        t.graphics.clear()
        t.graphics.beginFill(65535, 1)
        t.graphics.moveTo(0, 0)
        t.graphics.lineTo(e, 0)
        t.graphics.drawArc(0, 0, e, 0, i * Math.PI / 180, s)
        t.graphics.lineTo(0, 0)
        t.graphics.endFill()
        return t;
    }

    static drawLine(t, e, i, s, n, a, r) {
        if (t == null) {
            t = new egret.Shape();
        }
        t.graphics.clear()
        t.graphics.lineStyle(a, r)
        t.graphics.moveTo(e, i)
        t.graphics.lineTo(s, n)
        t.graphics.endFill()
        return t;
    }

    private static EMPTY_FUNC = function () { return true }

    static shakeIt(target: egret.DisplayObjectContainer, range: number, time: number, count = 1, canFunc: Function = null) {
        if (canFunc == null) {
            canFunc = DisplayUtils.EMPTY_FUNC
        }

        if (target && (1 <= count) && canFunc()) {
            /**把原本的抖动记录去掉了 */
            // var state = DisplayUtils.shakingList[target.hashCode];
            // if (!state) {
            // DisplayUtils.shakingList[target.hashCode] = true;
            var o = [
                { anchorOffsetX: 0, anchorOffsetY: -range },
                { anchorOffsetX: -range, anchorOffsetY: 0 },
                { anchorOffsetX: range, anchorOffsetY: 0 },
                { anchorOffsetX: 0, anchorOffsetY: range },
                { anchorOffsetX: 0, anchorOffsetY: 0 }
            ];
            egret.Tween.removeTweens(target);
            var h = time / 5;
            egret.Tween.get(target)
                .to(o[0], h)
                .to(o[1], h)
                .to(o[2], h)
                .to(o[3], h)
                .to(o[4], h)
                .call(() => {
                    // delete DisplayUtils.shakingList[target.hashCode];
                    DisplayUtils.shakeIt(target, range, time, --count);
                    // egret.Tween.removeTweens(target);
                }, this)
            // }
        }
    }

    flashingObj(t, e, i = 300) {
        var s = function () {
            if (e) {
                t.visible = !0;
                var n = 1 == t.alpha ? 0 : 1;
                egret.Tween.removeTweens(t)
                egret.Tween.get(t).to({
                    alpha: n
                }, i).call(s)
            } else {
                egret.Tween.removeTweens(t)
                t.alpha = 1
                t.visible = !1
            }
        };
        s()
    }

    private static POINT = new egret.Point

    public static SetParent(target: eui.Component, parent: eui.Component): void {
        if (!target || !parent) {
            return
        }
        let point = DisplayUtils.POINT
        let oldParent = target.parent
        if (oldParent) {
            oldParent.localToGlobal(target.x, target.y, point)
            oldParent.removeChild(target)
        } else {
            point.x = target.x
            point.y = target.y
        }
        parent.globalToLocal(point.x, point.y, point)
        parent.addChild(target)
        if (target.bottom != null) {
            target.x = point.x
            target.bottom = parent.height - point.y - target.height
        } else {
            target.x = point.x
            target.y = point.y
        }
    }

    public static ChangeParent(target: egret.DisplayObject, parent: egret.DisplayObjectContainer): void {
        if (!target || !parent) {
            return
        }
        if (target.parent) {
            target.parent.removeChild(target)
        }
        parent.addChild(target)
    }

    /** 完整的销毁一个容器，包括里面所有的子级*/
    private static forDestroy(displayObj: egret.DisplayObjectContainer): void {

        var child: any;
        while (displayObj.numChildren) {
            child = displayObj.removeChildAt(0);
            this.twoDestroy(child);
        }
        if (displayObj.parent) displayObj.parent.removeChild(displayObj);
        displayObj = null;

    }


    /** 二次释放*/
    private static twoDestroy(child): void {

        if (egret.is(child, "eui.Image")) {
            // if (child.texture) child.texture.dispose();
            var b = RES.destroyRes(child.source);
            child.texture = null;
        }
        else if (egret.is(child, "eui.Label")) {
            child.text = child.textFlow = null;
        }
        else if (egret.is(child, "eui.TextInput")) {

        }
        else if (egret.is(child, "eui.Button")) {
            egret.log("按钮");
        }
        else if (egret.is(child, "eui.Component")) {
            child.removeChildren();
        }
        else if (egret.is(child, "egret.DisplayObjectContainer")) {
            this.forDestroy(child);
            egret.log(egret.getQualifiedSuperclassName(child));
            return;
        }
        if (child.parent) child.parent.removeChild(child);
        child = null;
    }
}
window["DisplayUtils"] = DisplayUtils