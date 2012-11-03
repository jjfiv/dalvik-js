class ThreadInstanceTest {
  public static class CowSay extends Thread {
    private String message;

    public CowSay(String m) {
      message = m;
    }

    public void run() {
      System.out.println(this.message);
    }
  }

  public static void main(String[] args) {
    CowSay cow1 = new CowSay("moo!");
    CowSay cow2 = new CowSay("meow!");
    cow1.start();
    cow2.start();
  }
}

