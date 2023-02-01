package com.soprasteria.gisdemo;

import org.eclipse.jetty.server.Server;

public class GisServer {
    private final Server server = new Server(8080);

    private void start() throws Exception {
        server.start();
    }

    public static void main(String[] args) throws Exception {
        new GisServer().start();
    }
}
