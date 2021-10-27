package eventHandler;

import java.awt.event.MouseEvent;
import java.awt.event.MouseMotionListener;

public class MouseColliderMotionEvent implements MouseMotionListener {

	public MouseColliderEvent MCE;
	public Boolean isIn = false;

	public MouseColliderMotionEvent(MouseColliderEvent MCE) {
		this.MCE = MCE;
	}

	@Override
	public void mouseDragged(MouseEvent e) {
		this.MCE.MCH.client.makeEventCall("mouseCollider", "mouseDragged", "id", this.MCE.id, "x", e.getX(), "y",
				e.getY(), "button", e.getButton());
	}

	public boolean getState() {
		return this.MCE.getState();
	}

	public int getId() {
		return this.MCE.id;
	}

	@Override
	public void mouseMoved(MouseEvent e) {
		this.MCE.MCH.client.makeEventCall("mouseCollider", "mouseMoved", "id", this.MCE.id, "x", e.getX(), "y",
				e.getY(), "button", e.getButton());

		if (getState())
			if (e.getX() >= this.MCE.x && e.getX() < this.MCE.x + this.MCE.width && e.getY() >= this.MCE.y
					&& e.getY() < this.MCE.y + this.MCE.height) {
				if (!this.isIn) {
					this.isIn = true;
					this.MCE.MCH.client.makeEventCall("mouseCollider", "mouseEntered", "id", this.MCE.id, "x", e.getX(),
							"y", e.getY(), "button", e.getButton());
				}
			} else {
				if (this.isIn) {
					this.isIn = false;
					this.MCE.MCH.client.makeEventCall("mouseCollider", "mouseExited", "id", this.MCE.id, "x", e.getX(),
							"y", e.getY(), "button", e.getButton());
				}
			}

	}

}
