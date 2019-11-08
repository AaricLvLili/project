// sdk参数类
class SdkParam {
    public uid: string;//用户信息（必须传）
    public userRoleId: string;
    public userRoleName: string;
    public serverid: string;
    public userLevel: string;
    public count: number;
    public quantifier: string;
    public callbackUrl: string;
    public extraInfo: any;//额外参数
    public cpOrderNo: string;
    public amount: string;//订单金额（必须传）
    public subject: string;//订单主题
    public desc: string;
    public goodsId: number;//商品id
    public billno: string;//订单号

    public orderid: string
}
window["SdkParam"] = SdkParam