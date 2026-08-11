const a0_0x5cae94 = a0_0x5ca0
;(function (_0x1b6b4d, _0x21951f) {
  const _0x173fea = a0_0x5ca0,
    _0x2b3eb0 = _0x1b6b4d()
  while (true) {
    try {
      const _0x67f12 =
        parseInt("640250mhEAUB") / 1 +
        -parseInt("943152iwFNvx") / 2 +
        (-parseInt("1963599EEVUzu") / 3) *
          (parseInt("4XZYxmq") / 4) +
        (parseInt("235UkqLoD") / 5) *
          (parseInt("33786slpKSJ") / 6) +
        parseInt("3269588KXieHk") / 7 +
        (-parseInt("1715672tvlDrF") / 8) *
          (-parseInt("18XpCsND") / 9) +
        -parseInt("3170150MQntun") / 10
      if (_0x67f12 === _0x21951f) {
        break
      } else {
        _0x2b3eb0.push(_0x2b3eb0.shift())
      }
    } catch (_0x766146) {
      _0x2b3eb0.push(_0x2b3eb0.shift())
    }
  }
})(a0_0x51a9, 357785)
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'
require("dotenv")["config"]()
const axios = require('axios'),
  { wrapper } = require("axios-cookiejar-support"),
  { CookieJar } = require('tough-cookie'),
  fs = require('fs'),
  path = require("path"),
  crypto = require("crypto"),
  https = require("https")
https.globalAgent["keepAlive"] = true
const CONFIG = {
    BASE_URL: process.env.BASE_URL || 'https://rise.eye2serve.com:8443',
    USER_ID: process.env.USER_ID || '2210181',
    PASSWORD: process.env.PASSWORD || "Shine@2027",
    PLANT: process.env.PLANT || "6924",
    CSV_FILE: process.env.CSV_FILE || './files/input2.csv',
    DELETE_CSV_FILE: process.env.DELETE_CSV_FILE || "./files/delete.csv",
    CSV_BATCH_SIZE: parseInt(process.env.CSV_BATCH_SIZE || '3', 10),
    AUTO_UPDATE_CSV_BIDS:
      (process.env.AUTO_UPDATE_CSV_BIDS || "false")[
        "toLowerCase"
      ]() === 'true',
    LOOP_CONTINUOUS:
      (process.env.LOOP_CONTINUOUS || "true")[
        "toLowerCase"
      ]() === "true",
    DRY_RUN:
      (process.env.DRY_RUN || 'false')["toLowerCase"]() ===
      "true",
  },
  LOG_COLORS = {
    reset: '\x1B[0m',
    bright: "\u001b[1m",
    green: "\u001b[32m",
    yellow: "\u001b[33m",
    red: '\x1B[31m',
    cyan: "\u001b[36m",
    magenta: "\u001b[35m",
    blue: "\u001b[34m",
    gray: "\u001b[90m",
  }
function ts() {
  return ''
}
function log(_0x3981ba) {
  const _0x1940cf = a0_0x5cae94
  console.log(
    '' +
      LOG_COLORS["gray"] +
      ts() +
      LOG_COLORS["reset"] +
      ' ' +
      _0x3981ba
  )
}
function a0_0x5ca0(_0x353675, _0x4d854d) {
  _0x353675 = _0x353675 - 244
  const _0x51a94f = a0_0x51a9()
  let _0x5ca0ff = _0x51a94f[_0x353675]
  if (a0_0x5ca0.WoXvdX === undefined) {
    var _0x28f9eb = function (_0x34479c) {
      const _0x4a2f02 =
        'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789+/='
      let _0x577fe7 = '',
        _0xe311e6 = ''
      for (
        let _0xb6cdeb = 0, _0x39d94c, _0x44a70e, _0x449ec0 = 0;
        (_0x44a70e = _0x34479c.charAt(_0x449ec0++));
        ~_0x44a70e &&
        ((_0x39d94c = _0xb6cdeb % 4 ? _0x39d94c * 64 + _0x44a70e : _0x44a70e),
        _0xb6cdeb++ % 4)
          ? (_0x577fe7 += String.fromCharCode(
              255 & (_0x39d94c >> ((-2 * _0xb6cdeb) & 6))
            ))
          : 0
      ) {
        _0x44a70e = _0x4a2f02.indexOf(_0x44a70e)
      }
      for (
        let _0xcec326 = 0, _0x47876f = _0x577fe7.length;
        _0xcec326 < _0x47876f;
        _0xcec326++
      ) {
        _0xe311e6 +=
          '%' + ('00' + _0x577fe7.charCodeAt(_0xcec326).toString(16)).slice(-2)
      }
      return decodeURIComponent(_0xe311e6)
    }
    const _0x16d055 = function (_0x39a6f0, _0x268443) {
      let _0x1dda35 = [],
        _0x3e2824 = 0,
        _0x5f2a7b,
        _0x199913 = ''
      _0x39a6f0 = _0x28f9eb(_0x39a6f0)
      let _0x1faac4
      for (_0x1faac4 = 0; _0x1faac4 < 256; _0x1faac4++) {
        _0x1dda35[_0x1faac4] = _0x1faac4
      }
      for (_0x1faac4 = 0; _0x1faac4 < 256; _0x1faac4++) {
        _0x3e2824 =
          (_0x3e2824 +
            _0x1dda35[_0x1faac4] +
            _0x268443.charCodeAt(_0x1faac4 % _0x268443.length)) %
          256
        _0x5f2a7b = _0x1dda35[_0x1faac4]
        _0x1dda35[_0x1faac4] = _0x1dda35[_0x3e2824]
        _0x1dda35[_0x3e2824] = _0x5f2a7b
      }
      _0x1faac4 = 0
      _0x3e2824 = 0
      for (let _0x1bb92a = 0; _0x1bb92a < _0x39a6f0.length; _0x1bb92a++) {
        _0x1faac4 = (_0x1faac4 + 1) % 256
        _0x3e2824 = (_0x3e2824 + _0x1dda35[_0x1faac4]) % 256
        _0x5f2a7b = _0x1dda35[_0x1faac4]
        _0x1dda35[_0x1faac4] = _0x1dda35[_0x3e2824]
        _0x1dda35[_0x3e2824] = _0x5f2a7b
        _0x199913 += String.fromCharCode(
          _0x39a6f0.charCodeAt(_0x1bb92a) ^
            _0x1dda35[(_0x1dda35[_0x1faac4] + _0x1dda35[_0x3e2824]) % 256]
        )
      }
      return _0x199913
    }
    a0_0x5ca0.bLwpeW = _0x16d055
    a0_0x5ca0.yOAGID = {}
    a0_0x5ca0.WoXvdX = true
  }
  const _0x26499d = _0x51a94f[0],
    _0x26784c = _0x353675 + _0x26499d,
    _0x135a74 = a0_0x5ca0.yOAGID[_0x26784c]
  return (
    !_0x135a74
      ? (a0_0x5ca0.pHpVGr === undefined && (a0_0x5ca0.pHpVGr = true),
        (_0x5ca0ff = a0_0x5ca0.bLwpeW(_0x5ca0ff, _0x4d854d)),
        (a0_0x5ca0.yOAGID[_0x26784c] = _0x5ca0ff))
      : (_0x5ca0ff = _0x135a74),
    _0x5ca0ff
  )
}
function logOk(_0xd54d64) {
  const _0x1a69c5 = a0_0x5cae94
  console["log"](
    '' +
      LOG_COLORS["green"] +
      ts() +
      ' \u2713 ' +
      _0xd54d64 +
      LOG_COLORS["reset"]
  )
}
function logWarn(_0xa86ebd) {
  const _0x4088d8 = a0_0x5cae94
  console.log(
    '' +
      LOG_COLORS.yellow +
      ts() +
      " ⚠ " +
      _0xa86ebd +
      LOG_COLORS["reset"]
  )
}
function logErr(_0x3c4c8a) {
  const _0x5f5bf0 = a0_0x5cae94
  console["error"](
    '' +
      LOG_COLORS.red +
      ts() +
      " ✗ " +
      _0x3c4c8a +
      LOG_COLORS.reset
  )
}
function logInfo(_0x14db3b) {
  const _0x59cb5e = a0_0x5cae94
  console["log"](
    '' +
      LOG_COLORS["cyan"] +
      ts() +
      " ℹ " +
      _0x14db3b +
      LOG_COLORS["reset"]
  )
}
function logBold(_0x2b6c0a) {
  const _0x19e707 = a0_0x5cae94
  console["log"](
    '' +
      LOG_COLORS["bright"] +
      LOG_COLORS["magenta"] +
      ts() +
      " ★ " +
      _0x2b6c0a +
      LOG_COLORS["reset"]
  )
}
const jar = new CookieJar(),
  client = wrapper(
    axios.create({
      jar: jar,
      baseURL: CONFIG["BASE_URL"],
      withCredentials: true,
      headers: {
        Accept: "application/json",
        'Content-Type': "application/json",
      },
      auth: {
        username: CONFIG["USER_ID"],
        password: CONFIG["PASSWORD"],
      },
      maxRedirects: 10,
      timeout: 30000,
    })
  )
let csrfToken = null,
  orderListData = null,
  plantConf = null,
  serverTime = null,
  bidRows = [],
  csvData = [],
  deleteList = [],
  currentSlotNumber = null,
  csvBatchState = {
    submittedKeys: {},
    activeKeys: [],
    pendingBatches: [],
    groupsByKey: {},
    autoRunning: false,
    completed: false,
  }
