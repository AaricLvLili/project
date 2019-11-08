class ZhuanZhiTfInfo {
	/**角色索引*/
	public roleid = 0;
	/**角色索引*/
	public power = 0;
	/**转职任务状态列表*/
	public list:Array<Sproto.zhuanzhi_talent_info> = [];

	parse(info: Sproto.zhuanzhi_talent_list) {
		if(info)
		{
			this.roleid = info.roleid;
			this.power = info.power;
			this.list = info.list;
		}
	}
}
window["ZhuanZhiTfInfo"]=ZhuanZhiTfInfo