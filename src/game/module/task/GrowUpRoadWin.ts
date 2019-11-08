class GrowUpRoadWin extends BaseEuiPanel implements ICommonWindow {

    public commonWindowBg: CommonWindowBg;
    public list: eui.List;
    public roleShowPanel: RoleShowPanel;
    public m_txtContent: eui.Label;
    public listReward: eui.DataGroup;
    public m_txtOpen: eui.Label;
    public m_btnGet: eui.Button

    private _curIdx: number
    private _mc: MovieClip
    private m_groupMc: eui.Group
    private m_imgGet: eui.Image
    private scroller: eui.Scroller
    public scrollerLab: eui.Scroller;
    private _listData: eui.ArrayCollection

    public m_Lan1: eui.Label;

    public static selectIndex: number = 1;
    public constructor() {
        super()
        this.skinName = "GrowUpRoadWinSkin"
        this.list.useVirtualLayout = false
        this.m_Lan1.text = GlobalConfig.jifengTiaoyueLg.st101272;
        this.m_btnGet.label = GlobalConfig.jifengTiaoyueLg.st100004;

    }

    initUI() {
        super.initUI();
        this.list.itemRenderer = GrowUpRoadBtn
        this.listReward.itemRenderer = ItemBase
        this._listData = new eui.ArrayCollection();
        this.list.dataProvider = this._listData

    };
    destoryView() {
        super.destoryView();
    };
    open(...args: any[]) {
        this.observe(MessageDef.HEROWAY_MSG, this._updateView);
        this.commonWindowBg.OnAdded(this)
        this.commonWindowBg.nameIcon.text = GlobalConfig.jifengTiaoyueLg.st101268;
        this.observe(MessageDef.FUNC_OPEN_UPDATE, this.updateRedPoint)
        this.m_btnGet.addEventListener(egret.TouchEvent.TOUCH_TAP, this._onGet, this)
        GrowUpRoadWin.selectIndex = (args[0] - 1) || 0;
        this._updateView()
        this.updateRedPoint()
        this.list.validateNow()
        this.setScrollerPoint();
    }
    close() {
        DisplayUtils.dispose(this._mc)
        this._mc = null;
        this.roleShowPanel.release()
        this.m_btnGet.removeEventListener(egret.TouchEvent.TOUCH_TAP, this._onGet, this)
        this.commonWindowBg.OnRemoved()
        this.scroller.stopAnimation();
    };

    public OnOpenIndex(selectedIndex: number): boolean {
        return true
    }
    private _updateView(): void {
        let newData = Object.keys(GlobalConfig.funcNoticeConfig)
        this._listData.replaceAll(newData);
        this._curIdx = GrowUpRoadWin.selectIndex + 1;
        let cfg = GlobalConfig.funcNoticeConfig[this._curIdx]
        if (cfg == null) {
            return;
        }
        if (cfg.openLv[0] == 1) {//关卡
            this.m_txtOpen.text = LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st101269, [cfg.openLv[1]]);
        } else if (cfg.openLv[0] == 2) {//等级
            if (cfg.openLv[1] >= 1000) {
                let zslv = cfg.openLv[1] * 0.001;
                this.m_txtOpen.text = LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st102112, [zslv]);
            } else {
                this.m_txtOpen.text = LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st101270, [cfg.openLv[1]]);
            }
        } else if (cfg.openLv[0] == 3) {//登录天数
            this.m_txtOpen.text = LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st102114, [cfg.openLv[1]]);
        } else if (cfg.openLv[0] == 4) {//开服天数
            this.m_txtOpen.text = LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st102113, [cfg.openLv[1]]);
        }
        this.m_txtContent.textFlow = TextFlowMaker.generateTextFlow(cfg.tips)
        this.listReward.dataProvider = new eui.ArrayCollection(cfg.reward)
        let isGet = FuncOpenModel.ins().GetRewardState(this._curIdx) == RewardState.Gotten
        this.m_imgGet.visible = isGet
        this.m_btnGet.visible = !isGet
        this._initRoleShow(cfg)
        if (this.scrollerLab && this.scrollerLab.viewport) {
            this.scrollerLab.viewport.scrollV = 0
        }
        if (FuncOpenModel.ins().GetRewardState(this._curIdx) == RewardState.CanGet) {
            this.m_btnGet["redPoint"].visible = true
        } else {
            this.m_btnGet["redPoint"].visible = false
        }
    }
    private _onGet(): void {
        let data = GlobalConfig.funcNoticeConfig[this._curIdx]
        if (FuncOpenModel.Check(data.openLv[0], data.openLv[1])) {
            FuncOpenModel.ins().SendGetFuncOpen(this._curIdx)
        } else {
            UserTips.ins().showTips(GlobalConfig.jifengTiaoyueLg.st101271)
        }
    }
    private _initRoleShow(cfg: any): void {
        if (cfg.movieBody || cfg.movieMounts || cfg.movieWeapon || cfg.movieWing) {
            let role = SubRoles.ins().getSubRoleByIndex(0);
            this.roleShowPanel.creatAnim(role);
            this.roleShowPanel.setCharSexJob(role.sex, role.job, cfg.movieBody, cfg.movieWeapon, cfg.movieMounts, cfg.movieWing)
            this.roleShowPanel.visible = true
            this.m_groupMc.visible = false
        } else if (cfg.moviePet) {
            this.roleShowPanel.visible = false
            this.m_groupMc.visible = true
            if (this._mc == null) {
                this._mc = new MovieClip
                this._mc.x = this.m_groupMc.width / 2
                this._mc.y = this.m_groupMc.height / 2
                this.m_groupMc.addChild(this._mc)
            }
            this._mc.loadUrl(ResDataPath.GetMonsterBodyPath(cfg.moviePet + "_3" + EntityAction.STAND), true, -1);
        }

    }

    updateRedPoint() {
        if (FuncOpenModel.ins().GetRewardState(this._curIdx) != RewardState.CanGet) {
            let keys = Object.keys(GlobalConfig.ins("FuncNoticeConfig"));
            let index = null;
            for (var i = 0; i < keys.length; i++) {
                let idx = parseInt(keys[i])
                if (FuncOpenModel.ins().GetRewardState(idx) == RewardState.CanGet) {
                    index = idx;
                    break;
                }
            }
            if (index) {
                GrowUpRoadWin.selectIndex = index - 1;
            }
            this.setScrollerPoint();
        }
        this._updateView();
        this._listData.replaceAll(Object.keys(GlobalConfig.funcNoticeConfig))
    };

    private setScrollerPoint() {
        let point: number = 0;
        if (GrowUpRoadWin.selectIndex >= this._listData.source.length - 4.8) {
            point = this._listData.source.length - 4.8
        } else {
            point = GrowUpRoadWin.selectIndex
        }
        if (this.scroller && this.scroller.viewport) {
            this.scroller.viewport.scrollH = point * (68 + 6);
        }
    }



}
ViewManager.ins().reg(GrowUpRoadWin, LayerManager.UI_Main);
window["GrowUpRoadWin"] = GrowUpRoadWin