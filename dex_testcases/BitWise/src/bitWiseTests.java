
public class bitWiseTests {

	/**
	 * @param args
	 */
	public static void main(String[] args) {
		


			   int a = 6; int b = 3; int c = 0;
			   
			   //AND operation =a & b = 2
			   c = a & b;       
			   System.out.println("a & b = " + c );
			   
			   //OR operation =a | b = 7
			   c = a | b;       
			   System.out.println("a | b = " + c );
			   
			   //XOR operation =a ^ b = 5
			   c = a ^ b;     
			   System.out.println("a ^ b = " + c );

			   //NOT operation =~a = -7
			   c = ~a;          
			   System.out.println("~a = " + c );

			   //Shifts the bits of n left p positions.
			   //Zero bits are shifted into the low-order positions.
			   //a << 2 = 24
			   c = a << 2;     
			   System.out.println("a << 2 = " + c );

			   //Shifts the bits of n right p positions. 
			   //If n is a 2's complement signed number, 
			   //the sign bit is shifted into the high-order positions.
			   //a >> 2  = 1
			   c = a >> 2;     
			   System.out.println("a >> 2  = " + c );

			   //Shifts the bits of n right p positions. 
			   //Zeros are shifted into the high-order positions.
			   //a >>> 2 = 1			   
			   c = a >>> 2;     
			   System.out.println("a >>> 2 = " + c );
	}
}
