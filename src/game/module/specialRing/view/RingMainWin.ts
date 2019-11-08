class RingMainWin  extends BaseEuiPanel implements ICommonWindow {

    public static LAYER_LEVEL = LayerManager.UI_Main
   
	private commonWindowBg: CommonWindowBg

    public constructor() {
        super();
      
        this.skinName = "SpecialRingMainSkin";
        this.commonWindowBg.AddChildStack(new SpecialRingWin)
        this.commonWindowBg.AddChildStack(new RingSoulWin)
        this.commonWindowBg.AddChildStack(new RingBossWin)
    }

	open(...param: any[]) {
		this.commonWindowBg.OnAdded(this, param ? param[0] : 0)

        let ringId = param[1] ? param[1] : 0
        if (ringId) {
            let view = this.commonWindowBg.GetCurViewStackElement() as SpecialRingWin
            if (view && view.OpenRingId) {
                view.OpenRingId(ringId)
            }
        }

        this.setRedPoint();
        MessageCenter.ins().addListener(MessageDef.RING_BUFF_UPDATE, this.setRedPoint, this);
        MessageCenter.ins().addListener(MessageDef.RING_BOSS_UPDATE, this.setRedPoint, this);
    }

    close() {
        this.commonWindowBg.OnRemoved()
        MessageCenter.ins().removeAll(this)
    }

    setRedPoint() {
        this.commonWindowBg.CheckTabRedPoint()
    }

	OnOpenIndex?(openIndex: number): boolean {
        var cfg = GlobalConfig.ins('RingBossCommonConfig')
        if (openIndex == 1) {
            if(!RingSoulModel.ins().isOpen) { 
                UserTips.ErrorTip('开服第'+ cfg.openTime +'天且' +'激活所有特戒后开启') 
                return false
            } else{
                return Deblocking.Check(DeblockingType.TYPE_44)
            }
          //  return true //解锁
		}
        if (openIndex == 2) {
            // if(RingSoulModel.ins().isOpen && cfg  && cfg.zslv<=GameGlobal.actorModel.zsLv && cfg.openTime<=GameServer.serverOpenDay) { 
                
            //     return true
            // } 
            // UserTips.ErrorTip('开服第'+ cfg.openTime +'天且' +'激活所有特戒后开启') 
            // return false
            if(!RingSoulModel.ins().isOpen){
                UserTips.ErrorTip('开服第'+ cfg.openTime +'天且' +'激活所有特戒后开启') 
                return false
            } else{
                return Deblocking.Check(DeblockingType.TYPE_45)
            }
		}
        return true
    }
}
window["RingMainWin"]=RingMainWin