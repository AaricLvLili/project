class AStar {
	m_nMarkTag: number;
	m_ASMapCells: Array<any>;

	m_nWidth: number;
	m_nHeight: number;
	m_LastOpenCell: ASMapCell;
	public constructor(map?: any) {
		if (map === void 0) { map = null; }
		this.m_nMarkTag = 0; //寻路优化成员，免去循环初始化所有节点的开销
		if (map) {
			this.initFromMap(map);
		}
	}
	/**销毁数据*/
	private dispose()
	{
		if(this.m_ASMapCells == null) return ;
	
		for(var i =0;i< this.m_ASMapCells.length;i++)
		{
			this.m_ASMapCells[i] = null;
		}
		this.m_ASMapCells = [];
	}
	/**
     * 从地图中初始化
     * @param map
     */
	public initFromMap(map) {
		this.dispose();
		var nOldCount = 0;
		if (this.m_ASMapCells)
			nOldCount = this.m_ASMapCells.length;
		else
			this.m_ASMapCells = [];
		this.m_nWidth = map.numCols;
		this.m_nHeight = map.numRows;
		//如果现有数组的格子数量少于新数量则扩展数组
		var nNewCount = this.m_nWidth * this.m_nHeight;
		if (nNewCount > this.m_ASMapCells.length)
			this.m_ASMapCells.length = nNewCount;
		for (var i = nOldCount; i < nNewCount; ++i) {
			this.m_ASMapCells[i] = new ASMapCell;
		}
		//初始化每个坐标格子
		var x, y, idx;
		var cell;
		idx = 0;
		for (y = 0; y < this.m_nHeight; ++y) {
			for (x = 0; x < this.m_nWidth; ++x) {
				cell = this.m_ASMapCells[idx];
				cell.X = x;
				cell.Y = y;
				cell.CanNotMove = !map.getNode(x, y).walkable;
				idx++;
			}
		}
	};
    /**
     * 寻路
     * @param fromX 起始坐标X
     * @param fromY 起始坐标Y
     * @param targetX 目的地坐标X
     * @param targetY 目的地坐标Y
     * @return 路径点数组
     *
     */
	public getPatch(fromX: number, fromY: number, targetX: number, targetY: number): AStarNode[] {
		if (fromX == targetX && fromY == targetY)
			return null;
		if (fromX < 0 || fromX >= this.m_nWidth || fromY < 0 || fromY >= this.m_nHeight)
			console.log("寻路的起始位置参数无效：(" + fromX + ", " + fromY + ")");
		if (targetX < 0 || targetX >= this.m_nWidth || targetY < 0 || targetY >= this.m_nHeight)
			console.log("寻路的目的位置参数无效：(" + targetX + ", " + targetY + ")");
		if (this.m_ASMapCells[targetY * this.m_nWidth + targetX] && this.m_ASMapCells[targetY * this.m_nWidth + targetX].CanNotMove) {

			// let otherFind = false
			// let size = 1
			// let len = size * 2 + 1
			// // 在周围寻找位置
			// for (let i = 0; i < len * len; ++i) {
			// 	let _x = Math.floor(i / len) - size + targetX
			// 	let _y = Math.floor(i % len) - size + targetY
			// 	if (!this.m_ASMapCells[_y * this.m_nWidth + _x].CanNotMove) {
			// 		otherFind = true
			// 		console.warn(`寻路目标点不可走${targetX},${targetY}, 更新了新的坐标${_x},${_y}`);
			// 		targetX = _x
			// 		targetY = _y
			// 		break
			// 	}
			// }

			// if (!otherFind) {
			// 	return null
			// }

			return null;
		}
		this.reset(fromX, fromY);
		var boPathFound = false;
		var nCurX = fromX;
		var nCurY = fromY;
		var curCell = this.m_ASMapCells[nCurY * this.m_nWidth + nCurX];
		curCell.GCost = 0;
		curCell.LastX = -1;
		curCell.LastY = -1;
		curCell.X = nCurX;
		curCell.Y = nCurY;
		curCell.MarkTag = this.m_nMarkTag;
		curCell.HCost = Math.abs(targetX - fromX) + Math.abs(targetY - fromY) * 10;
		var i;
		var nX, nY;
		var cell;
		while (true) {
			if (nCurX == targetX && nCurY == targetY) {
				boPathFound = true;
				break;
			}
			if (curCell.State != ASMapCell.CSCLOSE) {
				this.closeCell(curCell);
			}
			//遍历当前位置周围的8个格子
			for (i = 0; i < 8; ++i) {
				nX = nCurX + AStar.NEIGHBORPOS_X_VALUES[i];
				nY = nCurY + AStar.NEIGHBORPOS_Y_VALUES[i];
				if (nX < 0 || nX >= this.m_nWidth || nY < 0 || nY >= this.m_nHeight)
					continue;
				cell = this.m_ASMapCells[nY * this.m_nWidth + nX];
				if (cell.CanNotMove)
					continue;
				//cell.MarkTag与当前的m_nMarkTag不同，也视为是未开启状态
				if (cell.MarkTag != this.m_nMarkTag || cell.State == ASMapCell.CSNONE) {
					cell.MarkTag = this.m_nMarkTag;
					cell.LastX = nCurX;
					cell.LastY = nCurY;
					cell.btDir = i;
					cell.GCost = curCell.GCost + AStar.AS_MOVECOST[i & 1];
					cell.HCost = Math.abs(targetX - nX) + Math.abs(targetY - nY) * 10;
					this.openCell(cell);
				}
				else if (cell.State == ASMapCell.CSOPEN) {
					if (cell.GCost > curCell.GCost + AStar.AS_MOVECOST[i & 1]) {
						cell.LastX = nCurX;
						cell.LastY = nCurY;
						cell.btDir = i;
						cell.GCost = curCell.GCost + AStar.AS_MOVECOST[i & 1];
						this.reopenCell(cell);
					}
				}
			}
			//curCell = bestCell();
			curCell = this.m_LastOpenCell;
			if (curCell == null)
				break;
			nCurX = curCell.X;
			nCurY = curCell.Y;
		}
		if (boPathFound) {
			var Result: AStarNode[] = new Array();
			while (true) {
				Result.push(new AStarNode(curCell.X, curCell.Y, curCell.btDir));
				curCell = this.m_ASMapCells[curCell.LastY * this.m_nWidth + curCell.LastX];
				if ((curCell.LastX <= 0 && curCell.LastY <= 0) || curCell.MarkTag != this.m_nMarkTag)
					break;
			}
			return Result;
		}
		return null;
	};
    /**
     * 寻路开始的时候重置起点数据
     * @param cX
     * @param cY
     *
     */
	public reset(cX: number, cY: number) {
		var cell = this.m_ASMapCells[cY * this.m_nWidth + cY];
		cell.LastX = 0;
		cell.LastY = 0;
		cell.HCost = 0;
		cell.GCost = 0;
		cell.FValue = 0;
		cell.State = 0;
		cell.Prev = null;
		cell.Next = null;
		cell.btDir = 0;
		this.m_LastOpenCell = null;
		this.m_nMarkTag = this.m_nMarkTag + 1;
        /**
         * 如果地图尺寸较大，会在此产生过多的时间开销，造成卡的显现。
         * 已经使用MarkTag优化，在寻路的期间进行检测和重新初始化。
         *
        //将每个格子的状态设为空闲
        for (let i: int = m_nWidth * m_nHeight - 1; i>-1; --i)
        {
            cell = m_ASMapCells[i];
            cell.LastX = -1;
            cell.State = public static CSNONE;
        }**/
	};
    /**
     * 关闭指定的格子
     * @param cell
     *
     */
	public closeCell(cell) {
		//如果格子已经开启则进行路径链表的移除操作
		if (cell.State == ASMapCell.CSOPEN) {
			if (cell.Prev)
				cell.Prev.Next = cell.Next;
			if (cell.Next)
				cell.Next.Prev = cell.Prev;
			if (cell == this.m_LastOpenCell)
				this.m_LastOpenCell = cell.Prev;
		}
		cell.State = ASMapCell.CSCLOSE;
	};
    /**
     * 开启指定的格子
     * @param cell
     *
     */
	public openCell(cell) {
		cell.State = ASMapCell.CSOPEN;
		var nFValue = cell.HCost + cell.GCost;
		cell.FValue = nFValue;
		var lastCell = this.m_LastOpenCell;
		if (!lastCell) {
			this.m_LastOpenCell = cell;
			cell.Prev = null;
			cell.Next = null;
		}
		else {
			//开启格子的时候在已开启的格子链表中按移动估价值进行排序
			while (lastCell.FValue < nFValue) {
				if (lastCell.Prev == null) {
					lastCell.Prev = cell;
					cell.Prev = null;
					cell.Next = lastCell;
					return;
				}
				lastCell = lastCell.Prev;
			}
			//添加到当前开启格子链表的末尾
			cell.Prev = lastCell;
			if (lastCell.Next) {
				cell.Next = lastCell.Next;
				lastCell.Next.Prev = cell;
				lastCell.Next = cell;
			}
			else {
				cell.Next = null;
				lastCell.Next = cell;
				this.m_LastOpenCell = cell;
			}
		}
	};
    /**
     * 重新开启指定的格子更新移动估价值并重新再已开启格子链表中排序
     * @param cell
     *
     */
	public reopenCell(cell) {
		var nFValue = cell.HCost + cell.GCost;
		cell.FValue = nFValue;
		var nextCell = cell.Next;
		if (nextCell && nextCell.FValue > nFValue) {
			do {
				nextCell = nextCell.Next;
			} while (nextCell && nextCell.FValue > nFValue);
			if (cell.Prev)
				cell.Prev.Next = cell.Next;
			if (cell.Next)
				cell.Next.Prev = cell.Prev;
			if (nextCell) {
				cell.Next = nextCell;
				if (nextCell.Prev) {
					cell.Prev = nextCell.Prev;
					nextCell.Prev.Next = cell;
				}
				else
					cell.Prev = null;
				nextCell.Prev = cell;
			}
			else {
				cell.Prev = this.m_LastOpenCell;
				cell.Next = null;
				this.m_LastOpenCell.Next = cell;
				this.m_LastOpenCell = cell;
			}
		}
	};
    /**
     * 寻路算法有关的常量定义
     *
     */
	public static RMOVECOST = 14; //倾斜方向的移动耗费
	public static DMOVECOST = 10; //直线方向的移动耗费
	public static AS_MOVECOST = [AStar.DMOVECOST, AStar.RMOVECOST];
	// 7	0   1
	// 6		2
	// 5	4   3
	public static NEIGHBORPOS_X_VALUES = [0, 1, 1, 1, 0, -1, -1, -1]; //用于快速计算临近坐标值的优化数据
	public static NEIGHBORPOS_Y_VALUES = [-1, -1, 0, 1, 1, 1, 0, -1]; //用于快速计算临近坐标值的优化数据
}

class ASMapCell {
	public static CSNONE = 0; //未处理的格子
	public static CSOPEN = 1; //格子已经开启
	public static CSCLOSE = 2; //格子已经关闭

	Next: ASMapCell;
	FValue: ASMapCell;
	Prev: ASMapCell;
}
window["AStar"]=AStar
window["ASMapCell"]=ASMapCell