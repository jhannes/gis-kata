package com.soprasteria.postgis;

import jakarta.json.Json;
import jakarta.json.JsonArray;
import jakarta.json.JsonObject;
import jakarta.json.JsonValue;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.postgresql.util.PGobject;
import org.slf4j.MDC;

import javax.sql.DataSource;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.sql.SQLException;
import java.util.HashSet;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@RequiredArgsConstructor
public class PostgisDemo {

    private final DataSource dataSource;

    public static void main(String[] args) throws SQLException, IOException {
        new PostgisDemo(new Database().setClean(false).getDataSource()).run();
    }

    private void run() throws SQLException, IOException {
        loadMunicipalities();
        loadCounties();
        log.info("Loading complete");
        findRegions(createPoint(10.8, 59.9));
        findRegions(createPoint(5, 59.9));
        findRegions(createPoint(10.8, 63));
        log.info("complete");
    }

    private JsonObject createPoint(double longitude, double latitude) {
        return Json.createObjectBuilder()
                .add("type", "Point")
                .add("coordinates", Json.createArrayBuilder(List.of(longitude, latitude)))
                .build();
    }

    private void loadMunicipalities() throws IOException {
        try (var jsonReader = Json.createReader(Files.newBufferedReader(Path.of("src", "main", "geojson", "kommuner_komprimert.json")))) {
            insertFeatures(jsonReader.readObject().getJsonArray("features"), "municipality", "kommunenummer");
        }
    }

    private void findRegions(JsonObject point) throws SQLException {
        log.info("Regions for " + point);
        try (var connection = dataSource.getConnection()) {
            try (var statement = connection.prepareStatement("select * from areas where st_contains(bounds, st_geometryfromtext(?))")) {
                statement.setObject(1, geoJsonToWtk(point));
                try (var rs = statement.executeQuery()) {
                    while (rs.next()) {
                        log.info(rs.getString("type") + " " + rs.getString("code") + " " + rs.getString("name"));
                    }
                }
            }
        }

    }

    private void loadCounties() throws IOException {
        try (var jsonReader = Json.createReader(Files.newBufferedReader(Path.of("src", "main", "geojson", "fylker_komprimert.json")))) {
            insertFeatures(jsonReader.readObject().getJsonArray("features"), "county", "fylkesnummer");
        }
    }

    private void insertFeatures(JsonArray features, String type, String codeProperty) {
        MDC.put("area.type", type);
        log.info("Loading");
        try (var connection = dataSource.getConnection()) {
            var alreadyPresent = new HashSet<>();
            try (var statement = connection.prepareStatement("select code from areas where type = ?")) {
                statement.setObject(1, areaType(type));
                try (var rs = statement.executeQuery()) {
                    while (rs.next())
                        alreadyPresent.add(rs.getString("code"));
                }
            }

            try (var statement = connection.prepareStatement("insert into areas (id, type, code, name, bounds) values (?, ?, ?, ?, st_geometryfromtext(?))")) {
                for (var jsonValue : features) {
                    var properties = jsonValue.asJsonObject().getJsonObject("properties");
                    var code = properties.getString(codeProperty);

                    if (alreadyPresent.contains(code)) {
                        continue;
                    }
                    MDC.put("area.code", code);
                    var name = getName(properties);
                    MDC.put("area.name", name);
                    if (!(jsonValue.asJsonObject().get("geometry") instanceof JsonObject)) {
                        log.warn("Missing geometry");
                        continue;
                    }

                    statement.setObject(1, UUID.randomUUID());
                    statement.setObject(2, areaType(type));
                    statement.setString(3, code);
                    statement.setString(4, name);
                    statement.setString(5, geoJsonToWtk(jsonValue.asJsonObject().getJsonObject("geometry")));
                    statement.addBatch();
                }
                statement.executeBatch();
            }
        } catch (Exception e) {
            log.error("Failed to load", e);
        } finally {
            MDC.clear();
        }
    }

    private static String getName(JsonObject properties) {
        return properties.getJsonArray("navn")
                .stream()
                .map(JsonValue::asJsonObject)
                .filter(o -> o.getString("sprak").equals("nor"))
                .map(o -> o.getString("navn"))
                .findFirst()
                .orElseThrow();
    }

    private static String geoJsonToWtk(JsonObject geometry) {
        switch (geometry.getString("type")) {
            case "Polygon" -> {
                var coordinates = geometry.getJsonArray("coordinates")
                        .stream()
                        .map(s1 -> toWktCoordinateList(s1.asJsonArray()))
                        .map(s -> "(" + s + ")")
                        .collect(Collectors.joining(", "));
                return "POLYGON(" + coordinates + ")";
            }
            case "Point" -> {
                return "POINT(" + toWtkCoordinate(geometry.getJsonArray("coordinates")) + ")";
            }
            default -> throw new IllegalArgumentException("Illegal geojson type " + geometry);
        }
    }

    private static String toWktCoordinateList(JsonArray jsonValues) {
        return jsonValues.stream()
                .map(JsonValue::asJsonArray)
                .map(PostgisDemo::toWtkCoordinate)
                .collect(Collectors.joining(", "));
    }

    private static String toWtkCoordinate(JsonArray coord) {
        return coord.getJsonNumber(0).doubleValue() + " " + coord.getJsonNumber(1).doubleValue();
    }

    private static PGobject areaType(String value) throws SQLException {
        var result = new PGobject();
        result.setType("area_type");
        result.setValue(value);
        return result;
    }
}
