package edu.temple.cis.c3238.banksim;
/**
 * @author Cay Horstmann
 * @author Modified by Paul Wolfgang
 * @author Modified by Charles Wang
 * @author Modified by Alexa Delacenserie
 * @author Modified by Tarek Elseify
 */
class TransferThread extends Thread {

    private final Bank bank;
    private final int fromAccount;
    private final int maxAmount;
    //** Created lock object

    public TransferThread(Bank b, int from, int max) 
    {
        bank = b;
        fromAccount = from;
        maxAmount = max;
    }


    @Override
    public void run() {
        //! lock critcal section 
        for (int i = 0; i < 100; i++) 
        {
            int toAccount = (int) (bank.getNumAccounts() * Math.random());
            int amount = (int) (maxAmount * Math.random());
            try {
                bank.transfer(fromAccount, toAccount, amount);
            } catch (InterruptedException e) {
                // TODO Auto-generated catch block
            }
          
        }
        //? once done UNLOCK crtical section

        // task 5: close bank once a thread finishes execution
        bank.closeBank();

        System.out.printf("%-30s Account[%d] has finished with its transactions.\n", Thread.currentThread().toString(), fromAccount);
    }
}
