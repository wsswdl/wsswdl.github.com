---
layout: post
title: 设计模式--策略模式
category: sheji
---

>*策略模式：*它定义了算法家族，分别封装起来，让他们之间可以互相替换，此模式让算法的变化，不会影响到使用算法的用户。

策略模式类图

![image](/image/pattern_strategy/1.png )

Strategy类定义所有支持算法的公用接口

	//抽象算法类或者是接口
	abstract class Strategy
	{
		//算法方法
		public abstract void AlgorithmInterface();
	}

ConcreteStrategy，封装了具体的算法或行为，继承于Strategy
	
	//具体算法A
	class ConcreteStrategyA : Strategy
	{
		//算法A的实现方法
		public overrride void AlgorithmInterface()
		{
			Console.Writeln("算法A实现");
		}
	}

	//具体算法B
	class ConcreteStrategyB : Strategy
	{
		//算法A的实现方法
		public overrride void AlgorithmInterface()
		{
			Console.Writeln("算法B实现");
		}
	}

	//具体算法C
	class ConcreteStrategyC : Strategy
	{
		//算法A的实现方法
		public overrride void AlgorithmInterface()
		{
			Console.Writeln("算法C实现");
		}
	}

Context，用一个ConcreteStrategy来配置，维护一个队Strategy对象的引用。

	//上下文
	class Context
	{
		Strategy strategy;
		public Context(Strategy strategy)
		{
			this.strategy = strategy;
		}
		//上下文接口
		public void ContextInterface()
		{
			strategy.AlgorithmInterface();
		}
	}


事例实现：

题目：现在有一个模拟鸭子游戏，游戏中会出现各种鸭子，都可以游泳戏水，有的可以呱呱叫，有的不可以叫，有的还可以飞。

1.实现超类Duck类
	
	public abstract class Duck{

		FlyBehavior flyBehavior;

		QuackBehavior quackBehavior;

		public Duck()
		{
		}

		public abstract void display();
		
		public void performanceFly(){
			flyBehavior.fly();
		}

		public void performanceQuack(){
			quackBehavior.quack();
		}

		public void swim(){
			System.out.println("All ducks float");
		}
	}

2.编写FlyBehavior接口与两个行为实现类。

	public interface FlyBehavior{
		public void fly();
	}

	public class FlyWithWings implements FlyBehavior{
		public void fly(){
			System.out.println("I'm flying");
		}
	}

	public class FlyNoWay implements FlyBehavior{
		public void fly(){
			System.out.println("I can't fly");
		}
	}

3.编写QuackBehavior接口，及其三个实现类。

	public interface QuackBehavior{
		public void quack();
	}

	public class Quack implements QuackBehavior{
		public void quack(){
			System.out.println("Quack");
		}
	}

	public class NuteQuack implements QuackBehavior{
		public void quack(){
			System.out.println("<<silence>>");
		}
	}

	public class Squack implements QuackBehavior{
		public void quack(){
			System.out.println("Squack");
		}
	}

4.编写子类MallardDuck。

	public class MallardDuck extends Duck{
		public MallardDuck(){
			quackBehavior = new Quack();
			flyBehavior = new FlyWithWings();
		}
		public void display(){
			System.out.println("I'm a real Mallard duck");
		}
	}

5.编写测试类。

	public class MiniDuckSimulator{
		public static void Main(String[] args){
			Duck mallard = new MallardDuck();
			mallard.performanceFly();
			mallard.performanceQuack();
		}
	}

同时，通过策略模式也可以动态的设定行为，在Duck类中加入两个新的方法：
	
	public void setFlyBehavior(FlyBehavior fb){
		flyBehavior = fb;
	}

	public void setQuackBehavior(QuackBehavior qb){
		quackBehavior = qb;
	}

则测试类：

	public class MiniDuckSimulator{
		public static void Main(String[] args){
			Duck mallard = new MallardDuck();
			mallard.performanceFly();
			mallard.setFlyBehavior(new FlyNoway());
			mallard.performanceFly();
		}
	}	


策略模式解析：

策略模式是一种定义一系列算法的方法，从概念上来看，所有这些算法完成的都是相同的工作，只是实现不同，它可以以相同的方式调用所有的算法，减少了各种算法类与使用
算法类之间的耦合。

策略模式的有点：1.策略模式的Strategy类层次为Context定义了一系列的可重用的算法或行为。继承有助于析取出这些算法中的公共功能。2.策略模式简化了单元测试，因为每个
算法都有自己的类，可以通过自己的接口单独测试。

*策略模式就是用来封装算法的，但是在实践中，我们发现可以用它来封装几乎任何类型的规则，只要在分析过程中听到需要在不用时间应用不同的业务规则，就可以考虑使用
策略模式处理这种变化的可能性。*