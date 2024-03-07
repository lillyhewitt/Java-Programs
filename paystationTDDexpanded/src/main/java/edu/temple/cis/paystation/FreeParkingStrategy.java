package edu.temple.cis.paystation;

public class FreeParkingStrategy implements RateStrategy {
    @Override
    public int calculateTime(int amountInserted) {
        return 0; //free parking - no time calculated
    }
}
