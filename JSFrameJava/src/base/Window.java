package base;

import javax.swing.JFrame;

import eventHandler.KeyEvent;
import eventHandler.MouseEvent;
import eventHandler.WindowEvent;

public class Window {

	public JFrame frame = null;
	public JBackgroundPanel JBC = null;

	public Window(int width, int height, Client client) {
		frame = new JFrame();
		frame.setBounds(0, 0, width + 16, height + 39);
		frame.setResizable(false);
		frame.addWindowListener(new WindowEvent(client));
		JBC = new JBackgroundPanel();
		JBC.setFocusable(true);
		JBC.requestFocusInWindow();
		JBC.addKeyListener(new KeyEvent(client));
		JBC.addMouseListener(new MouseEvent(client));
		JBC.setBounds(0, 0, width, height);
		frame.add(JBC);
		frame.setVisible(true);
	}

}
