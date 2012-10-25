public class tryCatch {
  public static void main(String[] args) {
    double v = 777777777.7;
    double[] anArray = { 
      100000010.1, 200000010.1, 300000010.1,
      400000010.1, 500000010.1, 600000010.1, 
      700000010.1, 800000010.1, 900000010.1, 1000000099.2
    };
    anArray[3] = v;
    v = 1111111111.1;
    v = anArray[3];
    System.out.println(v);
  }
}
