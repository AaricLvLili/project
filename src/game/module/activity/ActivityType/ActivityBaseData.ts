class ActivityBaseData {

	startTime: number
	endTime: number
	openState: number
	id: number
	type: number

	public UpdateBase(rsp: Sproto.activity_base_type) {
		this.startTime = rsp.startTime
		this.endTime = rsp.endTime
		this.openState = rsp.openState
		this.id = rsp.id
		this.type = rsp.type
	}

	record: number = 0

	public GetRecord(index: number): boolean {
		// var n = Math.floor(this.record / Math.pow(2, index)) % 2;
		// return n != 0
		return (this.record & (1 << index)) > 0
	}

	update(e) { }

	canReward() {
		return false
	}

	isOpenActivity(): boolean {
		return false
	}

	init() { }

	get rewardState() {
		return 0
	}

	static sort(e, t) {
		return e.state == RewardState.CanGet && t.state != RewardState.CanGet ? -1 : e.state != RewardState.CanGet && t.state == RewardState.CanGet ? 1 : e.state == RewardState.Gotten && t.state != RewardState.Gotten ? 1 : e.state != RewardState.Gotten && t.state == RewardState.Gotten ? -1 : e.index < t.index ? -1 : e.index > t.index ? 1 : 0
	}

	getRemindTimeString() {
		var e = this
		// let t = Math.max(Math.floor(e.startTime - GameServer.serverTime), 0)
		let t = Math.floor(e.startTime - GameServer.serverTime)
		let i = Math.max(Math.floor(e.endTime - GameServer.serverTime), 0)
		if (t >= 0) return GlobalConfig.jifengTiaoyueLg.st101885;//"活动未开启";
		if (0 >= i) return GlobalConfig.jifengTiaoyueLg.st101289;//"活动已结束";
		var n = Math.floor(i / 86400),
			r = Math.floor(i % 86400 / 3600),
			o = Math.floor(i % 3600 / 60),
			s = n + GlobalConfig.jifengTiaoyueLg.st100006 + r + GlobalConfig.jifengTiaoyueLg.st101518 + o + GlobalConfig.jifengTiaoyueLg.st101519;
		return s
	}

	public isOpenTime(): boolean {
		if (this.endTime == 0) {
			return true
		}
		return this.startTime < GameServer.serverTime && this.endTime > GameServer.serverTime
	}

	public GetSurplusTimeStr(): string {
		return `${this.getRemindTimeString()}`
	}
}
window["ActivityBaseData"]=ActivityBaseData