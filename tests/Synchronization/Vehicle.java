import java.util.*;

/**
 * A Vehicle is a Runnable which enters tunnels. You must subclass
 * Vehicle to customize its behavior (e.g., Car and Sled).
 *
 * When you start a thread which runs a Vehicle, the Vehicle will
 * immediately begin trying to enter the tunnel or tunnels passed into
 * its constructor by calling tryToEnter on each Tunnel instance. As
 * long as tryToEnter returns false (indicating that the Vehicle did
 * not enter that tunnel), the Vehicle will keep trying. This is
 * called busy-waiting.
 *
 * In addition to recreating the constructors, the only method that
 * you must override in Vehicle subclasses is getDefaultSpeed. This
 * instance method is called from the private init method, and the
 * integer that it returns is used as the speed for the vehicle.
 */
public abstract class Vehicle implements Runnable {
    private String             name;
    private Direction          direction;
    private Collection<Tunnel> tunnels;
    private int                priority;
    private int                speed;

    /**
     * Initialize a Vehicle; called from Vehicle constructors.
     */
    private void init(String name, Direction direction,
                      Collection<Tunnel> tunnels, int priority) {
        this.name      = name;
        this.direction = direction;
        this.tunnels   = tunnels;
        this.priority  = 0;
        this.speed     = getDefaultSpeed();

        if(this.speed < 0 || this.speed > 9) {
            throw new RuntimeException("Vehicle has invalid speed");
        }
    }

    /**
     * Override in a subclass to determine the speed of the
     * vehicle.
     *
     * Must return a number between 0 and 9 (inclusive). Higher
     * numbers indicate greater speed. The faster a vehicle, the less
     * time it will spend in a tunnel.
     */
    protected abstract int getDefaultSpeed();

    /**
     * Create a Vehicle with default priority that can cross one of
     * a collection of tunnels.
     * 
     * @param name      The name of this vehicle to be displayed in the
     *                  output.
     * @param direction The side of the tunnel being entered.
     * @param tunnels   A collection of tunnels that are available to
     *                  cross.
     */
    public Vehicle(String name, Direction direction,
                   Collection<Tunnel> tunnels) {
        init(name, direction, tunnels, 0);
    }
  
    /**
     * Create a Vehicle with default priority that can cross only one
     * tunnel.
     * 
     * @param name      The name of this vehicle to be displayed in the
     *                  output.
     * @param direction The side of the tunnel being entered.
     * @param tunnel    A single tunnel that can be crossed.
     */
    public Vehicle(String name, Direction direction, Tunnel tunnel) {
        ArrayList<Tunnel> tunnels = new ArrayList<Tunnel>();
        tunnels.add(tunnel);
        init(name, direction, tunnels, 0);
    }
    
    /** 
     * Sets this vehicle's priority - used for priority scheduling
     *
     * @param priority The new priority (between 0 and 4 inclusive)
     */
    public final void setPriority(int priority) {
        if(priority < 0 || priority > 4) {
            throw new RuntimeException("Invalid priority: " + priority);
        }
        this.priority = priority;
    }
    
    /**
     * Returns the priority of this vehicle
     *
     * @return This vehicle's priority.
     */
    public int getPriority() {
        return priority;
    }

    /**
     * Returns the name of this vehicle
     *
     * @return The name of this vehicle
     */
    public final String getName() {
        return name;
    }

    /**
     * By default, a vehicle returns its name when you transform it
     * into a string.
     *
     * @return Name of the vehicle
     */
    public String toString() {
        return getName();
    }
    
    /**
     * Find and cross through one of the tunnels.
     * 
     * When a thread is run, it keeps looping through its collection
     * of available tunnels until it succeeds in entering one of
     * them. Then, it will call doWhileInTunnel (to simulate doing
     * some work inside the tunnel, i.e., that it takes time to cross
     * the tunnel), then exit that tunnel.
     */
    public final void run() {
        // Loop over all tunnels repeated until we can enter one, then
        // think inside the tunnel, exit the tunnel, and leave this
        // entire method.
        //
        while(true) {
            for(Tunnel tunnel : tunnels) {
                if(tunnel.tryToEnter(this)) {
                    doWhileInTunnel();
                    tunnel.exitTunnel(this);
                    return; // done, so leave the whole function
                }
            }
        }
    }
    
    /**
     * Returns the direction of this vehicle
     *
     * @return the direction of this vehicle
     */
    public final Direction getDirection() {
        return direction;
    }

    /**
     * This is what your vehicle does while inside the tunnel to
     * simulate taking time to "cross" the tunnel. The faster your
     * vehicle is, the less time this will take.
     */
    private final void doWhileInTunnel() {
         try {
             Thread.sleep((10 - speed) * 100);
         } catch(InterruptedException e) {
             System.err.println("Interrupted vehicle " + getName());
         }
    }
}