var express = require('express');
var http = require('http');
var fs = require('fs');
var cheerio = require('cheerio');
var request = require('request');
var querystring = require('querystring');
var bodyParser = require('body-parser');
var util = require('util');

var router = express.Router();
var app = express();

// 引入body-parser中间件来获取传递的参数
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// 爬取文章的序号
var i = 0;
// 爬取的路径
var url = "http://www.ss.pku.edu.cn/index.php/newscenter/news/2391";
// 用来存储接收的参数
// var num = 5;
// 用来存储爬取到的内容
var html1 = [];
// 爬虫主体函数块
startRequest = function (x, num) {
    return new Promise(function (resolve, reject) {
        //采用http模块向服务器发起一次get请求
        http.get(x, function (res) {
            var html = '';        //用来存储请求网页的整个html内容
            var titles = [];
            res.setEncoding('utf-8'); //防止中文乱码
            //监听data事件，每次取一块数据
            res.on('data', function (chunk) {
                html += chunk;
            });
            //监听end事件，如果整个网页内容的html都获取完毕，就执行回调函数
            res.on('end', function () {
                var $ = cheerio.load(html); //采用cheerio模块解析html
                var time = $('.article-info a:first-child').next().text().trim();
                var news_item = {
                    //获取文章的标题
                    title: $('div.article-title a').text().trim(),
                    //获取文章发布的时间
                    Time: time,
                    //获取当前文章的url
                    link: "http://www.ss.pku.edu.cn" + $("div.article-title a").attr('href'),
                    //获取供稿单位
                    author: $('[title=供稿]').text().trim(),
                    //i是用来判断获取了多少篇文章
                    i: i = i + 1,
                };
                console.log(news_item);     //打印新闻信息
                html1.push(news_item.title);
                var news_title = $('div.article-title a').text().trim();
                //下一篇文章的url
                var nextLink = "http://www.ss.pku.edu.cn" + $("li.next a").attr('href');
                str1 = nextLink.split('-');  //去除掉url后面的中文
                str = encodeURI(str1[0]);
                //这是亮点之一，通过控制I,可以控制爬取多少篇文章.
                if (i >= num) {
                    // startRequest(str, num);
                    resolve({bool: 1, url: str, data: html1});
                    //清除数据，以保证重新刷新后数据正常
                    html1 = [];
                    i=0;
                    str = "";
                } else {
                    resolve({bool: 0, url: str, data: html1});
                }
            });
            // setTimeout(function () {
            //     resolve(html1);
            // }, 2000);
        }).on('error', function (err) {
            console.log(err);
        });
    })
}


/* GET home page. */
router.post('/index/', function (req, res, next) {
    // 爬取的路径
    var url = "http://www.ss.pku.edu.cn/index.php/newscenter/news/2391";
    var start = async function () {
        let num = req.body.num;
        // let ht = await startRequest(url, num);
        // let data = "";
        let whe = 0;
        let ht = '';
        while (!whe) {
            ht = await startRequest(url, num);
            url = ht.url;
            whe = ht.bool;
            // data += ht.data;
        }
       
        await res.send({title: ht.data});
        data = '';
    };
    start();
});

module.exports = router;
