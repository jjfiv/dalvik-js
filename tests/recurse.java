public class recurse {
  public static void main(String[] args) {
    int a = rec (4);
    System.out.println (a);
  }
  static int rec (int a) {
    if (a > 0) {
      return a * rec (a-1);
    }
    return 1;
  }
}
