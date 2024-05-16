package edu.temple.cis.c3238.banksim;

/**
 * @author Cay Horstmann
 * @author Modified by Paul Wolfgang
 * @author Modified by Charles Wang
 * @author Modified by Alexa Delacenserie
 * @author Modified by Tarek Elseify
 */

public class Bank extends Thread{

    public static final int NTEST = 10;
    private final Account[] accounts;
    private long numTransactions = 0;
    private final int initialBalance;
    private final int numAccounts;
    // create variable to check if bank is open
    private boolean open = true;
    private boolean testing = false;


    public Bank(int numAccounts, int initialBalance) {
        this.initialBalance = initialBalance;
        this.numAccounts = numAccounts;
        accounts = new Account[numAccounts];
        for (int i = 0; i < accounts.length; i++) {
            accounts[i] = new Account(i,initialBalance);
        }
        numTransactions = 0;
    }


    public synchronized void transfer(int from, int to, int amount) throws InterruptedException {

        //* task 6: check transferring amount is smaller than account balance
        if(amount > accounts[from].getBalance()){
            try{
                wait();
            }catch(InterruptedException e){}
        }
        //* check if testing is currently happening
        else{
            testingInProgress();
        }
        //System.out.println("Number of Transactions: "+ numTransactions);

        //* transfer the money
        synchronized(accounts[from]){
            synchronized(accounts[to]){
                if (accounts[from].withdraw(amount)) {
                    accounts[to].deposit(amount);
                }
            }

        }
        //numTransactions++;
        //** signal test threads */
        if (shouldTest())
        {
            test();
            System.out.println("Number of Transactions: "+ numTransactions);

        }

            
    }

    public synchronized void test() throws InterruptedException {
        //* signal all threads

        notifyAll();
        //* start testing
        startTest();
        int totalBalance = 0;
        // task 3: create testing thread
        for (Account account : accounts) {
            System.out.printf("%-30s %s%n", 
                    Thread.currentThread().toString(), account.toString());
            totalBalance += account.getBalance();
        }
        System.out.printf("%-30s Total balance: %d\n", Thread.currentThread().toString(), totalBalance);
        if (totalBalance != numAccounts * initialBalance) {
            System.out.printf("%-30s Total balance changed!\n", Thread.currentThread().toString());
            System.exit(0);
        } else {
            System.out.printf("%-30s Total balance unchanged.\n", Thread.currentThread().toString());
        }
       
    }

    // * if shouldTest() is true, create a testing thread
    public void startTest() {
        synchronized(this){
            if(shouldTest()){
                testing = true;
                new Thread (() -> {
                    try {
                        test();
                    } catch (InterruptedException e) {
                        // TODO Auto-generated catch block
                        e.printStackTrace();
                    }
                }).start();

            }
            
        }
    }
    //* func to spin threads while testing is happening and interupt transferring threads
    public void testingInProgress (){
        synchronized(this){
            while(testing){
                try{
                    wait();
                }
                catch(InterruptedException e){
                    Thread.currentThread().interrupt();
                    return;
                }
            }
        }
    }

    public synchronized int getNumAccounts() {
        return numAccounts;
    }
    

    public boolean shouldTest() {
        
        return ++numTransactions % NTEST == 0;
    }

    //* task 5: create functions to check if bank is open or closed
    public synchronized boolean isOpen() { return open;}


    void closeBank() {
        synchronized (this) {
            open = false;
        }
        for(Account account : accounts) {
            synchronized (account) {
                account.notifyAll();
            }
        }
    }
}
