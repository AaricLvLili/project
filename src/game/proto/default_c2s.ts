// Generated by sprotodump. DO NOT EDIT!

namespace Sproto { 
	export class cs_add_zs_point_request extends Sproto.SprotoTypeBase {
		
		public roleid: number; // tag 0
		public value: number[]; // tag 1
		public constructor(buffer: Uint8Array = null) {
			super(2, buffer);
		}

		protected Decode (): void {
			let tag = -1;
			while (-1 != (tag = this.de.rt())) {
				switch (tag) {
				case 0:
					this.roleid = this.de.ri ();
					break;
				case 1:
					this.value = this.de.ria ();
					break;
				default:
					this.de.ReadUnknowData ();
					break;
				}
			}
		}

		public EncodeStream (stream: Sproto.SprotoStream): number {
			this.se.Open (stream);

			if (this.roleid != undefined) {
				this.se.wi (this.roleid, 0);
			}

			if (this.value != undefined) {
				this.se.wia (this.value, 1);
			}

			return this.se.Close ();
		}
	}


	export class cs_baserecord_info_request extends Sproto.SprotoTypeBase {
		
		public type: number; // tag 0
		public constructor(buffer: Uint8Array = null) {
			super(1, buffer);
		}

		protected Decode (): void {
			let tag = -1;
			while (-1 != (tag = this.de.rt())) {
				switch (tag) {
				case 0:
					this.type = this.de.ri ();
					break;
				default:
					this.de.ReadUnknowData ();
					break;
				}
			}
		}

		public EncodeStream (stream: Sproto.SprotoStream): number {
			this.se.Open (stream);

			if (this.type != undefined) {
				this.se.wi (this.type, 0);
			}

			return this.se.Close ();
		}
	}


	export class cs_change_actor_name_request extends Sproto.SprotoTypeBase {
		
		public name: string; // tag 0
		public constructor(buffer: Uint8Array = null) {
			super(1, buffer);
		}

		protected Decode (): void {
			let tag = -1;
			while (-1 != (tag = this.de.rt())) {
				switch (tag) {
				case 0:
					this.name = this.de.rs ();
					break;
				default:
					this.de.ReadUnknowData ();
					break;
				}
			}
		}

		public EncodeStream (stream: Sproto.SprotoStream): number {
			this.se.Open (stream);

			if (this.name != undefined) {
				this.se.ws (this.name, 0);
			}

			return this.se.Close ();
		}
	}


	export class cs_client_ready_req_request extends Sproto.SprotoTypeBase {
		
		public constructor(buffer: Uint8Array = null) {
			super(0, buffer);
		}

		protected Decode (): void {
			let tag = -1;
			while (-1 != (tag = this.de.rt())) {
				switch (tag) {
				default:
					this.de.ReadUnknowData ();
					break;
				}
			}
		}

		public EncodeStream (stream: Sproto.SprotoStream): number {
			this.se.Open (stream);

			return this.se.Close ();
		}
	}


	export class cs_create_new_sub_role_request extends Sproto.SprotoTypeBase {
		
		public job: number; // tag 0
		public sex: number; // tag 1
		public constructor(buffer: Uint8Array = null) {
			super(2, buffer);
		}

		protected Decode (): void {
			let tag = -1;
			while (-1 != (tag = this.de.rt())) {
				switch (tag) {
				case 0:
					this.job = this.de.ri ();
					break;
				case 1:
					this.sex = this.de.ri ();
					break;
				default:
					this.de.ReadUnknowData ();
					break;
				}
			}
		}

		public EncodeStream (stream: Sproto.SprotoStream): number {
			this.se.Open (stream);

			if (this.job != undefined) {
				this.se.wi (this.job, 0);
			}

			if (this.sex != undefined) {
				this.se.wi (this.sex, 1);
			}

			return this.se.Close ();
		}
	}


	export class cs_element_set_req_request extends Sproto.SprotoTypeBase {
		
		public roleid: number; // tag 0
		public mainEle: number; // tag 1
		public constructor(buffer: Uint8Array = null) {
			super(2, buffer);
		}

		protected Decode (): void {
			let tag = -1;
			while (-1 != (tag = this.de.rt())) {
				switch (tag) {
				case 0:
					this.roleid = this.de.ri ();
					break;
				case 1:
					this.mainEle = this.de.ri ();
					break;
				default:
					this.de.ReadUnknowData ();
					break;
				}
			}
		}

		public EncodeStream (stream: Sproto.SprotoStream): number {
			this.se.Open (stream);

			if (this.roleid != undefined) {
				this.se.wi (this.roleid, 0);
			}

			if (this.mainEle != undefined) {
				this.se.wi (this.mainEle, 1);
			}

			return this.se.Close ();
		}
	}


	export class cs_get_actor_module_isactive_request extends Sproto.SprotoTypeBase {
		
