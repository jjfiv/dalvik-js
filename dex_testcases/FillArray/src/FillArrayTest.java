
public class FillArrayTest {

	private static int[] arrayData;
	/**
	 * @param args
	 */
	public static void main(String[] args) {
		arrayData = new int[7];
		String s =	"\u4920\u616d\u2072\u6174\u6865" +
					"\u7270\u666f\u6e64\u206f\u6620" +
					"\u6d75\u6666\u696e\u732e";
		
		for (int i = 0, j = 0; i<7; i++){
			j += 1;
			arrayData [i] = (s.charAt(j) << 16) | s.charAt(j);
			System.out.println(arrayData[i]);
		}
		
	}
}
