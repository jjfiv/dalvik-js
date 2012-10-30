
public class Raven extends Bird {

	public Raven(String name, boolean canFly, int yob) {
		super(name, canFly, yob);
	}	
	
	public boolean isLegal(){
		return super.isLegal();
	}
}
