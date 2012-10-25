class testSeveralMethods {

    public static void staticMethod1(){
        System.out.println("This is a static and fruitless method with no args.");
    }
    public void instanceMethod1(){
        System.out.println("This is a fruitless instance method with no args.");
    }
    public static int staticMethod2(){
        System.out.println("This is a fruitful static method with no args.");
        return 1;
    }
    public int instanceMethod2(){
        System.out.println("This is a fruitful instance method with no args.");
        return 2;
    }
    public static void staticMethod1(int i){
        System.out.println("This is an overloaded static fruitless method with one arg.");
    }
    public void instanceMethod1(int i){
        System.out.println("This is an overloaded fruitless instance method with one arg.");
    }
    public static int staticMethod2(int i){
        System.out.println("This is an overloaded fruitful static method with one arg.");
        return i;
    }
    public int instanceMethod2(int i){
        System.out.println("This is an overloaded fruitful instance method with one arg.");
        return i;
    }
    public static void main(String[] args){
        testSeveralMethods dude = new testSeveralMethods();
        staticMethod1();
        dude.instanceMethod1();
        int i = staticMethod2();
        int j = dude.instanceMethod2();
        staticMethod1(i);
        dude.instanceMethod1(j);
        int k = staticMethod2(i+j);
        int l = dude.instanceMethod2(k);
        System.out.println(l==3);
    }
}