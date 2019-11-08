class CommonDialog extends eui.Component implements  eui.UIComponent {

	private static SHOW_DIALOG_LIST: CommonDialog[] = []

	public dialogCloseBtn: eui.Button
	public dialogReturnBtn: eui.Button
	private cacheReturnBtn: eui.Button

	
	private dialogMask: eui.Image
	private titleLabel: eui.Label;

	private m_HideBtn: boolean
	private m_Target: BaseView
	private m_TopBtn: boolean

	private m_Title: string

	public notClickMask: boolean
	public mCallback: Function

	public set title(value) {
		this.m_Title = value
		this._UpdateTitle()
	}

	public set hideBtn(value) {
		this.m_HideBtn = true
	}

	public set topBtn(value) {
		this.m_TopBtn = true
	}

	private _UpdateTitle(): void {
		if (this.titleLabel && this.m_Title && this.$stage) {
			this.titleLabel.text = this.m_Title
		}
	}

	public SetReturnButton(btn: eui.Button): void {
		if (!btn) {
			if (this.cacheReturnBtn) {
				this.dialogReturnBtn = this.cacheReturnBtn
				this.dialogReturnBtn.visible = true
				this.cacheReturnBtn = null
			}
			return
		}
        if (this.dialogReturnBtn) {
			this.cacheReturnBtn = this.dialogReturnBtn
			this.dialogReturnBtn.visible = false
		}
		this.dialogReturnBtn = btn
	}

	public constructor() {
		super();
	}

	protected partAdded(partName:string,instance:any):void
	{
		super.partAdded(partName,instance);
	}

	private m_TempTimer: Timer

	protected childrenCreated():void
	{
		super.childrenCreated();
		this._UpdateTitle()
		if (this.m_HideBtn) {
			this.dialogCloseBtn.visible = false
		}
		if (this.m_TopBtn && this.parent) {
			this.m_TempTimer = Timer.TimeOut(()=>{
				DisplayUtils.SetParent(this.dialogReturnBtn, this.parent as any)
			}, 50)
		}
	}

	public OnAdded(target: BaseView): void {
		for (let item of CommonDialog.SHOW_DIALOG_LIST) {
			if (item == this) {
				continue
			}
			item.dialogMask.visible = false
		}

		CommonDialog.SHOW_DIALOG_LIST.push(this)

		this.m_Target = target

        if (this.dialogCloseBtn) {
			this.dialogCloseBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnClick, this)
		}
		if (this.dialogReturnBtn) {
			this.dialogReturnBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnClick, this)
		}
		this.dialogMask.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnClick, this)
	}

	public OnRemoved(): void {
		for (let i = CommonDialog.SHOW_DIALOG_LIST.length - 1; i >= 0 ; --i) {
			let item = CommonDialog.SHOW_DIALOG_LIST[i]
			if (item == null || item == this) {
				CommonDialog.SHOW_DIALOG_LIST.splice(i, 1)
			} else {
				item.dialogMask.visible = true
				break
			}
		}

		if (this.dialogReturnBtn) {
			this.dialogReturnBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this._OnClick, this)
		}
		if (this.dialogCloseBtn) {
			this.dialogCloseBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this._OnClick, this)
		}
		this.dialogMask.removeEventListener(egret.TouchEvent.TOUCH_TAP, this._OnClick, this)

		if (this.m_TempTimer) {
			this.m_TempTimer.Stop()
		}
	}

	private _Close(): void {
		if (this.mCallback) {
			this.mCallback()
			return
		}
		if (this.m_Target) {
			ViewManager.ins().close(this.m_Target) 
		}
	}

	private _OnClick(e: egret.TouchEvent): void {
		if (this.dialogReturnBtn && e.currentTarget == this.dialogReturnBtn) {
			this._Close()
		}
		if (this.m_HideBtn) {
			return
		}
		switch (e.currentTarget) {
			case this.dialogMask:
				if (this.notClickMask) {
					break
				}
			case this.dialogCloseBtn:
				this._Close()
			break;
		}
	}
}
window["CommonDialog"]=CommonDialog