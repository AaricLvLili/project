namespace Sproto {
	export class SprotoTypeFieldOP {

		static readonly SLOT_BITS_SIZE: number = 4 * 8;
		public HasBits: number[];

		public constructor(max_field_count: number) {
			var slot_count = max_field_count / SprotoTypeFieldOP.SLOT_BITS_SIZE;
			if (max_field_count % SprotoTypeFieldOP.SLOT_BITS_SIZE > 0) {
				slot_count++;
			}

			this.HasBits = []
			for (var i = 0; i < slot_count; ++i) {
				this.HasBits.push(0);
			}
		}

		private _GetArrayIdx(bitIdx: number): number {
			var size = this.HasBits.length;
			var arrayIdx = bitIdx / SprotoTypeFieldOP.SLOT_BITS_SIZE;

			return arrayIdx;
		}

		private _GetSlotbitIdx(bitIdx: number): number {
			var size = this.HasBits.length;
			var slotbitIdx = bitIdx % SprotoTypeFieldOP.SLOT_BITS_SIZE;

			return slotbitIdx;
		}

		public HasField(field_idx: number): boolean {
			var array_idx = this._GetArrayIdx(field_idx);
			var slotbit_idx = this._GetSlotbitIdx(field_idx);

			var slot = this.HasBits[array_idx];
			var mask = 1 << slotbit_idx;

			return (slot & mask) != 0;
		}

		public SetField(field_idx: number, is_has: boolean): void {
			var array_idx = this._GetArrayIdx(field_idx);
			var slotbit_idx = this._GetSlotbitIdx(field_idx);

			var slot = this.HasBits[array_idx];
			if (is_has) {
				var mask = (1) << slotbit_idx;
				this.HasBits[array_idx] = slot | mask;
			} else {
				var mask = ~((1) << slotbit_idx);
				this.HasBits[array_idx] = slot & mask;
			}
		}

		public ClearField(): void {
			for (var i = 0; i < this.HasBits.length; i++) {
				this.HasBits[i] = 0;
			}
		}
	}
}