class MountClimbRankItem extends eui.ItemRenderer {
	public constructor() {
		super();

		this.skinName = "MountClimbRankItemSkin";
	}
	public m_RankLab: eui.Label;
	public m_NameLab: eui.Label;
	public m_LvlLab: eui.Label;


	dataChanged() {
		let data: Sproto.tower_rank_data = this.data;
		this.m_RankLab.text = (this.itemIndex + 1) + "";
		this.m_NameLab.text = data.name;
		this.m_LvlLab.text = data.lvl + GlobalConfig.jifengTiaoyueLg.st100369;
		let color: number = 0xBF7D00;
		switch (this.itemIndex) {
			case 0:
				color = 0xBF7D00;
				break;
			case 1:
				color = 0x4C78Db;
				break;
			case 2:
				color = 0xB454EB;
				break;
		}
		this.m_RankLab.textColor = color;
		this.m_NameLab.textColor = color;
	};
}
window["MountClimbRankItem"]=MountClimbRankItem