class ZhuanZhiTaskInfo {

	/**角色索引*/
	public roleid = 0;
	/**转职等级*/
	public level = 0;
	/**转职任务状态列表*/
	public task: Array<Sproto.zhuanzhi_task> = [];

	parse(info: Sproto.zhuanzhi_task_list) {
		if (info) {
			this.roleid = info.roleid;
			this.level = info.level;
			this.task = info.task;
			LocalStorageData.setItem(LocalDataKey.zhuanzhiLv + "_" + this.roleid, this.level + "");
		}
	}
}
window["ZhuanZhiTaskInfo"] = ZhuanZhiTaskInfo