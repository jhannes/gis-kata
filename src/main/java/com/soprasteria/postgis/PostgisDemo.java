package com.soprasteria.postgis;

import jakarta.json.Json;
import jakarta.json.JsonArray;
import jakarta.json.JsonObject;
import jakarta.json.JsonValue;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.postgresql.util.PGobject;

import javax.sql.DataSource;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.sql.SQLException;
import java.util.HashSet;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@RequiredArgsConstructor
public class PostgisDemo {

    private final DataSource dataSource;

    public static void main(String[] args) throws SQLException, IOException {
        new PostgisDemo(new Database().setClean(true).getDataSource()).run();
    }

    private void run() throws SQLException, IOException {
        //loadMunicipalities();
        loadCounties();
        log.info("Loading complete");
        findRegions(new double[]{10.8, 59.9});
        findRegions(new double[]{5, 59.9});
        findRegions(new double[]{10.8, 63});
        log.info("complete");
    }

    private void findRegions(double[] longLat) throws SQLException {
        log.info("Regions for " + longLat[0] + ", " + longLat[1]);
        try (var connection = dataSource.getConnection()) {
            try (var statement = connection.prepareStatement("select * from areas where st_contains(bounds, st_geometryfromtext(?))")) {
                statement.setObject(1, "POINT(" + longLat[0] + " " + longLat[1] + ")");
                try (var rs = statement.executeQuery()) {
                    while (rs.next()) {
                        log.info(rs.getString("type") + " " + rs.getString("code") + " " + rs.getString("name"));
                    }
                }
            }
        }

    }

    private void loadCounties() throws SQLException, IOException {
        try (var jsonReader = Json.createReader(Files.newBufferedReader(Path.of("src", "main", "geojson", "fylker_komprimert.json")))) {
            insertFeatures(jsonReader.readObject().getJsonArray("features"), "county", "fylkesnummer");
        }
    }

    private void insertFeatures(JsonArray features, String type, String codeProperty) throws SQLException {
        log.info("Loading {}", type);
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

                    statement.setObject(1, UUID.randomUUID());
                    statement.setObject(2, areaType(type));
                    statement.setString(3, code);
                    statement.setString(4, properties.getJsonArray("navn")
                            .stream()
                            .map(JsonValue::asJsonObject)
                            .filter(o -> o.getString("sprak").equals("nor"))
                            .map(o -> o.getString("navn"))
                            .findFirst()
                            .orElseThrow());
                    statement.setString(5, geoJsonToWtk(jsonValue.asJsonObject().getJsonObject("geometry")));
                    statement.addBatch();
                }
                statement.executeBatch();
            }
        }
    }

    private static String geoJsonToWtk(JsonObject geometry) {
        var coordinates = geometry.getJsonArray("coordinates")
                .stream()
                .map(s1 -> toWktCoordinateList(s1.asJsonArray()))
                .map(s -> "(" + s + ")")
                .collect(Collectors.joining(", "));
        return "POLYGON(" + coordinates + ")";
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
