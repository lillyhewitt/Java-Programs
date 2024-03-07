package edu.temple.cis.paystation;

//  (5c buys two minutes)
public class Linear1 implements RateStrategy {

    public int calculateTime(int amountInserted) {
        //calculating the linear time here
        return (amountInserted * 2) / 5;

    }
}
