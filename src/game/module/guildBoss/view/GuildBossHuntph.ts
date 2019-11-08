class GuildBossHuntph extends BaseEuiPanel implements ICommonWindow {
    public static LAYER_LEVEL = LayerManager.UI_Main
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // GuildBossCallPanelSkin.exml
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    private commonWindowBg: CommonWindowBg
    private myhunt:eui.Label
	private myph:eui.Label
	private list:eui.List
	private languageTxt:eui.Label;
	private languageTxt0:eui.Label;
	private languageTxt1:eui.Label;
	private languageTxt2:eui.Label;
    ////////////////////////////////////////////////////////////////////////////////////////////////////

	public constructor() {
		super()
		this.skinName = "GuildBossHurtph"
	}
    
	public childrenCreated() {
		//this.dataGroup.itemRenderer = ItemBase
		this.languageTxt.text = GlobalConfig.jifengTiaoyueLg.st101807 + "：";
		this.languageTxt0.text = GlobalConfig.jifengTiaoyueLg.st100400;
		this.languageTxt1.text = GlobalConfig.jifengTiaoyueLg.st101174;
		this.languageTxt2.text = GlobalConfig.jifengTiaoyueLg.st101808;
	}

	public open() {
        let RanDatas=GuildBoss.ins().GetCallInfo().rankDatas
        // RanDatas.sort((lhs,rhs)=>{
		// 	if(lhs.value>rhs.value)
		// 	{
		// 	    return 1
		// 	}
		// 	return -1
		// })
	    var sourceArr:any[] = []
		for(let i=0;i<RanDatas.length;i++){
			let t={"num":i+1,"name":RanDatas[i].name,"value":CommonUtils.overLength(RanDatas[i].value)}
			sourceArr.push(t);
		}
		this.commonWindowBg.OnAdded(this)
		let myRank = GlobalConfig.jifengTiaoyueLg.st100086//'未上榜'
		let myHunt = 0
		for (let i = 0; i < RanDatas.length; ++i) {
			let data = RanDatas[i]
			if (data.dbid == GameGlobal.actorModel.actorID) {
				myRank = (i + 1)+ ""
				myHunt = data.value
			}
		}
		this.myph.text= myRank
		this.myhunt.text=CommonUtils.overLength(myHunt) + ""
		this.list.dataProvider=new eui.ArrayCollection(sourceArr);
	}
    	
	public close() {
		this.commonWindowBg.OnRemoved()
	}

	mWindowHelpId = 0
}
ViewManager.ins().reg(GuildBossHuntph, LayerManager.UI_Main);
window["GuildBossHuntph"]=GuildBossHuntph