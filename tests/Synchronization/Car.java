import java.util.Collection;

/**
 * A Car is a fast Vehicle.
 */
public class Car extends Vehicle {
    public Car(String name, Direction direction, Collection<Tunnel> tunnels) {
        super(name, direction, tunnels);
    }

    public Car(String name, Direction direction, Tunnel tunnel) {
        super(name, direction, tunnel);
    }

    protected int getDefaultSpeed() {
        return 6;
    }
}