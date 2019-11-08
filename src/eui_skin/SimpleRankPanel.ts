class SimpleRankPanel extends eui.Component implements eui.UIComponent {

	private seeRank: eui.Label
	private m_RankType
	public m_Lan1: eui.Label;

	public set rankType(value) {
		this.m_RankType = value
	}

	private _UpdateRank(): void {
		if (!this.m_RankType) {
			return
		}
		this.updataFirstThree(Rank.ins().rankModel[this.m_RankType])
		Rank.ins().sendGetRankingData(this.m_RankType)
	}

	protected childrenCreated(): void {
		//this.seeRank.textFlow = (new egret.HtmlTextParser).parser(`<font color='#20A208'><u>${this.seeRank.text}</u></font>`)
		this.m_Lan1.text = GlobalConfig.jifengTiaoyueLg.st100380;
		this.seeRank.text = GlobalConfig.jifengTiaoyueLg.st100381;
	}

	public open(): void {
		UIHelper.SetLinkStyleLabel(this.seeRank)
		this.visible = GameGlobal.actorModel.level >= 60
		// this.currentState = "unshow";
		MessageCenter.addListener(Rank.postRankingData, this.updataFirstThree, this)
		this.seeRank.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnClick, this)
		this._UpdateRank()
	}

	public close(): void {
		MessageCenter.ins().removeAll(this)
		this.seeRank.removeEventListener(egret.TouchEvent.TOUCH_TAP, this._OnClick, this)
	}

	private updataFirstThree(rankModel): void {
		if (!rankModel) {
			for (var i = 0; i < 3; i++) {
				this._SetRankName(i, null)
				this._SetRankHarm(i, null)
			}
			return;
		}
		if (rankModel.type != this.m_RankType)
			return;
		for (var i = 0; i < 3; i++) {
			var data = rankModel.getDataList(i);
			this._SetRankName(i, data ? data[RankDataType.DATA_PLAYER] : null)
			this._SetRankHarm(i, data ? data[RankDataType.DATA_COUNT] : null)
		}
	}

	private _SetRankName(index: number, value: string): void {
		this["name" + index].text = value || GlobalConfig.jifengTiaoyueLg.st100378;
	}

	private _SetRankHarm(index: number, value: string = "0"): void {
		let harm: eui.Label = this["harm" + index]
		if (value) {
			harm.visible = true
			harm.text = value + GlobalConfig.jifengTiaoyueLg.st100369
		} else {
			harm.visible = false
		}
	}

	private _OnClick(e: egret.TouchEvent) {
		switch (e.currentTarget) {
			case this.seeRank:
				if (!this.m_RankType) {
					return
				}
				let rankModel = Rank.ins().rankModel[this.m_RankType]
				if (rankModel && rankModel.getDataList.length > 0) {
					if (GameGlobal.actorModel.level < 60)
						UserTips.ins().showTips(GlobalConfig.jifengTiaoyueLg.st100379);
					else
						ViewManager.ins().open(FbAndLevelsRankWin, this.m_RankType);
				} else {
					UserTips.ins().showTips(GlobalConfig.jifengTiaoyueLg.st100370);
				}
				break;
		}
	}
}

window["SimpleRankPanel"] = SimpleRankPanel