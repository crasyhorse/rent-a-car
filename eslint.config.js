import { fileURLToPath, URL } from 'node:url';

import { includeIgnoreFile } from '@eslint/compat';
import tseslint from 'typescript-eslint';
import eslintJs from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier';

const gitignorePath = fileURLToPath(new URL('.gitignore', import.meta.url));

const languageOptions = {
    ecmaVersion: 2023,
    sourceType: 'module'
};

export default tseslint.config(
    includeIgnoreFile(gitignorePath),
    eslintJs.configs.recommended,
    eslintConfigPrettier,
    {
        languageOptions
    },
    tseslint.configs.strict,
    tseslint.configs.stylistic
);

