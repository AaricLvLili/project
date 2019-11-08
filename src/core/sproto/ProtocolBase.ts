namespace Sproto {
	export abstract class ProtocolBase {
		protected Protocol:ProtocolFunctionDictionary ;

		public constructor() {
			this.Protocol = new ProtocolFunctionDictionary();
		}

		GetProtocol(): ProtocolFunctionDictionary {
			return this.Protocol;
		}

	}
}