		public otherid: number; // tag 0
		public roleid: number; // tag 1
		public constructor(buffer: Uint8Array = null) {
			super(2, buffer);
		}

		protected Decode (): void {
			let tag = -1;
			while (-1 != (tag = this.de.rt())) {
				switch (tag) {
				case 0:
					this.otherid = this.de.ri ();
					break;
				case 1:
					this.roleid = this.de.ri ();
					break;
				default:
					this.de.ReadUnknowData ();
					break;
				}
			}
		}

		public EncodeStream (stream: Sproto.SprotoStream): number {
			this.se.Open (stream);

			if (this.otherid != undefined) {
				this.se.wi (this.otherid, 0);
			}

			if (this.roleid != undefined) {
				this.se.wi (this.roleid, 1);
			}

			return this.se.Close ();
		}
	}


	export class cs_get_gongnengyugao_reward_request extends Sproto.SprotoTypeBase {
		
		public index: number; // tag 0
		public constructor(buffer: Uint8Array = null) {
			super(1, buffer);
		}

		protected Decode (): void {
			let tag = -1;
			while (-1 != (tag = this.de.rt())) {
				switch (tag) {
				case 0:
					this.index = this.de.ri ();
					break;
				default:
					this.de.ReadUnknowData ();
					break;
				}
			}
		}

		public EncodeStream (stream: Sproto.SprotoStream): number {
			this.se.Open (stream);

			if (this.index != undefined) {
				this.se.wi (this.index, 0);
			}

			return this.se.Close ();
		}
	}


	export class cs_get_gongnengyugao_reward_response extends Sproto.SprotoTypeBase {
		
		public index: number; // tag 0
		public gongnengYugao: number; // tag 1
		public constructor(buffer: Uint8Array = null) {
			super(2, buffer);
		}

		protected Decode (): void {
			let tag = -1;
			while (-1 != (tag = this.de.rt())) {
				switch (tag) {
				case 0:
					this.index = this.de.ri ();
					break;
				case 1:
					this.gongnengYugao = this.de.ri ();
					break;
				default:
					this.de.ReadUnknowData ();
					break;
				}
			}
		}

		public EncodeStream (stream: Sproto.SprotoStream): number {
			this.se.Open (stream);

			if (this.index != undefined) {
				this.se.wi (this.index, 0);
			}

			if (this.gongnengYugao != undefined) {
				this.se.wi (this.gongnengYugao, 1);
			}

			return this.se.Close ();
		}
	}


	export class cs_get_other_actor_base_info_request extends Sproto.SprotoTypeBase {
		
		public otherid: number; // tag 0
		public roleid: number; // tag 1
		public id: number; // tag 2
		public constructor(buffer: Uint8Array = null) {
			super(3, buffer);
		}

		protected Decode (): void {
			let tag = -1;
			while (-1 != (tag = this.de.rt())) {
				switch (tag) {
				case 0:
					this.otherid = this.de.ri ();
					break;
				case 1:
					this.roleid = this.de.ri ();
					break;
				case 2:
					this.id = this.de.ri ();
					break;
				default:
					this.de.ReadUnknowData ();
					break;
				}
			}
		}

		public EncodeStream (stream: Sproto.SprotoStream): number {
			this.se.Open (stream);

			if (this.otherid != undefined) {
				this.se.wi (this.otherid, 0);
			}

			if (this.roleid != undefined) {
				this.se.wi (this.roleid, 1);
			}

			if (this.id != undefined) {
				this.se.wi (this.id, 2);
			}

			return this.se.Close ();
		}
	}


	export class cs_get_other_actor_info_request extends Sproto.SprotoTypeBase {
		
		public otherid: number; // tag 0
		public constructor(buffer: Uint8Array = null) {
			super(1, buffer);
		}

		protected Decode (): void {
			let tag = -1;
			while (-1 != (tag = this.de.rt())) {
				switch (tag) {
				case 0:
					this.otherid = this.de.ri ();
					break;
				default:
					this.de.ReadUnknowData ();
					break;
				}
			}
		}

		public EncodeStream (stream: Sproto.SprotoStream): number {
			this.se.Open (stream);

			if (this.otherid != undefined) {
				this.se.wi (this.otherid, 0);
			}

			return this.se.Close ();
		}
	}


	export class cs_get_server_time_request extends Sproto.SprotoTypeBase {
		
		public constructor(buffer: Uint8Array = null) {
			super(0, buffer);
		}

		protected Decode (): void {
			let tag = -1;
			while (-1 != (tag = this.de.rt())) {
				switch (tag) {
				default:
					this.de.ReadUnknowData ();
					break;
				}
			}
		}

		public EncodeStream (stream: Sproto.SprotoStream): number {
			this.se.Open (stream);

			return this.se.Close ();
		}
	}


