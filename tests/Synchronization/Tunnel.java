/**
 * A Tunnel is an object which can be entered by vehicles. Vehicles
 * themselves are responsible for indicating when they want to enter
 * and when they are ready to leave. Tunnels are responsible for
 * indicating if it is safe for a Vechicle to enter.
 *
 * When a Vehicle wants to enter a Tunnel, it calls tryToEnter on the
 * Tunnel instance. If the Vehicle has entered the Tunnel
 * successfully, tryToEnter returns true. Otherwise, tryToEnter
 * returns false. The Vehicle simulates the time spent in the tunnel,
 * and then must call exitTunnel on the same Tunnel instance it
 * entered.
 */
public interface Tunnel {
    /**
     * Vehicle tries to enter a tunnel.
     *
     * @param  vehicle The vehicle that is attempting to enter
     * @return true if the vehicle was able to enter, false otherwise
     */
    public boolean tryToEnter(Vehicle vehicle);
    
    /**
     * Vehicle exits the tunnel.
     * 
     * @param vehicle The vehicle that is exiting the tunnel
     */
    public void exitTunnel(Vehicle vehicle);

    /**
     * Sets the name of this tunnel
     *
     * @param name The name of this tunnel
     */
    public void setName(String name);

    /**
     * Returns the name of this tunnel
     *
     * @return The name of this tunnel
     */
    public String getName();
}