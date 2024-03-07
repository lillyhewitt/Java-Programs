Follow the recommendations of your TA for which Java IDE to use. Then use git on the command line or GitHub Desktop to clone the paystation git repository you created in Part I in your local workspace.

Get more information about the project here: PayStation.pdfDownload PayStation.pdf

Coding Requirements: Make the following modifications to the PayStation:

All development should follow TDD.  Commit to the repository after each test is added and when each test passes. Alternate team members between each task, this should be visible in the git commit log. (This is one important goal of this assignment!  Many points will be deduced if the git commit log does not show alternating contributions from each team member.)

Add a method int empty() that returns the total amount of money collected by the PayStation since the last call and empties it, setting the total to zero. Note that money is only collected after a call to buy.
Change the requirements for (cancel) to the following:
/** Cancel the present transaction. Resets the paystation for a 
* new transaction. 
* @return A Map defining the coins returned to the user. 
* The key is the coin type and the associated value is the 
* number of these coins that are returned. 
* The Map object is never null even if no coins are returned. 
* The Map will only contain only keys for coins to be returned. (If you enter two dimes and a nickle, you should get back two dimes and a nickle, not a quarter.)
* The Map will be cleared after a cancel or buy. 
*/
 
Map<Integer, Integer> cancel(); 

There should be the following test cases:
1. Call to empty returns the total amount entered.
2. Canceled entry does not add to the amount returned by empty.
3. Call to empty resets the total to zero.
4. Call to cancel returns a map containing one coin entered.
5. Call to cancel returns a map containing a mixture of coins entered. ( Entering 10c, 10c and 5c then pressing cancel is returning 2x10c and 1x5c and really not returning 1x25c)
6. Call to cancel returns a map that does not contain a key for a coin not entered.
7. Call to cancel clears the map.
8. Call to buy clears the map.
9. All team members should participate in coding. (Visible by commit author)
