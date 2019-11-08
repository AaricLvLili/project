namespace Sproto {
    export class SprotoCore {

        private static m_ParserPack: Sproto.SprotoPack;
        private static m_Pkg: Sproto.Spackage;

        public static Init(): void {
            SprotoCore.m_ParserPack = new Sproto.SprotoPack();
            SprotoCore.m_Pkg = new Sproto.Spackage();
        }

        public static Dispatch(byteArray: Uint8Array): egret.ByteArray {
            let pack2 = SprotoCore.m_ParserPack;
            let data = pack2.Unpack(byteArray);

            let packet = SprotoCore.m_Pkg;
            packet.type = undefined
            packet.session = undefined
            let offset = packet.InitArray(data);

            if (packet.type) {
                let rpcRsp = Sproto.SprotoReceiver.HandlerType(packet.type, packet.session, data, offset);
                if (rpcRsp != null) {
                    return Sproto.SprotoSender.SendData(rpcRsp, packet.session, packet.type);
                }
            } else {
                Sproto.SprotoSender.HandlerSession(packet.session, data, offset);
            }
            return null;
        }
    }
}