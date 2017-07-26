import * as LazySocket from 'lazy-socket';

enum StatType { COUNTER, TIMER, GAUGE }
const WHITESPACE = /[\\s]+/;

class Statsd {

    
    
    private prependNewline = false;
    private socket: LazySocket;

    // private ByteArrayOutputStream outputData;
    // private DatagramSocket datagramSocket;
    // private Writer writer;

    constructor(private host: string, private port: number) {
        // outputData = new ByteArrayOutputStream();
        this.socket = LazySocket.createConnection(host, port);
    }

    public void connect() throws IllegalStateException, SocketException {
        if(datagramSocket != null) {
            throw new IllegalStateException("Already connected");
        }

        prependNewline = false;

        datagramSocket = new DatagramSocket();

        outputData.reset();
        this.writer = new BufferedWriter(new OutputStreamWriter(outputData));
    }

    send(name: string, value: string, statType: StatType): void {
        let statTypeStr = "";
        switch (statType) {
            case StatType.COUNTER:
                statTypeStr = "c";
                break;
            case StatType.GAUGE:
                statTypeStr = "g";
                break;
            case StatType.TIMER:
                statTypeStr = "ms";
                break;
        }

        try {
            this.socket.write(`${name}:${value}|${statTypeStr}`)
            this.socket.write(sanitizeString(name));
            this.socket.write(":");
            this.socket.write(value);
            this.socket.write("|");
            this.socket.write(statTypeStr);
            this.prependNewline = true;
        } catch (e) {
            //
        }
    }

    @Override
    public void close() throws IOException {
        DatagramPacket packet = newPacket(outputData);

        packet.setData(outputData.toByteArray());
        datagramSocket.send(packet);

        if(datagramSocket != null) {
            datagramSocket.close();
        }
        this.datagramSocket = null;
        this.writer = null;
    }

    private String sanitizeString(String s) {
        return WHITESPACE.matcher(s).replaceAll("-");
    }

    private DatagramPacket newPacket(ByteArrayOutputStream out) {
        byte[] dataBuffer;

        if (out != null) {
            dataBuffer = out.toByteArray();
        }
        else {
            dataBuffer = new byte[8192];
        }

        try {
            return new DatagramPacket(dataBuffer, dataBuffer.length, InetAddress.getByName(this.host), this.port);
        } catch (Exception e) {
            return null;
        }
    }
}