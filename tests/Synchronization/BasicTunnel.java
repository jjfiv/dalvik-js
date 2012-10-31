/**
* author: etosch
* date: 22 March 2010
* BasicTunnel.java
*/

import java.util.LinkedList;

public class BasicTunnel implements Tunnel{
    private static final int MAX_CARS_IN_TUNNEL = 3;
    private String name;
    private Direction direction = Direction.NORTH;
    private Sled sled = null; //changed from a boolean
    private LinkedList<Car> cars = new LinkedList<Car>();

    public BasicTunnel(String name){
        this.name=name;
    }

    public boolean tryToEnter(Vehicle vehicle){
    //synchronized on critical sections, rather than locking
    //shared objects
        if (vehicle instanceof Sled){
            synchronized(this){
                if (cars.size()==0 && sled==null){
                    sled=(Sled)vehicle;
                    printStatus(vehicle, "entered");
                    return true;
                }
            }
        }else if (vehicle instanceof Car){
            if (direction.equals(vehicle.getDirection())){
                synchronized(this){
                    if (cars.size()<MAX_CARS_IN_TUNNEL && sled==null){
                    cars.add((Car)vehicle);
                    printStatus(vehicle, "entered");
                    return true;
                    }
                }
            }else{
            synchronized(this){
                if (cars.size()==0 && sled==null){
                    this.direction=vehicle.getDirection();
                    cars.add((Car)vehicle);
                    printStatus(vehicle, "entered");
                    return true;
                }
            }
            }
        }else throw new UnidentifiedVehicleException(vehicle.getClass().getName());
        return false;
    }//tryToEnter

    public void printStatus(Vehicle vehicle, String dir){
        System.out.println(vehicle.getName()+" has "+dir+" "+getName()
                   +" traveling in direction "+vehicle.getDirection()
                   +" with priority "+vehicle.getPriority());
    }//printStatus


    public void exitTunnel(Vehicle vehicle){
    //synchronized on individual blocks, rather than on
    //the entire method
        if (vehicle instanceof Sled){
            synchronized(this){
                if ((Sled)vehicle==sled){
                    sled=null;
                    printStatus(vehicle, "exited");
                }else throw new VehicleNotPresentException(vehicle.getClass().getName(), this.getName());
            }
        }else if (vehicle instanceof Car){
            synchronized(this){
                if (!cars.remove(vehicle))
                    throw new  VehicleNotPresentException(vehicle.getClass().getName(), this.getName());
                printStatus(vehicle, "exited");
            }
        }else throw new UnidentifiedVehicleException(vehicle.getClass().getName());
    }//exitTunnel

    public void setName(String name){
        this.name=name;
    }

    public String getName(){
        return this.name;
    }

}//BasicTunnel