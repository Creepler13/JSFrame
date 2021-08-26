package eventHandler;

import java.awt.event.WindowListener;

import base.Client;

public class WindowEvent implements WindowListener {

	@Override
	public void windowActivated(java.awt.event.WindowEvent e) {
	}

	@Override
	public void windowClosed(java.awt.event.WindowEvent e) {
		Client.write("frame,closed");
	}

	@Override
	public void windowClosing(java.awt.event.WindowEvent e) {
		Client.write("frame,closed");
	}

	@Override
	public void windowDeactivated(java.awt.event.WindowEvent e) {
	}

	@Override
	public void windowDeiconified(java.awt.event.WindowEvent e) {
		Client.write("frame,normalized");
	}

	@Override
	public void windowIconified(java.awt.event.WindowEvent e) {
		Client.write("frame,minimized");
	}

	@Override
	public void windowOpened(java.awt.event.WindowEvent e) {
		// TODO Auto-generated method stub

	}

}
