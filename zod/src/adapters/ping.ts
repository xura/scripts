import { warn, success } from '../core/color';
import { Ping } from '../interfaces/ping';
import { retry } from 'async';
import { promise } from 'ping';

const PING_ERRORS = {
    FAILED_TO_REACH_SITE: (site: string) => `Failed to ping ${site}`,
    FAILED_TO_REACH_SITE_AFTER_RETRIES: (site: string, retries: number) =>
        `Could not connect to ${site} after ${retries} retries`
}

const PING_MESSAGES = {
    SUCCESSFULLY_PINGED_SITE: (site: string) => `Successfully reached ${site}`,
    FAILED_TO_PING_SITE_RETRYING: (site: string, retryCount: number) =>
        `Failed to ping ${site}. Retry #${retryCount}...`,
    BEGINNING_TO_PING_SITE: (site: string) => `Trying to reach ${site}...`
}

export default class implements Ping {
    check(site: string, attempts: number, interval: number): Promise<[boolean, string]> {
        console.log(warn(PING_MESSAGES.BEGINNING_TO_PING_SITE(site)))
        const secureSite = `https://${site}`;

        return new Promise((resolve, reject) => {
            retry({
                times: attempts,
                interval: (retryCount) => {
                    console.log(warn(PING_MESSAGES.FAILED_TO_PING_SITE_RETRYING(secureSite, retryCount)));
                    return interval
                }
            }, async () => {
                if (!(await promise.probe(secureSite)).alive)
                    throw Error(PING_ERRORS.FAILED_TO_REACH_SITE(site));
                return true;
            }, function (err) {
                if (err)
                    return reject([false, PING_ERRORS.FAILED_TO_REACH_SITE_AFTER_RETRIES(secureSite, attempts)])

                console.log(success(PING_MESSAGES.SUCCESSFULLY_PINGED_SITE(secureSite)))
                return resolve([true, secureSite]);
            });
        });
    }
}