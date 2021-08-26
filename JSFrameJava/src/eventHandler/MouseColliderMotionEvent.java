package eventHandler;

import java.awt.event.MouseEvent;
import java.awt.event.MouseMotionListener;

import base.Client;

public class MouseColliderMotionEvent implements MouseMotionListener {

	public MouseColliderEvent MCE;
	public Boolean isIn = false;

	public MouseColliderMotionEvent(MouseColliderEvent MCE) {
		this.MCE = MCE;
	}

	@Override
	public void mouseDragged(MouseEvent e) {
		Client.write(
				"mouseCollider,mouseDragged," + this.MCE.id + "," + e.getX() + "," + e.getY() + "," + e.getButton());
	}

	public boolean getState() {
		return this.MCE.getState();
	}

	public int getId() {
		return this.MCE.id;
	}

	@Override
	public void mouseMoved(MouseEvent e) {
		Client.write("mouseCollider,mouseMoved," + this.MCE.id + "," + e.getX() + "," + e.getY() + "," + e.getButton());

		if (getState())
			if (e.getX() >= this.MCE.x && e.getX() < this.MCE.x + this.MCE.width && e.getY() >= this.MCE.y
					&& e.getY() < this.MCE.y + this.MCE.height) {
				if (!this.isIn) {
					this.isIn = true;
					Client.write("mouseCollider,mouseEntered," + this.MCE.id + "," + e.getX() + "," + e.getY() + ","
							+ e.getButton());
				}
			} else {
				if (this.isIn) {
					this.isIn = false;
					Client.write("mouseCollider,mouseExited," + this.MCE.id + "," + e.getX() + "," + e.getY() + ","
							+ e.getButton());
				}
			}

	}

}
