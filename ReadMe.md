# Welcome to the Node Simple System Monitor wiki!
![nssm screen](readme/nssm.jpg)
## What is this?
Right now it's a basic cli system monitor tested for MacOS and Linux (Unbuntu LTS) monitoring.  

There are 3 working modes
* local - just runs locally with no databasing
* client - for monitoring a remote server via mongo database
* server - for gather data and sending to mongo (it will need to have a deamon setup)

## What does it actually monitor?
* Currently it's basically monitoring cpu and ram
* logging to database 
* process logging after threshold crossings 
    * cpu, ram, pid, process time, user, command  
    
Unfortunately I haven't been able to get a ps view to differentiate between all the differen node processes whithout being all the arguments and several lines a process - notably vscode remote.

### Packages
* Express
* Chalk for coloring headers, hostname, alerts
* Mongodb for database
* dotenv for mongo uri as MONGO_URI
* inquirer for cli prompts for picking which host to monitor

I may remove the os version from the to of the monitoring (it isn't logged, but was informative when looking at scripting issues).

### Where is it goign?
1. It needs a web front end and a mobile app to be able to chart / look at any historicals. 
2. I'd like to do some network monitoring, but have to think about how to gather that data.
3. open to suggestions - open an issue with any thoughts

### What's the timeline on things?
Who knows, data visualization isn't something I've previously dug into and my iOS dev is pretty entry level. Nailing down the backend requirements first.

## How to run
Clone the repo and pick a mode: local, client, or server
```
npm -i
./nssm.js
```
nssm.js is now an executable node script
you may need to adjust terminal window for optimal use

#### How does it work?
1. The metrics at the top of the screen that continuosly monito cpu and ram is all pulled through native node api.
2. The process list is being pull through bash scripts that do a ps | head | awk that gats parsed out and formated in node. I suspect ps will be a problem on windows and my need something using taskList? instead from some reading.
3. The 2 sets of metrics are combined into an object and inserted into node 
