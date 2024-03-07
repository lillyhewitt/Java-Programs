package edu.temple.cis.paystation;


import java.util.Scanner;

public class Menu {
    private boolean continueProgram;
    private boolean continueDeposit;
    PayStation ps;

    //simulate the PayStation operation by displaying a menu to allow a customer to select a choice
    public static void main(String[]args) throws IllegalCoinException {
        Menu menu = new Menu();
        menu.run();
    }


    public void run() throws IllegalCoinException {


        // set variable values
        continueProgram = true;
        continueDeposit = true;
        ps = new PayStationImpl();
        String password = "admin123";
        Scanner userInput = new Scanner(System.in);

        // welcome message
        System.out.println("Welcome to the Paystation. Choose an option below.\n");
        while(continueProgram) {
            // display menu options
            System.out.print("\nMenu:\n\t1. Deposit Coins\n\t2. Display\n\t3. Buy Ticket\n\t4. Cancel\n\t5. Admin Options\n\nChoice: ");
            int option = userInput.nextInt();
            userInput.nextLine();

            // deposit coins
            if(option == 1) {
                continueDeposit = true;
                // allow users to enter multiple coins, stop when 0 is inputted
                while(continueDeposit) {
                    System.out.print("\nEnter a coin (0, 5, 10, 25): ");
                    int coinValue = userInput.nextInt();
                    if(coinValue == 0) {
                        continueDeposit = false;
                    }
                    else {
                        ps.addPayment(coinValue);
                    }
                }
            }
            // display
            else if(option == 2) {
               System.out.println("\nYou have " + ps.readDisplay() + " minutes paid for.");

            }
            // buy ticket
            else if(option == 3) {
                System.out.println("\nReceipt\n\tMinutes:\t " + ps.buy().value());
            }
            // cancel
            else if(option == 4) {
                System.out.println();
                System.out.println(ps.cancel());
            }
            // admin menu
            else if(option == 5) {
                // have admin enter password
                System.out.print("\nEnter the password: ");
                String passwordInput = userInput.nextLine();

                // check if password is correct
                if(passwordInput.equals(password)) {
                    // display admin menu
                    System.out.print("\nAdmin Menu:\n\t1. Empty\n\t2. Change Rate Strategy\n\nChoice: ");
                    int adminOption = userInput.nextInt();
                    // empty
                    if (adminOption == 1) {
                        ps.empty();
                        System.out.println("\nEmptied.");
                    }
                    else if (adminOption == 2) {
                          System.out.print("\nSelect a strategy option:\n\t1. Linear1\n\t2. Progressive\n\t3. Alternate1\n\t4. Linear2\n\t5. Alternate2\n\nChoice: ");
                      int strategyOption = userInput.nextInt();
                        switch(strategyOption) {
                            case 0:
                                RateStrategy linear1Strategy = new Linear1();
                                ps.setRateStrategy(linear1Strategy);
                                //linear 1
                                break;
                            case 1:
                                //progressive
                                RateStrategy progressiveStrategy = new Progressive();
                                ps.setRateStrategy(progressiveStrategy);
                                break;
                            case 2:
                                //alternating 1
                                RateStrategy weekdayStrategyForA1 = new Progressive();
                                RateStrategy weekendStrategyForA1 = new Linear1();
                                ps.setRateStrategy(new Alternating1(weekdayStrategyForA1, weekendStrategyForA1));
                                break;
                            case 3:
                                //linear 2
                                RateStrategy linear2Strategy = new Linear2();
                                ps.setRateStrategy(linear2Strategy);
                                break;
                            case 4:
                                RateStrategy weekdayStrategyForA2 = new Linear1(); // Example: Linear1 strategy on weekdays
                                RateStrategy weekendStrategyForA2 = new FreeParkingStrategy(); // Assuming free parking on weekends
                                ps.setRateStrategy(new Alternating2(weekdayStrategyForA2, weekendStrategyForA2));

                                //alternating 2
                                break;
                            case 5: //scenario for free parking
                                RateStrategy freeParkingStrategy = new FreeParkingStrategy();
                                ps.setRateStrategy(freeParkingStrategy);
                                System.out.println("Rate strategy changed to Free Parking.");
                                break;
                            default:
                                System.out.println("invalid strategy option!\n");
                                break;
                        }
                    }

                }
                // if password is wrong, display access denied message
                else {
                    System.out.println("Incorrect password. Access denied.");
                }
            }
            // invalid output
            else {
                System.out.println("Invalid output\n");
            }

            // check if program should continue
            System.out.print("\nWould you like to choose another option (Yes/No): ");
            if(userInput.hasNextLine()) {
                userInput.nextLine();
            }
            String check = userInput.nextLine();
            String continueInput = "Yes";
            if(check.equals(continueInput)) {
                continueProgram = true;
            }
            else {
                continueProgram = false;
            }
        }
        // closing message
        System.out.println("\nThank you for using the paystation");

        userInput.close(); //close the scanner

    } //end of public void run()

} //end of public class Menu()
