class EquipsData {

	strengthen: number;
	star: number;
	gem: number;
	item: ItemData = new ItemData;
	zhuling: number;
	tupo: number;
	bless: number;
	num2: number;
	goditem: ItemData = new ItemData;
	public blessexp: number; // tag 9
	public blessstar: number; // tag 10
	public blesslv: number; // tag 11

	public parser(data: Sproto.equip_data): void {
		this.strengthen = data.strengthen
		this.star = data.star
		this.gem = data.gem
		this.item.parser(data.item)
		this.zhuling = data.zhuling
		this.tupo = data.tupo
		this.bless = data.bless
		this.num2 = data.num2
		this.goditem.parser(data.goditem)
		this.blessexp = data.blessexp;
		this.blessstar = data.blessstar;
		this.blesslv = data.blesslv;
	}

	public static Create(itemId: number): EquipsData {
		let data = new EquipsData
		data.strengthen = 0
		data.star = 0
		data.gem = 0
		data.zhuling = 0
		data.tupo = 0
		data.bless = 0
		data.num2 = 0
		data.item.configID = itemId
		data.item.count = 1
		data.goditem.configID = 0
		data.goditem.count = 1
		data.blessexp = 0;
		data.blessstar = 0;
		data.blesslv = 0;
		return data
	}
}
window["EquipsData"]=EquipsData