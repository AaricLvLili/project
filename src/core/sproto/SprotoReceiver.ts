namespace Sproto {
	export class SprotoReceiver {
		private static mProtocol: ProtocolFunctionDictionary;
		private static m_RpcReqHandlerDict: { [key: number]: Function };
		private static sprotoLogNo:number[] = [4200,4201,4202,4203];

		public static Init(protocol: ProtocolFunctionDictionary): void {
			SprotoReceiver.m_RpcReqHandlerDict = [];
			SprotoReceiver.mProtocol = protocol;
		}

		public static AddHandler(tag: number, rpc: Function, thisObj: any): void {
            if (!rpc) {
				return;
			}
			SprotoReceiver.m_RpcReqHandlerDict[tag] = thisObj ? rpc.bind(thisObj) : rpc;
		}

		public static HandlerType(tag: number, session: number, data: Uint8Array, offset: number): SprotoTypeBase {
			let func = SprotoReceiver.m_RpcReqHandlerDict[tag];
			if (func == null) {
				egret.log("无法处理消息", tag);
				return null;
			}

			// if(this.sprotoLogNo.indexOf(tag) != -1)
				// egret.log("S2C:"+tag);

			let rpcRsp = func(SprotoReceiver.mProtocol.GenRequest(tag, data, offset));

			if (session != null) {
				return rpcRsp;
			}

			return null;
		}
	}
}