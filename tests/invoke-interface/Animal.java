
interface IAnimal {
  String speak();
}

class Dog implements IAnimal {
  public String speak() {
    return "Woof!";
  }
};

class Cat implements IAnimal {
  public String speak() {
    return "Meow.";
  }
};

class Animal {
  public static void main(String[] args) {
    IAnimal a = (IAnimal) new Dog();
    IAnimal b = (IAnimal) new Cat();

    System.out.println(a.speak());
    System.out.println(b.speak());
  }
};

