https://github.com/GolosChain/golos/issues/124

### Check new `duscussion.url` generation
1. Create test posts with different tags cases: no tags, some tags, tags are empty strings, tags malformed
```
post_comment alice test "" ptest "Test post!" "<h1>title!</h1><p>hello!</p><hr>test..." "{}" true
post_comment bob test "" ptest "Bob's test post!" "<h1>title!</h1><p>hello!</p><hr>test..." "{\"tags\":[\"tag1\",\"tag2\"]}" true
post_comment cat test "" ptest "Cat's test post!" "<h1>title!</h1><p>hello!</p><hr>test..." "{\"tags\":[\"\",\"\"]}" true
post_comment dog test "" ptest "Dog's test post!" "<h1>title!</h1><p>hello!</p><hr>test..." "{\"tags\":123}" true
post_comment cyberfounder test "" ptest "another test post!" "<h1>title!</h1><p>hello!</p><hr>test..." "{\"tags\":[\"123\"]}" true
vote cyberfounder alice test 100 true
vote cyberfounder bob test 90 true
```
2. Check `discussion.url` generated correctily

api call|expected `.url`
-|-
`get_content alice test`|`/@alice/test`
`get_content bob test`|`/tag1/@bob/test`
`get_content cat test`|`/@cat/test`
`get_content dog test`|`/@dog/test`

### Check category fields no more exist (one-time check)
Call `get_content`, `get_discussions_by_...`, `follow::get_account`,
returned results should not contain category-related fields
