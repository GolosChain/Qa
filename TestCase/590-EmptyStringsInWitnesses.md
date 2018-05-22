https://github.com/GolosChain/golos/issues/590

1. Run daemon
2. Call `get_active_witnesses` and check it returns list of witnesses:
```
curl --data '{"id":3,"method":"call","jsonrpc":"2.0","params":["witness_api","get_active_witnesses",[]]}' http://127.0.0.1:8090/rpc | python -mjson.tool | grep -P '"cyberfounder"'
```
3. Call `get_active_witnesses` and check it doesn't return empty strings:
```
curl --data '{"id":3,"method":"call","jsonrpc":"2.0","params":["witness_api","get_active_witnesses",[]]}' http://127.0.0.1:8090/rpc | python -mjson.tool | grep -P '""'
```
