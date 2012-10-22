
public class tryCatch {
  public static void main(String[] args) {
    try {
      int k;
      k = test (1);
    }
    catch (ArithmeticException c) {
      System.out.println ("No way!\n");
    }
  }
  static int test (int param) {
    return param / 0;
  }
}
