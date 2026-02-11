# Behind Closed Doors - Website
The website for Behind Closed Doors is a informative page for those who want more information about the game and mental well-being as a whole.

Users can login and register their account for Behind Closed Doors on the website, from there they are free to explore the leaderboard and it's other features like the ranking system and the badges system where they can view from many other's fastest speed of completion of the game.

# System Requirements
## Hardware
- PC (if using PC-VR)
- Mobile

## Minimum PC Specifications (PC)
- OS: Windows 10 or later
- Processor: Intel i5 / Ryzen 5 or equivalent
- RAM: 2GB minimum

# Technologies Used
- Database & Authentication: Firebase (Authentication & Realtime Database)
- Game Engine: Unity (XR / VR System)

# Features
1. User Authentication (Login & Signup)
Description: Users can create an account or log in using their email and password. This allows them to access personalized features such as the leaderboard, badges, and account management.
2. Leaderboard
Description: Displays a ranked list of users based on their performance in the game (e.g., fastest completion times, number of replays, and badges earned). Only logged-in users can view the leaderboard.
3. Badges System
Description: Users can earn and view badges for achieving specific milestones or completing challenges in the game. The badges page shows which badges have been unlocked and their descriptions.
4. Ranking System
Description: Users are ranked based on their game performance, encouraging competition and replayability.
5. Mental Health Resources
Description: Offers links and information about mental health, educational materials, support groups, and crisis hotlines (e.g., 988).
6. Game Overview & Tutorial
Description: The homepage and tutorial sections explain the game’s objectives, how to play, and the importance of recognizing mental health signs.

# Data Structure
root
│
├── captions
│   ├── depression
│   ├── eatingdisorder
│   │   ├── notebook
│   │   ├── notepad
│   │   ├── snackarea
│   │   ├── waterslug
│   │   └── weighScale
│   └── schizophrenia
│
└── users
    └── <userId1>
        ├── createAt
        ├── email
        ├── userStats
        │   ├── badges
        │   │   ├── dumbells
        │   │   │   ├── description
        │   │   │   ├── id
        │   │   │   ├── name
        │   │   │   ├── progress
        │   │   │   ├── target
        │   │   │   └── unlock
        │   │   ├── laundry
        │   │   ├── penknife
        │   │   └── pills
        │   ├── played_twice
        │   ├── bestRecordedTime
        │   ├── difficulty
        │   └── timesPlayed
        └── username

## Data Structure Explanation
    captions: Contains categories (e.g., depression, eatingdisorder, schizophrenia), each with relevant caption keys and text.
    users: Each user is stored under a unique user ID.
    createAt: Timestamp of account creation.
    email: User’s email address.
    userStats: Stores game-related stats for the user.
    badges: Each badge (e.g., dumbells, laundry) is an object with properties like description, id, name, progress, target, and unlock.
    played_twice: Likely a boolean or counter for a specific achievement.
    bestRecordedTime: User’s best time for a game/level.
    difficulty: Difficulty level played.
    timesPlayed: Number of times the user has played.
    username: User’s display name.

