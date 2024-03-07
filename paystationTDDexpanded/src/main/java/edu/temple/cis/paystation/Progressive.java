package edu.temple.cis.paystation;

public class Progressive implements RateStrategy {
    @Override
    public int calculateTime(int amountInserted) {
        final int firstHourRate = 2; // 5 cents buy 2 minutes
        final int secondHourRate = 3; //10 cents buys 3 minutes for the second houe
        final int thirdHourRate = 5; //beyond two hours

        int time = 0;
        if(amountInserted < 150) {
            time = (amountInserted * firstHourRate) /5;
        } else if (amountInserted <= 350) {
           time = 60;
           time += ((amountInserted - 150) * 3) / 10;
        } else {
            time = 60 + (200 * secondHourRate) / 10;
            time += ((amountInserted - 350)  * thirdHourRate) / 5;
        }
        return time;
    }
}
