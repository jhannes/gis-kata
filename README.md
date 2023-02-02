

## Tasks

### Development

1. Run `npm start`
2. Start `com.soprasteria.gisdemo.GisServer` class in debugger
3. Go to http://localhost:8080

### Deployment

1. Run `mvn install` to build JavaScript, Java and Docker image and install it to image registry
2. Run `docker run -p 8080:8080 ghcr.io/jhannes/gis-kata` to start container in docker

***NB: Run `docker rmi --force ghcr.io/jhannes/gis-kata` to ensure the newest docker image locally***
