class WxSystemInfo
{
    public brand:string	//手机品牌	>= 1.5.0
    public model:string	//手机型号	
    public pixelRatio:number	//设备像素比	
    public screenWidth:number	//屏幕宽度	>= 1.1.0
    public screenHeight:number	//屏幕高度	>= 1.1.0
    public windowWidth:number	//可使用窗口宽度	
    public windowHeight:number	//可使用窗口高度	
    public language:string	//微信设置的语言	
    public version:string	//微信版本号	
    public system:string	//操作系统版本	
    public platform:string	//客户端平台	
    public fontSizeSetting:number	//用户字体大小设置。以“我-设置-通用-字体大小”中的设置为准，单位 px。	>= 1.5.0
    public SDKVersion:string	//客户端基础库版本	>= 1.1.0
    public benchmarkLevel:number	//性能等级，-2 或 0：该设备无法运行小游戏，-1：性能未知，>=1 设备性能值，该值越高，设备性能越好(目前设备最高不到50)	>= 1.8.0
    public battery:number	//电量，范围 1 - 100	>= 1.9.0
    public wifiSignal:number	//wifi 信号强度，范围 0 - 4	>= 1.9.0
}
window["WxSystemInfo"]=WxSystemInfo