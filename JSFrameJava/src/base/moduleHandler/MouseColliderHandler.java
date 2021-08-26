package base.moduleHandler;

import java.awt.event.MouseListener;
import java.awt.event.MouseMotionListener;

import base.Window;
import eventHandler.MouseColliderEvent;
import eventHandler.MouseColliderMotionEvent;

public class MouseColliderHandler {

	public static void action(String[] split) {
		int id = Integer.parseInt(split[2]);
		switch (split[1]) {
		case "add":
			MouseColliderEvent MCE = new MouseColliderEvent(id, Integer.parseInt(split[3]), Integer.parseInt(split[4]),
					Integer.parseInt(split[5]), Integer.parseInt(split[6]));
			Window.JBC.addMouseListener(MCE);
			Window.JBC.addMouseMotionListener(new MouseColliderMotionEvent(MCE));
			break;
		case "remove":
			for (MouseMotionListener e : Window.JBC.getMouseMotionListeners()) {
				if (e.getClass() == MouseColliderMotionEvent.class)
					if (((MouseColliderMotionEvent) e).getId() == id) {
						Window.JBC.removeMouseListener(((MouseColliderMotionEvent) e).MCE);
						Window.JBC.removeMouseMotionListener(e);
					}
			}
			break;
		case "setState":
			for (MouseListener e : Window.JBC.getMouseListeners()) {
				if (e.getClass() == MouseColliderEvent.class)
					if (((MouseColliderEvent) e).getId() == id)
						((MouseColliderEvent) e).setState(split[3]);
			}

		case "size":
			for (MouseListener e : Window.JBC.getMouseListeners()) {
				if (e.getClass() == MouseColliderEvent.class)
					if (((MouseColliderEvent) e).getId() == id)
						((MouseColliderEvent) e).setSize(Integer.parseInt(split[3]), Integer.parseInt(split[4]));
			}
			break;
		case "position":
			for (MouseListener e : Window.JBC.getMouseListeners()) {
				if (e.getClass() == MouseColliderEvent.class)
					if (((MouseColliderEvent) e).getId() == id)
						((MouseColliderEvent) e).setPosition(Integer.parseInt(split[3]), Integer.parseInt(split[4]));
			}
			break;
		}
	}

}
