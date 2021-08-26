package eventHandler;

import java.awt.event.MouseListener;

import base.Client;

public class MouseEvent implements MouseListener {

	@Override
	public void mouseClicked(java.awt.event.MouseEvent e) {
	}

	@Override
	public void mouseEntered(java.awt.event.MouseEvent e) {
		Client.write("frame,mouseEntered," + e.getX() + "," + e.getY());
	}

	@Override
	public void mouseExited(java.awt.event.MouseEvent e) {
		Client.write("frame,mouseExited," + e.getX() + "," + e.getY());
	}

	@Override
	public void mousePressed(java.awt.event.MouseEvent e) {
		Client.write("frame,mousePressed," + e.getX() + "," + e.getY() + "," + e.getButton());
	}

	@Override
	public void mouseReleased(java.awt.event.MouseEvent e) {
		Client.write("frame,mouseReleased," + e.getX() + "," + e.getY() + "," + e.getButton());
	}

}