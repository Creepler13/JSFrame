
import java.awt.Image;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.net.DatagramPacket;
import java.net.DatagramSocket;
import java.net.InetSocketAddress;

import javax.imageio.ImageIO;

public class Client {

	public DatagramSocket socket;

	public byte[] buffer;
	public int width, heigth;

	public Client(int port, int bufferSize, int width, int height) throws IOException {
		this.socket = new DatagramSocket();
		this.socket.connect(new InetSocketAddress("127.0.0.1", port));
		String nachricht = "port," + this.socket.getLocalPort();
		this.socket.send(new DatagramPacket(nachricht.getBytes(), nachricht.getBytes().length));
		this.buffer = new byte[bufferSize];
		this.width = width;
		this.heigth = height;
	}

	public Image getImg() throws IOException {
		this.socket.receive(new DatagramPacket(this.buffer, this.buffer.length));

		BufferedImage image = null;
		ByteArrayInputStream bis = new ByteArrayInputStream(this.buffer, 0, this.buffer.length);
		try {
			image = ImageIO.read(bis);
		} catch (javax.imageio.IIOException e) {
			this.buffer = new byte[this.buffer.length * 2];
			this.write("bufferfix," + this.buffer.length);
			return null;
		}
		bis.close();

		return image;
	}

	public void write(String nachricht) {
		try {
			this.socket.send(new DatagramPacket(nachricht.getBytes(), nachricht.getBytes().length));
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
}
