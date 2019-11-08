namespace Sproto {

	export class MetaInfo {
		public ProtocolType;
		public RequestType;
		public ResponseType;
	}

	export class ProtocolFunctionDictionary {
		private MetaDictionary: {[key: number]: MetaInfo};

		public constructor() {
			this.MetaDictionary = {}
		}

		private _GetMeta(tag: number): MetaInfo {
			let data = this.MetaDictionary[tag];
			if (data == null) {
				data = new MetaInfo();
				this.MetaDictionary[tag] = data;
			}
			return data;
		}

		public SetProtocol(tag: number): void {
			let data = this._GetMeta(tag);
			data.ProtocolType = tag;
		}

		public SetRequest(tag: number, cls: any): void {
			let data = this._GetMeta(tag);
			data.RequestType = cls;
		}

		public SetResponse(tag: number, cls: any): void {
			let data = this._GetMeta(tag);
			data.ResponseType = cls;
		}

		private _Gen(cls, tag: number, buffer: Uint8Array, offset: number = 0): SprotoTypeBase {
			let obj: SprotoTypeBase = new cls();
			obj.InitArray(buffer, offset);
			return obj
		}

		public GenResponse(tag: number, buffer: Uint8Array, offset: number = 0): SprotoTypeBase {
			let data = this.MetaDictionary[tag];
			return this._Gen(data.ResponseType, tag, buffer, offset);
		}

		public GenRequest(tag: number, buffer: Uint8Array, offset: number = 0): SprotoTypeBase {
			let data = this.MetaDictionary[tag];
			if (data.RequestType == null) {
				return null
			}
			return this._Gen(data.RequestType, tag, buffer, offset);
		}

		public Get(tag: number): MetaInfo {
			return this.MetaDictionary[tag];
		}
	}
}