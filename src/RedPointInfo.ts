class RedPointInfo {

	/**功能ID*/
	public id = 0;
	/**红点状态//-1未区分角色，0，1，2代表对应角色，为空没有红点*/
	public state:Array<Number> = [];

	parse(info: Sproto.states) {
		if(info)
		{
			this.id = info.id;
			this.state = info.state;
		}
	}
}
window["RedPointInfo"]=RedPointInfo