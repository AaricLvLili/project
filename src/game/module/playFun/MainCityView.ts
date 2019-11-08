class MainCityView extends BaseEuiPanel {
    public static LAYER_LEVEL = LayerManager.UI_Main;
    private imgBg: eui.Image;
    private groupTop: eui.Group
    private _startMoveX: number
    //private _touchCount: number
    private _curXCenter: number
    private _bgWidth
    private _stageWidth
    private _moveFlag: boolean;

    public CDkey: eui.Button;
    // public btnYbTurntable: eui.Button;
    public shenmiBtn: eui.Button;
    // public actWIcon: eui.Button;
    public hlqdIcon: eui.Button;
    public zaEgg: eui.Button;
    // public m_LuckIcon: eui.Group;
    public dayOneActivity: eui.Button;
    // public hfhdIcon: eui.Button;
    // public tjhlIcon: eui.Button;
    public shopBtn: eui.Button;
    public feedback: eui.Button;
    public expGold: eui.Button;
    public vip5Btn: eui.Button;
    // public rankBtn: eui.Button;
    public setingBtn: eui.Button;
    private funcOpenGroup: eui.Group
    private rechargeBtn: eui.Button;

    public palyFunBtn: eui.Button;
    public fuBenBtn: eui.Button;
    public GadBtn: eui.Button;
    public bossBtn: eui.Button;
    public guildBtn: eui.Button;
    public ladderBtn: eui.Button;
    public artifactBtn: eui.Button;
    public treasureHuntBtn: eui.Button;

    public scroller: eui.Scroller

    private _posList: Array<number>
    private cloudTweenGroup: egret.tween.TweenGroup;

    private ruleList: RuleIconBase[] = [];
    private ruleEff: { [key: number]: MovieClip } = {};

    private btnInitPoint: egret.Point[] = [];
    public GadBtnGuide: eui.Button;
    public groupCloud: eui.Group;
    public petTreasureBtn: eui.Button;
    public m_GuidePetTreasureBtn: eui.Button;

    public m_CityGroup0: eui.Group;
    public m_InitPointGroup0: eui.Group;
    public m_CityGroup1: eui.Group;
    public m_InitPointGroup1: eui.Group;
    public imgBg0: eui.Image;
    public m_CityGroup2: eui.Group;
    public m_InitPointGroup2: eui.Group;
    public imgBg1: eui.Image;
    public ladderBtn0: eui.Button;
    public m_CityGroup3: eui.Group;
    public m_InitPointGroup3: eui.Group;
    public imgBg2: eui.Image;
    public m_CityGroup4: eui.Group;
    public m_InitPointGroup4: eui.Group;
    public imgBg3: eui.Image;


    private mainBgW: number = 1497;
    private mainBgH: number = 1000;
    public partner: eui.Button;
    public rankBtn: eui.Button;
    public qrcodeBtn: eui.Button;
    mailBtn

    public initUI() {
        super.initUI()
        let self = this;
        self.skinName = "MainCityViewSkin";
        this.scroller.throwSpeed = 0.15;
        if (Main.isLiuhai) {
            this.groupTop.top = 140;
        }
        // this.palyFunBtn["redPoint"].x = 106;
        // this.palyFunBtn["redPoint"].y = 2;

        this.fuBenBtn["redPoint"].x = 70;
        this.fuBenBtn["redPoint"].y = 47;

        this.GadBtn["redPoint"].x = 63;
        this.GadBtn["redPoint"].y = 5;

        this.bossBtn["redPoint"].x = 117;
        this.bossBtn["redPoint"].y = 25;

        this.guildBtn["redPoint"].x = 103;
        this.guildBtn["redPoint"].y = 57;

        this.ladderBtn["redPoint"].x = 67;
        this.ladderBtn["redPoint"].y = 53;

        this.artifactBtn["redPoint"].x = 73;
        this.artifactBtn["redPoint"].y = 64;

        RuleIconBase.thisUpdateCity = self.updateRuleAndSort;
        RuleIconBase.thisObjCity = self;

        // self.ruleList[self.fbBtn.hashCode] = new FbBtnIconRule(self.fbBtn);副本
        // self.ruleList[self.ladderBtn.hashCode] = new LadderBtnIconRule(self.ladderBtn);竞技
        self.ruleList[self.CDkey.hashCode] = new CDkeyIconRule(self.CDkey);//福利
        //self.ruleList[self.taskTraceBtn.hashCode] = new TaskTraceIconRule(self.taskTraceBtn);任务提示

        self.ruleList[self.partner.hashCode] = new PartnerIconRule(self.partner);//伙伴
        self.ruleList[self.expGold.hashCode] = new ExpGoldIconRule(self.expGold);
        //self.ruleList[self.activityBtn.hashCode] = new ActivityIconRule(self.activityBtn)//活动、开服
        // self.ruleList[self.actWIcon.hashCode] = new ActivityWIconRule(self.actWIcon)//庆典
        self.ruleList[self.hlqdIcon.hashCode] = new ActivityHlqdIconRule(self.hlqdIcon)//欢乐庆典
        // self.ruleList[self.hfhdIcon.hashCode] = new ActivityHfhdIconRule(self.hfhdIcon)
        // self.ruleList[self.tjhlIcon.hashCode] = new ActivityTjhlIconRule(self.tjhlIcon)

        self.ruleList[self.funcOpenGroup.hashCode] = new FuncOpenIconRule(self.funcOpenGroup)

        // self.ruleList[self.btnYbTurntable.hashCode] = new YbTurntableIconRule(self.btnYbTurntable)//转盘

        self.ruleList[self.petTreasureBtn.hashCode] = new PetTreasureIconRule(self.petTreasureBtn)
        self.ruleList[self.vip5Btn.hashCode] = new VIP5IconRule(self.vip5Btn)

        //self.ruleList[self.ringIcon.hashCode] = new RingIconRule(self.ringIcon)防御特戒
        self.ruleList[self.shenmiBtn.hashCode] = new ShenmiIconRule(self.shenmiBtn);
        self.ruleList[self.zaEgg.hashCode] = new ZaEggIconRule(self.zaEgg);
        self.ruleList[self.dayOneActivity.hashCode] = new DayOneActivityIconRule(self.dayOneActivity);
        self.ruleList[self.feedback.hashCode] = new FeedbackIconRule(self.feedback);
        // self.ruleList[self.m_LuckIcon.hashCode] = new LuckIconRule(self.m_LuckIcon);
        self.ruleList[self.setingBtn.hashCode] = new SetingIconRule(self.setingBtn);
        self.ruleList[self.shopBtn.hashCode] = new ShopIconRule(self.shopBtn);
        self.ruleList[this.rechargeBtn.hashCode] = new FirstRecharge1IconRule(this.rechargeBtn)

        self.ruleList[self.GadBtn.hashCode] = new GadIconRule(self.GadBtn);
        self.ruleList[self.ladderBtn.hashCode] = new LadderBtnIconRule(self.ladderBtn);
        self.ruleList[self.palyFunBtn.hashCode] = new GamePlayIconRule(self.palyFunBtn);
        self.ruleList[self.guildBtn.hashCode] = new GuildIconRule(self.guildBtn);
        self.ruleList[self.bossBtn.hashCode] = new BossIconRule(self.bossBtn);
        self.ruleList[self.artifactBtn.hashCode] = new ArtifactIconRule(self.artifactBtn);
        self.ruleList[self.fuBenBtn.hashCode] = new FbBtnIconRule(self.fuBenBtn);
        this.ruleList[this.rankBtn.hashCode] = new RankingBtnIcon(this.rankBtn);//排行榜
        this.ruleList[this.qrcodeBtn.hashCode] = new QrcodeIconRule(this.qrcodeBtn);
        this.ruleList[this.mailBtn.hashCode] = new MailIconRule(this.mailBtn);
        this.ruleList[this.treasureHuntBtn.hashCode] = new TreasureIconRule(this.treasureHuntBtn)
        this.initMapPoint();
    }

    public initData() {
    }
    public open() {
        let self = this;
        if (self.scroller && self.scroller.viewport) {
            self.scroller.viewport.scrollH = 480
        }
        this.onChangShow();
        this.GadBtnGuide.visible = false;
        this.m_GuidePetTreasureBtn.visible = false;
        this.AddClick(self.groupTop, self._onTouchIcon);
        this.AddClick(self.m_CityGroup1, self._onTouchIcon);
        this.AddClick(self.m_CityGroup2, self._onTouchIcon);
        this.AddClick(self.m_CityGroup3, self._onTouchIcon);
        this.AddClick(self.m_CityGroup4, self._onTouchIcon);
        this.AddClick(this.m_GuidePetTreasureBtn, this.onClickGadGuide2);
        this.AddClick(this.funcOpenGroup, this._onTouchIcon);
        this.scroller.addEventListener(egret.Event.CHANGE, this.onChangShow, this);

        this.onChage();
        self.startUpdateRule();
        self.sortBtnList();
        self._bgWidth = 960
        self._stageWidth = StageUtils.ins().getWidth()
        this.checkGadGuide();
        // SoundManager.ins().playBg(GlobalConfig.soundConfig[3].soundResource + "_mp3");
        let isPlay = SoundSetPanel.getSoundLocalData("soundBg");
        if (isPlay) {
            SoundUtils.getInstance().playSound(GlobalConfig.soundConfig[3].id, -1);
        }
    }
    public close() {
        super.close();
        let self = this;
        this.scroller.removeEventListener(egret.Event.CHANGE, this.onChangShow, this);

        self.removeObserve()
        self.removeEvents()
        self.removeRuleEvent();

        let bottomView = <UIView2>ViewManager.ins().getView(UIView2)
        if (bottomView != null) {
            bottomView.closeNav(UIView2.NAV_CITY)
        }
        let isPlay = SoundSetPanel.getSoundLocalData("soundBg");
        if (isPlay) {
            if (GameMap.IsNoramlLevel() && SoundUtils.getInstance().isSoundPlaying(GlobalConfig.soundConfig[3].id)) {
                SoundUtils.getInstance().playSound(GlobalConfig.soundConfig[1].id, -1);
            } else if (!GameMap.IsNoramlLevel()) {
                SoundUtils.getInstance().playSound(GlobalConfig.soundConfig[2].id, -1);
            } else {
                SoundUtils.getInstance().playSound(GlobalConfig.soundConfig[1].id, -1);
            }
        }
    }
    //起始偏移
    private initMapPoint() {
        this.m_InitPointGroup0.x = -300;
        this.m_InitPointGroup1.x = -250;
        this.m_InitPointGroup2.x = -320;
        this.m_InitPointGroup3.x = 260;
        this.m_InitPointGroup4.x = -112;
    }

    private onChangShow() {
        if (this.scroller && this.scroller.viewport) {
            let num = this.scroller.viewport.scrollH;
            this.m_CityGroup0.x = 0 - num * (-0.8);
            this.m_CityGroup1.x = 0 - num * (-0.5);
            this.m_CityGroup2.x = 0 - num * (0);
            this.m_CityGroup3.x = 0 - num * 0.5;
            this.m_CityGroup4.x = 0 - num * 1;
        }
    }
    private _onTouchIcon(e: egret.TouchEvent): void {
        if (this.ruleList[e.target.hashCode]) {
            this.ruleList[e.target.hashCode].tapExecute();
        }
    }
    private addRuleEvent() {
        var rule;
        for (var i in this.ruleList) {
            rule = this.ruleList[i];
            if (rule.updateMessage) {
                // for (var j = 0; j < rule.updateMessage.length; j++) {
                rule.addEvent();
                // }
            }
        }
    };
    private removeRuleEvent() {
        let self = this;
        for (var _i = 0, _a = self.ruleList; _i < _a.length; _i++) {
            var rule = _a[_i];
            if (rule && rule.updateMessage) {
                for (var j = 0; j < rule.updateMessage.length; j++) {
                    rule.removeEvent();
                }
            }
        }
    };
    private _onTouchDown(e: egret.TouchEvent) {

        let self = this;
        self._startMoveX = e.stageX;
        self._moveFlag = true;
        self._curXCenter = self.horizontalCenter;
        // self._touchCount++;
        this._posList = []
    }
    private _onTouchMove(e: egret.TouchEvent) {

        let self = this;

        if (!this._moveFlag) return

        let length = e.stageX - this._startMoveX
        let nextX = self._curXCenter + length
        if (nextX > (this._bgWidth - this._stageWidth) / 2) return
        if (nextX < -(this._bgWidth - this._stageWidth) / 2) return
        //if (Math.abs(length) < 50) return
        this._posList.push(nextX)
        this._moveMapBg()
    }
    private _onTouchEnd(e: egret.TouchEvent) {
        let self = this;
        self._moveFlag = false;
    }
    private _moveMapBg(): void {
        if (this._posList == [] || this._posList.length == 0) return
        //if (this._moveFlag != null) return
        egret.Tween.removeTweens(this)
        // egret.Tween.removeTweens(this.groupTop)
        let nextPos = this._posList.shift()
        egret.Tween.get(this, {
            "onChange": this._tweenSyncFun,
            "onChangeObj": this
        })
            .to({ horizontalCenter: nextPos }, Math.abs(nextPos - this.horizontalCenter))
            .call(() => {
                this._moveMapBg()
            })
    }
    private _tweenSyncFun(): void {
        let self = this;
        self.groupTop.x = (this._bgWidth - this._stageWidth) / 2 - self.horizontalCenter;
    }

    private updateRuleAndSort(rule: RuleIconBase) {
        this.updateRule(rule);
        // //排序按钮
        this.sortBtnList();
    };
    private startUpdateRule() {
        for (var i in this.ruleList) {
            this.updateRule(this.ruleList[i]);
        }
    };
    private sortBtnList(): void {
        let self = this;
        let idx = 0;
        let col = 6;//列数
        let border = 68;//边长
        for (let i = 0, len = self.groupTop.numChildren; i < len; i++) {
            let item = self.groupTop.getChildAt(i) as egret.DisplayObject
            if (item.name == "rank" || item.name == "online" || item.name == "dailyRechar") {
                continue;//排行榜，每日充值，在线奖励不排序
            }
            if (item.visible) {
                item.x = (idx % col) * border;
                item.y = Math.floor(idx / col) * border;
                idx++;
            }
        }
    }
    private updateRule(rule: RuleIconBase) {
        if (rule == null || rule.tar == null) return;
        let tar = rule.tar;
        let isShow = rule.checkShowIcon();
        let effName;
        let mc;
        let count;
        let icon: string = tar.icon;
        let self = this
        if (isShow) {
            // 显示图标
            // if (tar != self.guanqiaBtn) {
            // 	rule.parentGpuop.addChildAt(tar, rule.layerCount)
            // 	tar.visible = true;
            // }
            if (!tar.parent) {
                this.groupTop.addChild(tar);
            }
            if (tar instanceof eui.Group && tar.name == "luckIcon") {
                let numChilid = tar.numChildren
                for (var i = 0; i < numChilid; i++) {
                    let child = tar.getChildAt(i);
                    if (child.name == "redPoint") {
                        child.visible = rule.checkShowRedPoint();
                    }
                }
            }
            if (tar['redPoint']) {
                if (icon == "ui_zjm_icon_fl")
                    count = self.fuliRedPoint();
                else
                    count = rule.checkShowRedPoint();
                UIHelper.ShowRedPoint(tar, count)
                // tar['redPoint'].visible = count;
                if (tar['count']) {
                    tar['count'].text = count ? count : "";
                }
            }
            if (GameGlobal.actorModel.level >= 3) {
                effName = rule.getEffName(count);
                if (effName) {
                    if (!self.ruleEff[tar.hashCode] || !self.ruleEff[tar.hashCode].parent) {
                        mc = self.getEff(tar.hashCode, effName);
                        mc.x = rule.effX;
                        mc.y = rule.effY;
                        mc.scaleX = mc.scaleY = .7
                        // let index = (tar != self.funcOpenGroup && tar != self.guanqiaBtn && tar != self.m_LuckIcon) ? 1 : 2;
                        // let index = (tar != self.m_LuckIcon) ? 1 : 2;
                        let index = 2;
                        tar.addChildAt(mc, index);
                    }
                    else {
                        self.ruleEff[tar.hashCode].play(-1);
                    }
                }
                else {
                    DisplayUtils.removeFromParent(self.ruleEff[tar.hashCode]);
                }
            }
            //关卡引导
            //TimerManager.ins().doNext(self.showGuanQiaGuide(), self);
        }
        else {
            //rule.DestoryMc()
            DisplayUtils.removeFromParent(tar);
            DisplayUtils.removeFromParent(self.ruleEff[tar.hashCode]);
        }
    };
    /**设置红点显示 */
    private fuliRedPoint() {
        return MoneyTreeModel.ins().isHaveReward() || FindAssetsModel.ins().HasFindAssets() || DayLoginIconRule.ShowRedPoint() || ActivityModel.ins().checkMonthSingRedPoint()
    }
    private getEff(value, effName) {
        let self = this
        if (self.ruleEff[value])
            return self.ruleEff[value];
        self.ruleEff[value] = self.ruleEff[value] || new MovieClip();
        self.ruleEff[value].touchEnabled = false
        if (effName) {
            if (GameGlobal.actorModel.level >= 3) {
                self.ruleEff[value].loadUrl(ResDataPath.GetUIEffePath(effName), true, -1);
            }
        }
        return self.ruleEff[value];
    };

    private checkGadGuide() {
        if (Setting.currPart == 20 && Setting.currStep == 1) {
            this._updateScrollerH(this.GadBtn.x);
            this.GadBtnGuide.visible = true;
            this.GadBtn.visible = false;
            egret.setTimeout(function () {
                GuideUtils.ins().show(this.GadBtnGuide, 20, 1);
                this.GadBtnGuide.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClickGadGuide, this);
            }, this, 100);
        }

        if (Setting.currPart == 14 && Setting.currStep == 1) {
            this.m_GuidePetTreasureBtn.visible = true;
            this.m_GuidePetTreasureBtn.x = 62 * 4 + 480;
            GuideUtils.ins().show(this.m_GuidePetTreasureBtn, 14, 1);
        }
    }
    private _updateScrollerH(posX: number): void {
        if (this.scroller && this.scroller.viewport) {
            this.scroller.viewport.scrollH = 340;
        }
        this.onChangShow();
    }
    private onClickGadGuide() {
        GuideUtils.ins().next(this.GadBtnGuide);
        this.GadBtnGuide.visible = false;
        this.GadBtn.visible = true;
        this.GadBtnGuide.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onClickGadGuide, this);
        if (this.ruleList[this.GadBtn.hashCode]) {
            this.ruleList[this.GadBtn.hashCode].tapExecute();
        }
    }

    private onClickGadGuide2() {
        GuideUtils.ins().next(this.m_GuidePetTreasureBtn);
        this.m_GuidePetTreasureBtn.visible = false;
        ViewManager.ins().open(PetTreasureWin);
    }

    private topNum = 80;
    private GadBtnGuideNum = 429;
    private liHaiAddNum = 35;

    private onChage() {
        let heightP = StageUtils.ins().getHeight() / 800;
        if (heightP > 1) {
            // this.imgBg.width = heightP * this.mainBgW;
            // this.imgBg.height = heightP * this.mainBgH;
            this.scroller.height = heightP * 800;
            let changeY = -((StageUtils.ins().getHeight() - 800) / 2);
            if (Main.isLiuhai) {
                this.scroller.y = changeY + this.liHaiAddNum;
                this.groupTop.top = this.topNum + changeY + this.liHaiAddNum;
                this.GadBtnGuide.y = this.GadBtnGuideNum + changeY + this.liHaiAddNum;
                this.m_GuidePetTreasureBtn.y = this.topNum + changeY + this.liHaiAddNum;
            } else {
                this.scroller.y = changeY
                this.groupTop.top = this.topNum + changeY;
                this.GadBtnGuide.y = this.GadBtnGuideNum + changeY;
                this.m_GuidePetTreasureBtn.y = this.topNum + changeY;
            }
        } else {
            // this.imgBg.y = 0;
            // this.imgBg.width = this.mainBgW;
            // this.imgBg.height = this.mainBgH;
            this.scroller.height = 800;
            this.scroller.y = 0;
            this.groupTop.top = this.topNum;
            this.GadBtnGuide.y = this.GadBtnGuideNum;
            this.m_GuidePetTreasureBtn.y = this.topNum;
        }
    }



}
window["MainCityView"] = MainCityView