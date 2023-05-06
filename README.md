Demonstrates PostGIS used in Java

Example output:

```
02:12:35.060 [main] [WARN ] [Database.deleteDatabase(Database.java:52)]: Deleting database gisdemo
02:12:35.526 [main] [INFO ] [Database.ensureDatabase(Database.java:41)]: Creating database gisdemo
02:12:36.973 [main] [INFO ] [PostgisDemo.insertFeatures(PostgisDemo.java:103)] {area.type=municipality}: Loading
02:12:37.331 [main] [INFO ] [PostgisDemo.insertFeatures(PostgisDemo.java:103)] {area.type=county}: Loading
02:12:37.391 [main] [INFO ] [PostgisDemo.run(PostgisDemo.java:35)]: Loading complete
02:12:37.394 [main] [INFO ] [PostgisDemo.findRegions(PostgisDemo.java:77)]: Regions for {"type":"Point","coordinates":[10.8,59.9]}
02:12:37.440 [main] [INFO ] [PostgisDemo.findRegions(PostgisDemo.java:87)]: municipality 0301 Oslo
02:12:37.441 [main] [INFO ] [PostgisDemo.findRegions(PostgisDemo.java:87)]: county 03 Oslo
02:12:37.444 [main] [INFO ] [PostgisDemo.findRegions(PostgisDemo.java:77)]: Regions for {"type":"Point","coordinates":[5.0,59.9]}
02:12:37.471 [main] [INFO ] [PostgisDemo.findRegions(PostgisDemo.java:87)]: municipality 4613 Bømlo
02:12:37.472 [main] [INFO ] [PostgisDemo.findRegions(PostgisDemo.java:87)]: county 46 Vestland
02:12:37.475 [main] [INFO ] [PostgisDemo.findRegions(PostgisDemo.java:77)]: Regions for {"type":"Point","coordinates":[10.8,63.0]}
02:12:37.499 [main] [INFO ] [PostgisDemo.findRegions(PostgisDemo.java:87)]: municipality 5027 Midtre Gauldal
02:12:37.499 [main] [INFO ] [PostgisDemo.findRegions(PostgisDemo.java:87)]: county 50 Trøndelag
02:12:37.500 [main] [INFO ] [PostgisDemo.findMunicipalities(PostgisDemo.java:45)]: Municipalities in county 46
02:12:37.807 [main] [INFO ] [PostgisDemo.findMunicipalities(PostgisDemo.java:56)]: county 46 Vestland
02:12:37.807 [main] [INFO ] [PostgisDemo.findMunicipalities(PostgisDemo.java:56)]: municipality 4601 Bergen
02:12:37.808 [main] [INFO ] [PostgisDemo.findMunicipalities(PostgisDemo.java:56)]: municipality 4613 Bømlo
02:12:37.808 [main] [INFO ] [PostgisDemo.findMunicipalities(PostgisDemo.java:56)]: municipality 4614 Stord
02:12:37.808 [main] [INFO ] [PostgisDemo.findMunicipalities(PostgisDemo.java:56)]: municipality 4615 Fitjar
02:12:37.808 [main] [INFO ] [PostgisDemo.findMunicipalities(PostgisDemo.java:56)]: municipality 4616 Tysnes
02:12:37.808 [main] [INFO ] [PostgisDemo.findMunicipalities(PostgisDemo.java:56)]: municipality 4617 Kvinnherad
02:12:37.809 [main] [INFO ] [PostgisDemo.findMunicipalities(PostgisDemo.java:56)]: municipality 4621 Voss
02:12:37.809 [main] [INFO ] [PostgisDemo.findMunicipalities(PostgisDemo.java:56)]: municipality 4622 Kvam
02:12:37.809 [main] [INFO ] [PostgisDemo.findMunicipalities(PostgisDemo.java:56)]: municipality 4623 Samnanger
02:12:37.809 [main] [INFO ] [PostgisDemo.findMunicipalities(PostgisDemo.java:56)]: municipality 4624 Bjørnafjorden
02:12:37.809 [main] [INFO ] [PostgisDemo.findMunicipalities(PostgisDemo.java:56)]: municipality 4625 Austevoll
02:12:37.810 [main] [INFO ] [PostgisDemo.findMunicipalities(PostgisDemo.java:56)]: municipality 4626 Øygarden
02:12:37.810 [main] [INFO ] [PostgisDemo.findMunicipalities(PostgisDemo.java:56)]: municipality 4627 Askøy
02:12:37.810 [main] [INFO ] [PostgisDemo.findMunicipalities(PostgisDemo.java:56)]: municipality 4628 Vaksdal
02:12:37.811 [main] [INFO ] [PostgisDemo.findMunicipalities(PostgisDemo.java:56)]: municipality 4629 Modalen
02:12:37.811 [main] [INFO ] [PostgisDemo.findMunicipalities(PostgisDemo.java:56)]: municipality 4630 Osterøy
02:12:37.811 [main] [INFO ] [PostgisDemo.findMunicipalities(PostgisDemo.java:56)]: municipality 4631 Alver
02:12:37.812 [main] [INFO ] [PostgisDemo.findMunicipalities(PostgisDemo.java:56)]: municipality 4632 Austrheim
02:12:37.812 [main] [INFO ] [PostgisDemo.findMunicipalities(PostgisDemo.java:56)]: municipality 4633 Fedje
02:12:37.813 [main] [INFO ] [PostgisDemo.findMunicipalities(PostgisDemo.java:56)]: municipality 4634 Masfjorden
02:12:37.813 [main] [INFO ] [PostgisDemo.findMunicipalities(PostgisDemo.java:56)]: municipality 4635 Gulen
02:12:37.813 [main] [INFO ] [PostgisDemo.findMunicipalities(PostgisDemo.java:56)]: municipality 4637 Hyllestad
02:12:37.813 [main] [INFO ] [PostgisDemo.findMunicipalities(PostgisDemo.java:56)]: municipality 4638 Høyanger
02:12:37.814 [main] [INFO ] [PostgisDemo.findMunicipalities(PostgisDemo.java:56)]: municipality 4639 Vik
02:12:37.814 [main] [INFO ] [PostgisDemo.findMunicipalities(PostgisDemo.java:56)]: municipality 4640 Sogndal
02:12:37.815 [main] [INFO ] [PostgisDemo.findMunicipalities(PostgisDemo.java:56)]: municipality 4646 Fjaler
02:12:37.815 [main] [INFO ] [PostgisDemo.findMunicipalities(PostgisDemo.java:56)]: municipality 4647 Sunnfjord
02:12:37.815 [main] [INFO ] [PostgisDemo.findMunicipalities(PostgisDemo.java:56)]: municipality 4650 Gloppen
02:12:37.815 [main] [INFO ] [PostgisDemo.run(PostgisDemo.java:41)]: complete
```