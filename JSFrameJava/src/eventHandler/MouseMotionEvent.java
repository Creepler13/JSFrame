package eventHandler;

import java.awt.event.MouseEvent;
import java.awt.event.MouseMotionListener;

import base.Client;

public class MouseMotionEvent implements MouseMotionListener {

	private Client server;

	public MouseMotionEvent(Client server) {
		this.server = server;
	}

	@Override
	public void mouseDragged(MouseEvent e) {
		this.server.write("frame,mouseDragged," + e.getX() + "," + e.getY() + "," + e.getButton());

	}

	@Override
	public void mouseMoved(MouseEvent e) {
		this.server.write("frame,mouseMoved," + e.getX() + "," + e.getY() + "," + e.getButton());

	}

}
