import { readFile, realpath } from 'node:fs/promises';
import { isAbsolute, relative, resolve, sep } from 'node:path';

function structured(code, path, message) {
  const error = new Error(message);
  error.code = code;
  error.stage = 'library';
  error.context = { path };
  return error;
}

function lexical(path) {
  if (typeof path !== 'string' || path === '') {
    throw structured('INVALID_PATH', path, 'path must be a nonempty string');
  }
  if (path.includes('\\')) throw structured('INVALID_PATH', path, 'backslash not allowed');
  if (path.includes(':')) throw structured('INVALID_PATH', path, 'colon not allowed');
  if (path.includes('\0')) throw structured('INVALID_PATH', path, 'NUL not allowed');
  if (path.startsWith('/')) throw structured('INVALID_PATH', path, 'absolute path not allowed');
  for (const segment of path.split('/')) {
    if (segment === '') throw structured('INVALID_PATH', path, 'empty segment not allowed');
    if (segment === '.' || segment === '..') {
      throw structured('INVALID_PATH', path, 'dot segment not allowed');
    }
  }
}

export async function createProjectFiles(root) {
  let base;
  try { base = await realpath(resolve(root)); }
  catch (error) {
    throw structured('ASSET_READ_FAILED', root, error.message);
  }
  const locate = async path => {
    lexical(path);
    let target;
    try { target = await realpath(resolve(base, path)); }
    catch (error) {
      throw structured('ASSET_READ_FAILED', path, error.message);
    }
    const rel = relative(base, target);
    if (rel === '..' || rel.startsWith('..' + sep) || isAbsolute(rel)) {
      throw structured('INVALID_PATH', path, 'resolves outside the project root');
    }
    return target;
  };
  const read = async path => {
    const target = await locate(path);
    try { return await readFile(target); }
    catch (error) {
      throw structured('ASSET_READ_FAILED', path, error.message);
    }
  };
  const readJson = async path => {
    const bytes = await read(path);
    try { return JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(bytes)); }
    catch (error) {
      throw structured('INVALID_DEFINITION', path, error.message);
    }
  };
  return { read, readJson };
}
