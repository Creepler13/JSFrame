package base.moduleHandler;

import java.util.HashMap;

import javax.swing.JTextArea;

import base.Client;
import base.Window;

public class TextAreaHandler {

	public static HashMap<Integer, JTextArea> areas = new HashMap<>();

	public static void action(String[] split) {
		int id = Integer.parseInt(split[2]);
		switch (split[1]) {

		case "add":
			JTextArea textA = new JTextArea();
			textA.setBounds(Integer.parseInt(split[3]), Integer.parseInt(split[4]), Integer.parseInt(split[5]),
					Integer.parseInt(split[6]));
			Window.JBC.add(textA);
			areas.put(id, textA);
			break;
		case "getData":
			Client.write("textArea,getData,"+id+","+areas.get(id).getText().replaceAll("%", "ßßß"));
			System.out.println(areas.get(id).getText().replaceAll("%", "ßßß"));
			break;
		default:
			break;
		}

	}
}
