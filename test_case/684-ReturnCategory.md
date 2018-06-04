https://github.com/GolosChain/golos/issues/684

1. Create test posts with different tags cases: no tags, some tags, tags are empty strings, tags malformed
```
post_comment alice test "" ptest "Test post!" "<h1>title!</h1><p>hello!</p><hr>test..." "{}" true
post_comment bob test "" ptest "Bob's test post!" "<h1>title!</h1><p>hello!</p><hr>test..." "{\"tags\":[\"tag1\",\"tag2\"]}" true
post_comment cat test "" ptest "Cat's test post!" "<h1>title!</h1><p>hello!</p><hr>test..." "{\"tags\":[\"\",\"\"]}" true
post_comment dog test "" ptest "Dog's test post!" "<h1>title!</h1><p>hello!</p><hr>test..." "{\"tags\":123}" true
post_comment cyberfounder test "" ptest "another test post!" "<h1>title!</h1><p>hello!</p><hr>test..." "{\"tags\":[\"123\"]}" true
```

2. Check that posts' `discussion.url` generated correctly using parent_permlink and not depends on tags anymore

api call|expected `.url`
-|-
`get_content alice test`|`/ptest/@alice/test`
`get_content bob test`|`/ptest/@bob/test`
`get_content cat test`|`/ptest/@cat/test`
`get_content dog test`|`/ptest/@dog/test`

3. Add test comments for that posts
```
post_comment alice re-test alice test "Re: Test post!" "comment1" "{}" true
post_comment bob re-test bob test "Re: Test post!" "comment2" "{}" true
```

4. Check that comments' `discussion.url` generated correctly using root_permlink and not depends on tags

api call|expected `.url`
-|-
`get_content alice re-test`|`/ptest/@alice/test#@alice/re-test`
`get_content bob re-test`|`/ptest/@bob/test#@bob/re-test`
