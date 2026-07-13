import { getPayload } from 'payload'
import config from '@payload-config'

// Cached Payload local-API client for use in Server Components.
export const getPayloadClient = async () => getPayload({ config })
