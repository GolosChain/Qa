https://github.com/GolosChain/golos/issues/647

1. Disable `tags`-plugin and enable `social_network`-plugin in config.ini
2. Run daemon
3. Run and prepare cli_wallet
```
set_password 1qaz
unlock 1qaz
import_key 5JVFFWRLwz6JoP9kguuRFfytToGU6cLgBVTL9t6NB3D3BQLbUBS
```
3. Create user
```
create_account cyberfounder alice "{}" "30.000 GOLOS" true
```
4. Create post
```
post_comment alice test "" ptest "Test post!" "<h1>title!</h1><p>hello!</p><hr>test..." "{}" true
```
5. Call get_content
```
curl --data '{"method":"call","params":["social_network","get_content",["alice","test"]],"jsonrpc":"2.0","id":0}' http://127.0.0.1:8090/rpc | python -mjson.tool
```
