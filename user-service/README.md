# User Service Guide

## Setting-up

> Note: If you are familiar to MongoDB and wish to use a local instance, please feel free to do so. This guide utilises MongoDB Cloud Services.

1. Set up a MongoDB Shared Cluster by following the steps in this [Guide](./MongoDBSetup.md).

2. After setting up, go to the Database Deployment Page. You would see a list of the Databases you have set up. Select `Connect` on the cluster you just created earlier on for User Service.

![alt text](./GuideAssets/ConnectCluster.png)

3. Select the `Drivers` option, as we have to link to a Node.js App (User Service)

![alt text](./GuideAssets/DriverSelection.png)

4. Select `Node.js` in the `Driver` pull-down menu, and copy the connection string.

Notice, you may see `<password>` in this connection string. We will be replacing this with the admin account password that we created earlier on when setting up the Shared Cluster.

![alt text](./GuideAssets/ConnectionString.png)

5. Rename the `.env.sample` file to `.env` in the `user-service` directory.

6. Update the `DB_CLOUD_URI` of the `.env` file, and paste the string we copied earlier in step 4. Also remember to replace the `<password>` placeholder with the actual password.

```
DB_CLOUD_URI=<CONNECTION_STRING>
DB_LOCAL_URI=mongodb://localhost/${KEY_IN_YOUR_DB_HERE}
PORT=3001
ENV=PROD
```

## Running User Service

1. Open Command Line/Terminal and navigate into the `user-service` directory.

2. Run the command: `npm install`. This will install all the necessary dependencies.

3. Run the command `npm start` to start the User Service.

4. Using applications like Postman, you can interact with the User Service on port 3001. If you wish to change this, please update the `.env` file.

## User Service API Guide

### Create User

- This endpoint allows one to add a user and their related data into the database.

- HTTP Method: `POST`

- Endpoint: http://localhost:3001/users/

- Body: Required: username (string), email (string), password (string)

```
{
  "username": "SampleUserName",
  "email": "sample@gmail.com",
  "password": "SecurePassword",
}
```

- Responses:

| Response Code               | Result                     |
| --------------------------- | -------------------------- |
| 201 (Created)               | User Added Successfully    |
| 400 (Bad Request)           | Missing Fields             |
| 409 (Conflict)              | Duplicate Data Encountered |
| 500 (Internal Server Error) | Database or Server Error   |

### Get User

- This endpoint allows one to retrieve user related data from the database via user's email.

- HTTP Method: `GET`

- Endpoint: http://localhost:3001/users/

- Body: Required: email (string)

```
{
  "email": "sample@gmail.com",
}
```

- Responses:

| Response Code               | Result                   |
| --------------------------- | ------------------------ |
| 200 (OK)                    | User Data Obtained       |
| 400 (Bad Request)           | Missing Fields           |
| 404 (Not Found)             | No Such User Exists      |
| 500 (Internal Server Error) | Database or Server Error |

### Get All Users

- This endpoint allows one to retrieve the data of all the users from the database.

- HTTP Method: `GET`

- Endpoint: http://localhost:3001/users/

- Body: Not Required

- Responses:

| Response Code     | Result                   |
| ----------------- | ------------------------ |
| 200 (OK)          | Users Data Obtained      |
| 400 (Bad Request) | Database or Server Error |
| 404 (Not Found)   | No Users Exist           |

### Delete User

- This endpoint allows one to delete a user and their related data in the database via user's email.

- HTTP Method: `DELETE`

- Endpoint: http://localhost:3001/users/

- Body: Required: email (string)

```
{
  "email": "sample@gmail.com",
}
```

- Responses:

| Response Code               | Result                    |
| --------------------------- | ------------------------- |
| 200 (OK)                    | User Deleted Successfully |
| 400 (Bad Request)           | Missing Fields            |
| 404 (Not Found)             | No Such User Exists       |
| 500 (Internal Server Error) | Database or Server Error  |

### Update User

- This endpoint allows one to update user and their related data in the database via user's id.

- HTTP Method: `PATCH`

- Endpoint: http://localhost:3001/users/

- Body: Required: id (string), username (string), email (string), password (string)

```
{
  "id": "SampleId",
  "username": "SampleUserName",
  "email": "sample@gmail.com",
  "password": "SecurePassword",
}
```

- Responses:

| Response Code               | Result                     |
| --------------------------- | -------------------------- |
| 200 (OK)                    | User Updated Successfully  |
| 400 (Bad Request)           | Missing Fields             |
| 404 (Not Found)             | No Such User Exists        |
| 409 (Conflict)              | Duplicate Data Encountered |
| 500 (Internal Server Error) | Database or Server Error   |

### Update User Privilege

- This endpoint allows one to update a user’s privilege, i.e., promote or demote them from admin status.

- HTTP Method: `PATCH`

- Endpoint: http://localhost:3001/users/

- Body: Required: email (string), isAdmin (boolean)

```
{
  "email": "sample@gmail.com",
  "isAdmin": "true"
}
```

- Responses:

| Response Code               | Result                              |
| --------------------------- | ----------------------------------- |
| 200 (OK)                    | User Privilege Updated Successfully |
| 400 (Bad Request)           | Missing Fields                      |
| 404 (Not Found)             | No Such User Exists                 |
| 500 (Internal Server Error) | Database or Server Error            |
