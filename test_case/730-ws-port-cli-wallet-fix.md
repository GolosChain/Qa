# Bug description #

By default golosd listens websocket connections on 8091 port. But cli_wallet default is 8090. Ports should be equal so cli_wallet be able to connect local golosd out of the box.

So the easiest way to test this bugfix is to run the `golosd` and then run cli_wallet:
```
./cli_wallet
```

Then run following commands:

```
set_password 1
unlock 1
import_key 5JVFFWRLwz6JoP9kguuRFfytToGU6cLgBVTL9t6NB3D3BQLbUBS
create_account cyberfounder alice "{}" "3.000 GOLOS" true
```

If you've run the 18.0 RC1, then you won't get the node's answer, but in 18.0 RC3 the node will work fine.