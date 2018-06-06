# graphql-redis-github

### You need to add this file in your repo

Be sure and not check this file into Github, it should already
be listed in the .gitignore file

[ GitHub personal access token ](https://help.github.com/articles/creating-a-personal-access-token-for-the-command-line/)

You need to create a file called **f1.js** and it should be located inside the
top level **data** directory.  The one line inside the file should be:

```
{"key": "Github personal access token goes here inside the quotes"}
```

### To get up and running:

##### Run this command

```
npr s9
```

s3 = **writeStarGazers** writes the logins out to a redis set  
s7 = **writeAvatars** reads the above redis set and writes out the login fields
to a redis hashmap  
s8 = **writeAvatarsJson** reads the above redis set and writes out the login fields
to a JSON file.  

### About the code

##### Part I

Redis is used as a cache to house data prior to it being persisted as
json files which are stored inside github.

There are (2) types of keys inside Redis.

* Repository keys which are Sets
* User login keys which are Hashmaps

The **src/repo** directory has four files in it all of whose job is to add user login's to the particular repository key inside Redis.

There are currently (4) types of Graphql queries for

* Forks
* Mentionable Users
* Star Gazers
* Watchers

Since the Redis key is a Set, you can run any or all of the functions to add more user logins to the set of users for a particular repository.

Once these user logins are inside the Set repository key then they are the input to drive future processing of other User login data.

##### Part II

user/writeAvatar is used to write a Github User's information to a Redis Hashmap
consisting of the following fields:

* User Avatar
* User Location
* User Name

The Hashmap name is the actual user login.

##### Part III

Now that the data is in Redis one can persist the data to a JSON file with
the code inside json/writeAvatarsJson to a json file named with the actual repository.

### Coding notes for this repo

This
[post](https://blog.lavrton.com/javascript-loops-how-to-handle-async-await-6252dd3c795)
explains how to do javascript loops with async await

This
[post](https://goenning.net/2016/04/14/stop-reading-json-files-with-require/) discusses how to read or import JSON files correctly.
