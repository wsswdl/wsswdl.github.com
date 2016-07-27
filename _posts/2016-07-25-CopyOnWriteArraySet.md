---
layout: post
title: CopyOnWriteArraySet详解
category: juc
---


## 介绍：
CopyOnWriteArraySet相当于线程安全的HashSet，在多线程的情况下可以使用CopyOnWriteArraySet。

## 特点：

1. CopyOnWriteArraySet和HashSet虽然都继承于共同的父类AbstractSet；但是，HashSet是通过HashMap实现的，而CopyOnWriteArraySet则是通过CopyOnWriteArrayList实现的，并不是散列表。
2. Set 大小通常保持很小，只读操作远多于可变操作，需要在遍历期间防止线程间的冲突。
3. 因为通常需要复制整个基础数组，所以可变操作（add()、set() 和 remove() 等等）的开销很大。
4. 迭代器支持hasNext(), next()等不可变操作，但不支持可变 remove()等 操作。
5. 使用迭代器进行遍历的速度很快，并且不会与其他线程发生冲突。在构造迭代器时，迭代器依赖于不变的数组快照。

## 原理：

![image](/image/CopyOnWriteArraySet/1.jpg )

因为CopyOnWriteArraySet的底层是通过CopyOnWriteArrayList实现的，所以可以保证线程安全的原理是和CopyOnWriteArrayList一样的，不同的是CopyOnWriteArraySet集合需要保证元素的唯一性，所以每次在进行add()、set()等操作时都会先判断集合中是否已经存在此元素，然后再操作。

## 源码分析：
#### 1.基本定义及初始化

    private final CopyOnWriteArrayList<E> al;
    
    * Creates an empty set.
    
    public CopyOnWriteArraySet() {
         al = new CopyOnWriteArrayList<E>();
     }


#### 2.添加add（）
      
    public boolean add(E e) {
        return al.addIfAbsent(e);
     }
	 

CopyOnWriteArraySet是通过CopyOnWriteArrayList实现的，它的API基本上都是通过调用CopyOnWriteArrayList的API来实现的，这里就不再过多解释。
