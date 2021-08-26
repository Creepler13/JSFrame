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

import base.moduleHandler.MouseColliderHandler;
import base.moduleHandler.TextAreaHandler;

public class Client {

	public static DatagramSocket imgSocket;
	public static Socket msgSocket;

	public static byte[] buffer;
	public static int width, heigth;

	public static BufferedImage background;
	public static Graphics2D g2d;

	public static void init(int port, int bufferSize, int x, int y, int width, int height, Boolean hideOnReady)
			throws IOException {
		Window.createWindow(x, y, width, height, hideOnReady);

		imgSocket = new DatagramSocket();
		imgSocket.connect(new InetSocketAddress("127.0.0.1", port));
		String message = "port," + imgSocket.getLocalPort();
		imgSocket.send(new DatagramPacket(message.getBytes(), message.getBytes().length));
		buffer = new byte[bufferSize];
	}

	public static void update() throws IOException {
		Client.imgSocket.receive(new DatagramPacket(Client.buffer, Client.buffer.length));
		if (Client.buffer[0] == 0) {
			BufferedImage image = null;
			ByteArrayInputStream bis = new ByteArrayInputStream(Client.buffer, 1, Client.buffer.length);
			try {
				image = ImageIO.read(bis);
			} catch (javax.imageio.IIOException e) {
				Client.buffer = new byte[Client.buffer.length * 2];
				write("bufferfix," + Client.buffer.length);
				return;
			}
			bis.close();

			if (background == null) {
				background = image;
				g2d = image.createGraphics();
				Window.JBC.setBackground(background);
			} else {
				int width = image.getWidth(), heigth = image.getHeight();
				g2d.drawImage(image, 0, 0, width, heigth, 0, 0, width, heigth, null);
			}
			Window.JBC.setBackground(background);

		} else {
			messageRecieved(Client.buffer);
		}

		sendMessageBuffer();
	}

	private static String messageBuffer = "";

	private static void sendMessageBuffer() {
		if (messageBuffer.length() > 0) {
			try {
				DatagramPacket pack = new DatagramPacket(messageBuffer.getBytes(), messageBuffer.getBytes().length - 1);
				Client.imgSocket.send(pack);
				messageBuffer = "";
			} catch (IOException | IllegalArgumentException e) {
				System.out.println("messageBuffer that caused error " + messageBuffer);
				e.printStackTrace();
			}
		}
	}

	public static void write(String message) {
		messageBuffer = messageBuffer + message + "%";
	}

	public static void messageRecieved(byte[] buffer) {
		int i = 0;
		for (byte b : buffer) {
			if (b == (byte) 0x3b)
				break;
			i++;
		}

		String[] split = new String(buffer, 1, i - 1).split(",");
		switch (split[0]) {
		case "mouseCollider":
			MouseColliderHandler.action(split);
			break;
		case "textArea":
			TextAreaHandler.action(split);
			break;
		case "show":
			Window.frame.setVisible(true);
			break;
		case "icon":
			try {
				Window.frame.setIconImage(ImageIO.read(new File(split[1])));
			} catch (IOException e) {
				e.printStackTrace();
			}
			break;
		case "position":
			Window.frame.setBounds(Integer.parseInt(split[1]), Integer.parseInt(split[2]), Window.frame.getWidth(),
					Window.frame.getHeight());
			Window.JBC.setBounds(Integer.parseInt(split[1]), Integer.parseInt(split[2]), Window.frame.getWidth(),
					Window.frame.getHeight());
			break;
		case "size":
			Window.frame.setBounds(Window.frame.getX(), Window.frame.getY(), Integer.parseInt(split[1]) + 16,
					Integer.parseInt(split[2]) + 39);
			Window.JBC.setBounds(Window.frame.getX(), Window.frame.getY(), Integer.parseInt(split[1]) + 16,
					Integer.parseInt(split[2]) + 39);
			Client.background = null;
			break;
		}
	}

}
