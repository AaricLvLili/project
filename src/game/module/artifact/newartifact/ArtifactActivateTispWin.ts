class ArtifactActivateTispWin extends BaseEuiPanel {
	public constructor() {
		super()
		this.skinName = "ArtifactActivateTispWinSkin";
	}
	public m_CloseBtn1: eui.Button;
	public m_CloseBtn2: eui.Button;
	public m_Title1: eui.Label;
	public m_ModGetLab: eui.Label;
	public m_ConditionLab: eui.Label;
	//public ArtifactBaseIcon: ArtifactBaseIcon;
	public m_AttrGroup: eui.Group;

	private data: any;

	public m_ActivateBtn: eui.Button;
	private groupEff: eui.Group

	public m_BodyEffGrouo: eui.Group;
	public m_LvUpEffGroup: eui.Group;
	public m_Lan1: eui.Label;


	initUI() {
		super.initUI();
		this.m_Title1.text = GlobalConfig.jifengTiaoyueLg.st100457;
		this.m_Lan1.text = GlobalConfig.jifengTiaoyueLg.st100461;
		this.m_ActivateBtn.label = GlobalConfig.jifengTiaoyueLg.st100212;
	}
	open(...param: any[]) {
		this.data = param[0];
		this.addViewEvent();
		UIHelper.SetBtnNormalEffe(this.m_ActivateBtn, true);
		this.setData();
	}
	close() {
		this.release();
		DisplayUtils.dispose(this.mc);
		this.mc = null;
		DisplayUtils.dispose(this.m_BodyEff);
		this.m_BodyEff = null;
		DisplayUtils.dispose(this.m_UpLvEff);
		this.m_UpLvEff = null;
	}
	public release() {
		let childNum = this.m_ActivateBtn.numChildren;
		for (var i = 0; i < childNum; i++) {
			let child = this.m_ActivateBtn.getChildAt(0);
			if (child && child instanceof MovieClip) {
				DisplayUtils.dispose(child);
			}
		}
		this.removeViewEvent();
	}
	private addViewEvent() {
		this.observe(ArtifactEvt.ARTIFACT_INIT_MSG, this.setData);
		this.observe(ArtifactEvt.ARTIFACT_ACTIVATE_MSG, this.playBodyEff);
		this.AddClick(this.m_CloseBtn2, this.onClickClose);
		this.AddClick(this.m_CloseBtn1, this.onClickClose);
		this.AddClick(this.m_ActivateBtn, this.onClickAct);
	}
	private removeViewEvent() {
	}
	private setData() {
		let data = this.data;
		let artifactModel = ArtifactModel.getInstance;
		this.m_ActivateBtn.visible = false;
		this.m_ConditionLab.visible = true;
		if (data) {
			let artifacrEquData = artifactModel.artufactDic.get(data.id);
			//this.ArtifactBaseIcon.setData(artifacrEquData);
			let artifactsConfig = GlobalConfig.ins("ArtifactsConfig")[artifacrEquData.id];
			this._setEffect(artifactsConfig)
			let modNum = 0;
			if (artifactModel.curid == data.id) {
				modNum = data.fragmentCount - artifactModel.conid;
				this.m_ModGetLab.textFlow = <Array<egret.ITextElement>>[
					{ text: GlobalConfig.jifengTiaoyueLg.st100445, },
					{ text: modNum + "", style: { "textColor": 0x00BF22 } },
					{ text: GlobalConfig.jifengTiaoyueLg.st100446 },
					{ text: data.artifactsName, style: { "textColor": 0x00BF22 } },
				]
				let str1 = "";
				let str2 = "";
				switch (data.conditionkind) {
					case ArtifactGetType.TYPE1:
						str1 = GlobalConfig.jifengTiaoyueLg.st100447;
						str2 = GlobalConfig.jifengTiaoyueLg.st100369;
						if (artifactModel.conid < data.fragmentId) {
							if (UserFb.ins().CheckFb) {
								if (UserFb.ins().guanqiaID >= data.conditionnum) {
									this.m_ActivateBtn.visible = true;
									this.m_ConditionLab.visible = false;
								}
							}
						}
						break;
					case ArtifactGetType.TYPE2:
						str1 = GlobalConfig.jifengTiaoyueLg.st100449;
						str2 = GlobalConfig.jifengTiaoyueLg.st100093;
						if (artifactModel.conid < data.fragmentId) {
							let playerlv = GameLogic.ins().actorModel.level;
							if (playerlv >= data.conditionnum) {
								this.m_ActivateBtn.visible = true;
								this.m_ConditionLab.visible = false;
							}
						}
						break;
					case ArtifactGetType.TYPE3:
						str1 = GlobalConfig.jifengTiaoyueLg.st100458
						str2 = GlobalConfig.jifengTiaoyueLg.st100093;
						if (artifactModel.conid < data.fragmentId) {
							let vipLv = UserVip.ins().lv;
							if (vipLv >= data.conditionnum) {
								this.m_ActivateBtn.visible = true;
								this.m_ConditionLab.visible = false;
							}
						}
						break;
					case ArtifactGetType.TYPE4:
						str1 = GlobalConfig.jifengTiaoyueLg.st100452;
						str2 = GlobalConfig.jifengTiaoyueLg.st100006;
						if (artifactModel.conid < data.fragmentId) {
							if (GameServer.serverOpenDay >= data.conditionnum) {
								this.m_ActivateBtn.visible = true;
								this.m_ConditionLab.visible = false;
							}
						}
						break;
					case ArtifactGetType.TYPE5:
						str1 = GlobalConfig.jifengTiaoyueLg.st100454;
						str2 = GlobalConfig.jifengTiaoyueLg.st100006;
						// if (artifactModel.conid < this.data.fragmentId) {
						// 	if (GameServer.serverOpenDay >= data.conditionnum) {
						// 		this.m_ActivateBtn.visible = true;
						// 		this.m_ConditionLab.visible = false;
						// 	}
						// }
						break;
					case ArtifactGetType.TYPE6:
						str1 = GlobalConfig.jifengTiaoyueLg.st100455;
						str2 = GlobalConfig.jifengTiaoyueLg.st100093;
						if (artifactModel.conid < data.fragmentId) {
							let zsLv = GameLogic.ins().actorModel.zsLv;
							if (zsLv >= data.conditionnum) {
								this.m_ActivateBtn.visible = true;
								this.m_ConditionLab.visible = false;
							}
						}
						break;
				}

				if (artifactModel.conid >= data.fragmentId) {
					this.m_ConditionLab.text = GlobalConfig.jifengTiaoyueLg.st100459;
				} else {
					this.m_ConditionLab.textFlow = <Array<egret.ITextElement>>[
						{ text: str1 },
						{ text: data.conditionnum, style: { "textColor": 0x00BF22 } },
						{ text: str2 },
					]
				}
			} else {
				this.m_ModGetLab.textFlow = <Array<egret.ITextElement>>[
					{ text: GlobalConfig.jifengTiaoyueLg.st100445, },
					{ text: data.fragmentCount + "", style: { "textColor": 0x00BF22 } },
					{ text: GlobalConfig.jifengTiaoyueLg.st100446 },
					{ text: data.artifactsName, style: { "textColor": 0x00BF22 } },
				]
				this.m_ConditionLab.text = GlobalConfig.jifengTiaoyueLg.st100460;
			}

			AttributeData.setAttrGroup(data.attrs, this.m_AttrGroup, 18, 0x00BF22);
		}
		this.checkGuide();
	}

	private onClickClose() {
		GuideUtils.ins().next(this.m_CloseBtn1);
		MessageCenter.ins().dispatch(ArtifactEvt.ARTIFACT_GUIDEEND);
		ViewManager.ins().close(this);
	}

	private onClickAct() {
		GuideUtils.ins().next(this.m_ActivateBtn);
		ArtifactSproto.ins().sendActivateStone();
	}
	private mc: MovieClip;
	private _setEffect(artifactsConfig: any) {
		if (!this.mc) {
			this.mc = new MovieClip();
		}
		this.mc.touchEnabled = false;
		this.groupEff.addChild(this.mc);
		this.mc.x = this.groupEff.width / 2;
		this.mc.y = this.groupEff.height / 2;
		this.mc.scaleY = this.mc.scaleX = 0.7;
		this.mc.loadUrl(ResDataPath.GetUIEffePath(artifactsConfig[0].effUi), true, -1);
	}

	private checkGuide() {
		if (Setting.currPart == 21 && Setting.currStep == 3) {
			GuideUtils.ins().show(this.m_ActivateBtn, 21, 3);
		} else if (Setting.currPart == 21 && Setting.currStep == 4) {
			GuideUtils.ins().show(this.m_CloseBtn1, 21, 4);
		}
	}


	private m_BodyEff: MovieClip;
	private m_UpLvEff: MovieClip;
	private playBodyEff() {
		this.m_BodyEff = ViewManager.ins().createEff(this.m_BodyEff, this.m_BodyEffGrouo, "eff_ui_bodyUpgrade");
		this.m_UpLvEff = ViewManager.ins().createEff(this.m_UpLvEff, this.m_LvUpEffGroup, "eff_ui_success");
	}

}

ViewManager.ins().reg(ArtifactActivateTispWin, LayerManager.UI_Popup);
window["ArtifactActivateTispWin"] = ArtifactActivateTispWin