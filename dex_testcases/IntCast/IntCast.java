class IntCast {
  public static void main(String[] args) {
    int x = 0xdead004a;
    System.out.println( (char)  x );
    System.out.println( (byte)  x );

    int y = 0xdeadbeef;
    System.out.println( (short) y );
  }
};

