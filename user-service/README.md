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
JWT_SECRET=you-can-replace-this-with-your-own-secret
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

```json
{
  "username": "SampleUserName",
  "email": "sample@gmail.com",
  "password": "SecurePassword"
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

```json
{
  "email": "sample@gmail.com"
}
```

- <a name="auth-header">Headers:</a> Required: `Authorization: Bearer <JWT_ACCESS_TOKEN>`

  - Explanation: This endpoint requires the client to include a JWT (JSON Web Token) in the HTTP request header for authentication and authorization. This token is generated during the authentication process (i.e., login) and contains information about the user's identity and permissions. The server verifies this token to ensure that the client is authorized to access the user's data.

  - Auth Rules:

    - Admin users: Can retrieve any user's data. The server verifies the user associated with the JWT token is an admin user and allows access to the requested user's data.

    - Non-admin users: Can only retrieve their own data. The server checks if the email in the request body matches the email of the user associated with the JWT token. If it matches, the server returns the user's own data.

- Responses:

| Response Code               | Result                                                   |
| --------------------------- | -------------------------------------------------------- |
| 200 (OK)                    | User Data Obtained                                       |
| 400 (Bad Request)           | Missing Fields                                           |
| 401 (Unauthorized)          | Access Denied Due to Missing/Invalid/Expired JWT         |
| 403 (Forbidden)             | Access Denied for Non-admin Users Accessing Others' Data |
| 404 (Not Found)             | No Such User Exists                                      |
| 500 (Internal Server Error) | Database or Server Error                                 |

### Get All Users

- This endpoint allows one to retrieve the data of all the users from the database.

- HTTP Method: `GET`

- Endpoint: http://localhost:3001/users/

- Body: Not Required

- Headers: Required: `Authorization: Bearer <JWT_ACCESS_TOKEN>`

  - Refer to the [Authorization header section in the Get User endpoint](#auth-header) for an explanation.

  - Auth Rules:

    - Admin users: Can retrieve all users' data. The server verifies the user associated with the JWT token is an admin user and allows access to all users' data.

    - Non-admin users: Not allowed access.

- Responses:

| Response Code      | Result                                           |
| ------------------ | ------------------------------------------------ |
| 200 (OK)           | Users Data Obtained                              |
| 400 (Bad Request)  | Database or Server Error                         |
| 401 (Unauthorized) | Access Denied Due to Missing/Invalid/Expired JWT |
| 403 (Forbidden)    | Access Denied for Non-admin Users                |
| 404 (Not Found)    | No Users Exist                                   |

### Delete User

- This endpoint allows one to delete a user and their related data in the database via user's email.

- HTTP Method: `DELETE`

- Endpoint: http://localhost:3001/users/

- Body: Required: email (string)

```json
{
  "email": "sample@gmail.com"
}
```

- Headers: Required: `Authorization: Bearer <JWT_ACCESS_TOKEN>`

  - Refer to the [Authorization header section in the Get User endpoint](#auth-header) for an explanation.

  - Auth Rules:

    - Admin users: Can delete any user's data. The server verifies the user associated with the JWT token is an admin user and allows the deletion of requested user's data.

    - Non-admin users: Can only delete their own data. The server checks if the email in the request body matches the email of the user associated with the JWT token. If it matches, the server deletes the user's own data.

- Responses:

| Response Code               | Result                                                  |
| --------------------------- | ------------------------------------------------------- |
| 200 (OK)                    | User Deleted Successfully                               |
| 400 (Bad Request)           | Missing Fields                                          |
| 401 (Unauthorized)          | Access Denied Due to Missing/Invalid/Expired JWT        |
| 403 (Forbidden)             | Access Denied for Non-admin Users Deleting Others' Data |
| 404 (Not Found)             | No Such User Exists                                     |
| 500 (Internal Server Error) | Database or Server Error                                |

### Update User

- This endpoint allows one to update user and their related data in the database via user's id.

- HTTP Method: `PATCH`

- Endpoint: http://localhost:3001/users/

- Body: Required: id (string), username (string), email (string), password (string)

```json
{
  "id": "SampleId",
  "username": "SampleUserName",
  "email": "sample@gmail.com",
  "password": "SecurePassword"
}
```

- Headers: Required: `Authorization: Bearer <JWT_ACCESS_TOKEN>`

  - Refer to the [Authorization header section in the Get User endpoint](#auth-header) for an explanation.

  - Auth Rules:

    - Admin users: Can update any user's data. The server verifies the user associated with the JWT token is an admin user and allows the update of requested user's data.

    - Non-admin users: Can only update their own data. The server checks if the id in the request body matches the id of the user associated with the JWT token. If it matches, the server updates the user's own data.

- Responses:

| Response Code               | Result                                                  |
| --------------------------- | ------------------------------------------------------- |
| 200 (OK)                    | User Updated Successfully                               |
| 400 (Bad Request)           | Missing Fields                                          |
| 401 (Unauthorized)          | Access Denied Due to Missing/Invalid/Expired JWT        |
| 403 (Forbidden)             | Access Denied for Non-admin Users Updating Others' Data |
| 404 (Not Found)             | No Such User Exists                                     |
| 409 (Conflict)              | Duplicate Data Encountered                              |
| 500 (Internal Server Error) | Database or Server Error                                |

### Update User Privilege

- This endpoint allows one to update a user’s privilege, i.e., promote or demote them from admin status.

- HTTP Method: `PATCH`

- Endpoint: http://localhost:3001/users/

- Body: Required: email (string), isAdmin (boolean)

```json
{
  "email": "sample@gmail.com",
  "isAdmin": "true"
}
```

- Headers: Required: `Authorization: Bearer <JWT_ACCESS_TOKEN>`

  - Refer to the [Authorization header section in the Get User endpoint](#auth-header) for an explanation.

  - Auth Rules:

    - Admin users: Can update any user's privilege. The server verifies the user associated with the JWT token is an admin user and allows the privilege update.

    - Non-admin users: Not allowed access.

- Responses:

| Response Code               | Result                                           |
| --------------------------- | ------------------------------------------------ |
| 200 (OK)                    | User Privilege Updated Successfully              |
| 400 (Bad Request)           | Missing Fields                                   |
| 401 (Unauthorized)          | Access Denied Due to Missing/Invalid/Expired JWT |
| 403 (Forbidden)             | Access Denied for Non-admin Users                |
| 404 (Not Found)             | No Such User Exists                              |
| 500 (Internal Server Error) | Database or Server Error                         |

### Login

- This endpoint allows a user to authenticate with an email and password and returns a JWT access token. The token is valid for 1 day and can be used subsequently to access protected resources. For example usage, refer to the [Authorization header section in the Get User endpoint](#auth-header).
- HTTP Method: `POST`
- Endpoint: http://localhost:3001/auth/login/
- Body: Required: email (string), password (string)

```json
{
  "email": "sample@gmail.com",
  "password": "SecurePassword"
}
```

- Responses:

| Response Code               | Result                      |
| --------------------------- | --------------------------- |
| 200 (OK)                    | Login Successful            |
| 400 (Bad Request)           | Missing Fields              |
| 401 (Unauthorized)          | Incorrect Email or Password |
| 500 (Internal Server Error) | Database or Server Error    |

### Verify Token

- This endpoint allows one to verify a JWT access token to authenticate and retrieve the user's data associated with the token.
- HTTP Method: `GET`
- Endpoint: http://localhost:3001/auth/verify-token/
- Body: Not Required
- Headers: Required: `Authorization: Bearer <JWT_ACCESS_TOKEN>`

- Responses:

| Response Code               | Result                                                |
| --------------------------- | ----------------------------------------------------- |
| 200 (OK)                    | Token Verified and Authenticated User's Data Obtained |
| 401 (Unauthorized)          | Missing/Invalid/Expired JWT                           |
| 500 (Internal Server Error) | Database or Server Error                              |
