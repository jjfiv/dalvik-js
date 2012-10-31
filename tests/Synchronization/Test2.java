/**
* author: etosch
* date: 08 April 2010
* Test2.java
*/

import java.util.LinkedList;
import java.util.Collection;

public class Test2{
    public static void main(String[] args){
        LinkedList<BasicTunnel> tunnels = new LinkedList<BasicTunnel>();
        for (int i=0;i<2;i++)
            tunnels.add(new BasicTunnel(new Integer(i).toString()));
        PriorityScheduler p = new PriorityScheduler((Collection)tunnels);
        LinkedList<Vehicle> vehicles = new LinkedList<Vehicle>();

        for (int i=0;i<50;i++){
            Car c = new Car(i+"-Car", getDirection(i), p);
            c.setPriority(i%5);
            vehicles.add(c);
            //new Thread(c).start();
        }

        for (int i=0;i<50;i++){
            Sled s = new Sled((i+150)+"-Sled", getDirection(i), p);
            s.setPriority(i%5);
            vehicles.add(s);
            //new Thread(s).start();
        }

        for (int i=50;i<150;i++){
            Car c = new Car(i+"-Car", getDirection(i), p);
            c.setPriority(i%5);
            vehicles.add(c);
            //new Thread(c).start();
        }

        for (Vehicle v : vehicles)
            new Thread(v).start();
    }

    private static Direction getDirection(int vehicleNum) {
        return vehicleNum % 2 == 0 ? Direction.NORTH : Direction.SOUTH;
    }
}