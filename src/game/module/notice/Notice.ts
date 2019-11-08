/**
 * 公告数据
 */
class Notice extends BaseSystem {
    data
    public constructor() {
        super();
        this.sysId = PackageID.Notice;
        this.regNetMsg(S2cProtocol.sc_notice, this.doNotice);
        this.regNetMsg(S2cProtocol.sc_notice_records, this.doNoticeRecords);
        // this.regNetMsg(2, this.doNoticeOpen);
    }
    static ins(): Notice {
        return super.ins();
    };
    doNotice(bytes: Sproto.sc_notice_request) {
        var type = bytes.type;
        var str = bytes.str;
        //是否是新消息 0--是的   1--不是
        var isNew = bytes.isNew;
        var time = bytes.time;
        if (type == ChatType.Public) {
            if (isNew == 0) {
                (<NoticeView>ViewManager.ins().open(NoticeView)).showNotice(str);
            }
        }
        else if (type == ChatType.System) {
            // if (!this.data) {
            //     this.data = new ChatInfoData(null);
            // }
            // this.data.str = str;
            // this.data.type = 7;
            // type = 7;
            if (isNew == 0) {
                (<NoticeView>ViewManager.ins().open(NoticeView)).showStaticNotice(str);
            }
        }
        let item = this._createChatItem(bytes)
        // Chat.ins().postSysChatMsg(new ChatSystemData(type, str, time));
         Chat.ins().postSysChatMsg(item);
    };
    doNoticeRecords(rsp: Sproto.sc_notice_records_request) {
        for (let v of rsp.records) {
            let item = this._createChatItem(v)
            // Chat.ins().postSysChatMsg(new ChatSystemData(v.type, v.str, 0));
            Chat.ins().postSysChatMsg(item);
        }
    }
    private _createChatItem(value: any): ChatInfoData {
        let item = new ChatInfoData(null)
        item.type = value.type;
        item.str = value.str;
        item.time = value.time;
        //item.time =value.time
        return item
    }
    // doNoticeOpen (bytes) {
    //     UserFuLi.ins().isOpenNotice = bytes.readBoolean();
    //     Notice.ins().postGameNotice();
    // };
    // setNoticeOPen () {
    //     var bytes = this.getBytes(2);
    //     this.sendToServer(bytes);
    // };
    // postGameNotice () {
    // };
};
window["Notice"]=Notice