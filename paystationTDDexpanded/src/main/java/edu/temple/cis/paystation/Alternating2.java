package edu.temple.cis.paystation;

import java.util.Calendar;

// (weekdays:linear1 + weekend:free)
public class Alternating2 extends Alternating1 {


    public Alternating2(RateStrategy weekdayStrategy, RateStrategy weekendStrategy) {
        super(weekdayStrategy, weekendStrategy);
    }

}
