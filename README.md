# Module 2 group project #
__Submitted by:__ CodeMonkeys

__Team members:__

- ulric088@umn.edu
- paull011@umn.edu
- yacou007@umn.edu
- nguy1912@umn.edu

__Heroku URL:__ https://whispering-dawn-13039.herokuapp.com/

__Argument of ambition:__
This was a technically ambitious project for many reasons.  First of all, our team went above and beyond expectations when it came to the scope of the project.  Not only did we create a game and statistics, we created user accounts, chat capabilities, and move histories to add additional flavor to the gaming experience.  

Some of the more interesting technical features that we incorporated that made it an interesting, and difficult, project were the ability to have multiple different games going simultaneously.  To achieve this, we had to use different namespaces for each concurrent game execution, which added an extra level of complexity beyond having one game.  Another aspect of this was that we needed to keep track of different games available to users, and connect users to the appropriate game.

One more technically ambitious part of this project was definitely the UI experience of our site.  We didn't need to create an elaborate visual for this project, but we believe our snake game website is built up in a way that is enjoyable for the user, and they will be able to test our endpoints without ever knowing that they are testing them.  This was an ideal scenario for us because we could test our endpoints just as a user would, instead of having to focus on postman or cURL calls to understand what was going on behind the scenes.  By utilizing the HTML5 canvas, we also created a very portable graphical experience for users, and we all got to learn a little bit about creating graphics in this project.

One more ambitious part of this project was the pure scope of it.  We were the demo group, and hence had less time to actually complete it, yet we believe we presented a fairly polished product that goes beyond the basic requirements.  


__Argument of execution:__
This was a well executed project on multiple levels.  First of all, we created an immersive experience for the user, which is the end goal of any game, and they are able to play the game without too many headaches, and everything will work as expected.  

On another level, we tried to follow the heart of the assignment by utilizing endpoints effectively to manipulate the game status and create new games, new accounts, etc.  We don't do a lot of the more traditional JSON responses that a restful API would do, but we deliver pages and status codes depending on the API requests, as it is what we were hoping to accomplish with this project, and it seemed to fit the core of the project about understanding middleware and delivering resources based on different paths.  

At yet another level, this project was well executed from a technical standpoint.  We created very modular code, and tried to utilize an object oriented approach to the project, which was especially helpful since we were trying to create multiple games at a time, and it would have been very difficult without the object oriented approach.  To do this, however, we had to learn how to use object oriented javascript and all the quirks that come with it.  

Our project is also executed well because we were always very aware of some of the limitations of the project, such as the server only being able to run a certain amount of time per day, which we accounted for by not having the server 'tick' unless games were actively running, and to allow for this, we had to do intricate game tracking and manual cleanup of games.  

## Description ##
For this module you will be making a multi-user, online game using Express,
WebSockets, and MongoDB. Your final product will need to have these components:

- An API that can be used to get information about the current state of the
  the game and post moves to the game. This will be how the game can be played.
- A view to watch the game in real time.
- A statistics page for the game.

### What constitutes a game? ###
Google says that the definition of "game" is "a form of play or sport" and who
are we to argue with Google. You could do something relatively simple like
[Twitch Plays Tic-tac-toe](https://en.wikipedia.org/wiki/Twitch_Plays_Pok%C3%A9mon)
to something as complicated as your own
[MUD](https://en.wikipedia.org/wiki/MUD). It doesn't need to be elaborate or
highly visual.

### API: Playing the game ###
You need to write an web API that will let people easily write clients to play your
game. Suppose our game is [tug-of-war](https://en.wikipedia.org/wiki/Tug_of_war).
Then I would want to be able to get `/rope-position` for information about the
current position of the rope in
[JSON format](https://en.wikipedia.org/wiki/JSON) and post to `/pull-on-left`
or `/pull-on-right` to affect the state of the game.

You will need to develop a set of tools, scripts, or code that will test and
demonstrate the capabilities of your API. You can use whatever languages you
want to accomplish this. Both
[node.js](http://stackoverflow.com/questions/5643321/how-to-make-remote-rest-call-inside-node-js-any-curl/5643366#5643366)
and
[python](http://stackoverflow.com/questions/4476373/simple-url-get-post-function-in-python)
are capable of this. There is a good chance your favorite language can do it
also.

If you just want to poke at your API a little bit you can use tools like
[Postman](https://www.getpostman.com/) and
[Advanced REST client](https://chrome.google.com/webstore/detail/advanced-rest-client/hgmloofddffdnphfgcellkdfbfbjeloo?hl=en-US)
as in browser options or
[curl](https://curl.haxx.se/docs/manpage.html) on the command line.
Curl has the benefit that it is available on almost all systems.

### Watching the game ###
Create a view for spectators. Your players will be interacting via your API,
but you should also have a way for spectators to watch via a webpage. This
should update in real time, so you will need to use WebSockets to push
events out to the UI.

What you display here is up to your own judgment, just make sure it is
something worth watching. If you were doing tic-tac-toe, I would want to watch
as the board fills up. If you were doing hangman, I would want to see the
gallows being built. You don't need fancy graphics, just provide some way of
conveying action.

Other potential options:

- twitter-like stream of events
- scoreboard
- live-updating charts


### Stats overview ###
The final requirement is some statistics web page for the game. This can be
displaying the number of times a person took a specific action, the amount of
time that it took a game to finish, et cetera. Show any statistics that you
think would be interesting for your specific game. You can make this static or
use web sockets to update content live here.

## Setting up your database ##
Someone from each group should create an account with [mLab](https://mlab.com/)
and setup a free sandbox database. This will be the database you should use for
your project. __If you want to connect from inside the UMN you should send us
the URI they gave you.__ We will then send you back a URI you can use to
connect.

### The reasoning (in case you want to know) ###
The reason you need to do this is that the UMN network blocks certain outgoing
ports. These are also the ports that mLab uses to let you connect. We have a
server outside of UMN that listens on ports that are not blocked and will
forward your traffic on to mLab.

## Submission ##
- Your code should be pushed up to your repo on github
- Fill this `README.md` out with your team name, team members' emails, and
  Heroku url for your demo. Additionally, complete the argument sections at the
  top of the file.
- Create a file called `API.md` that documents your api endpoints and how to
  use them. These should include a valid `curl` command and a description of its
  expected output.

## Grading ##
You will be graded on the __ambition__ and __execution__ of the project. At
the top of this `README.md` you have the opportunity to argue why your
submission was ambitious and well executed. In order for us to grade it, you
must have it hosted on Heroku. To earn an "A" grade, a project must be
technically ambitious, well-executed, and polished. To earn a passing grade, a
project must minimally fulfill the three requirements listed in the description.
