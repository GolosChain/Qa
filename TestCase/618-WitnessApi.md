https://github.com/GolosChain/golos/issues/618

1. Run daemon with enabled `witness_api`-plugin and `database_api`-plugin
2. Validate daemon return answers on api calls
```
curl --data '{"method":"call","params":["witness_api","get_current_median_history_price",[]],"jsonrpc":"2.0","id":0}' http://127.0.0.1:8090/rpc | python -mjson.tool
curl --data '{"method":"call","params":["witness_api","get_feed_history",[]],"jsonrpc":"2.0","id":0}' http://127.0.0.1:8090/rpc | python -mjson.tool
curl --data '{"method":"call","params":["witness_api","get_miner_queue",[]],"jsonrpc":"2.0","id":0}' http://127.0.0.1:8090/rpc | python -mjson.tool
curl --data '{"method":"call","params":["witness_api","get_active_witnesses",[]],"jsonrpc":"2.0","id":0}' http://127.0.0.1:8090/rpc | python -mjson.tool
curl --data '{"method":"call","params":["witness_api","get_witness_schedule",[]],"jsonrpc":"2.0","id":0}' http://127.0.0.1:8090/rpc | python -mjson.tool
curl --data '{"method":"call","params":["witness_api","get_witnesses",[[0]]],"jsonrpc":"2.0","id":0}' http://127.0.0.1:8090/rpc | python -mjson.tool
curl --data '{"method":"call","params":["witness_api","get_witness_by_account",["cyberfounder"]],"jsonrpc":"2.0","id":0}' http://127.0.0.1:8090/rpc | python -mjson.tool
curl --data '{"method":"call","params":["witness_api","get_witnesses_by_vote",["cyberfounder", 10]],"jsonrpc":"2.0","id":0}' http://127.0.0.1:8090/rpc | python -mjson.tool
curl --data '{"method":"call","params":["witness_api","get_witness_count",[]],"jsonrpc":"2.0","id":0}' http://127.0.0.1:8090/rpc | python -mjson.tool
curl --data '{"method":"call","params":["witness_api","lookup_witness_accounts",["cyberfounder",10]],"jsonrpc":"2.0","id":0}' http://127.0.0.1:8090/rpc | python -mjson.tool
```
3. Validate daemon return errors on api calls
```
curl --data '{"method":"call","params":["database_api","get_current_median_history_price",[]],"jsonrpc":"2.0","id":0}' http://127.0.0.1:8090/rpc | python -mjson.tool
curl --data '{"method":"call","params":["database_api","get_feed_history",[]],"jsonrpc":"2.0","id":0}' http://127.0.0.1:8090/rpc | python -mjson.tool
curl --data '{"method":"call","params":["database_api","get_miner_queue",[]],"jsonrpc":"2.0","id":0}' http://127.0.0.1:8090/rpc | python -mjson.tool
curl --data '{"method":"call","params":["database_api","get_active_witnesses",[]],"jsonrpc":"2.0","id":0}' http://127.0.0.1:8090/rpc | python -mjson.tool
curl --data '{"method":"call","params":["database_api","get_witness_schedule",[]],"jsonrpc":"2.0","id":0}' http://127.0.0.1:8090/rpc | python -mjson.tool
curl --data '{"method":"call","params":["database_api","get_witnesses",[[0]]],"jsonrpc":"2.0","id":0}' http://127.0.0.1:8090/rpc | python -mjson.tool
curl --data '{"method":"call","params":["database_api","get_witness_by_account",["cyberfounder"]],"jsonrpc":"2.0","id":0}' http://127.0.0.1:8090/rpc | python -mjson.tool
curl --data '{"method":"call","params":["database_api","get_witnesses_by_vote",["cyberfounder", 10]],"jsonrpc":"2.0","id":0}' http://127.0.0.1:8090/rpc | python -mjson.tool
curl --data '{"method":"call","params":["database_api","get_witness_count",[]],"jsonrpc":"2.0","id":0}' http://127.0.0.1:8090/rpc | python -mjson.tool
curl --data '{"method":"call","params":["database_api","lookup_witness_accounts",["cyberfounder",10]],"jsonrpc":"2.0","id":0}' http://127.0.0.1:8090/rpc | python -mjson.tool
```
