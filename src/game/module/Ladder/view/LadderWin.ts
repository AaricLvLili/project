class LadderWin extends BaseEuiPanel implements ICommonWindow {
	viewStack
	private commonWindowBg: CommonWindowBg;
	private chaosBattlePanel: ChaosBattlePanel;
	initUI() {
		super.initUI()
		this.skinName = "MainWinSkin";
		this.commonWindowBg.AddChildStack(new EncounterInfoWin)
		this.commonWindowBg.AddChildStack(new DartCarPanel)
		this.commonWindowBg.AddChildStack(new MineWinInfo)

		this.chaosBattlePanel = new ChaosBattlePanel();
		this.commonWindowBg.AddChildStack(this.chaosBattlePanel);

		this.commonWindowBg.AddChildStack(new LadderInfoPanel)
		this.commonWindowBg.AddChildStack(new AcrossLadderPanel)
		this.commonWindowBg.AddChildStack(new TenKillPanel);
		//this.commonWindowBg.tabBar.visible =false

	};
	open(...param: any[]) {
		ChaosBattleSproto.ins().sendInfo();
		ChaosBattleSproto.ins().sendRank();
		this.commonWindowBg.OnAdded(this, param && param[0])
		this.observe(MessageDef.FUBEN_CHANGE, this.mapChange)
		this.observe(MessageDef.ENCOUNTER_ITEM_INFO_UPDATE, this.refushRed)
		this.observe(MessageDef.ENCOUNTER_DATA_CHANGE, this.refushRed)
		this.observe(MessageDef.MINE_STATU_CHANGE, this.refushRed)
		this.observe(MessageDef.DARTCAR_STATU_CHANGE, this.refushRed)
		this.observe(MessageDef.ACROSSLADDER_HISTORY_RANK, this.refushRed)
		this.observe(MessageDef.TENKILL_PANEL_UPDATE, this.refushRed);
		this.refushRed()
	};

	close() {
		this.commonWindowBg.OnRemoved()
		MessageCenter.ins().removeAll(this);
		this.chaosBattlePanel.release();
	};

	private mapChange() {
		// 如果不是挂机关卡，不关闭界面
		if (!GameMap.IsNoramlLevel()) {
			ViewManager.ins().close(LadderWin)
		}
	}

	/**更新红点提示 */
	refushRed() {
		this.commonWindowBg.CheckTabRedPoint();
	}

	OnBackClick(clickType: number): number {
		return 0
	}

	OnOpenIndex(index: number): boolean {
		if (index == 0) {
			return Deblocking.Check(DeblockingType.TYPE_07)
		} else if (index == 4) {
			return Deblocking.Check(DeblockingType.TYPE_02)
		} else if (index == 1) {
			return Deblocking.Check(DeblockingType.TYPE_27)
		} else if (index == 2) {
			return Deblocking.Check(DeblockingType.TYPE_08)
		} else if (index == 5) {
			return Deblocking.Check(DeblockingType.TYPE_26)
		} else if (index == 6) {
			return Deblocking.Check(DeblockingType.TYPE_34)
		} else if (index == 3) {
			return Deblocking.Check(DeblockingType.TYPE_91)
		}
		return true
	}

	static openCheck(param) {
		var index = param[0] == undefined ? 0 : param[0];
		if (index == 0) {
			return Deblocking.Check(DeblockingType.TYPE_07)
		} else if (index == 4) {
			return Deblocking.Check(DeblockingType.TYPE_02)
		} else if (index == 1) {
			return Deblocking.Check(DeblockingType.TYPE_27)
		} else if (index == 2) {
			return Deblocking.Check(DeblockingType.TYPE_08)
		} else if (index == 5) {
			return Deblocking.Check(DeblockingType.TYPE_26)
		} else if (index == 6) {
			return Deblocking.Check(DeblockingType.TYPE_34)
		} else if (index == 3) {
			return Deblocking.Check(DeblockingType.TYPE_91)
		}
		return true;
	};
}

ViewManager.ins().reg(LadderWin, LayerManager.UI_Main);
window["LadderWin"] = LadderWin