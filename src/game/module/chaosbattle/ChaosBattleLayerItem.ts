class ChaosBattleLayerItem extends eui.ItemRenderer {
	public constructor() {
		super();
		this.skinName = "MountLvUpAwardItemSkin";
	}

	public m_ItemList: eui.List;
	public m_Cont: eui.Label;
	public m_GetBtn: eui.Button;
	public m_GetTxt: eui.Label;
	public m_GetImg: eui.Image;

	private listData: eui.ArrayCollection;
	public createChildren() {
		super.createChildren();
		this.m_GetBtn.label = GlobalConfig.jifengTiaoyueLg.st101076;
		this.m_GetTxt.text = GlobalConfig.jifengTiaoyueLg.st100680;
		this.m_ItemList.itemRenderer = ItemBase;
		this.listData = new eui.ArrayCollection();
		this.m_ItemList.dataProvider = this.listData;
		this.m_GetBtn.visible = false;
		this.m_GetTxt.visible = false;
		this.m_GetImg.visible = false;
	}
	public dataChanged() {
		super.dataChanged();
		let competitionStageAward = GlobalConfig.ins("CompetitionStageAward")[this.itemIndex + 1];
		if (competitionStageAward) {
			this.listData.removeAll();
			this.listData.replaceAll(competitionStageAward.award);
			this.listData.refresh();
			this.m_Cont.text = LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st102021, [competitionStageAward.id]);
		}
		// let type = this.data
		// switch (type) {
		// 	case 0:
		// 		this.m_GetBtn.visible = true;
		// 		this.m_GetTxt.visible = false
		// 		this.m_GetImg.visible = false
		// 		this.m_GetBtn.label = GlobalConfig.languageConfig.st101076;//"领 取";
		// 		break;
		// 	case -1:
		// 		//没达到要求
		// 		this.m_GetBtn.visible = false;
		// 		this.m_GetTxt.visible = true
		// 		this.m_GetImg.visible = false
		// 		this.m_GetBtn.label = GlobalConfig.languageConfig.st101076;//"领 取";
		// 		break;
		// 	case 1:
		// 		this.m_GetBtn.visible = false;
		// 		this.m_GetTxt.visible = false
		// 		this.m_GetImg.visible = true
		// 		this.m_GetBtn.label = GlobalConfig.languageConfig.st100981;//"已领取";
		// 		break;
		// }
	}
}

window["ChaosBattleLayerItem"] = ChaosBattleLayerItem