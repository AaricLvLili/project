class ResInfo {
	/**使用计数*/
	// public useCount:number = 0;
	/**数据路径*/
	public dataSetPath:string;
	/**纹理路径*/
	public texturePath:string;
	/**数据集*/
	public mcDataSet:any;
	/**纹理集*/
	public texture: egret.Texture;

	public useTimer:number = 0;

	public filename:string = "";

	public dispose()
	{
		this.useTimer = 0;
		if(this.texture)
			this.texture.dispose();
		this.texture = null;
		this.mcDataSet = null;
		
		// var a = RES.destroyRes(this.dataSetPath); //lxh 不销毁纹理数据集
		// var b = 
		RES.destroyRes(this.texturePath);
		// egret.log("销毁数据："+this.filename + "-->"+a+ " -->"+b);
		this.dataSetPath = null;
		this.texturePath = null;
		this.filename = null;
		// this.mcFactory = null;
	}

}
window["ResInfo"]=ResInfo