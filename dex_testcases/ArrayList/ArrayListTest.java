import java.util.ArrayList;

class ArrayListTest {
  public static void main(String[] args) {
    ArrayList<String> fruit = new ArrayList<String>();
    fruit.add("Apple");
    fruit.add("Orange");
    fruit.add("Banana");

    for(String s : fruit) {
      System.out.println(s);
    }
  }
}

