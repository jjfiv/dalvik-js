class Benchmark {
  public static long timeNow() {
    return System.currentTimeMillis();
  }

  public static String eval(LinkedList<String> sexpr) {
    String first = sexpr.first();

    //System.out.println("eval " + sexpr);
    if(first == null) {
      return "()";
    }
    
    LinkedList<String> rest = sexpr.rest();

    if(first.equals("+")) {
      int value = 0;

      while(!rest.empty()) {
        int cur = Integer.parseInt(rest.pop());
        value += cur;
      }
      return Integer.toString(value);
    } else {
      System.out.println("Undefined function '" + first+"'");
      return "nil";
    }
  }

  public static void doBenchmark() {
    for(int times=0; times<100; times++) {
      int sum = 0;
      
      LinkedList<String> operation = new LinkedList<String>();
      for(int i=times; i<10000; i++) {
        operation.push(Integer.toString(i));
        sum += i;
      }
      // unnecessary reverse in order to create more garbage
      operation = operation.reverse();
      operation.push("+");

      if(!eval(operation).equals(Integer.toString(sum))) {
        System.out.println("ERROR '"+sum+"' != '"+eval(operation)+"'");
        return;
      }
    }

  }

  public static void main(String[] args) {
    long start, end;
    start = timeNow();
    
    doBenchmark();

    end = timeNow();
    System.out.println(end-start);
  }
};
