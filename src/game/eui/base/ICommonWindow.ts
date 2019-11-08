interface ICommonWindow {
	OnBackClick?(clickType: number): number
	OnOpenIndex?(openIndex: number): boolean

    // 窗口帮助ID
	mWindowHelpId?: number
}