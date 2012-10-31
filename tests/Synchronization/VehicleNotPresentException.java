/**
* author: etosch
* date: 08 April 2010
* VehicleNotPresentException.java
*/
public class VehicleNotPresentException extends RuntimeException{

    private String message;

    public VehicleNotPresentException(String vehicleName, String tunnelName){
        this.message=vehicleName+" is not present in tunnel "+tunnelName;
    }

    public String getMessage(){
        return message;
    }
}