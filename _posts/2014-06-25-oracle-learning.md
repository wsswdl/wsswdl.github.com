---
layout: post
title: oracle学习
category: zongjie
---

最近新加入一个项目组，需要使用到oracle数据库，因此花了一段时间把数据库的知识复习了一下，在此总结记录一下oracle数据库的用法。

## 一、SQL基础

#### 1.1 数据定义语言（DDL）

DDL主要包括数据库对象的创建（create）、删除（drop）和修改（alter）的操作。

1.使用create语句创建表

    create table table_name
    (
    column_name datatype [null|not null],
    column_name datatype [null|not null],
    ...
    [constraint]
    )

例：

    create table product
    (
     product_id varchar2(10),
     product_name varchar2(20),
     product_price number(8,2),
     quantity numeber(10)
    );

2.使用alter语句修改表

    alter table table_name
    add column_name | modify column_name | drop column column_name;

例：

    alter table product
    add remark varchar2(100);

    alter table product
    modify remark number(2,2);

    alter table product
    drop column remark;

3.使用drop语句删除表

    drop table table_name;
    
#### 1.2 约束的使用

约束是保证数据库表中数据的完整性和一致性的手段，oracle中有5个约束，即主键约束、外键约束、唯一约束、检查约束
、非空约束。

1.主键约束

主键约束在每个数据表中只有一个，但是一个主键约束可以由数据表中多个列组成。

	create table category
	(
	 id varchar2(10);
	 name varchar2(20);
	 primary key(id)
	);

2.外键约束

外键约束可以保证使用外键约束的数据库列与所引用的主键约束的数据列一致，外键约束在一个数据表中可以有多个。

	CONSTRAINT constraint_name FOREIGN KEY (column_name)
	REFERENCE table_name (column_name)
	ON DELETE CASCADE;
	
3.CHECK约束

CHECK约束是检查约束，能够规定每一个列能够输入的值，以保证数据的正确性。

	CONSTRAINT constraint_name CHECK(condition);

例：
	
	CREATE TABLE custom
	(
	 customid varchar2(10),
	 name varchar2(10),
	 age number(2),
	 tel varchar2(100),
	 CONSTRAINT chk_age CHECK(age>18 and age <50)
	);

4.UNIQUE约束

UNIQUE约束是唯一约束，可以设置在表中输入的字段值都是唯一的，这个约束和之前学习的主键约束
非常相似。不同的是唯一约束在一个表中可以有多个，而主键约束在一个表中只能有一个。

	CONSTRAINT constraint_name UNIOUE(column_name);

例：

	CREATE TABLE custom
	(
	 customid varchar2(10),
	 name varchar2(10),
	 age number(2),
	 tel varchar2(100),
	 CONSTRAINT unq UNIQUE(customid)
	);

5.NOT NULL约束

NOT NULL约束就是非空约束，经常会在创建表时添加非空约束以确保字段必须要输入值。
该约束和之前的约束不用，是直接在创建时设置字段的非空约束。

	CREATE TABLE custom
	(
	 customid varchar2(10) not null,
	 name varchar2(10),
	 age number(2),
	 tel varchar2(100),
	);

#### 1.3 数据操纵语言（DML）和数据查询语言（DQL）

DML就是用来操纵数据库中数据所使用的语言，对数据库中的数据操纵无非就是对数据
进行增加、删除、修改、查询的操作。对于数据的查询也称为数据查询语言。

1.添加数据用INSERT

	INSERT INTO table_name(column_name1,column_name2,...) VALUES(data1,data2...);

2.修改数据用UPDATE

	UPDATE table_name SET column_name1=data1,column_name2=date2,...[where condition];

	UPDATA login SET password='123456' WHERE loginname='dog';

3.删除数据用DELETE
	
	DELETE table_name [where condition];

4.查询数据就用SELECT



