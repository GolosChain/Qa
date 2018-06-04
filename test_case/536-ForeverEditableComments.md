*Note: most commands executed in cli_wallet; commands prefixed with "api:" executed via json-rpc api*

1. create post
    * `post_comment alice test "" ptest "Test post!" "<h1>title!</h1><p>hello!</p><hr>test..." "{}" true`
2. check it exist, check `active`, `created`, `cashout_time`, `mode` fields:
    * api: `get_content alice test`
3. edit post and check `content` (`active` field for low_mem) changed
    * `post_comment alice test "" ptest "Test change1" "<h1>changed 1!</h1><hr>test edit" "{}" true`
    * api: `get_content alice test`
4. wait 1 hour (testnet) to cashout
5. check posts `active`, `created`, `cashout_time`, `mode` fields, mode should become `archived`, etc...
    * api: `get_content alice test`
6. edit post again and check it changed (check `active` field in low_mem)
    * `post_comment alice test "" ptest "Edit forever" "<h1>changed in archived state</h1>" "{}" true`
    * api: `get_content alice test`
