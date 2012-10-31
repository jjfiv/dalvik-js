/**
* author: etosch
* date: 08 April 2010
* UnidentifiedVehicleException.java
*/
public class UnidentifiedVehicleException extends RuntimeException{

    private String message;

    public UnidentifiedVehicleException(){
        this.message="Unexpected vehicle type ";
    }

    public UnidentifiedVehicleException(String name){
        this();
        this.message+=name;
    }

    public String getMessage(){
        return message;
    }

}