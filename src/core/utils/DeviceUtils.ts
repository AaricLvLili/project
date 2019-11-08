// TypeScript file
class DeviceUtils {
    public static get IsHtml5() {
        return egret.Capabilities.runtimeType == egret.RuntimeType.WEB;
    }
    public static get IsNative() {
        return egret.Capabilities.runtimeType == egret.RuntimeType.NATIVE;
    }
    public static get IsMobile() {
        return egret.Capabilities.isMobile;
    }
    public static get IsPC() {
        return !egret.Capabilities.isMobile;
    }
    public static get IsQQBrowser() {
        return this.IsHtml5 && navigator.userAgent.indexOf('MQQBrowser') != -1;
    }
    public static get IsIEBrowser() {
        return this.IsHtml5 && navigator.userAgent.indexOf("MSIE") != -1;
    }
    public static get IsFirefoxBrowse() {
        return this.IsHtml5 && navigator.userAgent.indexOf("Firefox") != -1;
    }
    public static get IsChromeBrowser() {
        return this.IsHtml5 && navigator.userAgent.indexOf("Chrome") != -1;
    }
    public static get IsSafariBrowser() {
        return this.IsHtml5 && navigator.userAgent.indexOf("Safari") != -1;
    }
    public static get IsOperaBrowser() {
        return this.IsHtml5 && navigator.userAgent.indexOf("Opera") != -1;
    }
    public static get isLocation() {
        return location.href.indexOf("192.168.201") >= 0
            || location.href.indexOf("127.0.0.1") >= 0
            || location.href.indexOf("localhost") >= 0
            || location.href.indexOf("cq.api.com") >= 0;
    }

    /** 苹果手机操作系统*/
    public static IOS: string = "iOS";
    /** 安卓手机操作系统*/
    public static Android: string = "Android";
    /** 微软手机操作系统*/
    public static WindowsPhone: string = "Windows Phone";
    /** 微软桌面操作系统*/
    public static WindowsPC: string = "Windows PC";
    /** 苹果桌面操作系统*/
    public static MacOS: string = "Mac OS";
    /** 未知操作系统*/
    public static Unknown: string = "Unknown";
    /** 操作系统*/
    public static os :string = egret.Capabilities.os;
    public static isIOS():boolean
    {
        return DeviceUtils.os == DeviceUtils.IOS;
    }
 
}

window["DeviceUtils"]=DeviceUtils