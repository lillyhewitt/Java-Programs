Now that you have the JAVA class source code to implement the PayStation application. Each class has been tested using the JUnit testing tool. Now you’ll put all the pieces together to complete a final product. In this lab assignment, you are required to develop a main program to demo to the clients how the product works.

A main() program should be developed to simulate the PayStation operation. It displays a menu to allow a customer to select a choice:

Deposit Coins
-Display
-Buy Ticket
-Cancel
-Empty (Admin)
-Change Rate Strategy (Admin)
-A maintenance worker may select the Admin menu options to empty the PayStation or Change Rate Strategy while the PayStation system is running. When Change Rate Strategy is chosen, a submenu will show different city names with their respective rate strategies. 

The simulation software should show the following features:

-accept coins for payment(5, 10, 25 cents)
-show time bought on display.
-when a parking ticket is bought, prints a receipt with parking time.
-when a transaction is canceled, prints the returned coins’ values and number of each coin type.
-Implement rate strategies for five clients:
  -Linear1 rate for Alphatown (5c buys two minutes)
  -Progressive rate for Betatown (see below)
  -Alternating1 rate for Gammatown (weekdays:progressive + weekend:linear1 ).
  -Linear2 rate for Deltatown (5c buy 1 minute)
  -Alternating2 rate for Omegatown (weekdays:linear1 + weekend:free).
-Rate strategy selections and changes can be done on the fly, i.e. at run-time. The default rate strategy is linear1 (Alphatown) rate.
-Alternating rate is a hybrid rate depending on the day of the week. Linear1 rate applies on weekends and progressive rate applies on weekdays.
  -To get extra credit:  account for weekend rollover (if a user enters coins at 11:30pm on Sunday, the first 30 minutes use linear rate, and any further coins use progressive rate).  Don’t worry about splitting coins (quarter entered at 11:55pm can give 10 minutes according to linear rate).
  -Java’s Calendar class provides a good starting point for this requirement.
  -Calendar’s set() will be helpful for testing purposes.

UML Diagram
![UMLpaystation](https://github.com/lillyhewitt/Java-Programs/assets/70710764/493c3859-4274-4949-8685-92e0410d144b)
