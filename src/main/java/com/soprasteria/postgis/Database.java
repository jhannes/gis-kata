package com.soprasteria.postgis;

import lombok.Setter;

import javax.sql.DataSource;

public class Database {
    @Setter
    private boolean clean = false;

    public DataSource getDataSource() {
        return null;
    }
}
