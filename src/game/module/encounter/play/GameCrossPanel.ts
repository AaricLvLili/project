class GameCrossPanel extends BaseView implements ICommonWindowTitle {
	windowTitleIconName: string = GlobalConfig.jifengTiaoyueLg.st100539;
	private gamePersonList: eui.List;
	public constructor() {
		super()
		this.skinName = "GamePersonskin";
	}
	open(...param: any[]) {
		//var data:Array<Object> =[{a:"playbg0",b:"跨服玩法",c:"跨服玩法",d:1,e:1},{a:"playbg0",b:"跨服玩法2",c:"跨服玩法2",d:2,e:2}]
		var data = GlobalConfig.getGamePlayConfigByType(GamePlayEnum.GAME_PALY_TYPE_3);
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
		else if (flg1 && flg2) {
			if (s1.index > s2.index)
				return -1;
			else if (s1.index < s2.index)
				return 1;
			else
				return 0;
		}
		else {
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
window["GameCrossPanel"] = GameCrossPanel