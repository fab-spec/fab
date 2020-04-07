import { _log, InvalidConfigError } from '@fab/cli'
import fetch from 'cross-fetch'

export const log = _log(`@fab/deployer-cf-workers`)

const CF_API_URL = `https://api.cloudflare.com/client/v4`

export const getCloudflareApi = async (api_token: string) => {
  const go = (method: string, content_type: string) => async (
    url: string,
    init: RequestInit = {}
  ) => {
    const response = await fetch(`${CF_API_URL}${url}`, {
      ...init,
      method,
      headers: {
        ...init?.headers,
        Authorization: `Bearer ${api_token}`,
        'Content-Type': content_type,
      },
    })
    return await response.json()
  }
  const get = go('get', 'application/json')
  const put = go('put', 'application/javascript')

  const verify = await get(`/user/tokens/verify`)
  if (!verify.success || verify.result.status !== 'active') {
    throw new InvalidConfigError(`Invalid api_token provided!
    Attempting to verify token 💛${api_token}💛 resulted in:
    ❤️${JSON.stringify(verify)}❤️`)
  }

  return { get, put }
}
