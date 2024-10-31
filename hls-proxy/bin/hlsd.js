#! /usr/bin/env node
require("dotenv").config();
const constants = require("../../src/config/constants/constants");
const db = require("../../models/index");
const mail = require("../../src/utils/mail/sendMail");
const userController = require("../../src/controller/userController");
var request = require("request");
const axios = require("axios");
const UserApi = require("../../src/api/user");
const process = require("process");
const {Redis} = require('../../src/redis/redis.js');
const redis = require("../../src/redis/redis.js");
const { addNewUserHistory } = require('../../src/helpers/index.js')
const auth = require("../../src/auth.js");
const { allowWatching } = require('../../src/services/userHistoryService.js')
const cron = require('../../src/cron/index.js')
const {getStartCommandParams} = require('../../helpers.js')
const redisClient = new Redis
redisClient.clearClient()
const isCronNode = JSON.parse(getStartCommandParams('isCronNode') || 0);
if (isCronNode == 1) {
  cron.kernel()
}


const argv_vals = require('./lib/process_argv')

const use_tls = (argv_vals["--tls-cert"] && argv_vals["--tls-key"]) || argv_vals["--tls"]

const normalize_host = (host, port) => {
  if (!host) return null

  const parts = host.split(':')

  if (parts.length > 1) {
    host = parts[0]

    const public_port = parseInt( parts[1], 10 )
    if (! isNaN(public_port))
      port = public_port
  }

  return `${host}:${port}`
}

const server = (use_tls)
  ? require('../servers/start_https')({
      port:     argv_vals["--port"],
      tls_cert: argv_vals["--tls-cert"],
      tls_key:  argv_vals["--tls-key"],
      tls_pass: argv_vals["--tls-pass"]
    })
  : require('../servers/start_http')({
      port:     argv_vals["--port"]
    })

const middleware = require('../proxy')({
  is_secure:                            use_tls,
  host:                                 normalize_host(argv_vals["--host"], argv_vals["--port"]),
  copy_req_headers:                     argv_vals["--copy-req-headers"],
  req_headers:                          argv_vals["--req-headers"],
  req_options:                          argv_vals["--req-options"],
  hooks:                                argv_vals["--hooks"],
  cache_segments:                       argv_vals["--prefetch"],
  max_segments:                         argv_vals["--max-segments"],
  cache_timeout:                        argv_vals["--cache-timeout"],
  cache_key:                            argv_vals["--cache-key"],
  cache_storage:                        argv_vals["--cache-storage"],
  cache_storage_fs_dirpath:             argv_vals["--cache-storage-fs-dirpath"],
  debug_level:                          argv_vals["-v"],
  acl_ip:                               argv_vals["--acl-ip"],
  acl_pass:                             argv_vals["--acl-pass"],
  http_proxy:                           argv_vals["--http-proxy"],
  manifest_extension:                   argv_vals["--manifest-extension"],
  segment_extension:                    argv_vals["--segment-extension"]
})

if (middleware.connection)
  server.on('connection', middleware.connection)

