CREATE DATABASE homework79;

create table if not exists `homework79`.categories
(
    id          int auto_increment
        primary key,
    name        varchar(100) not null,
    description text         null
);

create table `homework79`.places
(
    id          int auto_increment
        primary key,
    name        varchar(100) not null,
    description text         null
);

create table if not exists `homework79`.items
(
    id          int auto_increment
        primary key,
    name        varchar(100) not null,
    description text         null,
    photo       varchar(100) null,
    category_id int          null,
    place_id    int          null,
    constraint items_categories_id_fk
        foreign key (category_id) references `homework79`.categories (id),
    constraint items_places_id_fk
        foreign key (place_id) references `homework79`.places (id)
);

INSERT INTO homework79.places (id, name, description) VALUES (1, 'Кабинет директора', 'Описание кабинета');
INSERT INTO homework79.places (id, name, description) VALUES (2, 'Офис', 'Описание офиса');
INSERT INTO homework79.places (id, name, description) VALUES (3, 'Учительская', 'описание учительской');

INSERT INTO homework79.categories (id, name, description) VALUES (1, 'Мебель', 'Описание мебели');
INSERT INTO homework79.categories (id, name, description) VALUES (2, 'Компьютерное оборудование', 'Описание компьютерного оборудования');
INSERT INTO homework79.categories (id, name, description) VALUES (3, 'Бытовая техника', 'Описание бытовой техники');

INSERT INTO homework79.items (name, description, photo, category_id, place_id) VALUES ('Стул', 'Деревянный', null, 1, 1);
INSERT INTO homework79.items (name, description, photo, category_id, place_id) VALUES ('Ноутбук', 'Lenovo', null, 2, 2);
INSERT INTO homework79.items (name, description, photo, category_id, place_id) VALUES ('Микроволновка', 'Samsung', null, 3, 3);