# devTinder APIs

## authRouter 
- POST /signup
- POST /login
- POST /logout

## profileRouter
- GET /profile/view
- PATCH /profile/edit
- PATCH /profile/password

## connectionRequestRouter
- POST /request/send/interested/:userId
- POST /request/send/ignore/:userId
- POST /request/review/accepted/:requestId
- POST /request/review/rejected/:requestId

## userRouter
- GET /user/connections
- GET /requests/recieved
- GET /user/feed - Gets you the other user profile on the platform.


## status : 
interested,
rejected,
accepted,
ignore

