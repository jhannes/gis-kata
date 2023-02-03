package com.soprasteria.gisdemo;

import org.eclipse.jetty.server.CustomRequestLog;
import org.eclipse.jetty.server.Server;
import org.eclipse.jetty.servlet.ServletContextHandler;
import org.eclipse.jetty.servlet.ServletHolder;

import java.io.IOException;

public class GisServer {
    private final Server server = new Server(80);

    private void start() throws Exception {
        server.setRequestLog(new CustomRequestLog());
        server.setHandler(createWebApp());
        server.start();
    }

    private static ServletContextHandler createWebApp() throws IOException {
        var appContext = new ServletContextHandler(null, "/");
        appContext.addServlet(new ServletHolder(new WebjarsServlet("swagger-ui")), "/api-doc/swagger-ui/*");
        appContext.addServlet(new ServletHolder(new DefaultServlet("/web")), "/*");
        return appContext;
    }

    public static void main(String[] args) throws Exception {
        new GisServer().start();
    }

}
