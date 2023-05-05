package com.soprasteria.postgis;

import jakarta.json.Json;
import jakarta.json.JsonValue;
import lombok.RequiredArgsConstructor;
import org.postgresql.geometric.PGpoint;
import org.postgresql.geometric.PGpolygon;
import org.postgresql.util.PGobject;

import javax.sql.DataSource;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.sql.SQLException;
import java.util.UUID;

@RequiredArgsConstructor
public class PostgisDemo {

    private final DataSource dataSource;

    public static void main(String[] args) throws SQLException, IOException {
        new PostgisDemo(new Database().setClean(true).getDataSource()).run();
    }

    private void run() throws SQLException, IOException {
        //loadMunicipalities();
        loadCounties();
        findRegions(new double[] { 10.5, 59.5 });
    }

    private void findRegions(double[] longLat) throws SQLException {
        try (var connection = dataSource.getConnection()) {
            try (var statement = connection.prepareStatement("select * from areas")) {
                try (var rs = statement.executeQuery()) {
                    while (rs.next()) {
                        System.out.println(rs.getString("type") + " " + rs.getString("code") + " " + rs.getString("name"));
                    }
                }
            }
        }

    }

    private void loadCounties() throws SQLException, IOException {
        

        try (var connection = dataSource.getConnection()) {
            try (var statement = connection.prepareStatement("insert into areas (id, type, name, code, bounds) values (?, ?, ?, ?, ?)")) {
                try (var jsonReader = Json.createReader(Files.newBufferedReader(Path.of("src", "main", "geojson", "fylker_komprimert.json")))) {
                    for (var jsonValue : jsonReader.readObject().getJsonArray("features")) {
                        var properties = jsonValue.asJsonObject().getJsonObject("properties");
                        var name = properties.getJsonArray("navn")
                                .stream()
                                .map(JsonValue::asJsonObject)
                                .filter(o -> o.getString("sprak").equals("nor"))
                                .map(o -> o.getString("navn"))
                                .findFirst()
                                .orElseThrow();
                        statement.setObject(1, UUID.randomUUID());
                        statement.setObject(2, areaType("county"));
                        statement.setString(3, name);
                        statement.setString(4, properties.getString("fylkesnummer"));
                        statement.setObject(5, new PGpolygon(new PGpoint[] {
                                new PGpoint(-1.0d, -1.0d),
                                new PGpoint( 1.0d, -1.0d),
                                new PGpoint( 1.0d,  1.0d),
                                new PGpoint(-1.0d,  1.0d),
                                new PGpoint(-1.0d, -1.0d)
                        }));
                        statement.addBatch();
                    }
                }

                statement.executeBatch();
            }
        }
    }

    private static PGobject areaType(String value) throws SQLException {
        var result = new PGobject();
        result.setType("area_type");
        result.setValue(value);
        return result;
    }


}
