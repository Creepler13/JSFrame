
import java.awt.event.MouseListener;

public class MouseEvent implements MouseListener {

	private Client server = null;

	MouseEvent(Client server) {
		this.server = server;
	}

	@Override
	public void mouseClicked(java.awt.event.MouseEvent e) {
	}

	@Override
	public void mouseEntered(java.awt.event.MouseEvent e) {
		this.server.write("mouseEntered," + e.getX() + "," + e.getY());
	}

	@Override
	public void mouseExited(java.awt.event.MouseEvent e) {
		this.server.write("mouseExited," + e.getX() + "," + e.getY());
	}

	@Override
	public void mousePressed(java.awt.event.MouseEvent e) {
		this.server.write("mousePressed," + e.getX() + "," + e.getY() + "," + e.getButton());
	}

	@Override
	public void mouseReleased(java.awt.event.MouseEvent e) {
		this.server.write("mouseReleased," + e.getX() + "," + e.getY() + "," + e.getButton());
	}

}