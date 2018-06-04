https://github.com/GolosChain/golos/issues/665

1. Create post
    * `post_comment cyberfounder test665 "" test "Test post!" "<h1>title!</h1><p>hello!</p><hr>test..." "{}" true`

2. Check that it returned with `get_discussions_by_created`
    * `curl --data '{"method":"call","params":["tags", "get_discussions_by_created",[{"select_authors":["cyberfounder"]}]],"jsonrpc":"2.0","id":0}' http://127.0.0.1:8090/rpc | python -mjson.tool`

3. Check that there is no error when trying to get it with `get_discussions_by_comments` (should return `[]`)
    * `curl --data '{"method":"call","params":["tags", "get_discussions_by_comments",[{"start_author":"cyberfounder"}]],"jsonrpc":"2.0","id":0}' http://127.0.0.1:8090/rpc | python -mjson.tool`

4. Add comment to the post
    * `post_comment cyberfounder re-test665 "cyberfounder" test665 "Re: Test post!" "test..." "{}" true`

5. Check that `get_discussions_by_comments` returns the comment
    * `curl --data '{"method":"call","params":["tags", "get_discussions_by_comments",[{"start_author":"cyberfounder"}]],"jsonrpc":"2.0","id":0}' http://127.0.0.1:8090/rpc | python -mjson.tool`

6. Check that adding `start_permlink` parameter with not-existing value don't cause error
    * `curl --data '{"method":"call","params":["tags", "get_discussions_by_comments",[{"start_author":"cyberfounder","start_permlink":"zzz"}]],"jsonrpc":"2.0","id":0}' http://127.0.0.1:8090/rpc | python -mjson.tool`

7. Check that the comment returned if `start_permlink` is valid
    * `curl --data '{"method":"call","params":["tags", "get_discussions_by_comments",[{"start_author":"cyberfounder","start_permlink":"re-test665"}]],"jsonrpc":"2.0","id":0}' http://127.0.0.1:8090/rpc | python -mjson.tool`

8. Check that `get_tags_used_by_author` returns `[]` for non-existing account
    * `curl --data '{"method":"call","params":["tags", "get_tags_used_by_author",["not-exist"]],"jsonrpc":"2.0","id":0}' http://127.0.0.1:8090/rpc | python -mjson.tool`
