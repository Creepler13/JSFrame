
import java.awt.event.WindowListener;

public class WindowEvent implements WindowListener {

	private Client server = null;

	WindowEvent(Client server) {
		this.server = server;
	}

	@Override
	public void windowActivated(java.awt.event.WindowEvent e) {
	}

	@Override
	public void windowClosed(java.awt.event.WindowEvent e) {
		this.server.write("closed");
	}

	@Override
	public void windowClosing(java.awt.event.WindowEvent e) {
		this.server.write("closed");
	}

	@Override
	public void windowDeactivated(java.awt.event.WindowEvent e) {
		// TODO Auto-generated method stub

	}

	@Override
	public void windowDeiconified(java.awt.event.WindowEvent e) {
		// TODO Auto-generated method stub

	}

	@Override
	public void windowIconified(java.awt.event.WindowEvent e) {
		// TODO Auto-generated method stub

	}

	@Override
	public void windowOpened(java.awt.event.WindowEvent e) {
		// TODO Auto-generated method stub

	}

}
