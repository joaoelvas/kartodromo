import { withPayload } from '@payloadcms/next/withPayload'
import { fileURLToPath } from 'node:url'
import { dirname } from 'node:path'

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Pin the workspace root to this app dir — a stray root-level package-lock.json
  // otherwise makes Turbopack infer the wrong root.
  turbopack: {
    root: dirname(fileURLToPath(import.meta.url)),
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'www.kartodromovilareal.com' },
    ],
  },
}

export default withPayload(nextConfig)
