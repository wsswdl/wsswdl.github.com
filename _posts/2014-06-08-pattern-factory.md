---
layout: post
title: 设计模式--工厂模式
category: sheji
---

工厂模式：

首先需要说一下工厂模式。工厂模式根据抽象程度的不同分为三种：简单工厂模式（也叫静态工厂模式）、本文所讲述的工厂方法模式、以及抽象工厂模式。工厂模式是编程中经常用到的一种模式。它的主要优点有：

*	可以使代码结构清晰，有效地封装变化。在编程中，产品类的实例化有时候是比较复杂和多变的，通过工厂模式，将产品的实例化封装起来，使得调用者根本无需关心产品的实例化过程，只需依赖工厂即可得到自己想要的产品。

*	对调用者屏蔽具体的产品类。如果使用工厂模式，调用者只关心产品的接口就可以了，至于具体的实现，调用者根本无需关心。即使变更了具体的实现，对调用者来说没有任何影响。

*	降低耦合度。产品类的实例化通常来说是很复杂的，它需要依赖很多的类，而这些类对于调用者来说根本无需知道，如果使用了工厂方法，我们需要做的仅仅是实例化好产品类，然后交给调用者使用。对调用者来说，产品所依赖的类都是透明的。

简单工厂模式跟工厂方法模式极为相似，区别是：简单工厂只有三个要素，他没有工厂接口，并且得到产品的方法一般是静态的。因为没有工厂接口，所以在工厂实现的扩展性方面稍弱，可以算所工厂方法模式的简化版，关于简单工厂模式，在此一笔带过。

###1.工厂方法模式###

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

在两个城市分别开一家比萨店

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

通过工厂方法模式的类图可以看到，工厂方法模式有四个要素：

*	工厂接口。工厂接口是工厂方法模式的核心，与调用者直接交互用来提供产品。在实际编程中，有时候也会使用一个抽象类来作为与调用者交互的接口，其本质上是一样的。

*	工厂实现。在编程中，工厂实现决定如何实例化产品，是实现扩展的途径，需要有多少种产品，就需要有多少个具体的工厂实现。

*	产品接口。产品接口的主要目的是定义产品的规范，所有的产品实现都必须遵循产品接口定义的规范。产品接口是调用者最为关心的，产品接口定义的优劣直接决定了调用者代码的稳定性。同样，产品接口也可以用抽象类来代替，但要注意最好不要违反里氏替换原则。

*	产品实现。实现产品接口的具体类，决定了产品在客户端中的具体行为。

一句话总结就是：工厂接口有创建产品的工厂方法，返回的是产品，而返回哪个产品是在客户端决定的。

###2.抽象工厂模式###

>*抽象工厂模式：*提供一个接口，用于创建相关或者依赖对象的家族，而不需要指定具体类。

抽象工厂模式类图：

![image](/image/pattern_factory/1.png )

再回到比萨店：为了保证加盟店使用高质量的原料，打算建造一家生产原料的工厂，并将原料运送到各家加盟店。对于这个做法，现在还剩下一个问题：加盟店在不同的区域，纽约
的红酱料和芝加哥的红酱料是不一样的，对于纽约和芝加哥，我们必须准备两组不同的原料，所以必须先清楚如何处理原料家族。

1.建造原料工厂

	public interface PizzaIngredientFactory{
		public Dough createDough();
		public Sauce createSauce();
		public Cheese createCheese();
		public Clams createClams();
	}

2.创建纽约原料工厂

	public class NYPizzaIngredientFactory implements PizzaIngredientFactory{
		
		public Dough createDough(){
			return new ThinCrustDough();
		}

		public Sauce createSauce(){
			return new MarinaraSauce();
		}

		public Cheese createCheese(){
			return new ReggianoCheese();
		}

		public Clams createClams(){
			return new DreshClams();
		}
	}

