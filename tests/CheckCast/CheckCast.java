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

    public String testCast(B b){
        return b.me();
    }

    public static void main(String[] args){
        CheckCast me = new CheckCast();
        A a = me.new A();
        A b = me.new B();
        B c = (B) b;
        System.out.println(a.me());
        System.out.println(b.me());
        System.out.println(c.me());
        System.out.println(me.testCast((B) b));
        System.out.println(((A) b).me());
    }
}
