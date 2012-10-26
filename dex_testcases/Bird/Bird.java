
public class Bird {

	public String _name;
	public Boolean _canFly;
	
	public Bird(String name, Boolean canFly){
	  _name = name;
	  _canFly = canFly;
	}
	
	public static void main(String[] args) {
		Bird aBird = new Bird("Rexy", true);
		Raven aRaven = new Raven("Black", true);

		System.out.println(aBird._name);
		System.out.println(aBird._canFly);
		System.out.println(aRaven._name);
		System.out.println(aRaven._canFly);
	}

}
