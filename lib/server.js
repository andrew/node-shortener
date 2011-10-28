var http = require('http'),
    connect = require('connect'),
    redis = require("redis"),
    client = redis.createClient(),
    b62 = require('base62');

var server = connect.createServer(connect.query());

server.use('/',
  connect.router(function(app){
    app.get('/', function(req, res, next){
      res.writeHead(200, {'Content-Type': 'text/html'});
      if (req.query.url){
        client.keys('*',function(err, result){
          key = b62.encode(result.length)
          client.set(key, req.query.url, function(err, result){
            res.write('http://localhost:9000/'+key)
            res.end()
          });
        });
      } else {
        res.write('Hi')
        res.end()
      }
    });

    app.get('/:key', function(req, res, next){
      client.get(req.params.key, function(err, result){
        res.writeHead(302, {'Location': result});
        res.end()
      });
    });
  })
);

server.listen(9000);
console.log('Server running at http://127.0.0.1:9000/');
