var __ref_field__: any = GameSocket
var __ref_field__: any = PackageID

class BaseSystem extends BaseClass {
    public constructor() {
        super();
    }
    sysId: number;
    public regNetMsg(msgId: number, fun: Function) {
        // GameSocket.ins().registerSTCFunc(this.sysId, msgId, fun, this);
        Sproto.SprotoReceiver.AddHandler(msgId, fun, this)
    };
    /**
     * 从对象池获取一个bytes对象
     */
    // public getGameByteArray(): GameByteArray {
    //     return GameSocket.ins().getBytes();
    // };
    private static temp = new GameByteArray
    public getBytes(msgid) {
        return BaseSystem.temp
        // var bytes = this.getGameByteArray();
        // bytes.writeCmd(this.sysId, msgid);
        // return bytes;
        // return {}
    };
    public sendBaseProto(msgid) {
    };
    /**
     * 发送到服务器
     * @param bytes
     */
    public sendToServer(tag) {
        // GameSocket.ins().sendToServer(bytes);
    }

    public Rpc(tag: number, rpcReq: Sproto.SprotoTypeBase = null, rpcRspHandler: Function = null, thisObj: any = null): void {
        GameSocket.ins().Rpc(tag, rpcReq, rpcRspHandler, this)
    }
}
MessageCenter.compile(BaseSystem);
window["BaseSystem"]=BaseSystem