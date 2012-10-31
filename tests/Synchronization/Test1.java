/**
* author: etosch
* date: 22 March 2010
* Test1.java
*/

import java.util.LinkedList;
import java.util.Collection;

public class Test1{

    public static void main(String[] args){

        LinkedList<BasicTunnel> tunnels = new LinkedList<BasicTunnel>();

        for (int i=0;i<4;i++)
            tunnels.add(new BasicTunnel(new Integer(i).toString()));

        for (int i=0;i<50;i++)
            new Thread(new Car(i+"-Car", getDirection(i), (Collection)tunnels)).start();
        for (int i=0;i<50;i++)
            new Thread(new Sled((i+150)+"-Sled", getDirection(i), (Collection)tunnels)).start();
        for (int i=50;i<150;i++)
            new Thread(new Car(i+"-Car", getDirection(i), (Collection)tunnels)).start();
    }

    //method taken from Ross's comments
    private static Direction getDirection(int vehicleNum) {
        return vehicleNum % 2 == 0 ? Direction.NORTH : Direction.SOUTH;
    }
}