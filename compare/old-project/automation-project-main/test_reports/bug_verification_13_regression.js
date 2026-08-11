#!/usr/bin/env node
const assert = require('assert');

function classify(result) {
  const textLower = (result.text || '').toString().toLowerCase();
  const evText = (result.evText || '').toString();
  const evTextLower = evText.toLowerCase();
  const isTieRejected = /same\s+(avg\s+)?amount\s+has\s+been\s+bid\s+by\s+other\s+vendor/i.test(evTextLower);
  const ghostMarkerHints = (result.rankHints || []).filter((h) => h.isGhostRecord);
  const allHintsAreGhost = ghostMarkerHints.length > 0 && ghostMarkerHints.length === (result.rankHints || []).length;
  const sapExplicitSuccess = (
    result.info === 'S' &&
    /saved\s*successfully/i.test(result.text || '') &&
    !evText.trim() &&
    !isTieRejected
  );
  const isGhostSaved = allHintsAreGhost && !sapExplicitSuccess;
  const isSavedOk = /saved successfully|bid.*accepted|success/i.test(textLower);
  const isRealSuccess = !isTieRejected && !isGhostSaved && result.info !== 'E' && (
    (result.info === 'S' && !/ended|closed|expired|invalid|error/i.test(textLower)) || isSavedOk
  );
  if (isTieRejected) return 'REJECTED_TIE';
  if (isGhostSaved) return 'REJECTED_GHOST';
  if (isRealSuccess) return 'ACCEPTED';
  return 'UNKNOWN';
}

function ghostHint(sapOrderId = '5575112501') {
  return {
    sapOrderId,
    rank: '0',
    savedAmt: '643.000',
    l1Amt: '',
    avgAmt: '643.000',
    changeNo: 'AAAAAAAAAAAAAAAAAAAAAA==',
    createdOn: null,
    createdAt: 'PT00H00M00S',
    isGhostRecord: true,
  };
}

assert.strictEqual(classify({
  info: 'S',
  text: 'Bidding Amount Saved Successfully.',
  evText: '',
  rankHints: [ghostHint()],
}), 'ACCEPTED', 'explicit SAP success must not be retried as ghost');

assert.strictEqual(classify({
  info: 'S',
  text: '',
  evText: '',
  rankHints: [ghostHint()],
}), 'REJECTED_GHOST', 'ghost markers without explicit SAP success must remain ghost');

assert.strictEqual(classify({
  info: 'E',
  text: 'Bidding Amount Saved Successfully.',
  evText: 'Same amount has been bid by other vendor for order id : 5575112501 and posnr: 000102#',
  rankHints: [ghostHint()],
}), 'REJECTED_TIE', 'SAP tie Ev_Text must take precedence over cosmetic success text and ghost markers');

console.log('Focused SAP save classification regression passed: ACCEPTED/REJECTED_GHOST/REJECTED_TIE');
