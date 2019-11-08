//戒灵BOSS
class RingBossWin extends BaseView implements ICommonWindowTitle {
    btn: eui.Button;
	/** 列表*/
	private list: eui.List;
	/** 列表数据容器*/
	private listArr: eui.ArrayCollection;
    count: eui.Label;
    count0: eui.Label;
    yb: PriceIcon
    refreshCount: number //已刷新次数
    // refreshMax = false
	windowTitleIconName: string = "L戒灵BOSSR"
	public constructor() {
		super()
		this.skinName = "RingBossSkin"
		this.name = "戒灵BOSS"

	}
	protected childrenCreated(): void {
		super.childrenCreated();
        
        // var config = ['1','2','3','3','3','3','7'];
        // this.updataList(config)
    }
    updataList(array:Array<any>){
        this.list.itemRenderer = RingBossItem;
        this.listArr = new eui.ArrayCollection();
        this.listArr.source = array;
		this.list.dataProvider = this.listArr;
    }
	open(...param: any[]) {
        MessageCenter.ins().addListener(MessageDef.RING_BOSS_UPDATE,this.UpdateContent,this)
        var req = new Sproto.cs_ringboss_init_request;
		GameSocket.ins().Rpc(C2sProtocol.cs_ringboss_init, req, null, this);//请求
        // this.btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onBtn, this);
        this.AddClick(this.btn,this.onBtn)
        this.yb.priceLabel.textFlow = TextFlowMaker.generateTextFlow(`<font color=0x535557>300</font>`) ;
        // this.yb.iconImg.source = 'little_icon_03_png'
		this.UpdateContent()
	}
    onBtn(e){
        //列表刷新
        /*if(this.refreshMax){ 
            UserTips.ErrorTip('可用刷新次数已用完') 
            return
        }*/

        var req = new Sproto.sc_ringboss_refresh_req_request;
		GameSocket.ins().Rpc(C2sProtocol.sc_ringboss_refresh_req, req, null, this);//请求
    }
	public CheckRedPoint(): boolean {
		return RingSoulModel.ins().hasRedPoint();
    }
	close() {
		MessageCenter.ins().removeAll(this)
	}
    UpdateContent(){
        var cfg = GlobalConfig.ins('RingBossCommonConfig');
        var a = RingSoulModel.ins().ringboss_init.activeValue
        var b = cfg.useItem //RingSoulModel.ins().ringboss_init.activeValue2
        var c = RingSoulModel.ins().ringboss_init.chalTimes
        var d = cfg.challengTimes
        this.refreshCount = RingSoulModel.ins().ringboss_init.refreshTimes ? RingSoulModel.ins().ringboss_init.refreshTimes : 0
        if (a>=b){
            this.count.textFlow = (new egret.HtmlTextParser).parser(`<font color='0x535557'>消耗:次数${c}/${d}或历练值</font><font color='0x00ff00'>${a}</font><font color='0x535557'>/${b}（活跃任务可获得历练值）</font>`)
        }
        else {
            this.count.textFlow = (new egret.HtmlTextParser).parser(`<font color='0x535557'>消耗:次数${c}/${d}或历练值</font><font color='0xf87372'>${a}</font><font color='0x535557'>/${b}（活跃任务可获得历练值）</font>`)
        }

        var arr = GlobalConfig.ins('RingBossConfig')
        if(RingSoulModel.ins().ringboss_init.bossListKey) {
            var arr2 = []
            for(var arr1 of RingSoulModel.ins().ringboss_init.bossListKey){
                arr2.push( arr[arr1] )
            }
            this.updataList(arr2)
        }
        var array = cfg.refreshNumber
        var price = 0
        var fre = cfg.mianfeiNumber //免费刷新次数

        if(array){
            if(this.refreshCount>=array.length){ 
                price = array[array.length-1]
            }
            else{
                price = array[this.refreshCount]
            }
        }
        
        if((cfg.mianfeiNumber-this.refreshCount)>0){
            this.yb.visible = false
            this.count0.visible = true
            this.count0.text = '免费刷新次数 ' + (cfg.mianfeiNumber-this.refreshCount) + '/' + fre
        }
        else{
            this.yb.visible = true
            this.yb.priceLabel.text = '' + price
            this.count0.visible = false
        }
    }
}
window["RingBossWin"]=RingBossWin