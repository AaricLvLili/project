class AcrossLadderRankRewardItem02 extends eui.ItemRenderer{
	public constructor() 
	{
		super();
	}
	
	private m_titleDesc:eui.Label;
	private m_reward01:ItemBase;
	private m_reward02:ItemBase;
	private m_reward03:ItemBase;
	private m_btn:eui.Button;
	private m_uncomImg:eui.Image;
	private m_progress:eui.Label;

	private goodsConfig:any = GlobalConfig.ins("ItemConfig");
	protected dataChanged(): void
	{
		var mData = this.data.data;
		this.m_titleDesc.text = mData.shuoMing.toString();
		this.m_btn.name = "m_btn"+mData.rankMin;
		if(this.data.state < 0)
		{
			if(this.data.state == -2)
			{//可以领取
				this.m_btn.visible = true;
				this.m_uncomImg.visible = false;
				this.m_progress.visible = false;
			}
			else
			{//未完成
				this.m_uncomImg.visible = true;
				this.m_btn.visible = false;
				if(this.data.selfRank == AcrossLadderPanelData.DEFAULT_RANK)
					this.m_progress.visible = false;
				else 
				{
					this.m_progress.visible = true;
					if(this.data.selfRank > mData.rankMin)
					{
						this.m_progress.textFlow = <Array<egret.ITextElement>>[ 
							{text: "(",style: {"textColor": 0x535557}},
							{text: this.data.selfRank+"/",style: {"textColor": 0xf87372}},
							{text: mData.rankMin+"",style: {"textColor": 0x00ff00}},
							{text: ")",style: {"textColor": 0x535557}}
        				];
					}
					else
					{
						this.m_progress.textFlow = <Array<egret.ITextElement>>[ 
							{text: "(",style: {"textColor": 0x535557}},
							{text: this.data.selfRank+"/",style: {"textColor": 0x00ff00}},
							{text: mData.rankMin+"",style: {"textColor": 0x00ff00}},
							{text: ")",style: {"textColor": 0x535557}}
        				];

						
					}
				}
			}
		}
		else
		{//已完成
			this.m_btn.visible = false;
			this.m_uncomImg.visible = false;
			this.m_progress.visible = false;
		}
		
		var awards:Array<any> = mData.award;
		var len = awards.length;

		var goods:any;
		switch(len)
		{
			case 0:
				this.m_reward01.visible = false;
				this.m_reward02.visible = false;
				this.m_reward03.visible = false;
				break;
			case 1:
				this.m_reward01.visible = true;
				this.m_reward02.visible = false;
				this.m_reward03.visible = false;
				goods = this.goodsConfig[awards[0].id];
				this.updateReward(this.m_reward01,{icon:goods.icon,name:goods.name,count:awards[0].count});
				break;
			case 2:
				this.m_reward01.visible = true;
				this.m_reward02.visible = true;
				this.m_reward03.visible = false;
				goods = this.goodsConfig[awards[0].id];
				this.updateReward(this.m_reward01,{icon:goods.icon,name:goods.name,count:awards[0].count});
				goods = this.goodsConfig[awards[1].id];
				this.updateReward(this.m_reward02,{icon:goods.icon,name:goods.name,count:awards[0].count});
				break;
			case 3:
				this.m_reward01.visible = true;
				this.m_reward02.visible = true;
				this.m_reward03.visible = true;
				goods = this.goodsConfig[awards[0].id];
				this.updateReward(this.m_reward01,{icon:goods.icon,name:goods.name,count:awards[0].count});
				goods = this.goodsConfig[awards[1].id];
				this.updateReward(this.m_reward02,{icon:goods.icon,name:goods.name,count:awards[0].count});
				goods = this.goodsConfig[awards[2].id];
				this.updateReward(this.m_reward03,{icon:goods.icon,name:goods.name,count:awards[0].count});
				break;
		}
	}

	private updateReward(itemBase:ItemBase,goods:any)
	{
		itemBase.itemIcon.setItemImg(goods.icon.toString()+"_png");
		itemBase.count.text = goods.count.toString();
		itemBase.nameTxt.text = goods.name.toString();
	}
}
window["AcrossLadderRankRewardItem02"]=AcrossLadderRankRewardItem02