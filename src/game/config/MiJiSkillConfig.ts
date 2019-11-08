class MiJiSkillConfig {
	public static getSkillIDByItem  (itemID) {
        var arr = GlobalConfig.ins("MiJiSkillConfig");
        for (var i in arr) {
            if (arr[i].item == itemID)
                return arr[i].id;
        }
        return -1;
    };

    /**根据心法id获取心法数据*/
	public static getXinFaByItemId (itemID) {
        var config = GlobalConfig.miJiSkillConfig;
		for(var key in config)
		{
			var arr = config[parseInt(key)];
			for(var info of arr)
			{
				if(info.id == itemID)
					return info;
			}		
		}
        return null;
    }


}
window["MiJiSkillConfig"]=MiJiSkillConfig