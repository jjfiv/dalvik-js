class ThreadA extends Thread {
  public void run(){
    Monitors k = new Monitors();
    k.printThings("a1", "a2");
  }
}


