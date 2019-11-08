class DailyFubenConfig {
    private static dailyFubenConfig:any;
	/**  获取个人boss配置列表 */
    public static getPersonalBossFbIds  () {
        var result = [];
        if(this.dailyFubenConfig == null)
            this.dailyFubenConfig = GlobalConfig.dailyFubenConfig;
        for (var i in this.dailyFubenConfig) {
            var c = this.dailyFubenConfig[i];
            if (c && c.bossId)
                result.push(c);
        }
        return result;
    };
    /** 是否含有该配置 */
    public static isContains  (config) {

        if(this.dailyFubenConfig == null)
            this.dailyFubenConfig = GlobalConfig.dailyFubenConfig;

        for (var i in this.dailyFubenConfig) {
            var c = this.dailyFubenConfig[i];
            if (config == c)
                return true;
        }
        return false;
    };
    /** 是否有可挑战 */
    public static isCanChallenge  () {
        var datas = this.getPersonalBossFbIds();
        var len = datas.length;
        var data;
        var sCount;
        for (var i = 0; i < len; i++) {
            data = datas[i];
            //还没数据不处理
            if (!UserFb.ins().getFbDataById(data.id))
                continue;
            //还有次数
            sCount = UserFb.ins().getFbDataById(data.id).getCount();
            if (sCount > 0) {
                if (data.zsLevel > 0) {
                    if (UserZs.ins().lv >= data.zsLevel)
                        return true;
                }
                else {
                    if (GameLogic.ins().actorModel.level >= data.levelLimit)
                        return true;
                }
            }
        }
        return false;
    };
}
window["DailyFubenConfig"]=DailyFubenConfig