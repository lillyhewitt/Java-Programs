# BankSim


![UML_BANKSIM](https://github.com/cis3296s24/banksim-05-john-hewitt/assets/49101663/bb34ccd0-3e6b-4a63-b8b9-e7ca7755c222)
=======
# UML Diagram for Bank Simulator:
![UML_BANKSIM](https://github.com/cis3296s24/banksim-05-john-hewitt/assets/49101663/f50b70c6-9ad8-43e9-bf39-08951ce91e2b)

# Sequence Diagram for Race Condition in BankSim
![BankSimSequenceDiagram](https://github.com/cis3296s24/banksim-05-john-hewitt/assets/49101663/df6abf65-6e2c-4913-8dd7-287b28dd89c2)

This is the Sequence Diagram for Bank Sim:

A race condition occurs when two or more threads attempt to access and modify the total amount in one bank account. 

For example, if two threads are created in the BankSimMain.java file and then thread1 begins execution with $1000 in the bank account transfers $200 to another account, but thread2 then interrupts thread1’s execution, a race condition occurs. If thread2 interrupts the execution of thread1 and attempts to transfer $300 from the same bank account as thread1 to a different account, both threads modify the same bank account at virtually the same time since they are accessing and modifying the same total bank amount. 

Thus, thread2 running fully will result in $700 in the original bank account, which will be then overwritten when thread1 finishes execution, saving the total amount as $800, causing thread2’s behavior to never be saved. If thread1 interrupts thread2’s execution before withdrawing, thread1 modifies the bank account to $800, but thread2’s execution will then result in the bank account becoming $700, validating that the result of the final bank account after both threads terminate is based on which runs first.
