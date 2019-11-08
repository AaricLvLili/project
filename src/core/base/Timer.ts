class Timer {

	private m_Timer = -1	

	public static TimeOut(func: Function, time: number): Timer {
		let timer = new Timer
		let f = () => {
			if (timer.m_Timer == -1) {
				return
			}
			func()
			timer.m_Timer = -1
		}
		timer.m_Timer = egret.setTimeout(f,this, time);
		return timer
	}

	public Stop() {
		if (this.m_Timer != -1) {
			egret.clearTimeout(this.m_Timer)
		}
		this.m_Timer = -1
	}
}
window["Timer"]=Timer