
public class WideMathWithLoop {

	/**
	 * @param args
	 */
	public static void main(String[] args) {
		// TODO Auto-generated method stub
		//int x= 15;
		int y = 40;
		int z = 0;
		
		for(int x=15;x<=16; x++){
			//addition
			z = x +y;
			System.out.println("Sum of entered integers = "+z);
			
			//subtraction
			int s = 0;
			s = y -x;
			System.out.println("Subtraction of entered integers = "+s);
			
			//multiple
			int m = 0;
			m = x * y;
			System.out.println("Multiple integers = "+m);
			
			//divide
			int d = 0;
			d = y / x;
			System.out.println("Divide integers = "+d);
		}

	}

}
