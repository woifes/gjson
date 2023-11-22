// SPDX-FileCopyrightText: © 2023 woifes <https://github.com/woifes>
// SPDX-License-Identifier: MIT

const starRegEx = /(?<!\\)\*/g; //targets "*" if they are NOT predecesses by a "\"
const questionMarkRegEx = /(?<!\\)\?/g; //targets "?" if they are NOT predecesses by a "\"

/**
 * Creates a regular expression of the given gjson path part. It takes the wildcards into account
 * @param path the path element to replace
 * @returns regular expression taking the wildcards into account
 */
export function createWildcardRegex(path: string): RegExp {
    let regexString = path.replaceAll(starRegEx, ".*");
    regexString = regexString.replaceAll(questionMarkRegEx, ".");
    return new RegExp(regexString);
}
