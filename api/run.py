from eve import Eve
from scipy import stats
from flask import jsonify
import json
from bson.objectid import ObjectId

app = Eve()

#get connection to db
#it's probably better to use  app.data.driver.db
#but we know the following will work for now
from pymongo import MongoClient
DB = MongoClient('localhost', 29019).apitest

@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE')
    return response
           

def linregress(request, payload):
    req     = request.get_json()
    data    = json.loads(payload.data)
    obid    = data[u'_id']

    # Extract x, y arrays
    x = req[u'x']
    y = req[u'y']

    # Calculate linregress 
    slope, intercept, r_value, p_value, std_err = stats.linregress(x,y)

    # Store the result
    result = {'slope':slope, 'intercept':intercept, 'r_value':r_value, 'p_value':p_value, 'std_err':std_err}
    DB.linregress.update_one({'_id':ObjectId(obid)}, {'$set':{'result':result}})

if __name__ == '__main__':
    app.on_post_POST_linregress += linregress # register post-request event hooks
    app.run(debug=True)
