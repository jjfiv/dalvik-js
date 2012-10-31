/**
* author: etosch
* date: 08 April 2010
* PriorityScheduler.java
*/

import java.util.Collection;
import java.util.LinkedList;
import java.util.HashMap;

public class PriorityScheduler implements Tunnel{
    private static final int MAX_VEHICLE_PRIORITY = 4;
    private Collection basicTunnels;
    private String name;
    private LinkedList[] waitQueue;
    private HashMap vehicleTunnelAssociation = new HashMap();

    public PriorityScheduler(Collection basicTunnels){
        this.basicTunnels=basicTunnels;
        waitQueue = new LinkedList[MAX_VEHICLE_PRIORITY+1];
        for (int i=0;i<=MAX_VEHICLE_PRIORITY;i++)
            waitQueue[i]=new LinkedList<Vehicle>();
        name="PriorityScheduler";
    }

    public boolean tryToEnter(Vehicle vehicle){
        //printState();
        int priority = vehicle.getPriority();
        while(true){
            synchronized(this){
                boolean noHigherPriorities = true;
                //if there are no vehicles waiting with higher priorities:
                for (int i=priority+1; i<=MAX_VEHICLE_PRIORITY; i++)
                    noHigherPriorities = noHigherPriorities && waitQueue[i].size()==0;
                if (noHigherPriorities){
                    for (BasicTunnel t : (Collection<BasicTunnel>)basicTunnels){
                        if(t.tryToEnter(vehicle)){
                            waitQueue[vehicle.getPriority()].remove(vehicle);
                            vehicleTunnelAssociation.put(vehicle, t);
                            return true;
                        }
                    }
                }
            }
            //if the method has not exited because it had entered a tunnel, wait:
            waitOnTunnel(vehicle);
        }
    }//tryToEnter

    private synchronized void waitOnTunnel(Vehicle vehicle){
        int priority = vehicle.getPriority();
        if (!waitQueue[priority].contains(vehicle))
            waitQueue[priority].add(vehicle);
        try{
            wait();
        }catch(InterruptedException ie){
            System.out.println("Vehicle could not wait.");
            //ie.printStackTrace();
        }
    }

    public synchronized void exitTunnel(Vehicle vehicle){
        BasicTunnel t = (BasicTunnel)vehicleTunnelAssociation.remove(vehicle);
        t.exitTunnel(vehicle);
        notifyAll();
    }//exitTunnel

    public String getName(){
        return this.name;
    }

    public void setName(String name){
        this.name=name;
    }

    private void printState(){
        String s ="";
        for (int i=0;i<waitQueue.length;i++){
            s+="\nPriority "+i+"::";
            for (Vehicle v : (LinkedList<Vehicle>)waitQueue[i])
            s+=v.getName()+"\t";
        }
        System.out.println(s);
    }

}//PriorityScheduler