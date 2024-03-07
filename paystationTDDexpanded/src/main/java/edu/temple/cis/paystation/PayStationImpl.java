package edu.temple.cis.paystation;
import java.util.*;
import edu.temple.cis.paystation.RateStrategy;

/**
 * Implementation of the pay station.
 *
 * Responsibilities:
 *
 * 1) Accept payment; 
 * 2) Calculate parking time based on payment; 
 * 3) Know earning, parking time bought; 
 * 4) Issue receipts; 
 * 5) Handle buy and cancel events.
 *
 * This source code is from the book "Flexible, Reliable Software: Using
 * Patterns and Agile Development" published 2010 by CRC Press. Author: Henrik B
 * Christensen Computer Science Department Aarhus University
 *
 * This source code is provided WITHOUT ANY WARRANTY either expressed or
 * implied. You may study, use, modify, and distribute it for non-commercial
 * purposes. For any commercial use, see http://www.baerbak.com/
 */
public class PayStationImpl implements PayStation {
    private RateStrategy rateStrategy;

    private int insertedSoFar, timeBought, totalMoney;

    private Map<Integer, Integer> coinMap;
    private int dimeAmount;
    private int nickelAmount;
    private int quarterAmount;
    private int zeroAmount;

    // Constructor initializes instance variables
    public PayStationImpl(){
        insertedSoFar = timeBought = totalMoney = 0;
        coinMap = new HashMap<>();
        dimeAmount = 0;
        nickelAmount = 0;
        quarterAmount = 0;
        zeroAmount = 0;
    }
    public void setRateStrategy(RateStrategy strategy) {
        this.rateStrategy = strategy;
    }
    @Override
    public void addPayment(int coinValue)
            throws IllegalCoinException {

        switch (coinValue) {
            case 0:
                zeroAmount++;
                break;
            case 5:
                nickelAmount++;
                break;
            case 10:
                dimeAmount++;
                break;
            case 25:
                quarterAmount++;
                break;
            default:
                throw new IllegalCoinException("Invalid coin: " + coinValue);
        }

        /*
         * getOrDefault checks if a given key is present in a map
         * @returns the value if it exists, or the 'defaultValue' if it does not
         * add 1 to whatever the result of getOrDefault is and place that value in the map
         */
        coinMap.put(coinValue, coinMap.getOrDefault(coinValue, 0) + 1);

        insertedSoFar += coinValue;
        timeBought = insertedSoFar / 5 * 2;
    }

    @Override
    public int readDisplay() {
        return timeBought;
    }

    @Override
    public Receipt buy() {
        Receipt r = new ReceiptImpl(timeBought);
        totalMoney += insertedSoFar;
        reset();
        return r;
    }

    @Override
    public Map<Integer, Integer> cancel() 
    {
        Map<Integer, Integer> tempMap = coinMap;
        coinMap = new HashMap<>();

        // adds a key with amount of each coin if that coin is present
        if(nickelAmount > 0) {
            tempMap.put(5, nickelAmount);
        }
        if(dimeAmount > 0) {
            tempMap.put(10, dimeAmount);
        }
        if(quarterAmount > 0) {
            tempMap.put(25, quarterAmount);
        }
        // adds none if no coins are present
        if((nickelAmount == 0) && (dimeAmount == 0) && (quarterAmount == 0)) {
            tempMap.put(0, 0);
        }

        reset();
        return tempMap;
    }
    
    private void reset() {
        timeBought = insertedSoFar = 0;
        nickelAmount = 0;
        dimeAmount = 0;
        quarterAmount = 0;
        coinMap.clear();
    }
    
    @Override
    public int empty()
    {
        int temp = totalMoney;
        totalMoney = 0;
        return temp;
    }
}
