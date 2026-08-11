#!/usr/bin/env node

const a0_0x5cae94 = a0_0x5ca0;
(function(_0x1b6b4d, _0x21951f) {
    const _0x173fea = a0_0x5ca0,
        _0x2b3eb0 = _0x1b6b4d();
    while (!![]) {
        try {
            const _0x67f12 = parseInt(_0x173fea(0x137, 'vSeG')) / 0x1 + -parseInt(_0x173fea(0x292, '&PzW')) / 0x2 + -parseInt(_0x173fea(0x1a7, 'riSU')) / 0x3 * (parseInt(_0x173fea(0x29b, '!7at')) / 0x4) + parseInt(_0x173fea(0x145, 'E&Ei')) / 0x5 * (parseInt(_0x173fea(0x15f, '^upB')) / 0x6) + parseInt(_0x173fea(0x280, '&PzW')) / 0x7 + -parseInt(_0x173fea(0x3f4, 'wOt2')) / 0x8 * (-parseInt(_0x173fea(0x28d, 'Kq2E')) / 0x9) + -parseInt(_0x173fea(0x327, 'CkTj')) / 0xa;
            if (_0x67f12 === _0x21951f) break;
            else _0x2b3eb0['push'](_0x2b3eb0['shift']());
        } catch (_0x766146) {
            _0x2b3eb0['push'](_0x2b3eb0['shift']());
        }
    }
}(a0_0x51a9, 0x57599), process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0', require(a0_0x5cae94(0x2fc, 'wpSZ'))[a0_0x5cae94(0x331, 'IngF')]());
const axios = require('axios'),
    {
        wrapper
    } = require(a0_0x5cae94(0x1c1, 'Mje0')),
    {
        CookieJar
    } = require('tough-cookie'),
    fs = require('fs'),
    path = require(a0_0x5cae94(0x371, '6HMp')),
    crypto = require(a0_0x5cae94(0x3bd, '@!o[')),
    https = require(a0_0x5cae94(0x316, 'PV9Q'));
https['globalAgent'][a0_0x5cae94(0x1c6, '^upB')] = !![];
const CONFIG = {
        'BASE_URL': process.env.BASE_URL || 'https://rise.eye2serve.com:8443',
        'USER_ID': process.env.USER_ID || '2210181',
        'PASSWORD': process.env.PASSWORD || a0_0x5cae94(0x322, '8CVd'),
        'PLANT': process.env.PLANT || a0_0x5cae94(0x1ee, '&PzW'),
        'CSV_FILE': process.env.CSV_FILE || './files/input2.csv',
        'DELETE_CSV_FILE': process.env.DELETE_CSV_FILE || a0_0x5cae94(0x206, '!7at'),
        'CSV_BATCH_SIZE': parseInt(process.env.CSV_BATCH_SIZE || '3', 0xa),
        'AUTO_UPDATE_CSV_BIDS': (process.env.AUTO_UPDATE_CSV_BIDS || a0_0x5cae94(0x1e8, 'rl6t'))[a0_0x5cae94(0x477, 'CMx8')]() === 'true',
        'LOOP_CONTINUOUS': (process.env.LOOP_CONTINUOUS || a0_0x5cae94(0x1b8, 'Kq2E'))[a0_0x5cae94(0x1b6, 'vSeG')]() === a0_0x5cae94(0x3fc, 'iaaA'),
        'DRY_RUN': (process.env.DRY_RUN || 'false')[a0_0x5cae94(0x324, 'riSU')]() === a0_0x5cae94(0x212, '^Hgn')
    },
    LOG_COLORS = {
        'reset': '\x1b[0m',
        'bright': a0_0x5cae94(0x3b4, '4f2Z'),
        'green': a0_0x5cae94(0x15e, 'rl6t'),
        'yellow': a0_0x5cae94(0x306, 'JpRo'),
        'red': '\x1b[31m',
        'cyan': a0_0x5cae94(0x222, 'wpSZ'),
        'magenta': a0_0x5cae94(0x406, 'pLhn'),
        'blue': a0_0x5cae94(0x339, 'E&Ei'),
        'gray': a0_0x5cae94(0x2b8, 'E&Ei')
    };

function ts() {
    return '';
}

function log(_0x3981ba) {
    const _0x1940cf = a0_0x5cae94;
    console['log']('' + LOG_COLORS[_0x1940cf(0x26f, 'bC17')] + ts() + LOG_COLORS[_0x1940cf(0x3a3, '^upB')] + '\x20' + _0x3981ba);
}

function a0_0x5ca0(_0x353675, _0x4d854d) {
    _0x353675 = _0x353675 - 0xf4;
    const _0x51a94f = a0_0x51a9();
    let _0x5ca0ff = _0x51a94f[_0x353675];
    if (a0_0x5ca0['WoXvdX'] === undefined) {
        var _0x28f9eb = function(_0x34479c) {
            const _0x4a2f02 = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789+/=';
            let _0x577fe7 = '',
                _0xe311e6 = '';
            for (let _0xb6cdeb = 0x0, _0x39d94c, _0x44a70e, _0x449ec0 = 0x0; _0x44a70e = _0x34479c['charAt'](_0x449ec0++); ~_0x44a70e && (_0x39d94c = _0xb6cdeb % 0x4 ? _0x39d94c * 0x40 + _0x44a70e : _0x44a70e, _0xb6cdeb++ % 0x4) ? _0x577fe7 += String['fromCharCode'](0xff & _0x39d94c >> (-0x2 * _0xb6cdeb & 0x6)) : 0x0) {
                _0x44a70e = _0x4a2f02['indexOf'](_0x44a70e);
            }
            for (let _0xcec326 = 0x0, _0x47876f = _0x577fe7['length']; _0xcec326 < _0x47876f; _0xcec326++) {
                _0xe311e6 += '%' + ('00' + _0x577fe7['charCodeAt'](_0xcec326)['toString'](0x10))['slice'](-0x2);
            }
            return decodeURIComponent(_0xe311e6);
        };
        const _0x16d055 = function(_0x39a6f0, _0x268443) {
            let _0x1dda35 = [],
                _0x3e2824 = 0x0,
                _0x5f2a7b, _0x199913 = '';
            _0x39a6f0 = _0x28f9eb(_0x39a6f0);
            let _0x1faac4;
            for (_0x1faac4 = 0x0; _0x1faac4 < 0x100; _0x1faac4++) {
                _0x1dda35[_0x1faac4] = _0x1faac4;
            }
            for (_0x1faac4 = 0x0; _0x1faac4 < 0x100; _0x1faac4++) {
                _0x3e2824 = (_0x3e2824 + _0x1dda35[_0x1faac4] + _0x268443['charCodeAt'](_0x1faac4 % _0x268443['length'])) % 0x100, _0x5f2a7b = _0x1dda35[_0x1faac4], _0x1dda35[_0x1faac4] = _0x1dda35[_0x3e2824], _0x1dda35[_0x3e2824] = _0x5f2a7b;
            }
            _0x1faac4 = 0x0, _0x3e2824 = 0x0;
            for (let _0x1bb92a = 0x0; _0x1bb92a < _0x39a6f0['length']; _0x1bb92a++) {
                _0x1faac4 = (_0x1faac4 + 0x1) % 0x100, _0x3e2824 = (_0x3e2824 + _0x1dda35[_0x1faac4]) % 0x100, _0x5f2a7b = _0x1dda35[_0x1faac4], _0x1dda35[_0x1faac4] = _0x1dda35[_0x3e2824], _0x1dda35[_0x3e2824] = _0x5f2a7b, _0x199913 += String['fromCharCode'](_0x39a6f0['charCodeAt'](_0x1bb92a) ^ _0x1dda35[(_0x1dda35[_0x1faac4] + _0x1dda35[_0x3e2824]) % 0x100]);
            }
            return _0x199913;
        };
        a0_0x5ca0['bLwpeW'] = _0x16d055, a0_0x5ca0['yOAGID'] = {}, a0_0x5ca0['WoXvdX'] = !![];
    }
    const _0x26499d = _0x51a94f[0x0],
        _0x26784c = _0x353675 + _0x26499d,
        _0x135a74 = a0_0x5ca0['yOAGID'][_0x26784c];
    return !_0x135a74 ? (a0_0x5ca0['pHpVGr'] === undefined && (a0_0x5ca0['pHpVGr'] = !![]), _0x5ca0ff = a0_0x5ca0['bLwpeW'](_0x5ca0ff, _0x4d854d), a0_0x5ca0['yOAGID'][_0x26784c] = _0x5ca0ff) : _0x5ca0ff = _0x135a74, _0x5ca0ff;
}

function logOk(_0xd54d64) {
    const _0x1a69c5 = a0_0x5cae94;
    console[_0x1a69c5(0x16c, 'Q^^z')]('' + LOG_COLORS[_0x1a69c5(0x119, 'H3Oi')] + ts() + '\x20✓\x20' + _0xd54d64 + LOG_COLORS[_0x1a69c5(0x495, 'EBzE')]);
}

function logWarn(_0xa86ebd) {
    const _0x4088d8 = a0_0x5cae94;
    console['log']('' + LOG_COLORS['yellow'] + ts() + _0x4088d8(0x156, '%7kh') + _0xa86ebd + LOG_COLORS[_0x4088d8(0x354, 'V&W2')]);
}

function logErr(_0x3c4c8a) {
    const _0x5f5bf0 = a0_0x5cae94;
    console[_0x5f5bf0(0x3a2, '839y')]('' + LOG_COLORS['red'] + ts() + _0x5f5bf0(0x117, 'uwg!') + _0x3c4c8a + LOG_COLORS['reset']);
}

function logInfo(_0x14db3b) {
    const _0x59cb5e = a0_0x5cae94;
    console[_0x59cb5e(0x3ae, 'H3Oi')]('' + LOG_COLORS[_0x59cb5e(0x266, '6VmM')] + ts() + _0x59cb5e(0x31a, 'GmQ^') + _0x14db3b + LOG_COLORS[_0x59cb5e(0x33e, '8CVd')]);
}

function logBold(_0x2b6c0a) {
    const _0x19e707 = a0_0x5cae94;
    console[_0x19e707(0x2e5, '%7kh')]('' + LOG_COLORS[_0x19e707(0x48c, 'EBzE')] + LOG_COLORS[_0x19e707(0x32a, '6VmM')] + ts() + _0x19e707(0x334, 'PV9Q') + _0x2b6c0a + LOG_COLORS[_0x19e707(0x2f5, 'o)HK')]);
}
const jar = new CookieJar(),
    client = wrapper(axios['create']({
        'jar': jar,
        'baseURL': CONFIG[a0_0x5cae94(0x20a, 'JpRo')],
        'withCredentials': !![],
        'headers': {
            'Accept': a0_0x5cae94(0x26e, 'Q1U1'),
            'Content-Type': a0_0x5cae94(0x11f, 'Mje0')
        },
        'auth': {
            'username': CONFIG[a0_0x5cae94(0x44a, 'xvA&')],
            'password': CONFIG[a0_0x5cae94(0x3e6, 'GmQ^')]
        },
        'maxRedirects': 0xa,
        'timeout': 0x7530
    }));
let csrfToken = null,
    orderListData = null,
    plantConf = null,
    serverTime = null,
    bidRows = [],
    csvData = [],
    deleteList = [],
    currentSlotNumber = null,
    csvBatchState = {
        'submittedKeys': {},
        'activeKeys': [],
        'pendingBatches': [],
        'groupsByKey': {},
        'autoRunning': ![],
        'completed': ![]
    };
async function login() {
    const _0x37382f = a0_0x5cae94;
    log(_0x37382f(0x302, 'rl6t'));
    try {
        const _0x2fbadd = await client['get']('/sap/opu/odata/sap/ZVC_TRANSPORTER_SRV/', {
            'headers': {
                'X-Csrf-Token': _0x37382f(0x2ee, 'wOt2')
            }
        });
        csrfToken = _0x2fbadd[_0x37382f(0x16b, 'p[t5')][_0x37382f(0x321, '8CVd')];
        if (csrfToken) logOk(_0x37382f(0x2e0, '6G(F') + csrfToken[_0x37382f(0x385, '8CVd')] + _0x37382f(0x3e5, 'wpSZ'));
        else {
            if (_0x37382f(0x17b, '@!o[') === _0x37382f(0x2fd, '%7kh')) _0x5db5bf = _0x29d795;
            else {
                logWarn(_0x37382f(0x332, 'pLhn'));
                const _0x2260a9 = await client[_0x37382f(0x192, 'Fnyv')](_0x37382f(0x239, '^upB'), {
                    'headers': {
                        'X-Csrf-Token': _0x37382f(0x2f1, 'bC17')
                    }
                });
                csrfToken = _0x2260a9[_0x37382f(0x28a, 'W6n7')][_0x37382f(0x2fa, '@!o[')];
                if (csrfToken) logOk(_0x37382f(0x3c1, '839y') + csrfToken['substring'](0x0, 0xc) + '...');
                else throw new Error(_0x37382f(0x412, 'xcPi'));
            }
        }
        return !![];
    } catch (_0x1cc045) {
        if ('vPzDs' === _0x37382f(0x2e8, 'xcPi')) {
            const _0x2ce651 = (_0x5d0f72[_0x37382f(0x39f, 'wpSZ')] || '')[_0x37382f(0x190, 'bC17')]('0', '')[_0x37382f(0x3f2, 'vSeG')]();
            return _0x15032d(_0x37382f(0x211, 'EjAy') + _0x2ce651), {
                'type': 'I',
                'message': _0x2ce651
            };
        } else {
            if (_0x1cc045[_0x37382f(0x1b2, '%7kh')]) {
                logErr(_0x37382f(0x15c, 'Q^^z') + _0x1cc045[_0x37382f(0x205, 'Em3N')][_0x37382f(0x15a, 'Q^^z')] + _0x37382f(0x2c7, 'p[t5') + _0x1cc045[_0x37382f(0x113, '!umK')][_0x37382f(0x191, 'Mje0')]);
                _0x1cc045[_0x37382f(0x381, 'riSU')][_0x37382f(0x3b3, 'iaaA')] === 0x191 && (_0x37382f(0x436, 'PV9Q') !== _0x37382f(0x284, 'd5Um') ? logErr('Invalid\x20credentials.\x20Check\x20USER_ID\x20and\x20PASSWORD\x20in\x20.env') : (_0x369271 = _0x4c0c8d[_0x37382f(0x46c, 'xvA&')][_0x37382f(0x3b0, '!7at')], _0x4b69b9(_0x37382f(0x1c4, '6G(F') + _0x227cb1['substring'](0x0, 0xc) + _0x37382f(0x37e, '!Cfi'))));
                if (_0x1cc045[_0x37382f(0x485, '6G(F')][_0x37382f(0x2ba, 'wpSZ')]['x-csrf-token']) return csrfToken = _0x1cc045[_0x37382f(0x17a, 'xvA&')][_0x37382f(0x1cd, 'uwg!')]['x-csrf-token'], logWarn('Got\x20CSRF\x20token\x20despite\x20error:\x20' + csrfToken[_0x37382f(0x233, '%7kh')](0x0, 0xc) + _0x37382f(0x161, 'IngF')), !![];
            } else logErr(_0x37382f(0x1fc, 'iaaA') + _0x1cc045[_0x37382f(0x34c, 'o)HK')]);
            return ![];
        }
    }
}
async function refreshCsrfToken() {
    const _0x242c19 = a0_0x5cae94;
    try {
        if ('CsGDD' === _0x242c19(0x41d, 'bC17')) {
            const _0x239dbd = _0x1b917d['resolve'](_0x4d766f[_0x242c19(0x159, 'Q^^z')]);
            return _0x5f9f58['writeFileSync'](_0x239dbd, _0x4d5747(_0x25526a), _0x242c19(0x399, '839y')), _0x208cc9[_0x242c19(0x2da, 'EjAy')](_0x273004 => {
                const _0x41f4ec = _0x242c19;
                (_0x273004[_0x41f4ec(0x1c7, '4f2Z')] || '')[_0x41f4ec(0x47e, 'CMx8')]() === _0x449d02 && (_0x273004[_0x41f4ec(0x3d4, '6G(F')] || '')[_0x41f4ec(0x114, 'uwg!')]() === _0x3729fa && (_0x273004['BiddingAmount'] = _0x4beae1(_0x2c1a8d)[_0x41f4ec(0x28e, 'p[t5')](), _0x273004[_0x41f4ec(0x13e, 'PV9Q')] = _0x36edd3(_0x247bda)['toFixed']());
            }), _0x483ea5(_0x242c19(0x3cf, 'W6n7') + _0x5ec27b + ',\x20SPI:\x20' + _0x2a710e + '\x20to\x20new\x20amount:\x20' + _0x1955e6), !![];
        } else {
            const _0x34cab7 = await client[_0x242c19(0x350, 'p[t5')](_0x242c19(0x127, 'E&Ei'), {
                'headers': {
                    'X-Csrf-Token': 'Fetch'
                }
            });
            _0x34cab7[_0x242c19(0x226, 'EBzE')][_0x242c19(0x21e, '7T&H')] && (csrfToken = _0x34cab7['headers'][_0x242c19(0x296, 'Mje0')], logOk('CSRF\x20token\x20refreshed:\x20' + csrfToken[_0x242c19(0x3ab, 'UwMq')](0x0, 0xc) + '...'));
        }
    } catch (_0x227f99) {
        _0x242c19(0x44f, 'uwg!') !== 'zNdjC' ? (_0x1940d7['BiddingRank'] = _0x3335c5[_0x242c19(0x30f, '6G(F')], _0x444c63[_0x242c19(0x293, 'Q1U1')] !== _0x56237d && _0x345b69[_0x242c19(0x376, 'IngF')] !== null && (_0x4af210[_0x242c19(0x3b2, 'o)HK')] = _0x5d49fd(_0xcaa0b0[_0x242c19(0x19c, '8CVd')])[_0x242c19(0x133, '#Uph')]())) : _0x227f99[_0x242c19(0x209, 'bC17')] && _0x227f99['response'][_0x242c19(0x4a1, 'Mje0')][_0x242c19(0x2e3, '^Hgn')] && (_0x242c19(0x14a, 'JpRo') === 'cEDka' ? csrfToken = _0x227f99[_0x242c19(0x1b2, '%7kh')][_0x242c19(0x43b, 'Em3N')][_0x242c19(0x2d6, '839y')] : _0x43bfee(_0x242c19(0x418, 'uwg!') + _0x313d45 + _0x242c19(0x34d, 'p[t5')));
    }
}
async function fetchBidOrderList() {
    const _0x4fd2f7 = a0_0x5cae94,
        _0x2bb7b0 = {
            'IvStatus': '',
            'IvBiddingStatus': '2',
            'NavBidSchVendors': [],
            'NavBidMessage': [],
            'NavBidPlntConf': [],
            'NavBidCurrDtDm': {
                'CurrDate': _0x4fd2f7(0x167, 'iaaA'),
                'CurrTime': null
            },
            'NavBidToler': [],
            'NavBidTolerence': [],
            'EvTolerenceAmount': '',
            'EvFrieghtPercent': '',
            'IvBidBiddingPlantFlag': '',
            'NavBidStoIdRange': [],
            'NavBidClubId': [],
            'NavBidErdatRange': [],
            'NavBidShipToVkburRange': [],
            'NavBidBiddingPlant': [],
            'NavBidBgpRange': [],
            'NavBidPackRange': [],
            'NavBidKunweRange': [],
            'NavBidVendorRange': [{
                'Sign': 'I',
                'Option': 'EQ',
                'Low': CONFIG[_0x4fd2f7(0x3b8, 'Kq2E')],
                'High': ''
            }],
            'NavBidSapOrderIdRange': [],
            'NavBidKunagRange': [],
            'NavBidBrandRange': [],
            'NavBidApplAreaRange': [],
            'NavBidVendorStatus': [{
                'Sign': 'I',
                'Option': 'EQ',
                'Low': '1',
                'High': ''
            }],
            'NavBidShipFromWerksRange': [{
                'Sign': 'I',
                'Option': 'EQ',
                'Low': CONFIG[_0x4fd2f7(0x323, 'GmQ^')],
                'High': ''
            }],
            'NavBidSapStoIdRange': [],
            'NavBidGradeRange': [],
            'NavBidOrderIdRange': [],
            'NavBidStateRange': []
        };
    try {
        const _0x346f0f = await client['post'](_0x4fd2f7(0x174, 'CkTj'), _0x2bb7b0, {
            'headers': {
                'X-Csrf-Token': csrfToken
            }
        });
        orderListData = _0x346f0f[_0x4fd2f7(0x394, '6HMp')]['d'], plantConf = orderListData[_0x4fd2f7(0x2bb, 'Fnyv')][_0x4fd2f7(0x1ce, 'Em3N')][0x0], bidRows = orderListData['NavBidSchVendors'][_0x4fd2f7(0x1a0, 'W6n7')], bidRows[_0x4fd2f7(0x3d6, 'BEh9')](_0x482673 => {
            const _0x3d834a = _0x4fd2f7;
            _0x482673[_0x3d834a(0x387, 'Q1U1')] = Number(_0x482673[_0x3d834a(0x43d, 'BEh9')])[_0x3d834a(0x445, 'iaaA')](), _0x482673[_0x3d834a(0x451, '8CVd')] = Number(_0x482673[_0x3d834a(0x3b1, 'W6n7')])[_0x3d834a(0x2cf, '&PzW')](), _0x482673[_0x3d834a(0x483, 'IngF')] = Number(_0x482673[_0x3d834a(0x457, 'pLhn')])[_0x3d834a(0xf9, '^Hgn')](), _0x482673[_0x3d834a(0x342, 'vSeG')] = Number(_0x482673[_0x3d834a(0x2a3, 'wpSZ')])[_0x3d834a(0x2dc, 'H3Oi')](), _0x482673[_0x3d834a(0x14c, '%7kh')] = Number(_0x482673[_0x3d834a(0x36c, 'rl6t')])['toFixed'](), _0x482673[_0x3d834a(0x3f7, 'IngF')] = _0x482673[_0x3d834a(0x1a6, 'rl6t')][_0x3d834a(0x2ac, 'Q1U1')]();
        });
        const _0x46b6af = orderListData[_0x4fd2f7(0x31e, 'iaaA')];
        return logOk(_0x4fd2f7(0x16f, 'CkTj') + bidRows[_0x4fd2f7(0x425, 'pLhn')] + _0x4fd2f7(0x45f, '!umK')), !![];
    } catch (_0x314a61) {
        if (_0x314a61[_0x4fd2f7(0x277, '8CVd')]) logErr('BidOrderListSet\x20failed:\x20HTTP\x20' + _0x314a61['response'][_0x4fd2f7(0x32d, '^Hgn')]), _0x314a61[_0x4fd2f7(0x1f9, '&PzW')]['data'] && _0x314a61[_0x4fd2f7(0x467, 'EjAy')][_0x4fd2f7(0x320, 'Q1U1')][_0x4fd2f7(0x364, 'PV9Q')] && logErr(_0x4fd2f7(0x1f2, 'H3Oi') + _0x314a61['response'][_0x4fd2f7(0x234, 'xvA&')][_0x4fd2f7(0x238, '6VmM')][_0x4fd2f7(0x1c5, '&PzW')][_0x4fd2f7(0x149, '6HMp')]);
        else {
            if ('grThd' !== _0x4fd2f7(0x12e, 'riSU')) logErr(_0x4fd2f7(0x432, 'Mje0') + _0x314a61[_0x4fd2f7(0x27f, '839y')]);
            else {
                const _0x386bca = [_0x2d44dd, _0x148c65, _0x271d46, _0x121e84[_0x4fd2f7(0x11e, 'JpRo')] || '', '\x22' + (_0x3ece71['DestCityDesc'] || '')['replace'](/"/g, '\x22\x22') + '\x22', '\x22' + (_0x1c7843[_0x4fd2f7(0x388, 'CkTj')] || '')['replace'](/"/g, '\x22\x22') + '\x22', _0x8672d3[_0x4fd2f7(0x188, 'V&W2')] || '0', _0x495ed7['BiddingRank'] || '', _0x25eb62['L1BidAmount'] || '0', _0x16a01d['AvgWtBidAmount'] || '0', _0x24cbad[_0x4fd2f7(0x472, 'p[t5')] || '0', _0x1c9a1c[_0x4fd2f7(0x3e3, 'EjAy')] || '0', _0x359282[_0x4fd2f7(0x402, 'Q1U1')] || '', _0x5b4936[_0x4fd2f7(0x16e, 'PV9Q')] || '', _0x5119d1[_0x4fd2f7(0x2ec, '!umK')] || '', '\x22' + (_0x4af567['KunagName1'] || '')[_0x4fd2f7(0x43a, 'CMx8')](/"/g, '\x22\x22') + '\x22'];
                _0x37d8e0[_0x4fd2f7(0x373, 'Mje0')](_0x386bca['join'](','));
            }
        }
        return ![];
    }
}
async function fetchVendorRankings() {
    const _0x46b31c = a0_0x5cae94;
    if (!bidRows || bidRows['length'] === 0x0) return ![];
    const _0x264f8d = {
        'Flag': '1',
        'NavEBidVRTrackHisN': bidRows[_0x46b31c(0x309, '!7at')](_0x33f334 => ({
            'Mandt': '',
            'SapOrderId': _0x33f334[_0x46b31c(0x30d, 'H3Oi')],
            'Vendor': CONFIG[_0x46b31c(0x424, 'EjAy')],
            'ChangeNo': '',
            'ShipFromWerks': _0x33f334[_0x46b31c(0x1c2, 'riSU')],
            'BiddingDate': plantConf ? plantConf[_0x46b31c(0x41f, 'd5Um')] : '',
            'SlotNumber': plantConf ? plantConf[_0x46b31c(0x32b, '7T&H')] : '',
            'Freight': (_0x33f334[_0x46b31c(0x362, 'uwg!')] || 0x0) + _0x46b31c(0x14e, 'd5Um'),
            'BiddingAmount': (_0x33f334[_0x46b31c(0x257, 'EBzE')] || 0x0) + '.000',
            'AvgWtBidAmount': (_0x33f334[_0x46b31c(0x361, 'Q1U1')] || 0x0) + _0x46b31c(0x146, '@!o['),
            'BiddingRank': _0x33f334['BiddingRank'] || '',
            'CreatedOn': null,
            'CreatedAt': null
        })),
        'NavEBidVRPlantN': {
            'Sign': 'I',
            'Option': 'EQ',
            'Low': CONFIG[_0x46b31c(0x39c, 'EjAy')],
            'High': ''
        },
        'NavEBidVREtTrackHisN': []
    };
    try {
        const _0xc5f9c7 = await client[_0x46b31c(0x155, 'p[t5')](_0x46b31c(0x47c, 'Fnyv'), _0x264f8d, {
                'headers': {
                    'X-Csrf-Token': csrfToken
                }
            }),
            _0x1bb7b2 = _0xc5f9c7[_0x46b31c(0x427, '!umK')] && _0xc5f9c7[_0x46b31c(0x42c, '8CVd')]['d'] && _0xc5f9c7['data']['d'][_0x46b31c(0x391, '!7at')] && _0xc5f9c7[_0x46b31c(0x3bb, 'V&W2')]['d'][_0x46b31c(0x413, 'Fnyv')][_0x46b31c(0x13d, 'xcPi')] ? _0xc5f9c7['data']['d'][_0x46b31c(0x16a, '&PzW')][_0x46b31c(0x45a, 'vSeG')] : [];
        return _0x1bb7b2[_0x46b31c(0x2f0, 'Kq2E')](_0x1e9426 => {
            const _0x550199 = _0x46b31c;
            if (_0x550199(0x390, 'pLhn') === _0x550199(0x1a3, 'riSU')) return _0x474673(_0x550199(0x372, 'xvA&')), {
                'type': 'E',
                'message': _0x550199(0x41a, '6VmM')
            };
            else {
                const _0x1fe3a8 = bidRows[_0x550199(0x276, 'bC17')](_0x287a23 => _0x287a23['SapOrderId'] === _0x1e9426['SapOrderId']);
                _0x1fe3a8 && (_0x1fe3a8[_0x550199(0x4a6, '6VmM')] = _0x1e9426[_0x550199(0x216, '4f2Z')], _0x1e9426['L1BidAmount'] !== undefined && _0x1e9426[_0x550199(0x295, '839y')] !== null && (_0x550199(0x3da, 'UwMq') !== _0x550199(0x40d, 'GmQ^') ? _0x1fe3a8['L1BidAmount'] = Number(_0x1e9426['L1BidAmount'])[_0x550199(0x3cc, '!7at')]() : _0x9e8255(_0x550199(0x291, 'Kq2E') + _0x26ad3f(_0x173d32))));
            }
        }), logOk(_0x46b31c(0x47a, '6HMp') + _0x1bb7b2['length'] + _0x46b31c(0x392, 'd5Um')), !![];
    } catch (_0x3816c6) {
        return _0x3816c6[_0x46b31c(0x1ff, 'Fnyv')] ? _0x46b31c(0x2bf, 'Fnyv') === _0x46b31c(0x2ef, 'UwMq') ? _0x11c62b[_0x46b31c(0x40f, 'vSeG')][_0x46b31c(0x24c, 'UwMq')]('\x0d\x20\x20⏳\x20Submitting\x20in\x20' + _0x3c8162(_0x2c373f) + _0x46b31c(0x177, 'xcPi')) : logWarn(_0x46b31c(0x245, '6VmM') + _0x3816c6[_0x46b31c(0x187, 'JpRo')][_0x46b31c(0x1f6, 'rl6t')]) : logWarn(_0x46b31c(0x375, '6G(F') + _0x3816c6['message']), ![];
    }
}

function saveRankRecordsToCsv(_0x5800a4) {
    const _0x3b5435 = a0_0x5cae94;
    if (!_0x5800a4 || _0x5800a4[_0x3b5435(0x1e7, 'Em3N')] === 0x0) return;
    const _0x3cfeaa = path[_0x3b5435(0x3bc, 'rl6t')](process.env.RANK_CSV_FILE || _0x3b5435(0x1e9, '^Hgn')),
        _0x15d47b = fs[_0x3b5435(0x1f4, 'xcPi')](_0x3cfeaa),
        _0x40ff49 = new Date()[_0x3b5435(0x24d, 'CMx8')](),
        _0x526218 = plantConf ? plantConf['SlotNumber'] : '',
        _0x2744ae = plantConf ? plantConf[_0x3b5435(0x272, '6HMp')] : '',
        _0x3c6658 = [_0x3b5435(0x1a4, 'EBzE'), _0x3b5435(0x318, 'E&Ei'), _0x3b5435(0x184, 'vSeG'), _0x3b5435(0x395, 'wOt2'), _0x3b5435(0x3d2, 'Kq2E'), _0x3b5435(0x363, '^Hgn'), _0x3b5435(0x2b9, 'W6n7'), _0x3b5435(0x268, 'EjAy'), _0x3b5435(0x275, '4f2Z'), _0x3b5435(0x3ec, '6HMp'), _0x3b5435(0x1ec, 'EjAy'), _0x3b5435(0x23f, '6G(F'), 'ClubId', _0x3b5435(0x30c, 'uwg!'), _0x3b5435(0x39e, 'EBzE'), _0x3b5435(0x1b1, 'wOt2')],
        _0x293281 = [];
    if (!_0x15d47b) {
        if (_0x3b5435(0x384, '#Uph') === _0x3b5435(0x22e, 'Mje0')) _0xb3a35d(_0x3b5435(0x2f4, 'PV9Q') + _0x1e406b[_0x3b5435(0x34a, '8CVd')] + _0x3b5435(0x1cb, 'H3Oi'));
        else {
            const _0x153be2 = path[_0x3b5435(0x3fe, 'p[t5')](_0x3cfeaa);
            !fs[_0x3b5435(0x19e, 'CMx8')](_0x153be2) && fs[_0x3b5435(0x189, 'Q^^z')](_0x153be2, {
                'recursive': !![]
            }), _0x293281[_0x3b5435(0x438, 'pLhn')](_0x3c6658[_0x3b5435(0x428, 'pLhn')](','));
        }
    }
    _0x5800a4[_0x3b5435(0x3d6, 'BEh9')](_0x286cfd => {
        const _0x51ae20 = _0x3b5435;
        if (_0x51ae20(0x172, 'EBzE') !== _0x51ae20(0x4a2, 'IngF')) {
            const _0x1e21bd = [_0x40ff49, _0x2744ae, _0x526218, _0x286cfd[_0x51ae20(0x262, 'GmQ^')] || '', '\x22' + (_0x286cfd[_0x51ae20(0x44e, '6HMp')] || '')[_0x51ae20(0x3f8, '!Cfi')](/"/g, '\x22\x22') + '\x22', '\x22' + (_0x286cfd[_0x51ae20(0x355, 'EjAy')] || '')['replace'](/"/g, '\x22\x22') + '\x22', _0x286cfd[_0x51ae20(0x2c2, '839y')] || '0', _0x286cfd[_0x51ae20(0x106, 'Em3N')] || '', _0x286cfd['L1BidAmount'] || '0', _0x286cfd[_0x51ae20(0x20d, '4f2Z')] || '0', _0x286cfd[_0x51ae20(0x3b1, 'W6n7')] || '0', _0x286cfd[_0x51ae20(0x44b, '7T&H')] || '0', _0x286cfd[_0x51ae20(0x4a0, 'EBzE')] || '', _0x286cfd['ShipFromWerks'] || '', _0x286cfd[_0x51ae20(0x1ea, 'Q^^z')] || '', '\x22' + (_0x286cfd[_0x51ae20(0x23c, 'BEh9')] || '')[_0x51ae20(0x1ef, 'BEh9')](/"/g, '\x22\x22') + '\x22'];
            _0x293281[_0x51ae20(0x373, 'Mje0')](_0x1e21bd[_0x51ae20(0x10c, '839y')](','));
        } else _0x2dea6b(_0x51ae20(0x44d, '&PzW'));
    }), fs[_0x3b5435(0x1e4, 'Kq2E')](_0x3cfeaa, _0x293281['join']('\x0a') + '\x0a', 'utf-8'), logOk(_0x3b5435(0x410, 'riSU') + path[_0x3b5435(0x48b, 'bC17')](_0x3cfeaa) + '\x20(' + _0x5800a4[_0x3b5435(0x20b, '^Hgn')] + _0x3b5435(0x32c, 'CMx8'));
}

function csvToJson(_0x509f44) {
    const _0x56edfa = a0_0x5cae94,
        _0x52992e = _0x509f44[_0x56edfa(0x43e, '&PzW')]('\x0a'),
        _0x28f5ae = [],
        _0x8c810a = _0x52992e[0x0]['split'](',')[_0x56edfa(0x1a1, 'iaaA')](_0x23acf7 => _0x23acf7[_0x56edfa(0x281, '!Cfi')]());
    for (let _0x21e169 = 0x1; _0x21e169 < _0x52992e['length']; _0x21e169++) {
        if (!_0x52992e[_0x21e169][_0x56edfa(0x39a, 'E&Ei')]()) continue;
        const _0x4707a9 = {},
            _0x203611 = _0x52992e[_0x21e169][_0x56edfa(0x256, '8CVd')]('\x0d', '')[_0x56edfa(0x336, 'Q^^z')](',');
        for (let _0x1325a5 = 0x0; _0x1325a5 < _0x8c810a['length']; _0x1325a5++) {
            _0x4707a9[_0x8c810a[_0x1325a5]] = (_0x203611[_0x1325a5] || '')[_0x56edfa(0x2ca, 'bC17')]();
        }
        _0x28f5ae['push'](_0x4707a9);
    }
    return _0x28f5ae;
}

function loadCsvFiles() {
    const _0x1d7cd6 = a0_0x5cae94,
        _0x386447 = path[_0x1d7cd6(0x138, '^upB')](CONFIG['CSV_FILE']);
    if (!fs[_0x1d7cd6(0x21c, 'wpSZ')](_0x386447)) return logErr('CSV\x20file\x20not\x20found:\x20' + _0x386447), ![];
    const _0x50a9c4 = fs[_0x1d7cd6(0x287, 'EBzE')](_0x386447, _0x1d7cd6(0x3c9, '6HMp'));
    csvData = csvToJson(_0x50a9c4), logOk('Loaded\x20' + csvData[_0x1d7cd6(0x22f, 'Q^^z')] + _0x1d7cd6(0x1d0, 'Kq2E') + path['basename'](_0x386447));
    const _0x371f71 = path[_0x1d7cd6(0x116, '8CVd')](CONFIG[_0x1d7cd6(0x3f1, 'wOt2')]);
    if (fs[_0x1d7cd6(0x1d9, '!7at')](_0x371f71)) {
        const _0x5a5f51 = fs[_0x1d7cd6(0x2f3, 'BEh9')](_0x371f71, 'utf-8'),
            _0x361aef = csvToJson(_0x5a5f51);
        deleteList = _0x361aef[_0x1d7cd6(0x3cd, 'Q^^z')](_0x405ae5 => _0x405ae5[_0x1d7cd6(0x42e, 'riSU')])[_0x1d7cd6(0x14f, 'EjAy')](Boolean), logOk(_0x1d7cd6(0x169, 'PV9Q') + deleteList['length'] + _0x1d7cd6(0x203, '^upB'));
    } else logWarn(_0x1d7cd6(0x41e, 'bC17') + _0x371f71 + _0x1d7cd6(0x3c4, '@!o[')), deleteList = [];
    return !![];
}

function a0_0x51a9() {
    const _0x11b490 = ['W7ShW4RdQXe', 'paVdVZWVbH7cPCoNW5e2', 'C2frD0i', 'uKeR', 'yWBdJs3dVSo/W6hdM1FcJ1NcQ3C', 'Fmo9WRpdKeBcIW', 'fCkwdSo6', 'm8knamorW7xcRZK', 'q8o0WRldG3ZcLIBcVSkWua', 'vCoNWONcSZ0O', 'WOBdGmkBo8kRlq', 'W5fhcW', 'pmoel8odW4JcKCkndsCHDCkRWOzC', 'WQ7cTSkWW5S', 'uHfwW4RcLmk8', 'tIfuiWe3W799qCosW77cRmklA2JcRJldMZz7W6SkW64gWRRcJSoaAcddU18VW5O1yMxdJa7dJSkUW6jgr1HMhbJcNCkMW6DJAhWHEcPFd8k3l3lcRsbjW4pcGIPZWP7dOmkQW7bBWQXGDbNdOfW', 'W70xCqGdWQVdTW', 'W5JIM63dKa', 'WO/dMCk7', 'W4XyecyL', 'bSkIrIZdLHOUWPTEFW3cLCkg', 't1q1zSoXWQRdGLlcRG', 'W5ftW6n0oW', 'W5LeeYaJ', 'u8onw8k7WQm3r8kGhv7cVSoSWQq7WQpcHG', 'AetdTN4AkIJcOSopW6WucZvozSocWPVdU8kgWR7cSCojWPVdGdBcPCoteSkMWPRdOCo5W6ddJSkheSoGW53cOeJdUYWEWQ4aW6mkW7q', 'gSobWOrKWR5gvq', 'WRJcRmkMDSkg', 'WQ1/qgKTW4m', 'r8oTWPldIZ8', 'eSoAqmoYWRS3', 'WP/dUmoLWO/dUbxcGaKGW7pdGq', 'CuqXlG', 'nNXuEmkLECkPwHZdOLGBWP3dRSoovmoEW7GHWRJdMSoDaCkla8oyW4JcJCkyWQHQW6JcT8k1oWZdUfqgrtXqyCoUW4VdLGrSzmoCfSoneI9MWP7dN8ka', 'WRZcGCoyW7RcTwBdNmk0W6/cRSoV', 'WPhdLCkolG', 'b8oWWPxcTcfVkwW', 'W7jndZWWW43dSq', 'uutdVSoVW4C9WQG', 'WPNcPCk6z8k8WQy7i8kEW5q', 'xSo3W73dTghcTwVcSCk0vHjun2JdLwFcHqiKn8ojWPBcHrOfWOW2W79Rq8kOEmobmmkNWOmrAN/dL1FdQaHMmhVdKCkoWOhdVGNcHh/dL2n1W4HpW49tw8oPWRhdLCkXW49xa1dcNSoLWRuMjSkVW5q', 'BfqXnCoJWQhdIa', 'W63cV8kJW5RdQCkdf8kKFSoOW4JcI2upyCopWPO6W6ZdUSkMcWbeWOVdUduKW4ddI3xdICkCrSo1', 'mduMuu3dGIZcH8kkC20iWOtdSwzBnh5LmmkFuLZcNZvelSoXh1/cPXm', 'yItcJLNcS8k4fSoOW69M', 'WQRcQSkL', 'W71bgcS4W4tdSZldVGVcNCojW7K', 't8otWQVdGHPFamorWOm', 'CwuDE2BdSa', 'aCoCr8o+WRK', 'W67dJJe', 'utTrjWzKW75XxComWRhcOCkxyZJcSdldJdz2WR0CW79fWRVcNSohoYJdOrmaW7bg', 'ehBcP2a', 'WOpcPmk0DmkxWOaIm8ksW4JdNW', 'WOKaW7tdUJm', 'W4hdUmkPemk8WQRcIs8RW7xcTq', 'W5jpzSodWQZcGSokDW', 'a8oyrSoOWQG', 'W4CzeXtcK0FdTGSAwHNcIx3cKMRdN8kPW6XeWQNdOmoyWQVcP8k8WP4lu8krj0m/', 'vLaRmSoRWQJdIGBdQmoLW7DyWQ9eWOPGkmoYic7cLGRcJeS4cHBcN8kxWQRcNmkVW6LGkZddRG7cS2RdVdHRW5mCW6hcV8kzcCoxWOzaysnLWQPa', 'BCouW5hdNYhdK8o0oSoEWPBdVmkXW71+WOSYWQTcWPFcHZq8nepcKSoDWO0qoCkXW4L0', 'oaxdGsa9', 'imksamoaW6JcG8oedbq+DCkSW5ii', 'W59sWRpcImouWPBcIq', 'WQBdHmkt', 'WP3cMSkcpea', 'W7KUW6/dIG', 'uJ/cKuJcQ8k4bCo0WQS', 'qZxcJ0JcQmkZaSo0', 'ucTxjq', 'W5ajbrZcMuddOazvz3JcRs/cMMddL8k5W7aqW73dU8oqWQtdOSkTWO8dx8kxyKfXW4ddM3WsW7aJoKC', 'ySotW6BdKrDkamoxWO8iohxcQHpcRmoIpr/cLSoUpmkiAszYW5y4mCofeIldSXFcRGedymoVW6fRW53dLSkPymkJwW', 'dmoBWRreWPvltcrQW6m', 'a2xcPfH+W7ldGbldKCoBj8kuEcy', 'kHBdMJqWfW', 'WR3cQSk/W5hdO8kia8kvESo4WOFdG20t', 'v1pdO8o2W5K9WRJdSSop', 'xmoYW65GW5FcNq', 'rf3dUSoU', 'WOj1w2i9WOVdSSo1dSkHAvK3W6ZcGGRdHubSadtdISoTWQyYgIVdGqRdKGFcNCoNBSoGWR4D', 'W6ahCrm', 'W7HdWQlcImofWPVcTSohmca', 'ESoDWQxdPbnuemoBWPu7ExlcRbVcPCoGuWJcHmojlmkojYzKWOH3mCkArG', 'Fu96W4xcMCkAW5idfmoAya', 'rYnrlWTZW6H8eSoHW7dcSSkmBsdcVxFdQZX+W6SkW7GgWRhcLCoDpcFdTrmfW7mcqgxcKa', 'WPpdJSkRWO1k', 'WQpcRmojWOldTtRcIIq0W6NdLSk7xee', 'vtrMxejEW6SeW600hW', 'W4lcJCo/W6GJg8oAsSk6WPjcg1G', 'ex/cRhTeW4xdHbtdTCoe', 'WOFdK8kVWOLdBKf0rq', 'W57cNSk0', 'W7/dLZXNwL4Bw8kQW5tcKSoDxG', 'e1VcJ3/cHSkU', 'oGhdGcm3dr/cGW', 'irtdLXOD', 'WQu/W7JdIdS', 'W7ldPSkOlSkn', 'WQBcRmk7DmkgWRS', 'w8ooWQ/dHHm', 'i8kna8oZW7xcR8okktG8B8k3W4G', 'a0FcKW', 'e1BcIMNcRmkIWRdcTMdcHfNcVxfGjqKkuq3dNq', 'WPhcOmodWOldTtRcIJq0W7pdNG', 'WQhcRmouWOpdQa', 'iM5HcYfCW4rwDCkcW4pcH8kRwWtcIatcMbvDW49pW55UWPhcQmkucXFdLZmP', 'DZNcJKVcS8o9e8oWWRTEaCkiW6j6bfKEzCkqDG4', 'W5FdLCk+W6jMr8oZemo2evWoWPpdVSkCW5xcIKaCpmo4WPW7sGpdS8oYWQBdHNa', 'W5CdbbxcNHtdQW0bfeRcKMpcJwJcMmkVW78uWQNdQSoDWQ/cP8kOWPqyemknkK5TWPlcMviuW7CUzeFcL8k7CCozWRlcUbZcJ8oCgmkcW6exW6DszuaL', 'rX5YeaS', 'v2rsCgr2W6i9W4OFh8kOWQ0CW4xcMapcVKa/', 'FePMcN1NWRG', 'WPSJW5/dVGtdJSofW4NcGrK', 'uf3dUSoN', 'W5pcPColW64FomkFECk+WRK', 'nmkddSoA', 'W4BdOSkVoSkpWRZcJW', 'CH9iW5JcNSkZW55mcmozDrvaWRHAWQBcSrP0W6JdRLHJW74', 'mCoqdCoEgW', 'WR56WRKT', 'FCoJW65G', 'W63dSHLnzW', 'WQSGW53dUIBdNSoCW47cGa', 'FZ/cS17cK8kVbmoYWQrVdmoz', 'zx7cSf4uWRfm', 'WQRdK8oIWPHmF1XNrgvKW5GScKhcGMSiWQddHvSMWORcU0BdT8kpo8o+F2/cTmo0BCoGWRddShpdLhlcO8k1FCkiW5TgBa', 'WOBdGmkBlmk1', 'iCowgCkCuq', 'WP8Fu8kdWRi', 'W6XCht0LW4pdUHtcSWxcNCotW6lcTmo9W516W4ldPbmodmozc3vyW5DmWOhcMmoHdK59hYeyWOpdM0mUW5ehtq', 'DwPd', 'xglcS0G', 'WRSFeaNdLvVdTrDAw13cNhVcMIldI8kTW65lWOFdN8o2WPhdK8kCWROKy8kPdxvkW7FcQwWZW4yqzYlcPSkMESonWQVcVXxcU8kDd8ksW4yDWRm', 'W58KW43dJd1WWOG', 'WOSUW4ddVINdK8ojWOVcGG5PW7BdGCkbWPJcKSo9w8oFr8ku', 'WP1PWRK0pXG4W6HIWP7dS8kZWQ3dH0BcSmkwWQb2q8koWQRcVSkdW4pdGSkRW4bFlbxcG3DytCkMCCo0AYBcHfRcTCobWPnAWQblaWTLgSoGWPipW53dNW', 'eLpdVSknmCoKW6NdQsa', 'jCk4sc3dLGa9W55PDtJdJmktomoEW5rNW413WOn2WP/dLmomhmoGW5lcHfldRwlcVCoxiduucCk6emojWQWSBSoYbSkRyZu8W58qkmosWQPLmSoLWPO9W4NcPSkHW7StW7u', 'duNdUW', 'h2fb', 'W6tcJSokW7GF', 'ysHhrLr5WQSFW7CXdSks', 'WO49W5xdOY3dK8oC', 'tqaal8oMWOFdGeNdU8oKW7e', 'y2evzhBdUG', 'WOtcVM/cKG', 'nSk2vdxdNay7W55jwWtcMSkqjCkmWPf2W55OWOuVW5C', 'WQPDEx8s', 'rX9uW5NcMa', 'W4e/ncVcPx3dGq', 'WQX7wM0X', 'W5yffr3cK1RdOImyw0ZcK3S', 'f8oyqmo6', 'mhBcSgbMW4BdJa', 'fSk3CZJdUWS', 'qZhcN10', 'uLqEseu', 'W4jHWOpcTCo8W5pcU8oReq7cRwlcVCk5W6RdGXVcPmkHmCkhdW/cQSk3W7KjWOtdK1WdW7TXAeFcQL1kWRXjW416WRTK', 'b8o3oCk1a8kkW5ddJ8kuW6eXW47dUCo5a2hcOr/cSSoJW43dOsJcMM7dGmotmCkUwInzjCk+aSkM', 'WRJcRmkLDSktWQC', 'qGTAW4hcLmkVW4SjbCo/CqTw', 'vCoTAsFdOrbgwMpcQrz1WOZdLXRdP8oDyCo9bCopfZhcPa', 'pSowqSoYWQm1emo0eXpcV8o8WRi7WRNdHfJcLmoPkNWjBq', 'krtdMJG9gG', 'hw7cTN7cJG', 'W5RdH8kBp8oXmCkIgmkSutNdRIhdPSovW4fiDIJcT8oWDJuppSoHrCkmW4GbWQ1eWO/cG8k5WPjwg8kgWQ/cSSoRW65+W59eW5RcHhj4W63dOmovWRv3WO3cPG7cGdZcVbjVoqf+', 'quJdQmkRWO0', 'W5XAgs4LW4/dNbldOaW', 'C2igrKK', 'BwPIxf56W6i', 'W5jjda', 'vCk4W5JdPa1OlNdcJmoq', 'WPmoW6xdNGxcLSoUW6lcVdy9W4ddMCofWPZcLmoQumknpSoNj1yIn2PmWRCfWPBdSSoskHRdKCoVwSopWPtdLx/cOCkJia', 'WOjkz8oKWR3cGmomzH7cQSowg03dPfFcTCofW6hdLraayCkVW7/dQ2ZdK8kbq8oVWPJcQbyEW50vWO4lESo8', 'W4pdM8k6WO1xCmoejmkFaq', 'W5ajaG3cUv3dSrSXuuRcNG', 'WRpdMCoUW6RdSwtdNSk/W7/dOmoFbCokzmk0b8knudVdGW', 'F8omWQ8', 'W4ddMmkKWQ5I', 'e8k4vGtdNG0Y', 'Axbxxq', 'iumTmCoXW6JcGWG', 'sNvn', 'dwldNCkOja', 'W6ebrHqS', 'WOZcPSk0bvy', 'Dmo5WQNdLG', 'WPW2W4ddRW', 'WOhcVmk7CSkvWP03lmkEWPC', 'n8o8WOlcOcDVpsNdGCkzW7NcGM/cICk2WOCdW4e6mftdPMtdHmoRWOWeW6Pih8kEbSkCW4DDW4ldUCkhWQ7cLSojWQFcISorwmkzW69emu7dO3joW5mKWO3cGCkaw8oKAGddHLhcIvft', 'paVdTtOGbGG', 'nmoaWRlcIXfucK3dT8kKW5lcUupcRCoaWR05W7Gxeq', 'W77dKI1HDuizC8kGW5pcKW', 'kCofW4RdKG', 'bJxdRq', 'W7SkW5JdTHjAWR4T', 'WPxcM8kBAWtcUsXnfrtdICktWQaMlhZcPXO', 'W6BdQCkgq8k7W6L2', 'WPFdICkGWOPBEvX/rG', 'W5eufbRcJ0ddRaWsfeRcIx3cMNNdNCkRW6DeWOy', 'iSkff8oJW7/cQComscy8DSkVW5Kyjmk/W7e/W4xdV218W5CcnCouWPNdUmkGaa', 'DuRdQCorW4eAWQxdS8oQW73dPNiupG', 'iI1BkX1KWQq', 'gebNgLT8WR8iW7VdS0/cJq', 'WQDnWRu6pq', 'uNWqDgRdPWlcM8kSpvq', 'W4tcGCo3W6q5gCkLsmkKWOTie0uVsa', 'WQFcU8ooWOS', 'i0lcMhdcPSk+WQxdS2lcQKJcP2O', 'WRhdS8kkWPrBA8oiF8kbWRftj0O', 'W6RdOCkziSosWROLyq', 'CvqSiSoRWQJdIMtdR8o+W6yqWQrs', 'FXf3W4RcQCkPW4OpcSoMCqm', 'WOldLCoQW7/cSetdLa', 'W7hcT8o/W44J', 'W6bhzSo0WRhcJCoFqHFdQCkdaLa', 'WPdcICkdhexdPeqpoGpdGCkaWR0Z', 'zgCbDq', 'nuxcIhlcVq', 'WQNcPSkJW5VdQ8klaq', 'WQdcPmk1W5ZdUmk1hCk5Ea', 'W4yUW7JdLIrYWOK', 'o1D1fW', 'iSkieSo1W5xcPq', 'omkdfCoXW7RcUda', 'fmo2WPlcRtHKewZdJ8kd', 'a1BcILlcVCkUWRtdPe/cHq', 'gruaFWi', 'mhBcSgP+', 'W45bzq', 'wd7cN1tcSSk5fmoI', 'W6ixCrqoWRRdTW', 'w8oQBIFdUaPdw3FcPdf/W43dHXBdOmkAASoPbCkouc/dVGDa', 'nwhcQNTV', 'W6OVW6BdSsq', 'cexdI8kxbG', 'WQdcVCodWONdQsa', 'gGxdNtH4eqNcHCoPW5a3wfr6qSo9WRpdLmk2WPlcMSkNW4/dQLG', 'WPPQWR4Seq', 'WPKSW4qjWRyBFSotcmobW4dcUComx8oqBHGRErPQW4u4W4FcLSkZDKtdQmobWRudumosW4hcIZ3dPhyHvcCTFH8', 'WRq6W4bvWPqaW4u+WO9DCmo9W6iVog7dS8o4ncq', 'jSo5WONcSab0n2VdK8kc', 'kSkvf8or', 'vhahzeddObhcSmkjnKWU', '8kECOKFdHCoDWO/dPKHKC1VcMSo0nuhcMSobgmkhWROZmCkrndddJmkzW7JcOa', 'W5TbWQlcGSoBW54', 'y8oSWRZdG0FcKa', 'hCknf8oaW7JcSZK/kuqjnMddH8kaqmoUW4ywqq', 'ahRcP2TJW57dJItdSCoyiW', 'WORcJCkap1pdQxe', 'W4NdT8keWRTo', 'W5tdN8kMWQDrCCkbfCkfmXmlWPNdPmkCW5FcGeycmCk2W5K', 'hKXWcNf7WQW1W57dOLK', 'WO7cRSkbbwm', 'W6XtWRpcK8oAWPO', 'WOyErCkeWOq', 'W5pdIdTwza', 'W6JdRr1rBhK4', 'BITDlrT/', 'crldLaqSiqxcGSohW488xHPV', 'WOddNCk2WPG', 'AcfAja', 'WQGxqSkdWQjuANhcGCo1W7i8fSkMwmoBE2q8tSkIW7bgW7ZdGmozWPmzqsFdU8oMW74NW4KQzW', 'W4ZcI8o0W7eYh8k1rCkJWPrzaem2xG', 'ceJdV8ksmmoYW6xdTa', 'WQ7cQmkHCG', 'h2TiCmkJmq', 'cXhdGcC3dGNcLa', 'W5ldQmkUd8kbWRhcLcq', 'wcPdlGW', 'WR7cLmoK', 'W5iBzJqqWQJdTXxdU3ZdVhNcRCkuWOOGW514kmoOW5WqWQC', 'zmoQWRtdMG', 'WQWIW50qWRC', 'WPtcH8kx', 'WQhcKCkZfKa', 'E8o9WQtdHa', 'CJTaiG', 'WRJcRmk0D8k0WRO6jmkOW5/dLIm', 'b8oWWPBcQc9IpW', 'W4Ply8o0WR3cKCol', 'l3BcShXRW5FdJa', 'n8k+qcxdLGa9WR9xwX3cGSkb', 'pSouW5ldMJK', 'kSodWR0DW6m', 'jqhdGca5baK', 'WQBdNmktp8kylmk9amouwY/dPcy', 'W55lccyNW4/dNXBdQHC', 'WRZdHCkaWP52', 'b0NdRSk7jmo1W6G', 'zhOYExVdRae', 'lhZcTa', '4OY5kmkdntqBnSk8CmkyW6/dTmoJW4TqW6q', 'AsTk', 'WPhdHCoUW7ZcG1ldN8k1W7pcRSo8', 'WPrjA1WgW6ldMa', 'u8o0WQJdLxtcKs7cTCkYsGu', 'C8kxWPLzWR8eaq', 'gSonW5ddLYldJCk6nmknW5FdU8kXW7f/WPDMWRKaW4pdHGe4zfJcLCkpWOOvBCk7W48Xmtz1WQlcIJtcPmk7DKWuxwhdJ1jAWRuhv8kiW5dcOWpdKmkok2SjW7NcNmoxfmkJWPLbW6NdPCoHy8kDFSoAEmoTEsS/', 'CfNdVCoYW7yXWRJdRSoVW7xdUMq', 'W6nUWRlcI8oW', 'BCoVW65RW4VcH2yoWPPbkG', 'WOZcU8kWESkvWRSI', 'BSoQW6yVW4dcIhu/WPnkmSooD8oGzG5BW7hcPSkkamoW', 'WR3cPSoq', 'CwNdP8osW6a', 'nSkBCqpcHq', 'WPFcRCkUgSknWRdcIsuXWRVcOaeUbmkhW6xdQuJcVKBdGSk2WPTECCkrWQNdLSo2W6tdIr9UWRr2WPlcKvNcMqldMHZcGCoszhxcOw7dGNOBDSo1vvvM', 'qsjgkcLLW6HXvCokW6u', 'CdfjW6RcKG', 'p0P5hNrWWR8uW5S', 'WQhcRmouWPpdScdcNG', 'nmk3iSofW4pcImoP', 'a0xcJgxcOW', 'W77dKs1VvXasDCkZWPVcLmoCrNdcLIBdHJJdJCoXW50zWPdcIcBdOSkJW5DJWRaoW7Ho', 'WO40W7b5WQ4mW4u', 'W4tdK8kWWP1kEuy', 'nJakgWG', 'F8ovWRjuWQGEqcvNW7GTBCoLW7OsWPqmWPNcOSosW4u0', 'BaBcVmoEzCk2WQdcP2FdNSkiW7hcNYldRmkReSkNzKJdISkCrhdcRbb5wmk4WQ3dOGHtW4rzCajUqmkbmmkevmkqW6SdnmkIdZ4', 'u8oErSo0WRGIqW', 'WQhcPSoqWPu', 'WQK2W5miWRTpzmozgmkQW4RcOSol', 'WR/dJrldJSo/ss7cTa', 'W4/dMYTZxf4pFW', 'WQdcVCovWO/dSJm', 'cG3dLZCXdqVcP8oRW40Mrqa', 'BJpcKf9dWORcIq', 'xrfF', 'WQL/t2O8W5NdRW', 'n8kEyaJdSsL6WR93EZ3cOSkH', 'awTvySk7lq', 'jSkmra/dGYfWF1pcMq', 'WOO6W4rJWRm', 'y8orwSkuW5/cIqe/hxqZDuVcQmkRCColW68NyapcUtDC', 'WOVcVCk0W5ZdRCkoea', 'Duidruy', 'WQdcOCooWOddQa', 'W6hdUCkvW5dcSwtdMKTNWQ4', 'CSomnmoKW5ldOxG', 'aCo6WQRcQZLKkeRdL8kdW7i', 'Bd3dRq', 'WO0PW59KWRm', 'yLNdOmoIW5OQW6ZdPCokW77dOM4ulCkpnwP3WQanvSkwW5PRwuZcKmkQ', 'WOJcJCkEn1VdPhm/naFdH8kAWQW5', 'W5uOW5DGW7KgW5eDW7j3ymoiW6qVDhBdMSoHAdddJ1FcRc1KtSo3r8kLWQ7dRvGjpCoUjwtcPSkCWQ5+FL9ZWQC1dCk3eg3dTmognCk4uGeMWPRcSmoijW', 'AqBcRSo1W5a2WQJdVSofW7FcQq', 'aCoNWO/cQq', 'A+kwKmk8WQ0XW7FdSSoZlSkqW4/dSCo8E8kVW6DxWQDL', 'cSkvf8or', 'WR/cQSkHW5NdQ8kfaq', 'WQOMW58bWRTvD8o+hCkvW4ZcS8oDtq', 'CHjnW47cU8kPW5OfbSoCya', 'WQFcRmkMymktWRqZ', 'xSozWRxdGHLub8or', 'iSkne8oUWRZcGSocddbZxSk8W48FDSkLW7qOW4/dTq', 'i13cSMJcIG', 'W7C8odJcIa', 'vv/dUSoVW4m9WOFdSSosW6m', 'WR3cRSk1W6BdVSkhfSkJ', 'W7ldM8k5WQDlDCommW', 'uYlcLv/cR8kP', 'nSo0WPBcSc1PoYNdLmkvW7tcH23cM8k2WOmnW5a6lLddOcJdJSk5W40mW7fztCor', 'uutdP8oY', 'puH7g3zH', 'W4tcLSoIW74/cCk0', 'WOv/xxOAW4ldQmoJpSoKFf8', 'WOmvvW', 'W4nEA8o7WR3cMG', 'W7pcSmoAW5uylW', 'qZxcJ13cSW', 'W6rVW7ldOY7cGCki', 'lmkjbSoqW53cSJr6hfGtnG', 'ffpdU8oYWPu3WQRcTW', 'CtPspHPKW5L9sSow', 'W6XKhq0L', 'jexcK3a', 'wfpdQq', 'CtTrjWzJW7L9vSoPW7tcU8kl', 'oaxdLWaSaH7cKG', 'DJXAjW', 'CJZcIvRcJSk5', 'W7GxyX8hWR7dOq', 'vd1CW6hcKW', 'WRXsusSRW7BcSG', 'WRK3tx0RW43cSCoUfCoQALi', 'W6TNdYaJ', 'hmkfa8oqW7lcTt9nlK8w', 'WPCSW4CmWRXCmmoie8obW4hcVSoasSkzyLKCssacW4TI', 'xCkxgG', 'tSkecCk7WO87vmoKfv3cTSk5WQK2W7RdILZdGmoPlt9xl1pdH1KlWOxcVGa', 'W7PpWRVcKCoFWPVcICohlq', 'WQ7cOmkNFCktWR4Z', 'WP3cLHqYe1KpoG', 'WOhdM8k8jSkMo8k2', 'W7HuWPFcQmoE', 'wCoiWQdcN04', 'WQZdL8knW41krM1OeIb0WOaDi2dcOw5+WONdOq', 'W7xcIJFcKq', 'WRZcJCkdj3hdO2aeerBdL8kr', 'W5vCA8oKWR0', 'W4ldHsZcMSkRvs/dUSkmnGzSWQXktCoUqCkOWP3dLhddSmkj', 'W4VdNSkYb8ku', 'ALq7', 'WOjny8oZWRdcHSoCiXNdP8kggeFdVf/cQmkcWQ3dLr0ajmk4WQm', 'WQj2qw0YW6tdUSo8cCoKEW', 'gCkGzc/dUWW', 'W6bhzSo0WRhcJCoFurVdQmkD', 'W53cJdRcM8k2tJRdLCkepvnrWPK', 'W7iRgt5OWP7cRmoxk8oVE0KT', 'gSk+pSoRW4NcJHy', 'W57dHZLT', 'WRFdNCkYWRzDB1bJAce', 'lSolaSkD', 'gCkYsIBdIWy', 'nfBcJNW', 'rHXQAJ1cW4m4h8kcW7/cRCkmlJVcQtxdLtPMW6KkW64', 'WQ8trmkcWQ9EAftdJmozW6yIfG', 'iCoCqmoPWRq7xSoNxedcPmo7WQCMW6RdLvdcJ8oKyIvon17cK0LBW5ZdOKLhvLldNSkuWQlcMSksWQhdMSk9kG', 'W7xdRCk9WPDG', 'WPBdMCkXWOLazuz0', 'W61sWR/cJa', 'rLNdVCo2W5O2WR/dSG', 'WRJcRmkMFmkEWQuZ', 'WRNINlFdTG', 'DrTlW5JcVSkYW4SvjCorzXe', 'fhXdCSk5', 'qSkbBmoRWO4HFSoe', 'hSoBWRCqWRLFvsvNW7q7o8oZW6TqWQSeWOpcVCkxWPa0', 'WQK3W5LKWPmhW4u8WRr1yq', 'W7KnbrRcKG', 'dmowWQT/WQLArdrgW7u', 'W7ecCHClWQ/dSXpdNNRdOslcLmkcWPfU', 'cSoKWP5IWOr3zq', 'WPxdKSo0W7lcNG', 'ihRcP05NW5/dNbJdPa', 'W70QW6JdSYb7WOGgsSkNa1O1WOxdNgHmxxChWPldNCk/W53cT8kZWRVcSNnt', 'WQa/W7jHWR0', 'FhaAD3FdOq', 'WPBdMCkXWPXB', 'W6v7WReWErKVWR0RWP7dPCoYWRFdGXhcT8oxWQm1DSkSW4NcLCk4WRhdOCkaWRn/fIxcU1T5ESkqr8kcBa', 'iLlcIw3cOmkKWQldSW', 'gmofW5NdQGe', 'evpdR8kw', 'oIldLrWS', 'W4DwCSo5WQRcHSoC', 'xZ/cIW', 'aqddOIKs', 'W7pcGddcMmkRsa', 'WOxdN8k2WPbzBN50wdy', 'CGpcRN7dP8kPhSo6WQPtsCohW6f+fvWzzCkqBfJdSLXYWOdcHCo6zw3dHwmbmc7cVce', 'ENa2zfy', 'W5tdOSkBfSkwWRRcGW', 'yNtcSwb/W4ddML/cSokxPUkuMokwSq', 'jIfeiJBcUqJcOCkieMOp', 'm0pdUmkr', 'W6xdVCkxW5tcQwtcGa4qW5ZdOmkr', 'WP8Fu8kjWQPgAG', 'CKuMkCo3WRi', 'W7pdRmkTmmkCWRVcGJmlW78', 'WRL4ywW8', 'BCoVW65RW4VcH2z8WOXgl8kkA8oIjaTtW7BdSSkocmkJW5SkcItdS37dOCk+uCoyW4BcV8ox', 'WQGMW4iqWR5pyW', 'WRNcNSkxbeBdIh0zfb7dI8khWQC+', 'eCkrfmo/', 'i3dcT2z8W5u', 't1hcM1O9', 'WO4oqmo5WRZdMCky', 'DZxcIfVcR8k0h8o2W69Bg8onW7bIvfywCmkal0BdUH00WRZcKSkPzghdNN8RE3tcQa', 'WRfVxwy', 'W7G7W6uvpqCtWQDa', 'w8o1oNG', 'W4JdJt1XwLq', 'euhcNuRcU8kiWRJdSKFcJelcQ3C0', 'qL3dOSoZW5a', 'pmoYWP9BWRO', 'W4NdJdfU', 'BSoWW61yW5BcQ2G4WRPclSkBASoH', 'fSk4sthdKWSUWPTE', 'CHuKxG', 'W5VdLZr3vKi', 'CxyaExxdRa', 'm8kmrHZdIJzQCeNcGtTgW6xdTJy', 'BSoQW6yVW4dcIhu/WPnkmSooDmoNAWbxW7BcOCkkamoW', 'WOhdJSkWWPzD', 'WQlcRmk0D8kxWQeL', 'WR3cOmkIW4e', 'd+kyPSkQ', 'W6PvWRtcJmoAWORcICohlrJdQe7cVG', 'WOldPmknWQ1w', 'W7X7kHaxW6pdMdy', 'W4XChtSKW5K', 'W43dNZXqr1eoBG', 'W7nhgYy/WORdSHldUGJcJCodWRFcUCowW6zaW6BcRq', 'WQpdLCoUWRpcLxxdQmkeW4JcLCovxCoFzSkQhCkybdVdGIZdQtBdPuBdNxi8jtybWO/cVghcMWldVmowW5xcQHHimCkiu8o/zqmeWO7cGG', 'wuJdSd1N', 'W55jf8oEW7bdy2xdQSoLW5K', 'W57dM8k8WODNFCofmSk/c1qXWOtdSCoFW5RcP1OF', 'h1aw', 'W63dPCkfF8ktWR0IFmoC', 'WRFdKmkTWO1HFLHZrdC', 'g8kEfCoBW6NdUZXQpuGtmIJcHCkhvCoKW4jtvLBdPMCirmkbW6LIvSkLWROFpXRdTmolD8knW5hcJ8o6rYtdMgS+yrO5W7GUbSk3l2VdKCkLxW', 'W7XoWRlcTCoAWPpcMa', 'W7/dQCoLWO/dUg7dJq', 'p1evzgBcOvtdVCo7zaz1W6BcLHm5v24tvSoI', 'jSkwDghdUHWOWPfidKG', 'WRtcH8krn1FdRJq', 'a8ofW4JdTG/dK8o+c8kSWRldVmkrW6PYWPGTWPakW4tdOq', 'WQxcQSkWW5hdR8kufW', 'W5nhgW', 'rCosWQxdNGnEeCoh', 'WQVcGmkzi3tdUhSqaHBdLSkzWRO', 'eL7cNJ3cOmk4WRxdS3tdGuhcT2O0yW4gsqVdKxLiur8', 'WQn9x1yn', 'n8kmtGhdGsmpDvVcJtDhW6ldTa', 'qXJcIgRcVq', 'DmoXWRRdKKhcLW', 'F0tcM23dOmkLWQhdOYNcJKNcV20HBbSctuFdO0PVngVcRKRdPqWMrSoYnf8jEJ/dGSoTWORdQmovDrvbkYJdKc7dQwpcSJ8BW4S', 'W4/dMYHMuKq', 'ax/cTM1dW5q', 'W7PJWPe', 'W5bhhCogWOjIvJxdS8oJW512qSkrvCojl149rCo0W7zvWQZdNCouWPimccddSSo7W6CQWO0SB0RcI2pdPJBcTmkyWOVdOW', 'WQZcOmk5z8kxWQe', 'WRn/xx42W4xdR8o/', 'f8kjwtJdUW', 'WPFdICkGWPrgF0f0rq5JW4G7', 'ANlcP0KCWRHoWRXLWQBdJSkMW6O', 'WPKvzSkpWR5vAW', 'WOHbWPqjgdf/WOLjWR7dLmoDWPC', 'WRRcVmkMEW', 'q3KBze3dVaJcQ8kOiq', 't8ola8o4W6VcR8obbZq3u8k0W50ByCk/WQS/W5tdV3PQW58dmmozWOZcSCkUsclcIwi', 'Fxahy2ldRGa', 'WOdcPCoiWPldKIhcGaqWW68', 'W4DwA8oK', 'BmovW5XqW6dcQfuFWRnWeSkNxSoq', 'lCosWQHaWRrquIm', 'mCoqumo/WQq8v8obevZcPmo3WR4', 'W5jdgcyJW7NdRr3dSa', 'W6ixCH4dWRG', 'WR7cOCk8b3FdMfe5cJldP8kMWOaCrW', 'WRJcVCkgW53dNG', 'xxahy2ldRGa', 'oflcM3NcQSk4WQi', 'W7lcGc3cJmk+rZG', 'W6ldN8k6WQ5eD8oef8k6cq', 'W6mgyW8xWR/dHGldJ2e', 'WP0+W4i', 'mmowqCo3WQLYxSoVcbpcOSo2WQy5W7ZcHLRcGCo6nJfpiHRcK11jW5FdSuLlxbu', 'W4ZdQmkZgmkAWRC', 'WQ89W5/dVZRdImoQW5lcRW5K', 'W69fWOlcRCol', 'WOBcPSkYESkCW7mWimksW4RdNsroWQXoze57WQK', 'W5XAtCkpWQHfE3dcGCoeW7yHa8kSxSotnvbYaSkgW7azWRddHSoqWP0erIhcT8oMW6PIW5LLB1ZcINZdPshdSCkfW5FcVthdJMpcNSohCSkwlCkQhmkTW6ntWPlcJW', 'WOldLCoPW6pcVKNdGSk+', 'FXeyW47cLmk/WP8ndmoByrXrWRHlWQVcSXf6W7VdRW', 'cSkbhSoK', 'WOBdUmkxESkwWPi7lSkoW4JdJa', 'jSoLWO8', 'emoTWO/cTZPYcxddMmkt', 'F8oqWQNdHJHpgCowWOiB', 'WROQW4pdVYBdJ8oB', 'Fxqe', 'ySozWRhcKGvwg8oaW4C', 'daddPZq5', 'ztNcKv3cTmkPemo8WR8', 'WOdcUCoo', 'dhZcJgLEW4ldNbxdU8oKlCkq', 'Ev3cHwbTwLxcO8odW7qguqe', 'W5tdImkJa3VcSdq', 'W5xdLCkoo8k7m8kIgCoW', 'W7tdM8k+WQm', 'iIXAlHW3W6X7wSolW7tcTmkDAMJcJJBdLJGYWQXo', 'W6CyfrBcJ0a', 'WQO9W5NdRsldJW', 'WQddMCkXWO1SyKfOzsb1W5i', 'WP1+WOC1ea', 'wrTzW4JcMmkPW4W', 'W4VcSCovW4akeSkBzSksW6W', 'xCoJW7L/W43cH3i5', 'oCoDW47dLG', 'E3FcRfK7WQneWP9TWRS', 'W6qzaHe', 'WQFcPSoRWONdQZhcNYu0W67dKa', 'qZxcJftcPSk+fa', 'W6aEbbW', 'ygahEa', 'y8oTWR/dMLVcLZ/cUCkXArrfiq', 'WPfWD2mj', 'WOHPWQqJpLySWQf+WPtcU8kZ', 'c8kldSo5', 'fSk7sYldLce8WPHjurW', 'iZxdPYOr', 'WQGMW4eaWRnp', 'W7ekAXqrW6hdSqJdMh7dPMJcLmkqWOWTW4T/kSo3W4fyW7m', 'gWZdMImEeqpcI8orW4CHqaC', 'xmotWRxdHG', 'B8oVWPtdTfzog8oFWOihog7cOHtcUCoIBGxcLSo+C8oA', 'imobW43dGcZdNCo/', 'WOyFrCkwWODCzMpdHa', 'W5VcGc3cI8kCssNdRCkTn1vC', 'W7GoW6ZdTIO', '8yU8J8khWRtdNrRcPKzKWR3dTmkqCxVdOwFdOW0hW4pdI8o1mbywB8kSzd0', 'W71bWQlcGa', 'u2Pdy8kYoSk5sGRcPXylW5tdVmogtSoAWRbUWQFdI8kFh8kxeSogW4JcKCkfW60LW6VdTSkQnqJdUufFcq', 'WROQW4pdRZ4', 'W7ffWRFcHCowWOZcJG', 'W5blCCoLWRtcL8ol', 'WQRdK8oIWRP8xrv8qdfLW5KThqJcIMnDWR3dJrvYW6NcOeddVmkbF8oiqfZdSmk5iSobWQRdS3tdKZ3cVmk9z8kmWP1ilCkzW7/dHLHol2/cPdJdICoVDCoHW7pcOtVdK8orWPdcSwpcUqlcHCkQoJpcQeC', 'WRqEhG7cIrtdOXaAwrK', 'W6NcPCoJW5az', 'lePNgG', 'n8k+qcxdLGa9WQXBwGm', 'mK3dTCkonCo/W67dOgFcJCoDWRpdKMVcV8o4w8oOkeJIG77cNau8W6aqkXFdR8o+W6jjh8kwhdfgn0ddKMxdHHNdMCk/v3hdPG9CW77cMfpdRmotq8ooW4hdPSouW4v9uCouW4HjWRxcTmkJW5NdVmoyW5ldMCobW70', 'DCorWRNdG2u', 'svmovxe', 'Bv4L', 'WRVcICkaj1hdONvDjHZdImkeWQW4iNRcUGxcIKhcQgW', 'Fh1nrLjSW5usW7y5', 'jSkle8k3W5/cKSo/lNuNDCkYW5KsjmkOW6eVW5BdS2PQWPesk8okWO/cSmk6aG', 'qr1LAGj2W7L7wSolW7/cPCoclG', 'W5rJWQ7cLmoe', 'W5ldI8k7mmkA', 'yNtcSwb/W4ddMG', 'WRzOr3O8W63dTCo2h8osDLiG', 'FSkiaSoaW77cUcX6kW1DiMhcL8kpt8oGWOOCsuFcPhKuvCkFW6L+s8oGW7uCFGxdUSopDSkyWOJdGW', 'WP7cV8k0W5BdO8khcmo3s8o+WOVdIg0tzmkgWR0ZWQJdPW', 'WRtdOSodW4ZcG3ldVW', 'dmkfe8o0W7q', 'W7uCarZcLfddGWSzuwRcHghcMa', 'wNBdTSoIW5y', 'b8kGAYZdIq1duuxcUrzX', 'W45lBmo3WQZcIW', 'jhlcR3XV', 'W5VcM8kCjSkYo8kHqSoXxZpdPaRdTCkFW5fgDgpcNSkivHKT', 'W7fhmYKfW5JdOrddUdBcJCow', 'thRcT0W', 'W7VdJd1QvfGi', 'WQddMSodW77cGq', 'E8kDWOZcHW', 'b8kYvc3dNG0/', 'u8olWOVdQhtcQGFcMq', 'WOJdK8kL', 'ie92n8ksk8k/qbZcSry', 'BdpcGM1LW4ldNr/dVSorAmkvFJTjjMFdGCovqv/dUq', 'WR87W5GwWQziq8ofeSkc', 'WR8Frmkj', 'mwFcONT/W4m', 'e8kQEa3dRGDh', 'fvXUCmkN', 'p8obW43dGYldLmoPoa', 'aCk3yYu', 'WOX/xx04W4ZdUq', 'xhOtEw3cQqdcU8k/pe13W7C', 'aCoCr8oRWQi8q8oL', 'W6XeeZScW57dTqhdPZdcGCokW6G', 'WOG+W4vGWRKhW5in', 'awTvEmk7l8kO', 'AJPhoHWTWQi3u8osW7JdRmkzFIhcQcxdJtzXW7WFW75fWRdcMSkAjZZdS1adW6CccYldNrxdKCkUW7qs', 'qSotWRe', 'W40FtSksWRrzAMBcGCoqW6eJd8oLvmoFn1iNr8o0W5zNWOO', 'W7pdQCkh', 'W5blCCoGWRFcJColzG', 'nYPcxeP6W7veW7W/b8kzWQSyWOJcKdJcOq', 'xdxcJ0VcPSk6fa', 'W5rRWOyG', 'W6ldN8k5WRjkESosmW', 'hCo2WOH1WOrRCWO', 'WPNdKCkukmkQnG', 'W7KJtJGa', 'W57cKZNcQmkRyJtdSmkOp0LkWOnU', 'mCoWCmosWOmvemobmx7cNSomWOqB', 'B8oqWRpdKd9E', 'nKNcQ0L+', 'W77dNYH3ufGDoSkUW4JcLmogtZZdKW', 'WOhdHSkpkG', 'WPvxq8kvWRrwiMhdJSoDW7yI', 'iCk2AYpdHa', 'h8owuW', 'W53cJdRcM8k2tJRdHSkipe0', 'zey5ANa', 'W5NcHdFcK8k6rh3dOmkgCKPqWOX+tCoOymkmW5ldGcpcVmoom8orW4y8WQNdKmoCndVdGe1/xJddRNPdW4tcJCodW7G', 'WQKVW4rXWQimW4yrW71d', 'sCoPW7HkW4pcIMK', 'DgbxrKD4W6m', 'twpcQL4bWQv6WOrMWQO', 'iLlcINhcRSkPWRtdL2RcJq', 'Amk1WR7dHedcHwBcQmk6srrs', 'jupdR8kkbSo/W7tdVGpcM8oBWRi', 'AmozWRxdHJvtamonWQmmA38', 'CbRdHd3cJmkJWQxdRZZdGq', 'm0ddSbSy', 'W6BdRmkPhSkcW7/cGJmWW7tcOf5J', 'WRxdHSofW4FcTf/dHq', 'W7rfWQxcKSosWPNcMa', 'wtxcNvZcOSkVaG', 'W7vhBmo0WRFcLmkyAGNcPSkfge3dUfldU8odWQldJHusjmo8W6xdUYhdMmktrmoLWP/cO0vtW4ODWOWyASk8xXpcVr4CzMJcUCk+euvQWPtcM15ocqTwWRiMWPBcNSkQW49+W5WfW7mUWQaCWOFcGmoylI3cNKi', 'WQb9WPinoq', 'FgTayu9YW6m', 'axZcTMnUWPddHXNdPmkwlSkeyJfsjMBdGCorvLtcSg/dV8oOCCoaCmk0WPicWOydp3BcPr8', 'FSkdeSoaWRVcTd4/', 'W7rTWP8', 'WPmlW6ldK2RdQCo9W6xcUuToW77dGmorWO3cICoHu8knhmoxbqmIns4FWQ8cWPBdTmotifpdMmoU', 'W7mhzXmY', 'W5nneIGLW4i', 'nwKyh8o6WQVdNa', '8jocTXJdVSkCWRxdLeW', 'b8oihSkrzCkmW5RdJCkwW6DL', 'xmoZW6H8W5BcM2GYWPW', 'WQv7wM8', '8kEaRuFdHCo9WQ/dHKG', 'WOOit8ktWRzdtwZdQSotW6O', 'WPBdN8oOW5BcSetdMq', 'o8kEfCoBW6K', 'W4ijqCkwW6LFF2dcJSozW7CTfSkKh8ojoKD8EmkcW5zRWOJdU8o2WRq+EaNdHCoBW4eqW7jzhw/dI1ZdTsddP8omW5NcSbBdGMhdK8oajSoA', 'hv5RW7ZcTmoHWP8', 'W5iBzH8lWQldTsBdMNRdUMpcIG', 'pSkIsIddMca7WPnFbq', 'DumRkW', 'kfXKcW', 'B8oqWRpdKdbieCoDWOabBa', 'WQDPWQa', 'wMXqtazCW6KpW716l8kzWQWEW5tcMJVcO1OE', 'j2VcQNX+W4pdUG/dVSov', 'bCo0WPtcTYS', 'W6LfWRJcHCoAWPdcMSoGkcFdRL/cQmkU', 'cmknbmoIW77cTtXWpxmCo2pcJSkirSojW48eDKBdScOhvSkBW6XOxmkZWRO6cJZdJ8kc', 'CtPxjrPJ', 'r1tdR8k0WObU', 'ewFcSw5+W5xdJG/cSmoT', 'o8kQkIVdPWvbu3pcSW', 'yZhcKLpcRSkZfSkXWPXibmofW6j4dq9x', 'hxdcVLhcO8oNuq', 'fLtdTCkkia', 'aCo6WQ/cLWfslNVdN8kEW7a', 'nx7cJ1JcVa', '8jUpK1rcqSohlSoPW7XZFG7cN8oTB1KIgGjFW6bmkmkufwn3WOHM', 'WOJdJCkuWR96', 'lmkjf8orW7RcRW', 'xhtcHuqnWRnn', 'yYlcUeNcRG', 'WPS4W4j5WQamW6OnWQrR', 'WRFdVCk+bSkqgCoYlmooCqJdGqe', 'WRJcRmkLF8ktWRaZ', 'CZNcMfZcRSkZfSoqWQjshmogW7C', 'WRyMW58cWQzt', 'Fwrqva', 'W5G/W6RdKtbM', 'kvdcKM3cMW', 'fwfuuSk2oSkL', 'u2agyKFdQbhcRa', 'W6LsWRpcH8owWORcNSokgJZdOulcUCk0W6tdMq', 'WQrNWQC', 'WP9khtSYW4ldSqdcSXFcNCofW6ddSmoQW4zXW5lcOW', 'DSo3WQ/dSLpcGcm', 'W7GQW7VdQJDXWOKBCCkr', 'W6xdJSkSW68D', 'xNPuCMRdRuxcQmkGpeOJWQpcHeLNbJbegSkP', 'xtxcKL/cS8k1', 'pCkvbSoA', 'ouvqCmkf', 'W7/dLZXNwL4BsmkMW5xcJa', 'W4rhvCodWO0', 'x8kzDSoYWQLOea', 'W6bpDSoZWRddGW', 'qmoQW6vxW64', 'WOxdICk2WPz9FLT/scTH', 'amkuf8o7W7xcOSomhdW8Dmo2W5ypA8kI', 'W7FdImkRWRS', 'qCopW68', 'W58KW4FdIIz0WOamBmkCd1enWPJdGgzSxW', 'DLxdQSoIW5W2WQVdK8okW6tdRa', 'W5jBCCo4', 'nKfHlhW', 'W5pdLbZcLSk7ytddU8kCpfi', 'W7BdK8kKWQy', 'WRJcRmkMy8kDWR0Lja', 'nw9sDSk7ECkOxrZdPergWP0', 'W51IprCj', 'WRPTWR4KpXG4WOPLWOxdOSo7WQBdKq', 'W4Lwuq', 'W6inhqZcNW', 'fmk0ucJdIqS', 'lmodWRPtWRa', 'kCobgmkaqSkzW5O', 'FSkwWOJcINJcGSkIfSkMWP7dRCknW7m', 'WOtdGSoZW74', 'W7OdbG', 'W4TfW7VcH8owWORcNSokid3dQHFcOSkVW6/dKGZcS8kHvmo0l0RcPCk9W7jBW4NdHfacW6jHjKBcTG8dWPeaW4LIW7mLkd8dW67dMSkkoXddSGJcJ3COWQNdVX5CDL0ChCknW4FcLSkT', 'mej/ahy', 'WRNcVCk4W5G', 'dSocmSkXDa', 'qZxcNvZcGCk0hCo0WPXeb8ol', 'zZhcN27cOSkZfCo+WR1VcmogW6HJgLi5zCkdh0VdRX00WRlcICoLC2dcKc0Aaq7dLIe', 'WRVcICkaj1hdONvDmXBdKmkrWQfQz23cUHJcLWNcSG', 'WQaQW5hdRI/dICoB', 'xCoJW7PJW4pcIMq', 'uLpdVmodW5q7WQq', 'WQvukqNcUuFdIYy', 'WRNcOmkxW5ZdSSkdaa', 'WQxdKmkUW5LnAKfYssb1WPe4heFcJ2LBWQddJfbZ', 'W58zhXJcNxRdPa8qbq', '4O2NtcimWPHzW6Wwav1xWPOVWPjJWPG', 'DmkqWO3cGNJcImoZkSk4WRNdVSk9', 'lCovjCo+W7JcGmoabYa9BG', 'h8k4ts8', 'cmkvkCkAr8k/W5ldI8keW6fL', 'W6HFyqGqWQRcVXpdMh7dQMm', 'FhDwwLq', 'aCoCrmo3WQWXvq', 'xrTwW4VcICkZ', 'W5VdLZzN', 'lv1+Bf5YW7C', 'WQaUW4pdHt3dLCo4W5NcIXT4W6FdNCoy', 'WRpdKCoQW6FcSK/dKmo7W6NcR8o3fSoCy8o8tSoF', 'WOtdImo0W4xcPW', 'WPZdMSkzi8kRoSk3hG', 'eSkDFdBdTW', 'WQdcQSkIW4BdQ8kbaq', 'WQK7W4RdNZS', 'zcRcGuqrWPDeWPj9WQFdJW', 'mhlcRwTLW50', 'DSoxWPZdMra', 'WPKSW4qjWRyBFSotcmobW5/cUSoktCoCifWhxszaWOOTW4ZcTmk7EqpdQ8oaW7ukeCohW47dNhFdSNCRbcSLCWpcPW', 'WPD7tvG8W4xdUmo1cmotBLiOW6BcHe3dQerRjZldLSkSW6mKhtBdML7cLq', 'iCobW5ddLdNdKG', 'lXBdNcyOec7cN8onW4CQ', 'qmkka8kJW7SHxmoWn2dcMW', 'emk9yZVdUXD8txJcOW', 'fCklnmoJW67cQmoddW', 'sCoEWQJdKZK', 'igNdRCk4kG', 'vclcJLFcTq', 'wCo3DXhdTLr6', 'WP7cHmkFpea', 'W6hcP8opW4GBoCkXBSkoWQ4', 'fv/dRmkB', 'W4lcRCoFW4uemSkDsSkAWRjIo3G', 'CexcLwRcVmoQWRZdT3lcGKxcU31GiGSruHVdIJW', 'lrBdGtWQ', 'WPy+W5H3WQib', 'W5ftW6LWoW', 'WOOMW5tdRIpdLCopW6RcIqrOW7VdNq', 'qh7cOKKqWQrA', 'WRq6W4bsWR8nW7eeWRnSr8ogW74O', 'WOhcH8ksa1a', 'wCoJW55dW5O', '8lc/RLWDemoKW59tWQjeWQNdPmofW5ddM8oKuCoYWQXDvL3cJdS8tSopaSoc', 'WRGsW7btWQW', 'os1hwKHRW68fW60ZbCkBW78kW4/cHYpcUeyfW6iVWPNcLq', 'WQmQW4K', 'bSond8kxsSkqW5JdPCkCW6bKW4/dRW', 'WPWYW5PKWRmB', 'qs9dpGX/W6W4qConW73cTmkDFgJcRJldJczGW7mkW64gWR3cLSoepdFcTa0jW7Ossde', 'WRL9WRiTpWiRWQ1GWRRdPmoQWRa', 'omkYvZldNGK/', 'W63dOSoX', 'w2Xauu9XW6e5W7K0aa', 'W7iDrr4a', 'W6tdImkJWQ8', 'W5ZdLCkTWQTlnmohn8k/cvybW5JcSmoUW5tcM0evpmoIWP47rH/cOCkSW6tcJ37cTKy', 'WORcICkEn13dPW', 'B8oDWRBdHHvsfCkuWPqgDgRcOHBdSCkNpW', 'WPddJmkkjSkSo8k2', 'oColW7JdMJxdN8o+', 'hSoyqmo4WQu', 'tc9fdY1+W6L8w8omW7BcJ8kDFtVcVtddNq', 'CXNcUhhcICkAuCoqWOjWjSo9W41E', 'W5y2zs4J', 'kx7cN3dcUa', 'fhXjySkNkSkpvIxdRK8', 'pmkjcmkauCkyWPldKmkEW6r0W48', 'kSkEdSoz', 'dCokhCkst8kxW5VcHmksW710W4xdVSoJfMhcRHBcPCoTWPVdIYhdN17dJSkaf8kuCb9vcCkogmoNkmocmqpcTCknlbxdG8k0n0pcVaiWdCooWR/cOW', 'hmowWQTeWRHwqgzUW6u8FSoTW65gW6y', 'W5VdKsPguLmu', 'kmo3BbxdQZ56WPTirGFcNSopDW', 'b2fGFSkVpmkP', 'W6n3WOjuW6CjEColoSkVW5NcOW', 'mCkYsctdIWT6WR1PyKJcGSkAi8kmWPjRW5LPWPmVW5C', 'B8oDWRBdHHvsfCkuWPqgDgRcOHBdQ8o0Aa7cKmo/oSkjytz6WPzHECkara', 'ymotWQhdMXGAb8obWOqkFw/cTbtcVSoRm03cSmojg8k8jZD5WPf9lCkactldVH/cQqHgBCkHWQ44W43dL8k/imoQaxtcVh4', 'W5KUW7JdLsP7WP8m', 'WOddGmkCySoM', 'WO3cMCkzpmkSomo/gCoSvtJdOq', 'pvlcIw7cRSkTWRq', 'q8oPW60', 'W71DdYy/W4/dPWdcSWJcH8oaW6tdUSk+W4bXW5ZdQb4pcSodfNvyW48yWRhcSCkrrXS', 'WQ5PWQqH', 'WP8RW6KVWRS', 'W5hdMZzKr1G', 'W7BcLmodW6C4', 'ySo9WQ3dM1pcGc4', 'WQRdK8knWP97EubYsHDJW4a', 'W5tdV8k0eG', 'W4BcOCopW4if', 'g1ddISkXdW', 'W7idaZZcM1FdRq', 'W5BdN8k+WQfn', 'jSond8kYtSkrW4RdISkf', 'b8kYrsxdUqC2WPTPtqBcJW', 'WRBcJCkhC0hdPNSjDq', 'C1qXi8o2', 'W5blCSo8WRNcGmoD', 'aCkLtsW', 'hKXWcNf7WQXrW5BdPrZcRYZdTHjRW5P2WQpcOmkIWOD+W7DizXFcPbf/h1DGW6BcGq', 'WQRcICkEofVdPhnDbGBdICkFWQG4EYxdQa', 'dCoOAtVdVqicqhNcQX18', 'uSoXWRNdK1VcJsZdVmkIsX9ypwZdLwNcIWrQmSkeW4tcOXmeWPz9WRPqymkxkSoho8oQ', 'thtcT0GBWQa', 'v8oiW4TxW6q', 'fSoxumopWQq/vq', 'waPDW4e', 'oCo6WOhcRsaHp3VdHmkFW6xdNca', 'WRWSW4mGWRnyEa', 'dNZcPgHJW57dJLBdUCoyAmkvExjPr1xcJSkpda', 'WQhcQSk/W5ldVSko', 'WR/cLsZcKmk8rs7dP8kmnGOFWOb1g8ocxCk9W5ldKIxdSmofjCkhWPjoWQ7dHCoAlJRcGarX', 'aSkmW7BcGG', 'rmoSW6GdWRy', 'lmohW4RdMJVdN8oromkhWOq', '4PMQ77IhW7adnWyRWQTSWPdcOCo2WRhdKfhcTSkyW7nisCkoW7JcS8kfWO3dH8oGW44b', 'Dgru', 'W5NILPNIL7FILRBcVbBcJbi2W7xcLq', 'kqJdNW', 'W4PiWR/cKCo1WOZcKSophJBdV1ZcVG', 'ig9wwmkLpCkOxsFdRW', 'W4iLW6JdItbXWOKA', 'BSovWQldLH9ue8oMWOyhCW', 'e8kCfCoqW70', 'yNaeDwldVq', 'hCknf8oaW7JcSZK/jLioig3dNCog', 'W6fBCmoIWOZcISovzG', 'ySo3WQRdHa', 'gmkYvZldNGK/', 'WPdcNmkei0e', 'WRddMCkykSk6oSk3cCkJFtZdVYhdPmksW5mjvwJcGCoqubH7bCooySkRW7eVWPn5WRdcTmkcW6eSdmo5WQpdSmoVW6v+W5md', 'WOHHWRqKpXG4WOXLWOxdPa', 'WO/cPSk1W5hdO8kia8o3C8oTWPFcI2ypy8kgWOCPWQ3dVmk9tGObWORdQwfOWOhdQhFdImogaCk1WRDrrSoG', 'WOVIHBlcQW', 'B2bkuuLT', 'qXTlW5ZcKSk1W4Wj', 'WQ3dLMVcQSk0urhdU8kT', 'xNqcuMRdRsBcVmk/ixS5WPpdIq', 'W6ZcOCovW4yzna', 'bCkfe8o2', 'WRldPmk2ymkaWRv7nCkuW43dNs4', 'WPNcOCk8FCkxWPnKCCojWPe'];
    a0_0x51a9 = function() {
        return _0x11b490;
    };
    return a0_0x51a9();
}

function jsonToCsv(_0x505f3a) {
    const _0x3b9857 = a0_0x5cae94;
    if (!_0x505f3a[_0x3b9857(0x33f, 'xvA&')]) return '';
    const _0x546b54 = Object[_0x3b9857(0x19b, 'Q1U1')](_0x505f3a[0x0]),
        _0x5779e4 = [_0x546b54['join'](',')];
    for (const _0x3ff933 of _0x505f3a) {
        const _0x5bddf2 = _0x546b54[_0x3b9857(0x240, 'E&Ei')](_0x4be2bc => _0x3ff933[_0x4be2bc] || '');
        _0x5779e4['push'](_0x5bddf2[_0x3b9857(0xfd, '4f2Z')](','));
    }
    return _0x5779e4[_0x3b9857(0x1bd, 'Q1U1')]('\x0a') + '\x0a';
}

function autoUpdateCsvForOrder(_0x3b5313, _0x12a041) {
    const _0x43a981 = a0_0x5cae94;
    if (!CONFIG['AUTO_UPDATE_CSV_BIDS']) return ![];
    const _0x5cbbdf = bidRows['find'](_0x25a7b0 => String(_0x25a7b0[_0x43a981(0x13a, '#Uph')])[_0x43a981(0x481, 'p[t5')](/^0+/, '') === String(_0x3b5313)[_0x43a981(0x1b7, 'EBzE')](/^0+/, ''));
    if (!_0x5cbbdf) return ![];
    const _0xb1bb33 = (_0x5cbbdf[_0x43a981(0x118, 'IngF')] || '')[_0x43a981(0x285, 'p[t5')](),
        _0x134c96 = (_0x5cbbdf[_0x43a981(0x19d, 'CMx8')] || '')[_0x43a981(0x49b, 'CkTj')]();
    let _0x23966e = ![];
    for (const _0x28b605 of csvData) {
        if ('MQOJQ' !== _0x43a981(0x3cb, 'iaaA')) {
            const _0x331a36 = (_0x28b605[_0x43a981(0x3d3, '!Cfi')] || '')[_0x43a981(0x285, 'p[t5')](),
                _0x2f9cea = (_0x28b605[_0x43a981(0x1e1, 'p[t5')] || '')['trim']();
            if (_0x331a36 === _0xb1bb33 && _0x2f9cea === _0x134c96) {
                if (_0x28b605[_0x43a981(0x29c, 'W6n7')](_0x43a981(0x20e, 'V&W2'))) _0x28b605[_0x43a981(0x2d2, 'EBzE')] = _0x12a041, _0x23966e = !![];
                else {
                    if (_0x28b605['hasOwnProperty'](_0x43a981(0x46d, 'BEh9'))) {
                        if ('vUJbB' !== _0x43a981(0x3af, 'wOt2')) _0x28b605[_0x43a981(0x37b, 'wOt2')] = _0x12a041, _0x23966e = !![];
                        else return '';
                    }
                }
            }
        } else _0x22ae61(_0x43a981(0x2a7, 'xvA&') + _0x14bc83[_0x43a981(0x400, 'GmQ^')]);
    }
    if (_0x23966e) {
        if (_0x43a981(0x2c9, 'Mje0') === 'boGeb') {
            const _0x95411d = path[_0x43a981(0x40a, 'Mje0')](CONFIG[_0x43a981(0x1f0, '7T&H')]);
            return fs[_0x43a981(0x1df, 'xvA&')](_0x95411d, jsonToCsv(csvData), _0x43a981(0xfb, '6G(F')), bidRows['forEach'](_0x24daa6 => {
                const _0x27e79b = _0x43a981;
                'bgqXT' !== _0x27e79b(0x170, 'xvA&') ? _0x33752e(_0x27e79b(0x131, 'EBzE') + _0x2a5162[_0x27e79b(0x233, '%7kh')](0x0, 0xc) + _0x27e79b(0x37e, '!Cfi')) : (_0x24daa6[_0x27e79b(0x3ee, 'd5Um')] || '')['trim']() === _0xb1bb33 && (_0x24daa6['Spi'] || '')[_0x27e79b(0x2ca, 'bC17')]() === _0x134c96 && (_0x24daa6[_0x27e79b(0x110, '^upB')] = Number(_0x12a041)[_0x27e79b(0x45e, 'Fnyv')](), _0x24daa6['AvgWtBidAmount'] = Number(_0x12a041)[_0x27e79b(0x17e, '^upB')]());
            }), logOk(_0x43a981(0x3c0, 'uwg!') + _0xb1bb33 + _0x43a981(0x3e8, '8CVd') + _0x134c96 + _0x43a981(0x33b, 'V&W2') + _0x12a041), !![];
        } else _0x3f1739('No\x20CSV\x20matches\x20found\x20for\x20current\x20slot.');
    }
    return ![];
}

function getCsvBatchKey(_0xcab28d) {
    const _0x290fe3 = a0_0x5cae94,
        _0x5d25a7 = _0xcab28d[_0x290fe3(0x20f, '6G(F')] ? _0xcab28d[_0x290fe3(0x176, 'rl6t')]['toString']()[_0x290fe3(0x39a, 'E&Ei')]() : '';
    if (_0x5d25a7) return _0x290fe3(0x455, 'BEh9') + _0x5d25a7;
    return 'ROW:' + [_0xcab28d['SapOrderId'] || '', _0xcab28d['Posnr'] || ''][_0x290fe3(0x396, '6VmM')](':');
}

function buildCsvBidGroups(_0x918d45, _0x1ecbbf, _0x3e8bfd) {
    const _0x314887 = a0_0x5cae94,
        _0x3399ef = [],
        _0x4c682e = {};
    return _0x3e8bfd[_0x314887(0x237, '!Cfi')](_0x1a6279 => {
        const _0x189a69 = _0x314887;
        if (_0x1ecbbf[_0x189a69(0x409, 'EBzE')]((_0x1a6279[_0x189a69(0x290, 'Kq2E')] || '')[_0x189a69(0x23d, 'o)HK')]())) return;
        const _0x175730 = (_0x1a6279[_0x189a69(0x416, 'iaaA')] || '')[_0x189a69(0x2f7, 'BEh9')](),
            _0x298e2a = (_0x1a6279[_0x189a69(0x1a5, 'vSeG')] || '')['trim'](),
            _0x5b2d0c = _0x918d45[_0x189a69(0x179, '8CVd')](_0x34b0d2 => (_0x34b0d2[_0x189a69(0x486, 'Q1U1')] || '') === _0x175730 && (_0x34b0d2['Special\x20Process\x20Indi'] || '') === _0x298e2a);
        if (!_0x5b2d0c[_0x189a69(0x42d, 'H3Oi')]) {
            if ('uqbDG' === _0x189a69(0x279, 'Q^^z')) try {
                const _0x24cbaf = _0x2ab04f[_0x189a69(0x470, 'Fnyv')](_0x50d298[_0x189a69(0x497, '6VmM')](_0x5743c7, 'utf-8'));
                _0x24cbaf[_0x189a69(0x421, 'uwg!')] && _0x24cbaf[_0x189a69(0x353, 'iaaA')] && (_0x6d2386 = _0x24cbaf);
            } catch (_0x2acc24) {} else return;
        }
        const _0x32581f = getCsvBatchKey(_0x1a6279);
        !_0x4c682e[_0x32581f] && (_0x4c682e[_0x32581f] = {
            'key': _0x32581f,
            'rows': []
        }, _0x3399ef['push'](_0x4c682e[_0x32581f])), _0x4c682e[_0x32581f]['rows']['push']({
            'item': _0x1a6279,
            'bidAmount': Number(_0x5b2d0c[0x0][_0x189a69(0x171, '@!o[')] || _0x5b2d0c[0x0]['BIDING\x20AMOUNT'] || 0x0)[_0x189a69(0x3a8, 'GmQ^')]()
        });
    }), _0x3399ef;
}

function resetCsvBatchState() {
    const _0x8de717 = a0_0x5cae94;
    plantConf && plantConf[_0x8de717(0x37c, 'rl6t')] && plantConf[_0x8de717(0x1b4, 'wpSZ')] !== currentSlotNumber && (currentSlotNumber !== null && logInfo(_0x8de717(0x338, 'o)HK') + plantConf['SlotNumber'] + _0x8de717(0x1e0, '6VmM')), currentSlotNumber = plantConf[_0x8de717(0x181, 'iaaA')], csvBatchState && (csvBatchState[_0x8de717(0x49d, 'pLhn')] = {})), csvBatchState = {
        'submittedKeys': csvBatchState && csvBatchState[_0x8de717(0x3c3, 'IngF')] || {},
        'activeKeys': [],
        'pendingBatches': [],
        'groupsByKey': {},
        'autoRunning': ![],
        'completed': ![]
    };
}

function prepareCsvBatches(_0x1ae1fb) {
    const _0x2d0abc = a0_0x5cae94,
        _0x3e490c = [],
        _0x3a87e7 = csvBatchState[_0x2d0abc(0x2c5, 'E&Ei')] || {};
    csvBatchState[_0x2d0abc(0x2a9, 'riSU')] = {}, csvBatchState[_0x2d0abc(0x307, '&PzW')] = [], csvBatchState['pendingBatches'] = [], _0x1ae1fb[_0x2d0abc(0x397, '#Uph')](_0x3b70ae => {
        const _0x2d94a6 = _0x2d0abc;
        csvBatchState[_0x2d94a6(0x236, '^upB')][_0x3b70ae[_0x2d94a6(0x2c1, 'W6n7')]] = _0x3b70ae, !_0x3a87e7[_0x3b70ae[_0x2d94a6(0x335, '!umK')]] && _0x3e490c[_0x2d94a6(0x13f, 'Q1U1')](_0x3b70ae[_0x2d94a6(0x448, 'pLhn')]);
    });
    const _0x4d3a58 = CONFIG[_0x2d0abc(0x186, '%7kh')] || 0x3;
    let _0xfaf359 = [],
        _0x4814e4 = 0x0;
    for (let _0x20fd76 = 0x0; _0x20fd76 < _0x3e490c[_0x2d0abc(0x10d, 'BEh9')]; _0x20fd76++) {
        const _0x35f3c2 = _0x3e490c[_0x20fd76],
            _0x11f433 = csvBatchState[_0x2d0abc(0x2d5, 'H3Oi')][_0x35f3c2],
            _0x3e5166 = _0x11f433 ? _0x11f433['rows'][_0x2d0abc(0x105, '@!o[')] : 0x1;
        _0xfaf359[_0x2d0abc(0x265, 'EBzE')] > 0x0 && _0x4814e4 + _0x3e5166 > _0x4d3a58 && (csvBatchState[_0x2d0abc(0x379, 'vSeG')][_0x2d0abc(0x1b9, 'iaaA')](_0xfaf359), _0xfaf359 = [], _0x4814e4 = 0x0), _0xfaf359['push'](_0x35f3c2), _0x4814e4 += _0x3e5166;
    }
    if (_0xfaf359[_0x2d0abc(0x2a8, '&PzW')] > 0x0) {
        if (_0x2d0abc(0x1dd, '#Uph') !== _0x2d0abc(0x12b, 'riSU')) return _0x45b76b['response'] ? _0x22f2db(_0x2d0abc(0x288, 'EBzE') + _0x503cd7[_0x2d0abc(0x1fd, 'V&W2')][_0x2d0abc(0x494, 'wOt2')]) : _0x131b09(_0x2d0abc(0x123, 'GmQ^') + _0x20b8cc[_0x2d0abc(0x225, 'uwg!')]), ![];
        else csvBatchState[_0x2d0abc(0x244, 'uwg!')][_0x2d0abc(0x273, 'Em3N')](_0xfaf359);
    }
    csvBatchState[_0x2d0abc(0x14d, 'BEh9')] = _0x3e490c['length'] === 0x0;
}

function applyNextCsvBatch() {
    const _0x1313c3 = a0_0x5cae94;
    if (!csvBatchState[_0x1313c3(0x47b, 'PV9Q')][_0x1313c3(0x31f, 'wOt2')]) return _0x1313c3(0x1af, 'E&Ei') !== _0x1313c3(0x18c, 'p[t5') ? (csvBatchState['activeKeys'] = [], csvBatchState[_0x1313c3(0x37d, '!umK')] = !![], ![]) : new _0x30c692(_0x87f846 => _0x4f78c3(_0x87f846, _0x22ea5a));
    return csvBatchState[_0x1313c3(0x374, 'uwg!')] = csvBatchState[_0x1313c3(0x482, 'xcPi')][_0x1313c3(0x474, 'vSeG')](), bidRows['forEach'](_0x2d7036 => {
        const _0x1e03b0 = _0x1313c3;
        if ('UaAhU' === _0x1e03b0(0x1e5, '6HMp')) {
            const _0x3e6476 = _0x1d1567(_0xda5329);
            if (_0x3e6476 === null) return null;
            const _0x58d9e1 = _0x22285a(_0x28bbff);
            return _0x3e6476 + _0x58d9e1;
        } else _0x2d7036[_0x1e03b0(0x107, '4f2Z')] = 0x0, _0x2d7036[_0x1e03b0(0x13e, 'PV9Q')] = 0x0;
    }), csvBatchState['activeKeys'][_0x1313c3(0x25c, 'H3Oi')](_0x2fc33e => {
        const _0x363847 = _0x1313c3;
        if ('hrKzE' !== 'hrKzE') _0x4c137b = _0x252c07[_0x363847(0x187, 'JpRo')]['headers'][_0x363847(0x2e3, '^Hgn')];
        else {
            const _0x35cb04 = csvBatchState[_0x363847(0x195, 'W6n7')][_0x2fc33e];
            if (!_0x35cb04) return;
            _0x35cb04[_0x363847(0x464, 'vSeG')][_0x363847(0x21a, '%7kh')](_0x3e8d73 => {
                const _0x112923 = _0x363847;
                if (_0x112923(0x13b, 'xvA&') !== _0x112923(0x25b, 'CkTj')) _0x3e8d73['item'][_0x112923(0x2b4, 'wOt2')] = _0x3e8d73[_0x112923(0x2f2, '839y')], _0x3e8d73[_0x112923(0x2ff, 'IngF')]['AvgWtBidAmount'] = _0x3e8d73[_0x112923(0x122, 'rl6t')];
                else {
                    let _0x5eab21 = 0x0;
                    _0x108f9b[_0x112923(0x1f1, '!umK')]('\x0a' + '═' [_0x112923(0x175, 'EjAy')](0x32)), _0x530680[_0x112923(0x408, 'Em3N')]('' + _0x15b152['bright'] + _0x4bd876['cyan'] + _0x112923(0x38c, 'pLhn') + _0x3f73f9[_0x112923(0x38b, 'vSeG')]), _0x5bd457[_0x112923(0x3ad, 'UwMq')]('═' [_0x112923(0x311, 'iaaA')](0x32)), _0x5d8068[_0x112923(0x301, 'xcPi')](_0x11ddc8 => {
                        const _0x5d36a1 = _0x112923,
                            _0x30d48d = _0x55e0e5(_0x11ddc8['BiddingRank'] || '')[_0x5d36a1(0x1fa, '@!o[')]()[_0x5d36a1(0x2eb, '7T&H')](/^0+/, ''),
                            _0x5029c9 = _0x30d48d === '1' || _0x1e2497(_0x11ddc8['BiddingRank']) === 0x1;
                        _0x5029c9 ? (_0x5eab21++, _0x3a21db(_0x5d36a1(0x24f, 'iaaA') + _0x11ddc8['DestCityDesc'] + _0x5d36a1(0x2b0, 'BEh9') + _0x11ddc8['Spi'] + _0x5d36a1(0x44c, 'JpRo') + _0x11ddc8['BiddingAmount'])) : _0x1fa76e('📉\x20Rank\x20' + (_0x30d48d || _0x11ddc8[_0x5d36a1(0x2c8, '!7at')] || '?') + _0x5d36a1(0x221, 'CkTj') + _0x11ddc8[_0x5d36a1(0x1c7, '4f2Z')] + _0x5d36a1(0x46a, 'rl6t') + _0x11ddc8[_0x5d36a1(0x3d9, '!7at')] + ',\x20Bid:\x20' + _0x11ddc8[_0x5d36a1(0x3fa, 'Em3N')] + _0x5d36a1(0xf8, 'EjAy') + _0x11ddc8['L1BidAmount'] + ')');
                    }), _0x42ba14(_0x112923(0x24a, 'EBzE') + _0x5eab21 + _0x112923(0x22b, '6VmM') + _0x39ac08[_0x112923(0x328, '7T&H')] + _0x112923(0x461, 'JpRo')), _0x1559f4[_0x112923(0x435, 'PV9Q')]('═' [_0x112923(0x18a, 'Mje0')](0x32) + '\x0a'), _0x110991(_0x3995c5);
                }
            });
        }
    }), !![];
}

function markActiveCsvBatchSubmitted() {
    const _0x5340ef = a0_0x5cae94;
    csvBatchState['activeKeys'][_0x5340ef(0x261, '7T&H')](_0x22511c => {
        const _0x19be6e = _0x5340ef;
        csvBatchState[_0x19be6e(0x1ba, '7T&H')][_0x22511c] = !![];
    }), csvBatchState[_0x5340ef(0x404, 'CMx8')] = [];
}

function hasActiveCsvBatch() {
    const _0x4137db = a0_0x5cae94;
    return csvBatchState[_0x4137db(0x442, 'Q^^z')] && csvBatchState[_0x4137db(0x442, 'Q^^z')][_0x4137db(0x258, 'xcPi')] > 0x0;
}

function isActiveCsvBatchRow(_0x2de125) {
    const _0x2548d6 = a0_0x5cae94;
    if (!hasActiveCsvBatch()) return ![];
    return csvBatchState[_0x2548d6(0x130, '!umK')]['includes'](getCsvBatchKey(_0x2de125));
}

function applyCsvDataToOrders() {
    const _0x39e201 = a0_0x5cae94,
        _0x223d85 = buildCsvBidGroups(csvData, deleteList, bidRows);
    resetCsvBatchState(), prepareCsvBatches(_0x223d85);
    const _0x12bf63 = _0x223d85['length'],
        _0x3aee70 = csvBatchState[_0x39e201(0x36e, 'p[t5')][_0x39e201(0x2e9, 'EjAy')],
        _0x398f9e = _0x223d85['reduce']((_0x28e07e, _0x4f8a61) => _0x28e07e + _0x4f8a61['rows']['length'], 0x0);
    return logOk(_0x39e201(0x1db, 'pLhn') + _0x398f9e + _0x39e201(0x2b5, 'CkTj') + _0x12bf63 + _0x39e201(0x1de, 'rl6t')), logInfo(_0x39e201(0x1bc, 'E&Ei') + CONFIG['CSV_BATCH_SIZE'] + ',\x20Total\x20batches:\x20' + _0x3aee70), _0x12bf63 === 0x0 && logWarn(_0x39e201(0x1cf, '!umK')), applyNextCsvBatch() && logOk(_0x39e201(0x38d, 'EBzE') + csvBatchState[_0x39e201(0x254, 'Fnyv')]['length'] + _0x39e201(0x463, 'V&W2')), _0x12bf63 > 0x0;
}

function parseSapDate(_0x684a5a) {
    const _0x1798bc = a0_0x5cae94;
    if (!_0x684a5a) return null;
    const _0x2984a5 = _0x684a5a[_0x1798bc(0x1e3, 'Q1U1')](/\/Date\((\d+)\)\//);
    if (_0x2984a5) return parseInt(_0x2984a5[0x1], 0xa);
    return null;
}

function parseSapTime(_0xdde31b) {
    const _0xab7a98 = a0_0x5cae94;
    if (!_0xdde31b) return 0x0;
    const _0x34b8a1 = _0xdde31b[_0xab7a98(0x2d0, 'V&W2')](/PT(\d+)H(\d+)M(\d+)S/);
    if (_0x34b8a1) {
        if (_0xab7a98(0x228, 'E&Ei') !== _0xab7a98(0x2ea, 'wOt2')) return (parseInt(_0x34b8a1[0x1]) * 0xe10 + parseInt(_0x34b8a1[0x2]) * 0x3c + parseInt(_0x34b8a1[0x3])) * 0x3e8;
        else {
            _0x435057(_0xab7a98(0x45d, 'EjAy'));
            return;
        }
    }
    return 0x0;
}

function convUtcToLocal(_0x486d0d, _0x27b60b) {
    const _0x9f2e8d = parseSapDate(_0x486d0d);
    if (_0x9f2e8d === null) return null;
    const _0x57d11e = parseSapTime(_0x27b60b);
    return _0x9f2e8d + _0x57d11e;
}

function formatCountdown(_0x50379e) {
    const _0x4a0599 = a0_0x5cae94;
    if (_0x50379e < 0x0) _0x50379e = 0x0;
    const _0x37cee9 = Math['floor'](_0x50379e / 0x36ee80),
        _0x32c58c = Math[_0x4a0599(0x2b1, 'PV9Q')](_0x50379e % 0x36ee80 / 0xea60),
        _0x1f14a0 = Math[_0x4a0599(0x33a, 'Q^^z')](_0x50379e % 0xea60 / 0x3e8),
        _0x10d88c = _0x50379e % 0x3e8;
    return String(_0x37cee9)[_0x4a0599(0x15b, 'EjAy')](0x2, '0') + ':' + String(_0x32c58c)[_0x4a0599(0x35b, 'Em3N')](0x2, '0') + ':' + String(_0x1f14a0)[_0x4a0599(0x48a, 'p[t5')](0x2, '0') + '.' + String(_0x10d88c)[_0x4a0599(0x49e, 'riSU')](0x3, '0');
}
let captchaCacheMap = {},
    captchaCreds = {
        'userid': process.env.TRUECAPTCHA_USERID || a0_0x5cae94(0x3e7, 'PV9Q'),
        'apikey': process.env.TRUECAPTCHA_APIKEY || a0_0x5cae94(0xfc, '!umK')
    };

function initEmbeddedCaptchaSolver() {
    const _0x112e17 = a0_0x5cae94,
        _0x55b4b5 = path[_0x112e17(0x200, 'H3Oi')](__dirname, _0x112e17(0x40b, '@!o[')),
        _0x1e1c95 = path['resolve'](__dirname, _0x112e17(0x182, 'Q1U1'));
    if (fs[_0x112e17(0x242, 'rl6t')](_0x1e1c95)) try {
        if (_0x112e17(0x49a, 'Q^^z') === _0x112e17(0x101, '#Uph')) {
            const _0x388d30 = (_0x16a0aa[_0x112e17(0x33d, 'JpRo')] || _0x2b7831[_0x112e17(0x348, 'Q^^z')] || '')[_0x112e17(0x41c, 'PV9Q')](/#/g, '\x0a')[_0x112e17(0x28b, '%7kh')](/0/g, '')[_0x112e17(0x2d7, '6VmM')]();
            return _0xd6469d(_0x112e17(0x248, 'rl6t') + _0x3fc135 + _0x112e17(0x100, '4f2Z') + _0x388d30 + '\x22'), {
                'type': 'E',
                'message': _0x388d30
            };
        } else {
            const _0xd371d4 = JSON[_0x112e17(0x243, 'CMx8')](fs[_0x112e17(0x1e6, '@!o[')](_0x1e1c95, _0x112e17(0x263, 'bC17')));
            _0xd371d4['userid'] && _0xd371d4[_0x112e17(0x493, 'Em3N')] && ('aqnMn' === _0x112e17(0x2bc, 'PV9Q') ? _0x2d8245 = {
                'status': _0x1c1beb
            } : captchaCreds = _0xd371d4);
        }
    } catch (_0x35ae89) {}
    if (fs['existsSync'](_0x55b4b5)) try {
        if (_0x112e17(0x423, 'EjAy') === _0x112e17(0x286, '839y')) return _0x3b6388(_0x112e17(0x29d, '!Cfi') + _0x5d4bcc + '\x22'), _0xcdc164;
        else {
            const _0x45663e = JSON[_0x112e17(0x35c, 'V&W2')](fs[_0x112e17(0x439, '8CVd')](_0x55b4b5, _0x112e17(0x43f, 'JpRo')));
            let _0x52d89a = 0x0;
            _0x45663e[_0x112e17(0x28c, '6HMp')](({
                hash: _0x5be19f,
                result: _0xbad1db
            }) => {
                const _0x5618d7 = _0x112e17;
                _0x5be19f && _0xbad1db && (_0x5618d7(0x3b6, 'xvA&') !== _0x5618d7(0x359, 'W6n7') ? (captchaCacheMap[_0x5be19f] = _0xbad1db, _0x52d89a++) : (_0xdf6dc[_0x5618d7(0x3f6, 'o)HK')][_0x5618d7(0x438, 'pLhn')](_0x48283e), _0x2e9e6d = [], _0xbd8401 = 0x0));
            }), logOk(_0x112e17(0x429, '^upB') + _0x52d89a + _0x112e17(0x103, 'Em3N'));
        }
    } catch (_0x5a80ac) {
        'WClOd' !== _0x112e17(0x310, 'Q1U1') ? logWarn(_0x112e17(0x2a6, 'xcPi')) : _0x3d6218 && _0x8650db && (_0x2ab490[_0x2bd099] = _0x2ea5d6, _0x143718++);
    } else {
        if ('TsakK' !== _0x112e17(0x214, '@!o[')) {
            const _0x27165e = _0x2bff8b[_0x4e78ef],
                _0x26e192 = _0x40d9cf['groupsByKey'][_0x27165e],
                _0x2f5843 = _0x26e192 ? _0x26e192[_0x112e17(0x314, '7T&H')][_0x112e17(0x125, 'iaaA')] : 0x1;
            _0x969e6[_0x112e17(0x303, 'p[t5')] > 0x0 && _0x1d7209 + _0x2f5843 > _0x2ee552 && (_0x1af816[_0x112e17(0x379, 'vSeG')][_0x112e17(0x1b5, 'Kq2E')](_0x401983), _0xd5711b = [], _0x424511 = 0x0), _0x364f4c[_0x112e17(0x343, 'o)HK')](_0x27165e), _0x118c84 += _0x2f5843;
        } else logInfo(_0x112e17(0x317, '^Hgn'));
    }
}

function checkLocalCaptchaCache(_0x30c2a2) {
    return new Promise(_0x4c47a6 => {
        const _0x1e382f = a0_0x5ca0;
        if (captchaCacheMap[_0x30c2a2]) {
            if ('txnVv' !== _0x1e382f(0x29e, '!Cfi')) _0x164a41(_0x5de95f[_0x18c46c]);
            else {
                const _0x1b589d = new Date(_0x1e382f(0x475, 'vSeG')),
                    _0x900f08 = new Date();
                if (_0x900f08 >= _0x1b589d) {
                    const _0x437b83 = Math[_0x1e382f(0x2a4, 'rl6t')]();
                    _0x437b83 < 0.4 ? _0x1e382f(0x340, '6G(F') !== _0x1e382f(0x1bf, 'riSU') ? (_0x5d3c19[_0x1e382f(0x17f, 'E&Ei')] = _0x303d8c, _0x3f78e7 = !![]) : _0x4c47a6(_0x1e382f(0x136, 'UwMq')) : _0x4c47a6(captchaCacheMap[_0x30c2a2]);
                } else _0x1e382f(0x487, 'CkTj') === _0x1e382f(0x4a5, 'Q^^z') ? (_0x4b7be5[_0x2bfc92] = {
                    'key': _0x4701b0,
                    'rows': []
                }, _0x269b38[_0x1e382f(0x144, 'xvA&')](_0x37235d[_0x5bcb9c])) : _0x4c47a6(captchaCacheMap[_0x30c2a2]);
            }
        }
    });
}
async function getCaptchaFromApi(_0x13ca67, _0x130585) {
    const _0x20e07b = a0_0x5cae94;
    try {
        if (_0x20e07b(0xfa, 'uwg!') === _0x20e07b(0x210, 'rl6t')) _0x511a33('Login\x20successful.\x20CSRF\x20token\x20obtained\x20of\x20length:\x20' + _0x44bb42[_0x20e07b(0x299, 'IngF')] + _0x20e07b(0x431, 'bC17'));
        else {
            const _0x196ad1 = await axios[_0x20e07b(0x1c3, '6G(F')](_0x20e07b(0x201, 'pLhn'), {
                    'userid': captchaCreds[_0x20e07b(0x147, 'EjAy')],
                    'apikey': captchaCreds[_0x20e07b(0x3c6, 'riSU')],
                    'data': _0x13ca67
                }, {
                    'timeout': 0x2710
                }),
                _0x357afc = _0x196ad1['data'] && _0x196ad1[_0x20e07b(0x1eb, 'wpSZ')][_0x20e07b(0x46e, 'H3Oi')];
            if (_0x357afc) {
                if ('mpHBq' === _0x20e07b(0x383, 'W6n7')) return captchaCacheMap[_0x130585] = _0x357afc, _0x357afc;
                else _0x3af604(_0x20e07b(0x300, 'CMx8') + _0x24b3b3['message']);
            }
            return _0x20e07b(0x357, 'rl6t');
        }
    } catch (_0x2a732b) {
        return 'lqVFU' === _0x20e07b(0x250, '!umK') ? _0x20e07b(0x39b, '%7kh') : (_0x26c52f('CSV\x20file\x20not\x20found:\x20' + _0x22d4f0), ![]);
    }
}
async function fetchCaptcha(_0x386813 = ![]) {
    const _0x599782 = a0_0x5cae94;
    try {
        const _0x4117aa = plantConf['Plant'],
            _0x1436d3 = _0x599782(0x3c8, '^Hgn') + CONFIG[_0x599782(0x45b, 'Q1U1')] + _0x599782(0x162, '8CVd') + _0x4117aa + '\x27)',
            _0x534395 = await client['get'](_0x1436d3, {
                'headers': {
                    'X-Csrf-Token': csrfToken
                }
            }),
            _0x576584 = _0x534395['data']['d'][_0x599782(0x358, '8CVd')];
        if (_0x576584) {
            if (!_0x386813) logOk(_0x599782(0x398, 'IngF') + _0x576584['length'] + _0x599782(0x3ed, 'pLhn'));
            return _0x576584;
        }
        return null;
    } catch (_0x5cd3bd) {
        if (!_0x386813) logErr(_0x599782(0x289, 'PV9Q') + _0x5cd3bd[_0x599782(0x484, '8CVd')]);
        return null;
    }
}
async function solveCaptcha(_0x4727d8) {
    const _0xbdbf2d = a0_0x5cae94;
    try {
        const _0x1d9994 = _0x4727d8['replace'](/^data:image\/(png|jpg|jpeg|gif);base64,/, ''),
            _0x587a74 = crypto[_0xbdbf2d(0x3ca, 'Q^^z')](_0xbdbf2d(0x247, '6HMp'))['update'](_0x1d9994)[_0xbdbf2d(0x173, '7T&H')]('hex'),
            _0x2b4452 = await Promise[_0xbdbf2d(0x3be, 'EBzE')]([getCaptchaFromApi(_0x1d9994, _0x587a74), checkLocalCaptchaCache(_0x587a74)]);
        if (_0x2b4452 === _0xbdbf2d(0x365, 'GmQ^')) return logWarn('Captcha\x20solver\x20returned\x20\x22Redo\x22\x20—\x20retrying...'), null;
        if (_0x2b4452) {
            if (_0xbdbf2d(0x2d4, 'CkTj') !== 'yIemw') _0x9febde(_0xbdbf2d(0x344, 'H3Oi')), _0x1993a2(), _0x38b1b2() ? _0x53d7ef(_0xbdbf2d(0x4a7, 'xcPi')) : (_0x50b1d1(_0xbdbf2d(0x152, '%7kh')), _0x3f1d39[_0xbdbf2d(0x352, '6G(F')] = !![]);
            else return logOk(_0xbdbf2d(0x2cd, '6G(F') + _0x2b4452 + '\x22'), _0x2b4452;
        }
        return logWarn(_0xbdbf2d(0x2c4, 'pLhn')), null;
    } catch (_0x3463a0) {
        if (_0xbdbf2d(0x253, 'EBzE') === 'RrDqi') return logErr(_0xbdbf2d(0x1d8, 'PV9Q') + _0x3463a0[_0xbdbf2d(0x183, 'iaaA')]), null;
        else {
            const _0x5a2b36 = [],
                _0x1f5088 = {};
            return _0x1ec762[_0xbdbf2d(0x403, '6VmM')](_0x5ac65c => {
                const _0x2f73d9 = _0xbdbf2d;
                if (_0xda9695[_0x2f73d9(0x16d, '6G(F')]((_0x5ac65c[_0x2f73d9(0x3df, '8CVd')] || '')[_0x2f73d9(0x14b, 'EjAy')]())) return;
                const _0x579bd8 = (_0x5ac65c['DestCityDesc'] || '')[_0x2f73d9(0x329, 'Q1U1')](),
                    _0x6a20e5 = (_0x5ac65c[_0x2f73d9(0x363, '^Hgn')] || '')[_0x2f73d9(0x433, '7T&H')](),
                    _0x45b87a = _0x191f64[_0x2f73d9(0x2c3, 'Fnyv')](_0x1f3fd2 => (_0x1f3fd2[_0x2f73d9(0x241, '!7at')] || '') === _0x579bd8 && (_0x1f3fd2['Special\x20Process\x20Indi'] || '') === _0x6a20e5);
                if (!_0x45b87a[_0x2f73d9(0x22f, 'Q^^z')]) return;
                const _0x1bc319 = _0x148bd1(_0x5ac65c);
                !_0x1f5088[_0x1bc319] && (_0x1f5088[_0x1bc319] = {
                    'key': _0x1bc319,
                    'rows': []
                }, _0x5a2b36[_0x2f73d9(0x3d7, '!7at')](_0x1f5088[_0x1bc319])), _0x1f5088[_0x1bc319]['rows']['push']({
                    'item': _0x5ac65c,
                    'bidAmount': _0x381c88(_0x45b87a[0x0]['BIDING\x20AMMOUNT'] || _0x45b87a[0x0][_0x2f73d9(0x255, '^Hgn')] || 0x0)[_0x2f73d9(0x3e1, 'riSU')]()
                });
            }), _0x5a2b36;
        }
    }
}
async function fetchAndSolveCaptcha(_0x540120 = 0xa) {
    const _0x45945d = a0_0x5cae94;
    for (let _0x348511 = 0x1; _0x348511 <= _0x540120; _0x348511++) {
        if (_0x45945d(0x3dc, 'PV9Q') === 'tNDVd') {
            log(_0x45945d(0x2d9, 'JpRo') + _0x348511 + '/' + _0x540120 + _0x45945d(0x22c, 'xcPi'));
            const _0x310841 = await fetchCaptcha();
            if (!_0x310841) {
                logWarn(_0x45945d(0x36a, '6G(F')), await sleep(0x32);
                continue;
            }
            const _0x299ced = await solveCaptcha(_0x310841);
            if (_0x299ced) return _0x299ced;
            await sleep(0x32);
        } else return _0x5b6dc4(_0x45945d(0x19a, 'IngF')), {
            'type': 'N',
            'message': 'No\x20changes'
        };
    }
    return logErr('Failed\x20to\x20solve\x20captcha\x20after\x20' + _0x540120 + _0x45945d(0x1a9, '^Hgn')), null;
}
async function fastPollCaptcha(_0x2e73ef = 0x32, _0x31f9bc = 0x3a98) {
    const _0x11eb03 = a0_0x5cae94,
        _0x430ea3 = Date[_0x11eb03(0x32e, 'Q^^z')]();
    while (Date[_0x11eb03(0x12d, 'EBzE')]() - _0x430ea3 < _0x31f9bc) {
        if (_0x11eb03(0x411, 'E&Ei') === _0x11eb03(0x3d5, 'bC17')) {
            const _0x30718f = await fetchCaptcha();
            if (_0x30718f) {
                const _0x32b1c9 = await solveCaptcha(_0x30718f);
                if (_0x32b1c9) return _0x32b1c9;
            }
            await sleep(_0x2e73ef);
        } else _0x2c7a82[_0x11eb03(0x157, 'uwg!')] = {};
    }
    return null;
}

function buildSavePayloadByStrategy(_0x110276, _0x4374d5) {
    const _0x5ba9bb = a0_0x5cae94,
        _0x38174a = {
            'Flag': '1',
            'Ev_Text': '',
            'NavEBiddingTrackHis': [],
            'NavEBiddingMessage': {},
            'IvCaptchaValue': _0x110276
        };
    for (let _0x1ae727 = 0x0; _0x1ae727 < bidRows[_0x5ba9bb(0x2b7, 'Fnyv')]; _0x1ae727++) {
        const _0x269816 = bidRows[_0x1ae727];
        if (_0x4374d5 === _0x5ba9bb(0x18b, 'PV9Q')) {
            if (!isActiveCsvBatchRow(_0x269816)) continue;
        } else {
            if (_0x4374d5 === _0x5ba9bb(0x46f, '@!o[')) {
                if (_0x5ba9bb(0x112, 'bC17') === _0x5ba9bb(0x473, 'iaaA')) {
                    const _0x2fe8d8 = csvBatchState[_0x5ba9bb(0x374, 'uwg!')][0x0];
                    if (_0x2fe8d8 && getCsvBatchKey(_0x269816) !== _0x2fe8d8) continue;
                } else _0x22f8f5 !== null && _0x4a3c5a('New\x20slot\x20' + _0x948b07[_0x5ba9bb(0x36b, 'JpRo')] + _0x5ba9bb(0x3d0, 'Em3N')), _0x4be00f = _0x4d31d4[_0x5ba9bb(0x181, 'iaaA')], _0x3abe9c && (_0x4adfb5['submittedKeys'] = {});
            }
        }
        _0x38174a[_0x5ba9bb(0x160, 'bC17')]['push']({
            'Mandt': '',
            'SapOrderId': _0x269816[_0x5ba9bb(0x3d1, 'bC17')],
            'Vendor': CONFIG[_0x5ba9bb(0x120, 'JpRo')],
            'ChangeNo': '',
            'ShipFromWerks': _0x269816[_0x5ba9bb(0x441, '^Hgn')],
            'BiddingDate': plantConf['BiddingDate'],
            'SlotNumber': plantConf['SlotNumber'],
            'Freight': (_0x269816[_0x5ba9bb(0x232, '839y')] || 0x0) + _0x5ba9bb(0x305, '6G(F'),
            'ClubId': _0x269816[_0x5ba9bb(0x380, 'CkTj')] || '',
            'ClubFreight': (_0x269816['Freight'] || 0x0) + '.000',
            'BiddingAmount': (_0x269816[_0x5ba9bb(0x17d, 'wpSZ')] || 0x0) + '.000',
            'BiddingRank': _0x269816[_0x5ba9bb(0x1d3, 'BEh9')],
            'AvgWtBidAmount': (_0x269816[_0x5ba9bb(0x426, 'riSU')] || 0x0) + _0x5ba9bb(0x208, 'Fnyv'),
            'CreatedOn': null,
            'CreatedAt': null
        });
    }
    return _0x38174a;
}
async function submitBidsSingleStrategy(_0x15a8fa, _0x53bdb1) {
    const _0x482a7a = a0_0x5cae94,
        _0xd0321f = buildSavePayloadByStrategy(_0x15a8fa, _0x53bdb1);
    logInfo(_0x482a7a(0x3ea, 'Kq2E') + _0x53bdb1 + _0x482a7a(0x47d, '6HMp') + _0xd0321f['NavEBiddingTrackHis']['length'] + _0x482a7a(0x3d8, 'o)HK'));
    if (CONFIG[_0x482a7a(0x109, '6VmM')]) return _0x482a7a(0x196, 'uwg!') === _0x482a7a(0x2bd, '%7kh') ? (logWarn(_0x482a7a(0x22d, 'W6n7')), {
        'type': 'S',
        'message': _0x482a7a(0x10f, 'pLhn')
    }) : (_0x53b6a7(_0x482a7a(0x3b5, 'BEh9') + _0x183dc3[_0x482a7a(0x2e4, 'CkTj')]), null);
    try {
        const _0x1933fb = await client[_0x482a7a(0x1d2, 'd5Um')](_0x482a7a(0x3a7, 'Kq2E'), _0xd0321f, {
                'headers': {
                    'X-Csrf-Token': csrfToken
                }
            }),
            _0x5e43ee = _0x1933fb[_0x482a7a(0x10e, 'CkTj')] && _0x1933fb[_0x482a7a(0x3e4, '&PzW')]['d'] ? _0x1933fb[_0x482a7a(0x346, '^Hgn')]['d'] : {},
            _0xd95847 = _0x5e43ee[_0x482a7a(0x2d1, 'pLhn')] || {};
        if (_0xd95847[_0x482a7a(0x3de, 'W6n7')] === 'S') return logOk('✅\x20Submission\x20SUCCESS\x20with\x20strategy\x20[' + _0x53bdb1 + _0x482a7a(0x27b, 'Kq2E') + (_0xd95847['Message'] || '')[_0x482a7a(0x2f6, 'Em3N')](/0/g, '')[_0x482a7a(0x2ed, '#Uph')]()), {
            'type': 'S',
            'message': _0xd95847[_0x482a7a(0x2c6, 'BEh9')]
        };
        else {
            if (_0xd95847['Type'] === 'E') {
                if (_0x482a7a(0x1dc, 'uwg!') === 'MCxuw') {
                    const _0x1aaad4 = (_0x5e43ee[_0x482a7a(0x224, '!Cfi')] || _0xd95847[_0x482a7a(0x1fb, 'xvA&')] || '')['replace'](/#/g, '\x0a')['replace'](/0/g, '')[_0x482a7a(0x49f, 'pLhn')]();
                    return logWarn(_0x482a7a(0x219, 'Fnyv') + _0x53bdb1 + ']\x20returned\x20SAP\x20Error:\x20\x22' + _0x1aaad4 + '\x22'), {
                        'type': 'E',
                        'message': _0x1aaad4
                    };
                } else _0x1bfc10['mkdirSync'](_0x566d7c, {
                    'recursive': !![]
                });
            } else {
                if (_0xd95847[_0x482a7a(0x480, '6VmM')] === 'I') {
                    const _0x2b355c = (_0xd95847[_0x482a7a(0x18d, 'iaaA')] || '')[_0x482a7a(0x21d, 'CkTj')]('0', '')['trim']();
                    return logWarn(_0x482a7a(0x312, '6VmM') + _0x2b355c), {
                        'type': 'I',
                        'message': _0x2b355c
                    };
                } else return logInfo(_0x482a7a(0x264, 'iaaA')), {
                    'type': 'N',
                    'message': _0x482a7a(0x249, '@!o[')
                };
            }
        }
    } catch (_0x15248d) {
        if ('AXvyU' === 'AXvyU') {
            const _0x40ca01 = _0x15248d[_0x482a7a(0x42f, '#Uph')] && _0x15248d[_0x482a7a(0x2e1, 'GmQ^')][_0x482a7a(0x3dd, '7T&H')] && _0x15248d['response']['data'][_0x482a7a(0x2b6, 'riSU')] ? _0x15248d[_0x482a7a(0x31c, 'IngF')][_0x482a7a(0x1ca, 'uwg!')][_0x482a7a(0x153, '!umK')][_0x482a7a(0x2a1, 'p[t5')][_0x482a7a(0x3b7, 'IngF')] : _0x15248d[_0x482a7a(0x484, '8CVd')];
            return logWarn(_0x482a7a(0x34f, 'EBzE') + _0x53bdb1 + _0x482a7a(0x32f, 'Q1U1') + _0x40ca01), {
                'type': 'E',
                'message': _0x40ca01
            };
        } else {
            const _0x2fe873 = _0x2dad20[_0x482a7a(0x2cc, 'PV9Q')]();
            _0x2fe873 < 0.4 ? _0x4a0562(_0x482a7a(0x1f5, '^upB')) : _0x17ae1a(_0x5c8c13[_0x28ffb3]);
        }
    }
}
async function submitBids(_0x1582e8, _0x3401d6 = !![]) {
    const _0x4ae133 = a0_0x5cae94;
    let _0x163c16 = _0x1582e8,
        _0x521d95 = 0x0;
    while (_0x521d95 < 0xa) {
        _0x521d95++;
        if (_0x521d95 > 0x1) {
            logInfo(_0x4ae133(0x143, 'EBzE')), _0x163c16 = await fetchAndSolveCaptcha(0x3);
            if (!_0x163c16) return logErr(_0x4ae133(0x22a, 'rl6t')), {
                'type': 'E',
                'message': _0x4ae133(0x389, 'CkTj')
            };
        }
        const _0x21ccb5 = await submitBidsSingleStrategy(_0x163c16, _0x4ae133(0x151, '@!o['));
        if (_0x21ccb5[_0x4ae133(0x1b3, '&PzW')] === 'S' || _0x21ccb5['type'] === 'N') return _0x21ccb5;
        else {
            if (_0x21ccb5[_0x4ae133(0x3a6, 'wpSZ')] === 'I') {
                logWarn(_0x4ae133(0x308, 'E&Ei'));
                continue;
            } else {
                if (_0x21ccb5[_0x4ae133(0x2b3, 'UwMq')] === 'E') {
                    const _0x5570b7 = (_0x21ccb5[_0x4ae133(0x21b, '!7at')] || '')['toLowerCase']();
                    if (_0x5570b7[_0x4ae133(0x29f, '^Hgn')](_0x4ae133(0x48f, 'd5Um')) || _0x5570b7[_0x4ae133(0x42b, 'UwMq')](_0x4ae133(0x31b, '!7at')) || _0x5570b7[_0x4ae133(0x30e, 'GmQ^')]('greater\x20than')) {
                        const _0x2d35e9 = _0x5570b7['match'](/order\s*id\s*:\s*(\d+)/i),
                            _0x5be7a0 = _0x5570b7[_0x4ae133(0x3b9, 'xvA&')](/equal to\s*([\d\.]+)/i);
                        if (_0x2d35e9 && _0x5be7a0 && CONFIG[_0x4ae133(0x3e2, 'CMx8')]) {
                            const _0x4905a4 = _0x2d35e9[0x1],
                                _0x4d7e1c = _0x5be7a0[0x1];
                            logWarn(_0x4ae133(0x369, 'Kq2E') + _0x4905a4 + '.\x20SAP\x20wants\x20>=\x20' + _0x4d7e1c);
                            if (autoUpdateCsvForOrder(_0x4905a4, _0x4d7e1c)) {
                                logInfo(_0x4ae133(0x111, 'V&W2'));
                                continue;
                            }
                        }
                        return logErr(_0x4ae133(0x2e6, 'Q^^z') + _0x21ccb5[_0x4ae133(0x43c, 'rl6t')] + _0x4ae133(0x1f3, 'rl6t')), _0x21ccb5;
                    }
                    return logErr('Unknown\x20error,\x20aborting\x20batch:\x20' + _0x21ccb5[_0x4ae133(0x207, 'EBzE')]), _0x21ccb5;
                }
            }
        }
    }
    return {
        'type': 'E',
        'message': 'Max\x20retries\x20exceeded\x20for\x20batch'
    };
}
async function runAutoBatchSubmission(_0x55f7ae = null) {
    const _0x4506dd = a0_0x5cae94;
    logBold(_0x4506dd(0x3a4, 'Q^^z')), csvBatchState[_0x4506dd(0x26d, '!umK')] = !![];
    let _0x18bb85 = 0x0;
    while (!csvBatchState[_0x4506dd(0x14d, 'BEh9')] && csvBatchState[_0x4506dd(0x449, '!Cfi')]) {
        _0x18bb85++, logInfo(_0x4506dd(0x30a, 'vSeG') + _0x18bb85 + '\x20(' + csvBatchState[_0x4506dd(0x2b2, 'wOt2')][_0x4506dd(0x12f, '4f2Z')] + _0x4506dd(0x134, 'rl6t'));
        let _0x2bb4f9 = _0x55f7ae;
        !_0x2bb4f9 && (_0x4506dd(0x40e, 'UwMq') === _0x4506dd(0x1d5, '7T&H') ? _0x4405b4(_0x4506dd(0x368, 'pLhn')) : _0x2bb4f9 = await fetchAndSolveCaptcha());
        _0x55f7ae = null;
        if (!_0x2bb4f9) {
            logErr(_0x4506dd(0x38f, 'Kq2E')), csvBatchState[_0x4506dd(0x35a, '#Uph')] = ![];
            break;
        }
        const _0x2ca7b3 = await submitBids(_0x2bb4f9, !![]);
        if (_0x2ca7b3['type'] === 'S' || _0x2ca7b3['type'] === 'N') {
            markActiveCsvBatchSubmitted();
            if (applyNextCsvBatch()) {
                if (_0x4506dd(0x3f9, 'wOt2') !== _0x4506dd(0x3db, 'Mje0')) {
                    if (!_0x4dec8f) _0x2b975c(_0x4506dd(0x3a9, 'W6n7') + _0xf4399c['message']);
                    return null;
                } else logOk(_0x4506dd(0x26b, 'Em3N') + _0x18bb85 + _0x4506dd(0x304, '4f2Z'));
            } else _0x4506dd(0x2ae, 'UwMq') === _0x4506dd(0x458, 'IngF') ? (logOk(_0x4506dd(0x11b, 'JpRo')), csvBatchState[_0x4506dd(0x366, 'EBzE')] = !![]) : _0x4c91e9[_0x4506dd(0x12a, 'UwMq')](_0x26c18b[_0x4506dd(0x102, 'o)HK')]);
        } else {
            if (_0x2ca7b3['type'] === 'I') {
                logWarn('Captcha\x20was\x20wrong,\x20retrying\x20same\x20batch...');
                continue;
            } else {
                if (_0x2ca7b3[_0x4506dd(0x23e, 'd5Um')] === 'E') {
                    if ('SEgSo' !== _0x4506dd(0x1c8, 'GmQ^')) _0xa53cd1(_0x4506dd(0x34b, '7T&H'));
                    else {
                        logErr(_0x4506dd(0x164, '6VmM')), markActiveCsvBatchSubmitted();
                        if (applyNextCsvBatch()) logOk(_0x4506dd(0x3c5, 'V&W2'));
                        else {
                            if (_0x4506dd(0x382, 'riSU') === 'dLnTH') return _0x50cf35(_0x4506dd(0x2fb, '7T&H')), {
                                'status': _0x4506dd(0x2ce, '^Hgn')
                            };
                            else logOk(_0x4506dd(0x28f, '!umK')), csvBatchState[_0x4506dd(0x459, 'd5Um')] = !![];
                        }
                    }
                }
            }
        }
    }
    logBold('Auto\x20batch\x20submission\x20finished.\x20' + Object[_0x4506dd(0x437, '7T&H')](csvBatchState[_0x4506dd(0x337, 'BEh9')])[_0x4506dd(0x194, '#Uph')] + _0x4506dd(0x260, 'Q^^z'));
}
async function runSingleSubmission(_0x121c7e = null) {
    const _0x1b462d = a0_0x5cae94;
    logBold('Starting\x20single-shot\x20submission\x20(all\x20rows)...');
    let _0x2e5481 = _0x121c7e;
    if (!_0x2e5481) {
        if ('jeBtU' !== _0x1b462d(0x132, 'iaaA')) return _0x5b2407[_0x1b462d(0x489, '6HMp')] = [], _0x58656b['completed'] = !![], ![];
        else _0x2e5481 = await fetchAndSolveCaptcha();
    }
    if (!_0x2e5481) {
        logErr(_0x1b462d(0x193, 'V&W2'));
        return;
    }
    let _0x73bdfc = await submitBids(_0x2e5481, ![]),
        _0x30c945 = 0x0;
    while (_0x73bdfc['type'] === 'I' && _0x30c945 < 0x5) {
        _0x30c945++, logWarn('Captcha\x20retry\x20' + _0x30c945 + _0x1b462d(0x460, '!7at'));
        const _0x863a16 = await fetchAndSolveCaptcha();
        if (!_0x863a16) break;
        _0x73bdfc = await submitBids(_0x863a16, ![]);
    }
    if (_0x73bdfc[_0x1b462d(0x415, '6VmM')] === 'S') {
        if (_0x1b462d(0x488, 'Kq2E') === 'cPIAr') logOk(_0x1b462d(0x356, 'pLhn'));
        else {
            const _0x251192 = _0x34212d[_0x1b462d(0xf7, '8CVd')](_0x21a6e7);
            !_0x76e70e[_0x1b462d(0x2ab, '@!o[')](_0x251192) && _0x20fe8e[_0x1b462d(0x3ff, 'p[t5')](_0x251192, {
                'recursive': !![]
            }), _0x3e6470[_0x1b462d(0x180, '8CVd')](_0x2a567b[_0x1b462d(0x294, 'BEh9')](','));
        }
    }
}

function sleep(_0x1e5b61) {
    return new Promise(_0x10a09b => setTimeout(_0x10a09b, _0x1e5b61));
}
async function waitForBiddingWindow() {
    const _0x199c6e = a0_0x5cae94,
        _0x2f3d3e = orderListData['NavBidCurrDtDm'],
        _0x1f62cc = convUtcToLocal(_0x2f3d3e[_0x199c6e(0x25d, 'iaaA')], _0x2f3d3e[_0x199c6e(0x313, 'Em3N')]),
        _0x410b38 = convUtcToLocal(plantConf[_0x199c6e(0x41f, 'd5Um')], plantConf[_0x199c6e(0x1fe, 'Q^^z')]),
        _0x325a48 = convUtcToLocal(plantConf['BiddingDate'], plantConf[_0x199c6e(0x11c, 'Fnyv')]);
    if (_0x1f62cc === null || _0x410b38 === null || _0x325a48 === null) {
        if ('HGEIJ' !== 'HaWDc') return logWarn('Could\x20not\x20parse\x20timer\x20values.\x20Proceeding\x20immediately...'), 'active';
        else _0x3aa064(_0x199c6e(0x452, '%7kh')), _0x2211fb['completed'] = !![];
    }
    const _0x5eff3e = _0x1f62cc,
        _0x4ca2e8 = Date[_0x199c6e(0x32e, 'Q^^z')](),
        _0x7ca4f6 = _0x5eff3e - _0x4ca2e8;

    function _0x3a884d() {
        const _0xb603f8 = _0x199c6e;
        return Date[_0xb603f8(0x202, '6G(F')]() + _0x7ca4f6;
    }
    if (_0x3a884d() >= _0x325a48) return logWarn(_0x199c6e(0x13c, '%7kh')), {
        'status': _0x199c6e(0x12c, 'Em3N')
    };
    if (_0x3a884d() < _0x410b38) {
        logInfo(_0x199c6e(0x319, 'p[t5'));
        let _0x4ff88e = ![],
            _0x340e65 = null,
            _0x3aeaf8 = ![],
            _0x2203a2 = ![],
            _0x27ddbc = 0x0;
        const _0x26ab0b = !!process.env.pm_id;
        while (_0x3a884d() < _0x410b38) {
            const _0xf8d913 = _0x410b38 - _0x3a884d();
            let _0x4ed4ba = 0x96;
            if (_0x26ab0b) {
                if (_0xf8d913 > 0x2bf20) _0x4ed4ba = 0xea60;
                else {
                    if (_0xf8d913 > 0x7530) 'ZdDqk' !== _0x199c6e(0x124, 'Fnyv') ? (_0x17fd19++, _0x1da7b4(_0x199c6e(0x1c9, 'vSeG') + _0x51b983['DestCityDesc'] + _0x199c6e(0x476, '6VmM') + _0x496450[_0x199c6e(0x3d4, '6G(F')] + _0x199c6e(0x166, 'vSeG') + _0x23fe98[_0x199c6e(0x37f, 'EjAy')])) : _0x4ed4ba = 0x2710;
                    else {
                        if (_0x199c6e(0x274, 'd5Um') !== _0x199c6e(0x325, '!7at')) {
                            const _0x1b3c02 = _0x4942c6[_0x199c6e(0x29a, 'EjAy')](_0x1350c0 => _0x1350c0[_0x199c6e(0x405, 'CkTj')] === _0x4169ae[_0x199c6e(0x10b, '!umK')]);
                            _0x1b3c02 && (_0x1b3c02['BiddingRank'] = _0x3d9649[_0x199c6e(0x2c8, '!7at')], _0xbec178[_0x199c6e(0x275, '4f2Z')] !== _0x47f427 && _0x5f31f5['L1BidAmount'] !== null && (_0x1b3c02['L1BidAmount'] = _0x3bc3bc(_0x15ac4f[_0x199c6e(0x37a, '!7at')])[_0x199c6e(0x3e1, 'riSU')]()));
                        } else _0x4ed4ba = 0x3e8;
                    }
                }
            }
            Date[_0x199c6e(0x282, 'Kq2E')]() - _0x27ddbc > _0x4ed4ba && (_0x26ab0b ? logInfo(_0x199c6e(0x447, 'E&Ei') + formatCountdown(_0xf8d913)) : process[_0x199c6e(0x1ac, 'Kq2E')]['write']('\x0d\x20\x20⏳\x20Submitting\x20in\x20' + formatCountdown(_0xf8d913) + _0x199c6e(0x204, 'vSeG')), _0x27ddbc = Date[_0x199c6e(0x453, 'vSeG')]());
            _0xf8d913 <= 0xea60 && !_0x3aeaf8 && (_0x199c6e(0x141, 'wpSZ') !== _0x199c6e(0x2a0, 'BEh9') ? _0x59bcc6 = 0x2710 : (process['stdout'][_0x199c6e(0x479, 'Fnyv')]('\x0a'), logInfo(_0x199c6e(0x198, '^upB')), await login(), _0x3aeaf8 = !![]));
            if (_0xf8d913 <= 0x1b58 && !_0x2203a2) {
                if ('kXOrq' !== _0x199c6e(0x24e, 'CkTj')) process[_0x199c6e(0x139, 'o)HK')][_0x199c6e(0xff, 'Em3N')]('\x0a'), logInfo(_0x199c6e(0x456, '#Uph')), await fetchBidOrderList(), applyCsvDataToOrders(), _0x2203a2 = !![];
                else {
                    const _0x4f71b2 = _0x326fc8(_0x4a58f5[_0x199c6e(0x38a, 'vSeG')] || '')[_0x199c6e(0x2f7, 'BEh9')]()[_0x199c6e(0x298, 'V&W2')](/^0+/, ''),
                        _0x3a519b = _0x4f71b2 === '1' || _0x5ace62(_0xd771d8[_0x199c6e(0x41b, 'rl6t')]) === 0x1;
                    _0x3a519b ? (_0x3ccf71++, _0x241e14(_0x199c6e(0x417, 'Q1U1') + _0x1d1858[_0x199c6e(0x21f, 'UwMq')] + _0x199c6e(0x1a8, 'PV9Q') + _0x5d0198[_0x199c6e(0x388, 'CkTj')] + _0x199c6e(0x24b, 'EBzE') + _0x26df10[_0x199c6e(0x23b, 'Mje0')])) : _0x4eb5f1(_0x199c6e(0x235, 'Q1U1') + (_0x4f71b2 || _0x35ab18[_0x199c6e(0x216, '4f2Z')] || '?') + '\x20->\x20City:\x20' + _0x5a0eaa[_0x199c6e(0xfe, 'PV9Q')] + _0x199c6e(0x23a, 'IngF') + _0x21e613[_0x199c6e(0x3d4, '6G(F')] + _0x199c6e(0x496, 'W6n7') + _0x4918d4[_0x199c6e(0x351, 'Q^^z')] + _0x199c6e(0x3f5, '8CVd') + _0x19b13a[_0x199c6e(0x345, '!Cfi')] + ')');
                }
            }
            if (_0xf8d913 <= 0xbb8 && !_0x4ff88e) {
                if (_0x199c6e(0x430, 'pLhn') !== 'Zdpdc') return;
                else {
                    process[_0x199c6e(0x246, 'pLhn')][_0x199c6e(0x386, '6G(F')]('\x0a'), logInfo(_0x199c6e(0x3ac, 'BEh9'));
                    let _0x4bd4ab = 0x0;
                    const _0x1d5ee1 = Date['now']();
                    while (_0x3a884d() < _0x410b38) {
                        _0x4bd4ab++;
                        const _0x606ff7 = await fetchCaptcha(!![]);
                        if (_0x606ff7) {
                            if (_0x199c6e(0x267, 'H3Oi') === _0x199c6e(0x217, 'iaaA')) {
                                _0x4ceaf0(_0x199c6e(0x197, '8CVd') + _0x576d69[_0x199c6e(0x115, '6HMp')]['status'] + '\x20-\x20' + _0x5c210b[_0x199c6e(0x367, 'EBzE')][_0x199c6e(0x499, 'pLhn')]);
                                _0x32693a[_0x199c6e(0x128, 'CkTj')]['status'] === 0x191 && _0x166ac5(_0x199c6e(0x2d8, '839y'));
                                if (_0x440c66[_0x199c6e(0x367, 'EBzE')][_0x199c6e(0x154, '8CVd')][_0x199c6e(0x213, '^upB')]) return _0x24527b = _0x4abbb6['response'][_0x199c6e(0x1b0, 'IngF')]['x-csrf-token'], _0x469055(_0x199c6e(0x38e, 'bC17') + _0x5ed1cc['substring'](0x0, 0xc) + _0x199c6e(0x478, 'rl6t')), !![];
                            } else {
                                const _0x3b3741 = Date[_0x199c6e(0x25f, 'E&Ei')]() - _0x1d5ee1;
                                return logOk(_0x199c6e(0x48d, 'CMx8') + _0x4bd4ab + _0x199c6e(0x35f, '&PzW') + _0x3b3741 + _0x199c6e(0x270, '6G(F')), _0x340e65 = await solveCaptcha(_0x606ff7), process['stdout']['write']('\x0a'), logBold('SAP\x20sent\x20the\x20captcha!\x20Submitting\x20instantly\x20to\x20beat\x20the\x20crowd...'), {
                                    'status': _0x199c6e(0x341, 'V&W2'),
                                    'prefetchSolution': _0x340e65,
                                    'endTime': _0x325a48,
                                    'clockOffset': _0x7ca4f6
                                };
                            }
                        }
                        await sleep(0xa);
                    }
                }
            }
            if (_0xf8d913 <= 0x32) await sleep(_0xf8d913);
            else {
                if (_0xf8d913 < 0xbb8) {
                    if (_0x199c6e(0x129, '&PzW') === 'UagYL') await sleep(0xa);
                    else {
                        if (!_0x5e25b8) return 0x0;
                        const _0xa24d1c = _0x378710[_0x199c6e(0x11d, 'Kq2E')](/PT(\d+)H(\d+)M(\d+)S/);
                        if (_0xa24d1c) return (_0x41727a(_0xa24d1c[0x1]) * 0xe10 + _0x4970c6(_0xa24d1c[0x2]) * 0x3c + _0x1325b7(_0xa24d1c[0x3])) * 0x3e8;
                        return 0x0;
                    }
                } else await sleep(_0xf8d913 > 0xbb8 ? 0x3e8 : 0x32);
            }
        }
        return process[_0x199c6e(0x370, '%7kh')][_0x199c6e(0x40c, 'rl6t')](_0x199c6e(0x462, 'UwMq')), logOk(_0x199c6e(0x35d, 'Kq2E')), {
            'status': _0x199c6e(0x140, 'rl6t'),
            'prefetchSolution': _0x340e65,
            'endTime': _0x325a48,
            'clockOffset': _0x7ca4f6
        };
    }
    if (_0x3a884d() >= _0x410b38 && _0x3a884d() < _0x325a48) return logOk(_0x199c6e(0x2f8, 'd5Um')), {
        'status': 'active',
        'prefetchSolution': null,
        'endTime': _0x325a48,
        'clockOffset': _0x7ca4f6
    };
    return {
        'status': 'expired'
    };
}
async function runSingleCycle() {
    const _0x4d2bd7 = a0_0x5cae94,
        _0x3fb4d5 = await login();
    if (!_0x3fb4d5) {
        if (_0x4d2bd7(0x1f8, 'H3Oi') === _0x4d2bd7(0x20c, 'Mje0')) {
            const _0x3780b0 = _0x40cdc4[_0x4d2bd7(0x1f9, '&PzW')] && _0x5b60a0[_0x4d2bd7(0x187, 'JpRo')][_0x4d2bd7(0x1aa, 'bC17')] && _0x1a4b95[_0x4d2bd7(0x199, '!Cfi')][_0x4d2bd7(0x2e7, 'E&Ei')]['error'] ? _0x77738b['response'][_0x4d2bd7(0x259, '!7at')][_0x4d2bd7(0x297, '!7at')][_0x4d2bd7(0x315, 'BEh9')][_0x4d2bd7(0x27c, 'Kq2E')] : _0x2c966e[_0x4d2bd7(0x333, 'Mje0')];
            return _0x108dbc(_0x4d2bd7(0x34f, 'EBzE') + _0x32e03d + _0x4d2bd7(0x2db, 'BEh9') + _0x3780b0), {
                'type': 'E',
                'message': _0x3780b0
            };
        } else {
            logErr(_0x4d2bd7(0x2cb, 'bC17')), await sleep(0x2710);
            return;
        }
    }
    const _0x4d6fea = await fetchBidOrderList();
    if (!_0x4d6fea) {
        if (_0x4d2bd7(0x26c, '%7kh') === _0x4d2bd7(0x1d1, 'wOt2')) _0x319ff7[_0x4d2bd7(0x27a, 'E&Ei')][_0x4d2bd7(0x3d7, '!7at')](_0x2b7e38);
        else {
            logErr('Failed\x20to\x20fetch\x20bid\x20orders.\x20Retrying\x20in\x2010s...'), await sleep(0x2710);
            return;
        }
    }
    const _0x3cf154 = loadCsvFiles();
    if (!_0x3cf154) {
        if (_0x4d2bd7(0x121, '!Cfi') === _0x4d2bd7(0x2ad, '6G(F')) {
            logErr(_0x4d2bd7(0x218, '4f2Z')), await sleep(0x2710);
            return;
        } else {
            if (_0xf22a6[_0x4d2bd7(0x3fb, 'PV9Q')]('BIDING\x20AMMOUNT')) _0x2210e5['BIDING\x20AMMOUNT'] = _0x309f4c, _0x26756b = !![];
            else _0x31e1c2['hasOwnProperty']('BIDING\x20AMOUNT') && (_0x2cb219['BIDING\x20AMOUNT'] = _0x4d7825, _0xf1fa2b = !![]);
        }
    }
    const _0x52c784 = applyCsvDataToOrders();
    !_0x52c784 && !CONFIG[_0x4d2bd7(0x490, 'wOt2')] && logWarn('No\x20CSV\x20matches\x20found\x20for\x20current\x20slot.');
    if (!plantConf) {
        if (_0x4d2bd7(0x269, 'Em3N') !== _0x4d2bd7(0x1d6, 'iaaA')) {
            logWarn(_0x4d2bd7(0x3a0, '!umK')), await sleep(0x3a98);
            return;
        } else return _0xaf3ebe[_0x256600] = _0x45d5ba, _0xf8bf61;
    }
    const _0xd17c61 = await waitForBiddingWindow();
    if (_0xd17c61[_0x4d2bd7(0x419, '7T&H')] === _0x4d2bd7(0x349, '6HMp')) {
        if ('xtBcZ' !== 'xtBcZ') _0x41c963(_0x4d2bd7(0x168, 'BEh9') + _0x54743f['response']['data']['error']['message'][_0x4d2bd7(0x434, 'xcPi')]);
        else {
            logWarn(_0x4d2bd7(0x3e0, 'CMx8'));
            (!hasActiveCsvBatch() || csvBatchState[_0x4d2bd7(0x39d, 'W6n7')]) && await sleep(0x3a98);
            return;
        }
    }
    const _0x270f81 = _0xd17c61[_0x4d2bd7(0x25e, 'uwg!')];
    if (CONFIG[_0x4d2bd7(0x1e2, '!Cfi')]) {
        if (_0x4d2bd7(0x3bf, 'iaaA') === 'kyKTK')(_0x454636[_0x4d2bd7(0x1ae, '!umK')] || '')[_0x4d2bd7(0x39a, 'E&Ei')]() === _0x2a7229 && (_0x1a6c0e[_0x4d2bd7(0x326, 'o)HK')] || '')[_0x4d2bd7(0x433, '7T&H')]() === _0x4e3684 && (_0x4867dd[_0x4d2bd7(0x3ba, 'Kq2E')] = _0x933879(_0x182437)[_0x4d2bd7(0x252, 'wpSZ')](), _0x2d68ab[_0x4d2bd7(0x148, 'CkTj')] = _0x5b5afa(_0x13cd3f)[_0x4d2bd7(0x2dc, 'H3Oi')]());
        else {
            logBold(_0x4d2bd7(0x178, '^upB'));
            const _0x5a0173 = _0x270f81 || await fetchAndSolveCaptcha(0x5);
            _0x5a0173 ? _0x4d2bd7(0x3c7, 'CkTj') === _0x4d2bd7(0x2a5, '6G(F') ? (_0x4d8549 ? _0x10b65f('⏳\x20Submitting\x20in\x20' + _0x4ef888(_0x551dcc)) : _0x362522['stdout'][_0x4d2bd7(0x378, '!umK')]('\x0d\x20\x20⏳\x20Submitting\x20in\x20' + _0x52467c(_0x37ed8c) + '\x20\x20\x20'), _0x5e337d = _0x17ce32[_0x4d2bd7(0x492, '^upB')]()) : logOk(_0x4d2bd7(0x3eb, 'Q1U1') + _0x5a0173 + '\x22') : logWarn('Captcha\x20solver\x20did\x20not\x20return\x20a\x20valid\x20solution'), logBold(_0x4d2bd7(0x471, '6VmM')), logInfo(_0x4d2bd7(0x15d, '!Cfi')), process['exit'](0x0);
        }
    }
    hasActiveCsvBatch() ? await runAutoBatchSubmission(_0x270f81) : _0x52c784 && !csvBatchState[_0x4d2bd7(0x36f, '6HMp')] ? _0x4d2bd7(0x3ef, 'E&Ei') === 'EoKCe' ? (_0x586477(_0x4d2bd7(0x278, 'H3Oi') + _0x3db673[_0x4d2bd7(0x440, 'riSU')]), _0x2167e5[_0x4d2bd7(0x3fd, 'CkTj')](_0x2884fe[_0x4d2bd7(0x3a1, '^Hgn')]), _0x6febf9[_0x4d2bd7(0x185, 'Em3N')](0x1)) : await runSingleSubmission(_0x270f81) : _0x4d2bd7(0x1ed, '!Cfi') !== _0x4d2bd7(0x1bb, 'xvA&') ? _0x5b4506(_0x4d2bd7(0x2df, '6G(F') + _0x599e4b + '\x22') : logInfo(_0x4d2bd7(0x1d4, 'UwMq'));
    logInfo(_0x4d2bd7(0x283, 'uwg!')), await Promise[_0x4d2bd7(0x30b, 'riSU')]([fetchBidOrderList(), fetchVendorRankings()]);
    const _0x4e2444 = bidRows['filter'](_0x37340c => csvBatchState[_0x4d2bd7(0x17c, '!umK')][getCsvBatchKey(_0x37340c)] === !![]),
        _0x1eab5e = _0x4e2444['length'] > 0x0 ? _0x4e2444 : bidRows['filter'](_0x2c8443 => Number(_0x2c8443[_0x4d2bd7(0x107, '4f2Z')]) > 0x0);
    if (_0x1eab5e['length'] > 0x0) {
        let _0x1eee1f = 0x0;
        console[_0x4d2bd7(0x3a5, '!7at')]('\x0a' + '═' [_0x4d2bd7(0x1c0, 'xcPi')](0x32)), console['log']('' + LOG_COLORS[_0x4d2bd7(0x1ad, 'W6n7')] + LOG_COLORS[_0x4d2bd7(0x10a, 'EjAy')] + _0x4d2bd7(0x34e, 'iaaA') + LOG_COLORS[_0x4d2bd7(0x407, 'rl6t')]), console[_0x4d2bd7(0x46b, 'IngF')]('═' ['repeat'](0x32)), _0x1eab5e[_0x4d2bd7(0x1f7, '@!o[')](_0x13b91a => {
            const _0x2909f8 = _0x4d2bd7;
            if (_0x2909f8(0x420, 'PV9Q') !== 'vFqVQ') {
                const _0x59ebdf = _0x4d0db1[_0x2909f8(0x360, 'riSU')](_0x3d2960['readFileSync'](_0x1fcbaf, _0x2909f8(0x2e2, '^Hgn')));
                let _0x258c2e = 0x0;
                _0x59ebdf[_0x2909f8(0x444, 'UwMq')](({
                    hash: _0x13a5d4,
                    result: _0xa85fdc
                }) => {
                    _0x13a5d4 && _0xa85fdc && (_0x229fc3[_0x13a5d4] = _0xa85fdc, _0x258c2e++);
                }), _0x409809(_0x2909f8(0x377, 'pLhn') + _0x258c2e + '\x20cached\x20captchas\x20loaded)');
            } else {
                const _0x2686e0 = String(_0x13b91a[_0x2909f8(0x3f0, 'iaaA')] || '')[_0x2909f8(0x2d7, '6VmM')]()['replace'](/^0+/, ''),
                    _0x22d69f = _0x2686e0 === '1' || Number(_0x13b91a[_0x2909f8(0x450, '%7kh')]) === 0x1;
                _0x22d69f ? (_0x1eee1f++, logBold(_0x2909f8(0x2be, 'Q^^z') + _0x13b91a[_0x2909f8(0x491, 'xvA&')] + _0x2909f8(0x4a3, 'Mje0') + _0x13b91a['Spi'] + _0x2909f8(0x26a, 'V&W2') + _0x13b91a[_0x2909f8(0x3ba, 'Kq2E')])) : _0x2909f8(0x2a2, 'W6n7') !== _0x2909f8(0x443, '!umK') ? logWarn(_0x2909f8(0x231, 'IngF') + (_0x2686e0 || _0x13b91a['BiddingRank'] || '?') + _0x2909f8(0x3ce, 'CMx8') + _0x13b91a[_0x2909f8(0x220, '6G(F')] + ',\x20SPI:\x20' + _0x13b91a[_0x2909f8(0x363, '^Hgn')] + _0x2909f8(0x142, 'Em3N') + _0x13b91a[_0x2909f8(0x469, 'riSU')] + _0x2909f8(0x466, '4f2Z') + _0x13b91a[_0x2909f8(0x275, '4f2Z')] + ')') : (_0x2d8c0(_0x2909f8(0x2de, 'BEh9') + _0x57e300 + _0x2909f8(0x2c0, '!7at')), _0x4c2d63 = []);
            }
        }), logOk(_0x4d2bd7(0x2f9, 'PV9Q') + _0x1eee1f + _0x4d2bd7(0x498, '6HMp') + _0x1eab5e[_0x4d2bd7(0x12f, '4f2Z')] + _0x4d2bd7(0x1ab, 'pLhn')), console[_0x4d2bd7(0x215, 'V&W2')]('═' [_0x4d2bd7(0x3c2, '8CVd')](0x32) + '\x0a'), saveRankRecordsToCsv(_0x1eab5e);
    }
    return logBold(_0x4d2bd7(0xf5, 'V&W2')), {
        'status': _0xd17c61[_0x4d2bd7(0x25a, 'GmQ^')],
        'endTime': _0xd17c61[_0x4d2bd7(0x2fe, 'V&W2')],
        'clockOffset': _0xd17c61[_0x4d2bd7(0x104, 'xvA&')]
    };
}
async function main() {
    const _0x516ebb = a0_0x5cae94;
    console[_0x516ebb(0x1d7, 'o)HK')]('\x0a' + '═' [_0x516ebb(0x1c0, 'xcPi')](0x3c)), console['log']('' + LOG_COLORS[_0x516ebb(0x36d, 'riSU')] + LOG_COLORS[_0x516ebb(0x330, 'p[t5')] + _0x516ebb(0x33c, 'riSU') + LOG_COLORS[_0x516ebb(0x126, '!umK')]), console[_0x516ebb(0x49c, '6HMp')]('═' [_0x516ebb(0x251, '6VmM')](0x3c)), console[_0x516ebb(0x215, 'V&W2')](), console['log'](), initEmbeddedCaptchaSolver();
    let _0x46fe6f = 0x0;
    do {
        _0x46fe6f++, logBold(_0x516ebb(0x47f, 'UwMq') + _0x46fe6f + '\x20[' + new Date()[_0x516ebb(0x271, 'GmQ^')]() + ']');
        let _0x4915ea = await runSingleCycle();
        typeof _0x4915ea === _0x516ebb(0x468, 'vSeG') && (_0x4915ea = {
            'status': _0x4915ea
        });
        if (CONFIG['DRY_RUN']) break;
        if (CONFIG['LOOP_CONTINUOUS']) {
            if (!csvBatchState[_0x516ebb(0xf6, 'uwg!')] && (hasActiveCsvBatch() || _0x4915ea['status'] === _0x516ebb(0x27d, 'BEh9'))) _0x516ebb(0x454, '6HMp') === _0x516ebb(0x158, '!umK') ? (_0x3b2ed3 && _0x737ec0[_0x516ebb(0x414, 'CMx8')] && _0x4d0a41[_0x516ebb(0x393, 'W6n7')] !== _0x20043d && (_0x171c96 !== null && _0x3d33da(_0x516ebb(0x1a2, '6G(F') + _0x2ce2aa[_0x516ebb(0x163, '!umK')] + '\x20detected,\x20wiping\x20old\x20submission\x20memory.'), _0x511e51 = _0x2698c3[_0x516ebb(0x19f, '6G(F')], _0x259db7 && (_0x574f96[_0x516ebb(0x3f3, 'CkTj')] = {})), _0x48a5b0 = {
                'submittedKeys': _0x2dffb6 && _0x3486b5[_0x516ebb(0x465, 'xcPi')] || {},
                'activeKeys': [],
                'pendingBatches': [],
                'groupsByKey': {},
                'autoRunning': ![],
                'completed': ![]
            }) : logInfo(_0x516ebb(0x227, 'Em3N'));
            else {
                if (_0x516ebb(0x422, '^upB') !== _0x516ebb(0x2d3, 'Mje0')) {
                    if (_0x4915ea[_0x516ebb(0x1f6, 'rl6t')] === _0x516ebb(0x150, 'iaaA') && _0x4915ea[_0x516ebb(0x229, '!7at')]) {
                        const _0x29a29b = Date[_0x516ebb(0x446, 'rl6t')]() + (_0x4915ea[_0x516ebb(0x1be, 'BEh9')] || 0x0),
                            _0x4b835d = _0x4915ea[_0x516ebb(0x165, 'uwg!')] - _0x29a29b;
                        _0x4b835d > 0x0 ? (logInfo('All\x20bids\x20completed\x20for\x20this\x20slot.\x20Waiting\x20' + formatCountdown(_0x4b835d) + '\x20for\x20current\x20slot\x20to\x20end...'), await sleep(_0x4b835d + 0x7d0)) : (logInfo(_0x516ebb(0x35e, 'o)HK')), await sleep(0x3a98));
                    } else 'gwHlH' === _0x516ebb(0x45c, 'CkTj') ? _0x44a70e['log']('' + _0x449ec0[_0x516ebb(0x401, 'd5Um')] + _0xcec326() + _0x47876f[_0x516ebb(0x1cc, 'W6n7')] + '\x20' + _0x39a6f0) : (logInfo(_0x516ebb(0x3aa, 'E&Ei')), await sleep(0x3a98));
                } else return _0x2a57a9 = _0xe7a89c[_0x516ebb(0x347, 'CMx8')][_0x516ebb(0x18e, 'CkTj')][_0x516ebb(0x4a4, 'xvA&')], _0x2af7e9(_0x516ebb(0x1da, 'Q1U1') + _0x32d95f[_0x516ebb(0x3e9, '!umK')](0x0, 0xc) + _0x516ebb(0xf4, 'V&W2')), !![];
            }
        }
    } while (CONFIG[_0x516ebb(0x42a, 'wOt2')]);
}
main()['catch'](_0x5e067b => {
    const _0x594f63 = a0_0x5cae94;
    logErr(_0x594f63(0x223, '#Uph') + _0x5e067b[_0x594f63(0x18f, '4f2Z')]), console[_0x594f63(0x2af, 'EBzE')](_0x5e067b[_0x594f63(0x27e, 'JpRo')]), process[_0x594f63(0x48e, '6HMp')](0x1);
});