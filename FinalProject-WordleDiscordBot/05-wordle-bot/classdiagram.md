```mermaid
classDiagram
    class Client {
        -intents: Array
        -commands: Collection
        +login(token): void
        +on(eventName, handler): void
        +once(eventName, handler): void
    }

    class Collection {
        -items: Array
        +set(key, value): void
        +get(key): Object
    }

    class Command {
        -data: Object
        -execute: Function
    }

    class Event {
        -name: String
        -execute: Function
        -once: Boolean
    }

    class InteractionCreateEvent {
        -name: String = "InteractionCreate"
        -execute(interaction): void
    }

    class ClientReadyEvent {
        -name: String = "ClientReady"
        -once: Boolean = true
        -execute(client): void
    }

    class ExtraPointsCommand {
        -data: SlashCommandBuilder
        -execute(interaction): void
    }

    class BetCommand {
        -data: SlashCommandBuilder
        -execute(interaction): void
    }

    class BuyRevealCommand {
        -data: SlashCommandBuilder
        -execute(interaction): void
    }

    class LeaderboardCommand {
        -data: SlashCommandBuilder
        -execute(interaction): void
    }

    class PointsCommand {
        -data: SlashCommandBuilder
        -execute(interaction): void
    }

    class ShopCommand {
        -data: SlashCommandBuilder
        -execute(interaction): void
    }

    class StreakCommand {
        -data: SlashCommandBuilder
        -execute(interaction): void
    }

    class StartWordleCommand {
        -data: SlashCommandBuilder
        -execute(interaction): void
    }

    class RevealCommand {
        -data: SlashCommandBuilder
        -execute(interaction): void
    }

    class UserFunctions {
        +insertUser(id, username, wins, losses, points, score, streak, lastWord, winRate, guesses, items): void
        +updateWinRate(wins, losses, id): void
        +updateWin(win, id): void
        +updateLoss(losses, id): void
        +queryData(): void
    }

    class Index {
        +startBot(): void
    }

    class Admin {
        +updateAdmin(points, dailyWord, id): void
    }

    Client --|> Collection : has
    Client --|> Command : handles
    Client --|> Event : handles
    Event <|-- InteractionCreateEvent
    Event <|-- ClientReadyEvent
    Collection --|> Command : contains
    Command <|-- ExtraPointsCommand
    Command <|-- BetCommand
    Command <|-- BuyRevealCommand
    Command <|-- LeaderboardCommand
    Command <|-- PointsCommand
    Command <|-- ShopCommand
    Command <|-- StreakCommand
    Command <|-- StartWordleCommand
    Command <|-- RevealCommand
    Index "1" --|> "1" Client: initializes
    UserFunctions "1" --|> "*" Client: uses
    Admin "1" --|> "1" Client: administers
