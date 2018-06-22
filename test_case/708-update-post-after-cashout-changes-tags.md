# Update post after cashout changes tags. #
## Steps to reproduce ##
- Start daemon with enabled tags-plugin
- Create account alice and post from alice
```
create_account cyberfounder alice "{}" "300.000 GOLOS" true
post_comment alice test "" test "test post!" "post…" "{}" true
```
- Validate tags object has records
```
> curl --data '{"method":"call","params":["database_api","get_database_info",[]],"jsonrpc":"2.0","id":0}' http://127.0.0.1:8090/rpc | python -mjson.tool | grep -A 2 -P "tag_object"
% Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100  3309  100  3220  100    89  2252k  63753 --:--:-- --:--:-- --:--:-- 3144k
                "name": "golos::plugins::tags::tag_object",
                "record_count": 1
            },
```
- Wait the end of cashout window and check no tags:
```
> curl --data '{"method":"call","params":["database_api","get_database_info",[]],"jsonrpc":"2.0","id":0}' http://127.0.0.1:8090/rpc | python -mjson.tool | grep -A 2 -P "tag"
% Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100  3309  100  3220  100    89  2252k  63753 --:--:-- --:--:-- --:--:-- 3144k
                "name": "golos::plugins::tags::tag_object",
                "record_count": 0
            },
```
- Update post
```
post_comment alice test "" test "test post!" "post…" "{}" true
```

**Actual results**
For instance you can take 18.0 RC1 and check.
Tags index has records:
```
curl --data '{"method":"call","params":["database_api","get_database_info",[]],"jsonrpc":"2.0","id":0}' http://127.0.0.1:8090/rpc | python -mjson.tool | grep -A 2 -P "tag"
% Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100  3309  100  3220  100    89  2252k  63753 --:--:-- --:--:-- --:--:-- 3144k
                "name": "golos::plugins::tags::tag_object",
                "record_count": 1
            },
```

**Expected results**
But in 18.0 RC3 everything is fixed and works fine.
Tags index doesn't have records:
```
curl --data '{"method":"call","params":["database_api","get_database_info",[]],"jsonrpc":"2.0","id":0}' http://127.0.0.1:8090/rpc | python -mjson.tool | grep -A 2 -P "tag"
% Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100  3309  100  3220  100    89  2252k  63753 --:--:-- --:--:-- --:--:-- 3144k
                "name": "golos::plugins::tags::tag_object",
                "record_count": 0
            },
```