if (middleware.request){
  // server.on('request', middleware.request)

  server.on('request', async (req, res) => {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const pathname = url.pathname.toLowerCase();
    
    if (pathname.endsWith('.m3u8') || pathname.endsWith('.ts')) {
      // middleware.request(req, res);
      try {
        const redisClient = new Redis
        const parsedUrl = new URL(`http://domain/${req.url}`);
        const searchParams = parsedUrl.searchParams; 
        let currentIp = ''
        if (req.headers['x-forwarded-for'] || req.ip) {
          currentIp = (req.headers['x-forwarded-for'] || req.ip)?.split(',')[0].trim();
        } else {
          currentIp = req.socket.remoteAddress
        }
        let username = null;
        let password = null;

        for (const [key, value] of searchParams) {
          if (key == "username") {
            username = value;
          } else if (key == "password") {
            password = value;
          }
        }
        console.log(username, " - ", password);
        if ((username == null || username == 'null') || 
            (password == null || password == 'null')
        ) {
          middleware.request(req, res);
          return;
        }
        let userData = await auth(username, password);
        if (userData) {
          const allowWatchingVal = await allowWatching(currentIp, userData)
          console.log('check allow watching : ', allowWatchingVal, '--> current ip : ', currentIp)
          if (!allowWatchingVal) {
            console.log('not allow watching : ', currentIp)
            // http://103.72.97.184:5005/video/copyright_violation.ts
            // => aHR0cDovLzEwMy43Mi45Ny4xODQ6NTAwNS92aWRlby9jb3B5cmlnaHRfdmlvbGF0aW9uLnRz
            req.url = '/aHR0cDovLzEwMy43Mi45Ny4xODQ6NTAwNS92aWRlby9jb3B5cmlnaHRfdmlvbGF0aW9uLnRz'
          } else {
            console.log('allow watching : ', currentIp)

            const usersInfo = await redisClient.get('users')
            if (usersInfo.success) {
              const newUsersInfo = await addNewUserHistory(usersInfo.data, username, currentIp)
              if (newUsersInfo != null) {
                redisClient.set('users', newUsersInfo)
              }
            }
          }
          middleware.request(req, res);
        } else {
          // http://103.72.97.184:5005/video/url_invalid.ts
          // => aHR0cDovLzEwMy43Mi45Ny4xODQ6NTAwNS92aWRlby91cmxfaW52YWxpZC50cw==
          req.url = '/aHR0cDovLzEwMy43Mi45Ny4xODQ6NTAwNS92aWRlby91cmxfaW52YWxpZC50cw=='
          middleware.request(req, res);
        }
        redisClient.clearClient()
      } catch (e) {
        console.log("error in m3u8 read  : ", e);
      }
      return;
    } else if (pathname == '/adduser') {
      try {
        let body = "";

        req.on("data", function (chunk) {
          body += chunk;
        });

        req.on("end", async function () {
          let bodyData = JSON.parse(body);
          let response = {};
          if (bodyData.token == constants.INTERNAL_TOKEN) {
            response = await userController.addUser(bodyData);
          } else {
            response = {
              err: 1,
              message: "Đã có lỗi, vui lòng thử lại",
            };
          }

          // Gửi phản hồi về cho client
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify(response));
        });
      } catch (e) {
        console.log("error in addUser  : ", e);
      }
      return;
    } else if (pathname == '/updateuser') {
      try {
        let body = "";

        req.on("data", function (chunk) {
          body += chunk;
        });

        req.on("end", async function () {
          let bodyData = JSON.parse(body);
          let response = {};
          if (bodyData.token == constants.INTERNAL_TOKEN) {
            response = await userController.updateUser(bodyData);
          } else {
            response = {
              err: 1,
              message: "Đã có lỗi, vui lòng thử lại",
            };
          }

          // Gửi phản hồi về cho client
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify(response));
        });
      } catch (e) {
        console.log("error in updateUser  : ", e);
      }
      return;
    } else if (pathname == '/usersnumber') {
      try {
        const now = new Date().getTime();
        const sequelize = require("sequelize");
        const count = await db.user_controlers.count({
          attributes: [
            [sequelize.fn("COUNT", sequelize.col("username")), "username_count"],
          ],
          where: {
            lastTimeConnected: { [sequelize.Op.gte]: now - 10000 },
          },
          group: ["username"],
        });
        req.on("end", async function () {
          let response = count;
  
          // Gửi phản hồi về cho client
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify(response));
        });
      } catch (e) {
        console.log("error in usersnumber  : ", e);
      }
      return;
    } else if (pathname == '/cdn/ping') {
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      const index = getStartCommandParams('lbindex') || 1
      res.end('OK' + index);
    } else {
        middleware.request(req, res);

      // Xử lý các request khác ở đây
    //   res.writeHead(404);
    //   res.end('Not Found');
    }
  });
}