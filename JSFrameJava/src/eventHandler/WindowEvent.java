package eventHandler;

import java.awt.event.WindowListener;

import base.Client;

public class WindowEvent implements WindowListener {

	private Client server = null;

	public WindowEvent(Client server) {
		this.server = server;
	}

	@Override
	public void windowActivated(java.awt.event.WindowEvent e) {
	}

	@Override
	public void windowClosed(java.awt.event.WindowEvent e) {
	
	}

	@Override
	public void windowClosing(java.awt.event.WindowEvent e) {
		this.server.makeEventCall("frame", "closed");
	}

	@Override
	public void windowDeactivated(java.awt.event.WindowEvent e) {
	}

	@Override
	public void windowDeiconified(java.awt.event.WindowEvent e) {
		this.server.makeEventCall("frame", "normalized");
	}

	@Override
	public void windowIconified(java.awt.event.WindowEvent e) {
		this.server.makeEventCall("frame", "minimized");
	}

	@Override
	public void windowOpened(java.awt.event.WindowEvent e) {
		// TODO Auto-generated method stub

	}

}
