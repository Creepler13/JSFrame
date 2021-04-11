
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.net.DatagramPacket;
import java.net.DatagramSocket;
import java.net.InetSocketAddress;
import java.net.Socket;

import javax.imageio.ImageIO;

public class Client {

	public DatagramSocket imgSocket;
	public Socket msgSocket;

	public byte[] buffer;
	public int width, heigth;

	private Window window;

	public Client(int port, int bufferSize, int width, int height) throws IOException {
		this.window = new Window(width, height, this);

		this.imgSocket = new DatagramSocket();
		this.imgSocket.connect(new InetSocketAddress("127.0.0.1", port));
		String nachricht = "port," + this.imgSocket.getLocalPort();
		this.imgSocket.send(new DatagramPacket(nachricht.getBytes(), nachricht.getBytes().length));
		this.buffer = new byte[bufferSize];
	}

	public void update() throws IOException {
		this.imgSocket.receive(new DatagramPacket(this.buffer, this.buffer.length));
		if (this.buffer[0] == 0) {
			BufferedImage image = null;
			ByteArrayInputStream bis = new ByteArrayInputStream(this.buffer, 1, this.buffer.length);
			try {
				image = ImageIO.read(bis);
			} catch (javax.imageio.IIOException e) {
				this.buffer = new byte[this.buffer.length * 2];
				this.write("bufferfix," + this.buffer.length);
				return;
			}
			bis.close();
			window.JBC.setBackground(image);
		} else {
			messageRecieved(this.buffer);
		}
	}

	public void write(String nachricht) {
		try {
			this.imgSocket.send(new DatagramPacket(nachricht.getBytes(), nachricht.getBytes().length));
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}

	public void messageRecieved(byte[] buffer) {
		int i = 0;
		for (byte b : buffer) {
			if (b == (byte) 0x3b)
				break;
			i++;
		}

		String[] split = new String(buffer, 1, i).split(",");
		switch (split[0]) {
		case "":
			break;

		}
	}

}
