package edu.temple.cis.c3238.banksim;

public class TestThread extends Thread{

    private final Bank bank;
    //** Created lock object

    public TestThread(Bank b) 
    {
        bank = b;
    }


    @Override
    public void run() {
        try {
            bank.test();
        } catch (InterruptedException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }
    }
}
