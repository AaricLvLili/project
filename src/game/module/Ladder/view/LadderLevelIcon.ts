class LadderLevelIcon extends eui.Component implements eui.UIComponent {

	// private levelBg: eui.Image
	private level: eui.Label;
	private myRank: eui.Image

	private m_Rank01: number
	private m_Rank02: number;

	public constructor() {
		super()
	}

	protected childrenCreated() {
		this._Update()
	}

	public SetLevel(level: number): void {
		this.m_Rank01 = level
		if (level != 4) {
			var config = Ladder.ins().getLevelConfig();
			this.m_Rank02 = config ? config.showDan : 0
		} else {
			this.m_Rank02 = Ladder.ins().nowId;
		}

		this._Update()
	}

	public SetRank(rank01: number, rank02: number): void {
		this.m_Rank01 = rank01
		if (rank01 != 4) {
			var config = Ladder.ins().getLevelConfig(rank01, rank02);
			this.m_Rank02 = config ? config.showDan : 0;
		} else {
			this.m_Rank02 = rank02
		}
		this._Update()
	}

	public SetRank2(rank01: number, rank02: number): void {
		this.m_Rank01 = rank01
		this.m_Rank02 = rank02
		this._Update()
	}

	private _Update() {
		if (this.$stage == null || this.m_Rank01 == null || this.m_Rank02 == null) {
			return
		}
		this.myRank.source = LadderRankWin.GetRankIcon(this.m_Rank01)
		// 钻石不显示段位
		if (this.m_Rank01 == 4 && this.m_Rank02 >= 0) {
			// this.m_Rank02 = 0
			this.level.text = this.GetLevelImgName(this.m_Rank01, this.m_Rank02);
			// this.currentState = "normal"
		}
		else if (this.m_Rank02 > 0) {
			this.level.text = this.GetLevelImgName(this.m_Rank01, this.m_Rank02)
			// this.levelBg.visible = true;
			this.currentState = "normal"
		}
		else {
			this.currentState = "full"
			this.level.text = null;
			// this.levelBg.visible = false;
		}
	}

	private GetLevelImgName(level: number, showDuan: number): string {
		switch (level) {
			case 1: return LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st101757, [showDuan]);
			case 2: return LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st101758, [showDuan]);
			case 3: return LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st101759, [showDuan]);
			case 4: return " "+GlobalConfig.jifengTiaoyueLg.st100050 + "X" + showDuan;
		}
		return LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st101757, [showDuan]);
		// return 'laddergradnum_'+ level;
	}
}
window["LadderLevelIcon"] = LadderLevelIcon