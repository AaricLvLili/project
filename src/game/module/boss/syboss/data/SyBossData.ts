class SyBossData {
	public id: number; // tag 0
	public hp: number; // tag 1
	public people: number; // tag 2
	public reliveTime: number; // tag 3
	public challengeing: boolean; // tag 4
	public ownerNmae: string; // tag 5
	public runTime:number;

	public get isBossDead() {
		let syBossModel = SyBossModel.getInstance;
		if (this.reliveTime && this.reliveTime > 0) {
			let time = Math.max(0, (this.reliveTime || 0) - GameServer.serverTime)
			if (time > 0) {
				return true;
			}
		}
		return false;
	}
}
window["SyBossData"]=SyBossData