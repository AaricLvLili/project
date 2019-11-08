/**可以进入的房间信息 */
class TeamLadderData {
	public constructor() {
	}
	/**队长名字 */
	public name: string = "";
	/**房间当前人数 */
	public playerNum: number;
	/**房间id */
	public roomId: number;
	/**副本id */
	public fbId: number;
	/**队长job */
	public job: number;
	/**队长sex */
	public sex: number;
}

window["TeamLadderData"] = TeamLadderData