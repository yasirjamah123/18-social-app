# Social Network API

## user story
AS A social media startup
I WANT an API for my social network that uses a NoSQL database
SO THAT my website can handle large amounts of unstructured data
## Installation

1. Install dependencies: `npm install`
2. Set up MongoDB locally by following the guide provided (https://coding-boot-camp.github.io/full-stack/mongodb/how-to-install-mongodb).

## Usage

1. we start the server by running the following command: `npm run dev`
2. We Test the API endpoints using  tool named as Insomnia.

## API Endpoints:

### Users

- `GET /api/users/getAllUsers`: Get all users.
- `GET /api/users/getUserById/:id`: Get a single user by ID.
- `POST /api/users/addUser`: Create a new user.
- `PUT /api/users/updateUserById/:id`: Update a user by ID.
- `DELETE /api/users/deleteUserById/:id`: Delete a user by ID.

### Friends

POST `/api/users/addFriendById/:userId/:friendId`: Add a new friend to a user's friend list.
DELETE `/api/users/deleteFriendById/:userId/:friendId`: Remove a friend from a user's friend list.

### Thoughts

`GET /api/thoughts/getAllThoughts`: Get all thoughts.
`GET /api/thoughts/getThoughtById/:id`: Get a single thought by ID.
`POST /api/thoughts/addThought`: Create a new thought.
`PUT /api/thoughts/updateThoughtById/:id`: Update a thought by ID.
`DELETE /api/thoughts/deleteThoughtById/:id`: Delete a thought by ID.

### Reactions

`POST /api/thoughts/addReaction/:thoughtId`: Add a reaction to a thought.
`DELETE /api/thoughts/deleteReaction/:thoughtId/:reactionId`: Remove a reaction from a thought.

## Built With:

Node.js
Express.js
MongoDB
Mongoose

## Walkhrough Comprehensive Video Link:

https://drive.google.com/file/d/1eb-NN1cwoJDtW3n-MccrQ5xSxGBRPttt/view?usp=drive_link

## Author:
Yasir Jamah




