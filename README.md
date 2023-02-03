

## Tasks

### Development

1. Run `npm start`
2. Start `com.soprasteria.gisdemo.GisServer` class in debugger
3. Go to http://localhost:8080

### Deployment

1. Run `mvn install` to build JavaScript, Java and Docker image and install it to image registry
2. Run `docker run -p 8080:80 --pull always ghcr.io/jhannes/gis-kata` to start container in docker
