class FrameTick {
	list: number[] = [];
	tick(idx) {
		this.list[idx] = TimerManager.ins().getFrameId();
	};
	isTick(idx) {
		return this.list[idx] == TimerManager.ins().getFrameId();
	};
	checkAndTick(idx) {
		if (this.isTick(idx)) {
			return true;
		}
		else {
			this.tick(idx);
			return false;
		}
	};
}
window["FrameTick"]=FrameTick