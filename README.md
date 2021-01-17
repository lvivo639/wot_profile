# World of Tanks profile API

- Implement web server with basic jwt auth using Express.js, passport.
- Choose at your discretion the most preferable video game API (such
   like World of Tanks, Fortnite, Call of Duty: Modern Warfare, Dota2 etc.)
   where it is possible to get game stats without any authentication.
- Implement CRUD operations of the game profile for the authorized
   users. (data which should be passed on new profile creation depends on
   chosen game API)
- Implement logic which fetches actual game stats of the game profiles
   from the game API each defined period (2 minutes for instance)
   sequentially and stores game stats state into DB.
- Implement endpoint which can show the current actual stats for the
   authorized user. Database type is not hardly defined, so it can be chosen
   by feeling of your heart. Worker which fetches game stats can be
   implemented using different approaches:

  - it can be launched in the same process the server is
  - it can be implemented using Node.js worker threads
  - it can be implemented using microservice architecture