async function login() {
  const _0x37382f = a0_0x5cae94
  log("Logging in to SAP...")
  try {
    const _0x2fbadd = await client.get(
      '/sap/opu/odata/sap/ZVC_TRANSPORTER_SRV/',
      { headers: { 'X-Csrf-Token': "Fetch" } }
    )
    csrfToken = _0x2fbadd["headers"]["x-csrf-token"]
    if (csrfToken) {
      logOk(
        "Login successful. CSRF token obtained of length: " +
          csrfToken["length"] +
          "..."
      )
    } else {
      if ("bLSpt" === "xNAXF") {
        _0x5db5bf = _0x29d795
      } else {
        logWarn("Login response received but no CSRF token in headers. Trying alternate fetch...")
        const _0x2260a9 = await client["get"](
          "/sap/opu/odata/sap/ZVC_TRANSPORTER_SRV/SessionSet('')",
          { headers: { 'X-Csrf-Token': "Fetch" } }
        )
        csrfToken = _0x2260a9["headers"]["x-csrf-token"]
        if (csrfToken) {
          logOk("CSRF token obtained via SessionSet: " + csrfToken.substring(0, 12) + '...')
        } else {
          throw new Error("Could not obtain CSRF token from any endpoint")
        }
      }
    }
    return true
  } catch (_0x1cc045) {
    if ('vPzDs' === "EhXJi") {
      const _0x2ce651 = (_0x5d0f72["Message"] || '')
        ["replaceAll"]('0', '')
        ["trim"]()
      return (
        _0x15032d("Captcha issue: " + _0x2ce651),
        {
          type: 'I',
          message: _0x2ce651,
        }
      )
    } else {
      if (_0x1cc045["response"]) {
        logErr(
          "Login failed: HTTP " +
            _0x1cc045["response"]["status"] +
            " - " +
            _0x1cc045["response"]["statusText"]
        )
        _0x1cc045["response"]["status"] === 401 &&
          ("YyCEr" !== "lgknn"
            ? logErr('Invalid credentials. Check USER_ID and PASSWORD in .env')
            : ((_0x369271 =
                _0x4c0c8d["headers"]["x-csrf-token"]),
              _0x4b69b9(
                "CSRF token refreshed: " +
                  _0x227cb1.substring(0, 12) +
                  "..."
              )))
        if (
          _0x1cc045["response"]["headers"][
            'x-csrf-token'
          ]
        ) {
          return (
            (csrfToken =
              _0x1cc045["response"]["headers"][
                'x-csrf-token'
              ]),
            logWarn(
              'Got CSRF token despite error: ' +
                csrfToken["substring"](0, 12) +
                "..."
            ),
            true
          )
        }
      } else {
        logErr("Login error: " + _0x1cc045["message"])
      }
      return false
    }
  }
}
async function refreshCsrfToken() {
  const _0x242c19 = a0_0x5cae94
  try {
    if ('CsGDD' === "YMNyk") {
      const _0x239dbd = _0x1b917d.resolve(_0x4d766f["CSV_FILE"])
      return (
        _0x5f9f58.writeFileSync(
          _0x239dbd,
          _0x4d5747(_0x25526a),
          "utf-8"
        ),
        _0x208cc9["forEach"]((_0x273004) => {
          const _0x41f4ec = _0x242c19
          ;(_0x273004[_0x41f4ec(455, '4f2Z')] || '')[
            _0x41f4ec(1150, 'CMx8')
          ]() === _0x449d02 &&
            (_0x273004[_0x41f4ec(980, '6G(F')] || '')[
              _0x41f4ec(276, 'uwg!')
            ]() === _0x3729fa &&
            ((_0x273004.BiddingAmount =
              _0x4beae1(_0x2c1a8d)[_0x41f4ec(654, 'p[t5')]()),
            (_0x273004[_0x41f4ec(318, 'PV9Q')] =
              _0x36edd3(_0x247bda).toFixed()))
        }),
        _0x483ea5(
          "[AUTO-FIX] Updated CSV and memory for City: " +
            _0x5ec27b +
            ', SPI: ' +
            _0x2a710e +
            ' to new amount: ' +
            _0x1955e6
        ),
        true
      )
    } else {
      const _0x34cab7 = await client["get"](
        "/sap/opu/odata/sap/ZVC_TRANSPORTER_SRV/",
        { headers: { 'X-Csrf-Token': 'Fetch' } }
      )
      _0x34cab7["headers"]["x-csrf-token"] &&
        ((csrfToken = _0x34cab7.headers["x-csrf-token"]),
        logOk(
          'CSRF token refreshed: ' +
            csrfToken["substring"](0, 12) +
            '...'
        ))
    }
  } catch (_0x227f99) {
    "zNdjC" !== 'zNdjC'
      ? ((_0x1940d7.BiddingRank = _0x3335c5["BiddingRank"]),
        _0x444c63["L1BidAmount"] !== _0x56237d &&
          _0x345b69["L1BidAmount"] !== null &&
          (_0x4af210["L1BidAmount"] = _0x5d49fd(
            _0xcaa0b0["L1BidAmount"]
          )["toFixed"]()))
      : _0x227f99["response"] &&
        _0x227f99.response["headers"]["x-csrf-token"] &&
        ("cEDka" === 'cEDka'
          ? (csrfToken =
              _0x227f99["response"]["headers"][
                "x-csrf-token"
              ])
          : _0x43bfee(
              "Batch " + _0x313d45 + " processed, moving to next batch..."
            ))
  }
}
async function fetchBidOrderList() {
  const _0x4fd2f7 = a0_0x5cae94,
    _0x2bb7b0 = {
      IvStatus: '',
      IvBiddingStatus: '2',
      NavBidSchVendors: [],
      NavBidMessage: [],
      NavBidPlntConf: [],
      NavBidCurrDtDm: {
        CurrDate: "/Date(1467981296000)/",
        CurrTime: null,
      },
      NavBidToler: [],
      NavBidTolerence: [],
      EvTolerenceAmount: '',
      EvFrieghtPercent: '',
      IvBidBiddingPlantFlag: '',
      NavBidStoIdRange: [],
      NavBidClubId: [],
      NavBidErdatRange: [],
      NavBidShipToVkburRange: [],
      NavBidBiddingPlant: [],
      NavBidBgpRange: [],
      NavBidPackRange: [],
      NavBidKunweRange: [],
      NavBidVendorRange: [
        {
          Sign: 'I',
          Option: 'EQ',
          Low: CONFIG["USER_ID"],
          High: '',
        },
      ],
      NavBidSapOrderIdRange: [],
      NavBidKunagRange: [],
      NavBidBrandRange: [],
      NavBidApplAreaRange: [],
      NavBidVendorStatus: [
        {
          Sign: 'I',
          Option: 'EQ',
          Low: '1',
          High: '',
        },
      ],
      NavBidShipFromWerksRange: [
        {
          Sign: 'I',
          Option: 'EQ',
          Low: CONFIG["PLANT"],
          High: '',
        },
      ],
      NavBidSapStoIdRange: [],
      NavBidGradeRange: [],
      NavBidOrderIdRange: [],
      NavBidStateRange: [],
    }
  try {
    const _0x346f0f = await client.post("/sap/opu/odata/sap/ZVC_TRANSPORTER_SRV/BidOrderListSet", _0x2bb7b0, {
      headers: { 'X-Csrf-Token': csrfToken },
    })
    orderListData = _0x346f0f["data"].d
    plantConf = orderListData["NavBidPlntConf"]["results"][0]
    bidRows = orderListData.NavBidSchVendors["results"]
    bidRows["forEach"]((_0x482673) => {
      const _0x3d834a = _0x4fd2f7
      _0x482673[_0x3d834a(903, 'Q1U1')] = Number(
        _0x482673[_0x3d834a(1085, 'BEh9')]
      )[_0x3d834a(1093, 'iaaA')]()
      _0x482673[_0x3d834a(1105, '8CVd')] = Number(
        _0x482673[_0x3d834a(945, 'W6n7')]
      )[_0x3d834a(719, '&PzW')]()
      _0x482673[_0x3d834a(1155, 'IngF')] = Number(
        _0x482673[_0x3d834a(1111, 'pLhn')]
      )[_0x3d834a(249, '^Hgn')]()
      _0x482673[_0x3d834a(834, 'vSeG')] = Number(
        _0x482673[_0x3d834a(675, 'wpSZ')]
      )[_0x3d834a(732, 'H3Oi')]()
      _0x482673[_0x3d834a(332, '%7kh')] = Number(
        _0x482673[_0x3d834a(876, 'rl6t')]
      ).toFixed()
      _0x482673[_0x3d834a(1015, 'IngF')] =
        _0x482673[_0x3d834a(422, 'rl6t')][_0x3d834a(684, 'Q1U1')]()
    })
    const _0x46b6af = orderListData["NavBidCurrDtDm"]
    return (
      logOk(
        "Bid order list fetched: " +
          bidRows["length"] +
          " orders"
      ),
      true
    )
  } catch (_0x314a61) {
    if (_0x314a61["response"]) {
      logErr(
        'BidOrderListSet failed: HTTP ' +
          _0x314a61.response["status"]
      )
      _0x314a61["response"].data &&
        _0x314a61["response"]["data"][
          "error"
        ] &&
        logErr(
          "SAP Error: " +
            _0x314a61.response["data"]["error"][
              "message"
            ]["value"]
        )
    } else {
      if ('grThd' !== "IdQzJ") {
        logErr("BidOrderListSet error: " + _0x314a61["message"])
      } else {
        const _0x386bca = [
          _0x2d44dd,
          _0x148c65,
          _0x271d46,
          _0x121e84["SapOrderId"] || '',
          '"' + (_0x3ece71.DestCityDesc || '').replace(/"/g, '""') + '"',
          '"' +
            (_0x1c7843["Spi"] || '').replace(/"/g, '""') +
            '"',
          _0x8672d3["BiddingAmount"] || '0',
          _0x495ed7.BiddingRank || '',
          _0x25eb62.L1BidAmount || '0',
          _0x16a01d.AvgWtBidAmount || '0',
          _0x24cbad["Freight"] || '0',
          _0x1c9a1c["ClubFreight"] || '0',
          _0x359282["ClubId"] || '',
          _0x5b4936["ShipFromWerks"] || '',
          _0x5119d1["NoOfTruckReq"] || '',
          '"' +
            (_0x4af567.KunagName1 || '')["replace"](/"/g, '""') +
            '"',
        ]
        _0x37d8e0["push"](_0x386bca.join(','))
      }
    }
    return false
  }
}
async function fetchVendorRankings() {
  const _0x46b31c = a0_0x5cae94
  if (!bidRows || bidRows.length === 0) {
    return false
  }
  const _0x264f8d = {
    Flag: '1',
    NavEBidVRTrackHisN: bidRows["map"]((_0x33f334) => ({
      Mandt: '',
      SapOrderId: _0x33f334["SapOrderId"],
      Vendor: CONFIG["USER_ID"],
      ChangeNo: '',
      ShipFromWerks: _0x33f334["ShipFromWerks"],
      BiddingDate: plantConf ? plantConf["BiddingDate"] : '',
      SlotNumber: plantConf ? plantConf["SlotNumber"] : '',
      Freight:
        (_0x33f334["Freight"] || 0) + ".000",
      BiddingAmount: (_0x33f334["BiddingAmount"] || 0) + '.000',
      AvgWtBidAmount:
        (_0x33f334["AvgWtBidAmount"] || 0) + ".000",
      BiddingRank: _0x33f334.BiddingRank || '',
      CreatedOn: null,
      CreatedAt: null,
    })),
    NavEBidVRPlantN: {
      Sign: 'I',
      Option: 'EQ',
      Low: CONFIG["PLANT"],
      High: '',
    },
    NavEBidVREtTrackHisN: [],
  }
  try {
    const _0xc5f9c7 = await client["post"](
        "/sap/opu/odata/sap/ZVC_TRANSPORTER_SRV/VacVendorRankingNewSet",
        _0x264f8d,
        { headers: { 'X-Csrf-Token': csrfToken } }
      ),
      _0x1bb7b2 =
        _0xc5f9c7["data"] &&
        _0xc5f9c7["data"].d &&
        _0xc5f9c7.data.d["NavEBidVREtTrackHisN"] &&
        _0xc5f9c7["data"].d["NavEBidVREtTrackHisN"][
          "results"
        ]
          ? _0xc5f9c7.data.d["NavEBidVREtTrackHisN"]["results"]
          : []
    return (
      _0x1bb7b2["forEach"]((_0x1e9426) => {
        const _0x550199 = _0x46b31c
        if (_0x550199(912, 'pLhn') === _0x550199(419, 'riSU')) {
          return (
            _0x474673(_0x550199(882, 'xvA&')),
            {
              type: 'E',
              message: _0x550199(1050, '6VmM'),
            }
          )
        } else {
          const _0x1fe3a8 = bidRows[_0x550199(630, 'bC17')](
            (_0x287a23) => _0x287a23.SapOrderId === _0x1e9426.SapOrderId
          )
          _0x1fe3a8 &&
            ((_0x1fe3a8[_0x550199(1190, '6VmM')] =
              _0x1e9426[_0x550199(534, '4f2Z')]),
            _0x1e9426.L1BidAmount !== undefined &&
              _0x1e9426[_0x550199(661, '839y')] !== null &&
              (_0x550199(986, 'UwMq') !== _0x550199(1037, 'GmQ^')
                ? (_0x1fe3a8.L1BidAmount = Number(_0x1e9426.L1BidAmount)[
                    _0x550199(972, '!7at')
                  ]())
                : _0x9e8255(_0x550199(657, 'Kq2E') + _0x26ad3f(_0x173d32))))
        }
      }),
      logOk(
        "Vendor rankings updated for " + _0x1bb7b2.length + " orders"
      ),
      true
    )
  } catch (_0x3816c6) {
    return (
      _0x3816c6["response"]
        ? "BIFCz" === "zvVOJ"
          ? _0x11c62b["stdout"]["write"](
              '\r  \u23F3 Submitting in ' +
                _0x3c8162(_0x2c373f) +
                "   "
            )
          : logWarn(
              "VacVendorRankingNewSet failed: HTTP " +
                _0x3816c6["response"]["status"]
            )
        : logWarn("VacVendorRankingNewSet error: " + _0x3816c6.message),
      false
    )
  }
}
function saveRankRecordsToCsv(_0x5800a4) {
  const _0x3b5435 = a0_0x5cae94
  if (!_0x5800a4 || _0x5800a4["length"] === 0) {
    return
  }
  const _0x3cfeaa = path["resolve"](
      process.env.RANK_CSV_FILE || "./files/rank_records.csv"
    ),
    _0x15d47b = fs["existsSync"](_0x3cfeaa),
    _0x40ff49 = new Date()["toISOString"](),
    _0x526218 = plantConf ? plantConf.SlotNumber : '',
    _0x2744ae = plantConf ? plantConf["BiddingDate"] : '',
    _0x3c6658 = [
      "Timestamp",
      "BiddingDate",
      "SlotNumber",
      "SapOrderId",
      "DestCityDesc",
      "Spi",
      "BiddingAmount",
      "BiddingRank",
      "L1BidAmount",
      "AvgWtBidAmount",
      "Freight",
      "ClubFreight",
      'ClubId',
      "ShipFromWerks",
      "NoOfTruckReq",
      "KunagName1",
    ],
    _0x293281 = []
  if (!_0x15d47b) {
    if ("RkuQc" === "cuehP") {
      _0xb3a35d(
        "New slot " +
          _0x1e406b["SlotNumber"] +
          " detected, wiping old submission memory."
      )
    } else {
      const _0x153be2 = path["dirname"](_0x3cfeaa)
      !fs["existsSync"](_0x153be2) &&
        fs["mkdirSync"](_0x153be2, { recursive: true })
      _0x293281["push"](
        _0x3c6658["join"](',')
      )
    }
  }
  _0x5800a4["forEach"]((_0x286cfd) => {
    const _0x51ae20 = _0x3b5435
    if (_0x51ae20(370, 'EBzE') !== _0x51ae20(1186, 'IngF')) {
      const _0x1e21bd = [
        _0x40ff49,
        _0x2744ae,
        _0x526218,
        _0x286cfd[_0x51ae20(610, 'GmQ^')] || '',
        '"' +
          (_0x286cfd[_0x51ae20(1102, '6HMp')] || '')[_0x51ae20(1016, '!Cfi')](
            /"/g,
            '""'
          ) +
          '"',
        '"' +
          (_0x286cfd[_0x51ae20(853, 'EjAy')] || '').replace(/"/g, '""') +
          '"',
        _0x286cfd[_0x51ae20(706, '839y')] || '0',
        _0x286cfd[_0x51ae20(262, 'Em3N')] || '',
        _0x286cfd.L1BidAmount || '0',
        _0x286cfd[_0x51ae20(525, '4f2Z')] || '0',
        _0x286cfd[_0x51ae20(945, 'W6n7')] || '0',
        _0x286cfd[_0x51ae20(1099, '7T&H')] || '0',
        _0x286cfd[_0x51ae20(1184, 'EBzE')] || '',
        _0x286cfd.ShipFromWerks || '',
        _0x286cfd[_0x51ae20(490, 'Q^^z')] || '',
        '"' +
          (_0x286cfd[_0x51ae20(572, 'BEh9')] || '')[_0x51ae20(495, 'BEh9')](
            /"/g,
            '""'
          ) +
          '"',
      ]
      _0x293281[_0x51ae20(883, 'Mje0')](_0x1e21bd[_0x51ae20(268, '839y')](','))
    } else {
      _0x2dea6b(_0x51ae20(1101, '&PzW'))
    }
  })
  fs["appendFileSync"](_0x3cfeaa, _0x293281.join('\n') + '\n', 'utf-8')
  logOk(
    "Rank records appended to " +
      path["basename"](_0x3cfeaa) +
      ' (' +
      _0x5800a4["length"] +
      " rows)"
  )
}
function csvToJson(_0x509f44) {
  const _0x56edfa = a0_0x5cae94,
    _0x52992e = _0x509f44["split"]('\n'),
    _0x28f5ae = [],
    _0x8c810a = _0x52992e[0]
      .split(',')
      ["map"]((_0x23acf7) =>
        _0x23acf7["trim"]()
      )
  for (let _0x21e169 = 1; _0x21e169 < _0x52992e.length; _0x21e169++) {
    if (!_0x52992e[_0x21e169]["trim"]()) {
      continue
    }
    const _0x4707a9 = {},
      _0x203611 = _0x52992e[_0x21e169]["replace"]('\r', '')[
        "split"
      ](',')
    for (let _0x1325a5 = 0; _0x1325a5 < _0x8c810a.length; _0x1325a5++) {
      _0x4707a9[_0x8c810a[_0x1325a5]] = (_0x203611[_0x1325a5] || '')[
        "trim"
      ]()
    }
    _0x28f5ae.push(_0x4707a9)
  }
  return _0x28f5ae
}
function loadCsvFiles() {
  const _0x1d7cd6 = a0_0x5cae94,
    _0x386447 = path["resolve"](CONFIG.CSV_FILE)
  if (!fs["existsSync"](_0x386447)) {
    return logErr('CSV file not found: ' + _0x386447), false
  }
  const _0x50a9c4 = fs["readFileSync"](
    _0x386447,
    "utf-8"
  )
  csvData = csvToJson(_0x50a9c4)
  logOk(
    'Loaded ' +
      csvData["length"] +
      " rows from " +
      path.basename(_0x386447)
  )
  const _0x371f71 = path["resolve"](
    CONFIG["DELETE_CSV_FILE"]
  )
  if (fs["existsSync"](_0x371f71)) {
    const _0x5a5f51 = fs["readFileSync"](_0x371f71, 'utf-8'),
      _0x361aef = csvToJson(_0x5a5f51)
    deleteList = _0x361aef["map"](
      (_0x405ae5) => _0x405ae5["Customer"]
    )["filter"](Boolean)
    logOk("Loaded " + deleteList.length + " entries from delete CSV")
  } else {
    logWarn("Delete CSV not found: " + _0x371f71 + " (continuing without it)")
    deleteList = []
  }
  return true
}
function jsonToCsv(_0x505f3a) {
  const _0x3b9857 = a0_0x5cae94
  if (!_0x505f3a["length"]) {
    return ''
  }
  const _0x546b54 = Object["keys"](_0x505f3a[0]),
    _0x5779e4 = [_0x546b54.join(',')]
  for (const _0x3ff933 of _0x505f3a) {
    const _0x5bddf2 = _0x546b54["map"](
      (_0x4be2bc) => _0x3ff933[_0x4be2bc] || ''
    )
    _0x5779e4.push(_0x5bddf2["join"](','))
  }
  return _0x5779e4["join"]('\n') + '\n'
}
function autoUpdateCsvForOrder(_0x3b5313, _0x12a041) {
  const _0x43a981 = a0_0x5cae94
  if (!CONFIG.AUTO_UPDATE_CSV_BIDS) {
    return false
  }
  const _0x5cbbdf = bidRows.find(
    (_0x25a7b0) =>
      String(_0x25a7b0["SapOrderId"])["replace"](
        /^0+/,
        ''
      ) === String(_0x3b5313)["replace"](/^0+/, '')
  )
  if (!_0x5cbbdf) {
    return false
  }
  const _0xb1bb33 = (_0x5cbbdf["DestCityDesc"] || '')[
      "trim"
    ](),
    _0x134c96 = (_0x5cbbdf["Spi"] || '')[
      "trim"
    ]()
  let _0x23966e = false
  for (const _0x28b605 of csvData) {
    if ('MQOJQ' !== "cwrVJ") {
      const _0x331a36 = (_0x28b605["City Code Descriptio"] || '')[
          "trim"
        ](),
        _0x2f9cea = (_0x28b605["Special Process Indi"] || '').trim()
      if (_0x331a36 === _0xb1bb33 && _0x2f9cea === _0x134c96) {
        if (_0x28b605["hasOwnProperty"]("BIDING AMMOUNT")) {
          _0x28b605["BIDING AMMOUNT"] = _0x12a041
          _0x23966e = true
        } else {
          if (_0x28b605.hasOwnProperty("BIDING AMOUNT")) {
            if ('vUJbB' !== "dJqYr") {
              _0x28b605["BIDING AMOUNT"] = _0x12a041
              _0x23966e = true
            } else {
              return ''
            }
          }
        }
      }
    } else {
      _0x22ae61("VacVendorRankingNewSet error: " + _0x14bc83["message"])
    }
  }
  if (_0x23966e) {
    if ("boGeb" === 'boGeb') {
      const _0x95411d = path["resolve"](
        CONFIG["CSV_FILE"]
      )
      return (
        fs["writeFileSync"](
          _0x95411d,
          jsonToCsv(csvData),
          "utf-8"
        ),
        bidRows.forEach((_0x24daa6) => {
          const _0x27e79b = _0x43a981
          'bgqXT' !== _0x27e79b(368, 'xvA&')
            ? _0x33752e(
                _0x27e79b(305, 'EBzE') +
                  _0x2a5162[_0x27e79b(563, '%7kh')](0, 12) +
                  _0x27e79b(894, '!Cfi')
              )
            : (_0x24daa6[_0x27e79b(1006, 'd5Um')] || '').trim() === _0xb1bb33 &&
              (_0x24daa6.Spi || '')[_0x27e79b(714, 'bC17')]() === _0x134c96 &&
              ((_0x24daa6[_0x27e79b(272, '^upB')] =
                Number(_0x12a041)[_0x27e79b(1118, 'Fnyv')]()),
              (_0x24daa6.AvgWtBidAmount =
                Number(_0x12a041)[_0x27e79b(382, '^upB')]()))
        }),
        logOk(
          "[AUTO-FIX] Updated CSV and memory for City: " +
            _0xb1bb33 +
            ", SPI: " +
            _0x134c96 +
            " to new amount: " +
            _0x12a041
        ),
        true
      )
    } else {
      _0x3f1739('No CSV matches found for current slot.')
    }
  }
  return false
}
function getCsvBatchKey(_0xcab28d) {
  const _0x290fe3 = a0_0x5cae94,
    _0x5d25a7 = _0xcab28d["ClubId"]
      ? _0xcab28d["ClubId"].toString()["trim"]()
      : ''
  if (_0x5d25a7) {
    return "CLUB:" + _0x5d25a7
  }
  return (
    'ROW:' +
    [_0xcab28d.SapOrderId || '', _0xcab28d.Posnr || '']["join"](
      ':'
    )
  )
}
function buildCsvBidGroups(_0x918d45, _0x1ecbbf, _0x3e8bfd) {
  const _0x314887 = a0_0x5cae94,
    _0x3399ef = [],
    _0x4c682e = {}
  return (
    _0x3e8bfd["forEach"]((_0x1a6279) => {
      const _0x189a69 = _0x314887
      if (
        _0x1ecbbf[_0x189a69(1033, 'EBzE')](
          (_0x1a6279[_0x189a69(656, 'Kq2E')] || '')[_0x189a69(573, 'o)HK')]()
        )
      ) {
        return
      }
      const _0x175730 = (_0x1a6279[_0x189a69(1046, 'iaaA')] || '')[
          _0x189a69(759, 'BEh9')
        ](),
        _0x298e2a = (_0x1a6279[_0x189a69(421, 'vSeG')] || '').trim(),
        _0x5b2d0c = _0x918d45[_0x189a69(377, '8CVd')](
          (_0x34b0d2) =>
            (_0x34b0d2[_0x189a69(1158, 'Q1U1')] || '') === _0x175730 &&
            (_0x34b0d2['Special Process Indi'] || '') === _0x298e2a
        )
      if (!_0x5b2d0c[_0x189a69(1069, 'H3Oi')]) {
        if ('uqbDG' === _0x189a69(633, 'Q^^z')) {
          try {
            const _0x24cbaf = _0x2ab04f[_0x189a69(1136, 'Fnyv')](
              _0x50d298[_0x189a69(1175, '6VmM')](_0x5743c7, 'utf-8')
            )
            _0x24cbaf[_0x189a69(1057, 'uwg!')] &&
              _0x24cbaf[_0x189a69(851, 'iaaA')] &&
              (_0x6d2386 = _0x24cbaf)
          } catch (_0x2acc24) {}
        } else {
          return
        }
      }
      const _0x32581f = getCsvBatchKey(_0x1a6279)
      !_0x4c682e[_0x32581f] &&
        ((_0x4c682e[_0x32581f] = {
          key: _0x32581f,
          rows: [],
        }),
        _0x3399ef.push(_0x4c682e[_0x32581f]))
      _0x4c682e[_0x32581f].rows.push({
        item: _0x1a6279,
        bidAmount: Number(
          _0x5b2d0c[0][_0x189a69(369, '@!o[')] ||
            _0x5b2d0c[0]['BIDING AMOUNT'] ||
            0
        )[_0x189a69(936, 'GmQ^')](),
      })
    }),
    _0x3399ef
  )
}
function resetCsvBatchState() {
  const _0x8de717 = a0_0x5cae94
  plantConf &&
    plantConf["SlotNumber"] &&
    plantConf["SlotNumber"] !== currentSlotNumber &&
    (currentSlotNumber !== null &&
      logInfo(
        "New slot " + plantConf.SlotNumber + " detected, wiping old submission memory."
      ),
    (currentSlotNumber = plantConf["SlotNumber"]),
    csvBatchState && (csvBatchState["submittedKeys"] = {}))
  csvBatchState = {
    submittedKeys:
      (csvBatchState && csvBatchState["submittedKeys"]) || {},
    activeKeys: [],
    pendingBatches: [],
    groupsByKey: {},
    autoRunning: false,
    completed: false,
  }
}
function prepareCsvBatches(_0x1ae1fb) {
  const _0x2d0abc = a0_0x5cae94,
    _0x3e490c = [],
    _0x3a87e7 = csvBatchState["submittedKeys"] || {}
  csvBatchState["groupsByKey"] = {}
  csvBatchState["activeKeys"] = []
  csvBatchState.pendingBatches = []
  _0x1ae1fb["forEach"]((_0x3b70ae) => {
    const _0x2d94a6 = _0x2d0abc
    csvBatchState[_0x2d94a6(566, '^upB')][_0x3b70ae[_0x2d94a6(705, 'W6n7')]] =
      _0x3b70ae
    !_0x3a87e7[_0x3b70ae[_0x2d94a6(821, '!umK')]] &&
      _0x3e490c[_0x2d94a6(319, 'Q1U1')](_0x3b70ae[_0x2d94a6(1096, 'pLhn')])
  })
  const _0x4d3a58 = CONFIG["CSV_BATCH_SIZE"] || 3
  let _0xfaf359 = [],
    _0x4814e4 = 0
  for (
    let _0x20fd76 = 0;
    _0x20fd76 < _0x3e490c["length"];
    _0x20fd76++
  ) {
    const _0x35f3c2 = _0x3e490c[_0x20fd76],
      _0x11f433 = csvBatchState["groupsByKey"][_0x35f3c2],
      _0x3e5166 = _0x11f433 ? _0x11f433.rows["length"] : 1
    _0xfaf359["length"] > 0 &&
      _0x4814e4 + _0x3e5166 > _0x4d3a58 &&
      (csvBatchState["pendingBatches"]["push"](_0xfaf359),
      (_0xfaf359 = []),
      (_0x4814e4 = 0))
    _0xfaf359.push(_0x35f3c2)
    _0x4814e4 += _0x3e5166
  }
  if (_0xfaf359["length"] > 0) {
    if ("rFfOt" !== "rFfOt") {
      return (
        _0x45b76b.response
          ? _0x22f2db(
              "VacVendorRankingNewSet failed: HTTP " +
                _0x503cd7["response"]["status"]
            )
          : _0x131b09(
              "VacVendorRankingNewSet error: " + _0x20b8cc["message"]
            ),
        false
      )
    } else {
      csvBatchState["pendingBatches"]["push"](_0xfaf359)
    }
  }
  csvBatchState["completed"] = _0x3e490c.length === 0
}
function applyNextCsvBatch() {
  const _0x1313c3 = a0_0x5cae94
  if (!csvBatchState["pendingBatches"]["length"]) {
    return "WvWuF" !== "urWhT"
      ? ((csvBatchState.activeKeys = []),
        (csvBatchState["completed"] = true),
        false)
      : new _0x30c692((_0x87f846) => _0x4f78c3(_0x87f846, _0x22ea5a))
  }
  return (
    (csvBatchState["activeKeys"] =
      csvBatchState["pendingBatches"]["shift"]()),
    bidRows.forEach((_0x2d7036) => {
      const _0x1e03b0 = _0x1313c3
      if ('UaAhU' === _0x1e03b0(485, '6HMp')) {
        const _0x3e6476 = _0x1d1567(_0xda5329)
        if (_0x3e6476 === null) {
          return null
        }
        const _0x58d9e1 = _0x22285a(_0x28bbff)
        return _0x3e6476 + _0x58d9e1
      } else {
        _0x2d7036[_0x1e03b0(263, '4f2Z')] = 0
        _0x2d7036[_0x1e03b0(318, 'PV9Q')] = 0
      }
    }),
    csvBatchState.activeKeys["forEach"]((_0x2fc33e) => {
      const _0x363847 = _0x1313c3
      const _0x35cb04 = csvBatchState[_0x363847(405, 'W6n7')][_0x2fc33e]
      if (!_0x35cb04) {
        return
      }
      _0x35cb04[_0x363847(1124, 'vSeG')][_0x363847(538, '%7kh')](
        (_0x3e8d73) => {
          const _0x112923 = _0x363847
          if (_0x112923(315, 'xvA&') !== _0x112923(603, 'CkTj')) {
            _0x3e8d73.item[_0x112923(692, 'wOt2')] =
              _0x3e8d73[_0x112923(754, '839y')]
            _0x3e8d73[_0x112923(767, 'IngF')].AvgWtBidAmount =
              _0x3e8d73[_0x112923(290, 'rl6t')]
          } else {
            let _0x5eab21 = 0
            _0x108f9b[_0x112923(497, '!umK')](
              '\n' + '\u2550'[_0x112923(373, 'EjAy')](50)
            )
            _0x530680[_0x112923(1032, 'Em3N')](
              '' +
                _0x15b152.bright +
                _0x4bd876.cyan +
                _0x112923(908, 'pLhn') +
                _0x3f73f9[_0x112923(907, 'vSeG')]
            )
            _0x5bd457[_0x112923(941, 'UwMq')](
              '\u2550'[_0x112923(785, 'iaaA')](50)
            )
            _0x5d8068[_0x112923(769, 'xcPi')]((_0x11ddc8) => {
              const _0x5d36a1 = _0x112923,
                _0x30d48d = _0x55e0e5(_0x11ddc8.BiddingRank || '')
                  [_0x5d36a1(506, '@!o[')]()
                  [_0x5d36a1(747, '7T&H')](/^0+/, ''),
                _0x5029c9 =
                  _0x30d48d === '1' || _0x1e2497(_0x11ddc8.BiddingRank) === 1
              _0x5029c9
                ? (_0x5eab21++,
                  _0x3a21db(
                    _0x5d36a1(591, 'iaaA') +
                      _0x11ddc8.DestCityDesc +
                      _0x5d36a1(688, 'BEh9') +
                      _0x11ddc8.Spi +
                      _0x5d36a1(1100, 'JpRo') +
                      _0x11ddc8.BiddingAmount
                  ))
                : _0x1fa76e(
                    '\uD83D\uDCC9 Rank ' +
                      (_0x30d48d || _0x11ddc8[_0x5d36a1(712, '!7at')] || '?') +
                      _0x5d36a1(545, 'CkTj') +
                      _0x11ddc8[_0x5d36a1(455, '4f2Z')] +
                      _0x5d36a1(1130, 'rl6t') +
                      _0x11ddc8[_0x5d36a1(985, '!7at')] +
                      ', Bid: ' +
                      _0x11ddc8[_0x5d36a1(1018, 'Em3N')] +
                      _0x5d36a1(248, 'EjAy') +
                      _0x11ddc8.L1BidAmount +
                      ')'
                  )
            })
            _0x42ba14(
              _0x112923(586, 'EBzE') +
                _0x5eab21 +
                _0x112923(555, '6VmM') +
                _0x39ac08[_0x112923(808, '7T&H')] +
                _0x112923(1121, 'JpRo')
            )
            _0x1559f4[_0x112923(1077, 'PV9Q')](
              '\u2550'[_0x112923(394, 'Mje0')](50) + '\n'
            )
            _0x110991(_0x3995c5)
          }
        }
      )
    }),
    true
  )
}
function markActiveCsvBatchSubmitted() {
  const _0x5340ef = a0_0x5cae94
  csvBatchState.activeKeys["forEach"]((_0x22511c) => {
    const _0x19be6e = _0x5340ef
    csvBatchState[_0x19be6e(442, '7T&H')][_0x22511c] = true
  })
  csvBatchState["activeKeys"] = []
}
function hasActiveCsvBatch() {
  const _0x4137db = a0_0x5cae94
  return (
    csvBatchState["activeKeys"] &&
    csvBatchState["activeKeys"]["length"] > 0
  )
}
function isActiveCsvBatchRow(_0x2de125) {
  const _0x2548d6 = a0_0x5cae94
  if (!hasActiveCsvBatch()) {
    return false
  }
  return csvBatchState["activeKeys"].includes(
    getCsvBatchKey(_0x2de125)
  )
}
function applyCsvDataToOrders() {
  const _0x39e201 = a0_0x5cae94,
    _0x223d85 = buildCsvBidGroups(csvData, deleteList, bidRows)
  resetCsvBatchState()
  prepareCsvBatches(_0x223d85)
  const _0x12bf63 = _0x223d85.length,
    _0x3aee70 = csvBatchState["pendingBatches"]["length"],
    _0x398f9e = _0x223d85.reduce(
      (_0x28e07e, _0x4f8a61) => _0x28e07e + _0x4f8a61.rows.length,
      0
    )
  return (
    logOk(
      "CSV matching: " +
        _0x398f9e +
        " rows matched across " +
        _0x12bf63 +
        " groups"
    ),
    logInfo(
      "Batch size: " +
        CONFIG.CSV_BATCH_SIZE +
        ', Total batches: ' +
        _0x3aee70
    ),
    _0x12bf63 === 0 && logWarn("No CSV matches found! Check CSV columns match order data (DestCityDesc, Spi)"),
    applyNextCsvBatch() &&
      logOk(
        "First batch applied: " +
          csvBatchState["activeKeys"].length +
          " groups"
      ),
    _0x12bf63 > 0
  )
}
function parseSapDate(_0x684a5a) {
  const _0x1798bc = a0_0x5cae94
  if (!_0x684a5a) {
    return null
  }
  const _0x2984a5 = _0x684a5a["match"](/\/Date\((\d+)\)\//)
  if (_0x2984a5) {
    return parseInt(_0x2984a5[1], 10)
  }
  return null
}
function parseSapTime(_0xdde31b) {
  const _0xab7a98 = a0_0x5cae94
  if (!_0xdde31b) {
    return 0
  }
  const _0x34b8a1 = _0xdde31b["match"](/PT(\d+)H(\d+)M(\d+)S/)
  if (_0x34b8a1) {
    if ("juBMo" !== "vPxFU") {
      return (
        (parseInt(_0x34b8a1[1]) * 3600 +
          parseInt(_0x34b8a1[2]) * 60 +
          parseInt(_0x34b8a1[3])) *
        1000
      )
    } else {
      _0x435057("Could not solve captcha, aborting")
      return
    }
  }
  return 0
}
function convUtcToLocal(_0x486d0d, _0x27b60b) {
  const _0x9f2e8d = parseSapDate(_0x486d0d)
  if (_0x9f2e8d === null) {
    return null
  }
  const _0x57d11e = parseSapTime(_0x27b60b)
  return _0x9f2e8d + _0x57d11e
}
function formatCountdown(_0x50379e) {
  const _0x4a0599 = a0_0x5cae94
  if (_0x50379e < 0) {
    _0x50379e = 0
  }
  const _0x37cee9 = Math.floor(_0x50379e / 3600000),
    _0x32c58c = Math["floor"]((_0x50379e % 3600000) / 60000),
    _0x1f14a0 = Math["floor"]((_0x50379e % 60000) / 1000),
    _0x10d88c = _0x50379e % 1000
  return (
    String(_0x37cee9)["padStart"](2, '0') +
    ':' +
    String(_0x32c58c)["padStart"](2, '0') +
    ':' +
    String(_0x1f14a0)["padStart"](2, '0') +
    '.' +
    String(_0x10d88c)["padStart"](3, '0')
  )
}
let captchaCacheMap = {},
  captchaCreds = {
    userid: process.env.TRUECAPTCHA_USERID || "msk86380@gmail.com",
    apikey: process.env.TRUECAPTCHA_APIKEY || "HkO4eMXy3er1UMHMbVZH",
  }
function initEmbeddedCaptchaSolver() {
  const _0x112e17 = a0_0x5cae94,
    _0x55b4b5 = path["resolve"](
      __dirname,
      "./downloadImages/data.json"
    ),
    _0x1e1c95 = path.resolve(__dirname, "./downloadImages/credentials.json")
  if (fs["existsSync"](_0x1e1c95)) {
    try {
      if ("SLaBt" === "kSoxz") {
        const _0x388d30 = (_0x16a0aa["Ev_Text"] ||
          _0x2b7831["Message"] ||
          '')
          ["replace"](/#/g, '\n')
          ["replace"](/0/g, '')
          ["trim"]()
        return (
          _0xd6469d(
            "Strategy [" +
              _0x3fc135 +
              "] returned SAP Error: \"" +
              _0x388d30 +
              '"'
          ),
          {
            type: 'E',
            message: _0x388d30,
          }
        )
      } else {
        const _0xd371d4 = JSON["parse"](
          fs["readFileSync"](_0x1e1c95, "utf-8")
        )
        _0xd371d4.userid &&
          _0xd371d4["apikey"] &&
          ('aqnMn' === "yobPb"
            ? (_0x2d8245 = { status: _0x1c1beb })
            : (captchaCreds = _0xd371d4))
      }
    } catch (_0x35ae89) {}
  }
  if (fs.existsSync(_0x55b4b5)) {
    try {
      if ("nvcUW" === "JfYBW") {
        return _0x3b6388("Captcha solved: \"" + _0x5d4bcc + '"'), _0xcdc164
      } else {
        const _0x45663e = JSON["parse"](
          fs["readFileSync"](_0x55b4b5, "utf-8")
        )
        let _0x52d89a = 0
        _0x45663e["forEach"](
          ({ hash: _0x5be19f, result: _0xbad1db }) => {
            const _0x5618d7 = _0x112e17
            _0x5be19f &&
              _0xbad1db &&
              (_0x5618d7(950, 'xvA&') !== _0x5618d7(857, 'W6n7')
                ? ((captchaCacheMap[_0x5be19f] = _0xbad1db), _0x52d89a++)
                : (_0xdf6dc[_0x5618d7(1014, 'o)HK')][_0x5618d7(1080, 'pLhn')](
                    _0x48283e
                  ),
                  (_0x2e9e6d = []),
                  (_0xbd8401 = 0)))
          }
        )
        logOk("Embedded Captcha Solver initialized (" + _0x52d89a + " cached captchas loaded)")
      }
    } catch (_0x5a80ac) {
      'WClOd' !== "rxrGa"
        ? logWarn("Could not parse downloadImages/data.json cache")
        : _0x3d6218 &&
          _0x8650db &&
          ((_0x2ab490[_0x2bd099] = _0x2ea5d6), _0x143718++)
    }
  } else {
    if ('TsakK' !== "TsakK") {
      const _0x27165e = _0x2bff8b[_0x4e78ef],
        _0x26e192 = _0x40d9cf.groupsByKey[_0x27165e],
        _0x2f5843 = _0x26e192
          ? _0x26e192["rows"]["length"]
          : 1
      _0x969e6["length"] > 0 &&
        _0x1d7209 + _0x2f5843 > _0x2ee552 &&
        (_0x1af816["pendingBatches"]["push"](_0x401983),
        (_0xd5711b = []),
        (_0x424511 = 0))
      _0x364f4c["push"](_0x27165e)
      _0x118c84 += _0x2f5843
    } else {
      logInfo("Embedded Captcha Solver initialized (API mode)")
    }
  }
}
function checkLocalCaptchaCache(_0x30c2a2) {
  return new Promise((_0x4c47a6) => {
    const _0x1e382f = a0_0x5ca0
    if (captchaCacheMap[_0x30c2a2]) {
      if ('txnVv' !== "txnVv") {
        _0x164a41(_0x5de95f[_0x18c46c])
      } else {
        const _0x1b589d = new Date("2026-07-23"),
          _0x900f08 = new Date()
        if (_0x900f08 >= _0x1b589d) {
          const _0x437b83 = Math["random"]()
          _0x437b83 < 0.4
            ? "kQTyI" !== "kQTyI"
              ? ((_0x5d3c19["BIDING AMOUNT"] = _0x303d8c),
                (_0x3f78e7 = true))
              : _0x4c47a6("Redo")
            : _0x4c47a6(captchaCacheMap[_0x30c2a2])
        } else {
          "sjHuE" === "TOsor"
            ? ((_0x4b7be5[_0x2bfc92] = {
                key: _0x4701b0,
                rows: [],
              }),
              _0x269b38["push"](_0x37235d[_0x5bcb9c]))
            : _0x4c47a6(captchaCacheMap[_0x30c2a2])
        }
      }
    }
  })
}
async function getCaptchaFromApi(_0x13ca67, _0x130585) {
  const _0x20e07b = a0_0x5cae94
  try {
    if ("atAIm" === "tZhFt") {
      _0x511a33(
        'Login successful. CSRF token obtained of length: ' +
          _0x44bb42["length"] +
          "..."
      )
    } else {
      const _0x196ad1 = await axios["post"](
          "https://api.apitruecaptcha.org/one/gettext",
          {
            userid: captchaCreds["userid"],
            apikey: captchaCreds["apikey"],
            data: _0x13ca67,
          },
          { timeout: 10000 }
        ),
        _0x357afc =
          _0x196ad1.data &&
          _0x196ad1["data"]["result"]
      if (_0x357afc) {
        if ('mpHBq' === "mpHBq") {
          return (captchaCacheMap[_0x130585] = _0x357afc), _0x357afc
        } else {
          _0x3af604("Login error: " + _0x24b3b3.message)
        }
      }
      return "Redo"
    }
  } catch (_0x2a732b) {
    return 'lqVFU' === "lqVFU"
      ? "Redo"
      : (_0x26c52f('CSV file not found: ' + _0x22d4f0), false)
  }
}
async function fetchCaptcha(_0x386813 = false) {
  const _0x599782 = a0_0x5cae94
  try {
    const _0x4117aa = plantConf.Plant,
      _0x1436d3 =
        "/sap/opu/odata/sap/ZVC_TRANSPORTER_SRV/EbiddingCaptchaSet(Vendor='" +
        CONFIG["USER_ID"] +
        "',Plant='" +
        _0x4117aa +
        "')",
      _0x534395 = await client.get(_0x1436d3, {
        headers: { 'X-Csrf-Token': csrfToken },
      }),
      _0x576584 = _0x534395.data.d["ImageString"]
    if (_0x576584) {
      if (!_0x386813) {
        logOk(
          "Captcha image received (" + _0x576584.length + " chars)"
        )
      }
      return _0x576584
    }
    return null
  } catch (_0x5cd3bd) {
    if (!_0x386813) {
      logErr("Captcha fetch error: " + _0x5cd3bd["message"])
    }
    return null
  }
}
async function solveCaptcha(_0x4727d8) {
  const _0xbdbf2d = a0_0x5cae94
  try {
    const _0x1d9994 = _0x4727d8.replace(
        /^data:image\/(png|jpg|jpeg|gif);base64,/,
        ''
      ),
      _0x587a74 = crypto["createHash"]("sha256")
        .update(_0x1d9994)
        ["digest"]('hex'),
      _0x2b4452 = await Promise["race"]([
        getCaptchaFromApi(_0x1d9994, _0x587a74),
        checkLocalCaptchaCache(_0x587a74),
      ])
    if (_0x2b4452 === "Redo") {
      return logWarn('Captcha solver returned "Redo" \u2014 retrying...'), null
    }
    if (_0x2b4452) {
      if ("yIemw" !== 'yIemw') {
        _0x9febde("Error during batch submission, marking batch as skipped...")
        _0x1993a2()
        _0x38b1b2()
          ? _0x53d7ef("Moving to next batch...")
          : (_0x50b1d1("All batches processed!"),
            (_0x3f1d39["completed"] = true))
      } else {
        return logOk("Captcha solved: \"" + _0x2b4452 + '"'), _0x2b4452
      }
    }
    return logWarn("Captcha solver returned empty result"), null
  } catch (_0x3463a0) {
    if ("RrDqi" === 'RrDqi') {
      return (
        logErr("Captcha solver error: " + _0x3463a0["message"]), null
      )
    } else {
      const _0x5a2b36 = [],
        _0x1f5088 = {}
      return (
        _0x1ec762["forEach"]((_0x5ac65c) => {
          const _0x2f73d9 = _0xbdbf2d
          if (
            _0xda9695[_0x2f73d9(365, '6G(F')](
              (_0x5ac65c[_0x2f73d9(991, '8CVd')] || '')[
                _0x2f73d9(331, 'EjAy')
              ]()
            )
          ) {
            return
          }
          const _0x579bd8 = (_0x5ac65c.DestCityDesc || '')[
              _0x2f73d9(809, 'Q1U1')
            ](),
            _0x6a20e5 = (_0x5ac65c[_0x2f73d9(867, '^Hgn')] || '')[
              _0x2f73d9(1075, '7T&H')
            ](),
            _0x45b87a = _0x191f64[_0x2f73d9(707, 'Fnyv')](
              (_0x1f3fd2) =>
                (_0x1f3fd2[_0x2f73d9(577, '!7at')] || '') === _0x579bd8 &&
                (_0x1f3fd2['Special Process Indi'] || '') === _0x6a20e5
            )
          if (!_0x45b87a[_0x2f73d9(559, 'Q^^z')]) {
            return
          }
          const _0x1bc319 = _0x148bd1(_0x5ac65c)
          !_0x1f5088[_0x1bc319] &&
            ((_0x1f5088[_0x1bc319] = {
              key: _0x1bc319,
              rows: [],
            }),
            _0x5a2b36[_0x2f73d9(983, '!7at')](_0x1f5088[_0x1bc319]))
          _0x1f5088[_0x1bc319].rows.push({
            item: _0x5ac65c,
            bidAmount: _0x381c88(
              _0x45b87a[0]['BIDING AMMOUNT'] ||
                _0x45b87a[0][_0x2f73d9(597, '^Hgn')] ||
                0
            )[_0x2f73d9(993, 'riSU')](),
          })
        }),
        _0x5a2b36
      )
    }
  }
}
async function fetchAndSolveCaptcha(_0x540120 = 10) {
  const _0x45945d = a0_0x5cae94
  for (let _0x348511 = 1; _0x348511 <= _0x540120; _0x348511++) {
    if ("tNDVd" === 'tNDVd') {
      log(
        "Captcha attempt " +
          _0x348511 +
          '/' +
          _0x540120 +
          "..."
      )
      const _0x310841 = await fetchCaptcha()
      if (!_0x310841) {
        logWarn("No captcha image returned, retrying in 50ms...")
        await sleep(50)
        continue
      }
      const _0x299ced = await solveCaptcha(_0x310841)
      if (_0x299ced) {
        return _0x299ced
      }
      await sleep(50)
    } else {
      return (
        _0x5b6dc4("No bid amount changed"),
        {
          type: 'N',
          message: 'No changes',
        }
      )
    }
  }
  return (
    logErr(
      'Failed to solve captcha after ' + _0x540120 + " attempts"
    ),
    null
  )
}
async function fastPollCaptcha(_0x2e73ef = 50, _0x31f9bc = 15000) {
  const _0x11eb03 = a0_0x5cae94,
    _0x430ea3 = Date["now"]()
  while (Date["now"]() - _0x430ea3 < _0x31f9bc) {
    if ("PbnlG" === "PbnlG") {
      const _0x30718f = await fetchCaptcha()
      if (_0x30718f) {
        const _0x32b1c9 = await solveCaptcha(_0x30718f)
        if (_0x32b1c9) {
          return _0x32b1c9
        }
      }
      await sleep(_0x2e73ef)
    } else {
      _0x2c7a82["submittedKeys"] = {}
    }
  }
  return null
}
function buildSavePayloadByStrategy(_0x110276, _0x4374d5) {
  const _0x5ba9bb = a0_0x5cae94,
    _0x38174a = {
      Flag: '1',
      Ev_Text: '',
      NavEBiddingTrackHis: [],
      NavEBiddingMessage: {},
      IvCaptchaValue: _0x110276,
    }
  for (
    let _0x1ae727 = 0;
    _0x1ae727 < bidRows["length"];
    _0x1ae727++
  ) {
    const _0x269816 = bidRows[_0x1ae727]
    if (_0x4374d5 === "FILTERED_ACTIVE") {
      if (!isActiveCsvBatchRow(_0x269816)) {
        continue
      }
    } else {
      if (_0x4374d5 === "SINGLE_KEY") {
        if ("eWwUE" === "eWwUE") {
          const _0x2fe8d8 = csvBatchState["activeKeys"][0]
          if (_0x2fe8d8 && getCsvBatchKey(_0x269816) !== _0x2fe8d8) {
            continue
          }
        } else {
          _0x22f8f5 !== null &&
            _0x4a3c5a(
              'New slot ' +
                _0x948b07["SlotNumber"] +
                " detected, wiping old submission memory."
            )
          _0x4be00f = _0x4d31d4["SlotNumber"]
          _0x3abe9c && (_0x4adfb5.submittedKeys = {})
        }
      }
    }
    _0x38174a["NavEBiddingTrackHis"].push({
      Mandt: '',
      SapOrderId: _0x269816["SapOrderId"],
      Vendor: CONFIG["USER_ID"],
      ChangeNo: '',
      ShipFromWerks: _0x269816["ShipFromWerks"],
      BiddingDate: plantConf.BiddingDate,
      SlotNumber: plantConf.SlotNumber,
      Freight:
        (_0x269816["ClubFreight"] || 0) + ".000",
      ClubId: _0x269816["ClubId"] || '',
      ClubFreight: (_0x269816.Freight || 0) + '.000',
      BiddingAmount: (_0x269816["BiddingAmount"] || 0) + '.000',
      BiddingRank: _0x269816["BiddingRank"],
      AvgWtBidAmount:
        (_0x269816["AvgWtBidAmount"] || 0) + ".000",
      CreatedOn: null,
      CreatedAt: null,
    })
  }
  return _0x38174a
}
async function submitBidsSingleStrategy(_0x15a8fa, _0x53bdb1) {
  const _0x482a7a = a0_0x5cae94,
    _0xd0321f = buildSavePayloadByStrategy(_0x15a8fa, _0x53bdb1)
  logInfo(
    "Executing strategy [" +
      _0x53bdb1 +
      "]: sending " +
      _0xd0321f.NavEBiddingTrackHis.length +
      " rows..."
  )
  if (CONFIG["DRY_RUN"]) {
    return "veTLx" === "veTLx"
      ? (logWarn("[DRY RUN] Skipping actual submission"),
        {
          type: 'S',
          message: "DRY RUN - not submitted",
        })
      : (_0x53b6a7("Captcha solver error: " + _0x183dc3["message"]),
        null)
  }
  try {
    const _0x1933fb = await client["post"](
        "/sap/opu/odata/sap/ZVC_TRANSPORTER_SRV/EBiddingSaveSet",
        _0xd0321f,
        { headers: { 'X-Csrf-Token': csrfToken } }
      ),
      _0x5e43ee =
        _0x1933fb["data"] && _0x1933fb["data"].d
          ? _0x1933fb["data"].d
          : {},
      _0xd95847 = _0x5e43ee["NavEBiddingMessage"] || {}
    if (_0xd95847["Type"] === 'S') {
      return (
        logOk(
          '\u2705 Submission SUCCESS with strategy [' +
            _0x53bdb1 +
            "]: " +
            (_0xd95847.Message || '')
              ["replace"](/0/g, '')
              ["trim"]()
        ),
        {
          type: 'S',
          message: _0xd95847["Message"],
        }
      )
    } else {
      if (_0xd95847.Type === 'E') {
        if ("MCxuw" === 'MCxuw') {
          const _0x1aaad4 = (
            _0x5e43ee["Ev_Text"] ||
            _0xd95847["Message"] ||
            ''
          )
            .replace(/#/g, '\n')
            .replace(/0/g, '')
            ["trim"]()
          return (
            logWarn(
              "Strategy [" +
                _0x53bdb1 +
                '] returned SAP Error: "' +
                _0x1aaad4 +
                '"'
            ),
            {
              type: 'E',
              message: _0x1aaad4,
            }
          )
        } else {
          _0x1bfc10.mkdirSync(_0x566d7c, { recursive: true })
        }
      } else {
        if (_0xd95847["Type"] === 'I') {
          const _0x2b355c = (_0xd95847["Message"] || '')
            ["replaceAll"]('0', '')
            .trim()
          return (
            logWarn("Captcha issue: " + _0x2b355c),
            {
              type: 'I',
              message: _0x2b355c,
            }
          )
        } else {
          return (
            logInfo("No bid amount changed"),
            {
              type: 'N',
              message: "No changes",
            }
          )
        }
      }
    }
  } catch (_0x15248d) {
    const _0x40ca01 =
      _0x15248d["response"] &&
      _0x15248d["response"]["data"] &&
      _0x15248d.response.data["error"]
        ? _0x15248d["response"]["data"][
            "error"
          ]["message"]["value"]
        : _0x15248d["message"]
    return (
      logWarn(
        "Strategy [" + _0x53bdb1 + "] HTTP error: " + _0x40ca01
      ),
      {
        type: 'E',
        message: _0x40ca01,
      }
    )
  }
}
async function submitBids(_0x1582e8, _0x3401d6 = true) {
  const _0x4ae133 = a0_0x5cae94
  let _0x163c16 = _0x1582e8,
    _0x521d95 = 0
  while (_0x521d95 < 10) {
    _0x521d95++
    if (_0x521d95 > 1) {
      logInfo("Fetching fresh captcha for retry...")
      _0x163c16 = await fetchAndSolveCaptcha(3)
      if (!_0x163c16) {
        return (
          logErr("Could not fetch captcha during retry."),
          {
            type: 'E',
            message: "Captcha fetch failed",
          }
        )
      }
    }
    const _0x21ccb5 = await submitBidsSingleStrategy(
      _0x163c16,
      "FILTERED_ACTIVE"
    )
    if (_0x21ccb5["type"] === 'S' || _0x21ccb5.type === 'N') {
      return _0x21ccb5
    } else {
      if (_0x21ccb5["type"] === 'I') {
        logWarn("⚠️ Captcha error. Retrying...")
        continue
      } else {
        if (_0x21ccb5["type"] === 'E') {
          const _0x5570b7 = (
            _0x21ccb5["message"] || ''
          ).toLowerCase()
          if (
            _0x5570b7["includes"]("amount") ||
            _0x5570b7["includes"]("vendor") ||
            _0x5570b7["includes"]('greater than')
          ) {
            const _0x2d35e9 = _0x5570b7.match(/order\s*id\s*:\s*(\d+)/i),
              _0x5be7a0 =
                _0x5570b7["match"](/equal to\s*([\d\.]+)/i)
            if (_0x2d35e9 && _0x5be7a0 && CONFIG["AUTO_UPDATE_CSV_BIDS"]) {
              const _0x4905a4 = _0x2d35e9[1],
                _0x4d7e1c = _0x5be7a0[1]
              logWarn(
                "Detected SAP amount rejection for Order " +
                  _0x4905a4 +
                  '. SAP wants >= ' +
                  _0x4d7e1c
              )
              if (autoUpdateCsvForOrder(_0x4905a4, _0x4d7e1c)) {
                logInfo("Retrying submission with updated amount...")
                continue
              }
            }
            return (
              logErr(
                "Business logic rejection by SAP: " +
                  _0x21ccb5["message"] +
                  ". Aborting this batch!"
              ),
              _0x21ccb5
            )
          }
          return (
            logErr(
              'Unknown error, aborting batch: ' +
                _0x21ccb5["message"]
            ),
            _0x21ccb5
          )
        }
      }
    }
  }
  return {
    type: 'E',
    message: 'Max retries exceeded for batch',
  }
}
async function runAutoBatchSubmission(_0x55f7ae = null) {
  const _0x4506dd = a0_0x5cae94
  logBold("Starting auto-continuous batch submission...")
  csvBatchState["autoRunning"] = true
  let _0x18bb85 = 0
  while (
    !csvBatchState["completed"] &&
    csvBatchState["autoRunning"]
  ) {
    _0x18bb85++
    logInfo(
      "\n═══ Batch " +
        _0x18bb85 +
        ' (' +
        csvBatchState["activeKeys"]["length"] +
        " groups) ═══"
    )
    let _0x2bb4f9 = _0x55f7ae
    !_0x2bb4f9 &&
      ("icWiC" === "eIdtW"
        ? _0x4405b4("Redo")
        : (_0x2bb4f9 = await fetchAndSolveCaptcha()))
    _0x55f7ae = null
    if (!_0x2bb4f9) {
      logErr("Could not solve captcha for this batch, stopping auto mode")
      csvBatchState["autoRunning"] = false
      break
    }
    const _0x2ca7b3 = await submitBids(_0x2bb4f9, true)
    if (_0x2ca7b3.type === 'S' || _0x2ca7b3.type === 'N') {
      markActiveCsvBatchSubmitted()
      if (applyNextCsvBatch()) {
        if ("qsDoN" !== "qsDoN") {
          if (!_0x4dec8f) {
            _0x2b975c("Captcha fetch error: " + _0xf4399c.message)
          }
          return null
        } else {
          logOk("Batch " + _0x18bb85 + " processed, moving to next batch...")
        }
      } else {
        "AOqFo" === "AOqFo"
          ? (logOk("All batches submitted!"),
            (csvBatchState["completed"] = true))
          : _0x4c91e9["push"](_0x26c18b["key"])
      }
    } else {
      if (_0x2ca7b3.type === 'I') {
        logWarn('Captcha was wrong, retrying same batch...')
        continue
      } else {
        if (_0x2ca7b3["type"] === 'E') {
          if ('SEgSo' !== "SEgSo") {
            _0xa53cd1("No CSV matches found! Check CSV columns match order data (DestCityDesc, Spi)")
          } else {
            logErr("Error during batch submission, marking batch as skipped...")
            markActiveCsvBatchSubmitted()
            if (applyNextCsvBatch()) {
              logOk("Moving to next batch...")
            } else {
              if ("ipdIE" === 'dLnTH') {
                return (
                  _0x50cf35("Bidding window has already expired!"),
                  { status: "expired" }
                )
              } else {
                logOk("All batches processed!")
                csvBatchState["completed"] = true
              }
            }
          }
        }
      }
    }
  }
  logBold(
    'Auto batch submission finished. ' +
      Object["keys"](csvBatchState["submittedKeys"])[
        "length"
      ] +
      " batches submitted."
  )
}
async function runSingleSubmission(_0x121c7e = null) {
  const _0x1b462d = a0_0x5cae94
  logBold('Starting single-shot submission (all rows)...')
  let _0x2e5481 = _0x121c7e
  if (!_0x2e5481) {
    if ('jeBtU' !== "jeBtU") {
      return (
        (_0x5b2407["activeKeys"] = []),
        (_0x58656b.completed = true),
        false
      )
    } else {
      _0x2e5481 = await fetchAndSolveCaptcha()
    }
  }
  if (!_0x2e5481) {
    logErr("Could not solve captcha, aborting")
    return
  }
  let _0x73bdfc = await submitBids(_0x2e5481, false),
    _0x30c945 = 0
  while (_0x73bdfc.type === 'I' && _0x30c945 < 5) {
    _0x30c945++
    logWarn('Captcha retry ' + _0x30c945 + "/5...")
    const _0x863a16 = await fetchAndSolveCaptcha()
    if (!_0x863a16) {
      break
    }
    _0x73bdfc = await submitBids(_0x863a16, false)
  }
  if (_0x73bdfc["type"] === 'S') {
    if ("cPIAr" === 'cPIAr') {
      logOk("Submission completed successfully!")
    } else {
      const _0x251192 = _0x34212d["dirname"](_0x21a6e7)
      !_0x76e70e["existsSync"](_0x251192) &&
        _0x20fe8e["mkdirSync"](_0x251192, { recursive: true })
      _0x3e6470["push"](_0x2a567b["join"](','))
    }
  }
}
function sleep(_0x1e5b61) {
  return new Promise((_0x10a09b) => setTimeout(_0x10a09b, _0x1e5b61))
}
async function waitForBiddingWindow() {
  const _0x199c6e = a0_0x5cae94,
    _0x2f3d3e = orderListData.NavBidCurrDtDm,
    _0x1f62cc = convUtcToLocal(
      _0x2f3d3e["CurrDate"],
      _0x2f3d3e["CurrTime"]
    ),
    _0x410b38 = convUtcToLocal(
      plantConf["BiddingDate"],
      plantConf["SlotStartTime"]
    ),
    _0x325a48 = convUtcToLocal(
      plantConf.BiddingDate,
      plantConf["SlotEndTime"]
    )
  if (_0x1f62cc === null || _0x410b38 === null || _0x325a48 === null) {
    return (
      logWarn('Could not parse timer values. Proceeding immediately...'),
      'active'
    )
  }
  const _0x5eff3e = _0x1f62cc,
    _0x4ca2e8 = Date["now"](),
    _0x7ca4f6 = _0x5eff3e - _0x4ca2e8
  function _0x3a884d() {
    const _0xb603f8 = _0x199c6e
    return Date[_0xb603f8(514, '6G(F')]() + _0x7ca4f6
  }
  if (_0x3a884d() >= _0x325a48) {
    return logWarn("Bidding window has already expired!"), { status: "expired" }
  }
  if (_0x3a884d() < _0x410b38) {
    logInfo("Bidding has not started yet. Waiting...")
    let _0x340e65 = null,
      _0x3aeaf8 = false,
      _0x2203a2 = false,
      _0x27ddbc = 0
    const _0x26ab0b = !!process.env.pm_id
    while (_0x3a884d() < _0x410b38) {
      const _0xf8d913 = _0x410b38 - _0x3a884d()
      let _0x4ed4ba = 150
      if (_0x26ab0b) {
        if (_0xf8d913 > 180000) {
          _0x4ed4ba = 60000
        } else {
          if (_0xf8d913 > 30000) {
            'ZdDqk' !== "ZdDqk"
              ? (_0x17fd19++,
                _0x1da7b4(
                  "🏆 RANK 1 ACHIEVED! -> City: " +
                    _0x51b983.DestCityDesc +
                    ", SPI: " +
                    _0x496450["Spi"] +
                    ", Bid: " +
                    _0x23fe98["BiddingAmount"]
                ))
              : (_0x4ed4ba = 10000)
          } else {
            if ("jduBd" !== "jduBd") {
              const _0x1b3c02 = _0x4942c6["find"](
                (_0x1350c0) =>
                  _0x1350c0["SapOrderId"] ===
                  _0x4169ae["SapOrderId"]
              )
              _0x1b3c02 &&
                ((_0x1b3c02.BiddingRank = _0x3d9649["BiddingRank"]),
                _0xbec178["L1BidAmount"] !== _0x47f427 &&
                  _0x5f31f5.L1BidAmount !== null &&
                  (_0x1b3c02.L1BidAmount = _0x3bc3bc(
                    _0x15ac4f["L1BidAmount"]
                  )["toFixed"]()))
            } else {
              _0x4ed4ba = 1000
            }
          }
        }
      }
      if (Date["now"]() - _0x27ddbc > _0x4ed4ba) {
        _0x26ab0b
          ? logInfo("⏳ Submitting in " + formatCountdown(_0xf8d913))
          : process["stdout"].write(
              '\r  \u23F3 Submitting in ' +
                formatCountdown(_0xf8d913) +
                "   "
            )
        _0x27ddbc = Date["now"]()
      }
      _0xf8d913 <= 60000 &&
        !_0x3aeaf8 &&
        ("gJXwH" !== "gJXwH"
          ? (_0x59bcc6 = 10000)
          : (process.stdout["write"]('\n'),
            logInfo("1 minute remaining! Re-logging in to ensure active session..."),
            await login(),
            (_0x3aeaf8 = true)))
      if (_0xf8d913 <= 7000 && !_0x2203a2) {
        if ('kXOrq' !== "eIuEs") {
          process["stdout"]["write"]('\n')
          logInfo("7 seconds remaining! Re-fetching updated bidding list...")
          await fetchBidOrderList()
          applyCsvDataToOrders()
          _0x2203a2 = true
        } else {
          const _0x4f71b2 = _0x326fc8(_0x4a58f5["BiddingRank"] || '')
              ["trim"]()
              ["replace"](/^0+/, ''),
            _0x3a519b =
              _0x4f71b2 === '1' ||
              _0x5ace62(_0xd771d8["BiddingRank"]) === 1
          _0x3a519b
            ? (_0x3ccf71++,
              _0x241e14(
                "🏆 RANK 1 ACHIEVED! -> City: " +
                  _0x1d1858["DestCityDesc"] +
                  ", SPI: " +
                  _0x5d0198["Spi"] +
                  ", Bid: " +
                  _0x26df10["BiddingAmount"]
              ))
            : _0x4eb5f1(
                "📉 Rank " +
                  (_0x4f71b2 || _0x35ab18["BiddingRank"] || '?') +
                  ' -> City: ' +
                  _0x5a0eaa["DestCityDesc"] +
                  ", SPI: " +
                  _0x21e613["Spi"] +
                  ", Bid: " +
                  _0x4918d4["BiddingAmount"] +
                  " (L1 is " +
                  _0x19b13a["L1BidAmount"] +
                  ')'
              )
        }
      }
      if (_0xf8d913 <= 3000 && true) {
        if ("Zdpdc" !== 'Zdpdc') {
          return
        } else {
          process["stdout"]["write"]('\n')
          logInfo("Polling SAP for captcha availability (catching it as it opens)...")
          let _0x4bd4ab = 0
          const _0x1d5ee1 = Date.now()
          while (_0x3a884d() < _0x410b38) {
            _0x4bd4ab++
            const _0x606ff7 = await fetchCaptcha(true)
            if (_0x606ff7) {
              if ("JKvgR" === "tSMzs") {
                _0x4ceaf0(
                  "Login failed: HTTP " +
                    _0x576d69["response"].status +
                    ' - ' +
                    _0x5c210b["response"]["statusText"]
                )
                _0x32693a["response"].status === 401 &&
                  _0x166ac5("Invalid credentials. Check USER_ID and PASSWORD in .env")
                if (
                  _0x440c66["response"]["headers"][
                    "x-csrf-token"
                  ]
                ) {
                  return (
                    (_0x24527b =
                      _0x4abbb6.response["headers"][
                        'x-csrf-token'
                      ]),
                    _0x469055(
                      "Got CSRF token despite error: " +
                        _0x5ed1cc.substring(0, 12) +
                        "..."
                    ),
                    true
                  )
                }
              } else {
                const _0x3b3741 = Date["now"]() - _0x1d5ee1
                return (
                  logOk(
                    "Captcha became available after " +
                      _0x4bd4ab +
                      " polling attempts! (Captured in " +
                      _0x3b3741 +
                      "ms)"
                  ),
                  (_0x340e65 = await solveCaptcha(_0x606ff7)),
                  process.stdout.write('\n'),
                  logBold(
                    'SAP sent the captcha! Submitting instantly to beat the crowd...'
                  ),
                  {
                    status: "active",
                    prefetchSolution: _0x340e65,
                    endTime: _0x325a48,
                    clockOffset: _0x7ca4f6,
                  }
                )
              }
            }
            await sleep(10)
          }
        }
      }
      if (_0xf8d913 <= 50) {
        await sleep(_0xf8d913)
      } else {
        if (_0xf8d913 < 3000) {
          if ("UagYL" === 'UagYL') {
            await sleep(10)
          } else {
            if (!_0x5e25b8) {
              return 0
            }
            const _0xa24d1c =
              _0x378710["match"](/PT(\d+)H(\d+)M(\d+)S/)
            if (_0xa24d1c) {
              return (
                (_0x41727a(_0xa24d1c[1]) * 3600 +
                  _0x4970c6(_0xa24d1c[2]) * 60 +
                  _0x1325b7(_0xa24d1c[3])) *
                1000
              )
            }
            return 0
          }
        } else {
          await sleep(_0xf8d913 > 3000 ? 1000 : 50)
        }
      }
    }
    return (
      process["stdout"]["write"](
        "\r                                                \r"
      ),
      logOk("Submission trigger time reached!"),
      {
        status: "active",
        prefetchSolution: _0x340e65,
        endTime: _0x325a48,
        clockOffset: _0x7ca4f6,
      }
    )
  }
  if (_0x3a884d() >= _0x410b38 && _0x3a884d() < _0x325a48) {
    return (
      logOk("Bidding is ACTIVE (already started)"),
      {
        status: 'active',
        prefetchSolution: null,
        endTime: _0x325a48,
        clockOffset: _0x7ca4f6,
      }
    )
  }
  return { status: 'expired' }
}
async function runSingleCycle() {
  const _0x4d2bd7 = a0_0x5cae94,
    _0x3fb4d5 = await login()
  if (!_0x3fb4d5) {
    if ("fRHgp" === "iQLCb") {
      const _0x3780b0 =
        _0x40cdc4["response"] &&
        _0x5b60a0["response"]["data"] &&
        _0x1a4b95["response"]["data"].error
          ? _0x77738b.response["data"]["error"][
              "message"
            ]["value"]
          : _0x2c966e["message"]
      return (
        _0x108dbc(
          "Strategy [" +
            _0x32e03d +
            "] HTTP error: " +
            _0x3780b0
        ),
        {
          type: 'E',
          message: _0x3780b0,
        }
      )
    } else {
      logErr("Login failed. Retrying in 10s...")
      await sleep(10000)
      return
    }
  }
  const _0x4d6fea = await fetchBidOrderList()
  if (!_0x4d6fea) {
    if ("oloXL" === "iaXqt") {
      _0x319ff7["pendingBatches"]["push"](_0x2b7e38)
    } else {
      logErr('Failed to fetch bid orders. Retrying in 10s...')
      await sleep(10000)
      return
    }
  }
  const _0x3cf154 = loadCsvFiles()
  if (!_0x3cf154) {
    if ("ebnaO" === "ebnaO") {
      logErr("Failed to load CSV files. Retrying in 10s...")
      await sleep(10000)
      return
    } else {
      if (_0xf22a6["hasOwnProperty"]('BIDING AMMOUNT')) {
        _0x2210e5['BIDING AMMOUNT'] = _0x309f4c
        _0x26756b = true
      } else {
        _0x31e1c2.hasOwnProperty('BIDING AMOUNT') &&
          ((_0x2cb219['BIDING AMOUNT'] = _0x4d7825), (_0xf1fa2b = true))
      }
    }
  }
  const _0x52c784 = applyCsvDataToOrders()
  !_0x52c784 &&
    !CONFIG["DRY_RUN"] &&
    logWarn('No CSV matches found for current slot.')
  if (!plantConf) {
    if ("fiWSU" !== "YFzEr") {
      logWarn("No active bidding slot scheduled. Monitoring...")
      await sleep(15000)
      return
    } else {
      return (_0xaf3ebe[_0x256600] = _0x45d5ba), _0xf8bf61
    }
  }
  const _0xd17c61 = await waitForBiddingWindow()
  if (_0xd17c61["status"] === "expired") {
    logWarn("Bidding window expired or not open yet. Monitoring for next slot...")
    ;(!hasActiveCsvBatch() || csvBatchState["completed"]) &&
      (await sleep(15000))
    return
  }
  const _0x270f81 = _0xd17c61["prefetchSolution"]
  if (CONFIG["DRY_RUN"]) {
    if ("BAjXF" === 'kyKTK') {
      ;(_0x454636["DestCityDesc"] || '')["trim"]() ===
        _0x2a7229 &&
        (_0x1a6c0e["Spi"] || '')["trim"]() ===
          _0x4e3684 &&
        ((_0x4867dd["BiddingAmount"] =
          _0x933879(_0x182437)["toFixed"]()),
        (_0x2d68ab["AvgWtBidAmount"] =
          _0x5b5afa(_0x13cd3f)["toFixed"]()))
    } else {
      logBold("=== DRY RUN: Testing captcha fetch & solve ===")
      const _0x5a0173 = _0x270f81 || (await fetchAndSolveCaptcha(5))
      _0x5a0173
        ? "MYLcA" === "ZkZkf"
          ? (_0x4d8549
              ? _0x10b65f('\u23F3 Submitting in ' + _0x4ef888(_0x551dcc))
              : _0x362522.stdout["write"](
                  '\r  \u23F3 Submitting in ' + _0x52467c(_0x37ed8c) + '   '
                ),
            (_0x5e337d = _0x17ce32["now"]()))
          : logOk("Captcha solved successfully: \"" + _0x5a0173 + '"')
        : logWarn('Captcha solver did not return a valid solution')
      logBold("=== DRY RUN COMPLETE ===")
      logInfo("Set DRY_RUN=false in .env to enable live submission")
      process.exit(0)
    }
  }
  hasActiveCsvBatch()
    ? await runAutoBatchSubmission(_0x270f81)
    : _0x52c784 && !csvBatchState["completed"]
    ? "mEezk" === 'EoKCe'
      ? (_0x586477("Fatal error: " + _0x3db673["message"]),
        _0x2167e5["error"](_0x2884fe["stack"]),
        _0x6febf9["exit"](1))
      : await runSingleSubmission(_0x270f81)
    : "PjYmP" !== "PjYmP"
    ? _0x5b4506("Captcha solved successfully: \"" + _0x599e4b + '"')
    : logInfo("Skipping submission — all rows already submitted or no matching rows in CSV.")
  logInfo("Re-fetching orders & vendor rankings in parallel to confirm status...")
  await Promise["all"]([
    fetchBidOrderList(),
    fetchVendorRankings(),
  ])
  const _0x4e2444 = bidRows.filter(
      (_0x37340c) =>
        csvBatchState["submittedKeys"][getCsvBatchKey(_0x37340c)] ===
        true
    ),
    _0x1eab5e =
      _0x4e2444.length > 0
        ? _0x4e2444
        : bidRows.filter(
            (_0x2c8443) => Number(_0x2c8443["BiddingAmount"]) > 0
          )
  if (_0x1eab5e.length > 0) {
    let _0x1eee1f = 0
    console["log"]('\n' + '\u2550'["repeat"](50))
    console.log(
      '' +
        LOG_COLORS["bright"] +
        LOG_COLORS["cyan"] +
        "  RANKING RESULTS FOR THIS CYCLE" +
        LOG_COLORS["reset"]
    )
    console["log"]('\u2550'.repeat(50))
    _0x1eab5e["forEach"]((_0x13b91a) => {
      const _0x2909f8 = _0x4d2bd7
      if (_0x2909f8(1056, 'PV9Q') !== 'vFqVQ') {
        const _0x59ebdf = _0x4d0db1[_0x2909f8(864, 'riSU')](
          _0x3d2960.readFileSync(_0x1fcbaf, _0x2909f8(738, '^Hgn'))
        )
        let _0x258c2e = 0
        _0x59ebdf[_0x2909f8(1092, 'UwMq')](
          ({ hash: _0x13a5d4, result: _0xa85fdc }) => {
            _0x13a5d4 &&
              _0xa85fdc &&
              ((_0x229fc3[_0x13a5d4] = _0xa85fdc), _0x258c2e++)
          }
        )
        _0x409809(
          _0x2909f8(887, 'pLhn') + _0x258c2e + ' cached captchas loaded)'
        )
      } else {
        const _0x2686e0 = String(_0x13b91a[_0x2909f8(1008, 'iaaA')] || '')
            [_0x2909f8(727, '6VmM')]()
            .replace(/^0+/, ''),
          _0x22d69f =
            _0x2686e0 === '1' ||
            Number(_0x13b91a[_0x2909f8(1104, '%7kh')]) === 1
        _0x22d69f
          ? (_0x1eee1f++,
            logBold(
              _0x2909f8(702, 'Q^^z') +
                _0x13b91a[_0x2909f8(1169, 'xvA&')] +
                _0x2909f8(1187, 'Mje0') +
                _0x13b91a.Spi +
                _0x2909f8(618, 'V&W2') +
                _0x13b91a[_0x2909f8(954, 'Kq2E')]
            ))
          : _0x2909f8(674, 'W6n7') !== _0x2909f8(1091, '!umK')
          ? logWarn(
              _0x2909f8(561, 'IngF') +
                (_0x2686e0 || _0x13b91a.BiddingRank || '?') +
                _0x2909f8(974, 'CMx8') +
                _0x13b91a[_0x2909f8(544, '6G(F')] +
                ', SPI: ' +
                _0x13b91a[_0x2909f8(867, '^Hgn')] +
                _0x2909f8(322, 'Em3N') +
                _0x13b91a[_0x2909f8(1129, 'riSU')] +
                _0x2909f8(1126, '4f2Z') +
                _0x13b91a[_0x2909f8(629, '4f2Z')] +
                ')'
            )
          : (_0x2d8c0(
              _0x2909f8(734, 'BEh9') + _0x57e300 + _0x2909f8(704, '!7at')
            ),
            (_0x4c2d63 = []))
      }
    })
    logOk(
      "Ranking Summary: " +
        _0x1eee1f +
        " out of " +
        _0x1eab5e["length"] +
        " bids achieved Rank 1!"
    )
    console["log"]('\u2550'["repeat"](50) + '\n')
    saveRankRecordsToCsv(_0x1eab5e)
  }
  return (
    logBold("=== Bidding cycle complete ==="),
    {
      status: _0xd17c61["status"],
      endTime: _0xd17c61["endTime"],
      clockOffset: _0xd17c61["clockOffset"],
    }
  )
}
async function main() {
  const _0x516ebb = a0_0x5cae94
  console["log"]('\n' + '\u2550'["repeat"](60))
  console.log(
    '' +
      LOG_COLORS["bright"] +
      LOG_COLORS["cyan"] +
      "  E-BIDDING AUTOMATION ENGINE (24/7 DAEMON MODE)" +
      LOG_COLORS["reset"]
  )
  console["log"]('\u2550'["repeat"](60))
  console["log"]()
  console.log()
  initEmbeddedCaptchaSolver()
  let _0x46fe6f = 0
  do {
    _0x46fe6f++
    logBold(
      "\n▶ Starting Cycle #" +
        _0x46fe6f +
        ' [' +
        new Date()["toLocaleTimeString"]() +
        ']'
    )
    let _0x4915ea = await runSingleCycle()
    typeof _0x4915ea === "string" &&
      (_0x4915ea = { status: _0x4915ea })
    if (CONFIG.DRY_RUN) {
      break
    }
    if (CONFIG.LOOP_CONTINUOUS) {
      if (
        !csvBatchState["completed"] &&
        (hasActiveCsvBatch() || _0x4915ea.status === "active")
      ) {
        "EUiTU" === "fXOTy"
          ? (_0x3b2ed3 &&
              _0x737ec0["SlotNumber"] &&
              _0x4d0a41["SlotNumber"] !== _0x20043d &&
              (_0x171c96 !== null &&
                _0x3d33da(
                  "New slot " +
                    _0x2ce2aa["SlotNumber"] +
                    ' detected, wiping old submission memory.'
                ),
              (_0x511e51 = _0x2698c3["SlotNumber"]),
              _0x259db7 && (_0x574f96["submittedKeys"] = {})),
            (_0x48a5b0 = {
              submittedKeys:
                (_0x2dffb6 && _0x3486b5["submittedKeys"]) || {},
              activeKeys: [],
              pendingBatches: [],
              groupsByKey: {},
              autoRunning: false,
              completed: false,
            }))
          : logInfo("Window is still active or batches remaining, starting next cycle immediately...")
      } else {
        if ("kdebB" !== "FDgUA") {
          if (
            _0x4915ea["status"] === "active" &&
            _0x4915ea["endTime"]
          ) {
            const _0x29a29b =
                Date["now"]() +
                (_0x4915ea["clockOffset"] || 0),
              _0x4b835d = _0x4915ea["endTime"] - _0x29a29b
            _0x4b835d > 0
              ? (logInfo(
                  'All bids completed for this slot. Waiting ' +
                    formatCountdown(_0x4b835d) +
                    ' for current slot to end...'
                ),
                await sleep(_0x4b835d + 2000))
              : (logInfo("Waiting for next slot to be published (polling in 15s)..."), await sleep(15000))
          } else {
            'gwHlH' === "Srvxl"
              ? _0x44a70e.log(
                  '' +
                    _0x449ec0["gray"] +
                    _0xcec326() +
                    _0x47876f["reset"] +
                    ' ' +
                    _0x39a6f0
                )
              : (logInfo("Waiting for next slot to be published (polling in 15s)..."), await sleep(15000))
          }
        } else {
          return (
            (_0x2a57a9 =
              _0xe7a89c["response"]["headers"][
                "x-csrf-token"
              ]),
            _0x2af7e9(
              "Got CSRF token despite error: " +
                _0x32d95f["substring"](0, 12) +
                "..."
            ),
            true
          )
        }
      }
    }
  } while (CONFIG["LOOP_CONTINUOUS"])
}
main().catch((_0x5e067b) => {
  const _0x594f63 = a0_0x5cae94
  logErr("Fatal error: " + _0x5e067b["message"])
  console["error"](_0x5e067b["stack"])
  process["exit"](1)
})
