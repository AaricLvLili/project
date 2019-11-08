/**队伍信息 */
class TeamPlayerData {
	public constructor() {
	}
	/**是否队长 */
	public isLadder: boolean = false;
	/**玩家名字 */
	public name: string;
	/**玩家等级 */
	public lv: number;
	/**玩家转生等级 */
	public zslv: number;
	/**战斗力 */
	public power: number;
	/**职业 */
	public job: number;
	/**性别 */
	public sex: number;

	public dbid:number;
	public serverId:number;
	public teamId:number;
}
window["TeamPlayerData"] = TeamPlayerData