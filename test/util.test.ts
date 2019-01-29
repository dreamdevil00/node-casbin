// Copyright 2018 The Casbin Authors. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import { getLogger, logPrint, Util as util } from '../src';
import { compile } from 'expression-eval';

test('test enableLog success', () => {
  getLogger().enableLog(true);
  expect(getLogger().isEnable()).toEqual(true);
  getLogger().enableLog(false);
  expect(getLogger().isEnable()).toEqual(false);
});

test('test enableLog failed', () => {
  getLogger().enableLog(true);
  expect(getLogger().isEnable()).not.toEqual(false);
  getLogger().enableLog(false);
  expect(getLogger().isEnable()).not.toEqual(true);
});

test('test logPrint', () => {
  getLogger().enableLog(true);
  expect(logPrint('test log')).toBeUndefined();
});

test('test Valuate', async () => {
  // @ts-ignore
  expect(await compile('1 + 1 === 2')()).toEqual(true);
  // @ts-ignore
  expect(await compile('1 + 1 !== 2')()).toEqual(false);
});

test('test regexMatchFunc', () => {
  expect(util.regexMatchFunc('foobar', '^foo*')).toEqual(true);
  expect(util.regexMatchFunc('barfoo', '^foo*')).toEqual(false);
});

test('test keyMatchFunc', () => {
  expect(util.keyMatchFunc('/foo/bar', '/foo/*')).toEqual(true);
  expect(util.keyMatchFunc('/bar/foo', '/foo/*')).toEqual(false);
});

test('test keyMatch2Func', () => {
  expect(util.keyMatch2Func('/foo/bar', '/foo/*')).toEqual(true);
  expect(util.keyMatch2Func('/foo/baz', '/foo/:bar')).toEqual(true);
  expect(util.keyMatch2Func('/foo/baz/foo', '/foo/:bar/foo')).toEqual(true);
  expect(util.keyMatch2Func('/baz', '/foo')).toEqual(false);
});

test('test keyMatch3Func', () => {
  expect(util.keyMatch3Func('/foo/bar', '/foo/*')).toEqual(true);
  expect(util.keyMatch3Func('/foo/baz', '/foo/{bar}')).toEqual(true);
  expect(util.keyMatch3Func('/foo/baz/foo', '/foo/{bar}/foo')).toEqual(true);
  expect(util.keyMatch3Func('/baz', '/foo')).toEqual(false);
});

test('test ipMatchFunc', () => {
  expect(util.ipMatchFunc('::1', '::0:1')).toEqual(true);
  expect(util.ipMatchFunc('192.168.1.1', '192.168.1.1')).toEqual(true);
  expect(util.ipMatchFunc('127.0.0.1', '::ffff:127.0.0.1')).toEqual(true);
  expect(util.ipMatchFunc('192.168.2.123', '192.168.2.0/24')).toEqual(true);
  expect(util.ipMatchFunc('::1', '127.0.0.2')).toEqual(false);
  expect(() => util.ipMatchFunc('I am alice', '127.0.0.1')).toThrow(Error);
  expect(() => util.ipMatchFunc('127.0.0.1', 'I am alice')).toThrow(/invalid/g);
  expect(util.ipMatchFunc('192.168.2.189', '192.168.1.134/26')).toEqual(false);
});
