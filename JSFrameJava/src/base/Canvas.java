package base;

import java.awt.Graphics2D;
import java.awt.image.BufferedImage;

import eventHandler.KeyEvent;
import eventHandler.MouseEvent;
import eventHandler.MouseMotionEvent;

public class Canvas {

	public int x, y, width, heigth;
	public JBackgroundPanel JBC;
	public BufferedImage image;
	public Graphics2D g2d;

	public Canvas(int x, int y, int width, int heigth) {
		this.x = x;
		this.y = y;
		this.width = width;
		this.heigth = heigth;
		this.JBC = new JBackgroundPanel();
		this.JBC.setBounds(x, y, width, heigth);
		this.image = new BufferedImage(width, heigth, BufferedImage.TYPE_INT_ARGB);
		this.g2d = this.image.createGraphics();

		this.JBC.setFocusable(true);
		this.JBC.addKeyListener(new KeyEvent());
		this.JBC.addMouseListener(new MouseEvent());
		this.JBC.addMouseMotionListener(new MouseMotionEvent());

		Window.frame.add(this.JBC);

	}

	public void update(BufferedImage i) {
		this.g2d.drawImage(i, 0, 0, this.width, this.heigth, 0, 0, image.getWidth(), image.getHeight(), null);
	}

}
