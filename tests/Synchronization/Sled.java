import java.util.Collection;

/**
 * A Sled is a slow Vehicle.
 */
public class Sled extends Vehicle {
    public Sled(String name, Direction direction, Collection<Tunnel> tunnels) {
        super(name, direction, tunnels);
    }

    public Sled(String name, Direction direction, Tunnel tunnel) {
        super(name, direction, tunnel);
    }

    protected int getDefaultSpeed() {
        return 4;
    }
}