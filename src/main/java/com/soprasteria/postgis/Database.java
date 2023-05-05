package com.soprasteria.postgis;

import lombok.Setter;
import lombok.SneakyThrows;
import lombok.extern.slf4j.Slf4j;
import org.flywaydb.core.Flyway;
import org.postgresql.ds.PGSimpleDataSource;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.SQLException;

@Slf4j
public class Database {
    @Setter
    private boolean clean = false;
    private final String user = "postgres";
    private final String password = null;
    private final String databaseName = "gisdemo";

    private final DataSource masterDataSource = createDataSource("postgres", null, "postgres");

    @SneakyThrows
    public DataSource getDataSource() {
        if (clean) {
            deleteDatabase();
        }
        var dataSource = createDataSource(user, password, databaseName);
        ensureDatabase(dataSource);
        Flyway.configure().dataSource(dataSource).load().migrate();
        return dataSource;
    }

    private void ensureDatabase(DataSource dataSource) throws SQLException {
        try {
            dataSource.getConnection().close();
        } catch (SQLException e) {
            if (e.getSQLState().equals("3D000")) {
                try (Connection connection = masterDataSource.getConnection()) {
                    try (var statement = connection.createStatement()) {
                        log.info("Creating database {}" , databaseName);
                        statement.executeUpdate("create database " + databaseName + " with owner " + user);
                    }
                }
            } else {
                throw e;
            }
        }
    }

    private void deleteDatabase() throws SQLException {
        log.warn("Deleting database {}" , databaseName);
        try (Connection connection = masterDataSource.getConnection()) {
            try (var statement = connection.createStatement()) {
                statement.execute("SELECT pg_terminate_backend(pg_stat_activity.pid)\n" +
                                        "FROM pg_stat_activity\n" +
                                        "WHERE pg_stat_activity.datname = '" + databaseName + "'" +
                                        "  AND pid <> pg_backend_pid()");
                statement.executeUpdate("drop database if exists " + databaseName);
            }
        }
    }

    private DataSource createDataSource(String user, String password, String databaseName) {
        var dataSource = new PGSimpleDataSource();
        dataSource.setUser(user);
        dataSource.setPassword(password);
        dataSource.setDatabaseName(databaseName);
        dataSource.setServerNames(new String[]{"localhost"});
        dataSource.setPortNumbers(new int[] {5432});
        return dataSource;
    }
}
