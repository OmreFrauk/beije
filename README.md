# Beije Email Verification System

**_Description_**

Beije is a direct-to-consumer subscription-based enterprise providing menstrual products to women. This project is a backend application designed to handle user registration and email verification. The application is built with NestJS and TypeORM and uses a MySQL database.

**_Features_**

    •	User Registration
    •	Email Verification
    •	Checking Verification Status

**_Technologies Used_**

    •	NestJS
    •	TypeORM
    •	MySQL
    •	Nodemailer

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Clone The Repository

```bash
git clone https://github.com/OmreFrauk/beijeEmailVerification.git
cd beijeEmailVerification
```

## Installation

```bash
$ yarn install
```

## Environment Variables:

    •	Create a .env file in the root directory and add your email credentials for sending verification emails:

```bash
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-email-password
```

## Database Setup:

    •	If you are using Docker, run the following command to start a MySQL container:
    docker run --name mysql-nest -e MYSQL_ROOT_PASSWORD=password -e MYSQL_DATABASE=test -p 3306:3306 -d mysql:latest

# Running the Application

## Start the NestJS Application:

```bash
	npm run start
```

## Api Endpoints:

### Register a New User:

    •	URL: POST /user/register
    •	Body:

```bash
	{
  "username": "testuser",
  "email": "testuser@example.com"
}
```

```bash
	Verify User Email:
	•	URL: GET /user/verify-email/:username/:verificationToken
```

```bash
	•	Check Verification Status:
	•	URL: GET /user/check-verification/:username
```

## Testing

```bash
  npm test
```

## ChatGPT usage gist

[here]("https://gist.github.com/OmreFrauk/efc58678b90f17b2f49e6c68f1918d54.js)
