https://github.com/GolosChain/golos/issues/561

1. Run daemon
2. Run and prepare cli_wallet
```
set_password 1qaz
unlock 1qaz
import_key 5JVFFWRLwz6JoP9kguuRFfytToGU6cLgBVTL9t6NB3D3BQLbUBS
```
3. Create user alice
```
create_account cyberfounder alice "{}" "30.000 GOLOS" true
```
4. Call `get_accounts` and check that it returns data
```
curl --data '{"method":"call","params":["database_api","get_accounts",[["alice"]]],"jsonrpc":"2.0","id":0}' http://127.0.0.1:8090/rpc | python -mjson.tool
```
5. Call `get_accounts` and check that it doesn't contain fields:
```
curl --data '{"method":"call","params":["database_api","get_accounts",[["alice"]]],"jsonrpc":"2.0","id":0}' http://127.0.0.1:8090/rpc | python -mjson.tool | grep -P "reputation|transfer_history|market_history|post_history|vote_history|other_history|witness_votes|tags_usage|guest_bloggers|blog_category|name"
```
