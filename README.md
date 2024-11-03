# Real Leaderboard Chess.com
https://leaderboard-chess.com/

## Purpose
This project aims to add hidden users from the Chess.com leaderboard.

## How to Add a User to `players.csv`
1. Open the `players.csv` file.
2. Add a new line with the user's username and the reason they are hidden.

Example:
```csv
username,cause_of_hidden
new_user,hidden_reason
```

- Save the players.csv file.
- The user will be added to the leaderboard.

## Notes
- Ensure that the username is correct.
- Provide a valid reason for hiding the user from Chess.com.

## How often is the data updated?
Every hour

## Developing guide

- `npm i` - to install dependencies
- `npm run load-data` - to load and prepare data
- `npm run dev` - to start development server
- `npm run build` - to build the project
