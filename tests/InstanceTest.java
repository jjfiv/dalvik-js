class InstanceTest{

    public int someField;

    public InstanceTest(int someField){
        this.someField = someField;
    }

    static {
        System.out.println("Testing static block");
    }

    public static void main (String[] args){
        InstanceTest i = new InstanceTest(10);
        System.out.println(i instanceof InstanceTest);
        System.out.println(i instanceof Object);
    }
}
