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
import java.util.ArrayList;

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

	public Client(int port, int bufferSize, int x, int y, int width, int height, Boolean hideOnReady)
			throws IOException {

		activatedEvents.add("port");

		this.window = new Window(x, y, width, height, this, hideOnReady);

		this.imgSocket = new DatagramSocket();
		this.imgSocket.connect(new InetSocketAddress("127.0.0.1", port));
		makeEventCall("frame", "port", "port", this.imgSocket.getLocalPort());
		sendMessageBuffer();
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
				this.makeEventCall("frame", "bufferfix", this.buffer.length);
				return;
			}
			bis.close();

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

	private ArrayList<String> activatedEvents = new ArrayList<>();

	public void makeEventCall(String type, String name, Object... values) {
		if (!activatedEvents.contains(name))
			return;

		String event = "{\"config\":{\"type\":\"" + type + "\",\"name\":\"" + name + "\"}";

		if (values.length > 0) {
			event = event + ",\"data\":{";
			for (int i = 0; i < values.length; i = i + 2) {
				String key = (String) values[i];
				String value = values[i + 1] + "";
				if (value instanceof String)
					event = event + "\"" + key + "\":\"" + value + "\",";
				else
					event = event + "\"" + key + "\":" + value + ",";

			}

			event = event.substring(0, event.length() - 1);
			event = event + "}";

		}
		event = event + "}";

		write(event);
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
		case "activateEvent":
			activatedEvents.add(split[1]);
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
		case "position":
			this.window.frame.setBounds(Integer.parseInt(split[1]), Integer.parseInt(split[2]),
					this.window.frame.getWidth(), this.window.frame.getHeight());
			this.window.JBC.setBounds(Integer.parseInt(split[1]), Integer.parseInt(split[2]),
					this.window.frame.getWidth(), this.window.frame.getHeight());
			break;
		case "size":
			this.window.frame.setBounds(this.window.frame.getX(), this.window.frame.getY(),
					Integer.parseInt(split[1]) + 16, Integer.parseInt(split[2]) + 39);
			this.window.JBC.setBounds(this.window.frame.getX(), this.window.frame.getY(),
					Integer.parseInt(split[1]) + 16, Integer.parseInt(split[2]) + 39);
			this.background = null;
			break;
		}
	}

}
