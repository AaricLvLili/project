class BitUtil {

	static readonly EOF_byte: number = -1;
	static readonly EOF_code_point: number = -1;

	public static Has(value: number, bit: number) {
		return (value & (1 << bit)) > 0
	}

	public static Set(value: number, bit: number, state: boolean): number {
        if (state) {
            value |= 1 << (bit & 0xff)
        } else {
            value &= ~(1 << (bit & 0xff))
        }
		return value
	}

	private static decoderError(fatal, opt_code_point?): number {
		if (fatal) {
			egret.$error(1027);
		}
		return opt_code_point || 0xFFFD;
	}

	private static encoderError(code_point) {
		egret.$error(1026, code_point);
	}

	private static inRange(a, min, max) {
		return min <= a && a <= max;
	}

	private static div(n, d) {
		return Math.floor(n / d);
	}

	public static decodeUTF8(data: Uint8Array): string {
		let fatal: boolean = false;
		let pos: number = 0;
		let result: string = "";
		let code_point: number;
		let utf8_code_point = 0;
		let utf8_bytes_needed = 0;
		let utf8_bytes_seen = 0;
		let utf8_lower_boundary = 0;

		while (data.length > pos) {

			let _byte = data[pos++];

			if (_byte == this.EOF_byte) {
				if (utf8_bytes_needed != 0) {
					code_point = this.decoderError(fatal);
				} else {
					code_point = this.EOF_code_point;
				}
			} else {

				if (utf8_bytes_needed == 0) {
					if (this.inRange(_byte, 0x00, 0x7F)) {
						code_point = _byte;
					} else {
						if (this.inRange(_byte, 0xC2, 0xDF)) {
							utf8_bytes_needed = 1;
							utf8_lower_boundary = 0x80;
							utf8_code_point = _byte - 0xC0;
						} else if (this.inRange(_byte, 0xE0, 0xEF)) {
							utf8_bytes_needed = 2;
							utf8_lower_boundary = 0x800;
							utf8_code_point = _byte - 0xE0;
						} else if (this.inRange(_byte, 0xF0, 0xF4)) {
							utf8_bytes_needed = 3;
							utf8_lower_boundary = 0x10000;
							utf8_code_point = _byte - 0xF0;
						} else {
							this.decoderError(fatal);
						}
						utf8_code_point = utf8_code_point * Math.pow(64, utf8_bytes_needed);
						code_point = null;
					}
				} else if (!this.inRange(_byte, 0x80, 0xBF)) {
					utf8_code_point = 0;
					utf8_bytes_needed = 0;
					utf8_bytes_seen = 0;
					utf8_lower_boundary = 0;
					pos--;
					code_point = this.decoderError(fatal, _byte);
				} else {

					utf8_bytes_seen += 1;
					utf8_code_point = utf8_code_point + (_byte - 0x80) * Math.pow(64, utf8_bytes_needed - utf8_bytes_seen);

					if (utf8_bytes_seen !== utf8_bytes_needed) {
						code_point = null;
					} else {

						let cp = utf8_code_point;
						let lower_boundary = utf8_lower_boundary;
						utf8_code_point = 0;
						utf8_bytes_needed = 0;
						utf8_bytes_seen = 0;
						utf8_lower_boundary = 0;
						if (this.inRange(cp, lower_boundary, 0x10FFFF) && !this.inRange(cp, 0xD800, 0xDFFF)) {
							code_point = cp;
						} else {
							code_point = this.decoderError(fatal, _byte);
						}
					}

				}
			}
			//Decode string
			if (code_point !== null && code_point !== this.EOF_code_point) {
				if (code_point <= 0xFFFF) {
					if (code_point > 0) result += String.fromCharCode(code_point);
				} else {
					code_point -= 0x10000;
					result += String.fromCharCode(0xD800 + ((code_point >> 10) & 0x3ff));
					result += String.fromCharCode(0xDC00 + (code_point & 0x3ff));
				}
			}
		}
		return result;
	}

	public static encodeUTF8(str: string): Uint8Array {
		let pos: number = 0;
		let codePoints = BitUtil.stringToCodePoints(str);
		let outputBytes = [];

		while (codePoints.length > pos) {
			let code_point: number = codePoints[pos++];

			if (BitUtil.inRange(code_point, 0xD800, 0xDFFF)) {
				BitUtil.encoderError(code_point);
			}
			else if (BitUtil.inRange(code_point, 0x0000, 0x007f)) {
				outputBytes.push(code_point);
			} else {
				let count, offset;
				if (BitUtil.inRange(code_point, 0x0080, 0x07FF)) {
					count = 1;
					offset = 0xC0;
				} else if (BitUtil.inRange(code_point, 0x0800, 0xFFFF)) {
					count = 2;
					offset = 0xE0;
				} else if (BitUtil.inRange(code_point, 0x10000, 0x10FFFF)) {
					count = 3;
					offset = 0xF0;
				}

				outputBytes.push(BitUtil.div(code_point, Math.pow(64, count)) + offset);

				while (count > 0) {
					let temp = BitUtil.div(code_point, Math.pow(64, count - 1));
					outputBytes.push(0x80 + (temp % 64));
					count -= 1;
				}
			}
		}
		return new Uint8Array(outputBytes);
	}

	public static UTF8ByteCount(str: string): number {
		return this.encodeUTF8(str).length;
	}

	private static stringToCodePoints(string) {
		/** @type {Array.<number>} */
		let cps = [];
		// Based on http://www.w3.org/TR/WebIDL/#idl-DOMString
		let i = 0, n = string.length;
		while (i < string.length) {
			let c = string.charCodeAt(i);
			if (!BitUtil.inRange(c, 0xD800, 0xDFFF)) {
				cps.push(c);
			} else if (BitUtil.inRange(c, 0xDC00, 0xDFFF)) {
				cps.push(0xFFFD);
			} else { // (inRange(c, 0xD800, 0xDBFF))
				if (i == n - 1) {
					cps.push(0xFFFD);
				} else {
					let d = string.charCodeAt(i + 1);
					if (BitUtil.inRange(d, 0xDC00, 0xDFFF)) {
						let a = c & 0x3FF;
						let b = d & 0x3FF;
						i += 1;
						cps.push(0x10000 + (a << 10) + b);
					} else {
						cps.push(0xFFFD);
					}
				}
			}
			i += 1;
		}
		return cps;
	}
}
window["BitUtil"]=BitUtil