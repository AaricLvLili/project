class SimpleTimeout {

	private m_Timer: number = null

    public SetTimeout<Z>(listener: (this: Z, ...arg) => void, thisObject: Z, delay: number): void {
		this.ClearTimeOut()
		egret.setTimeout(listener, thisObject, delay)
	}

	public ClearTimeOut() {
		if (this.m_Timer) {
			egret.clearTimeout(this.m_Timer)
			this.m_Timer = null
		}
	}
}
window["SimpleTimeout"]=SimpleTimeout