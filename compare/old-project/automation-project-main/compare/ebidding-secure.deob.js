const a0_0x5cae94 = a0_0x5ca0
;(function (_0x1b6b4d, _0x21951f) {
  const _0x173fea = a0_0x5ca0,
    _0x2b3eb0 = _0x1b6b4d()
  while (true) {
    try {
      const _0x67f12 =
        parseInt(_0x173fea(311, 'vSeG')) / 1 +
        -parseInt(_0x173fea(658, '&PzW')) / 2 +
        (-parseInt(_0x173fea(423, 'riSU')) / 3) *
          (parseInt(_0x173fea(667, '!7at')) / 4) +
        (parseInt(_0x173fea(325, 'E&Ei')) / 5) *
          (parseInt(_0x173fea(351, '^upB')) / 6) +
        parseInt(_0x173fea(640, '&PzW')) / 7 +
        (-parseInt(_0x173fea(1012, 'wOt2')) / 8) *
          (-parseInt(_0x173fea(653, 'Kq2E')) / 9) +
        -parseInt(_0x173fea(807, 'CkTj')) / 10
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
require(a0_0x5cae94(764, 'wpSZ'))[a0_0x5cae94(817, 'IngF')]()
const axios = require('axios'),
  { wrapper } = require(a0_0x5cae94(449, 'Mje0')),
  { CookieJar } = require('tough-cookie'),
  fs = require('fs'),
  path = require(a0_0x5cae94(881, '6HMp')),
  crypto = require(a0_0x5cae94(957, '@!o[')),
  https = require(a0_0x5cae94(790, 'PV9Q'))
https.globalAgent[a0_0x5cae94(454, '^upB')] = true
const CONFIG = {
    BASE_URL: process.env.BASE_URL || 'https://rise.eye2serve.com:8443',
    USER_ID: process.env.USER_ID || '2210181',
    PASSWORD: process.env.PASSWORD || a0_0x5cae94(802, '8CVd'),
    PLANT: process.env.PLANT || a0_0x5cae94(494, '&PzW'),
    CSV_FILE: process.env.CSV_FILE || './files/input2.csv',
    DELETE_CSV_FILE: process.env.DELETE_CSV_FILE || a0_0x5cae94(518, '!7at'),
    CSV_BATCH_SIZE: parseInt(process.env.CSV_BATCH_SIZE || '3', 10),
    AUTO_UPDATE_CSV_BIDS:
      (process.env.AUTO_UPDATE_CSV_BIDS || a0_0x5cae94(488, 'rl6t'))[
        a0_0x5cae94(1143, 'CMx8')
      ]() === 'true',
    LOOP_CONTINUOUS:
      (process.env.LOOP_CONTINUOUS || a0_0x5cae94(440, 'Kq2E'))[
        a0_0x5cae94(438, 'vSeG')
      ]() === a0_0x5cae94(1020, 'iaaA'),
    DRY_RUN:
      (process.env.DRY_RUN || 'false')[a0_0x5cae94(804, 'riSU')]() ===
      a0_0x5cae94(530, '^Hgn'),
  },
  LOG_COLORS = {
    reset: '\x1B[0m',
    bright: a0_0x5cae94(948, '4f2Z'),
    green: a0_0x5cae94(350, 'rl6t'),
    yellow: a0_0x5cae94(774, 'JpRo'),
    red: '\x1B[31m',
    cyan: a0_0x5cae94(546, 'wpSZ'),
    magenta: a0_0x5cae94(1030, 'pLhn'),
    blue: a0_0x5cae94(825, 'E&Ei'),
    gray: a0_0x5cae94(696, 'E&Ei'),
  }
function ts() {
  return ''
}
function log(_0x3981ba) {
  const _0x1940cf = a0_0x5cae94
  console.log(
    '' +
      LOG_COLORS[_0x1940cf(623, 'bC17')] +
      ts() +
      LOG_COLORS[_0x1940cf(931, '^upB')] +
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
  console[_0x1a69c5(364, 'Q^^z')](
    '' +
      LOG_COLORS[_0x1a69c5(281, 'H3Oi')] +
      ts() +
      ' \u2713 ' +
      _0xd54d64 +
      LOG_COLORS[_0x1a69c5(1173, 'EBzE')]
  )
}
function logWarn(_0xa86ebd) {
  const _0x4088d8 = a0_0x5cae94
  console.log(
    '' +
      LOG_COLORS.yellow +
      ts() +
      _0x4088d8(342, '%7kh') +
      _0xa86ebd +
      LOG_COLORS[_0x4088d8(852, 'V&W2')]
  )
}
function logErr(_0x3c4c8a) {
  const _0x5f5bf0 = a0_0x5cae94
  console[_0x5f5bf0(930, '839y')](
    '' +
      LOG_COLORS.red +
      ts() +
      _0x5f5bf0(279, 'uwg!') +
      _0x3c4c8a +
      LOG_COLORS.reset
  )
}
function logInfo(_0x14db3b) {
  const _0x59cb5e = a0_0x5cae94
  console[_0x59cb5e(942, 'H3Oi')](
    '' +
      LOG_COLORS[_0x59cb5e(614, '6VmM')] +
      ts() +
      _0x59cb5e(794, 'GmQ^') +
      _0x14db3b +
      LOG_COLORS[_0x59cb5e(830, '8CVd')]
  )
}
function logBold(_0x2b6c0a) {
  const _0x19e707 = a0_0x5cae94
  console[_0x19e707(741, '%7kh')](
    '' +
      LOG_COLORS[_0x19e707(1164, 'EBzE')] +
      LOG_COLORS[_0x19e707(810, '6VmM')] +
      ts() +
      _0x19e707(820, 'PV9Q') +
      _0x2b6c0a +
      LOG_COLORS[_0x19e707(757, 'o)HK')]
  )
}
const jar = new CookieJar(),
  client = wrapper(
    axios.create({
      jar: jar,
      baseURL: CONFIG[a0_0x5cae94(522, 'JpRo')],
      withCredentials: true,
      headers: {
        Accept: a0_0x5cae94(622, 'Q1U1'),
        'Content-Type': a0_0x5cae94(287, 'Mje0'),
      },
      auth: {
        username: CONFIG[a0_0x5cae94(1098, 'xvA&')],
        password: CONFIG[a0_0x5cae94(998, 'GmQ^')],
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
  log(_0x37382f(770, 'rl6t'))
  try {
    const _0x2fbadd = await client.get(
      '/sap/opu/odata/sap/ZVC_TRANSPORTER_SRV/',
      { headers: { 'X-Csrf-Token': _0x37382f(750, 'wOt2') } }
    )
    csrfToken = _0x2fbadd[_0x37382f(363, 'p[t5')][_0x37382f(801, '8CVd')]
    if (csrfToken) {
      logOk(
        _0x37382f(736, '6G(F') +
          csrfToken[_0x37382f(901, '8CVd')] +
          _0x37382f(997, 'wpSZ')
      )
    } else {
      if (_0x37382f(379, '@!o[') === _0x37382f(765, '%7kh')) {
        _0x5db5bf = _0x29d795
      } else {
        logWarn(_0x37382f(818, 'pLhn'))
        const _0x2260a9 = await client[_0x37382f(402, 'Fnyv')](
          _0x37382f(569, '^upB'),
          { headers: { 'X-Csrf-Token': _0x37382f(753, 'bC17') } }
        )
        csrfToken = _0x2260a9[_0x37382f(650, 'W6n7')][_0x37382f(762, '@!o[')]
        if (csrfToken) {
          logOk(_0x37382f(961, '839y') + csrfToken.substring(0, 12) + '...')
        } else {
          throw new Error(_0x37382f(1042, 'xcPi'))
        }
      }
    }
    return true
  } catch (_0x1cc045) {
    if ('vPzDs' === _0x37382f(744, 'xcPi')) {
      const _0x2ce651 = (_0x5d0f72[_0x37382f(927, 'wpSZ')] || '')
        [_0x37382f(400, 'bC17')]('0', '')
        [_0x37382f(1010, 'vSeG')]()
      return (
        _0x15032d(_0x37382f(529, 'EjAy') + _0x2ce651),
        {
          type: 'I',
          message: _0x2ce651,
        }
      )
    } else {
      if (_0x1cc045[_0x37382f(434, '%7kh')]) {
        logErr(
          _0x37382f(348, 'Q^^z') +
            _0x1cc045[_0x37382f(517, 'Em3N')][_0x37382f(346, 'Q^^z')] +
            _0x37382f(711, 'p[t5') +
            _0x1cc045[_0x37382f(275, '!umK')][_0x37382f(401, 'Mje0')]
        )
        _0x1cc045[_0x37382f(897, 'riSU')][_0x37382f(947, 'iaaA')] === 401 &&
          (_0x37382f(1078, 'PV9Q') !== _0x37382f(644, 'd5Um')
            ? logErr('Invalid credentials. Check USER_ID and PASSWORD in .env')
            : ((_0x369271 =
                _0x4c0c8d[_0x37382f(1132, 'xvA&')][_0x37382f(944, '!7at')]),
              _0x4b69b9(
                _0x37382f(452, '6G(F') +
                  _0x227cb1.substring(0, 12) +
                  _0x37382f(894, '!Cfi')
              )))
        if (
          _0x1cc045[_0x37382f(1157, '6G(F')][_0x37382f(698, 'wpSZ')][
            'x-csrf-token'
          ]
        ) {
          return (
            (csrfToken =
              _0x1cc045[_0x37382f(378, 'xvA&')][_0x37382f(461, 'uwg!')][
                'x-csrf-token'
              ]),
            logWarn(
              'Got CSRF token despite error: ' +
                csrfToken[_0x37382f(563, '%7kh')](0, 12) +
                _0x37382f(353, 'IngF')
            ),
            true
          )
        }
      } else {
        logErr(_0x37382f(508, 'iaaA') + _0x1cc045[_0x37382f(844, 'o)HK')])
      }
      return false
    }
  }
}
async function refreshCsrfToken() {
  const _0x242c19 = a0_0x5cae94
  try {
    if ('CsGDD' === _0x242c19(1053, 'bC17')) {
      const _0x239dbd = _0x1b917d.resolve(_0x4d766f[_0x242c19(345, 'Q^^z')])
      return (
        _0x5f9f58.writeFileSync(
          _0x239dbd,
          _0x4d5747(_0x25526a),
          _0x242c19(921, '839y')
        ),
        _0x208cc9[_0x242c19(730, 'EjAy')]((_0x273004) => {
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
          _0x242c19(975, 'W6n7') +
            _0x5ec27b +
            ', SPI: ' +
            _0x2a710e +
            ' to new amount: ' +
            _0x1955e6
        ),
        true
      )
    } else {
      const _0x34cab7 = await client[_0x242c19(848, 'p[t5')](
        _0x242c19(295, 'E&Ei'),
        { headers: { 'X-Csrf-Token': 'Fetch' } }
      )
      _0x34cab7[_0x242c19(550, 'EBzE')][_0x242c19(542, '7T&H')] &&
        ((csrfToken = _0x34cab7.headers[_0x242c19(662, 'Mje0')]),
        logOk(
          'CSRF token refreshed: ' +
            csrfToken[_0x242c19(939, 'UwMq')](0, 12) +
            '...'
        ))
    }
  } catch (_0x227f99) {
    _0x242c19(1103, 'uwg!') !== 'zNdjC'
      ? ((_0x1940d7.BiddingRank = _0x3335c5[_0x242c19(783, '6G(F')]),
        _0x444c63[_0x242c19(659, 'Q1U1')] !== _0x56237d &&
          _0x345b69[_0x242c19(886, 'IngF')] !== null &&
          (_0x4af210[_0x242c19(946, 'o)HK')] = _0x5d49fd(
            _0xcaa0b0[_0x242c19(412, '8CVd')]
          )[_0x242c19(307, '#Uph')]()))
      : _0x227f99[_0x242c19(521, 'bC17')] &&
        _0x227f99.response[_0x242c19(1185, 'Mje0')][_0x242c19(739, '^Hgn')] &&
        (_0x242c19(330, 'JpRo') === 'cEDka'
          ? (csrfToken =
              _0x227f99[_0x242c19(434, '%7kh')][_0x242c19(1083, 'Em3N')][
                _0x242c19(726, '839y')
              ])
          : _0x43bfee(
              _0x242c19(1048, 'uwg!') + _0x313d45 + _0x242c19(845, 'p[t5')
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
        CurrDate: _0x4fd2f7(359, 'iaaA'),
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
          Low: CONFIG[_0x4fd2f7(952, 'Kq2E')],
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
          Low: CONFIG[_0x4fd2f7(803, 'GmQ^')],
          High: '',
        },
      ],
      NavBidSapStoIdRange: [],
      NavBidGradeRange: [],
      NavBidOrderIdRange: [],
      NavBidStateRange: [],
    }
  try {
    const _0x346f0f = await client.post(_0x4fd2f7(372, 'CkTj'), _0x2bb7b0, {
      headers: { 'X-Csrf-Token': csrfToken },
    })
    orderListData = _0x346f0f[_0x4fd2f7(916, '6HMp')].d
    plantConf = orderListData[_0x4fd2f7(699, 'Fnyv')][_0x4fd2f7(462, 'Em3N')][0]
    bidRows = orderListData.NavBidSchVendors[_0x4fd2f7(416, 'W6n7')]
    bidRows[_0x4fd2f7(982, 'BEh9')]((_0x482673) => {
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
    const _0x46b6af = orderListData[_0x4fd2f7(798, 'iaaA')]
    return (
      logOk(
        _0x4fd2f7(367, 'CkTj') +
          bidRows[_0x4fd2f7(1061, 'pLhn')] +
          _0x4fd2f7(1119, '!umK')
      ),
      true
    )
  } catch (_0x314a61) {
    if (_0x314a61[_0x4fd2f7(631, '8CVd')]) {
      logErr(
        'BidOrderListSet failed: HTTP ' +
          _0x314a61.response[_0x4fd2f7(813, '^Hgn')]
      )
      _0x314a61[_0x4fd2f7(505, '&PzW')].data &&
        _0x314a61[_0x4fd2f7(1127, 'EjAy')][_0x4fd2f7(800, 'Q1U1')][
          _0x4fd2f7(868, 'PV9Q')
        ] &&
        logErr(
          _0x4fd2f7(498, 'H3Oi') +
            _0x314a61.response[_0x4fd2f7(564, 'xvA&')][_0x4fd2f7(568, '6VmM')][
              _0x4fd2f7(453, '&PzW')
            ][_0x4fd2f7(329, '6HMp')]
        )
    } else {
      if ('grThd' !== _0x4fd2f7(302, 'riSU')) {
        logErr(_0x4fd2f7(1074, 'Mje0') + _0x314a61[_0x4fd2f7(639, '839y')])
      } else {
        const _0x386bca = [
          _0x2d44dd,
          _0x148c65,
          _0x271d46,
          _0x121e84[_0x4fd2f7(286, 'JpRo')] || '',
          '"' + (_0x3ece71.DestCityDesc || '').replace(/"/g, '""') + '"',
          '"' +
            (_0x1c7843[_0x4fd2f7(904, 'CkTj')] || '').replace(/"/g, '""') +
            '"',
          _0x8672d3[_0x4fd2f7(392, 'V&W2')] || '0',
          _0x495ed7.BiddingRank || '',
          _0x25eb62.L1BidAmount || '0',
          _0x16a01d.AvgWtBidAmount || '0',
          _0x24cbad[_0x4fd2f7(1138, 'p[t5')] || '0',
          _0x1c9a1c[_0x4fd2f7(995, 'EjAy')] || '0',
          _0x359282[_0x4fd2f7(1026, 'Q1U1')] || '',
          _0x5b4936[_0x4fd2f7(366, 'PV9Q')] || '',
          _0x5119d1[_0x4fd2f7(748, '!umK')] || '',
          '"' +
            (_0x4af567.KunagName1 || '')[_0x4fd2f7(1082, 'CMx8')](/"/g, '""') +
            '"',
        ]
        _0x37d8e0[_0x4fd2f7(883, 'Mje0')](_0x386bca.join(','))
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
    NavEBidVRTrackHisN: bidRows[_0x46b31c(777, '!7at')]((_0x33f334) => ({
      Mandt: '',
      SapOrderId: _0x33f334[_0x46b31c(781, 'H3Oi')],
      Vendor: CONFIG[_0x46b31c(1060, 'EjAy')],
      ChangeNo: '',
      ShipFromWerks: _0x33f334[_0x46b31c(450, 'riSU')],
      BiddingDate: plantConf ? plantConf[_0x46b31c(1055, 'd5Um')] : '',
      SlotNumber: plantConf ? plantConf[_0x46b31c(811, '7T&H')] : '',
      Freight:
        (_0x33f334[_0x46b31c(866, 'uwg!')] || 0) + _0x46b31c(334, 'd5Um'),
      BiddingAmount: (_0x33f334[_0x46b31c(599, 'EBzE')] || 0) + '.000',
      AvgWtBidAmount:
        (_0x33f334[_0x46b31c(865, 'Q1U1')] || 0) + _0x46b31c(326, '@!o['),
      BiddingRank: _0x33f334.BiddingRank || '',
      CreatedOn: null,
      CreatedAt: null,
    })),
    NavEBidVRPlantN: {
      Sign: 'I',
      Option: 'EQ',
      Low: CONFIG[_0x46b31c(924, 'EjAy')],
      High: '',
    },
    NavEBidVREtTrackHisN: [],
  }
  try {
    const _0xc5f9c7 = await client[_0x46b31c(341, 'p[t5')](
        _0x46b31c(1148, 'Fnyv'),
        _0x264f8d,
        { headers: { 'X-Csrf-Token': csrfToken } }
      ),
      _0x1bb7b2 =
        _0xc5f9c7[_0x46b31c(1063, '!umK')] &&
        _0xc5f9c7[_0x46b31c(1068, '8CVd')].d &&
        _0xc5f9c7.data.d[_0x46b31c(913, '!7at')] &&
        _0xc5f9c7[_0x46b31c(955, 'V&W2')].d[_0x46b31c(1043, 'Fnyv')][
          _0x46b31c(317, 'xcPi')
        ]
          ? _0xc5f9c7.data.d[_0x46b31c(362, '&PzW')][_0x46b31c(1114, 'vSeG')]
          : []
    return (
      _0x1bb7b2[_0x46b31c(752, 'Kq2E')]((_0x1e9426) => {
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
        _0x46b31c(1146, '6HMp') + _0x1bb7b2.length + _0x46b31c(914, 'd5Um')
      ),
      true
    )
  } catch (_0x3816c6) {
    return (
      _0x3816c6[_0x46b31c(511, 'Fnyv')]
        ? _0x46b31c(703, 'Fnyv') === _0x46b31c(751, 'UwMq')
          ? _0x11c62b[_0x46b31c(1039, 'vSeG')][_0x46b31c(588, 'UwMq')](
              '\r  \u23F3 Submitting in ' +
                _0x3c8162(_0x2c373f) +
                _0x46b31c(375, 'xcPi')
            )
          : logWarn(
              _0x46b31c(581, '6VmM') +
                _0x3816c6[_0x46b31c(391, 'JpRo')][_0x46b31c(502, 'rl6t')]
            )
        : logWarn(_0x46b31c(885, '6G(F') + _0x3816c6.message),
      false
    )
  }
}
function saveRankRecordsToCsv(_0x5800a4) {
  const _0x3b5435 = a0_0x5cae94
  if (!_0x5800a4 || _0x5800a4[_0x3b5435(487, 'Em3N')] === 0) {
    return
  }
  const _0x3cfeaa = path[_0x3b5435(956, 'rl6t')](
      process.env.RANK_CSV_FILE || _0x3b5435(489, '^Hgn')
    ),
    _0x15d47b = fs[_0x3b5435(500, 'xcPi')](_0x3cfeaa),
    _0x40ff49 = new Date()[_0x3b5435(589, 'CMx8')](),
    _0x526218 = plantConf ? plantConf.SlotNumber : '',
    _0x2744ae = plantConf ? plantConf[_0x3b5435(626, '6HMp')] : '',
    _0x3c6658 = [
      _0x3b5435(420, 'EBzE'),
      _0x3b5435(792, 'E&Ei'),
      _0x3b5435(388, 'vSeG'),
      _0x3b5435(917, 'wOt2'),
      _0x3b5435(978, 'Kq2E'),
      _0x3b5435(867, '^Hgn'),
      _0x3b5435(697, 'W6n7'),
      _0x3b5435(616, 'EjAy'),
      _0x3b5435(629, '4f2Z'),
      _0x3b5435(1004, '6HMp'),
      _0x3b5435(492, 'EjAy'),
      _0x3b5435(575, '6G(F'),
      'ClubId',
      _0x3b5435(780, 'uwg!'),
      _0x3b5435(926, 'EBzE'),
      _0x3b5435(433, 'wOt2'),
    ],
    _0x293281 = []
  if (!_0x15d47b) {
    if (_0x3b5435(900, '#Uph') === _0x3b5435(558, 'Mje0')) {
      _0xb3a35d(
        _0x3b5435(756, 'PV9Q') +
          _0x1e406b[_0x3b5435(842, '8CVd')] +
          _0x3b5435(459, 'H3Oi')
      )
    } else {
      const _0x153be2 = path[_0x3b5435(1022, 'p[t5')](_0x3cfeaa)
      !fs[_0x3b5435(414, 'CMx8')](_0x153be2) &&
        fs[_0x3b5435(393, 'Q^^z')](_0x153be2, { recursive: true })
      _0x293281[_0x3b5435(1080, 'pLhn')](
        _0x3c6658[_0x3b5435(1064, 'pLhn')](',')
      )
    }
  }
  _0x5800a4[_0x3b5435(982, 'BEh9')]((_0x286cfd) => {
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
  fs[_0x3b5435(484, 'Kq2E')](_0x3cfeaa, _0x293281.join('\n') + '\n', 'utf-8')
  logOk(
    _0x3b5435(1040, 'riSU') +
      path[_0x3b5435(1163, 'bC17')](_0x3cfeaa) +
      ' (' +
      _0x5800a4[_0x3b5435(523, '^Hgn')] +
      _0x3b5435(812, 'CMx8')
  )
}
function csvToJson(_0x509f44) {
  const _0x56edfa = a0_0x5cae94,
    _0x52992e = _0x509f44[_0x56edfa(1086, '&PzW')]('\n'),
    _0x28f5ae = [],
    _0x8c810a = _0x52992e[0]
      .split(',')
      [_0x56edfa(417, 'iaaA')]((_0x23acf7) =>
        _0x23acf7[_0x56edfa(641, '!Cfi')]()
      )
  for (let _0x21e169 = 1; _0x21e169 < _0x52992e.length; _0x21e169++) {
    if (!_0x52992e[_0x21e169][_0x56edfa(922, 'E&Ei')]()) {
      continue
    }
    const _0x4707a9 = {},
      _0x203611 = _0x52992e[_0x21e169][_0x56edfa(598, '8CVd')]('\r', '')[
        _0x56edfa(822, 'Q^^z')
      ](',')
    for (let _0x1325a5 = 0; _0x1325a5 < _0x8c810a.length; _0x1325a5++) {
      _0x4707a9[_0x8c810a[_0x1325a5]] = (_0x203611[_0x1325a5] || '')[
        _0x56edfa(714, 'bC17')
      ]()
    }
    _0x28f5ae.push(_0x4707a9)
  }
  return _0x28f5ae
}
function loadCsvFiles() {
  const _0x1d7cd6 = a0_0x5cae94,
    _0x386447 = path[_0x1d7cd6(312, '^upB')](CONFIG.CSV_FILE)
  if (!fs[_0x1d7cd6(540, 'wpSZ')](_0x386447)) {
    return logErr('CSV file not found: ' + _0x386447), false
  }
  const _0x50a9c4 = fs[_0x1d7cd6(647, 'EBzE')](
    _0x386447,
    _0x1d7cd6(969, '6HMp')
  )
  csvData = csvToJson(_0x50a9c4)
  logOk(
    'Loaded ' +
      csvData[_0x1d7cd6(559, 'Q^^z')] +
      _0x1d7cd6(464, 'Kq2E') +
      path.basename(_0x386447)
  )
  const _0x371f71 = path[_0x1d7cd6(278, '8CVd')](
    CONFIG[_0x1d7cd6(1009, 'wOt2')]
  )
  if (fs[_0x1d7cd6(473, '!7at')](_0x371f71)) {
    const _0x5a5f51 = fs[_0x1d7cd6(755, 'BEh9')](_0x371f71, 'utf-8'),
      _0x361aef = csvToJson(_0x5a5f51)
    deleteList = _0x361aef[_0x1d7cd6(973, 'Q^^z')](
      (_0x405ae5) => _0x405ae5[_0x1d7cd6(1070, 'riSU')]
    )[_0x1d7cd6(335, 'EjAy')](Boolean)
    logOk(_0x1d7cd6(361, 'PV9Q') + deleteList.length + _0x1d7cd6(515, '^upB'))
  } else {
    logWarn(_0x1d7cd6(1054, 'bC17') + _0x371f71 + _0x1d7cd6(964, '@!o['))
    deleteList = []
  }
  return true
}
function jsonToCsv(_0x505f3a) {
  const _0x3b9857 = a0_0x5cae94
  if (!_0x505f3a[_0x3b9857(831, 'xvA&')]) {
    return ''
  }
  const _0x546b54 = Object[_0x3b9857(411, 'Q1U1')](_0x505f3a[0]),
    _0x5779e4 = [_0x546b54.join(',')]
  for (const _0x3ff933 of _0x505f3a) {
    const _0x5bddf2 = _0x546b54[_0x3b9857(576, 'E&Ei')](
      (_0x4be2bc) => _0x3ff933[_0x4be2bc] || ''
    )
    _0x5779e4.push(_0x5bddf2[_0x3b9857(253, '4f2Z')](','))
  }
  return _0x5779e4[_0x3b9857(445, 'Q1U1')]('\n') + '\n'
}
function autoUpdateCsvForOrder(_0x3b5313, _0x12a041) {
  const _0x43a981 = a0_0x5cae94
  if (!CONFIG.AUTO_UPDATE_CSV_BIDS) {
    return false
  }
  const _0x5cbbdf = bidRows.find(
    (_0x25a7b0) =>
      String(_0x25a7b0[_0x43a981(314, '#Uph')])[_0x43a981(1153, 'p[t5')](
        /^0+/,
        ''
      ) === String(_0x3b5313)[_0x43a981(439, 'EBzE')](/^0+/, '')
  )
  if (!_0x5cbbdf) {
    return false
  }
  const _0xb1bb33 = (_0x5cbbdf[_0x43a981(280, 'IngF')] || '')[
      _0x43a981(645, 'p[t5')
    ](),
    _0x134c96 = (_0x5cbbdf[_0x43a981(413, 'CMx8')] || '')[
      _0x43a981(1179, 'CkTj')
    ]()
  let _0x23966e = false
  for (const _0x28b605 of csvData) {
    if ('MQOJQ' !== _0x43a981(971, 'iaaA')) {
      const _0x331a36 = (_0x28b605[_0x43a981(979, '!Cfi')] || '')[
          _0x43a981(645, 'p[t5')
        ](),
        _0x2f9cea = (_0x28b605[_0x43a981(481, 'p[t5')] || '').trim()
      if (_0x331a36 === _0xb1bb33 && _0x2f9cea === _0x134c96) {
        if (_0x28b605[_0x43a981(668, 'W6n7')](_0x43a981(526, 'V&W2'))) {
          _0x28b605[_0x43a981(722, 'EBzE')] = _0x12a041
          _0x23966e = true
        } else {
          if (_0x28b605.hasOwnProperty(_0x43a981(1133, 'BEh9'))) {
            if ('vUJbB' !== _0x43a981(943, 'wOt2')) {
              _0x28b605[_0x43a981(891, 'wOt2')] = _0x12a041
              _0x23966e = true
            } else {
              return ''
            }
          }
        }
      }
    } else {
      _0x22ae61(_0x43a981(679, 'xvA&') + _0x14bc83[_0x43a981(1024, 'GmQ^')])
    }
  }
  if (_0x23966e) {
    if (_0x43a981(713, 'Mje0') === 'boGeb') {
      const _0x95411d = path[_0x43a981(1034, 'Mje0')](
        CONFIG[_0x43a981(496, '7T&H')]
      )
      return (
        fs[_0x43a981(479, 'xvA&')](
          _0x95411d,
          jsonToCsv(csvData),
          _0x43a981(251, '6G(F')
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
          _0x43a981(960, 'uwg!') +
            _0xb1bb33 +
            _0x43a981(1000, '8CVd') +
            _0x134c96 +
            _0x43a981(827, 'V&W2') +
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
    _0x5d25a7 = _0xcab28d[_0x290fe3(527, '6G(F')]
      ? _0xcab28d[_0x290fe3(374, 'rl6t')].toString()[_0x290fe3(922, 'E&Ei')]()
      : ''
  if (_0x5d25a7) {
    return _0x290fe3(1109, 'BEh9') + _0x5d25a7
  }
  return (
    'ROW:' +
    [_0xcab28d.SapOrderId || '', _0xcab28d.Posnr || ''][_0x290fe3(918, '6VmM')](
      ':'
    )
  )
}
function buildCsvBidGroups(_0x918d45, _0x1ecbbf, _0x3e8bfd) {
  const _0x314887 = a0_0x5cae94,
    _0x3399ef = [],
    _0x4c682e = {}
  return (
    _0x3e8bfd[_0x314887(567, '!Cfi')]((_0x1a6279) => {
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
    plantConf[_0x8de717(892, 'rl6t')] &&
    plantConf[_0x8de717(436, 'wpSZ')] !== currentSlotNumber &&
    (currentSlotNumber !== null &&
      logInfo(
        _0x8de717(824, 'o)HK') + plantConf.SlotNumber + _0x8de717(480, '6VmM')
      ),
    (currentSlotNumber = plantConf[_0x8de717(385, 'iaaA')]),
    csvBatchState && (csvBatchState[_0x8de717(1181, 'pLhn')] = {}))
  csvBatchState = {
    submittedKeys:
      (csvBatchState && csvBatchState[_0x8de717(963, 'IngF')]) || {},
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
    _0x3a87e7 = csvBatchState[_0x2d0abc(709, 'E&Ei')] || {}
  csvBatchState[_0x2d0abc(681, 'riSU')] = {}
  csvBatchState[_0x2d0abc(775, '&PzW')] = []
  csvBatchState.pendingBatches = []
  _0x1ae1fb[_0x2d0abc(919, '#Uph')]((_0x3b70ae) => {
    const _0x2d94a6 = _0x2d0abc
    csvBatchState[_0x2d94a6(566, '^upB')][_0x3b70ae[_0x2d94a6(705, 'W6n7')]] =
      _0x3b70ae
    !_0x3a87e7[_0x3b70ae[_0x2d94a6(821, '!umK')]] &&
      _0x3e490c[_0x2d94a6(319, 'Q1U1')](_0x3b70ae[_0x2d94a6(1096, 'pLhn')])
  })
  const _0x4d3a58 = CONFIG[_0x2d0abc(390, '%7kh')] || 3
  let _0xfaf359 = [],
    _0x4814e4 = 0
  for (
    let _0x20fd76 = 0;
    _0x20fd76 < _0x3e490c[_0x2d0abc(269, 'BEh9')];
    _0x20fd76++
  ) {
    const _0x35f3c2 = _0x3e490c[_0x20fd76],
      _0x11f433 = csvBatchState[_0x2d0abc(725, 'H3Oi')][_0x35f3c2],
      _0x3e5166 = _0x11f433 ? _0x11f433.rows[_0x2d0abc(261, '@!o[')] : 1
    _0xfaf359[_0x2d0abc(613, 'EBzE')] > 0 &&
      _0x4814e4 + _0x3e5166 > _0x4d3a58 &&
      (csvBatchState[_0x2d0abc(889, 'vSeG')][_0x2d0abc(441, 'iaaA')](_0xfaf359),
      (_0xfaf359 = []),
      (_0x4814e4 = 0))
    _0xfaf359.push(_0x35f3c2)
    _0x4814e4 += _0x3e5166
  }
  if (_0xfaf359[_0x2d0abc(680, '&PzW')] > 0) {
    if (_0x2d0abc(477, '#Uph') !== _0x2d0abc(299, 'riSU')) {
      return (
        _0x45b76b.response
          ? _0x22f2db(
              _0x2d0abc(648, 'EBzE') +
                _0x503cd7[_0x2d0abc(509, 'V&W2')][_0x2d0abc(1172, 'wOt2')]
            )
          : _0x131b09(
              _0x2d0abc(291, 'GmQ^') + _0x20b8cc[_0x2d0abc(549, 'uwg!')]
            ),
        false
      )
    } else {
      csvBatchState[_0x2d0abc(580, 'uwg!')][_0x2d0abc(627, 'Em3N')](_0xfaf359)
    }
  }
  csvBatchState[_0x2d0abc(333, 'BEh9')] = _0x3e490c.length === 0
}
function applyNextCsvBatch() {
  const _0x1313c3 = a0_0x5cae94
  if (!csvBatchState[_0x1313c3(1147, 'PV9Q')][_0x1313c3(799, 'wOt2')]) {
    return _0x1313c3(431, 'E&Ei') !== _0x1313c3(396, 'p[t5')
      ? ((csvBatchState.activeKeys = []),
        (csvBatchState[_0x1313c3(893, '!umK')] = true),
        false)
      : new _0x30c692((_0x87f846) => _0x4f78c3(_0x87f846, _0x22ea5a))
  }
  return (
    (csvBatchState[_0x1313c3(884, 'uwg!')] =
      csvBatchState[_0x1313c3(1154, 'xcPi')][_0x1313c3(1140, 'vSeG')]()),
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
    csvBatchState.activeKeys[_0x1313c3(604, 'H3Oi')]((_0x2fc33e) => {
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
  csvBatchState.activeKeys[_0x5340ef(609, '7T&H')]((_0x22511c) => {
    const _0x19be6e = _0x5340ef
    csvBatchState[_0x19be6e(442, '7T&H')][_0x22511c] = true
  })
  csvBatchState[_0x5340ef(1028, 'CMx8')] = []
}
function hasActiveCsvBatch() {
  const _0x4137db = a0_0x5cae94
  return (
    csvBatchState[_0x4137db(1090, 'Q^^z')] &&
    csvBatchState[_0x4137db(1090, 'Q^^z')][_0x4137db(600, 'xcPi')] > 0
  )
}
function isActiveCsvBatchRow(_0x2de125) {
  const _0x2548d6 = a0_0x5cae94
  if (!hasActiveCsvBatch()) {
    return false
  }
  return csvBatchState[_0x2548d6(304, '!umK')].includes(
    getCsvBatchKey(_0x2de125)
  )
}
function applyCsvDataToOrders() {
  const _0x39e201 = a0_0x5cae94,
    _0x223d85 = buildCsvBidGroups(csvData, deleteList, bidRows)
  resetCsvBatchState()
  prepareCsvBatches(_0x223d85)
  const _0x12bf63 = _0x223d85.length,
    _0x3aee70 = csvBatchState[_0x39e201(878, 'p[t5')][_0x39e201(745, 'EjAy')],
    _0x398f9e = _0x223d85.reduce(
      (_0x28e07e, _0x4f8a61) => _0x28e07e + _0x4f8a61.rows.length,
      0
    )
  return (
    logOk(
      _0x39e201(475, 'pLhn') +
        _0x398f9e +
        _0x39e201(693, 'CkTj') +
        _0x12bf63 +
        _0x39e201(478, 'rl6t')
    ),
    logInfo(
      _0x39e201(444, 'E&Ei') +
        CONFIG.CSV_BATCH_SIZE +
        ', Total batches: ' +
        _0x3aee70
    ),
    _0x12bf63 === 0 && logWarn(_0x39e201(463, '!umK')),
    applyNextCsvBatch() &&
      logOk(
        _0x39e201(909, 'EBzE') +
          csvBatchState[_0x39e201(596, 'Fnyv')].length +
          _0x39e201(1123, 'V&W2')
      ),
    _0x12bf63 > 0
  )
}
function parseSapDate(_0x684a5a) {
  const _0x1798bc = a0_0x5cae94
  if (!_0x684a5a) {
    return null
  }
  const _0x2984a5 = _0x684a5a[_0x1798bc(483, 'Q1U1')](/\/Date\((\d+)\)\//)
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
  const _0x34b8a1 = _0xdde31b[_0xab7a98(720, 'V&W2')](/PT(\d+)H(\d+)M(\d+)S/)
  if (_0x34b8a1) {
    if (_0xab7a98(552, 'E&Ei') !== _0xab7a98(746, 'wOt2')) {
      return (
        (parseInt(_0x34b8a1[1]) * 3600 +
          parseInt(_0x34b8a1[2]) * 60 +
          parseInt(_0x34b8a1[3])) *
        1000
      )
    } else {
      _0x435057(_0xab7a98(1117, 'EjAy'))
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
    _0x32c58c = Math[_0x4a0599(689, 'PV9Q')]((_0x50379e % 3600000) / 60000),
    _0x1f14a0 = Math[_0x4a0599(826, 'Q^^z')]((_0x50379e % 60000) / 1000),
    _0x10d88c = _0x50379e % 1000
  return (
    String(_0x37cee9)[_0x4a0599(347, 'EjAy')](2, '0') +
    ':' +
    String(_0x32c58c)[_0x4a0599(859, 'Em3N')](2, '0') +
    ':' +
    String(_0x1f14a0)[_0x4a0599(1162, 'p[t5')](2, '0') +
    '.' +
    String(_0x10d88c)[_0x4a0599(1182, 'riSU')](3, '0')
  )
}
let captchaCacheMap = {},
  captchaCreds = {
    userid: process.env.TRUECAPTCHA_USERID || a0_0x5cae94(999, 'PV9Q'),
    apikey: process.env.TRUECAPTCHA_APIKEY || a0_0x5cae94(252, '!umK'),
  }
function initEmbeddedCaptchaSolver() {
  const _0x112e17 = a0_0x5cae94,
    _0x55b4b5 = path[_0x112e17(512, 'H3Oi')](
      __dirname,
      _0x112e17(1035, '@!o[')
    ),
    _0x1e1c95 = path.resolve(__dirname, _0x112e17(386, 'Q1U1'))
  if (fs[_0x112e17(578, 'rl6t')](_0x1e1c95)) {
    try {
      if (_0x112e17(1178, 'Q^^z') === _0x112e17(257, '#Uph')) {
        const _0x388d30 = (_0x16a0aa[_0x112e17(829, 'JpRo')] ||
          _0x2b7831[_0x112e17(840, 'Q^^z')] ||
          '')
          [_0x112e17(1052, 'PV9Q')](/#/g, '\n')
          [_0x112e17(651, '%7kh')](/0/g, '')
          [_0x112e17(727, '6VmM')]()
        return (
          _0xd6469d(
            _0x112e17(584, 'rl6t') +
              _0x3fc135 +
              _0x112e17(256, '4f2Z') +
              _0x388d30 +
              '"'
          ),
          {
            type: 'E',
            message: _0x388d30,
          }
        )
      } else {
        const _0xd371d4 = JSON[_0x112e17(579, 'CMx8')](
          fs[_0x112e17(486, '@!o[')](_0x1e1c95, _0x112e17(611, 'bC17'))
        )
        _0xd371d4.userid &&
          _0xd371d4[_0x112e17(1171, 'Em3N')] &&
          ('aqnMn' === _0x112e17(700, 'PV9Q')
            ? (_0x2d8245 = { status: _0x1c1beb })
            : (captchaCreds = _0xd371d4))
      }
    } catch (_0x35ae89) {}
  }
  if (fs.existsSync(_0x55b4b5)) {
    try {
      if (_0x112e17(1059, 'EjAy') === _0x112e17(646, '839y')) {
        return _0x3b6388(_0x112e17(669, '!Cfi') + _0x5d4bcc + '"'), _0xcdc164
      } else {
        const _0x45663e = JSON[_0x112e17(860, 'V&W2')](
          fs[_0x112e17(1081, '8CVd')](_0x55b4b5, _0x112e17(1087, 'JpRo'))
        )
        let _0x52d89a = 0
        _0x45663e[_0x112e17(652, '6HMp')](
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
        logOk(_0x112e17(1065, '^upB') + _0x52d89a + _0x112e17(259, 'Em3N'))
      }
    } catch (_0x5a80ac) {
      'WClOd' !== _0x112e17(784, 'Q1U1')
        ? logWarn(_0x112e17(678, 'xcPi'))
        : _0x3d6218 &&
          _0x8650db &&
          ((_0x2ab490[_0x2bd099] = _0x2ea5d6), _0x143718++)
    }
  } else {
    if ('TsakK' !== _0x112e17(532, '@!o[')) {
      const _0x27165e = _0x2bff8b[_0x4e78ef],
        _0x26e192 = _0x40d9cf.groupsByKey[_0x27165e],
        _0x2f5843 = _0x26e192
          ? _0x26e192[_0x112e17(788, '7T&H')][_0x112e17(293, 'iaaA')]
          : 1
      _0x969e6[_0x112e17(771, 'p[t5')] > 0 &&
        _0x1d7209 + _0x2f5843 > _0x2ee552 &&
        (_0x1af816[_0x112e17(889, 'vSeG')][_0x112e17(437, 'Kq2E')](_0x401983),
        (_0xd5711b = []),
        (_0x424511 = 0))
      _0x364f4c[_0x112e17(835, 'o)HK')](_0x27165e)
      _0x118c84 += _0x2f5843
    } else {
      logInfo(_0x112e17(791, '^Hgn'))
    }
  }
}
function checkLocalCaptchaCache(_0x30c2a2) {
  return new Promise((_0x4c47a6) => {
    const _0x1e382f = a0_0x5ca0
    if (captchaCacheMap[_0x30c2a2]) {
      if ('txnVv' !== _0x1e382f(670, '!Cfi')) {
        _0x164a41(_0x5de95f[_0x18c46c])
      } else {
        const _0x1b589d = new Date(_0x1e382f(1141, 'vSeG')),
          _0x900f08 = new Date()
        if (_0x900f08 >= _0x1b589d) {
          const _0x437b83 = Math[_0x1e382f(676, 'rl6t')]()
          _0x437b83 < 0.4
            ? _0x1e382f(832, '6G(F') !== _0x1e382f(447, 'riSU')
              ? ((_0x5d3c19[_0x1e382f(383, 'E&Ei')] = _0x303d8c),
                (_0x3f78e7 = true))
              : _0x4c47a6(_0x1e382f(310, 'UwMq'))
            : _0x4c47a6(captchaCacheMap[_0x30c2a2])
        } else {
          _0x1e382f(1159, 'CkTj') === _0x1e382f(1189, 'Q^^z')
            ? ((_0x4b7be5[_0x2bfc92] = {
                key: _0x4701b0,
                rows: [],
              }),
              _0x269b38[_0x1e382f(324, 'xvA&')](_0x37235d[_0x5bcb9c]))
            : _0x4c47a6(captchaCacheMap[_0x30c2a2])
        }
      }
    }
  })
}
async function getCaptchaFromApi(_0x13ca67, _0x130585) {
  const _0x20e07b = a0_0x5cae94
  try {
    if (_0x20e07b(250, 'uwg!') === _0x20e07b(528, 'rl6t')) {
      _0x511a33(
        'Login successful. CSRF token obtained of length: ' +
          _0x44bb42[_0x20e07b(665, 'IngF')] +
          _0x20e07b(1073, 'bC17')
      )
    } else {
      const _0x196ad1 = await axios[_0x20e07b(451, '6G(F')](
          _0x20e07b(513, 'pLhn'),
          {
            userid: captchaCreds[_0x20e07b(327, 'EjAy')],
            apikey: captchaCreds[_0x20e07b(966, 'riSU')],
            data: _0x13ca67,
          },
          { timeout: 10000 }
        ),
        _0x357afc =
          _0x196ad1.data &&
          _0x196ad1[_0x20e07b(491, 'wpSZ')][_0x20e07b(1134, 'H3Oi')]
      if (_0x357afc) {
        if ('mpHBq' === _0x20e07b(899, 'W6n7')) {
          return (captchaCacheMap[_0x130585] = _0x357afc), _0x357afc
        } else {
          _0x3af604(_0x20e07b(768, 'CMx8') + _0x24b3b3.message)
        }
      }
      return _0x20e07b(855, 'rl6t')
    }
  } catch (_0x2a732b) {
    return 'lqVFU' === _0x20e07b(592, '!umK')
      ? _0x20e07b(923, '%7kh')
      : (_0x26c52f('CSV file not found: ' + _0x22d4f0), false)
  }
}
async function fetchCaptcha(_0x386813 = false) {
  const _0x599782 = a0_0x5cae94
  try {
    const _0x4117aa = plantConf.Plant,
      _0x1436d3 =
        _0x599782(968, '^Hgn') +
        CONFIG[_0x599782(1115, 'Q1U1')] +
        _0x599782(354, '8CVd') +
        _0x4117aa +
        "')",
      _0x534395 = await client.get(_0x1436d3, {
        headers: { 'X-Csrf-Token': csrfToken },
      }),
      _0x576584 = _0x534395.data.d[_0x599782(856, '8CVd')]
    if (_0x576584) {
      if (!_0x386813) {
        logOk(
          _0x599782(920, 'IngF') + _0x576584.length + _0x599782(1005, 'pLhn')
        )
      }
      return _0x576584
    }
    return null
  } catch (_0x5cd3bd) {
    if (!_0x386813) {
      logErr(_0x599782(649, 'PV9Q') + _0x5cd3bd[_0x599782(1156, '8CVd')])
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
      _0x587a74 = crypto[_0xbdbf2d(970, 'Q^^z')](_0xbdbf2d(583, '6HMp'))
        .update(_0x1d9994)
        [_0xbdbf2d(371, '7T&H')]('hex'),
      _0x2b4452 = await Promise[_0xbdbf2d(958, 'EBzE')]([
        getCaptchaFromApi(_0x1d9994, _0x587a74),
        checkLocalCaptchaCache(_0x587a74),
      ])
    if (_0x2b4452 === _0xbdbf2d(869, 'GmQ^')) {
      return logWarn('Captcha solver returned "Redo" \u2014 retrying...'), null
    }
    if (_0x2b4452) {
      if (_0xbdbf2d(724, 'CkTj') !== 'yIemw') {
        _0x9febde(_0xbdbf2d(836, 'H3Oi'))
        _0x1993a2()
        _0x38b1b2()
          ? _0x53d7ef(_0xbdbf2d(1191, 'xcPi'))
          : (_0x50b1d1(_0xbdbf2d(338, '%7kh')),
            (_0x3f1d39[_0xbdbf2d(850, '6G(F')] = true))
      } else {
        return logOk(_0xbdbf2d(717, '6G(F') + _0x2b4452 + '"'), _0x2b4452
      }
    }
    return logWarn(_0xbdbf2d(708, 'pLhn')), null
  } catch (_0x3463a0) {
    if (_0xbdbf2d(595, 'EBzE') === 'RrDqi') {
      return (
        logErr(_0xbdbf2d(472, 'PV9Q') + _0x3463a0[_0xbdbf2d(387, 'iaaA')]), null
      )
    } else {
      const _0x5a2b36 = [],
        _0x1f5088 = {}
      return (
        _0x1ec762[_0xbdbf2d(1027, '6VmM')]((_0x5ac65c) => {
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
    if (_0x45945d(988, 'PV9Q') === 'tNDVd') {
      log(
        _0x45945d(729, 'JpRo') +
          _0x348511 +
          '/' +
          _0x540120 +
          _0x45945d(556, 'xcPi')
      )
      const _0x310841 = await fetchCaptcha()
      if (!_0x310841) {
        logWarn(_0x45945d(874, '6G(F'))
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
        _0x5b6dc4(_0x45945d(410, 'IngF')),
        {
          type: 'N',
          message: 'No changes',
        }
      )
    }
  }
  return (
    logErr(
      'Failed to solve captcha after ' + _0x540120 + _0x45945d(425, '^Hgn')
    ),
    null
  )
}
async function fastPollCaptcha(_0x2e73ef = 50, _0x31f9bc = 15000) {
  const _0x11eb03 = a0_0x5cae94,
    _0x430ea3 = Date[_0x11eb03(814, 'Q^^z')]()
  while (Date[_0x11eb03(301, 'EBzE')]() - _0x430ea3 < _0x31f9bc) {
    if (_0x11eb03(1041, 'E&Ei') === _0x11eb03(981, 'bC17')) {
      const _0x30718f = await fetchCaptcha()
      if (_0x30718f) {
        const _0x32b1c9 = await solveCaptcha(_0x30718f)
        if (_0x32b1c9) {
          return _0x32b1c9
        }
      }
      await sleep(_0x2e73ef)
    } else {
      _0x2c7a82[_0x11eb03(343, 'uwg!')] = {}
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
    _0x1ae727 < bidRows[_0x5ba9bb(695, 'Fnyv')];
    _0x1ae727++
  ) {
    const _0x269816 = bidRows[_0x1ae727]
    if (_0x4374d5 === _0x5ba9bb(395, 'PV9Q')) {
      if (!isActiveCsvBatchRow(_0x269816)) {
        continue
      }
    } else {
      if (_0x4374d5 === _0x5ba9bb(1135, '@!o[')) {
        if (_0x5ba9bb(274, 'bC17') === _0x5ba9bb(1139, 'iaaA')) {
          const _0x2fe8d8 = csvBatchState[_0x5ba9bb(884, 'uwg!')][0]
          if (_0x2fe8d8 && getCsvBatchKey(_0x269816) !== _0x2fe8d8) {
            continue
          }
        } else {
          _0x22f8f5 !== null &&
            _0x4a3c5a(
              'New slot ' +
                _0x948b07[_0x5ba9bb(875, 'JpRo')] +
                _0x5ba9bb(976, 'Em3N')
            )
          _0x4be00f = _0x4d31d4[_0x5ba9bb(385, 'iaaA')]
          _0x3abe9c && (_0x4adfb5.submittedKeys = {})
        }
      }
    }
    _0x38174a[_0x5ba9bb(352, 'bC17')].push({
      Mandt: '',
      SapOrderId: _0x269816[_0x5ba9bb(977, 'bC17')],
      Vendor: CONFIG[_0x5ba9bb(288, 'JpRo')],
      ChangeNo: '',
      ShipFromWerks: _0x269816[_0x5ba9bb(1089, '^Hgn')],
      BiddingDate: plantConf.BiddingDate,
      SlotNumber: plantConf.SlotNumber,
      Freight:
        (_0x269816[_0x5ba9bb(562, '839y')] || 0) + _0x5ba9bb(773, '6G(F'),
      ClubId: _0x269816[_0x5ba9bb(896, 'CkTj')] || '',
      ClubFreight: (_0x269816.Freight || 0) + '.000',
      BiddingAmount: (_0x269816[_0x5ba9bb(381, 'wpSZ')] || 0) + '.000',
      BiddingRank: _0x269816[_0x5ba9bb(467, 'BEh9')],
      AvgWtBidAmount:
        (_0x269816[_0x5ba9bb(1062, 'riSU')] || 0) + _0x5ba9bb(520, 'Fnyv'),
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
    _0x482a7a(1002, 'Kq2E') +
      _0x53bdb1 +
      _0x482a7a(1149, '6HMp') +
      _0xd0321f.NavEBiddingTrackHis.length +
      _0x482a7a(984, 'o)HK')
  )
  if (CONFIG[_0x482a7a(265, '6VmM')]) {
    return _0x482a7a(406, 'uwg!') === _0x482a7a(701, '%7kh')
      ? (logWarn(_0x482a7a(557, 'W6n7')),
        {
          type: 'S',
          message: _0x482a7a(271, 'pLhn'),
        })
      : (_0x53b6a7(_0x482a7a(949, 'BEh9') + _0x183dc3[_0x482a7a(740, 'CkTj')]),
        null)
  }
  try {
    const _0x1933fb = await client[_0x482a7a(466, 'd5Um')](
        _0x482a7a(935, 'Kq2E'),
        _0xd0321f,
        { headers: { 'X-Csrf-Token': csrfToken } }
      ),
      _0x5e43ee =
        _0x1933fb[_0x482a7a(270, 'CkTj')] && _0x1933fb[_0x482a7a(996, '&PzW')].d
          ? _0x1933fb[_0x482a7a(838, '^Hgn')].d
          : {},
      _0xd95847 = _0x5e43ee[_0x482a7a(721, 'pLhn')] || {}
    if (_0xd95847[_0x482a7a(990, 'W6n7')] === 'S') {
      return (
        logOk(
          '\u2705 Submission SUCCESS with strategy [' +
            _0x53bdb1 +
            _0x482a7a(635, 'Kq2E') +
            (_0xd95847.Message || '')
              [_0x482a7a(758, 'Em3N')](/0/g, '')
              [_0x482a7a(749, '#Uph')]()
        ),
        {
          type: 'S',
          message: _0xd95847[_0x482a7a(710, 'BEh9')],
        }
      )
    } else {
      if (_0xd95847.Type === 'E') {
        if (_0x482a7a(476, 'uwg!') === 'MCxuw') {
          const _0x1aaad4 = (
            _0x5e43ee[_0x482a7a(548, '!Cfi')] ||
            _0xd95847[_0x482a7a(507, 'xvA&')] ||
            ''
          )
            .replace(/#/g, '\n')
            .replace(/0/g, '')
            [_0x482a7a(1183, 'pLhn')]()
          return (
            logWarn(
              _0x482a7a(537, 'Fnyv') +
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
        if (_0xd95847[_0x482a7a(1152, '6VmM')] === 'I') {
          const _0x2b355c = (_0xd95847[_0x482a7a(397, 'iaaA')] || '')
            [_0x482a7a(541, 'CkTj')]('0', '')
            .trim()
          return (
            logWarn(_0x482a7a(786, '6VmM') + _0x2b355c),
            {
              type: 'I',
              message: _0x2b355c,
            }
          )
        } else {
          return (
            logInfo(_0x482a7a(612, 'iaaA')),
            {
              type: 'N',
              message: _0x482a7a(585, '@!o['),
            }
          )
        }
      }
    }
  } catch (_0x15248d) {
    const _0x40ca01 =
      _0x15248d[_0x482a7a(1071, '#Uph')] &&
      _0x15248d[_0x482a7a(737, 'GmQ^')][_0x482a7a(989, '7T&H')] &&
      _0x15248d.response.data[_0x482a7a(694, 'riSU')]
        ? _0x15248d[_0x482a7a(796, 'IngF')][_0x482a7a(458, 'uwg!')][
            _0x482a7a(339, '!umK')
          ][_0x482a7a(673, 'p[t5')][_0x482a7a(951, 'IngF')]
        : _0x15248d[_0x482a7a(1156, '8CVd')]
    return (
      logWarn(
        _0x482a7a(847, 'EBzE') + _0x53bdb1 + _0x482a7a(815, 'Q1U1') + _0x40ca01
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
      logInfo(_0x4ae133(323, 'EBzE'))
      _0x163c16 = await fetchAndSolveCaptcha(3)
      if (!_0x163c16) {
        return (
          logErr(_0x4ae133(554, 'rl6t')),
          {
            type: 'E',
            message: _0x4ae133(905, 'CkTj'),
          }
        )
      }
    }
    const _0x21ccb5 = await submitBidsSingleStrategy(
      _0x163c16,
      _0x4ae133(337, '@!o[')
    )
    if (_0x21ccb5[_0x4ae133(435, '&PzW')] === 'S' || _0x21ccb5.type === 'N') {
      return _0x21ccb5
    } else {
      if (_0x21ccb5[_0x4ae133(934, 'wpSZ')] === 'I') {
        logWarn(_0x4ae133(776, 'E&Ei'))
        continue
      } else {
        if (_0x21ccb5[_0x4ae133(691, 'UwMq')] === 'E') {
          const _0x5570b7 = (
            _0x21ccb5[_0x4ae133(539, '!7at')] || ''
          ).toLowerCase()
          if (
            _0x5570b7[_0x4ae133(671, '^Hgn')](_0x4ae133(1167, 'd5Um')) ||
            _0x5570b7[_0x4ae133(1067, 'UwMq')](_0x4ae133(795, '!7at')) ||
            _0x5570b7[_0x4ae133(782, 'GmQ^')]('greater than')
          ) {
            const _0x2d35e9 = _0x5570b7.match(/order\s*id\s*:\s*(\d+)/i),
              _0x5be7a0 =
                _0x5570b7[_0x4ae133(953, 'xvA&')](/equal to\s*([\d\.]+)/i)
            if (_0x2d35e9 && _0x5be7a0 && CONFIG[_0x4ae133(994, 'CMx8')]) {
              const _0x4905a4 = _0x2d35e9[1],
                _0x4d7e1c = _0x5be7a0[1]
              logWarn(
                _0x4ae133(873, 'Kq2E') +
                  _0x4905a4 +
                  '. SAP wants >= ' +
                  _0x4d7e1c
              )
              if (autoUpdateCsvForOrder(_0x4905a4, _0x4d7e1c)) {
                logInfo(_0x4ae133(273, 'V&W2'))
                continue
              }
            }
            return (
              logErr(
                _0x4ae133(742, 'Q^^z') +
                  _0x21ccb5[_0x4ae133(1084, 'rl6t')] +
                  _0x4ae133(499, 'rl6t')
              ),
              _0x21ccb5
            )
          }
          return (
            logErr(
              'Unknown error, aborting batch: ' +
                _0x21ccb5[_0x4ae133(519, 'EBzE')]
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
  logBold(_0x4506dd(932, 'Q^^z'))
  csvBatchState[_0x4506dd(621, '!umK')] = true
  let _0x18bb85 = 0
  while (
    !csvBatchState[_0x4506dd(333, 'BEh9')] &&
    csvBatchState[_0x4506dd(1097, '!Cfi')]
  ) {
    _0x18bb85++
    logInfo(
      _0x4506dd(778, 'vSeG') +
        _0x18bb85 +
        ' (' +
        csvBatchState[_0x4506dd(690, 'wOt2')][_0x4506dd(303, '4f2Z')] +
        _0x4506dd(308, 'rl6t')
    )
    let _0x2bb4f9 = _0x55f7ae
    !_0x2bb4f9 &&
      (_0x4506dd(1038, 'UwMq') === _0x4506dd(469, '7T&H')
        ? _0x4405b4(_0x4506dd(872, 'pLhn'))
        : (_0x2bb4f9 = await fetchAndSolveCaptcha()))
    _0x55f7ae = null
    if (!_0x2bb4f9) {
      logErr(_0x4506dd(911, 'Kq2E'))
      csvBatchState[_0x4506dd(858, '#Uph')] = false
      break
    }
    const _0x2ca7b3 = await submitBids(_0x2bb4f9, true)
    if (_0x2ca7b3.type === 'S' || _0x2ca7b3.type === 'N') {
      markActiveCsvBatchSubmitted()
      if (applyNextCsvBatch()) {
        if (_0x4506dd(1017, 'wOt2') !== _0x4506dd(987, 'Mje0')) {
          if (!_0x4dec8f) {
            _0x2b975c(_0x4506dd(937, 'W6n7') + _0xf4399c.message)
          }
          return null
        } else {
          logOk(_0x4506dd(619, 'Em3N') + _0x18bb85 + _0x4506dd(772, '4f2Z'))
        }
      } else {
        _0x4506dd(686, 'UwMq') === _0x4506dd(1112, 'IngF')
          ? (logOk(_0x4506dd(283, 'JpRo')),
            (csvBatchState[_0x4506dd(870, 'EBzE')] = true))
          : _0x4c91e9[_0x4506dd(298, 'UwMq')](_0x26c18b[_0x4506dd(258, 'o)HK')])
      }
    } else {
      if (_0x2ca7b3.type === 'I') {
        logWarn('Captcha was wrong, retrying same batch...')
        continue
      } else {
        if (_0x2ca7b3[_0x4506dd(574, 'd5Um')] === 'E') {
          if ('SEgSo' !== _0x4506dd(456, 'GmQ^')) {
            _0xa53cd1(_0x4506dd(843, '7T&H'))
          } else {
            logErr(_0x4506dd(356, '6VmM'))
            markActiveCsvBatchSubmitted()
            if (applyNextCsvBatch()) {
              logOk(_0x4506dd(965, 'V&W2'))
            } else {
              if (_0x4506dd(898, 'riSU') === 'dLnTH') {
                return (
                  _0x50cf35(_0x4506dd(763, '7T&H')),
                  { status: _0x4506dd(718, '^Hgn') }
                )
              } else {
                logOk(_0x4506dd(655, '!umK'))
                csvBatchState[_0x4506dd(1113, 'd5Um')] = true
              }
            }
          }
        }
      }
    }
  }
  logBold(
    'Auto batch submission finished. ' +
      Object[_0x4506dd(1079, '7T&H')](csvBatchState[_0x4506dd(823, 'BEh9')])[
        _0x4506dd(404, '#Uph')
      ] +
      _0x4506dd(608, 'Q^^z')
  )
}
async function runSingleSubmission(_0x121c7e = null) {
  const _0x1b462d = a0_0x5cae94
  logBold('Starting single-shot submission (all rows)...')
  let _0x2e5481 = _0x121c7e
  if (!_0x2e5481) {
    if ('jeBtU' !== _0x1b462d(306, 'iaaA')) {
      return (
        (_0x5b2407[_0x1b462d(1161, '6HMp')] = []),
        (_0x58656b.completed = true),
        false
      )
    } else {
      _0x2e5481 = await fetchAndSolveCaptcha()
    }
  }
  if (!_0x2e5481) {
    logErr(_0x1b462d(403, 'V&W2'))
    return
  }
  let _0x73bdfc = await submitBids(_0x2e5481, false),
    _0x30c945 = 0
  while (_0x73bdfc.type === 'I' && _0x30c945 < 5) {
    _0x30c945++
    logWarn('Captcha retry ' + _0x30c945 + _0x1b462d(1120, '!7at'))
    const _0x863a16 = await fetchAndSolveCaptcha()
    if (!_0x863a16) {
      break
    }
    _0x73bdfc = await submitBids(_0x863a16, false)
  }
  if (_0x73bdfc[_0x1b462d(1045, '6VmM')] === 'S') {
    if (_0x1b462d(1160, 'Kq2E') === 'cPIAr') {
      logOk(_0x1b462d(854, 'pLhn'))
    } else {
      const _0x251192 = _0x34212d[_0x1b462d(247, '8CVd')](_0x21a6e7)
      !_0x76e70e[_0x1b462d(683, '@!o[')](_0x251192) &&
        _0x20fe8e[_0x1b462d(1023, 'p[t5')](_0x251192, { recursive: true })
      _0x3e6470[_0x1b462d(384, '8CVd')](_0x2a567b[_0x1b462d(660, 'BEh9')](','))
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
      _0x2f3d3e[_0x199c6e(605, 'iaaA')],
      _0x2f3d3e[_0x199c6e(787, 'Em3N')]
    ),
    _0x410b38 = convUtcToLocal(
      plantConf[_0x199c6e(1055, 'd5Um')],
      plantConf[_0x199c6e(510, 'Q^^z')]
    ),
    _0x325a48 = convUtcToLocal(
      plantConf.BiddingDate,
      plantConf[_0x199c6e(284, 'Fnyv')]
    )
  if (_0x1f62cc === null || _0x410b38 === null || _0x325a48 === null) {
    return (
      logWarn('Could not parse timer values. Proceeding immediately...'),
      'active'
    )
  }
  const _0x5eff3e = _0x1f62cc,
    _0x4ca2e8 = Date[_0x199c6e(814, 'Q^^z')](),
    _0x7ca4f6 = _0x5eff3e - _0x4ca2e8
  function _0x3a884d() {
    const _0xb603f8 = _0x199c6e
    return Date[_0xb603f8(514, '6G(F')]() + _0x7ca4f6
  }
  if (_0x3a884d() >= _0x325a48) {
    return logWarn(_0x199c6e(316, '%7kh')), { status: _0x199c6e(300, 'Em3N') }
  }
  if (_0x3a884d() < _0x410b38) {
    logInfo(_0x199c6e(793, 'p[t5'))
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
            'ZdDqk' !== _0x199c6e(292, 'Fnyv')
              ? (_0x17fd19++,
                _0x1da7b4(
                  _0x199c6e(457, 'vSeG') +
                    _0x51b983.DestCityDesc +
                    _0x199c6e(1142, '6VmM') +
                    _0x496450[_0x199c6e(980, '6G(F')] +
                    _0x199c6e(358, 'vSeG') +
                    _0x23fe98[_0x199c6e(895, 'EjAy')]
                ))
              : (_0x4ed4ba = 10000)
          } else {
            if (_0x199c6e(628, 'd5Um') !== _0x199c6e(805, '!7at')) {
              const _0x1b3c02 = _0x4942c6[_0x199c6e(666, 'EjAy')](
                (_0x1350c0) =>
                  _0x1350c0[_0x199c6e(1029, 'CkTj')] ===
                  _0x4169ae[_0x199c6e(267, '!umK')]
              )
              _0x1b3c02 &&
                ((_0x1b3c02.BiddingRank = _0x3d9649[_0x199c6e(712, '!7at')]),
                _0xbec178[_0x199c6e(629, '4f2Z')] !== _0x47f427 &&
                  _0x5f31f5.L1BidAmount !== null &&
                  (_0x1b3c02.L1BidAmount = _0x3bc3bc(
                    _0x15ac4f[_0x199c6e(890, '!7at')]
                  )[_0x199c6e(993, 'riSU')]()))
            } else {
              _0x4ed4ba = 1000
            }
          }
        }
      }
      if (Date[_0x199c6e(642, 'Kq2E')]() - _0x27ddbc > _0x4ed4ba) {
        _0x26ab0b
          ? logInfo(_0x199c6e(1095, 'E&Ei') + formatCountdown(_0xf8d913))
          : process[_0x199c6e(428, 'Kq2E')].write(
              '\r  \u23F3 Submitting in ' +
                formatCountdown(_0xf8d913) +
                _0x199c6e(516, 'vSeG')
            )
        _0x27ddbc = Date[_0x199c6e(1107, 'vSeG')]()
      }
      _0xf8d913 <= 60000 &&
        !_0x3aeaf8 &&
        (_0x199c6e(321, 'wpSZ') !== _0x199c6e(672, 'BEh9')
          ? (_0x59bcc6 = 10000)
          : (process.stdout[_0x199c6e(1145, 'Fnyv')]('\n'),
            logInfo(_0x199c6e(408, '^upB')),
            await login(),
            (_0x3aeaf8 = true)))
      if (_0xf8d913 <= 7000 && !_0x2203a2) {
        if ('kXOrq' !== _0x199c6e(590, 'CkTj')) {
          process[_0x199c6e(313, 'o)HK')][_0x199c6e(255, 'Em3N')]('\n')
          logInfo(_0x199c6e(1110, '#Uph'))
          await fetchBidOrderList()
          applyCsvDataToOrders()
          _0x2203a2 = true
        } else {
          const _0x4f71b2 = _0x326fc8(_0x4a58f5[_0x199c6e(906, 'vSeG')] || '')
              [_0x199c6e(759, 'BEh9')]()
              [_0x199c6e(664, 'V&W2')](/^0+/, ''),
            _0x3a519b =
              _0x4f71b2 === '1' ||
              _0x5ace62(_0xd771d8[_0x199c6e(1051, 'rl6t')]) === 1
          _0x3a519b
            ? (_0x3ccf71++,
              _0x241e14(
                _0x199c6e(1047, 'Q1U1') +
                  _0x1d1858[_0x199c6e(543, 'UwMq')] +
                  _0x199c6e(424, 'PV9Q') +
                  _0x5d0198[_0x199c6e(904, 'CkTj')] +
                  _0x199c6e(587, 'EBzE') +
                  _0x26df10[_0x199c6e(571, 'Mje0')]
              ))
            : _0x4eb5f1(
                _0x199c6e(565, 'Q1U1') +
                  (_0x4f71b2 || _0x35ab18[_0x199c6e(534, '4f2Z')] || '?') +
                  ' -> City: ' +
                  _0x5a0eaa[_0x199c6e(254, 'PV9Q')] +
                  _0x199c6e(570, 'IngF') +
                  _0x21e613[_0x199c6e(980, '6G(F')] +
                  _0x199c6e(1174, 'W6n7') +
                  _0x4918d4[_0x199c6e(849, 'Q^^z')] +
                  _0x199c6e(1013, '8CVd') +
                  _0x19b13a[_0x199c6e(837, '!Cfi')] +
                  ')'
              )
        }
      }
      if (_0xf8d913 <= 3000 && true) {
        if (_0x199c6e(1072, 'pLhn') !== 'Zdpdc') {
          return
        } else {
          process[_0x199c6e(582, 'pLhn')][_0x199c6e(902, '6G(F')]('\n')
          logInfo(_0x199c6e(940, 'BEh9'))
          let _0x4bd4ab = 0
          const _0x1d5ee1 = Date.now()
          while (_0x3a884d() < _0x410b38) {
            _0x4bd4ab++
            const _0x606ff7 = await fetchCaptcha(true)
            if (_0x606ff7) {
              if (_0x199c6e(615, 'H3Oi') === _0x199c6e(535, 'iaaA')) {
                _0x4ceaf0(
                  _0x199c6e(407, '8CVd') +
                    _0x576d69[_0x199c6e(277, '6HMp')].status +
                    ' - ' +
                    _0x5c210b[_0x199c6e(871, 'EBzE')][_0x199c6e(1177, 'pLhn')]
                )
                _0x32693a[_0x199c6e(296, 'CkTj')].status === 401 &&
                  _0x166ac5(_0x199c6e(728, '839y'))
                if (
                  _0x440c66[_0x199c6e(871, 'EBzE')][_0x199c6e(340, '8CVd')][
                    _0x199c6e(531, '^upB')
                  ]
                ) {
                  return (
                    (_0x24527b =
                      _0x4abbb6.response[_0x199c6e(432, 'IngF')][
                        'x-csrf-token'
                      ]),
                    _0x469055(
                      _0x199c6e(910, 'bC17') +
                        _0x5ed1cc.substring(0, 12) +
                        _0x199c6e(1144, 'rl6t')
                    ),
                    true
                  )
                }
              } else {
                const _0x3b3741 = Date[_0x199c6e(607, 'E&Ei')]() - _0x1d5ee1
                return (
                  logOk(
                    _0x199c6e(1165, 'CMx8') +
                      _0x4bd4ab +
                      _0x199c6e(863, '&PzW') +
                      _0x3b3741 +
                      _0x199c6e(624, '6G(F')
                  ),
                  (_0x340e65 = await solveCaptcha(_0x606ff7)),
                  process.stdout.write('\n'),
                  logBold(
                    'SAP sent the captcha! Submitting instantly to beat the crowd...'
                  ),
                  {
                    status: _0x199c6e(833, 'V&W2'),
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
          if (_0x199c6e(297, '&PzW') === 'UagYL') {
            await sleep(10)
          } else {
            if (!_0x5e25b8) {
              return 0
            }
            const _0xa24d1c =
              _0x378710[_0x199c6e(285, 'Kq2E')](/PT(\d+)H(\d+)M(\d+)S/)
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
      process[_0x199c6e(880, '%7kh')][_0x199c6e(1036, 'rl6t')](
        _0x199c6e(1122, 'UwMq')
      ),
      logOk(_0x199c6e(861, 'Kq2E')),
      {
        status: _0x199c6e(320, 'rl6t'),
        prefetchSolution: _0x340e65,
        endTime: _0x325a48,
        clockOffset: _0x7ca4f6,
      }
    )
  }
  if (_0x3a884d() >= _0x410b38 && _0x3a884d() < _0x325a48) {
    return (
      logOk(_0x199c6e(760, 'd5Um')),
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
    if (_0x4d2bd7(504, 'H3Oi') === _0x4d2bd7(524, 'Mje0')) {
      const _0x3780b0 =
        _0x40cdc4[_0x4d2bd7(505, '&PzW')] &&
        _0x5b60a0[_0x4d2bd7(391, 'JpRo')][_0x4d2bd7(426, 'bC17')] &&
        _0x1a4b95[_0x4d2bd7(409, '!Cfi')][_0x4d2bd7(743, 'E&Ei')].error
          ? _0x77738b.response[_0x4d2bd7(601, '!7at')][_0x4d2bd7(663, '!7at')][
              _0x4d2bd7(789, 'BEh9')
            ][_0x4d2bd7(636, 'Kq2E')]
          : _0x2c966e[_0x4d2bd7(819, 'Mje0')]
      return (
        _0x108dbc(
          _0x4d2bd7(847, 'EBzE') +
            _0x32e03d +
            _0x4d2bd7(731, 'BEh9') +
            _0x3780b0
        ),
        {
          type: 'E',
          message: _0x3780b0,
        }
      )
    } else {
      logErr(_0x4d2bd7(715, 'bC17'))
      await sleep(10000)
      return
    }
  }
  const _0x4d6fea = await fetchBidOrderList()
  if (!_0x4d6fea) {
    if (_0x4d2bd7(620, '%7kh') === _0x4d2bd7(465, 'wOt2')) {
      _0x319ff7[_0x4d2bd7(634, 'E&Ei')][_0x4d2bd7(983, '!7at')](_0x2b7e38)
    } else {
      logErr('Failed to fetch bid orders. Retrying in 10s...')
      await sleep(10000)
      return
    }
  }
  const _0x3cf154 = loadCsvFiles()
  if (!_0x3cf154) {
    if (_0x4d2bd7(289, '!Cfi') === _0x4d2bd7(685, '6G(F')) {
      logErr(_0x4d2bd7(536, '4f2Z'))
      await sleep(10000)
      return
    } else {
      if (_0xf22a6[_0x4d2bd7(1019, 'PV9Q')]('BIDING AMMOUNT')) {
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
    !CONFIG[_0x4d2bd7(1168, 'wOt2')] &&
    logWarn('No CSV matches found for current slot.')
  if (!plantConf) {
    if (_0x4d2bd7(617, 'Em3N') !== _0x4d2bd7(470, 'iaaA')) {
      logWarn(_0x4d2bd7(928, '!umK'))
      await sleep(15000)
      return
    } else {
      return (_0xaf3ebe[_0x256600] = _0x45d5ba), _0xf8bf61
    }
  }
  const _0xd17c61 = await waitForBiddingWindow()
  if (_0xd17c61[_0x4d2bd7(1049, '7T&H')] === _0x4d2bd7(841, '6HMp')) {
    logWarn(_0x4d2bd7(992, 'CMx8'))
    ;(!hasActiveCsvBatch() || csvBatchState[_0x4d2bd7(925, 'W6n7')]) &&
      (await sleep(15000))
    return
  }
  const _0x270f81 = _0xd17c61[_0x4d2bd7(606, 'uwg!')]
  if (CONFIG[_0x4d2bd7(482, '!Cfi')]) {
    if (_0x4d2bd7(959, 'iaaA') === 'kyKTK') {
      ;(_0x454636[_0x4d2bd7(430, '!umK')] || '')[_0x4d2bd7(922, 'E&Ei')]() ===
        _0x2a7229 &&
        (_0x1a6c0e[_0x4d2bd7(806, 'o)HK')] || '')[_0x4d2bd7(1075, '7T&H')]() ===
          _0x4e3684 &&
        ((_0x4867dd[_0x4d2bd7(954, 'Kq2E')] =
          _0x933879(_0x182437)[_0x4d2bd7(594, 'wpSZ')]()),
        (_0x2d68ab[_0x4d2bd7(328, 'CkTj')] =
          _0x5b5afa(_0x13cd3f)[_0x4d2bd7(732, 'H3Oi')]()))
    } else {
      logBold(_0x4d2bd7(376, '^upB'))
      const _0x5a0173 = _0x270f81 || (await fetchAndSolveCaptcha(5))
      _0x5a0173
        ? _0x4d2bd7(967, 'CkTj') === _0x4d2bd7(677, '6G(F')
          ? (_0x4d8549
              ? _0x10b65f('\u23F3 Submitting in ' + _0x4ef888(_0x551dcc))
              : _0x362522.stdout[_0x4d2bd7(888, '!umK')](
                  '\r  \u23F3 Submitting in ' + _0x52467c(_0x37ed8c) + '   '
                ),
            (_0x5e337d = _0x17ce32[_0x4d2bd7(1170, '^upB')]()))
          : logOk(_0x4d2bd7(1003, 'Q1U1') + _0x5a0173 + '"')
        : logWarn('Captcha solver did not return a valid solution')
      logBold(_0x4d2bd7(1137, '6VmM'))
      logInfo(_0x4d2bd7(349, '!Cfi'))
      process.exit(0)
    }
  }
  hasActiveCsvBatch()
    ? await runAutoBatchSubmission(_0x270f81)
    : _0x52c784 && !csvBatchState[_0x4d2bd7(879, '6HMp')]
    ? _0x4d2bd7(1007, 'E&Ei') === 'EoKCe'
      ? (_0x586477(_0x4d2bd7(632, 'H3Oi') + _0x3db673[_0x4d2bd7(1088, 'riSU')]),
        _0x2167e5[_0x4d2bd7(1021, 'CkTj')](_0x2884fe[_0x4d2bd7(929, '^Hgn')]),
        _0x6febf9[_0x4d2bd7(389, 'Em3N')](1))
      : await runSingleSubmission(_0x270f81)
    : _0x4d2bd7(493, '!Cfi') !== _0x4d2bd7(443, 'xvA&')
    ? _0x5b4506(_0x4d2bd7(735, '6G(F') + _0x599e4b + '"')
    : logInfo(_0x4d2bd7(468, 'UwMq'))
  logInfo(_0x4d2bd7(643, 'uwg!'))
  await Promise[_0x4d2bd7(779, 'riSU')]([
    fetchBidOrderList(),
    fetchVendorRankings(),
  ])
  const _0x4e2444 = bidRows.filter(
      (_0x37340c) =>
        csvBatchState[_0x4d2bd7(380, '!umK')][getCsvBatchKey(_0x37340c)] ===
        true
    ),
    _0x1eab5e =
      _0x4e2444.length > 0
        ? _0x4e2444
        : bidRows.filter(
            (_0x2c8443) => Number(_0x2c8443[_0x4d2bd7(263, '4f2Z')]) > 0
          )
  if (_0x1eab5e.length > 0) {
    let _0x1eee1f = 0
    console[_0x4d2bd7(933, '!7at')]('\n' + '\u2550'[_0x4d2bd7(448, 'xcPi')](50))
    console.log(
      '' +
        LOG_COLORS[_0x4d2bd7(429, 'W6n7')] +
        LOG_COLORS[_0x4d2bd7(266, 'EjAy')] +
        _0x4d2bd7(846, 'iaaA') +
        LOG_COLORS[_0x4d2bd7(1031, 'rl6t')]
    )
    console[_0x4d2bd7(1131, 'IngF')]('\u2550'.repeat(50))
    _0x1eab5e[_0x4d2bd7(503, '@!o[')]((_0x13b91a) => {
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
      _0x4d2bd7(761, 'PV9Q') +
        _0x1eee1f +
        _0x4d2bd7(1176, '6HMp') +
        _0x1eab5e[_0x4d2bd7(303, '4f2Z')] +
        _0x4d2bd7(427, 'pLhn')
    )
    console[_0x4d2bd7(533, 'V&W2')]('\u2550'[_0x4d2bd7(962, '8CVd')](50) + '\n')
    saveRankRecordsToCsv(_0x1eab5e)
  }
  return (
    logBold(_0x4d2bd7(245, 'V&W2')),
    {
      status: _0xd17c61[_0x4d2bd7(602, 'GmQ^')],
      endTime: _0xd17c61[_0x4d2bd7(766, 'V&W2')],
      clockOffset: _0xd17c61[_0x4d2bd7(260, 'xvA&')],
    }
  )
}
async function main() {
  const _0x516ebb = a0_0x5cae94
  console[_0x516ebb(471, 'o)HK')]('\n' + '\u2550'[_0x516ebb(448, 'xcPi')](60))
  console.log(
    '' +
      LOG_COLORS[_0x516ebb(877, 'riSU')] +
      LOG_COLORS[_0x516ebb(816, 'p[t5')] +
      _0x516ebb(828, 'riSU') +
      LOG_COLORS[_0x516ebb(294, '!umK')]
  )
  console[_0x516ebb(1180, '6HMp')]('\u2550'[_0x516ebb(593, '6VmM')](60))
  console[_0x516ebb(533, 'V&W2')]()
  console.log()
  initEmbeddedCaptchaSolver()
  let _0x46fe6f = 0
  do {
    _0x46fe6f++
    logBold(
      _0x516ebb(1151, 'UwMq') +
        _0x46fe6f +
        ' [' +
        new Date()[_0x516ebb(625, 'GmQ^')]() +
        ']'
    )
    let _0x4915ea = await runSingleCycle()
    typeof _0x4915ea === _0x516ebb(1128, 'vSeG') &&
      (_0x4915ea = { status: _0x4915ea })
    if (CONFIG.DRY_RUN) {
      break
    }
    if (CONFIG.LOOP_CONTINUOUS) {
      if (
        !csvBatchState[_0x516ebb(246, 'uwg!')] &&
        (hasActiveCsvBatch() || _0x4915ea.status === _0x516ebb(637, 'BEh9'))
      ) {
        _0x516ebb(1108, '6HMp') === _0x516ebb(344, '!umK')
          ? (_0x3b2ed3 &&
              _0x737ec0[_0x516ebb(1044, 'CMx8')] &&
              _0x4d0a41[_0x516ebb(915, 'W6n7')] !== _0x20043d &&
              (_0x171c96 !== null &&
                _0x3d33da(
                  _0x516ebb(418, '6G(F') +
                    _0x2ce2aa[_0x516ebb(355, '!umK')] +
                    ' detected, wiping old submission memory.'
                ),
              (_0x511e51 = _0x2698c3[_0x516ebb(415, '6G(F')]),
              _0x259db7 && (_0x574f96[_0x516ebb(1011, 'CkTj')] = {})),
            (_0x48a5b0 = {
              submittedKeys:
                (_0x2dffb6 && _0x3486b5[_0x516ebb(1125, 'xcPi')]) || {},
              activeKeys: [],
              pendingBatches: [],
              groupsByKey: {},
              autoRunning: false,
              completed: false,
            }))
          : logInfo(_0x516ebb(551, 'Em3N'))
      } else {
        if (_0x516ebb(1058, '^upB') !== _0x516ebb(723, 'Mje0')) {
          if (
            _0x4915ea[_0x516ebb(502, 'rl6t')] === _0x516ebb(336, 'iaaA') &&
            _0x4915ea[_0x516ebb(553, '!7at')]
          ) {
            const _0x29a29b =
                Date[_0x516ebb(1094, 'rl6t')]() +
                (_0x4915ea[_0x516ebb(446, 'BEh9')] || 0),
              _0x4b835d = _0x4915ea[_0x516ebb(357, 'uwg!')] - _0x29a29b
            _0x4b835d > 0
              ? (logInfo(
                  'All bids completed for this slot. Waiting ' +
                    formatCountdown(_0x4b835d) +
                    ' for current slot to end...'
                ),
                await sleep(_0x4b835d + 2000))
              : (logInfo(_0x516ebb(862, 'o)HK')), await sleep(15000))
          } else {
            'gwHlH' === _0x516ebb(1116, 'CkTj')
              ? _0x44a70e.log(
                  '' +
                    _0x449ec0[_0x516ebb(1025, 'd5Um')] +
                    _0xcec326() +
                    _0x47876f[_0x516ebb(460, 'W6n7')] +
                    ' ' +
                    _0x39a6f0
                )
              : (logInfo(_0x516ebb(938, 'E&Ei')), await sleep(15000))
          }
        } else {
          return (
            (_0x2a57a9 =
              _0xe7a89c[_0x516ebb(839, 'CMx8')][_0x516ebb(398, 'CkTj')][
                _0x516ebb(1188, 'xvA&')
              ]),
            _0x2af7e9(
              _0x516ebb(474, 'Q1U1') +
                _0x32d95f[_0x516ebb(1001, '!umK')](0, 12) +
                _0x516ebb(244, 'V&W2')
            ),
            true
          )
        }
      }
    }
  } while (CONFIG[_0x516ebb(1066, 'wOt2')])
}
main().catch((_0x5e067b) => {
  const _0x594f63 = a0_0x5cae94
  logErr(_0x594f63(547, '#Uph') + _0x5e067b[_0x594f63(399, '4f2Z')])
  console[_0x594f63(687, 'EBzE')](_0x5e067b[_0x594f63(638, 'JpRo')])
  process[_0x594f63(1166, '6HMp')](1)
})
