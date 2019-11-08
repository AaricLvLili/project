class RingBossItem extends eui.ItemRenderer {
    public constructor() {
        super()
        this.skinName = 'RingBossItemSkin';
        this.addEventListener(eui.UIEvent.CREATION_COMPLETE, this.euiComplete, this);
    }

    /** 当UI组件第一次被添加到舞台并完成初始化后调度*/
    private euiComplete(e: eui.UIEvent): void {
        this.removeEventListener(eui.UIEvent.CREATION_COMPLETE, this.euiComplete, this);
        this.btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.btnClick, this)

    }

    mc_g: eui.Group
    mc: MovieClip
    btn: eui.Button;
    jie: eui.Label;
    zhanLi: eui.Label;
    group: eui.List;

    private btnClick(e: eui.ItemTapEvent): void {

        if (!RingSoulModel.ins().hasRedPoint()) {
            UserTips.ErrorTip('挑战次数或历练值不足，无法挑战');
        }
        else {
            ViewManager.ins().close(RingMainWin);
            var req = new Sproto.sc_ringboss_enter_req_request;
            req.id = this.data.id
            GameSocket.ins().Rpc(C2sProtocol.sc_ringboss_enter_req, req, null, this);//请求
        }

    }

    public dataChanged() {
        var a = ['0', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二'];//
        this.btn['redPoint'].visible = RingSoulModel.ins().hasRedPoint();
        this.zhanLi.text = '推荐战力: ' + this.data.recommendpower
        this.group.itemRenderer = ItemBase;//奖励预览
        this.group.dataProvider = new eui.ArrayCollection(this.data.showitemid);

        this.group.validateNow()
        for (var i = 0; i < this.group.numChildren; i++) {
            let item = this.group.getChildAt(i) as ItemBase
            if (item) {
                item.showItemEffect()
            }
        }

        var monstersConfig = GlobalConfig.monstersConfig;
        var s = monstersConfig[this.data.showBoss];

        // var str = RingSoulModel.ins().getRingBuffName()[this.data.id].name
        //this.jie.textFlow = (new egret.HtmlTextParser).parser(`<font color='0xAC4D00'>${s.name}</font>`)
        // this.jie.text = a[this.data.transmigration] + '阶 ' + s.name
        this.jie.text = s.name + ""
        this.mc_g.removeChildren()
        this.mc = new MovieClip()
        this.mc.scaleX = this.mc.scaleY = 0.6
        this.mc_g.addChild(this.mc)

        this.mc.loadUrl(ResDataPath.GetMonsterBodyPath(s.avatar + "_3s"), true, -1)

    }


}
window["RingBossItem"] = RingBossItem