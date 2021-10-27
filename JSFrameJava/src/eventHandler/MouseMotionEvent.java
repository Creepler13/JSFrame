package eventHandler;

import java.awt.event.MouseEvent;
import java.awt.event.MouseMotionListener;

import javax.swing.SwingUtilities;

import base.Client;

public class MouseMotionEvent implements MouseMotionListener {

	private Client server;

	public MouseMotionEvent(Client server) {
		this.server = server;
	}

	@Override
	public void mouseDragged(MouseEvent e) {
		this.server.makeEventCall("frame", "mouseDragged", "x", e.getX(), "y", e.getY(), "button",
				(SwingUtilities.isLeftMouseButton(e) ? 1
						: SwingUtilities.isRightMouseButton(e) ? 3 : SwingUtilities.isMiddleMouseButton(e) ? 2 : 0));

	}

	@Override
	public void mouseMoved(MouseEvent e) {
		this.server.makeEventCall("frame", "mouseMoved", "x", e.getX(), "y", e.getY(), "button",
				(SwingUtilities.isLeftMouseButton(e) ? 1
						: SwingUtilities.isRightMouseButton(e) ? 3 : SwingUtilities.isMiddleMouseButton(e) ? 2 : 0));

	}

}
