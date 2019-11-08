/** 镖车移动表现类*/
class DartCarMove extends eui.Component {
	public constructor() {
		super();
	}

	/** 最大显示数量*/
	private readonly SHOW_MAX: number = 6;
	/** 最大距离*/
	private readonly MAX_WIDTH: number = 400;
	/** 用于存储数据模型↑*/
	private playerListTop: Array<any> = [];
	/** 用于存储数据模型↓*/
	private playerListBottom: Array<any> = [];

	/** 上面的偏移*/
	private topPoint: Array<number> = [];
	/** 下面的偏移*/
	private bottomPoint: Array<number> = [];
	/** 单个模型的宽*/
	private playerWidth :number = 350;

	/** 开始表现
	 * 
	 * @param arr 人物模型id
	*/
	public startPerformance(arr: Array<any>): void {

		var fla: boolean;
		var topPoint: number = Math.floor(Math.random() * 33) + 88;//随机出个起始点;	//记录上面的起始点
		var bottomPoint: number = Math.floor(Math.random() * 33) + 88;//随机出个起始点;//记录下面的起始点
		var tempX: number;
		var tempPlayer: any;//临时对象
		var tempPoint: number;//临时的偏移
		for (var i: number = 0; i < arr.length; i++) {
			var a = arr[i];
			a.x = topPoint;
			this.addChild(a);

			fla = Math.random() > 0.5
			tempPoint = Math.round(Math.random() * 30 + 10);
			if (fla) {//各自百分之50概率，看是在上面还是下面
				a.y = 100;
				tempPlayer = this.playerListTop.length > 0 ? this.playerListTop[this.playerListTop.length - 1] : null;
				tempX = tempPlayer ? tempPlayer.x - /**tempPlayer.width - tempPoint*/this.playerWidth : topPoint;//由于第一次没有加载完成，取不到宽度，这里决定写死个最大的宽
				a.x = tempX;
				this.playerListTop.push(a);
				this.topPoint.push(tempPoint);
			}
			else {
				a.y = 222;
				tempPlayer = this.playerListBottom.length > 0 ? this.playerListBottom[this.playerListBottom.length - 1] : null;
				tempX = tempPlayer ? tempPlayer.x - /**tempPlayer.width*/this.playerWidth - tempPoint : bottomPoint;////由于第一次没有加载完成，取不到宽度，这里决定写死个最大的宽
				a.x = tempX;
				this.playerListBottom.push(a);
				this.bottomPoint.push(tempPoint);
			}
		}
		TimerManager.ins().doTimer(50, 0, this.setTimeFun, this);

	}

	private setTimeFun(): void {
		this.startTo(this.playerListTop);
		this.startTo(this.playerListBottom); 
	}

	/** 开始移动*/
	private startTo(arr: Array<any>): void {
		var a: MovieClip;
		for (var i: number = 0; i < arr.length; i++) {
			a = arr[i];
			a.x += 0.2;
			if (a.x >= this.MAX_WIDTH)
			{
				var _x :number =  (arr.length == 1)?-this.playerWidth:arr[arr.length-1].x - this.playerWidth;
				arr.push(arr.shift());
				a.x = _x >0? -this.playerWidth:_x ;//-this.playerWidth;//(arr[arr.length-1].x - this.playerWidth - arr2[arr2.length-1]);
			}
		}
	}

	public destruct():void
	{
		TimerManager.ins().removeAll(this);
		this.playerListTop = [];
		this.playerListBottom = [];
		while(this.numChildren)
		{
			this.removeChildAt(0);
		}
	}


}window["DartCarMove"]=DartCarMove 
