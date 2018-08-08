// Provides needed wrappers for golos-js api and broadcast methods   
const golos = require('golos-js');
const logger = require('@logger');
const config = require('@config');

golos.config.set('websocket', config.websocket);
golos.config.set('address_prefix',config.address_prefix);
golos.config.set('chain_id', config.chain_id);

const cyberfounderKey = config.cyberfounderKey;

let OPERATIONS = [];

async function createAccount(newAccountName, keys, creator, fee) {    
    /**
     * accountCreate() new account registration
     * @param {Base58} wif - private active key
     * @param {String} fee - the cost of creating an account. It will be listed by virtue of the voice of the new account
     * @param {String} creator - name of user who registers an account
     * @param {String} newAccountName - new account username
     * @param {Object} owner - object containing a new owner key
     * @param {Object} active - object containing a active key
     * @param {Object} posting - object containing a posting key
     * @param {String} memoKey - new memo key
     * @param {String} jsonMetadata - additional data for a new account (avatar, location, etc.)
    */

    let owner = {
      weight_threshold: 1,
      account_auths: [],
      key_auths: [[keys.owner, 1]]
    };
    let active = {
      weight_threshold: 1,
      account_auths: [],
      key_auths: [[keys.active, 1]]
    };
    let posting = {
      weight_threshold: 1,
      account_auths: [],
      key_auths: [[keys.posting, 1]]
    };
    let memoKey = keys.memo;
    let jsonMetadata = '{}';
    let wif = cyberfounderKey;

    golos.broadcast.accountCreate(wif, fee, creator, newAccountName, owner, active, posting, memoKey, jsonMetadata, function(err, result) {
        if (!err) {
            logger.log('accountCreate', result);
        }
        else {
            logger.log(err);
        }
    });
}

async function generateKeys(userName, password) {
    const keys = await golos.auth.generateKeys(userName, password , ['posting', 'active', 'owner', 'memo']);
    return keys;
}
async function addCreateAccountOpertaion(userName, keys, creator, fee) {

    OPERATIONS.push(
        [ 'account_create',
            {
                fee: fee,
                creator: creator,
                new_account_name: userName,
                owner : {
                    weight_threshold: 1,
                    account_auths: [],
                    key_auths: [
                        [ keys.owner, 1 ]
                    ]
                },
                active : {
                    weight_threshold: 1,
                    account_auths: [],
                    key_auths: [
                        [ keys.active, 1 ]
                    ]
                },
                posting : {
                    weight_threshold: 1,
                    account_auths: [],
                    key_auths: [
                        [ keys.posting, 1 ]
                    ]
                },
                memo_key : keys.memo,
                json_metadata: ''
            }
        ]
    );    
};

async function createPost(author, wif, permlink, parentPermlink, title, body, jsonMetadata) {
    /**
     * comment() add a post
     * @param {Base58} wif - private posting key
     * @param {String} parentAuthor - for add a post, empty field
     * @param {String} parentPermlink - main tag
     * @param {String} author - author of the post
     * @param {String} permlink - url-address of the post
     * @param {String} title - header of the post
     * @param {String} body - text of the post
     * @param {String} jsonMetadata - meta-data of the post (images etc.)
    */
    let parentAuthor = '';
    golos.broadcast.comment(wif, parentAuthor, parentPermlink, author, permlink, title, body, jsonMetadata, function(err, result) {
        if (!err) {
            logger.log('comment', result);
        }
        else { 
            logger.log(err);
        }
    });
}

function addCreatePost(author, permlink, parent_permlink, title, body, json_metadata) {
    let parentAuthor = '';

    OPERATIONS.push(
        [ 'comment',
            {
                parent_author: parentAuthor,
                parent_permlink: parentPermlink,
                author: author,
                permlink: permlink,
                title: title,
                body: body,
                json_metadata: json_metadata
            }
        ]
    );
}

async function createComment(author, keys, permlink, parentAuthor, parentPermlink, body, title, jsonMetadata) {
    /**
     * comment() add a comment
     * @param {Base58} wif - private posting key
     * @param {String} parentAuthor - for add a comment, author of the post
     * @param {String} parentPermlink - for add a comment, url-address of the post
     * @param {String} author - author of the comment
     * @param {String} permlink - unique url-address of the comment
     * @param {String} title - for create a comment, empty field
     * @param {String} body - text of the comment
     * @param {String} jsonMetadata - meta-data of the post (images etc.)
    */
    var wif = keys.posting;
    golos.broadcast.comment(wif, parentAuthor, parentPermlink, author, permlink, title, body, jsonMetadata, function(err, result) {
      //logger.log(err, result);
      if (!err) {
        logger.log('comment', result);
      }
      else logger.log(err);
    });
}

function addCreateComment(author, permlink, parentAuthor, parentPermlink, body, title, jsonMetadata) {
    OPERATIONS.push(
        [ 'comment',
            {
                parent_author: parentAuthor,
                parent_permlink: parentPermlink,
                author: author,
                permlink: permlink,
                title: title,
                body: body,
                json_metadata: json_metadata
            }
        ]
    );
}

async function broadcastOperations() {
    golos.broadcast.send(
        {
            extensions: [], 
            OPERATIONS
        }, [cyberfounderKey], function(err, res) {
            if (err) {
                logger.log(err)
            }
            else {
                logger.log(res)
            }
    })
}

module.exports.createAccount = createAccount;
module.exports.addCreateAccountOpertaion = addCreateAccountOpertaion;
module.exports.createPost = createPost;
module.exports.addCreatePost = addCreatePost;
module.exports.createComment = createComment;
module.exports.addCreateComment = addCreatePost;
module.exports.broadcastOperations = broadcastOperations;
module.exports.generateKeys = generateKeys;
