# Express auth base
This is a example of a basic api using jwt refresh tokens

## Getting up and running
```sh
git clone https://github.com/nichtj3/express-auth-base project-name
cd project-name
# Copy .env.sample file to .env and fill in
docker-compose up
```

## The Routes
If you need to know what data to send to each endpoint have a look at the schemas
- /api/v1/
  - The root of the api
- /ap1/v1/auth/signup
  - Where a user can signup
    - This will send an email to confirm their email
- /ap1/v1/auth/login
  - Where a user could login
- /ap1/v1/auth/confirm/:token
  - Where a user will confirm there email
    - User will be redirected here when they confirm there email
- /ap1/v1/example
  - An example endpoint that requires authentication
- /ap1/v1/auth/password/changePassword
  - Where a can change their password
- /ap1/v1/auth/password/forgotPassword
  - Where a user can let us know they forgot their password
    - This will send an email with a redirect link containing a token to
      validate reseting their password
- /ap1/v1/auth/password/resetPassword/:token
  - Where a user can reset their password
    - User will be sent here from the frontend with the token from the redirect
      from forgotPassword

## The authentication
Authentication is made up of two parts
  - X-CSRF-Token header set to the csrfToken returned in the request to login
    or signup
  - And the cookies set when you login

## Other things to note
- All tokens issued to a specific user can be invalidated by incrementing the
  tokenVersion on the user in the database (this will only take effect when the
  access token expires)
