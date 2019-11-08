class CommonWindowBg extends eui.Component implements eui.UIComponent {

	public constructor() {
		super();
	}

	private m_CommonWindow: ICommonWindow;

	public helpBtn: eui.Button;
	public closeBtn: eui.Button;
	public nameIcon: eui.Label;
	public imgBg: eui.Image;
	private viewStack: eui.ViewStack;
	public returnBtn: eui.Button;
	public tabBar: eui.TabBar;
	private roleSelect: RoleSelectPanel
	private m_CurShowView: ICommonWindowTitle
	private m_TabDatas: eui.ICollection
	private m_OldIndex: number
	private mHelpId = null
	private m_Title: string
	public scroller: eui.Scroller
	public imgNav: eui.Image

	private static EMPTY_CLS = {
		"getCurRole": () => { return 0 },
		"DoOpen": function () { },
		"DoClose": function () { },
		"addEventListener": function () { },
		"removeEventListener": function () { },
		"visible": false,
		"numElements": 0,
		"numChildren": 0,
		"selectedIndex": 0,
		"validateNow": function () { },
		"getElementAt": function () { },
	}

	set title(value) {
		this.m_Title = value
	}

	protected partAdded(partName: string, instance: any): void {
		super.partAdded(partName, instance);
	}

	protected childrenCreated(): void {
		super.childrenCreated();
		this.touchEnabled = false
		if (this.viewStack) {
			this.viewStack.touchEnabled = false
		}
		this.m_TabDatas = this.viewStack

		// 给一个空的对象
		if (this.roleSelect == null) {
			this.roleSelect = <RoleSelectPanel><any>CommonWindowBg.EMPTY_CLS
		}
		if (this.viewStack == null) {
			this.viewStack = <eui.ViewStack><any>CommonWindowBg.EMPTY_CLS
		}
		if (this.tabBar == null) {
			this.tabBar = <eui.TabBar><any>CommonWindowBg.EMPTY_CLS
		}
		this.closeBtn.label = GlobalConfig.jifengTiaoyueLg.st100588;
	}

	private OnTap(touchEvent: egret.TouchEvent): void {
		let target = touchEvent.target
		if (target == this.helpBtn && this.mHelpId) {
			ViewManager.ins().open(ZsBossRuleSpeak, this.mHelpId);
			return
		}
		let clickIndex = 0
		switch (target) {
			case this.returnBtn:
				clickIndex = 0
				GuideUtils.ins().next(this.returnBtn);
				break;
			case this.closeBtn:
				clickIndex = 1
				break;
		}
		if (this.m_CommonWindow && this.m_CommonWindow.OnBackClick) {
			if (this.m_CommonWindow.OnBackClick(clickIndex) == 0) {
				ViewManager.ins().close(this.m_CommonWindow)
			}
		} else {
			ViewManager.ins().close(this.m_CommonWindow)
		}
	}

	private _OnTabTouch(): void {
		let cls = Util.GetClass(this.viewStack.getElementAt(this.tabBar.selectedIndex))
		if (cls && cls.openCheck && !cls.openCheck()) {
			this.tabBar.selectedIndex = this.m_OldIndex
			return
		}
		let bool = this.m_CommonWindow.OnOpenIndex ? this.m_CommonWindow.OnOpenIndex(this.tabBar.selectedIndex) : false
		if (bool) {
			if (this.tabBar.selectedIndex != this.m_OldIndex) {
				this.m_OldIndex = this.tabBar.selectedIndex
				this._UpdateRoleSelectVisible()
				this._UpdateTitle()
				this._UpdateHelpBtn()
				this._SetCurShowView(this._GetCurViewStackElement())
				this._UpdateViewContent()
			}
		} else {
			this.tabBar.selectedIndex = this.m_OldIndex
		}
	}

	public SetTabIndex(index): void {
		this.tabBar.selectedIndex = index
		this.viewStack.selectedIndex = index
		this._OnTabTouch()
	}

	private _OnRoleSelect(): void {
		this._UpdateViewContent()
	}

	private _GetCurViewStackElement(): ICommonWindowTitle {
		let view = this.viewStack.getElementAt(this.tabBar.selectedIndex)
		if (egret.is(view, "ICommonWindowTitle")) {
			return <ICommonWindowTitle><any>view
		} else {
			// console.log(`CommonWindowTitle:_GetCurViewStackElement view is null, index = ${this.tabBar.selectedIndex}`)
		}
		return null
	}

	public GetCurViewStackElement(): any {
		return this.viewStack.getElementAt(this.tabBar.selectedIndex)
	}

	/** 获取viewStack的子元素n*/
	public GetCurViewStackElementByIndex(n: number): any {
		return this.viewStack.getElementAt(n)
	}

	/**
	 * 像福利这种没有设置tabBtn和viewStack，需要手动切换背景图的调用
	 */
	public ActivityWinBgUpdate(bgName: string) {

	}

	/**
	 * 更新界面Title的显示
	 */
	public _UpdateTitle(): void {
		let iconName;
		let bgName;
		let view = this._GetCurViewStackElement()
		if (view) {
			iconName = view.windowTitleIconName
			if (!iconName) {
				iconName = (<egret.DisplayObjectContainer><any>view).name
			}
			bgName = view.windowCommonBg;
		}
		if (!iconName) {
			if (egret.is(this.m_CommonWindow, "ICommonWindowTitle")) {
				iconName = (<ICommonWindowTitle><any>this.m_CommonWindow).windowTitleIconName;
				bgName = (<ICommonWindowTitle><any>this.m_CommonWindow).windowCommonBg;
			}
		}
		if (!iconName) {
			iconName = this.m_Title
		}

		if (iconName && this.nameIcon) {
			iconName = iconName.replace("L", "");
			iconName = iconName.replace("R", "");
			if (egret.is(this.nameIcon, "eui.Label")) {
				(this.nameIcon as eui.Label).text = iconName
			} else {
				(this.nameIcon as any).source = iconName
			}
		}
		if (this.imgBg)
			this.imgBg.source = bgName ? bgName : "base_2_2_04_png";
	}

	/**
	 * 更新界面内容
	 */
	private _UpdateViewContent(): void {
		let view = this._GetCurViewStackElement()
		if (view) {
			view.UpdateContent()
		} else {
			if (egret.is(this.m_CommonWindow, "ICommonWindowTitle")) {
				(<ICommonWindowTitle><any>this.m_CommonWindow).UpdateContent()
			}
		}
	}

	private _CallViewStack(funcName: string): void {
		for (let i = 0; i < this.viewStack.numChildren; ++i) {
			let child = this.viewStack.getElementAt(i)
			if (child != null && child[funcName]) {
				child[funcName]()
			}
		}
	}

	private _SetCurShowView(view: ICommonWindowTitle) {
		if (this.m_CurShowView && this.m_CurShowView["DoClose"]) {
			this.m_CurShowView["DoClose"]()
			this.m_CurShowView = null
		}
		this.m_CurShowView = view
		if (this.m_CurShowView && this.m_CurShowView["DoOpen"]) {
			this.m_CurShowView["DoOpen"]()
		}
	}

	private _UpdateRoleSelectVisible() {
		// 如果当前是角色选择页
		let view = this._GetCurViewStackElement()
		if (view && egret.is(view, "ICommonWindowRoleSelect")) {
			this.roleSelect.visible = true
			this.roleSelect.clearRedPoint()
		} else {
			if (egret.is(this.m_CommonWindow, "ICommonWindowRoleSelect")) {
				this.roleSelect.visible = true
			} else {
				this.roleSelect.visible = false
			}
		}
	}

	public SetViewStack(viewStack: eui.ViewStack) {
		if (viewStack == null) {
			console.error("commonwindowbg:setviewstack stack is null!!!")
			return
		}
		this.viewStack = viewStack
		this.addChildAt(viewStack, this.getChildIndex(this.roleSelect) - 1)
		// DisplayUtils.ChangeParent(viewStack, this.m_CommonWindow as any)
		this.m_TabDatas = viewStack;
	}
	public setRoleSelectPost(x: number, y: number) {
		if (x) this.roleSelect.x = x;
		if (y) this.roleSelect.y = y;
	}

	public SetTabDatas(datas: eui.ICollection): void {
		this.m_TabDatas = datas
	}

	public AddChildStack(view: eui.Component) {
		this.viewStack.addChild(view)
	}

	public OnAdded(commonWindow: ICommonWindow, index: number = 0, roleIndex = 0): void {
		if (!index) index = 0
		if (!roleIndex) roleIndex = 0

		this.m_CommonWindow = commonWindow
		this.m_OldIndex = index
		this.viewStack.selectedIndex = index
		this.tabBar.dataProvider = this.m_TabDatas
		this.tabBar.selectedIndex = index
		this.tabBar.validateNow()

		this.returnBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.OnTap, this)
		if (this.helpBtn) {
			this.helpBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.OnTap, this)
		}
		this.closeBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.OnTap, this)
		this.tabBar.addEventListener(eui.ItemTapEvent.ITEM_TAP, this._OnTabTouch, this)
		this.roleSelect.addEventListener(egret.TouchEvent.CHANGE, this._OnRoleSelect, this)
		if (this.scroller) {
			this.scroller.addEventListener(eui.UIEvent.CHANGE_END, this._OnChangeEnd, this)
		}
		// let a =	eui.Watcher.watch(this.scroller.viewport,["contentWidth"],this.valueChange,this);
		// a.unwatch()
		// 赋值
		for (let i = 0; i < this.viewStack.numElements; ++i) {
			let view = this.viewStack.getElementAt(i)
			if (view && egret.is(view, "ICommonWindowRoleSelect")) {
				(<ICommonWindowRoleSelect><any>view).m_RoleSelectPanel = this.roleSelect
			}
		}
		if (egret.is(this.m_CommonWindow, "ICommonWindowRoleSelect")) {
			(<ICommonWindowRoleSelect><any>this.m_CommonWindow).m_RoleSelectPanel = this.roleSelect
		}

		// 更新标题
		this._UpdateTitle()
		this._UpdateHelpBtn()
		// 更新角色选择状态
		this._UpdateRoleSelectVisible()
		// 初始化角色选择数据
		this.roleSelect.DoOpen(roleIndex)
		// 更新子面板角色数据
		// this._UpdateRoleSelect()
		// 子面板open
		this._SetCurShowView(this._GetCurViewStackElement())
		// 子面板更新数据
		this._UpdateViewContent()

		if (this.m_CommonWindow) {
			DisplayUtils.ChangeParent(this.closeBtn, this.m_CommonWindow as any)
			DisplayUtils.ChangeParent(this.returnBtn, this.m_CommonWindow as any)
		}
		this._OnChangeEnd()
	}
	private _OnChangeEnd(): void {
		if (!this.scroller || !this.m_TabDatas) return
		//this.imgNav.visible = this.scroller.viewport.contentWidth > this.scroller.width
		this.imgNav.visible = this.m_TabDatas.length > 4
		if (this.imgNav.visible == false) return
		if (this.scroller && this.scroller.viewport && this.scroller.viewport.scrollH == 0) {
			this.imgNav.source = `cycle_btn_01_01_png`
		} else if (this.scroller && this.scroller.viewport && this.scroller.viewport.scrollH == this.scroller.viewport.contentWidth - this.scroller.width) {
			this.imgNav.source = `cycle_btn_01_02_png`
		}
	}

	public OnRemoved(): void {
		this.returnBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.OnTap, this)
		this.closeBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.OnTap, this)
		this.tabBar.removeEventListener(eui.ItemTapEvent.ITEM_TAP, this._OnTabTouch, this)
		this.roleSelect.removeEventListener(egret.TouchEvent.CHANGE, this._OnRoleSelect, this)
		this.scroller.addEventListener(eui.UIEvent.CHANGE_END, this._OnChangeEnd, this)
		if (this.helpBtn) {
			this.helpBtn.removeEventListener(egret.TouchEvent.CHANGE, this.OnTap, this)
		}

		this._SetCurShowView(null)
		this.roleSelect.DoClose()
		// this.m_CommonWindow = null
		// this.viewStack = null;
	}

	private _UpdateHelpBtn() {
		if (!this.helpBtn) {
			return
		}
		let helpId
		let view = this._GetCurViewStackElement()
		if (view) {
			helpId = view.mWindowHelpId
		}
		if (!helpId) {
			helpId = this.m_CommonWindow.mWindowHelpId
		}
		this.helpBtn.visible = helpId;
		this.mHelpId = helpId
	}

	public GetSelectedIndex(): number {
		return this.tabBar.selectedIndex
	}

	public CloseStack(index: number): void {
		this.viewStack.getElementAt(index)['DoClose']();
	}

	public getCurRole(): number {
		return this.roleSelect.getCurRole()
	}

	public clearRedPoint(): void {
		this.roleSelect.clearRedPoint()
	}

	public showRedPoint(index: number, bool: boolean) {
		this.roleSelect.showRedPoint(index, bool)
	}

	public get roleSelectPanel(): RoleSelectPanel {
		return this.roleSelect;
	}

	public ClearTalRedPoint(): void {
		for (let i = 0; i < this.tabBar.numChildren; ++i) {
			this.ShowTalRedPoint(i, false)
		}
	}

	private _GetTalRedTarget(index: number): eui.Image {
		if (index >= this.tabBar.numElements) {
			return
		}
		let obj = this.tabBar.getElementAt(index)
		if (!obj) {
			return
		}
		return obj["redPoint"]
	}

	public ShowTalRedPoint(index: number, isShow: boolean) {
		let redPoint = this._GetTalRedTarget(index)
		if (redPoint) {
			redPoint.visible = isShow
		}
	}

	public CheckShowTalRedPoint(index: number, isShow: boolean) {
		let redPoint = this._GetTalRedTarget(index)
		// 只设置显示状态
		if (redPoint && !redPoint.visible) {
			redPoint.visible = isShow
		}
	}

	public CheckTabRedPoint(): boolean {
		var ret = false
		for (let i = 0; i < this.viewStack.numElements; ++i) {
			let view = this.viewStack.getElementAt(i)
			if (view["CheckRedPoint"]) {
				let redpoint = view["CheckRedPoint"]()
				this.ShowTalRedPoint(i, redpoint)
				if (redpoint) ret = true
			}
		}
		return ret
	}

	//加载icon
	public initItemImage(index: number, id: number): void {
		if (index >= this.tabBar.numElements) {
			return
		}
		let obj = this.tabBar.getElementAt(index)
		if (!obj) {
			return
		}
		obj["item_image"].source = ResDataPath.GetItemFullName(id + "");
	}

	public loadIconBG(index: number, quality: number) {
		if (index >= this.tabBar.numElements) {
			return
		}
		let obj = this.tabBar.getElementAt(index)
		if (!obj) {
			return
		}
		obj["bg_image"].source = ResDataPath.GetItemQualityName(quality);
	}

	public get comViewStack(): eui.ViewStack {
		return this.viewStack;
	}
	public set comViewStack(value){
		 this.viewStack=value;
	}

	public RemoveChildStack() {
		this.viewStack.removeChildren();
	}
}
window["CommonWindowBg"] = CommonWindowBg