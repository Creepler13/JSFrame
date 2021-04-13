package base;

import java.awt.event.MouseListener;
import java.awt.event.MouseMotionListener;

import eventHandler.MouseColliderEvent;
import eventHandler.MouseColliderMotionEvent;

public class MouseColliderHandler {

	public Client client;

	public MouseColliderHandler(Client client) {
		this.client = client;
	}

	public void action(String[] split) {
		switch (split[1]) {
		case "add":
			int id = Integer.parseInt(split[2]);
			MouseColliderEvent MCE = new MouseColliderEvent(this, id, Integer.parseInt(split[3]),
					Integer.parseInt(split[4]), Integer.parseInt(split[5]), Integer.parseInt(split[6]));
			this.client.window.JBC.addMouseListener(MCE);
			this.client.window.JBC.addMouseMotionListener(new MouseColliderMotionEvent(MCE));
			break;

		case "remove":
			int rmid = Integer.parseInt(split[2]);

			for (MouseListener e : this.client.window.JBC.getMouseListeners()) {
				if (e.getClass() == MouseColliderEvent.class)
					if (((MouseColliderEvent) e).getId() == rmid)
						this.client.window.JBC.removeMouseListener(e);
			}
			for (MouseMotionListener e : this.client.window.JBC.getMouseMotionListeners()) {
				if (e.getClass() == MouseColliderMotionEvent.class)
					if (((MouseColliderMotionEvent) e).getId() == rmid)
						this.client.window.JBC.removeMouseMotionListener(e);
			}

			break;
		}
	}

}
