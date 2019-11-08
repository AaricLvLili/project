class IRedPoint {

	public mInValid: boolean = false

	public constructor() {
		// RedPointMgr.Add(this)
	}

	public Init(): boolean {
		return true
	}

    /**
	 * 事件定义
	 */
	public GetMessageDef(): string[] {
		return []
	}

	public IsRed(): boolean {
		return false
	}

	public IsRedByRole(roleIndex: number): boolean {
		return false
	}

	public DoUpdate(type: string): void {

	}

	protected _CheckArray(array: any[]): boolean {
        for (let data of array) {
			if (this._CheckSinge(data)) {
				return true
			}
		}
		return false
	}

	protected _CheckArrayIndex(index: number, array: any[]): boolean {
		let data = array[index]
		if (!data) {
			return false
		}
		return this._CheckSinge(data)
	}

	protected _CheckSinge(data: any): boolean {
		for (let key in data) {
			if (data[key]) {
				return true
			}
		}
		return false
	}
}
window["IRedPoint"]=IRedPoint