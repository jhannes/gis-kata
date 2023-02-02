package com.soprasteria.gisdemo;

import org.eclipse.jetty.server.CustomRequestLog;
import org.eclipse.jetty.server.Server;
import org.eclipse.jetty.util.resource.Resource;
import org.eclipse.jetty.webapp.WebAppContext;

public class GisServer {
    private final Server server = new Server(8080);

    private void start() throws Exception {
        server.setRequestLog(new CustomRequestLog());
        server.setHandler(new WebAppContext(Resource.newClassPathResource("/web"), "/"));
        server.start();
    }

    public static void main(String[] args) throws Exception {
        new GisServer().start();
    }
}
