from eve import Eve

app = Eve()

def linregress(resource, request):
    print 'A GET on the "%s" endpoint was just performed!' % resource

if __name__ == '__main__':
    app.on_post_GET_linregress += linregress # register post-request event hooks
    app.run(debug=True)