3.继续重做比萨。现在已经有了一个抽象比萨，可以开始创建纽约和芝加哥风味的比萨了。从今以后，加盟店必须直接从工厂获取原料。

	public class CheesePizza extends pizza{
		
		PizzaIngredientFactory ingredientFactory;

		public CheesePizza(PizzaIngredientFactory ingredientFactory){
			this.ingredientFactory = ingredientFactory;
		}

		void prepare(){
			System.out.println("Preparing " + name);
			dough = ingredientFactory.createDough();
			sauce = ingredientFactory.createSauce();
			cheese = ingredientFactory.createCheese();
		}
	}

	public class ClamPizza extends Pizza{
		PizzaIngredientFactory ingredientFactory;

		public ClamPizza(PizzaIngredientFactory ingredientFactory){
			this.ingredientFactory = ingredientFactory;
		}

		void prepare(){
			System.out.println("Preparing " + name);
			dough = ingredientFactory.createDough();
			sauce = ingredientFactory.createSauce();
			cheese = ingredientFactory.createCheese();
		}
	}

4.再回到比萨店。我们几乎完工了，只需要再到加盟店都安在巡视一下，确认他们使用了正确的比萨，也需要让他们能和本地的原料工厂搭上线

	public class NYPizzaStore extends PizzaStore{
		
		protected Pizza createPizza(String item){
			Pizza pizza = null;
			PizzaIngredientFactory ingredientFactory = new NYPizzaIngredientFactory();
			
			if(item.equals("cheese")){
				pizza = new CheesePizza(ingredientFactory);
				pizza.setName("New York Style cheese Pizza");
			}
			
			else if(item.equals("clam")){
				pizza = new Clam(ingredientFactory);
				pizza.setName("New York Style Clam Pizza");
			}

			...

			return pizza;
		}
	}

抽象工厂模式总结：

好处：

1.易于交换产品系列，由于具体工厂类，例如PizzaStore nyPizzaStore = new NYPizzaStore(),在一个应用中只需要在初始化的时候出现一次，这就使得改变一个应用的具体
工厂变得非常容易，它只需要改变具体工厂既可以使用不同的产品配置。

2.它让具体的创建实例过程与客户端分离，客户端是通过它们的抽象接口操纵实例，产品的具体类名也被具体工厂的实现分离，不会出现在客户代码中。

起源：

据说最早的应用是用来创建在不同操作系统的视窗环境下都能够运行的系统。比如在Windows与Unix系统下都有视窗环境的构件，在每一个操作系统中，
都有一个视窗构件组成的构件家族（比如button和text）。我们可以通过一个抽象角色给出功能描述，而由具体子类给出不同操作系统下的具体实现。
系统对产品对象的创建要求由一个工厂的等级结构满足。其中有两个具体工厂角色，即UnixFactory和WinFactory。UnixFactory对象负责创建Unix产品族中的产品，
而WinFactory负责创建Windows产品族中的产品。

###3.工厂方法模式与抽象工厂模式的区别###

抽象工厂模式是工厂方法模式的升级版本，他用来创建一组相关或者相互依赖的对象。他与工厂方法模式的区别就在于，工厂方法模式针对的是一个产品等级结构；
而抽象工厂模式则是针对的多个产品等级结构。在编程中，通常一个产品结构，表现为一个接口或者抽象类，也就是说，工厂方法模式提供的所有产品都是衍生自
同一个接口或抽象类，而抽象工厂模式所提供的产品则是衍生自不同的接口或抽象类。
        
在抽象工厂模式中，有一个产品族的概念：所谓的产品族，是指位于不同产品等级结构中功能相关联的产品组成的家族。抽象工厂模式所提供的一系列产品就组成
一个产品族；而工厂方法提供的一系列产品称为一个等级结构。

在以上的例子中，cheese、sauce、clam就是一个产品族，每个城市都需要用到这些产品，所以每个城市就是一个等级结构，比如纽约和芝加哥就是两个等级结构。
