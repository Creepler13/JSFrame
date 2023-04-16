package base;

import java.io.IOException;

public class Main {

	public static void main(String[] args) {
		try {
			Client client = new Client(Integer.parseInt(args[0]), Integer.parseInt(args[1]), Integer.parseInt(args[2]),
					Integer.parseInt(args[3]), Integer.parseInt(args[4]), Integer.parseInt(args[5]),
					Boolean.parseBoolean(args[6]));

			try {
				new Thread(new Runnable() {
					@Override
					public void run() {
						while (true) {
							client.msgClient.sendMessageBuffer();
							client.msgClient.readMessageBuffer();
							try {
								Thread.sleep(20);
							} catch (InterruptedException e) {
								e.printStackTrace();
							}
						}
					}
				}).start();

				
				while(true) {
				if(client.pipeConnected)	
					client.update();
				}
		
				
			} catch (Exception e) {
			}
		} catch (IOException e) {
			e.printStackTrace();
		}

	}

}
