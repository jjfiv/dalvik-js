class ThreadTest {
    /*
     * First test : just run ThreadB and make sure that our system works.
     *
     */
    public static void main(String[] args){
        //ThreadA a = new ThreadA(5);
        ThreadB b = new ThreadB();
        //a.start();
        b.start();
    }
}
