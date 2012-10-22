class customException extends Exception {
  public customException () {}

  public customException (String message) {
    super ("In custom exception\n");
  }
}
public class tryCatch {
  public static void main(String[] args) {
    try {
      int k, j;
      k = test (1);
      j = testThrow (1);
      throw new customException("Calling custom exception\n");
    }
    catch (ArithmeticException c) {
      System.out.println ("No way!\n");
    }
    catch (customException c) {
      System.out.println ("Caught my own exception \n");
    }
  }
  static int test (int param) throws ArithmeticException {
    return param / 0;
  }
  static int testThrow (int param) throws customException{
    try {
      if (param == 1)
      {
        throw new customException("Calling custom exception\n");
      }
    }
    finally {}
    return 1;
  }
}
