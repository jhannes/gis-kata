package com.soprasteria.gisdemo;

import jakarta.servlet.UnavailableException;
import org.eclipse.jetty.util.resource.Resource;
import org.eclipse.jetty.util.resource.ResourceFactory;

import java.io.IOException;
import java.nio.file.Path;

class DefaultServlet extends org.eclipse.jetty.servlet.DefaultServlet {
    private final ResourceFactory resources;
    private boolean disableBuffer = false;

    public DefaultServlet(ResourceFactory baseResource, Resource sourceResource) {
        if (sourceResource.exists()) {
            this.resources = (p) -> {
                var r = sourceResource.getResource(p);
                return r != null && r.exists() ? r : baseResource.getResource(p);
            };
            disableBuffer = true;
        } else {
            resources = baseResource;
        }
    }

    public DefaultServlet(String path) {
        this(getBaseResource(path), getSourceResource(path));
    }

    private static Resource getSourceResource(String path) {
        return Resource.newResource(Path.of("src", "main", "resources", path));
    }

    private static Resource getBaseResource(String path) {
        var baseUrl = Resource.class.getResource(path);
        if (baseUrl == null) {
            throw new IllegalArgumentException("Path not found in classpath " + path);
        }
        return Resource.newResource(baseUrl);
    }

    @Override
    public Resource getResource(String pathInContext) {
        try {
            Resource resource = resources.getResource(pathInContext);
            return resource != null && resource.exists() ? resource : resources.getResource("/index.html");
        } catch (IOException e) {
            return null;
        }
    }

    @Override
    public void init() throws UnavailableException {
        if (disableBuffer) {
            getServletContext().setInitParameter("useFileMappedBuffer", "false");
        }
        super.init();
    }
}
