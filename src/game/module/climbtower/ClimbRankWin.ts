class ClimbRankWin extends BaseEuiPanel implements ICommonWindowTitle {
	public constructor() {
		super();

		this.skinName = "FbRankSkin";
		this.m_Lan1.text = GlobalConfig.jifengTiaoyueLg.st100400;
		this.m_Lan2.text = GlobalConfig.jifengTiaoyueLg.st100401;
		this.m_Lan3.text = GlobalConfig.jifengTiaoyueLg.st100306;
		this.m_Lan4.text = GlobalConfig.jifengTiaoyueLg.st100402;
		this.m_Lan5.text = GlobalConfig.jifengTiaoyueLg.st100403;
	}

	windowTitleIconName?: string
	public m_Lan1: eui.Label;
	public m_Lan2: eui.Label;
	public m_Lan3: eui.Label;
	public m_Lan4: eui.Label;
	public m_Lan5: eui.Label;


	UpdateContent(): void {

	}

	private rank
	private list

	private commonWindowBg: CommonWindowBg

	open(...param: any[]) {
		this.windowTitleIconName = GlobalConfig.jifengTiaoyueLg.st100400;
		this.commonWindowBg.OnAdded(this)
		let type = param[0];
		let data;
		let climbTowerModel = ClimbTowerModel.getInstance;
		switch (type) {
			case ClimbType.PET:
				data = climbTowerModel.ClimbTowerPetData.ranks;
				this.rank.text = 0 < climbTowerModel.ClimbTowerPetData.myrank && climbTowerModel.ClimbTowerPetData.myrank <= 1000 ? climbTowerModel.ClimbTowerPetData.myrank + '' : GlobalConfig.jifengTiaoyueLg.st100086;
				break;
			case ClimbType.MOUNT:
				data = climbTowerModel.ClimbTowerMountData.ranks;
				this.rank.text = 0 < climbTowerModel.ClimbTowerMountData.myrank && climbTowerModel.ClimbTowerMountData.myrank <= 1000 ? climbTowerModel.ClimbTowerMountData.myrank + '' : GlobalConfig.jifengTiaoyueLg.st100086;
				break;
		}
		this.list.itemRenderer = ClimbRankItem;
		this.list.dataProvider = new eui.ArrayCollection(data);
	};

	close() {
		this.commonWindowBg.OnRemoved()
	};

	OnBackClick(clickType: number): number {
		return 0
	}

	OnOpenIndex(openIndex: number): boolean {
		return true
	}
}

ViewManager.ins().reg(ClimbRankWin, LayerManager.UI_Main);

window["ClimbRankWin"] = ClimbRankWin