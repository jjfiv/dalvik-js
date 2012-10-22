public class teamMember {
	String _name;
	boolean _knowsJS;
	
	public teamMember (String name) {
		_name = name;
		_knowsJS = false;
	}

	public String toString() {
		if (this._knowsJS) {
			return (_name + " knows JavaScript");
		} else {
			return (_name + " doesn't know JavaScript");
		}
	}
}
