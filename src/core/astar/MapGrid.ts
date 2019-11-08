class MapGrid extends egret.Sprite {

    touchEnabled = false;
    _numCols: number;
    _numRows: number;
    _nodes = [];
    debugTrace: any;

    public constructor() {
        super();
    }

    public get numCols() {
        return this._numCols;
    }
    public get numRows() {
        return this._numRows;
    }
    ////////////////////
    //公有方法
    ////////////////////
    /**
     * 获取指定坐标的网格节点
     * @param x x坐标
     * @param y y坐标
     * @return 返回网格节点

     */
    public getNode(x, y) {
        var rtn = null;

        // console.log("getNode _nodes[x]="+this._nodes[x] + "  _nodes[x][y]:"+this._nodes[x][y]);
        
        if (this._nodes[x] && this._nodes[x][y]) {
            rtn = this._nodes[x][y];
        }
        return rtn;
    };
    /**
     * 判断指定的格子是否可移动
     * @param x 格子x坐标
     * @param y 格子y坐标
     * @return
     *
     */
    public isWalkableTile(x, y) {
        if (x < 0 || x >= this._numCols || y < 0 || y >= this._numRows)
            return false;
        else
            return this._nodes[x][y].walkable;
    };
    /**
     * 释构
     *
     */
    public destruct() {
        this.clearNodes();
    };
    /////////////////////////////////////
    //保护方法
    ////////////////////////////////////
    /**
     * 初始化网格
     * 这里可以使用对象池技术进行优化
     * @param rows 行数
     * @param cols 列数
     * @param data 节点数据字节流

     */
    public initGrid(rows, cols, data, newVersion) {
        //清除现有数据并重设网格尺寸
        if (this._nodes)
            this.clearNodes();
        //保存网格行列数
        this._numRows = rows;
        this._numCols = cols;
        //创建新的网格节点列表
        this._nodes = [];
        //读取网格节点信息
        var node;
        let cls = newVersion ? MapGridNode2 : MapGridNode
        for (var i = 0; i < cols; i++) {
            this._nodes[i] = [];
            for (var j = 0; j < rows; j++) {
                node = new cls();
                node.flags = data.readUnsignedByte();
                this._nodes[i][j] = node;
            }
        }
    };
    /**
     * 清除节点数据
     *
     */
    public clearNodes() {
        for(var key in this._nodes)
        {
            for(var key2 in this._nodes[key])
            {
                this._nodes[key] = null;
            }
           this._nodes[key] = [];
        }
        this._nodes = [];
        // for (var i = 0; i < this._nodes.length; i++) {
        //     this._nodes[i].length = 0;
        // }
        // this._nodes.length = 0;
    };
    /**
     * 内部调试输出方法
     * @param args
     *
     */
    public _trace() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i - 0] = arguments[_i];
        }
        if (this.debugTrace != null)
            this.debugTrace.apply(null, args);
    };
}
window["MapGrid"]=MapGrid