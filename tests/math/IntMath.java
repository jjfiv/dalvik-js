class IntMath {
  public static int db = 3;
  public static int dc = 2;
  public static void main(String[] args) {
    //int da, db, dc;
    
    //da = 4; db = 3; dc = 2;

    int da;
    da = db + dc; // 5
    da += db;     // 8
    da += 1;      // 9

    System.out.println(da);

    da = db - dc; // 1
    da -= db;     // -2
    da -= 1;      // -3

    System.out.println(da);

    da = db * dc; // 6
    da *= db;     // 18
    da *= 2;      // 36

    System.out.println(da);

    db = 16;
    dc = 2;
    
    da = db / dc; // 8
    da /= dc;     // 4
    da /= 2;      // 2

    System.out.println(da);

  }
}
