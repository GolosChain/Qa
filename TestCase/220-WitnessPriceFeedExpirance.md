https://github.com/GolosChain/golos/issues/220

Normally, it's needed to have at least 7 witnesses to see price feed changes, but it's hard to test on 1 node.
So for this test case set `STEEMIT_MIN_FEEDS` to 1 in config.hpp and rebuild `golosd`.

1. on fresh node wait HF18 and check feed history
    * `get_feed_history`
        * expect: current value is 0/0 and `price_history` is empty `[]`
2. update feed, wait a minute and check feed history
    * `publish_feed cyberfounder {"quote":"1.000 GOLOS", "base":"2.000 GBG"} true`
    * `get_feed_history`
        * expect: current value is 1.000/2.000 and `price_history` contains the same value in array
3. wait 60 minutes and check feed history
    * `get_feed_history`
        * expect: `price_history` will contain 60 elements
4. wait 2-3 minutes and check feed history
    * `get_feed_history`
        * expect: no new elements added to `price_history`
5. update feed, wait a minute or two and check feed history
    * `publish_feed cyberfounder {"quote":"2.000 GOLOS", "base":"1.000 GBG"} true`
    * `get_feed_history`
        * expect: new value(s) added to `price_history`
