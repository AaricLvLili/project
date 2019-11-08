namespace Sproto {
	export class SprotoSender {
		private static MAX_PACK_LEN = (1 << 16) - 1;

		private static m_SendPack: SprotoPack;
		private static m_SendStream: SprotoStream;

		private static m_Protocol: ProtocolFunctionDictionary;

		private static m_Session: number;
		private static m_RpcRspHandlerDict: { [key: number]: Function };
		private static m_SessionDict: { [key: number]: any };
		private static sprotoLogNo:number[] = [4200,4201,4202,4203];

		public static Init(protocol: ProtocolFunctionDictionary): void {
			SprotoSender.m_Session = 0;
			SprotoSender.m_RpcRspHandlerDict = []
			SprotoSender.m_SessionDict = []
			SprotoSender.m_SendPack = new SprotoPack();
			SprotoSender.m_SendStream = new SprotoStream();
			SprotoSender.m_Protocol = protocol;
		}

		public static Pack(tag: number, rpcReq: SprotoTypeBase = null, rpcRspHandler: Function = null, thisObj: any = null): egret.ByteArray {
			if (rpcRspHandler != null) {
				let session = ++SprotoSender.m_Session;
				SprotoSender.m_RpcRspHandlerDict[session] = thisObj && rpcRspHandler.bind(thisObj) || rpcRspHandler;
				SprotoSender.m_SessionDict[session] = SprotoSender.m_Protocol.Get(tag).ResponseType;
				return SprotoSender.SendData(rpcReq, session, tag)
			} else {
				return SprotoSender.SendData(rpcReq, null, tag)
			}
		}
		public static SendData(rpc: SprotoTypeBase, session, tag: number): egret.ByteArray {
			// if(this.sprotoLogNo.indexOf(tag) != -1)
				// egret.log("C2S:"+tag);


	

			let pkg: Spackage = new Spackage();
			pkg.type = tag;
			if (session != null) {
				pkg.session = session;
			}
			let stream = SprotoSender.m_SendStream;
			stream.Seek(0, SeekOrigin.Begin);
			let len = pkg.EncodeStream(stream);
			if (rpc != null) {
				len += rpc.EncodeStream(stream);
			}

			let data: Uint8Array = SprotoSender.m_SendPack.Pack(stream.Buffer, len);
			if (data.length > SprotoSender.MAX_PACK_LEN) {
				console.log("data.Length > " + SprotoSender.MAX_PACK_LEN + " => " + data.length);
				return null;
			}

			// stream.Seek(0, SeekOrigin.Begin);
			// stream.WriteByte(data.length >> 8);
			// stream.WriteByte(data.length);
			// stream.Write(data, 0, data.length);

			// let array = []
			// for (let i = 0; i < data.length;　++i) {
			// 	array.push(data[i])
			// }
			// console.log(array.join(" "))
			return new egret.ByteArray(data.buffer);
		}

		public static HandlerSession(session: number, data: Uint8Array, offset: number): void {
			let responseType =  SprotoSender.m_SessionDict[session];
			let responseFunc = SprotoSender.m_RpcRspHandlerDict[session];
			if (responseType && responseFunc) {
				let obj = new responseType();
				obj.InitArray(data, offset);
				responseFunc(obj);
			} else {
				console.warn("SprotoSender.Handler not found => " + session);
			}
			SprotoSender.m_SessionDict[session] = null;
			SprotoSender.m_RpcRspHandlerDict[session] = null;
		}
	}
}