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

package edu.temple.cis.paystation;
import java.util.HashMap;

public class PayStationImpl implements PayStation {
    
    private int insertedSoFar;
    private int timeBought;
    private int currentTransactionAmount;
    private int dimeAmount;
    private int nickelAmount;
    private int quarterAmount;
    private int totalAmount;
    private HashMap<Integer, Integer> coinMap = new HashMap<Integer, Integer>();

    @Override
    public void addPayment(int coinValue)
            throws IllegalCoinException {
        switch (coinValue) {
            case 5:
		    nickelAmount++;
            if(coinMap.containsKey(5)){
                int num = coinMap.get(5);
                num++;
                coinMap.put(5, num);
            }else{
                coinMap.put(5, 1);
            }
		    break;
            case 10: 
		    dimeAmount++;
            if(coinMap.containsKey(10)){
                int num = coinMap.get(10);
                num++;
                coinMap.put(10, num);
            }else{
                coinMap.put(10, 1);
            }
		    break;
            case 25:
		    quarterAmount++;
            if(coinMap.containsKey(25)){
                int num = coinMap.get(25);
                num++;
                coinMap.put(25, num);
            }else{
                coinMap.put(25, 1);
            }
		    break;
            default:
                throw new IllegalCoinException("Invalid coin: " + coinValue);
        }
        insertedSoFar += coinValue;
        totalAmount += coinValue;
	    currentTransactionAmount = coinValue;
        timeBought = insertedSoFar / 5 * 2;
    }

    // returns how much time is bought with inputted coins
    @Override
    public int readDisplay() {
        return timeBought;
    }

    // creates receipt for paystation and clears map
    @Override
    public Receipt buy() {
        Receipt r = new ReceiptImpl(timeBought);

        // resets paystation for new transaction
        reset();

        // clears Map and resets amount of coins
        coinMap.clear();
        nickelAmount = 0;
        dimeAmount = 0;
        quarterAmount = 0;

        return r;
    }

    // cancels present transaction and returns map of coins inputted
    @Override
    public HashMap<Integer, Integer> cancel() {
	    // cancel present transaction
	    insertedSoFar -= currentTransactionAmount;
        totalAmount -= currentTransactionAmount;

	    // creates an empty map to define coins returned to the user
        HashMap<Integer, Integer> cancelledCoinMap = new HashMap<Integer, Integer>();

	    // adds a key with amount of each coin if that coin is present
        if(nickelAmount > 0) {
                cancelledCoinMap.put(5, nickelAmount);
        }
        if(dimeAmount > 0) {
                cancelledCoinMap.put(10, dimeAmount);
        }
        if(quarterAmount > 0) {
		        cancelledCoinMap.put(25, quarterAmount);
        }
	    // adds none if no coins are present
        if((nickelAmount == 0) && (dimeAmount == 0) && (quarterAmount == 0)) {
                cancelledCoinMap.put(0, 0);
        }
	
	    // resets paystation for new transaction
	    reset();

        // clears Map and resets amount of coins
        coinMap.clear();
        nickelAmount = 0;
        dimeAmount = 0;
        quarterAmount = 0;

	    // returns map defining coins returned to user
        return cancelledCoinMap;
    }

    // resets variables to 0
    private void reset() {
        timeBought = insertedSoFar = 0;
    }

    @Override
    // returns the total amount of money collected by the PayStation since the last call and empties it, setting the total to zero
    public int empty(){
        // finds total amount of money collected by PayStation
        int money = totalAmount;
        
	    // empty the total amount (set amount to 0)
	    totalAmount = 0;
	
	    // returns total money collected by PayStation
	    return money;
    }

    // returns Map of paystation coins
    @Override
    public HashMap<Integer, Integer> readMap(){
        return coinMap;
    }
}
