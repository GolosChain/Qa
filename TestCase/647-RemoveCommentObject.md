https://github.com/GolosChain/golos/issues/627

1. Check `golos::chain::comment_object` count (call `database_info`)
2. Post comment:
    * `post_comment cyberfounder test627 "" test "Test post!" "<h1>title!</h1><p>hello!</p><hr>test..." "{}" true`
3. Check `golos::chain::comment_object` count again it should grow by 1 (`database_info`)
4. Delete comment:
    *
    ```
    begin_builder_transaction
    add_operation_to_builder_transaction 0 ["delete_comment", {"author":"cyberfounder", "permlink":"test627"}]
    sign_builder_transaction 0 true
    ```
5. Check `golos::chain::comment_object` count again it should return to the same value as in step 1.
