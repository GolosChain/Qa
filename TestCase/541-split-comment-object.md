#Comment object tests#
##cli_wallet##
- Создание поста и комента к этому посту от автора
```
    import_key 5JVFFWRLwz6JoP9kguuRFfytToGU6cLgBVTL9t6NB3D3BQLbUBS
    create_account cyberfounder alice "{}" true
    transfer_to_vesting cyberfounder alice "100.000 GOLOS" true
    post_comment alice test "" ptest "Test post!" "<h1>title!</h1><p>hello!</p><hr>test..." "{}" true
    post_comment alice "re-test" alice test "Yet another comment" "Lorem Ipsum dolar" "{}" true

```
- Создание поста и комента к этому посту от другого пользователя
```
    import_key 5JVFFWRLwz6JoP9kguuRFfytToGU6cLgBVTL9t6NB3D3BQLbUBS
    create_account cyberfounder alice "{}" true
    create_account cyberfounder bob "{}" true
    transfer_to_vesting cyberfounder alice "100.000 GOLOS" true
    transfer_to_vesting cyberfounder bob "100.000 GOLOS" true
    post_comment alice test_two "" ptest_two "Test post!" "<h1>title!</h1><p>hello!</p><hr>test..." "{}" true
    post_comment bob "re-test_two" alice test_two "comment test title" "comment test body" "{}" true

```

##API calls##
- Вызов get_content_replies
```

    curl -s --data-binary '{"jsonrpc": "2.0","method":"call","params":["social_network", "get_content_replies" ["alice", "test", 10]]}' -H 'content-type: text/plain;' http://0.0.0.0:8090 | json_reformat

```
- Вызов get_content
```
    curl -s --data-binary '{"jsonrpc": "2.0","method":"call","params":["social_network", "get_content" ["alice", "test", 10]]}' -H 'content-type: text/plain;' http://0.0.0.0:8090 | json_reformat

```
- Вызов get_all_content_replies
```
    curl -s --data-binary '{"jsonrpc": "2.0","method":"call","params":["social_network", "get_all_content_replies" ["alice", "test", 10]]}' -H 'content-type: text/plain;' http://0.0.0.0:8090 | json_reformat

```
