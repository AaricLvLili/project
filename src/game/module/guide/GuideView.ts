class GuideView extends eui.Component {
    private mc: MovieClip;
    private _obj: any;
    private _objindex: number;
    private _data: any
    private triggeredParent: any;

    public maskBg: eui.Image;
    public infoGroup: eui.Group;
    public _img: eui.Image;
    public _img1: eui.Image;
    public lab: eui.Label;
    public m_Finger: eui.Image;
    public m_StoryRoleTips: StoryRoleTips;
    public m_StoryWin: StoryWin;
    private btn: any;
    /**
     * 构造函数
     */
    public constructor() {
        super();
        this.skinName = "GuideViewSkin"
        this.touchEnabled = true;

        this.percentHeight = 100;
        this.percentWidth = 100;
        this.mc = new MovieClip;

        this.infoGroup.addChildAt(this.mc, 3);
        egret.MainContext.instance.stage.addEventListener(egret.Event.RESIZE, this.onResize, this);
        this.m_StoryWin.m_TouchGroup.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClickJQ, this);
    }


    /**
     * 屏幕大小改变时重置
     */
    onResize() {
        if (this.stage) {
            // egret.setTimeout(this.refurbish, this, 500);
        }
    };
    /**
     * 刷新
     */
    refurbish() {
        this.setData(this._obj, this._data);
    };
    /**
     * 设置显示数据
     * @param obj
     * @param data
     */
    setData(obj, data) {
        if (obj == null) {
            return;
        }
        this._obj = obj;
        this._objindex = obj.parent.getChildIndex(obj)
        this._data = data;

        this.list = [];
        var a: boolean = true;
        var temp = obj.parent;
        this.list.push(obj);
        this.list.push(temp);
        var count: number = 0;
        while (a) {
            count++;
            if (temp == this.parent) {
                a = false;
                break;
            }
            if (temp.parent) {
                temp = temp.parent;
                this.list.push(temp);
            }
            if (count >= 20) {
                a = false;
                break;
            }
        }

        this.triggeredParent = this.triggeredParent || obj.parent;
        this.lab.text = data.txt;
        this.addChildAt(obj, 1);
        if (this._isRoleBtn(this._obj)) {
            if (!this.btn) {
                this.btn = new eui.Button
                this.btn.skinName = `MainBottomBtnSkin`
                this.triggeredParent.addChildAt(this.btn, this._objindex)
            }
        }
        this.toPos(this._obj);
        this.isJQ(data);
    };
    /**角色按钮特殊处理 */
    private _isRoleBtn(obj): boolean {
        let view2 = <UIView2>ViewManager.ins().getView(UIView2)
        if (view2) {
            if (view2.roleBtn == obj) return true
            if (view2.petBtn == obj) return true
            if (view2.cityBtn == obj) return true
            if (view2.battleBtn == obj) return true
        }
        return false
    }

    private list: Array<any> = [];

    private objX: number;
    private objY: number;

    toPos(obj) {
        var p = new egret.Point;
        this.objX = obj.x;
        this.objY = obj.y;
        if (obj['horizontalCenter'] || obj['verticalCenter'] || obj['left'] || obj['right'] || obj['top'] || obj['bottom']) {
            var cp = this.triggeredParent;
            var tx = (isNaN(obj['horizontalCenter']) ? 0 : ((cp.width - obj.width) >> 1) + parseInt(obj['horizontalCenter'])) || parseInt(obj['left']) || obj.x;
            var ty = (isNaN(obj['verticalCenter']) ? 0 : ((cp.height - obj.height) >> 1) + parseInt(obj['verticalCenter'])) || parseInt(obj['top']) || obj.y;
            while (cp && !(cp instanceof egret.Stage)) {
                tx += (isNaN(cp['horizontalCenter']) ? 0 : ((cp.parent.width - cp.width) >> 1) + parseInt(cp['horizontalCenter'])) || parseInt(cp['left']) || cp.x;
                ty += (isNaN(cp['verticalCenter']) ? 0 : ((cp.parent.height - cp.height) >> 1) + parseInt(cp['verticalCenter'])) || parseInt(cp['top']) || cp.y;
                cp = cp.parent;
            }
            obj.x = tx;
            obj.y = ty;
        }
        else {
            var sprite; this.list[1]['horizontalCenter']
            var po: egret.Point = new egret.Point();
            for (var i: number = 0; i < this.list.length; i++) {
                sprite = this.list[i];
                if (!isNaN(sprite['horizontalCenter']) ||
                    !isNaN(sprite['verticalCenter']) ||
                    !isNaN(sprite['left']) ||
                    !isNaN(sprite['right']) ||
                    !isNaN(sprite['top']) ||
                    !isNaN(sprite['bottom'])) {
                    if (this.list[i + 1]) {
                        this.list[i + 1].validateNow();
                        po.x += sprite.x;
                        po.y += sprite.y;
                    }
                }
                else {
                    po.x += sprite.x;
                    po.y += sprite.y;
                }
            }
            // this.list[this.list.length - 1].localToGlobal(obj.x, obj.y);
            //    p = this.triggeredParent.localToGlobal(obj.x, obj.y);
            obj.x = po.x;
            obj.y = po.y;
        }
        if (obj.name == "gadBtn") {//主城的纹章特殊处理
            obj.x = obj.x - WIDTH / 2
        }
        if (!isNaN(obj['horizontalCenter']) ||
            !isNaN(obj['verticalCenter']) ||
            !isNaN(obj['left']) ||
            !isNaN(obj['right']) ||
            !isNaN(obj['top']) ||
            !isNaN(obj['bottom'])) {
            obj.includeInLayout = false;
        }
        if (this._obj.x > 300) {
            this.currentState = "left";
        } else if (this._obj.x < 50) {
            this.currentState = "right";
        }
        else {
            this.currentState = "above";
        }
        this.validateNow();//需要立即刷新坐标，不然下面赋值的坐标会让currentState覆盖掉
        let x = this._obj.x + (this._obj.width >> 1) + (this._data.pox ? this._data.pox : 0);
        let y = this._obj.y + (this._obj.height >> 1) + (this._data.poy ? this._data.poy : 0);
        let bbbb = this._obj
        let aaa = this._obj.hashCode
        let cc = this._obj.name
        if (this._obj.name == "challengeBtn") {
            x = this._obj.x + (this._obj.width >> 1) + (this._data.pox ? this._data.pox : 0) + 12;
        }
        this.infoGroup.x = x;
        this.infoGroup.y = y;
        // this.mc.loadFile('guideff', true);
        this.mc.loadUrl(ResDataPath.GetUIEffePath("eff_guide"), true);
        this.mc.x = 11;
        this.mc.y = 7;
        this.playFinger();

        // if (this._obj.x < 160) {
        //     this.currentState = "lFeft"
        //     // this.mc.x =120
        // }if (this._obj.x < 200&&this._obj.x < 150) {
        //     this.currentState = "bottom"
        //     // this.mc.x =0
        // }
        //  else {
        //     this.currentState = "above"
        //     // this.mc.x =280
        // }

    };
    resetParent() {
        if (this.triggeredParent) {
            // var p = this.triggeredParent.globalToLocal(this._obj.x, this._obj.y);
            this._obj.x = this.objX;
            this._obj.y = this.objY;
            this._obj.includeInLayout = true;
            if (this._isRoleBtn(this._obj)) {
                this.triggeredParent.removeChildAt(this._objindex)
                this.btn = null;
            }
            this.triggeredParent.addChildAt(this._obj, this._objindex);
            this.triggeredParent = null;
        }
        egret.Tween.removeTweens(this.m_Finger);
        this.m_Finger.x = this.m_Finger.y = 0;
    };
    private playFinger() {
        this.m_Finger.visible = true;
        egret.Tween.removeTweens(this.m_Finger);
        egret.Tween.get(this.m_Finger, { loop: true }).to({ x: 15, y: 15 }, 200).to({ x: 0, y: 0 }, 200);
    }

    public hideFinger() {
        this.m_Finger.visible = false;
    }

    private talkLine: number = 0;

    public static isPlayTween: boolean = false;

    private oldConfig: any;
    private oldGroupId: number = 0;
    public isJQ(dialogueConfig: any) {
        this._obj.visible = false;
        this.infoGroup.visible = false;
        this.m_StoryRoleTips.visible = false;
        this.m_StoryWin.visible = false;
        if (this.oldGroupId != dialogueConfig.groupId) {
            this.m_StoryWin.initPoint();
            this.oldGroupId = dialogueConfig.groupId;
            this.talkLine = 0;
        }
        if (dialogueConfig.endWay == 1) {
            this.talkLine = 0;
        } else {
            this.talkLine += 1;
        }
        this.oldConfig = dialogueConfig;
        switch (dialogueConfig.type) {
            case GuideJQType.TYPE1:
            case GuideJQType.TYPE2:
            case GuideJQType.TYPE5:
                this.m_StoryWin.visible = true;
                this.m_StoryWin.setData(dialogueConfig, this.talkLine);
                break;
            case GuideJQType.TYPE3:
                this._obj.visible = true;
                this.m_StoryRoleTips.visible = true;
                this.infoGroup.visible = true;
                this._img.visible = false;
                this._img1.visible = false;
                this.lab.visible = false;
                this.m_StoryRoleTips.m_Tips.text = dialogueConfig.txt;
                let point = dialogueConfig.coordinate;
                if (point) {
                    this.m_StoryRoleTips.x = point[0];
                    this.m_StoryRoleTips.y = point[1];
                }
                if (Main.isLiuhai) {
                    if (dialogueConfig.top) {
                        this.m_StoryRoleTips.top = dialogueConfig.top + 20;
                    } else {
                        this.m_StoryRoleTips.top = dialogueConfig.top
                    }
                } else {
                    this.m_StoryRoleTips.top = dialogueConfig.top;
                }
                this.m_StoryRoleTips.bottom = dialogueConfig.bottom;
                break;
            case GuideJQType.TYPE4:
                this._obj.visible = true;
                this.infoGroup.visible = true;
                this._img.visible = true;
                this._img1.visible = true;
                this.lab.visible = true;
                break;

        }
    }

    private onClickJQ() {
        if (GuideView.isPlayTween == true) {
            return;
        }
        this.m_StoryWin.initPoint();
        if (this.oldConfig.endWay == 1) {
            this.m_StoryWin.m_Item1.setData(this.oldConfig);
        } else {
            this.m_StoryWin.m_Item1.setData(this.oldConfig);
            egret.Tween.get(this.m_StoryWin.m_MainGroup).to({ y: 326 }, 400);
        }
        let isdo = GuideUtils.ins().checkHaveNext();
        if (isdo) {
            Setting.currStep++;
            this.isJQ(GuideUtils.ins().configData[Setting.currPart][Setting.currStep]);
        } else {
            this.initObj();
            GuideUtils.ins().next(this._obj);
        }
    }

    private initObj() {
        this._obj.visible = true;
        this.infoGroup.visible = true;
        this.m_StoryRoleTips.visible = true;
        this.m_StoryWin.visible = true;
    }
}


window["GuideView"] = GuideView