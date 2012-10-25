class PrimitiveCast {
  public static void main(String[] args) {
    long x = 0xdeadbeeffeedbeadL;
    
    // long-to-int
    System.out.println( ((int) x) == 0xfeedbead);

    long y = 10000000000L;
    System.out.println( ((float) y) == 10000000000.0f);
    System.out.println( ((double) y) == 10000000000.0);

    int z = 1024;
    System.out.println( ((long) z) == 1024L);
    System.out.println( ((float) z) == 1024.0f);
    System.out.println( ((double) z) == 1024.0);

    float f = 133.5f;
    System.out.println( ((int) f) == 133 );
    System.out.println( ((long) f) == 133L );
    System.out.println( ((double) f) == 133.5 );

    double d = 101.5;
    System.out.println( ((int) d) == 101 );
    System.out.println( ((long) d) == 101L );
    System.out.println( ((float) d) == 101.5f );
  }
};
