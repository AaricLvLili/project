class TPS extends egret.DisplayObjectContainer{
	public constructor() {
		super();
		// this.initUI();

		var t = egret.setTimeout(()=>{
			egret.clearTimeout(t);
			// TimerManager.ins().doTimer(1000,0,this.update,this);
		},this,5000);
	}
	private Game_Bg:eui.Label;
	private Game_Main:eui.Label;

	private UI_HUD:eui.Label;
    private UI_USER_INFO:eui.Label;
    /** UI主界面*/
    private UI_Main:eui.Label;
    /**UI导航栏界面*/
    private UI_NAVIGATION:eui.Label;
    private UI_Main_2:eui.Label;
    /**UI弹出框层 @type*/
    private UI_Popup:eui.Label;
    /**UITips层*/
    private UI_Tips:eui.Label;

	private initUI(){
		var bg:egret.Shape = new egret.Shape();
		bg.graphics.beginFill(0xf,0.5);
		bg.graphics.drawRect(0,420,400,340);
		bg.graphics.endFill();
		this.addChild(bg);

		this.Game_Bg = new eui.Label();
		this.Game_Bg.x = 10;
		this.Game_Bg.y = 10 + 420;
		this.addChild(this.Game_Bg);
		
		this.Game_Main = new eui.Label();
		this.Game_Main.x = 10;
		this.Game_Main.y = 40 + 420;
		this.addChild(this.Game_Main);
		
		this.UI_HUD = new eui.Label();
		this.UI_HUD.x = 10;
		this.UI_HUD.y = 70 + 420;
		this.addChild(this.UI_HUD);
		
		this.UI_USER_INFO = new eui.Label();
		this.UI_USER_INFO.x = 10;
		this.UI_USER_INFO.y = 100 + 420;
		this.addChild(this.UI_USER_INFO);

		this.UI_Main = new eui.Label();
		this.UI_Main.x = 10;
		this.UI_Main.y = 130 + 420;
		this.addChild(this.UI_Main);

		this.UI_NAVIGATION = new eui.Label();
		this.UI_NAVIGATION.x = 10;
		this.UI_NAVIGATION.y = 160 + 420;
		this.addChild(this.UI_NAVIGATION);	

		this.UI_Main_2 = new eui.Label();
		this.UI_Main_2.x = 10;
		this.UI_Main_2.y = 190 + 420;
		this.addChild(this.UI_Main_2);
		

		this.UI_Popup = new eui.Label();
		this.UI_Popup.x = 10;
		this.UI_Popup.y = 220 + 420;
		this.addChild(this.UI_Popup);
		
		this.UI_Tips = new eui.Label();
		this.UI_Tips.x = 10;
		this.UI_Tips.y = 250 + 420;
		this.addChild(this.UI_Tips);
	}

	private update(){
		this.resList = [];
		var game_BgData:any = this.calculateTexture(LayerManager.Game_Bg);
		this.Game_Bg.textFlow = <Array<egret.ITextElement>>[
			{	text: "游戏地图:", style: { "textColor": 0xffffff, size: 18 }},
			{	text: "Game_Bg:", style: { "textColor": 0xf87372, size: 18 }},
			{	text: "纹理数量:"+game_BgData.count, style: { "textColor": 0x00ff00, size: 18 }},
			{	text: "内存占用:"+game_BgData.total, style: { "textColor": 0x33FFFF, size: 18 }}
		];

		game_BgData = this.calculateTexture(LayerManager.Game_Main);
		this.Game_Main.textFlow = <Array<egret.ITextElement>>[
			{	text: "游戏场景:", style: { "textColor": 0xffffff, size: 18 }},
			{	text: "Game_Main:", style: { "textColor": 0xf87372, size: 18 }},
			{	text: "纹理数量:"+game_BgData.count, style: { "textColor": 0x00ff00, size: 18 }},
			{	text: "内存占用:"+game_BgData.total, style: { "textColor": 0x33FFFF, size: 18 }}
		];

		game_BgData = this.calculateTexture(LayerManager.UI_HUD);
		this.UI_HUD.textFlow = <Array<egret.ITextElement>>[
			{	text: "游戏场景:", style: { "textColor": 0xffffff, size: 18 }},
			{	text: "UI_HUD:", style: { "textColor": 0xf87372, size: 18 }},
			{	text: "纹理数量:"+game_BgData.count, style: { "textColor": 0x00ff00, size: 18 }},
			{	text: "内存占用:"+game_BgData.total, style: { "textColor": 0x33FFFF, size: 18 }}
		];

		game_BgData = this.calculateTexture(LayerManager.UI_USER_INFO);
		this.UI_USER_INFO.textFlow = <Array<egret.ITextElement>>[
			{	text: "游戏场景:", style: { "textColor": 0xffffff, size: 18 }},
			{	text: "USER_INFO:", style: { "textColor": 0xf87372, size: 18 }},
			{	text: "纹理数量:"+game_BgData.count, style: { "textColor": 0x00ff00, size: 18 }},
			{	text: "内存占用:"+game_BgData.total, style: { "textColor": 0x33FFFF, size: 18 }}
		];

		game_BgData = this.calculateTexture(LayerManager.UI_Main);
		this.UI_Main.textFlow = <Array<egret.ITextElement>>[
			{	text: "游戏场景:", style: { "textColor": 0xffffff, size: 18 }},
			{	text: "UI_Main:", style: { "textColor": 0xf87372, size: 18 }},
			{	text: "纹理数量:"+game_BgData.count, style: { "textColor": 0x00ff00, size: 18 }},
			{	text: "内存占用:"+game_BgData.total, style: { "textColor": 0x33FFFF, size: 18 }}
		];

		game_BgData = this.calculateTexture(LayerManager.UI_NAVIGATION);
		this.UI_NAVIGATION.textFlow = <Array<egret.ITextElement>>[
			{	text: "游戏导航:", style: { "textColor": 0xffffff, size: 18 }},
			{	text: "NAVIGATION:", style: { "textColor": 0xf87372, size: 18 }},
			{	text: "纹理数量:"+game_BgData.count, style: { "textColor": 0x00ff00, size: 18 }},
			{	text: "内存占用:"+game_BgData.total, style: { "textColor": 0x33FFFF, size: 18 }}
		];

		game_BgData = this.calculateTexture(LayerManager.UI_Main_2);
		this.UI_Main_2.textFlow = <Array<egret.ITextElement>>[
			{	text: "游戏场景:", style: { "textColor": 0xffffff, size: 18 }},
			{	text: "Main_2:", style: { "textColor": 0xf87372, size: 18 }},
			{	text: "纹理数量:"+game_BgData.count, style: { "textColor": 0x00ff00, size: 18 }},
			{	text: "内存占用:"+game_BgData.total, style: { "textColor": 0x33FFFF, size: 18 }}
		];

		game_BgData = this.calculateTexture(LayerManager.UI_Popup);
		this.UI_Popup.textFlow = <Array<egret.ITextElement>>[
			{	text: "游戏场景:", style: { "textColor": 0xffffff, size: 18 }},
			{	text: "Popup:", style: { "textColor": 0xf87372, size: 18 }},
			{	text: "纹理数量:"+game_BgData.count, style: { "textColor": 0x00ff00, size: 18 }},
			{	text: "内存占用:"+game_BgData.total, style: { "textColor": 0x33FFFF, size: 18 }}
		];

		game_BgData = this.calculateTexture(LayerManager.UI_Tips);
		this.UI_Tips.textFlow = <Array<egret.ITextElement>>[
			{	text: "游戏场景:", style: { "textColor": 0xffffff, size: 18 }},
			{	text: "Tips:", style: { "textColor": 0xf87372, size: 18 }},
			{	text: "纹理数量:"+game_BgData.count, style: { "textColor": 0x00ff00, size: 18 }},
			{	text: "内存占用:"+game_BgData.total, style: { "textColor": 0x33FFFF, size: 18 }}
		];

	}

	public calculateTexture(layer:egret.DisplayObjectContainer):any{
		var len:number = layer.numChildren;
		var i:number = 0;
		var j:number = 0;
		var targetObj:any,targetObj2:any;
		var resultObj:any = {"count":0,"total":0};
		var total:number = 0;
		while(i < len){
			targetObj = layer.getChildAt(i);
			if(targetObj instanceof eui.Image){
				resultObj.count++;
				total = Math.ceil(targetObj.width * targetObj.height * 4 / 1024 / 1024);
				resultObj.total += total;
			}
			else if(targetObj instanceof egret.DisplayObjectContainer){
				var obj = this.forObj(targetObj);
                resultObj.count += obj.count;
				resultObj.total += obj.total;
			}
			i++;
		}

		return resultObj;
	}
	private resList:Array<string>;
	private hasRes(source:string):boolean{
		for(var key in this.resList){
			if(source == key)
				return true;
		}
		return false;
	}

	private forObj(targetObj:egret.DisplayObjectContainer):any{
		var len:number = targetObj.numChildren;
		var i:number = 0;
		var resultObj:any = {"count":0,"total":0};
		var total:number = 0;
		var currObj:any;
		var currMapName:string = GameMap.getFileName()+"_jpg";
		while(i < len){
			currObj = targetObj.getChildAt(i);
			if(currObj instanceof eui.Image){
				if(currObj.source != null){
					if(currObj.source.toString() != currMapName && !this.hasRes(currObj.source.toString())){
						this.resList.push(currObj.source.toString());
						resultObj.count++;
						total = Math.ceil(targetObj.width * targetObj.height * 4 / 1024 / 1024);
						resultObj.total += total;
						// egret.log(currObj.source.toString());
					}
				}
			}
			else if(currObj instanceof egret.DisplayObjectContainer){
				var tempObj = this.forObj(currObj);
				resultObj.count += tempObj.count;
				resultObj.total += tempObj.total;
			}
			i ++;
		}
		return resultObj;
	}
}
window["TPS"]=TPS