/// <reference types="node" />

import * as dns from 'dns';
import * as oibackoff from 'oibackoff';

// Examples from https://github.com/chilts/oibackoff/blob/master/README.md

// Example 1
var backoff = oibackoff.backoff({
    algorithm  : 'exponential',
    delayRatio : 0.2,
    maxTries   : 5,
});


backoff(dns.resolve, 'example.com', function(err, tries, delay): boolean {
    return true;
}, function(err, addresses) {
    // Do something
});

let fn = function(callback: (err: number) => any){}
backoff(fn, function(err, addresses, priorErrors) {
    if (err) {
        // do something to recover from this error
        return;
    }

    // do something with addresses
    console.log(addresses);
});

backoff(dns.resolve, 'chilts.org', function(err, addresses, priorErrors) {
    if (err) {
        // do something to recover from this error
        return;
    }

    // do something with addresses
    console.log(addresses);
});


// Example 2
var intermediate = function(err: Error, tries: number, delay: number): boolean {
    console.log(err);   // last error
    console.log(tries); // total number of tries performed thus far
    console.log(delay); // the delay for the next attempt
    return false;       // this will cancel additional tries
};

backoff(dns.resolve, 'chilts.org', intermediate, function(err, addresses, priorErrors) {
    if (err) {
        // do something to recover from this error
        return;
    }

    // do something with addresses
    console.log(addresses);
});

backoff(dns.resolve, 'chilts.org', function(err, tries, delay): boolean {
    return true;
}, function(err, addresses) {
    if (err) {
        // do something to recover from this error
        return;
    }

    // do something with addresses
    console.log(addresses);
});

// Backoff Strategies
// 0.4, 0.8, 1.6, 3.2, 6.4, ...
backoff = oibackoff.backoff({
    algorithm  : 'exponential',
    delayRatio : 0.4,
});

// 1, 2, 3, 4, 5, ...
backoff = oibackoff.backoff({
    algorithm  : 'incremental',
    delayRatio : 1,
});

// 0.5, 0.5, 1.0, 1.5, 2.5, 4, ...
backoff = oibackoff.backoff({
    algorithm  : 'fibonacci',
    delayRatio : 0.5,
});
