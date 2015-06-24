TwitsFetcher
============

A **jQuery** interface for Twitter!

# Index

  - [Introduction](#introduction)
  - [Requirements](#requirements)
  - [Usage](#usage)
  - [License](#license)

# Introduction

**TwitsFetcher** is a jQuery plugin, that lets you easily retrieve your posts from Twitter!

# Requirements

The only requirement needed is [jQuery](https://jquery.com/download/) that you can install it via [Bower](http://bower.io/).

# Usage

Simply include the TwitsFetcher JS and CSS
```html
<html>
    <head>
        <script type="text/javascript" src="path-to/js/twitfetcher.js"></script>
        <link type="text/css" rel="stylesheet" href="path-to/css/twitfetcher.css" />
    </head>
</html>
```
Create a container with an ID
```html
<div id="myTwitFetcherContainer">
    
</div>
```
and call TwitsFetcher like this!

```javascript
jQuery(document).ready(function ($) {
    $("#twitCt").twitterFetcher({
        widgetid: '999999999999999999', 
        maxTweets: 5,
        enablePermalink: true
    });
});
```
**Params**

| Option | Description | Type | Default value |
| --- | --- | --- | --- |
| **widgetid** | Id of your Twitter widget (see Readme.md to know how to configure it!). This is required to make TwitsFetcher work! | String | null |
| **uniqueId** | If set, TwitsFetcher will trigger a custom event, in case of error, like ("twt-error-"+uniqueId). This is very useful if you get some errors and you are using more than one TwitsFetcher in your page. | String | null |
| **maxTweets** | Max number of twits to retrieve | Number | 20 |
| **enableLinks** | If true, links in twit will be shown | Boolean | true |
| **showRetweet** | If true, posts from other users will be retrieved. Otherwise only posts from user will be shown. | Boolean | true |
| **showImages** | If true, images attached to posts will be shown | Boolean | true |
| **lang** | Language of Twitter server (could be "it"). | string | en |
| **enablePermalink** | If true, a link to the post will be set in the "posted string" | Boolean | false |

# License

Check out LICENSE file (MIT)