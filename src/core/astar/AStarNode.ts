class AStarNode {
	nX: any;
	nY: any;
	nDir: any;
	public constructor(x, y, dir) {
		this.nX = x;
		this.nY = y;
		this.nDir = dir;
	}
}
window["AStarNode"]=AStarNode