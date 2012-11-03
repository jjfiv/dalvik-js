public class Monitors {
  public static void main(String[] args){
    ThreadA a = new ThreadA();
    ThreadB b = new ThreadB();
    a.start();
    b.start();
  }
  static synchronized void printThings(String a, String b) {
    System.out.println(a);
    System.out.println(b);
  }
}
