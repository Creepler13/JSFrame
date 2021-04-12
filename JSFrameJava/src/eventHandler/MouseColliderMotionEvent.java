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
	public void mouseDragged(MouseEvent arg0) {

	}

	public int getId() {
		return this.MCE.id;
	}
	
	@Override
	public void mouseMoved(MouseEvent e) {
		if (e.getX() >= this.MCE.x && e.getX() < this.MCE.x + this.MCE.width && e.getY() >= this.MCE.y
				&& e.getY() < this.MCE.y + this.MCE.height) {
			if (!this.isIn)
				this.isIn = true;
			this.MCE.MCH.client.write("mouseCollider,mouseEntered," + this.MCE.id + "," + e.getX() + "," + e.getY()
					+ "," + e.getButton());
		} else {
			if (this.isIn)
				this.isIn = false;
			this.MCE.MCH.client.write(
					"mouseCollider,mouseExited," + this.MCE.id + "," + e.getX() + "," + e.getY() + "," + e.getButton());
		}

	}

}
