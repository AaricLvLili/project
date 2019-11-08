class AcrossLadderRecordItem extends eui.ItemRenderer {

	public recordType: eui.Image;
	public recordResult: eui.Image;
	public labelName: eui.Label;
	public labelLv: eui.Label;
	public labelRankChange: eui.Label;
	public rankChangeDirection: eui.Image;
	public btnChallenge: eui.Image;

	public m_MainLab: eui.Label;
	public m_RevengeLab: eui.Label;
	public constructor() {
		super();
		this.skinName = "AcrossLadderRecordItemSkin";
	}

	protected childrenCreated() {
		super.childrenCreated();
	}

	protected dataChanged(): void {
		let data: AcrossLadderRecordItemData = this.data;
		if (data.recordTypeOrg && data.recordResultOrg) {
			this.m_MainLab.textFlow = <Array<egret.ITextElement>>[
				{ text: GlobalConfig.jifengTiaoyueLg.st100046+ " " },
				{ text: data.opName, style: { "textColor": 0xFFCC00 } },
				{ text: GlobalConfig.jifengTiaoyueLg.st100881 },
				{ text: data.rankChangeNum + "", style: { "textColor": 0x00FF00 } },
				{ text: "！" }
			]
		}
		if (data.recordTypeOrg && !data.recordResultOrg) {
			this.m_MainLab.textFlow = <Array<egret.ITextElement>>[
				{ text:  GlobalConfig.jifengTiaoyueLg.st100046+ " " },
				{ text: data.opName, style: { "textColor": 0xFFCC00 } },
				{ text: GlobalConfig.jifengTiaoyueLg.st100882 },
			]
		}
		if (!data.recordTypeOrg && data.recordResultOrg) {
			this.m_MainLab.textFlow = <Array<egret.ITextElement>>[
				{ text: data.opName, style: { "textColor": 0xFFCC00 } },
				{ text: GlobalConfig.jifengTiaoyueLg.st100883 },
			]
		}

		if (!data.recordTypeOrg && !data.recordResultOrg) {
			this.m_MainLab.textFlow = <Array<egret.ITextElement>>[
				{ text: data.opName, style: { "textColor": 0xFFCC00 } },
				{ text: GlobalConfig.jifengTiaoyueLg.st100884 },
				{ text: data.rankChangeNum + "", style: { "textColor": 0xf87372 } },
				{ text: "！" }
			]
		}
		// this.m_RevengeLab.visible = (this.data.recordTypeOrg && this.data.recordResulOrg);

	}

	public onTouch() {
		let data: AcrossLadderRecordItemData = this.data;
		AcrossLadderCenter.ins().reqAcrossLadderStartCombat(data.opPlayerId, data.opPlayerId);
	}
}
window["AcrossLadderRecordItem"]=AcrossLadderRecordItem