package base;

import javax.swing.JFrame;

import eventHandler.KeyEvent;
import eventHandler.MouseEvent;
import eventHandler.MouseMotionEvent;
import eventHandler.WindowEvent;

public class Window {

	public static JFrame frame = null;
	public static JBackgroundPanel JBC = null;

	public static void createWindow(int x, int y, int width, int height, Boolean hideOnReady) {
		frame = new JFrame();
		frame.setBounds(0, 0, width + 16, height + 39);
		frame.setResizable(false);
		frame.addWindowListener(new WindowEvent());
		frame.setLayout(null);
		JBC = new JBackgroundPanel();
		JBC.setFocusable(true);
		JBC.requestFocusInWindow();
		JBC.addKeyListener(new KeyEvent());
		JBC.addMouseListener(new MouseEvent());
		JBC.addMouseMotionListener(new MouseMotionEvent());
		JBC.setBounds(x, y, width, height);
		frame.add(JBC);
		if (!hideOnReady)
			frame.setVisible(true);
	}

}
