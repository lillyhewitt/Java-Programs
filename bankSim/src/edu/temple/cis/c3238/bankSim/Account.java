package edu.temple.cis.c3238.banksim;

import java.util.concurrent.locks.ReentrantLock;

/**
 * @author Cay Horstmann
 * @author Modified by Paul Wolfgang
 * @author Modified by Charles Wang
 * @author Modified by Alexa Delacenserie
 * @author Modified by Tarek Elseify
 */
public class Account {

    private volatile int balance;
    private final int id;
    // create bank variable

    //private Bank myBank;

    public Account( int id, int initialBalance) {
        this.id = id;
        this.balance = initialBalance;
    }

    public int getBalance() {
        return balance;
    }

    // consumer
    public synchronized boolean withdraw(int amount) {
        if (amount <= balance) {
            int currentBalance = balance;
            // Thread.yield(); // Try to force collision
            int newBalance = currentBalance - amount;
            balance = newBalance;
            return true;
        } else {
            return false;
        }
    }

    // producer
    public synchronized void deposit(int amount) {
        int currentBalance = balance;
        Thread.yield();   // Try to force collision
        int newBalance = currentBalance + amount;
        balance = newBalance;
        notifyAll();

    }
        // checks if amount being transfered it greater than the amount in the account
    public synchronized void waitForSufficientFunds(int amount) {
        while(amount > balance) {
            try {
                // wait until balance is equal or larger than the amount transferring
                wait();
            }
            catch(InterruptedException ex) {}
        }

    }
    @Override
    public String toString() {
        return String.format("Account[%d] balance %d", id, balance);
    }
}
