---
layout: post
title: 设计模式--工厂/抽象工厂模式
category: sheji
---

工厂模式：

首先需要说一下工厂模式。工厂模式根据抽象程度的不同分为三种：简单工厂模式（也叫静态工厂模式）、本文所讲述的工厂方法模式、以及抽象工厂模式。工厂模式是编程中经常用到的一种模式。它的主要优点有：

*可以使代码结构清晰，有效地封装变化。在编程中，产品类的实例化有时候是比较复杂和多变的，通过工厂模式，将产品的实例化封装起来，使得调用者根本无需关心产品的实例化过程，只需依赖工厂即可得到自己想要的产品。

*对调用者屏蔽具体的产品类。如果使用工厂模式，调用者只关心产品的接口就可以了，至于具体的实现，调用者根本无需关心。即使变更了具体的实现，对调用者来说没有任何影响。

*降低耦合度。产品类的实例化通常来说是很复杂的，它需要依赖很多的类，而这些类对于调用者来说根本无需知道，如果使用了工厂方法，我们需要做的仅仅是实例化好产品类，然后交给调用者使用。对调用者来说，产品所依赖的类都是透明的。

简单工厂模式跟工厂方法模式极为相似，区别是：简单工厂只有三个要素，他没有工厂接口，并且得到产品的方法一般是静态的。因为没有工厂接口，所以在工厂实现的扩展性方面稍弱，可以算所工厂方法模式的简化版，关于简单工厂模式，在此一笔带过。

###1.工厂模式###

>*工厂方法模式：*定义了一个创建对象的接口，但由子类决定要实例化的类是哪一个。工厂方法让类把实例化推迟到子类。

类图：

![image](/image/pattern_factory/1.png )

事例实现

题目：假设你有个比萨店，菜单中有一些流行的比萨：ClamPizza(蛤蛎比萨)、Cheese、greek等，做到一定的规模后你想开加盟店，在全国各地开。

声明一个工厂方法

	public abstract class PizzaStore{
		
		public Pizza orderPizza(String type){
			Pizza pizza;

			pizza = createPizza(type);
			pizza.prepare();
			pizza.bake();
			pizza.cut();
			pizza.box();

			return pizza;
		}

		protected abstract Pizza createPizza(String type);
	}

开一家比萨店

	public class NYPizzaStore extends PizzaStore{
		Pizza createPizza(String type){
			if(type.equals("cheese"))
				return new NYStyleCheesePizza();
			else if(type.equals("veggie"))
				return new NYStyleVeggiePizza();
			else if(type.equals("clam"))
				return new NYStyleClamPizza();
			else
				return null;
		}
	}

	public class ChicagoPizzaStore extends PizzaStore{
		Pizza createPizza(String type){
			if(type.equals("cheese"))
				return new ChicagoStyleCheesePizza();
			else if(type.equals("veggie"))
				return new ChicagoStyleVeggiePizza();
			else if(type.equals("clam"))
				return new ChicagoStyleClamPizza();
			else
				return null;
		}
	}

实现一个比萨抽象类

	public abstract class Pizza{
		String name;
		String dough;
		String sauce;
		ArrayList topping = new ArrayList();

		void prepare(){
			System.out.println("Preparing "+ name);
			System.out.println("Tossing "+ dough);
			System.out.println("Adding "+ sauce);

			for(int i = 0;i<topping.size();i++)
				System.out.println(topping.get(i));
		}

		void bake(){
			System.out.println("Bake for 25 minutes at 350");
			
		}

		void cut(){
			System.out.println("Cutting the pizza diagonal slices ");
		}

		void box(){
			System.out.println("Place pizza in official PizzaStore box");
		}
	}

实现具体的pizza子类

	public class NYStyleCheesePizza extends Pizza{
		public NYStyleCheesePizza(){
			name = "NY Style Sauce and Cheese Pizza";
			dough = "Thin Crust Dough";
			sauce = "Marinara Sauce";

			topping.add("Grated Reggiano Cheese");
		}
	}

	public class ChicagoStyleCheesePizza extends Pizza{
		public ChicagoStyleCheesePizza(){
			name = "Chicago Style Sauce and Cheese Pizza";
			dough = "Thick Crust Dough";
			sauce = "Plum Tomato Sauce";

			topping.add("Shredded Mozzarella Cheese");
		}

		void cut(){
			System.out.println("Cuttingg the pizza into square slience");
		}
	}
