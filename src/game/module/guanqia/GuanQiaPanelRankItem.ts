class GuanQiaPanelRankItem extends eui.ItemRenderer {
	public constructor() {
		super();
	}
	public m_RankNum: eui.Label;
	public m_Name: eui.Label;
	public m_LayerNum: eui.Label;


	public dataChanged() {
		super.dataChanged();
		let data = this.data;
		this.m_RankNum.text = (this.itemIndex + 1) + "";
		this.m_Name.text = data.player;
		this.m_LayerNum.text = data.count + GlobalConfig.jifengTiaoyueLg.st100369;//"关";
	}
}
window["GuanQiaPanelRankItem"]=GuanQiaPanelRankItem