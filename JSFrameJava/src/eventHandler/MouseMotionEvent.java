package eventHandler;

import java.awt.event.MouseEvent;
import java.awt.event.MouseMotionListener;

import javax.swing.SwingUtilities;

import base.Client;

public class MouseMotionEvent implements MouseMotionListener {

	@Override
	public void mouseDragged(MouseEvent e) {
		Client.write("frame,mouseDragged," + e.getX() + "," + e.getY() + "," + (SwingUtilities.isLeftMouseButton(e) ? 1
				: SwingUtilities.isRightMouseButton(e) ? 3 : SwingUtilities.isMiddleMouseButton(e) ? 2 : 0));

	}

	@Override
	public void mouseMoved(MouseEvent e) {
		Client.write("frame,mouseMoved," + e.getX() + "," + e.getY() + "," + (SwingUtilities.isLeftMouseButton(e) ? 1
				: SwingUtilities.isRightMouseButton(e) ? 3 : SwingUtilities.isMiddleMouseButton(e) ? 2 : 0));

	}

}
