public class FillArrayRange {
  public static void main(String[] args) {
    // filled-array and filled-array-range's parameters
    // refer to the size of the dimensions of the array.
    
    int test[][][][][][] = new int[3][3][2][2][2][2];
    
    for(int i=0; i<3; i++) {
      for(int j=0; j<3; j++) {
        test[i][j][0][0][0][0] = i*j;
      }
    }
    
    System.out.println(test[2][1][0][0][0][0] == 2);
  }
};
