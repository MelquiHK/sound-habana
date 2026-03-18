import { FlatCompat } from "@eslint/eslintrc"

const compat = new FlatCompat({
  baseDirectory: process.cwd(),
})

export default [...compat.extends("next", "next/core-web-vitals")]
