/**跨服战奖励主view*/
class KFguildWarRewardBgWin extends BaseEuiPanel implements ICommonWindow {
	public constructor() {
		super();
	}

	public static LAYER_LEVEL = LayerManager.UI_Main;
	private commonWindowBg: CommonWindowBg;
	private kFguildWarReward2Panel:KFguildWarReward2Panel;
	private kFguildWarReward1Panel:KFguildWarReward1Panel;

	private selectImg:eui.Image;
	private btn0:eui.Image;
	private btn1:eui.Image;

	public static rewardIndex:number = 0;

	public initUI() {
		super.initUI();
		this.skinName = "KFguildWarRewardBgSkin";
		this.kFguildWarReward2Panel = new KFguildWarReward2Panel();
		this.kFguildWarReward1Panel = new KFguildWarReward1Panel();

		this.commonWindowBg.AddChildStack(this.kFguildWarReward2Panel);
		this.commonWindowBg.AddChildStack(this.kFguildWarReward1Panel);
		//this.selectImg.x = 188;
		this.selectImg.horizontalCenter = this.btn0.horizontalCenter;
		this.selectImg.verticalCenter = this.btn0.verticalCenter;
		KFguildWarRewardBgWin.rewardIndex = 0;
	}

	public open(...param: any[]) 
	{
		this.commonWindowBg.OnAdded(this, param[0] ? param[0] : 0);
		this.btn0.addEventListener(egret.TouchEvent.TOUCH_END, this.onClick, this);
		this.btn1.addEventListener(egret.TouchEvent.TOUCH_END, this.onClick, this);	
	}

	public close() 
	{
		this.commonWindowBg.OnRemoved();
		this.btn0.removeEventListener(egret.TouchEvent.TOUCH_END, this.onClick, this);
		this.btn1.removeEventListener(egret.TouchEvent.TOUCH_END, this.onClick, this);
	}

	public OnOpenIndex?(openIndex: number): boolean 
	{
		return true
	}

	private onClick(evt:egret.TouchEvent)
	{
		switch(evt.currentTarget)
		{
			case this.btn0:
				KFguildWarRewardBgWin.rewardIndex = 0;
				//this.selectImg.x = 47;
				this.selectImg.horizontalCenter = this.btn0.horizontalCenter;
				this.selectImg.verticalCenter = this.btn0.verticalCenter;
			break;
			case this.btn1:
				KFguildWarRewardBgWin.rewardIndex = 1;
				this.selectImg.horizontalCenter = this.btn1.horizontalCenter;
				this.selectImg.verticalCenter = this.btn1.verticalCenter;
				//this.selectImg.x = 315;
			break;	
		}

		if(this.commonWindowBg.tabBar.selectedIndex == 0)
			this.kFguildWarReward2Panel.updateViewSelected();
		else
			this.kFguildWarReward1Panel.updateViewSelected();
	}
}
window["KFguildWarRewardBgWin"]=KFguildWarRewardBgWin