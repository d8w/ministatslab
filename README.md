[Mini-Statslab](https://github.com/d8w/ministatslab) - an example web application of statistic tools 

![screen shot 2016-05-17 at 4 20 18 pm](https://cloud.githubusercontent.com/assets/9220766/15337805/54bb1e3c-1c4b-11e6-86c7-b07bd8037914.png)


[TOC]

A note to Windows developers:
Although most code can run in both Linux and Windows without modification, Mini-Statslab is developed and tested under Linux (i.e. RHEL 6), and configuration files (such as nginx.conf) use Linux path, /path/to/ministatslab, rather than Windows format, e.g. C:\path\to\ministatslab. Please modify accordingly.

# Dependencies
Mini-statslab requires following software

* Python 2.7+
   * numpy
   * scipy
   * pymongo
* [python-virtualenv](https://virtualenv.pypa.io/en/latest/index.html) (optional but strongly recommended)
* npm   - a package manager for Javascript
* Bower - a package manager for Javascript
* Nginx - a Web server
* Eve   - a RESTful API framework
* cURL  - a handy command line tool for testing REST APIs (optional but recommended)
* git   - a version control system

## Virtualenv setup
Run the command as an administrator
```bash
# Install virtualenv
# yum install python-virtualenv.noarch 
```

To Create a new virtual environment at ```/path/to/sandbox/mini-statslab```, run the commands as normal user
```bash
### Create virtualenv root folder. 
$ virtualenv /path/to/sandbox/mini-statslab

### To activate
$ cd /path/to/sandbox/mini-statslab
$ source bin/activate

## To deactivate
$ deactivate
```

## NPM/bower setup
Install package management tools for front-end development.

Run the following command as an administrator,
```bash
# yum install npm
# npm install -g bower
```

##  Python library setup
```bash
$ pip install eve
$ pip install numpy
$ pip install scipy
$ pip install mongodb
```

## MongoDB setup

## Installing MongoDB
[Instruction on installing & launching MongoDB Community edition on RHEL 6/7](https://docs.mongodb.org/manual/tutorial/install-mongodb-on-red-hat/#install-mongodb-community-edition)

### run MongoDB locally
Launch MongoDB as normal user.

```bash
$ mongod --dbpath=/path/to/db

# e.g. use port 29019
$ mongod --dbpath=/path/to/ministatslab/db --port=29019
```

### Crete db and user and assign the roles
Open a MondoDb shell by typeing ```mongo --port 29019```
```bash
> use apitest
> db.createUser({user:'user', pwd:'user', roles:['readWrite', 'dbAdmin']})
```

# Mini-Statslab setup
After you install the dependencies, clone the Github repository at the root of the virtual environment, say ```/path/to/mini-statslab```:

```bash
$ git clone https://github.com/d8w/ministatslab.git
```

## Folder structure
We should see following folder/file hierarchy

* bin           - generated by virtualenv
* include       - generated by virtualenv
* lib           - generated by virtualenv
* lib64         - generated by virtualenv
* ministatslab  - components container
    * api       - RESTful API implementation 
    * db        - MongoDB database 
    * nginx     - Nginx configuration and state files 
        * etc  
        * log  
        * tmp  
        * var
    * README.md - this file
    * ui        - static web content: javascript, css, HTML 

# UI
## Initializing Niginx

Create sub-folders in ```nginx``` folder

* tmp
* log
* var
* etc

## nginx.conf
Change port number and specify the web content folder by editing nginx.conf.

```javascript
  server {
    # IPv4.
    listen 3000; # port number
    # IPv6.
    listen [::]:3000 default ipv6only=on; # port number

    root /path/to/ministatslab/ui; # root directory of web content

```

## launch nginx
```bash
# Run the command as a non privileged user.
$ nginx -c /path/to/ministatslab/nginx/etc/nginx.conf
```

Ignore the warning
```bash
nginx: [alert] could not open error log file: open() "/var/log/nginx/error.log" failed (13: Permission denied)
```

## Verity nginx is running
```bash
$ netstat -anp | grep 3000

# you should see something like this

(Not all processes could be identified, non-owned process info
 will not be shown, you would have to be root to see it all.)
tcp        0      0 0.0.0.0:3000            0.0.0.0:*               LISTEN      6573/nginx: master
tcp6       0      0 :::3000                 :::*                    LISTEN      6573/nginx: master
```

## Reload
To reload Nginx after editing its configuration, do
```bash
$ nginx -c /path/to/nginx/etc/nginx.conf -s reload
```

# Fronend development environment setup
Change directory to /path/to/ministatslab/ui/, and run

```bash
$ bower install
```

This command downloads jabascript libraries and puts them in ```bower_component``` subfolder.

After this, Nginx and UI are up and running.
Point your browser to [http://127.0.0.1:3000/dev.html](http://127.0.0.1:3000/dev.html), and you should see this message if everything goes smoothly:

> If you're seeing this page, you've successfully lauched Nginx and UI. Congratulations!

# Launch Eve
Now, we fire up the RESTful API service
```bash
$ python run.py
```

# APIs

## Testing api
To test if the API server is up and running, you can run the following commands in a terminal (assuming you have curl installed)
```bash
curl http://127.0.0.1:5000/api

{"_links": {"child": [{"href": "linregress", "title": "linregress"}]}}
```
Eve should spit out something like this
```
127.0.0.1 - - [19/Apr/2016 14:53:38] "GET /api HTTP/1.1" 200 -
```

## Testing linregress
* a POST request
* linregress calculates a regression line.
* Inputs:
    * x: an array of numbers, e.g. [0.29998503,  0.25058272,  0.62110361,  0.09335537,  0.23726673]
    * y: an array of numbers, e.g. [0.14620198,  0.29766358,  0.42221104,  0.27356068,  0.21425566]

```bash
curl -X POST -H "Content-Type: application/json" --data '{"x":[1,2,3], "y":[-1,-2,-3]}'  http://127.0.0.1:5000/api/linregress
```

The server replies a message similar as below if it's succesful
```
{"_updated": "Mon, 16 May 2016 19:11:55 GMT", "_links": {"self": {"href": "linregress/573a1b7be3c4537277db05f2", "title": "Linregre"}}, "_created": "Mon, 16 May 2016 19:11:55 GMT", "_status": "OK", "_id": "573a1b7be3c4537277db05f2", "_etag": "d79d0dcc1004bbde55b38d1f78d2eda8aab238f2"}
```

To retrieve the results, send a GET request to the server on the resource ```linregress/573a1b7be3c4537277db05f2```

For example
```bash
curl -i http://localhost:5000/api/linregress/573a1b7be3c4537277db05f2
```

And you should see like:
```
{"_updated": "Mon, 16 May 2016 19:11:55 GMT", "_links": {"self": {"href": "linregress/573a1b7be3c4537277db05f2", "title": "Linregre"}, "collection": {"href": "linregress", "title": "linregress"}, "parent": {"href": "/", "title": "home"}}, "x": [1, 2, 3], "y": [-1, -2, -3], "_created": "Mon, 16 May 2016 19:11:55 GMT", "_id": "573a1b7be3c4537277db05f2", "_etag": "d79d0dcc1004bbde55b38d1f78d2eda8aab238f2"}
```


# Access the web interface
Use ssh tunnels to forward ports:

* 3000 - web service
* 5000 - API service
* 29019 - MongoDB

You can now access the web interface via the following URLs

* development: [http://127.0.0.1:3000/dev.html](http://127.0.0.1:3000/dev.html)
* ~~production: [http://127.0.0.1:3000/index.html](http://127.0.0.1:3000/index.html)~~
