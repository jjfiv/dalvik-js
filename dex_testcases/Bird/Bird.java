
public class Bird {

	public String _name;
	public boolean _canFly;
	public int _yOB;
	
	public Bird(String name, boolean canFly, int yob){
	  _name = name;
	  _canFly = canFly;
	  _yOB = yob;
	}
	
	public boolean isLegal(){
		if (_yOB < 2010) {
			return true;
		} else {
			return false;
		}
	}
	
	public static void main(String[] args) {
		Bird aBird = new Bird("Rexy", true, 2011);
		Raven aRaven = new Raven("Black", true, 2000);

		System.out.println(aBird._name);
		System.out.println(aBird._canFly);
		System.out.println(aBird.isLegal());
		System.out.println(aRaven._name);
		System.out.println(aRaven._canFly);
		System.out.println(aRaven.isLegal());
	}

}
