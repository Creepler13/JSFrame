package eventHandler;

import java.awt.event.MouseListener;

import base.Client;

public class MouseEvent implements MouseListener {

	private Client server = null;

	public MouseEvent(Client server) {
		this.server = server;
	}

	@Override
	public void mouseClicked(java.awt.event.MouseEvent e) {
	}

	@Override
	public void mouseEntered(java.awt.event.MouseEvent e) {
		server.eventHandler.makeEventCall("frame", "mouseEntered", "x", e.getX(), "y", e.getY());
	}

	@Override
	public void mouseExited(java.awt.event.MouseEvent e) {
		server.eventHandler.makeEventCall("frame", "mouseExited", "x", e.getX(), "y", e.getY());
	}

	@Override
	public void mousePressed(java.awt.event.MouseEvent e) {
		server.eventHandler.makeEventCall("frame", "mousePressed", "x", e.getX(), "y", e.getY(), "button",
				e.getButton());
	}

	@Override
	public void mouseReleased(java.awt.event.MouseEvent e) {
		server.eventHandler.makeEventCall("frame", "mouseReleased", "x", e.getX(), "y", e.getY(), "button",
				e.getButton());
	}

}