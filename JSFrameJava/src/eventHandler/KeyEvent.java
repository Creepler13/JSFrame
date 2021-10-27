package eventHandler;

import java.awt.event.KeyListener;

import base.Client;

public class KeyEvent implements KeyListener {

	private Client server = null;

	public KeyEvent(Client server) {
		this.server = server;
	}

	@Override
	public void keyPressed(java.awt.event.KeyEvent e) {
		this.server.makeEventCall("frame", "keyPressed", "keyCode", e.getKeyCode(), "key", e.getKeyChar());
	}

	@Override
	public void keyReleased(java.awt.event.KeyEvent e) {
		this.server.makeEventCall("frame", "keyReleased", "keyCode", e.getKeyCode(), "key", e.getKeyChar());
	}

	@Override
	public void keyTyped(java.awt.event.KeyEvent e) {
	}

}
