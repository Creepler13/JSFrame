package eventHandler;

import java.awt.event.WindowEvent;
import java.io.File;
import java.io.IOException;
import java.util.ArrayList;

import javax.imageio.ImageIO;

import base.Client;
import base.MouseColliderHandler;

public class MainEventHandler {

	public Client c;

	public MouseColliderHandler mouseColliderHandler;

	public MainEventHandler(Client c) {
		this.c = c;
		this.mouseColliderHandler = new MouseColliderHandler(c);
	}

	private ArrayList<String> activatedEvents = new ArrayList<>();

	public void activateEvent(String event) {
		activatedEvents.add(event);
	}

	public void makeEventCall(String type, String name, Object... values) {
		if (!activatedEvents.contains(name))
			return;

		String event = "{\"config\":{\"type\":\"" + type + "\",\"name\":\"" + name + "\"}";

		if (values.length > 0) {
			event = event + ",\"data\":{";
			for (int i = 0; i < values.length; i = i + 2) {
				String key = (String) values[i];
				String value = values[i + 1] + "";
				if (value instanceof String)
					event = event + "\"" + key + "\":\"" + value + "\",";
				else
					event = event + "\"" + key + "\":" + value + ",";

			}

			event = event.substring(0, event.length() - 1);
			event = event + "}";

		}
		event = event + "}";

		c.write(event);
	}

	public void handle(String event, String fulldata[]) {
		switch (event) {

		case "close":
			c.window.frame.dispatchEvent(new WindowEvent(c.window.frame, WindowEvent.WINDOW_CLOSING));
			break;
		case "mouseCollider":
			mouseColliderHandler.action(fulldata);
			break;
		case "activateEvent":
			activateEvent(fulldata[1]);
			break;
		case "show":
			c.window.frame.setVisible(true);
			break;
		case "icon":
			try {
				c.window.frame.setIconImage(ImageIO.read(new File(fulldata[1])));
			} catch (IOException e) {
				e.printStackTrace();
			}
			break;
		case "position":
			c.window.frame.setBounds(Integer.parseInt(fulldata[1]), Integer.parseInt(fulldata[2]),
					c.window.frame.getWidth(), c.window.frame.getHeight());
			c.window.JBC.setBounds(Integer.parseInt(fulldata[1]), Integer.parseInt(fulldata[2]),
					c.window.frame.getWidth(), c.window.frame.getHeight());
			break;
		case "size":
			c.window.frame.setBounds(c.window.frame.getX(), c.window.frame.getY(), Integer.parseInt(fulldata[1]) + 16,
					Integer.parseInt(fulldata[2]) + 39);
			c.window.JBC.setBounds(c.window.frame.getX(), c.window.frame.getY(), Integer.parseInt(fulldata[1]) + 16,
					Integer.parseInt(fulldata[2]) + 39);
			c.background = null;
			break;
		}
	}

}
