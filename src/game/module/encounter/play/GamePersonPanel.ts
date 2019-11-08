class GamePersonPanel extends BaseView implements ICommonWindowTitle{
	windowTitleIconName: string = GlobalConfig.jifengTiaoyueLg.st100537;
	private gamePersonList:eui.List;
	public constructor() {
		super()
		this.skinName = "GamePersonskin";
	}
	open(...param: any[]) {
		var data = GlobalConfig.getGamePlayConfigByType(GamePlayEnum.GAME_PALY_TYPE_1);
		data.sort(this.sort);
		this.gamePersonList.itemRenderer = GamePersonItemPanel;
		this.gamePersonList.dataProvider = new eui.ArrayCollection(data);
	};
	private sort(s1, s2) {
		let flg1 = GamePersonItemPanel.isOpen(s1);
		let flg2 = GamePersonItemPanel.isOpen(s2);

		if (flg1 && !flg2)
			return -1;
		else if (!flg1 && flg2)
			return 1;
		else if (flg1 && flg2)
		{
			if (s1.index > s2.index)
				return -1;
			else if (s1.index < s2.index)
				return 1;
			else
				return 0;
		}
		else
		{
			if (s1.index < s2.index)
				return -1;
			else if (s1.index > s2.index)
				return 1;
			else
				return 0;
		}
	};

  	UpdateContent(): void {
	}
}
window["GamePersonPanel"]=GamePersonPanel