	export class cs_rank_player_info_request extends Sproto.SprotoTypeBase {
		
		public roleId: number; // tag 0
		public dbid: number; // tag 1
		public constructor(buffer: Uint8Array = null) {
			super(2, buffer);
		}

		protected Decode (): void {
			let tag = -1;
			while (-1 != (tag = this.de.rt())) {
				switch (tag) {
				case 0:
					this.roleId = this.de.ri ();
					break;
				case 1:
					this.dbid = this.de.ri ();
					break;
				default:
					this.de.ReadUnknowData ();
					break;
				}
			}
		}

		public EncodeStream (stream: Sproto.SprotoStream): number {
			this.se.Open (stream);

			if (this.roleId != undefined) {
				this.se.wi (this.roleId, 0);
			}

			if (this.dbid != undefined) {
				this.se.wi (this.dbid, 1);
			}

			return this.se.Close ();
		}
	}


	export class cs_send_heart_beat_request extends Sproto.SprotoTypeBase {
		
		public constructor(buffer: Uint8Array = null) {
			super(0, buffer);
		}

		protected Decode (): void {
			let tag = -1;
			while (-1 != (tag = this.de.rt())) {
				switch (tag) {
				default:
					this.de.ReadUnknowData ();
					break;
				}
			}
		}

		public EncodeStream (stream: Sproto.SprotoStream): number {
			this.se.Open (stream);

			return this.se.Close ();
		}
	}


	export class cs_sene_gm_command_request extends Sproto.SprotoTypeBase {
		
		public cmd: string; // tag 0
		public constructor(buffer: Uint8Array = null) {
			super(1, buffer);
		}

		protected Decode (): void {
			let tag = -1;
			while (-1 != (tag = this.de.rt())) {
				switch (tag) {
				case 0:
					this.cmd = this.de.rs ();
					break;
				default:
					this.de.ReadUnknowData ();
					break;
				}
			}
		}

		public EncodeStream (stream: Sproto.SprotoStream): number {
			this.se.Open (stream);

			if (this.cmd != undefined) {
				this.se.ws (this.cmd, 0);
			}

			return this.se.Close ();
		}
	}


	export class cs_set_clientvalue_request extends Sproto.SprotoTypeBase {
		
		public value: number; // tag 0
		public constructor(buffer: Uint8Array = null) {
			super(1, buffer);
		}

		protected Decode (): void {
			let tag = -1;
			while (-1 != (tag = this.de.rt())) {
				switch (tag) {
				case 0:
					this.value = this.de.ri ();
					break;
				default:
					this.de.ReadUnknowData ();
					break;
				}
			}
		}

		public EncodeStream (stream: Sproto.SprotoStream): number {
			this.se.Open (stream);

			if (this.value != undefined) {
				this.se.wi (this.value, 0);
			}

			return this.se.Close ();
		}
	}


	export class cs_set_is_open_payfrist_request extends Sproto.SprotoTypeBase {
		
		public value: number; // tag 0
		public constructor(buffer: Uint8Array = null) {
			super(1, buffer);
		}

		protected Decode (): void {
			let tag = -1;
			while (-1 != (tag = this.de.rt())) {
				switch (tag) {
				case 0:
					this.value = this.de.ri ();
					break;
				default:
					this.de.ReadUnknowData ();
					break;
				}
			}
		}

		public EncodeStream (stream: Sproto.SprotoStream): number {
			this.se.Open (stream);

			if (this.value != undefined) {
				this.se.wi (this.value, 0);
			}

			return this.se.Close ();
		}
	}


	export class cs_zs_point_clear_request extends Sproto.SprotoTypeBase {
		
		public roldid: number; // tag 0
		public constructor(buffer: Uint8Array = null) {
			super(1, buffer);
		}

		protected Decode (): void {
			let tag = -1;
			while (-1 != (tag = this.de.rt())) {
				switch (tag) {
				case 0:
					this.roldid = this.de.ri ();
					break;
				default:
					this.de.ReadUnknowData ();
					break;
				}
			}
		}

		public EncodeStream (stream: Sproto.SprotoStream): number {
			this.se.Open (stream);

			if (this.roldid != undefined) {
				this.se.wi (this.roldid, 0);
			}

			return this.se.Close ();
		}
	}


	export class cs_zs_point_req_request extends Sproto.SprotoTypeBase {
		
		public constructor(buffer: Uint8Array = null) {
			super(0, buffer);
		}

		protected Decode (): void {
			let tag = -1;
			while (-1 != (tag = this.de.rt())) {
				switch (tag) {
				default:
					this.de.ReadUnknowData ();
					break;
				}
			}
		}

		public EncodeStream (stream: Sproto.SprotoStream): number {
			this.se.Open (stream);

			return this.se.Close ();
		}
	}


}

