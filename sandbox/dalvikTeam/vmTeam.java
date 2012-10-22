public class vmTeam {

	/**
	 * @param args
	 */
	public static void main(String[] args) {
		teamMember[] dalvik = {new teamMember("John"), new teamMember("Emma"), new teamMember("Jennie"),
		new teamMember("Guptha"), new teamMember("Vicenzo")};
		dalvik[0]._knowsJS = true;
		dalvik[1]._knowsJS = true;
		
		for (int i = 0; i < dalvik.length; i++) {
			System.out.println("Team member #" + (i + 1) + ": " + dalvik[i].toString());
		}

	}

}