package eventHandler;

import java.awt.event.MouseEvent;
import java.awt.event.MouseListener;

import base.Client;

public class MouseColliderEvent implements MouseListener {

	public int id, x, y, width, height;
	public boolean state = true;

	public MouseColliderEvent(int id, int x, int y, int width, int height) {
		this.id = id;
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
	}

	@Override
	public void mouseClicked(MouseEvent e) {
		// TODO Auto-generated method stub

	}

	public void setState(String state) {
		this.state = Boolean.parseBoolean(state);
	}

	public Boolean getState() {
		return this.state;
	}

	public int getId() {
		return this.id;
	}

	@Override
	public void mousePressed(java.awt.event.MouseEvent e) {
		if (getState())
			if (e.getX() >= this.x && e.getX() < this.x + this.width && e.getY() >= this.y
					&& e.getY() < this.y + this.height)
				Client.write(
						"mouseCollider,mousePressed," + id + "," + e.getX() + "," + e.getY() + "," + e.getButton());
	}

	@Override
	public void mouseReleased(java.awt.event.MouseEvent e) {
		if (getState())
			if (e.getX() >= this.x && e.getX() < this.x + this.width && e.getY() >= this.y
					&& e.getY() < this.y + this.height)
				Client.write(
						"mouseCollider,mouseReleased," + id + "," + e.getX() + "," + e.getY() + "," + e.getButton());
	}

	@Override
	public void mouseEntered(MouseEvent e) {
		// TODO Auto-generated method stub

	}

	@Override
	public void mouseExited(MouseEvent e) {
		// TODO Auto-generated method stub

	}

	public void setSize(int width, int heigth) {
		this.width = width;
		this.height = heigth;

	}

	public void setPosition(int x, int y) {
		// TODO Auto-generated method stub
		this.x = x;
		this.y = y;
	}

}
