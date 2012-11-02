public class tryingAndCatching {

	public int [] myArr;
	private int ind = 0;
	public String arrName;
	private boolean full;
	
	public tryingAndCatching(int size, String name) {
		myArr = new int[size];
		arrName = name;
		if (size > 0) {
			full = false;
		} else {
			full = true;
		}
	}
	
 	public boolean isFull() {
 		if (ind == myArr.length && !full) {
 			full = true;
 		} 		
 		return full;
 	}
	
	public void addToArr (int val) throws Banana {
 	 	if (!(isFull())) {
			myArr[ind] = val;
			ind++;
		} else {
			throw new Banana();
		}
	}
	
	public String toString(){
		if (isFull()) {
			return "I'm so full!!";
		} else {
			return "Stil got room in me";
		}
	}
	
	
	
	public static void main(String[] args) {		
		tryingAndCatching tac1 = new tryingAndCatching(0, "Yarr");
		tryingAndCatching tac2 = new tryingAndCatching(3, "Yarr!!");
		try {
			tac1.addToArr(4);
			System.out.println("Trying to get here");
		} catch (Banana e) {
			System.out.println(e);
		}
		
		try {
			tac2.addToArr(0);
			tac2.addToArr(1);
			//tac2.addToArr(2);
			//tac2.addToArr(3);
		} catch (Banana e) {
			System.out.println(e);
		}
		
		
		System.out.println(tac1.toString());
		System.out.println(tac2.toString());
	}

}

