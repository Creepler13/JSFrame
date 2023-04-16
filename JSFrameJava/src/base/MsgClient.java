package base;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.net.InetSocketAddress;
import java.net.Socket;

public class MsgClient {

	private Client c;

	public MsgClient(Client c, int port) {
		this.c = c;
		try {
			msgSocket = new Socket();
			msgSocket.connect(new InetSocketAddress("127.0.0.1", port));
			inputReader = new BufferedReader(new InputStreamReader(msgSocket.getInputStream()));
			outputWriter = new BufferedWriter(new OutputStreamWriter(msgSocket.getOutputStream()));
		} catch (IOException e) {
			e.printStackTrace();
		}
	}

	public Socket msgSocket;

	public BufferedReader inputReader;
	public BufferedWriter outputWriter;

	private String messageBuffer = "";

	public void sendMessageBuffer() {

		if (messageBuffer.length() > 0) {
			try {
				// DatagramPacket pack = new DatagramPacket(messageBuffer.getBytes(),
				// messageBuffer.getBytes().length - 1);
				outputWriter.write(messageBuffer);
				outputWriter.flush();
				messageBuffer = "";
			} catch (IOException | IllegalArgumentException e) {
				// TODO FIX THIS SHIT System.out.println("messageBuffer that caused error " +
				// messageBuffer);
				// e.printStackTrace();
			}
		}
	}

	public void write(String message) {
		messageBuffer = messageBuffer + message + "%";
	}

	public void messageRecieved(byte[] buffer) {
		int i = 0;
		for (byte b : buffer) {
			if (b == (byte) 0x3b)
				break;
			i++;
		}
		String[] split = new String(buffer, 1, i - 1).split(",");

		c.eventHandler.handle(split[0], split);
	}

	public void readMessageBuffer() {

		try {
			if (!inputReader.ready())
				return;
			String s = inputReader.readLine();

			String[] split = s.trim().split(",");
			c.eventHandler.handle(split[0], split);

		} catch (IOException e) {
			e.printStackTrace();
		}
	}

}
