package eventHandler;

import java.awt.event.KeyListener;

import base.Client;

public class KeyEvent implements KeyListener {

	@Override
	public void keyPressed(java.awt.event.KeyEvent e) {
		Client.write("frame,keyPressed," + e.getKeyCode() + "," + e.getKeyChar());
	}

	@Override
	public void keyReleased(java.awt.event.KeyEvent e) {
		Client.write("frame,keyReleased," + e.getKeyCode() + "," + e.getKeyChar());
	}

	@Override
	public void keyTyped(java.awt.event.KeyEvent e) {
	}

}
