class CheckCast {

    private class A{
        public String me(){
            return "I am an A";
        }
    }

    public class B extends A{
        public String me(){
            return "I am a B";
        }
    }

    public String testCast(A a){
        return a.me();
    }

    public static void main(String[] args){
        CheckCast me = new CheckCast();
        A a = me.new A();
        B b = me.new B();
        System.out.println(a.me());
        System.out.println(b.me());
        System.out.println(me.testCast((A) b));
        System.out.println(((A) b).me());
    }
}
