class ThreadA extends Thread {

    public int sleepyTime;

    ThreadA(int sleepyTime){
        this.sleepyTime = sleepyTime;
    }

    public void run(){
        System.out.println("ThreadA says, hello.");
        this.sleep(sleepyTime);
        System.out.println("ThreadA says, world.");
    }
}



