package com.soprasteria.gisdemo;

import org.eclipse.jetty.server.CustomRequestLog;
import org.eclipse.jetty.server.Server;
import org.eclipse.jetty.servlet.DefaultServlet;
import org.eclipse.jetty.util.resource.Resource;
import org.eclipse.jetty.webapp.WebAppContext;

public class GisServer {
    private final Server server = new Server(8080);

    private void start() throws Exception {
        server.setRequestLog(new CustomRequestLog());
        server.setHandler(createWebApp());
        server.start();
    }

    private static WebAppContext createWebApp() {
        var baseResource = Resource.newClassPathResource("/web");
        var webAppContext = new WebAppContext(baseResource, "/");
        if (baseResource.getURI().getScheme().equals("file")) {
            webAppContext.setInitParameter(DefaultServlet.CONTEXT_INIT + "useFileMappedBuffer", "false");
        }
        return webAppContext;
    }

    public static void main(String[] args) throws Exception {
        new GisServer().start();
    }
}
