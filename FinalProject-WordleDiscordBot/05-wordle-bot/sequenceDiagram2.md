```mermaid
sequenceDiagram
    participant User
    participant Client
    participant Index
    participant CommandFiles
    participant Database
    participant EventHandler
    participant CommandHandler

    User->>Index: Start Bot
    activate Index
    Index->>Client: Create Client
    activate Client
    Client->>Database: Connect to Database
    activate Database
    Database-->>Client: Connection Established
    deactivate Database

    Client->>CommandFiles: Load Command Files
    activate CommandFiles
    CommandFiles->>Database: Fetch Command Metadata
    activate Database
    Database-->>CommandFiles: Command Metadata
    deactivate Database
    CommandFiles-->>Client: Commands Ready
    deactivate CommandFiles

    Client->>EventHandler: Load Event Handlers
    activate EventHandler
    EventHandler-->>Client: Event Handlers Ready
    deactivate EventHandler
    Index-->>Client: Initialization Complete
    deactivate Client

    User->>Client: Issue Command (/bet)
    activate Client
    Client->>CommandHandler: Handle /bet Command
    activate CommandHandler
    CommandHandler->>Database: Update User Bet Data
    activate Database
    Database-->>CommandHandler: Bet Updated
    deactivate Database
    CommandHandler-->>User: Bet Success Message
    deactivate CommandHandler
    deactivate Client

    User->>Client: Trigger Event (ClientReady)
    activate Client
    Client->>EventHandler: Handle ClientReady Event
    activate EventHandler
    EventHandler-->>User: Ready Message (Logged in as bot)
    deactivate EventHandler
    deactivate Client
