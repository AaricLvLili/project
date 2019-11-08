/**
 * 改名窗口
 */
class RenameWin extends BaseEuiPanel {
    sureBtn
    input
    //private dialogCloseBtn:eui.Button;

    public constructor() {
        super();
        this.skinName = 'NameChangeSkin';
        //this.dialogCloseBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnClick, this);
    }
    
    open  () {
        this.sureBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
        this.m_bg.init(`RenameWin`,GlobalConfig.jifengTiaoyueLg.st101108)
    };
    close () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i - 0] = arguments[_i];
        }
        this.sureBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
        this.input.text = '';
        //this.dialogCloseBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this._OnClick, this)
    };
    private _OnClick(e: egret.TouchEvent) {
		ViewManager.ins().close(this);
	}
    onTap = function (e) {
        switch (e.currentTarget) {
            //确定修改
            case this.sureBtn:
                let content:string = this.input.text.trim();
                if(content == null || content == "")
                {
                    alert(GlobalConfig.jifengTiaoyueLg.st101929);
                    return ;
                }
                if(StringUtils.isSpecialCharacter(content))
                {
                    alert(GlobalConfig.jifengTiaoyueLg.st101930);
                    return ;
                }

                if(StringUtils.isEmojiCharacter(content))
                {
                    alert(GlobalConfig.jifengTiaoyueLg.st101931);
                    return ;
                }

                if (this.input.text.length == 0) {
                    UserTips.ins().showTips(GlobalConfig.jifengTiaoyueLg.st101932);
                }
                else if (UserBag.ins().getBagItemById(ItemConst.RENAME) != null) {
                    GameLogic.ins().sendRename(this.input.text);
                }
                break;
        }
    };
};
ViewManager.ins().reg(RenameWin, LayerManager.UI_Popup);
window["RenameWin"]=RenameWin