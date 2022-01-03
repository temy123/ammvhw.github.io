def returnResponse(result):
    """
    resp = Response(result)
    resp.headers['Access-Control-Allow-Origin'] = '*'
    resp.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS'
    resp.headers['Access-Control-Max-Age'] = 3600
    resp.headers[
        'Access-Control-Allow-Headers'] = 'Origin,Accept,X-Requested-With,Content-Type,Access-Control-Request-Method,Access-Control-Request-Headers,Authorization'

    print('헤더까지 담았음 ')
    """
    return result
