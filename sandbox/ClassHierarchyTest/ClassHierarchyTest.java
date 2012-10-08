public class ClassHierarchyTest {		
			
		String birdName;
		Boolean canFly;
		
		public ClassHierarchyTest(String name, Boolean flight){
			this.birdName = name;
			this.canFly = flight;
		}
		
		public String toString(){
			
			String str;
			str = "The bird " + birdName + " can";
			if (canFly == false) {
				str = str + "not";
			}
			
			str = str + " fly";
			
			return str;
		}
				
		public static class Penguin extends ClassHierarchyTest{
			
			public Penguin(String name){
				super(name, false);
			}
		}
		
	public static void main (String [] args){
		ClassHierarchyTest eagle = new ClassHierarchyTest("rexy", true);
		ClassHierarchyTest pingy = new Penguin("pingu");
		
		System.out.println(eagle.toString());
		System.out.println(pingy);
		
	}

}