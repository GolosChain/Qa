https://github.com/GolosChain/golos/issues/599

1. Call get_accounts for base accounts created on init_genesis state:
```
curl -s --data-binary '{"jsonrpc": "2.0","method":"call","params":["database_api", "get_accounts" [["cyberfounder"]]]}' -H 'content-type: text/plain;' http://127.0.0.1:8090 | python -mjson.tool
```
