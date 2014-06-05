---
layout: post
title: 设计模式--装饰者模式
category: sheji
---

>*装饰者模式：*动态地将责任附加到对象上。若要扩展功能，装饰者提供了比继承更有弹性的替代方案。

装饰者模式类图

![image](/image/pattern_decorator/1.png )

事例实现：

题目：星巴兹是以扩展宿舍最快而文明的咖啡连锁店，因为扩张速度实在太快，他们准备更新订单系统，以合乎他们的饮料供应要求。他们又很多类型的咖啡，在购买咖啡时
也可以要求在其中加入各种调料，例如：蒸奶、豆浆、摩卡或者覆盖泡沫。星巴兹会根据加入的调料收取不同的费用。所以订单 系统必须考虑到这些调料的部分。

以装饰者模式构造饮料订单

![image](/image/pattern_decorator/2.png )

1.先从Beverage类下手，这不需要改变星巴兹原始的设计。如下所示：

	public abstract class Beverage{
		String description = "unkown beverage";

		public String getDescription(){
			return description;
		}

		public abstract double cost();
	}

2.实现Condiment(调料)抽象类，也就是装饰者类：
	
	public abstract class CondimentDecorator extends Beverage{
		public abstract String getDescription();
	}

3.现在已经有了基类，让我们开始实现一些饮料吧！先从浓缩咖啡（Esprosso）开始。别忘了，我们需要为具体的饮料设置描述，而且还必须实现cost()方法。

	public class Esprosso extends Beverage{
		public Esprosso(){
			description = "Esprosso";
		}
		public double cost(){
			return 1.99;
		}
	}

	public class HouseBlend extends Beverage{
		public HouseBlend(){
			description = "HouseBlend";
		}
		public double cost(){
			return 0.99;
		}
	}

4.现在，我们来实现具体装饰者。

	public class Mocha extends CondimentDecorator{
		Beverage beverage;

		public Mocha(Beverage beverage){
			this.beverage = beverage;
		}

		public String getDescription(){
			return beverage.getDescription()+",Mocha";
		}

		public double cost(){
			return 0.2 + beverage.cost();
		}
	}

5.测试代码：

	public class StarbuzzCoffee{
		
		public static void Main(String[] args){
			Beverage beverage = new Esprosso();
			System.out.println(beverage.getDescription()+"$"+beverage.cost());

			Beverage beverage2 = new HouseBlend();

			beverage2 = new Mocha(beverage2);
			beverage2 = new Mocha(beverage2);
			beverage2 = new Whip(beverage2);
			System.out.println(beverage.getDescription()+"$"+beverage.cost());


		}
	}

装饰者模式总结：

装饰者模式是为已有功能动态添加更多功能的一种方式。

优点：把类中的装饰功能从类中搬移出去，这样可以简化原有的类，同时有效地把类的核心职责和装饰功能区分开了，而且可以去除相关类中重复的装饰逻辑。

缺点：利用装饰者模式，常常造成设计中有大量的小类，数量实在太多，可能会造成使用此API程序员的困扰，比如java IO。