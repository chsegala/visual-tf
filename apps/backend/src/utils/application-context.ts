import { env } from "node:process";

let applicationContext = {
    WORKING_DIR: env.WORKING_DIR
}

export const get = (): typeof applicationContext => applicationContext;
export const set = <T extends typeof applicationContext>(obj: T): void => { applicationContext = { ...applicationContext, ...obj } };