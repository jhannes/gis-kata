package com.soprasteria.postgis;

import lombok.RequiredArgsConstructor;

import javax.sql.DataSource;

@RequiredArgsConstructor
public class PostgisDemo {

    private final DataSource dataSource;

    public static void main(String[] args) {
        new PostgisDemo(new Database().setClean(true).getDataSource()).run();
    }

    private void run() {
        //loadMunicipalities();
        loadCounties();
        findRegions(new double[] { 10.5, 59.5 });
    }

    private void findRegions(double[] longLat) {

    }

    private void loadCounties() {

    }


}
