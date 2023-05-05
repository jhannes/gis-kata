create type area_type as enum ('county', 'municipality');

create table areas
(
    id uuid primary key,
    type area_type not null,
    code varchar(30) not null,
    name text not null
);
