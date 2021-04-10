
import java.awt.event.KeyListener;

public class KeyEvent implements KeyListener {

	private Client server = null;

	KeyEvent(Client server) {
		this.server = server;
	}

	@Override
	public void keyPressed(java.awt.event.KeyEvent e) {
		this.server.write("keyPressed," + e.getKeyCode() + "," + e.getKeyChar());
	}

	@Override
	public void keyReleased(java.awt.event.KeyEvent e) {
		this.server.write("keyReleased," + e.getKeyCode() + "," + e.getKeyChar());
	}

	@Override
	public void keyTyped(java.awt.event.KeyEvent e) {
	}

}
