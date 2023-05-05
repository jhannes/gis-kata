package com.soprasteria.postgis;

import lombok.RequiredArgsConstructor;
import org.postgresql.geometric.PGpoint;
import org.postgresql.geometric.PGpolygon;
import org.postgresql.util.PGobject;

import javax.sql.DataSource;
import java.sql.SQLException;
import java.util.UUID;

@RequiredArgsConstructor
public class PostgisDemo {

    private final DataSource dataSource;

    public static void main(String[] args) throws SQLException {
        new PostgisDemo(new Database().setClean(true).getDataSource()).run();
    }

    private void run() throws SQLException {
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

    private void loadCounties() throws SQLException {
        try (var connection = dataSource.getConnection()) {
            try (var statement = connection.prepareStatement("insert into areas (id, type, name, code, bounds) values (?, ?, ?, ?, ?)")) {
                statement.setObject(1, UUID.randomUUID());
                statement.setObject(2, areaType("county"));
                statement.setString(3, "Oslo");
                statement.setString(4, "01");
                statement.setObject(5, new PGpolygon(new PGpoint[] {
                        new PGpoint(-1.0d, -1.0d),
                        new PGpoint( 1.0d, -1.0d),
                        new PGpoint( 1.0d,  1.0d),
                        new PGpoint(-1.0d,  1.0d),
                        new PGpoint(-1.0d, -1.0d)
                }));

                statement.addBatch();

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
