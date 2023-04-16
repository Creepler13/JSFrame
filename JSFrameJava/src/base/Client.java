package base;

import java.awt.Graphics2D;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.RandomAccessFile;
import java.net.DatagramSocket;

import javax.imageio.ImageIO;

import eventHandler.MainEventHandler;

public class Client {

	public DatagramSocket imgSocket;

	public RandomAccessFile imgIPCFile;

	public byte[] buffer;
	public int width, heigth;

	public Window window;

	public BufferedImage background;
	public Graphics2D g2d;

	public int lastX, lastY;

	public MsgClient msgClient;
	public MainEventHandler eventHandler = new MainEventHandler(this);

	public Client(int msgSocketPort, int bufferSize, int x, int y, int width, int height, Boolean hideOnReady)
			throws IOException {
		msgClient = new MsgClient(this, msgSocketPort);
		eventHandler.activateEvent("port");

		lastX = x;
		lastY = y;

		this.window = new Window(x, y, width, height, this, hideOnReady);
	}

	public Client instance = this;
	
	public boolean pipeConnected = false;

	public void ConnectPipe(String pipe) {
		try {
			this.imgIPCFile = new RandomAccessFile(pipe, "rw");
		
			new Thread(new Runnable() {
				@Override
				public void run() {
					while (true) {
					try {
						instance.update();
					} catch (IOException e1) {
						e1.printStackTrace();
					}
						try {
							Thread.sleep(20);
						} catch (InterruptedException e) {
							e.printStackTrace();
						}
					}
				}
			}).start();

		
		} catch (FileNotFoundException e) {
			e.printStackTrace();
		}
	}

	public void update() throws IOException {
		// this.imgSocket.receive(new DatagramPacket(this.buffer, this.buffer.length));
		System.out.println("Update Was Called");
		System.out.println(this.imgIPCFile.getChannel());
		System.out.println(this.imgIPCFile.readLine());

		System.out.println("recieved Buffer");

		BufferedImage image = null;
		ByteArrayInputStream bis = new ByteArrayInputStream(this.buffer, 1, this.buffer.length);
		try {
			image = ImageIO.read(bis);
		} catch (javax.imageio.IIOException e) {
			this.buffer = new byte[this.buffer.length * 2];
			eventHandler.makeEventCall("frame", "bufferfix", this.buffer.length);
			eventHandler.makeEventCall("frame", "up");
			return;
		}
		bis.close();

		if (window.frame.getX() != lastX || window.frame.getY() != lastY) {
			lastX = window.frame.getX();
			lastY = window.frame.getY();

			System.out.println(lastX + " " + lastX);

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

			g2d.drawImage(background, 0, 0, background.getWidth(), background.getHeight(), 0, 0, background.getWidth(),
					background.getHeight(), null);
			g2d.drawImage(image, 0, 0, image.getWidth(), image.getHeight(), 0, 0, image.getWidth(), image.getHeight(),
					null);

			background = tempBackGround;
		} else {
			int width = image.getWidth(), heigth = image.getHeight();
			g2d.drawImage(image, 0, 0, width, heigth, 0, 0, width, heigth, null);
		}
		window.JBC.setBackground(background);
		eventHandler.makeEventCall("frame", "up");

	}

}
