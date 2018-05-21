https://github.com/GolosChain/golos/issues/574

2. Run daemon
3. Run and prepare cli_wallet
```
set_password 1qaz
unlock 1qaz
import_key 5JVFFWRLwz6JoP9kguuRFfytToGU6cLgBVTL9t6NB3D3BQLbUBS
```
3. Create user alice
```
create_account cyberfounder alice "{}" "30.000 GOLOS" true
```
4. Create user bob
```
create_account cyberfounder bob "{}" "30.000 GOLOS" true
```
5. Call get_account_reputations
```
curl --data '{"method":"call","params":["follow","get_account_reputations",[["alice","bob"]]],"jsonrpc":"2.0","id":0}' http://127.0.0.1:8090/rpc | python -mjson.tool
```
