#Install Dependencies

1.Npm init -y for initiating Nodejs project

2.md node_assignment as node project name 

3.cd node_assignment for move to current working directory.

4.Install dependencies as per company requirements Like dotenv,cors,express,mongodb and mongoose.

5.Create .env file at root level for environment variables.

## Connection with Database and Run the Program.

6.Add port number,mongodb connection uri to the env file.

7.Create server.js file as main file and listen the application using port number.

8.Folder structure maintained for configuration/connection with mongodb.

9.By using mongodb with mongodb_client for secure connection with mongodb (by using dotenv mongo_uri connection string).

10.Run the application using node server.js in terminal.

11.Always cross check the db connection active(DbConnection method to all requests).

12.For Checking make a file with name server.http for all http requests.

### ALL REQUESTS AND END PATH

13. GET - /load for loading all users along with Posts and Comments.

14. GET - /users/:id for Specific user details.

15. DELETE - /users for delete for users 

16. DELETE - /users/:id for delete a specific user 

17. PUT - /users/:id for update specific user

18. GET - /posts for all posts

19. GET - /posts/:id for specific post

20. GET - /comments for all comments

21. GET - /comments/:id for specific comment

22. PUT - /posts/:id Update specific post

23. PUT - /comments/:id Update specific comment
 
