
class Recurse {

	/**
	 * @param args
	 * @return
	 */
	public static void main(String[] args) {

		Loop f = new Loop();

		System.out.println(f.fact(3));

		System.out.println(f.fact(5));

		System.out.println(f.fact(7));

	}
}

  class Loop {

	int fact(int n) {

		int result;

		if (n == 1)
			return 1;

		result = fact(n - 1) * n;

		return result;

	}
}

