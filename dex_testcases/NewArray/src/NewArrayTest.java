import java.util.*;
public class NewArrayTest {

	/**
	 * @param args
	 */

	public static void main(String[] args) {
		int array[] = new int[5];
	    Arrays.fill(array, 77);
	    for (int i=0, n=array.length; i<n; i++) {
	      System.out.println(array[i]);
	    }
	    
	}
}
