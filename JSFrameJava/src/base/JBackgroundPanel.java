package base;


import java.awt.EventQueue;
import java.awt.Graphics;
import java.awt.Image;

import javax.swing.JPanel;

/**
 * 
 * @author JustAnotherJavaProgrammer
 *
 */

class JBackgroundPanel extends JPanel {

	private static final long serialVersionUID = 1L;
	private Image background = null;
	public static final int FULL_IMAGE = 0;
	public static final int FILL_PANEL = 1;
	public static final int DISTORT_IMAGE = 2;
	private int backgroundType = FULL_IMAGE;

	public void paintComponent(Graphics g) {
		super.paintComponent(g);
		if (background != null) {
			drawImage(background, g);
		}
	}

	public void keyPressed(int keyCode) {
	}

	public void keyReleased(int keyCode) {
	}

	private void drawImage(Image image, Graphics g) {
		double scale;
		switch (backgroundType) {
		case 0:
			scale = (double) (this.getHeight()) / (double) (image.getHeight(null));
			if (image.getWidth(null) * scale > getWidth()) {
				scale = (double) (this.getWidth()) / (double) (image.getWidth(null));
			}

			g.drawImage(image, (int) ((getWidth() - (image.getWidth(null) * scale)) / 2),
					(int) ((getHeight() - (image.getHeight(null) * scale)) / 2), (int) (image.getWidth(null) * scale),
					(int) (image.getHeight(null) * scale), getBackground(), null);
			break;
		case 1:
			scale = (double) (this.getHeight()) / (double) (image.getHeight(null));
			if (image.getWidth(null) * scale < getWidth()) {
				scale = (double) (this.getWidth()) / (double) (image.getWidth(null));
			}
			g.drawImage(image, (int) ((getWidth() - (image.getWidth(null) * scale)) / 2),
					(int) ((getHeight() - (image.getHeight(null) * scale)) / 2), (int) (image.getWidth(null) * scale),
					(int) (image.getHeight(null) * scale), getBackground(), null);
			break;
		default:
			g.drawImage(image, 0, 0, getWidth(), getHeight(), getBackground(), null);
			break;
		}
	}

	public void setBackground(Image backgroundImage) {
		background = backgroundImage;
		EventQueue.invokeLater(new Runnable() {

			public void run() {
				repaint();
			}
		});
	}

	public Image getBackgroundImage() {
		return background;
	}

	public void setBackgroundType(int backgroundType) {
		if (this.backgroundType != backgroundType) {
			this.backgroundType = backgroundType;
			repaint();
		}
	}

}