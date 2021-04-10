
import java.awt.Image;
import java.io.IOException;

import javax.swing.JFrame;

public class Main {

	public static JFrame frame = null;
	public static Client client = null;
	public static JBackgroundPanel JBC = null;

	public static void main(String[] args) {
		frame = new JFrame();
		frame.setBounds(0, 0, Integer.parseInt(args[2]) + 16, Integer.parseInt(args[3]) + 39);
		frame.setResizable(false);
		try {
			client = new Client(Integer.parseInt(args[0]), Integer.parseInt(args[1]), Integer.parseInt(args[2]),
					Integer.parseInt(args[3]));
		} catch (IOException e) {
			e.printStackTrace();
		}
		frame.addWindowListener(new WindowEvent(client));
		JBC = new JBackgroundPanel();
		JBC.setFocusable(true);
		JBC.requestFocusInWindow();
		JBC.addKeyListener(new KeyEvent(client));
		JBC.addMouseListener(new MouseEvent(client));
		JBC.setBounds(0, 0, Integer.parseInt(args[2]), Integer.parseInt(args[3]));
		frame.add(JBC);
		frame.setVisible(true);
		while (true) {
			try {
				Image image = client.getImg();
				if (image != null)
					JBC.setBackground(image);
			} catch (IOException e) {
				e.printStackTrace();
			}
		}
	}

}
