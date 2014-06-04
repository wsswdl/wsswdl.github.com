---
layout: post
title: 设计模式--观察者模式
category: tansuo
---

###1.观察者模式基本介绍###

>*观察者模式：*定义了对象之间的一对多依赖，这样一来，当一个对象改变状态时，它的所有依赖者都会收到通知并自动更新。

观察者模式类图：

![image](/image/pattern_observer/1.png )

事例实现：

题目：气象监测站：有一个公司想建立一个应用，有三种布告板，分别显示目前状况、气象统计及简单的预报。当WeatherObject对象获得最新的测量数据时，三种布告板必须实施更新。

1.建立接口

	public interface Subject{

		public void registerObserver(Observer o);

		public void removeObserver(Observer o);

		public void notifyObserver();

	}

	public interface Observer{

		public void update(float);

	}

	public interface DisplayElement{

		public void display();

	}

2.在WeatherData中实现主题接口

	public class WeatherData implements Subject{
	
		private ArrayList observers;

		private float temperature;

		private float humidity;

		private float pressure;

		public WeatherData(){
			observers = new ArrayList();
		}

		public void registerObserver(Observer o){
			observers.add(o);
		}

		public void removeObserver(Observer o){
			int i = observers.indexOf(o);

			if(i>=0)
				observers.remove(i);
		}

		public void notifyObservers(){
			for(int i = 0; i < observers.size(); i++){
				Observer observer = (Observer)observers.get(i);
				observer.update(temperature,humidity,pressure);
			}
		}

		public void measurementsChanged(){
			notifyObservers();
		}

		public void setMeasurements(float temperature, float humidity,float pressure){
			this.temperature = temperature;
			this.humidity = humidity;
			this.pressure = pressure;
			measurementsChanged();
		}
	}

3.建立布告板

	public class CurrentConditionsDisplay implements Observer,DisplayElement{
		private float temperature;
		private float humidity;
		private Subject weatherData;

		public CurrentConditionsDisplay(Subject weatherData){
			this.weatherData = weatherData;
			weatherData.registerObserver(this);
		}

		public void update(float temperature, float humidity,float pressure){
			this.temperature = temperature;
			this.humidity = humidity;
			display();
		}

		public void display(){
			System.out.println("Current conditions" + temperature+"F degrees and " + humidity + "% humidity");
		}
	}


4.测试程序

	public class WeatherStation{
		public static void main(String[] args){
			WeatherData weatherdata = new WeatherData();
			CurrentConditionsDisplay currentDisplay = new CurrentConditionsDisplay(weatherData);
			StatisticsDisplay statisticsDisplay = new StatisticsDisplay(weatherData);
			ForecastDisplay forecastDisplay = new ForecastDisplay(weatherData);

			weatherData.setMeasurements(80,65,30.4f);
			weatherData.setMeasurements(82,79,29.4f);
			weatherData.setMeasurements(78,63,20.4f);
		}
	}

观察者模式特点：

应用场合：当一个对象的改变需要同时改变其他对象的时候，而且它不知道具体有多少对象有待改变时，应该考虑用观察者模式。

总得来说观察者模式所做的工作就是在解除耦合。让耦合的双方都依赖于抽象，而不是依赖于具体，从而使得个子的变化都不会影响另一边的变化。

###2.使用java内置的观察者模式###

java API中有内置的观察者模式。java.util包内包含最基本的Observer接口与Observable类，这和我们的Subject接口和Observer接口很相似。Observer接口与Observable类
使用上更方便，因为许多功能都已经事先准备好了。你甚至可以使用推（push）或拉（pull）的方式传送数据。

那我们怎么使用java API实现上例呢？

如何把对象变成观察者：如同以前一样，实现观察者接口（java.util.Observer），然后调用任何Observable对象的addObserver()方法。不想再当观察者时，调用deleteObserver()方法就可以了。

可观察者如何送出通知：首先，你需要setChanged()方法，标记状态已经改变的事实。然后，调用notifyObservers()方法中的一个：'notifyObservers()'或者'notifyObservers(Object arg)'

观察者如何接收通知：同以前一样，观察者实现了 更新的方法，但是方法签名不太一样：‘update(Observable o ,Object arg)’ ，第一个变量好让观察者知道是哪个主题通知它的，第
个参数正是传入notifyObserver()的数据对象，如果没有说明则为空。如果你想“推”（push）数据给观察者，你可以把数据当做数据对象传给notifyObservers(arg)方法、否则，观察者就必须
从课观察者对象中“拉”（pull）数据。

利用内置的支持重做气象站

	import java.util.Observable;
	import java.util.Observer;

	public class WeatherData extends Observable{
		private float temperature;
		private float humidity;
		private float pressure;

		public WeatherData(){}

		public void measurementsChanged(){
			setChanges();
			notifyObservers();
		}

		public void setMeasurements(float temperature, float humidity,float pressure){
			this.temperature = temperature;
			this.humidity = humidity;
			this.pressure = pressure;
			measurementsChanged();
		}

		public float getTemperature(){
			return temperature;
		}

		public float getHumidity(){
			return humidity;
		}

		public float getPressure(){
			return pressure;
		}

	}


	import java.util.Observable;
	import java.util.Observer;
	
	public class CurrentConditionsDisplay implements Observer,DisplayElement{
		Observable observable;
		private float temperature;
		private float humidity;

		public CurrentConditionsDisplay(Observable observable){
			this.observable = observable;
			observable.addObserver(this);
		}

		public void update(Observable obs,Object arg){
			if(obs instanceof WeatherData){
				WeatherData weatherData = (WeatherData)obs;
				this.temperature = weatherData.getTemperature();
				this.humidity = weatherData.getHumidity();
				display();
			}
		}

		public void display(){
			System.out.println("Current conditions" + temperature+"F degrees and " + humidity + "% humidity");
		}

	}