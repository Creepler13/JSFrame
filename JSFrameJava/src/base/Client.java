package base;

import java.awt.Graphics2D;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.net.DatagramPacket;
import java.net.DatagramSocket;
import java.net.InetSocketAddress;
import java.net.Socket;

import javax.imageio.ImageIO;

import eventHandler.MainEventHandler;

public class Client {

	public DatagramSocket imgSocket;
	public Socket msgSocket;

	public byte[] buffer;
	public int width, heigth;

	public Window window;

	public BufferedImage background;
	public Graphics2D g2d;

	public int lastX, lastY;

	public MainEventHandler eventHandler = new MainEventHandler(this);

	public Client(int port, int bufferSize, int x, int y, int width, int height, Boolean hideOnReady)
			throws IOException {

		eventHandler.activateEvent("port");

		lastX = x;
		lastY = y;

		this.window = new Window(x, y, width, height, this, hideOnReady);

		this.imgSocket = new DatagramSocket();
		this.imgSocket.connect(new InetSocketAddress("127.0.0.1", port));
		eventHandler.makeEventCall("frame", "port", "port", this.imgSocket.getLocalPort());
		sendMessageBuffer();
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
				eventHandler.makeEventCall("frame", "bufferfix", this.buffer.length);
				return;
			}
			bis.close();

			if (window.frame.getX() != lastX || window.frame.getY() != lastY) {
				lastX = window.frame.getX();
				lastY = window.frame.getY();
				
				System.out.println(lastX+ " "+ lastX);
				
				eventHandler.makeEventCall("frame", "positionChanged", "x", lastX, "y", lastY);
			}

			if (background == null) {
				background = image;
				g2d = image.createGraphics();
				window.JBC.setBackground(background);
			} else if (background.getWidth() != image.getWidth() || background.getHeight() != image.getHeight()) {
				BufferedImage tempBackGround = new BufferedImage(image.getWidth(), image.getHeight(),
						BufferedImage.TYPE_INT_ARGB);
				g2d = tempBackGround.createGraphics();

				g2d.drawImage(background, 0, 0, background.getWidth(), background.getHeight(), 0, 0,
						background.getWidth(), background.getHeight(), null);
				g2d.drawImage(image, 0, 0, image.getWidth(), image.getHeight(), 0, 0, image.getWidth(),
						image.getHeight(), null);

				background = tempBackGround;
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
				// TODO FIX THIS SHIT System.out.println("messageBuffer that caused error " +
				// messageBuffer);
				// e.printStackTrace();
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

		eventHandler.handle(split[0], split);

	}

}
