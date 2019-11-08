class GlobalConfig {
    public static zipObj: JSZipObject;

    public static config1: any;
    public static config2: any;
    public static config3: any;
    public static config4: any;
    public static config5: any;
    public static config6: any;
    public static config7: any;
    public static config8: any;
    public static config9: any;
    public static config10: any;

    public static testItemCheck = false;

    /**多语言国际化*/
    private static _languageConfig: any;
    public static get jifengTiaoyueLg(): any {
        if (!GlobalConfig._languageConfig) {
            // let type = GlobalConfig.ins("MultilingualBase").configid;
            // if (type == 0)
            GlobalConfig._languageConfig = GlobalConfig.ins("multilingual");
            // else if (type == 1) {
            //     GlobalConfig._languageConfig = GlobalConfig.ins("TraditionalLanguage");
            // } else {
            //     GlobalConfig._languageConfig = GlobalConfig.ins("JapaneseLanguage");
            // }
        }
        return GlobalConfig._languageConfig;
    }

    /**物品表*/
    private static _itemConfig: any;
    public static get itemConfig(): any {
        if (GlobalConfig._itemConfig == null)
            GlobalConfig._itemConfig = GlobalConfig.ins("ItemConfig");

        // if(GlobalConfig._itemConfig == null)
        // Main.errorBack("物品配置表解析错误");

        return GlobalConfig._itemConfig;
    }

    private static GamePlayConfig: any;

    public static getGamePlayConfigByType(page: number): any {
        if (GlobalConfig.GamePlayConfig == null)
            GlobalConfig.GamePlayConfig = GlobalConfig.ins("GamePlayConfig");
        var tempArray = [];
        var obj;
        for (var key in GlobalConfig.GamePlayConfig) {
            obj = GlobalConfig.GamePlayConfig[key];
            if (obj.type == page) {
                tempArray.push(obj);
            }
        }
        return tempArray;
    }


    /**特效叠加表*/
    private static _effAddConfig: any;
    public static skillAddOneConfig: any;
    public static hasEffAddSkill(effectId): any {
        if (effectId == null) return;
        if (GlobalConfig._effAddConfig == null)
            GlobalConfig._effAddConfig = GlobalConfig.ins("AddOneConfig");
        if (GlobalConfig._effAddConfig == null)
            return null;
        if (GlobalConfig.skillAddOneConfig == null)
            GlobalConfig.skillAddOneConfig = [];

        GlobalConfig.skillAddOneConfig.forEach((param) => {
            if (param.nId == effectId)
                return param;
        });
        var obj;
        for (var key in GlobalConfig._effAddConfig) {
            obj = GlobalConfig._effAddConfig[key];
            if (obj.typeID != EffectAddType.EFF_TYPE_SKILL)
                continue;
            if (obj.nId == effectId) {
                GlobalConfig.skillAddOneConfig.push(obj);
                return obj;
            }
        }

        return null;
    }
    /**可熔炼装备表 */
    private static _smeltequipConfig: any;
    public static get smeltequipConfig(): any {
        if (GlobalConfig._smeltequipConfig == null)
            GlobalConfig._smeltequipConfig = GlobalConfig.ins("SmeltConfig");
        return GlobalConfig._smeltequipConfig;
    }
    /**装备点分解表 */
    private static _equipPointResolveConfig: any;
    public static get equipPointResolveConfig(): any {
        if (GlobalConfig._equipPointResolveConfig == null)
            GlobalConfig._equipPointResolveConfig = GlobalConfig.ins("EquipPointResolveConfig");
        return GlobalConfig._equipPointResolveConfig;
    }
    /**怪物表*/
    private static _monstersConfig: any;
    public static get monstersConfig(): any {
        if (GlobalConfig._monstersConfig == null)
            GlobalConfig._monstersConfig = GlobalConfig.ins("MonstersConfig");
        return GlobalConfig._monstersConfig;
    }

    /**装备表*/
    private static _equipConfig: any;
    public static get equipConfig(): any {
        if (GlobalConfig._equipConfig == null)
            GlobalConfig._equipConfig = GlobalConfig.ins("EquipConfig");
        return GlobalConfig._equipConfig;
    }

    /**ChaptersCommonConfig表*/
    private static _chaptersCommonConfig: any;
    public static get chaptersCommonConfig(): any {
        if (GlobalConfig._chaptersCommonConfig == null)
            GlobalConfig._chaptersCommonConfig = GlobalConfig.ins("ChaptersCommonConfig");
        return GlobalConfig._chaptersCommonConfig;
    }

    /**JingMaiLevelConfig表*/
    private static _jingMaiLevelConfig: any;
    public static get jingMaiLevelConfig(): any {
        if (GlobalConfig._jingMaiLevelConfig == null)
            GlobalConfig._jingMaiLevelConfig = GlobalConfig.ins("JingMaiLevelConfig");
        return GlobalConfig._jingMaiLevelConfig;
    }

    /**DailyFubenConfig表*/
    private static _dailyFubenConfig: any;
    public static get dailyFubenConfig(): any {
        if (GlobalConfig._dailyFubenConfig == null)
            GlobalConfig._dailyFubenConfig = GlobalConfig.ins("DailyFubenConfig");
        return GlobalConfig._dailyFubenConfig;
    }

    private static _clientGlobalConfig: any;
    public static get clientGlobalConfig(): any {
        if (GlobalConfig._clientGlobalConfig == null)
            GlobalConfig._clientGlobalConfig = GlobalConfig.ins("ClientGlobalConfig");
        return GlobalConfig._clientGlobalConfig;
    }

    private static _effectConfig: any;
    public static get effectConfig(): any {
        if (GlobalConfig._effectConfig == null)
            GlobalConfig._effectConfig = GlobalConfig.ins("EffectConfig");
        return GlobalConfig._effectConfig;
    }

    /**guildfbconfig表*/
    private static _guildfbconfig: any;
    public static get guildfbconfig(): any {
        if (GlobalConfig._guildfbconfig == null)
            GlobalConfig._guildfbconfig = GlobalConfig.ins("guildfbconfig");
        return GlobalConfig._guildfbconfig;
    }

    /**PublicBossConfig*/
    private static _publicBossConfig: any;
    public static get publicBossConfig(): any {
        if (GlobalConfig._publicBossConfig == null)
            GlobalConfig._publicBossConfig = GlobalConfig.ins("PublicBossConfig");
        return GlobalConfig._publicBossConfig;
    }

    /**KuafuBossConfig*/
    private static _kuafuBossConfig: any;
    public static get kuafuBossConfig(): any {
        if (GlobalConfig._kuafuBossConfig == null)
            GlobalConfig._kuafuBossConfig = GlobalConfig.ins("KuafuBossConfig");
        return GlobalConfig._kuafuBossConfig;
    }

    /**robberfbconfig表*/
    private static _robberfbconfig: any;
    public static get robberfbconfig(): any {
        if (GlobalConfig._robberfbconfig == null)
            GlobalConfig._robberfbconfig = GlobalConfig.ins("robberfbconfig");
        return GlobalConfig._robberfbconfig;
    }

    /**SkillsConfig*/
    private static _skillsConfig: any;
    public static get skillsConfig(): any {
        if (GlobalConfig._skillsConfig == null)
            GlobalConfig._skillsConfig = GlobalConfig.ins("SkillsConfig");
        return GlobalConfig._skillsConfig;
    }

    /**ZhuanShengLevelConfig*/
    private static _zhuanShengLevelConfig: any;
    public static get zhuanShengLevelConfig(): any {
        if (GlobalConfig._zhuanShengLevelConfig == null)
            GlobalConfig._zhuanShengLevelConfig = GlobalConfig.ins("ZhuanShengLevelConfig");
        return GlobalConfig._zhuanShengLevelConfig;
    }

    /**WingLevelConfig*/
    private static _wingLevelConfig: any;
    public static get wingLevelConfig(): any {
        if (GlobalConfig._wingLevelConfig == null)
            GlobalConfig._wingLevelConfig = GlobalConfig.ins("WingLevelConfig");
        return GlobalConfig._wingLevelConfig;
    }

    /**FbChallengeConfig*/
    private static _fbChallengeConfig: any;
    public static get fbChallengeConfig(): any {
        if (GlobalConfig._fbChallengeConfig == null)
            GlobalConfig._fbChallengeConfig = GlobalConfig.ins("FbChallengeConfig");
        return GlobalConfig._fbChallengeConfig;
    }

    /**SkillPowerConfig*/
    private static _skillPowerConfig: any;
    public static get skillPowerConfig(): any {
        if (GlobalConfig._skillPowerConfig == null)
            GlobalConfig._skillPowerConfig = GlobalConfig.ins("SkillPowerConfig");
        return GlobalConfig._skillPowerConfig;
    }

    /**WingStarConfig*/
    private static _wingStarConfig: any;
    public static get wingStarConfig(): any {
        if (GlobalConfig._wingStarConfig == null)
            GlobalConfig._wingStarConfig = GlobalConfig.ins("WingStarConfig");
        return GlobalConfig._wingStarConfig;
    }

    /**WelfareConfig*/
    private static _welfareConfig: any;
    public static get welfareConfig(): any {
        if (GlobalConfig._welfareConfig == null)
            GlobalConfig._welfareConfig = GlobalConfig.ins("WelfareConfig");
        return GlobalConfig._welfareConfig;
    }

    /**PublicSpeRRConfig*/
    private static _publicSpeRRConfig: any;
    public static get publicSpeRRConfig(): any {
        if (GlobalConfig._publicSpeRRConfig == null)
            GlobalConfig._publicSpeRRConfig = GlobalConfig.ins("PublicSpeRRConfig");
        return GlobalConfig._publicSpeRRConfig;
    }

    /**LegendLevelupConfig*/
    private static _legendLevelupConfig: any;
    public static get legendLevelupConfig(): any {
        if (GlobalConfig._legendLevelupConfig == null)
            GlobalConfig._legendLevelupConfig = GlobalConfig.ins("LegendLevelupConfig");
        return GlobalConfig._legendLevelupConfig;
    }

    /**LongzhuangLevelConfig*/
    private static _longzhuangLevelConfig: any;
    public static get longzhuangLevelConfig(): any {
        if (GlobalConfig._longzhuangLevelConfig == null)
            GlobalConfig._longzhuangLevelConfig = GlobalConfig.ins("LongzhuangLevelConfig");
        return GlobalConfig._longzhuangLevelConfig;
    }

    /**EquipPointBasicConfig*/
    private static _equipPointBasicConfig: any;
    public static get equipPointBasicConfig(): any {
        if (GlobalConfig._equipPointBasicConfig == null)
            GlobalConfig._equipPointBasicConfig = GlobalConfig.ins("EquipPointBasicConfig");
        return GlobalConfig._equipPointBasicConfig;
    }

    /**MiJiSkillConfig*/
    private static _miJiSkillConfig: any;
    public static get miJiSkillConfig(): any {
        if (GlobalConfig._miJiSkillConfig == null)
            GlobalConfig._miJiSkillConfig = GlobalConfig.ins("MiJiSkillConfig");
        return GlobalConfig._miJiSkillConfig;
    }

    /**MiJiGridConfig*/
    private static _miJiGridConfig: any;
    public static get miJiGridConfig(): any {
        if (GlobalConfig._miJiGridConfig == null)
            GlobalConfig._miJiGridConfig = GlobalConfig.ins("MiJiGridConfig");
        return GlobalConfig._miJiGridConfig;
    }

    /**MeridianLevelConfig*/
    private static _meridianLevelConfig: any;
    public static get meridianLevelConfig(): any {
        if (GlobalConfig._meridianLevelConfig == null)
            GlobalConfig._meridianLevelConfig = GlobalConfig.ins("MeridianLevelConfig");
        return GlobalConfig._meridianLevelConfig;
    }

    /**MeridianStageConfig*/
    private static _meridianStageConfig: any;
    public static get meridianStageConfig(): any {
        if (GlobalConfig._meridianStageConfig == null)
            GlobalConfig._meridianStageConfig = GlobalConfig.ins("MeridianStageConfig");
        return GlobalConfig._meridianStageConfig;
    }

    /**TransferTalentConfig*/
    private static _transferTalentConfig: any;
    public static get transferTalentConfig(): any {
        if (GlobalConfig._transferTalentConfig == null)
            GlobalConfig._transferTalentConfig = GlobalConfig.ins("TransferTalentConfig");
        return GlobalConfig._transferTalentConfig;
    }

    public static ins(className: string) {
        if (GlobalConfig.config1 && GlobalConfig.config1[className])
            return GlobalConfig.config1[className];

        if (GlobalConfig.config2 && GlobalConfig.config2[className])
            return GlobalConfig.config2[className];

        if (GlobalConfig.config4 && GlobalConfig.config4[className])
            return GlobalConfig.config4[className];

        if (GlobalConfig.config3 && GlobalConfig.config3[className])
            return GlobalConfig.config3[className];

        if (GlobalConfig.config5 && GlobalConfig.config5[className])
            return GlobalConfig.config5[className];

        if (GlobalConfig.config6 && GlobalConfig.config6[className])
            return GlobalConfig.config6[className];

        if (GlobalConfig.config7 && GlobalConfig.config7[className])
            return GlobalConfig.config7[className];

        if (GlobalConfig.config8 && GlobalConfig.config8[className])
            return GlobalConfig.config8[className];
        if (GlobalConfig.config9 && GlobalConfig.config9[className])
            return GlobalConfig.config9[className];

        if (GlobalConfig.config10 && GlobalConfig.config10[className])
            return GlobalConfig.config10[className];

        // Main.errorBack("配置表["+className+"]不存在");

        return null;
    }

    /**F */
    /**F-分享活动 */
    /**首次分享 */
    private static _share1Config: any;
    public static get share1Config(): any {
        if (GlobalConfig._share1Config == null)
            GlobalConfig._share1Config = GlobalConfig.ins("Share1Config");
        return GlobalConfig._share1Config;
    }
    /**每日分享 */
    private static _share2Config: any;
    public static get share2Config(): any {
        if (GlobalConfig._share2Config == null)
            GlobalConfig._share2Config = GlobalConfig.ins("Share2Config");
        return GlobalConfig._share2Config;
    }
    /**累计分享 */
    private static _share3Config: any;
    public static get share3Config(): any {
        if (GlobalConfig._share3Config == null)
            GlobalConfig._share3Config = GlobalConfig.ins("Share3Config");
        return GlobalConfig._share3Config;
    }
    /**好友帮助 */
    private static _share4Config: any;
    public static get share4Config(): any {
        if (GlobalConfig._share4Config == null)
            GlobalConfig._share4Config = GlobalConfig.ins("Share4Config");
        return GlobalConfig._share4Config;
    }
    /**分享商店 */
    private static _share5Config: any;
    public static get share5Config(): any {
        if (GlobalConfig._share5Config == null)
            GlobalConfig._share5Config = GlobalConfig.ins("Share5Config");
        return GlobalConfig._share5Config;
    }
    /**分享图片 */
    private static _share6Config: any;
    public static get share6Config(): any {
        if (GlobalConfig._share6Config == null)
            GlobalConfig._share6Config = GlobalConfig.ins("Share6Config");
        return GlobalConfig._share6Config;
    }
    /**分享BUFF */
    private static _share7Config: any;
    public static get share7Config(): any {
        if (GlobalConfig._share7Config == null)
            GlobalConfig._share7Config = GlobalConfig.ins("Share7Config");
        return GlobalConfig._share7Config;
    }
    /**F-服务器提示配置 */
    private static _serverTips: any;
    public static get serverTips(): any {
        if (GlobalConfig._serverTips == null)
            GlobalConfig._serverTips = GlobalConfig.ins("ServerTips");
        return GlobalConfig._serverTips;
    }
    /**F-符文 */
    private static _fuwenLevelConfig: any;
    public static get fuwenLevelConfig(): any {
        if (GlobalConfig._fuwenLevelConfig == null)
            GlobalConfig._fuwenLevelConfig = GlobalConfig.ins("FuwenLevelConfig");
        return GlobalConfig._fuwenLevelConfig;
    }


    private static _funcNoticeConfig: any;
    public static get funcNoticeConfig(): any {
        if (GlobalConfig._funcNoticeConfig == null)
            GlobalConfig._funcNoticeConfig = GlobalConfig.ins("FuncNoticeConfig");
        return GlobalConfig._funcNoticeConfig;
    }
    //每日直购
    private static _activityType302Config: any;
    public static get activityType302Config(): any {
        if (GlobalConfig._activityType302Config == null)
            GlobalConfig._activityType302Config = GlobalConfig.ins("ActivityType302Config")[302];
        return GlobalConfig._activityType302Config;
    }

    //加点
    private static _zhuanShengValuePointConfig: any;
    public static get zhuanShengValuePointConfig(): any {
        if (GlobalConfig._zhuanShengValuePointConfig == null)
            GlobalConfig._zhuanShengValuePointConfig = GlobalConfig.ins("ZhuanShengValuePointConfig");
        return GlobalConfig._zhuanShengValuePointConfig;
    }

    //音效
    private static _soundConfig: any;
    public static get soundConfig(): any {
        if (GlobalConfig._soundConfig == null)
            GlobalConfig._soundConfig = GlobalConfig.ins("soundConfig");
        return GlobalConfig._soundConfig;
    }

    /**装扮id */
    private static _zhuangBanId: any;
    public static get zhuangBanId(): any {
        if (GlobalConfig._zhuangBanId == null)
            GlobalConfig._zhuangBanId = GlobalConfig.ins("ZhuangBanId")
        return GlobalConfig._zhuangBanId;
    }

    /**C-场景配置表 */
    private static _scenesConfig: any;
    public static get scenesConfig(): any {
        if (GlobalConfig._scenesConfig == null)
            GlobalConfig._scenesConfig = GlobalConfig.ins("ScenesConfig");
        return GlobalConfig._scenesConfig;
    }

    /**挂机关卡表 */
    private static _chaptersConfig: any;
    public static get chaptersConfig(): any {
        if (GlobalConfig._chaptersConfig == null)
            GlobalConfig._chaptersConfig = GlobalConfig.ins("ChaptersConfig");
        return GlobalConfig._chaptersConfig;
    }

    /**活动配置1幸运转盘 */
    private static _activityType17Config: any;
    public static get activityType17Config(): any {
        if (GlobalConfig._activityType17Config == null)
            GlobalConfig._activityType17Config = GlobalConfig.ins("ActivityType17Config");
        return GlobalConfig._activityType17Config;
    }
    /**活动配置3幸运转盘 */
    private static _activityType17AConfig: any;
    public static get activityType17AConfig(): any {
        if (GlobalConfig._activityType17AConfig == null)
            GlobalConfig._activityType17AConfig = GlobalConfig.ins("ActivityType17AConfig");
        return GlobalConfig._activityType17AConfig;
    }
    /**活动配置2幸运转盘 */
    private static _activityType17BConfig: any;
    public static get activityType17BConfig(): any {
        if (GlobalConfig._activityType17BConfig == null)
            GlobalConfig._activityType17BConfig = GlobalConfig.ins("ActivityType17BConfig");
        return GlobalConfig._activityType17BConfig;
    }
    /**活动配置1达标排行 */
    private static _activityType4Config: any;
    public static get activityType4Config(): any {
        if (GlobalConfig._activityType4Config == null)
            GlobalConfig._activityType4Config = GlobalConfig.ins("ActivityType4Config");
        return GlobalConfig._activityType4Config;
    }
    /**活动配置3达标排行 */
    private static _activityType4AConfig: any;
    public static get activityType4AConfig(): any {
        if (GlobalConfig._activityType4AConfig == null)
            GlobalConfig._activityType4AConfig = GlobalConfig.ins("ActivityType4AConfig");
        return GlobalConfig._activityType4AConfig;
    }

    /**活动配置2达标排行 */
    private static _activityType4BConfig: any;
    public static get activityType4BConfig(): any {
        if (GlobalConfig._activityType4BConfig == null)
            GlobalConfig._activityType4BConfig = GlobalConfig.ins("ActivityType4BConfig");
        return GlobalConfig._activityType4BConfig;
    }

    /**H-活动配置1 */
    /**活动配置1总表 */
    private static _activityConfig: any;
    public static get activityConfig(): any {
        if (GlobalConfig._activityConfig == null)
            GlobalConfig._activityConfig = GlobalConfig.ins("ActivityConfig");
        return GlobalConfig._activityConfig;
    }

    /**H-活动配置3 */
    /**活动配置3活动总表 */
    private static _activityAConfig: any;
    public static get activityAConfig(): any {
        if (GlobalConfig._activityAConfig == null)
            GlobalConfig._activityAConfig = GlobalConfig.ins("ActivityAConfig");
        return GlobalConfig._activityAConfig;
    }

    /**H-活动配置2 */
    /**活动配置2活动总表 */
    private static _activitySumConfig: any;
    public static get activitySumConfig(): any {
        if (GlobalConfig._activitySumConfig == null)
            GlobalConfig._activitySumConfig = GlobalConfig.ins("ActivitySumConfig");
        return GlobalConfig._activitySumConfig;
    }

}

window["GlobalConfig"] = GlobalConfig