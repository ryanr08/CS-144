import java.security.*;
import java.io.*;
import java.util.Scanner;

public class ComputeSHA
{
    public static void main(String[] args) throws IOException
    {
      if (args.length != 1)
      {
          System.out.println("ERROR: Input file must be specified. No other arguments allowed.");
          return;
      }
      String inputFile = args[0];
      String val = "";

      try {
         File f = new File(inputFile);
         FileInputStream fis = new FileInputStream(f);
         byte[] data = new byte[(int) f.length()];
         fis.read(data);
         fis.close();
         val = new String(data, "UTF-8");
         
      } catch (FileNotFoundException e) {
        System.out.println("An error occurred.");
        e.printStackTrace();
      }

      System.out.println(computeHash(val).toString());
    }

    public static String computeHash(String s)
    {
        String hash = new String();
        try{
            MessageDigest md = MessageDigest.getInstance("SHA-256");
            md.update(s.getBytes());
            byte[] digest = md.digest();
            for (byte bytes: digest){
                hash += (String.format("%02x", bytes & 0xff));
            }
        }
        catch (NoSuchAlgorithmException e){
            System.out.println("An error occurred.");
            e.printStackTrace();                
        }
        finally{
            return hash;
        }
    }
}