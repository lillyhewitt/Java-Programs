```mermaid
sequenceDiagram
    participant User
    participant Client
    participant Index
    participant CommandHandler
    participant EventListener
    participant Database

    User->>Index: Start Bot
    activate Index
    Index->>Client: Initialize Client
    activate Client
    Client->>CommandHandler: Load Commands
    activate CommandHandler
    CommandHandler->>Database: Retrieve Command Data
    activate Database
    Database-->>CommandHandler: Command Data Loaded
    deactivate Database
    CommandHandler-->>Client: Commands Ready
    deactivate CommandHandler

    Client->>EventListener: Register Events
    activate EventListener
    EventListener->>Database: Retrieve Event Data
    activate Database
    Database-->>EventListener: Event Data Loaded
    deactivate Database
    EventListener-->>Client: Events Registered
    deactivate EventListener

    User->>Client: Trigger Command (/bet)
    activate Client
    Client->>CommandHandler: Handle Command
    activate CommandHandler
    CommandHandler->>Database: Update User Data
    activate Database
    Database-->>CommandHandler: User Data Updated
    deactivate Database
    CommandHandler-->>User: Command Response
    deactivate CommandHandler

    User->>Client: Trigger Event (InteractionCreate)
    activate Client
    Client->>EventListener: Handle Event
    activate EventListener
    EventListener->>Database: Log Event Data
    activate Database
    Database-->>EventListener: Event Logged
    deactivate Database
    EventListener-->>Client: Event Handled
    deactivate EventListener
    deactivate Client
