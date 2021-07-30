package base;

import java.awt.Graphics2D;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.File;
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

	public Window window;

	public BufferedImage background;
	public Graphics2D g2d;

	private MouseColliderHandler mouseColliderHandler;

	public Client(int port, int bufferSize, int width, int height, Boolean hideOnReady) throws IOException {
		this.window = new Window(width, height, this, hideOnReady);

		this.imgSocket = new DatagramSocket();
		this.imgSocket.connect(new InetSocketAddress("127.0.0.1", port));
		String message = "port," + this.imgSocket.getLocalPort();
		this.imgSocket.send(new DatagramPacket(message.getBytes(), message.getBytes().length));
		this.buffer = new byte[bufferSize];
		this.mouseColliderHandler = new MouseColliderHandler(this);
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

			if (background == null) {
				background = image;
				g2d = image.createGraphics();
				window.JBC.setBackground(background);
			} else {
				int width = image.getWidth(), heigth = image.getHeight();
				g2d.drawImage(image, 0, 0, width, heigth, 0, 0, width, heigth, null);
			}
			window.JBC.setBackground(background);

		} else {
			messageRecieved(this.buffer);
		}

		sendMessageBuffer();
	}

	private String messageBuffer = "";

	private void sendMessageBuffer() {
		if (messageBuffer.length() > 0) {
			try {
				DatagramPacket pack = new DatagramPacket(messageBuffer.getBytes(), messageBuffer.getBytes().length - 1);
				this.imgSocket.send(pack);
				messageBuffer = "";
			} catch (IOException | IllegalArgumentException e) {
				System.out.println("messageBuffer that caused error " + messageBuffer);
				e.printStackTrace();
			}
		}
	}

	public void write(String message) {
		messageBuffer = messageBuffer + message + "%";
	}

	public void messageRecieved(byte[] buffer) {
		int i = 0;
		for (byte b : buffer) {
			if (b == (byte) 0x3b)
				break;
			i++;
		}

		String[] split = new String(buffer, 1, i - 1).split(",");
		switch (split[0]) {
		case "mouseCollider":
			this.mouseColliderHandler.action(split);
			break;
		case "show":
			this.window.frame.setVisible(true);
			break;
		case "icon":
			try {
				this.window.frame.setIconImage(ImageIO.read(new File(split[1])));
			} catch (IOException e) {
				e.printStackTrace();
			}
			break;

		}
	}

}
