
class factorial {

  static int evaluate(int n) {
    int result = 1;
    while(n > 1) {
      result *= n;
      n--;
    }
    return result;
  }

  public static void main(String[] args) {
    System.out.println(evaluate(4));
  }

}

