class ShareMissionModel {
	private static s_instance: ShareMissionModel;
	public static get getInstance(): ShareMissionModel {
		if (!ShareMissionModel.s_instance) {
			ShareMissionModel.s_instance = new ShareMissionModel();
		}
		return ShareMissionModel.s_instance;
	}
	/**显示的任务id */
	public missionShareId: number = 2;
	/**任务状态 */
	public missionShareState: number = 0;
}

window["ShareMissionModel"] = ShareMissionModel 