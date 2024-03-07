package edu.temple.cis.paystation;

import java.util.Calendar;

public class Alternating1 implements RateStrategy {
    private RateStrategy weekdayStrategy;
    private RateStrategy weekendStrategy;

    // Constructor to initialize strategies
    public Alternating1(RateStrategy weekdayStrategy, RateStrategy weekendStrategy) {
        this.weekdayStrategy = weekdayStrategy;
        this.weekendStrategy = weekendStrategy;

    }

    @Override
    public int calculateTime(int amountInserted) {
        Calendar calendar = Calendar.getInstance();
        int dayOfWeek = calendar.get(Calendar.DAY_OF_WEEK);

        // Use weekendStrategy if it's Saturday or Sunday
        if (dayOfWeek == Calendar.SATURDAY || dayOfWeek == Calendar.SUNDAY) {
            return weekendStrategy.calculateTime(amountInserted);
        } else {
            // Use weekdayStrategy otherwise
            return weekdayStrategy.calculateTime(amountInserted);
        }
    }
}
