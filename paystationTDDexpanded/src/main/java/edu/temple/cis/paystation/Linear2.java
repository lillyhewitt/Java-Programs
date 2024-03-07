package edu.temple.cis.paystation;

// (5c buy 1 minute)
public class Linear2 implements RateStrategy {

   public int calculateTime(int amountInserted) {
       return (amountInserted) / 5;

    }
}
