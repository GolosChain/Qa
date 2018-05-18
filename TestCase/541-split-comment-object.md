# Comment object tests #
## cli_wallet ##
- Create post and comment it with it's author
```
    import_key 5JVFFWRLwz6JoP9kguuRFfytToGU6cLgBVTL9t6NB3D3BQLbUBS
    create_account cyberfounder alice "{}" true
    transfer_to_vesting cyberfounder alice "100.000 GOLOS" true
    post_comment alice test "" ptest "Test post!" "<h1>title!</h1><p>hello!</p><hr>test..." "{}" true
    post_comment alice "re-test" alice test "Yet another comment" "Lorem Ipsum dolar" "{}" true

```
- Create post and comment if with another user
```
    import_key 5JVFFWRLwz6JoP9kguuRFfytToGU6cLgBVTL9t6NB3D3BQLbUBS
    create_account cyberfounder alice "{}" true
    create_account cyberfounder bob "{}" true
    transfer_to_vesting cyberfounder alice "100.000 GOLOS" true
    transfer_to_vesting cyberfounder bob "100.000 GOLOS" true
    post_comment alice test_two "" ptest_two "Test post!" "<h1>title!</h1><p>hello!</p><hr>test..." "{}" true
    post_comment bob "re-test_two" alice test_two "comment test title" "comment test body" "{}" true

```

# API calls #
## social_network ##
- get_content_replies
```

    curl -s --data-binary '{"jsonrpc": "2.0","method":"call","params":["social_network", "get_content_replies" ["alice", "test", 10]]}' -H 'content-type: text/plain;' http://0.0.0.0:8090 | json_reformat

```
- get_content
```
    curl -s --data-binary '{"jsonrpc": "2.0","method":"call","params":["social_network", "get_content" ["alice", "test", 10]]}' -H 'content-type: text/plain;' http://0.0.0.0:8090 | json_reformat

```
- get_all_content_replies
```
    curl -s --data-binary '{"jsonrpc": "2.0","method":"call","params":["social_network", "get_all_content_replies" ["alice", "test", 10]]}' -H 'content-type: text/plain;' http://0.0.0.0:8090 | json_reformat

```

## tags ##
- get_trending_tags
- get_tags_used_by_author
```
    curl -s --data-binary '{"jsonrpc": "2.0","method":"call","params":["tags", "get_tags_used_by_author" ["alice"]]}' -H 'content-type: text/plain;' http://0.0.0.0:8090 | json_reformat

```
- get_discussions_by_payout
```
```
- get_discussions_by_trending
```
```
- get_discussions_by_created
```
    curl -s --data-binary '{"jsonrpc": "2.0","method":"call","params":["tags", "get_discussions_by_created",[{"select_authors":["bob"],"limit":10}]]}' -H 'content-type: text/plain;' http://0.0.0.0:8090 | json_reformat
```
- get_discussions_by_active
```
```
- get_discussions_by_cashout
```
```
- get_discussions_by_votes
```
```
- get_discussions_by_children
```
```
- get_discussions_by_hot
```
```
- get_discussions_by_feed
```
```
- get_discussions_by_blog
```
```
- get_discussions_by_comments
```
```
- get_discussions_by_promoted
```
```
- get_discussions_by_author_before_date
```
    curl -s --data-binary '{"jsonrpc": "2.0","method":"call","params":["tags", "get_discussions_by_author_before_date" ["alice", "test", "2018-05-17T06:56:52", 10]]}' -H 'content-type: text/plain;' http://0.0.0.0:8090 | json_reformat

```
- get_languages
```
```

