namespace Sproto {
	export class SprotoTypeSize {
		public static readonly SIZEOF_HEADER = 2;
		public static readonly SIZEOF_LENGTH = 4;
		public static readonly SIZEOF_FIELD = 2;
		public static readonly ENCODE_MAX_SIZE = 0x1000000;

		public static error(info: string) {
			egret.error(info);
		}
	}
}