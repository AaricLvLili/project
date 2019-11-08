class GameSocket {

	_socketStatus = 0;
	_lastReceiveTime = 0;
	pid = 0;
	/**
	 * 服务器协议处理注册表
	 * 格式
	 * PACK_HANDLER[sysId][msgId] = [fun,funThisObj]
	 */
	// PACK_HANDLER = [];
	_serverId = 0;
	_user = "";
	private _uid = ""
	_pwd = "";
	_host: any;
	_port: any;
	recvPack = new GameByteArray();
	_packets = [];
	_onConnected: any;
	_onClosed: any;

	socket_: egret.WebSocket;

	// public static get uid(): string {
	// 	return GameSocket.ins()._uid
	// }

	public constructor() {
		this.newSocket();
	}

	public static httpsProtocol = "http:";

	public static HTTPS = "https:";
	public static HTTP = "http:";

	private static _ins: GameSocket;
	public static ins = function () {
		if (!GameSocket._ins) {
			GameSocket._ins = new GameSocket();
		}
		return GameSocket._ins;
	};
	public newSocket() {
		this.socket_ = new egret.WebSocket;

		this.socket_.type = egret.WebSocket.TYPE_BINARY;
		this.socket_.addEventListener(egret.Event.CONNECT, this.onSocketConnected, this);
		this.socket_.addEventListener(egret.Event.CLOSE, this.onSocketClose, this);
		this.socket_.addEventListener(egret.ProgressEvent.SOCKET_DATA, this.onSocketRead, this);
		this.socket_.addEventListener(egret.IOErrorEvent.IO_ERROR, this.connectError, this);
	};
    /**
     * 发送到服务器
     * @param bytes
     */
	// public sendToServer(bytes) {
	// 	this.send(bytes);
	// 	this.recycleByte(bytes);
	// };
	public connectError() {
		// alert("网络中断--" + LocationProperty.serverIP + ":" + LocationProperty.serverPort);
		alert("网络中断");//网络中断
		// window["connectError"]();
	};
	public connect(host, port) {
		this.updateStatus(GameSocket.STATUS_CONNECTING);
		this._host = host;
		this._port = port;

		// alert( GameSocket.httpsProtocol)

		if (GameSocket.httpsProtocol == GameSocket.HTTPS)
			this.socket_.connectByUrl("wss://" + host + ":" + port);
		else
			this.socket_.connect(host, port);
	};
	public close() {
		console.log("close socket！ip:" + this._host + " port:" + this._port);
		this.socket_.close();
	};

	// public send(message) {
	// 	if (NetTest.IsTest) {
	// 		var p = message 
	// 		var packID: PackageID = p.data.getUint8(12)
	// 		var subID: number = p.data.getUint8(13)

	// 		NetTest.Handle(packID, subID);

	// 		return true;
	// 	}

	// 	if (this._socketStatus == GameSocket.STATUS_COMMUNICATION) {
	// 		this.sendPack(message);
	// 		return true;
	// 	}
	// 	else {
	// 		console.log("发送数据时没和服务连接或者未进入通信状态");
	// 		return false;
	// 	}
	// };

	public GetSocketState() {
		return this._socketStatus
	}

	public Rpc(tag: number, rpcReq: Sproto.SprotoTypeBase = null, rpcRspHandler: Function = null, thisObj: any = null): boolean {
		this.send(Sproto.SprotoSender.Pack(tag, rpcReq, rpcRspHandler, thisObj))
		return true;
	}

	public send(message: egret.ByteArray): boolean {
		if (this._socketStatus == GameSocket.STATUS_COMMUNICATION && RoleMgr.CheckAccount) {
			this.sendPack(message);
			return true;
		} else {
			console.log("发送数据时没和服务连接或者未进入通信状态");
			return false;
		}
	}

	public onSocketConnected(e) {
		console.log("Socket connected！ip:" + this._host + " port:" + this._port);
		TimerManager.ins().remove(this.reLogin, this);
		// this.updateStatus(GameSocket.STATUS_CHECKING);
		this.updateStatus(GameSocket.STATUS_COMMUNICATION);
		// var bytes = new GameByteArray();
		// bytes.writeUnsignedInt(Encrypt.getSelfSalt());
		// this.socket_.writeBytes(bytes);
		// this.socket_.flush();

		// let checkAccount = new Sproto.checkAccount_request();
		// checkAccount.accountname = this._user;
		// checkAccount.password = this._user;
		// this.Rpc(C2sProtocol.checkAccount, checkAccount);

		// if (this._onConnected) {
		// 	this._onConnected();
		// }
	};

	public onSocketRead(e) {
		var bytesCache = this.recvPack;
		let socket: any = this.socket_

		socket._readByte.position = 0
		let len = socket._readByte.bytesAvailable
		socket.readBytes(bytesCache, 0);

		let byteArray = Sproto.SprotoCore.Dispatch(new Uint8Array(bytesCache.buffer.slice(0, len)));
		if (byteArray) {
			this.send(byteArray);
		}
	}

	private m_ReLoginTimer = 0

	public onSocketClose(e) {
		egret.log("与服务器的连接断开了！ip:" + this._host + " port:" + this._port);
		this.updateStatus(GameSocket.STATUS_DISCONNECT);
		if (this._onClosed) {
			this._onClosed();
		}
		let gameserver = GameServer.ins()
		// 如果是被顶号，就不自动连接
		if (gameserver && gameserver.mOtherLogin) {
			return
		}
		// 断线的时候清除聊天信息
		Chat.ins().ClearMsg()
		this.m_ReLoginTimer = egret.getTimer()
		TimerManager.ins().doTimer(5000, 0, this.reLogin, this);
	};

	public reLogin() {
		// if (egret.getTimer() < this.m_ReLoginTimer + 9000) {
		// 	return
		// }
		// this.m_ReLoginTimer = egret.getTimer()
		// 重新连接的时候，需要检查账号
		console.log(">>>>>>>>>>>>>>>>>重连服务器");
		RoleMgr.CheckAccount = false
		this.close();
		// this.newSocket();
		this.login(this._user, this._uid, this._pwd, this._serverId, this._host + ":" + this._port);
	};
	public updateStatus(status) {
		if (this._socketStatus != status) {
			var old = this._socketStatus;
			this._socketStatus = status;
			this.onFinishCheck(status, old);
		}
	}


	public onFinishCheck(newStatus, oldStatus) {
		if (newStatus == GameSocket.STATUS_COMMUNICATION) {
			egret.log("与服务器建立通信成功！ip:" + this._host + " port:" + this._port);
			EasyLoading.ins().hideLoading();
			this.sendCheckAccount(this._user, this._uid, this._pwd);

			TimerManager.ins().remove(this._SendHeartBeat, this)
			TimerManager.ins().doTimer(5000, 0, this._SendHeartBeat, this)
		}
		else if (newStatus == GameSocket.STATUS_DISCONNECT) {
			TimerManager.ins().remove(this._SendHeartBeat, this)
		}
	};

	// private m_PreHeartBeat = 0
	private m_ServerTimeCounter = 5

	private _SendHeartBeat() {
		this.Rpc(C2sProtocol.cs_send_heart_beat)
		if (++this.m_ServerTimeCounter % 100 == 0) {
			this.Rpc(C2sProtocol.cs_get_server_time)
		}
	}

	public get host(): any {
		return this._host;
	}
	public get port(): any {
		return this._port;
	}
	public sendCheckAccount(user, uid, pwd) {
		// var bytes = this.getBytes();
		// bytes.writeCmd(255, 1);
		// bytes.writeInt(this._serverId);
		// bytes.writeString(user);
		// bytes.writeString(pwd);
		// this.send(bytes);
		egret.log("验证账号")
		RoleMgr.Checking = true
		let checkAccount = new Sproto.checkAccount_request();
		checkAccount.accountname = user
		checkAccount.platformuid = uid
		checkAccount.token = pwd
		checkAccount.serverid = GameServer.serverID;
		this.sendPack(Sproto.SprotoSender.Pack(C2sProtocol.checkAccount, checkAccount))
	};

	public login(user, uid, pwd, serverID, ip) {
		pwd = pwd ? pwd : "e10adc3949ba59abbe56e057f20f883e";
		this._user = user;
		this._pwd = pwd;
		this._uid = uid
		this._serverId = serverID;
		GameServer.serverID = serverID;
		var host = ip.split(":")[0];
		var port = 9001;
		if (ip.split(":")[1] && ip.split(":")[1].length)
			port = parseInt(ip.split(":")[1]);
		if (!this.socket_.connected) {
			egret.log("connect to " + host + " ,port: " + port);
			this.connect(host, port);
		}
		else {
			this.sendCheckAccount(user, uid, pwd);
		}
		egret.log("准备连接服务器");
	};
	// public processRecvPacket(packet) {
	// var sysId = packet.readUnsignedByte();
	// var msgId = packet.readUnsignedByte();
	// this.dispatch(sysId, msgId, packet);
	// };
	/** 派发协议 */
	// public dispatch(sysId, msgId, byte) {
	// 	// console.log(`收到${sysId}-${msgId}`);
	// 	if (!this.PACK_HANDLER[sysId] || !this.PACK_HANDLER[sysId][msgId]) {
	// 		// 这里是为了兼容以前的代码，以后baseproxy会去掉
	// 		if (!GameSocket.PACK_HANDLER[sysId] || !GameSocket.PACK_HANDLER[sysId][msgId]) {
	// 			egret.log("未处理服务器协议：" + sysId + "-" + msgId);
	// 		}
	// 		else {
	// 			var arr_1 = GameSocket.PACK_HANDLER[sysId][msgId];
	// 			arr_1[0].call(arr_1[1], byte);
	// 		}
	// 		return;
	// 	}
	// 			// egret.log("处理协议：" + sysId + "-" + msgId);

	// 	var arr = this.PACK_HANDLER[sysId][msgId];
	// 	arr[0].call(arr[1], byte);
	// 	this.recycleByte(byte);
	// };
    /**
     * 回收bytes对象
     * @param byte
     */
	// public recycleByte(byte) {
	// 	ObjectPool.push(byte);
	// };
    /**
     * 从对象池获取一个bytes对象
     */
	// public getBytes() {
	// 	var pack = ObjectPool.pop(GameSocket.BYTE_CLASS_NAME);
	// 	pack.clear();
	// 	pack.writeShort(GameSocket.DEFAULT_TAG);
	// 	pack.writeShort(0);
	// 	pack.writeShort(0);
	// 	pack.writeShort(GameSocket.DEFAULT_CRC_KEY);
	// 	pack.writeUnsignedInt(this.pid++);
	// 	return pack;
	// };
    /**
     * 注册一个服务器发送到客户端的消息处理
     * @param msgId
     * @param fun
     * @param thisObj
     */
	public registerSTCFunc(sysId, msgId, fun, sysClass) {
		// if (!this.PACK_HANDLER[sysId]) {
		// 	this.PACK_HANDLER[sysId] = [];
		// }
		// else if (this.PACK_HANDLER[sysId][msgId]) {
		// 	console.error("\u91CD\u590D\u6CE8\u518C\u534F\u8BAE\u63A5\u53E3" + sysId + "-" + msgId);
		// 	return;
		// }
		// this.PACK_HANDLER[sysId][msgId] = [fun, sysClass];
	};
	public setOnClose(ex, obj) {
		this._onClosed = ex.bind(obj);
	};
	public setOnConnected(ex, obj) {
		this._onConnected = ex.bind(obj);
	};
	public sendPack(pack) {
		if (pack == null || pack.length == 0) {
			throw new egret.error("创建客户端数据包时数据不能为空！");
		}
		this.socket_.writeBytes(pack);
	};
	public static DEFAULT_TAG = 0xCCEE; // 约定的信息头
	public static DEFAULT_CRC_KEY = 0x765D; // 默认包头校验
	public static HEAD_SIZE = 8; // 最小通信封包字节长度
	/** 连接中 */
	public static STATUS_CONNECTING = 1;
	/** 检验中 */
	public static STATUS_CHECKING = 2;
	/** 连接生效 */
	public static STATUS_COMMUNICATION = 3;
	/** 关闭连接 */
	public static STATUS_DISCONNECT = 4;
	public static PACK_HANDLER = [];
	public static BYTE_CLASS_NAME = egret.getQualifiedClassName(GameByteArray);
}
window["GameSocket"] = GameSocket