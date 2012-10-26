
public class Egg extends Raven{

	public Egg(String name, boolean canFly, int yob){
		super(name, canFly, yob);
	}
	
	public boolean isLegal(){
		return super.isLegal();
	}
}
