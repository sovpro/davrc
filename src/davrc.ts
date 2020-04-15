import {DelimitedStream} from '@sovpro/delimited-stream'
import promiseConnect from '@sovpro/promise-connect'
import {GazillionthQueue} from '@sovpro/gazillionth-queue'
import zclopts from '@sovpro/zclopts'
import {Socket} from 'net'

const PROBABLE_KEY_REGEX = /^[A-Z0-9]{2,}$/
const ENV_HOST_PROP = 'DAVRC_HOST'
const ENV_PORT_PROP = 'DAVRC_PORT'

class DAVRC_Connection {
  public writable: Socket
  public readable: DelimitedStream
  public queue: GazillionthQueue
  constructor (socket: Socket) {
    this.writable = socket
    this.readable = new DelimitedStream ("\r")
    this.queue = new GazillionthQueue ({active_wait: 50})
    this.writable.pipe (this.readable)
  }
}

const logData = (data: Buffer) =>
  console.log (data.toString ('ascii'))
const command = (conn: DAVRC_Connection, cmd: string) =>
  (done:() => void) => conn.writable.write (`${cmd}\r`, done)
const enqueue = (conn: DAVRC_Connection, cmd: string) =>
  conn.queue.push (command (conn, cmd))
const filterCommand = ([key, val]: [string, any]) =>
  typeof val === 'string' &&
  PROBABLE_KEY_REGEX.test (key)

export async function main () {

  const opts = zclopts (process.argv.slice (2))

  if ((opts.hasOwnProperty ('h') && opts.h) ||
      opts.hasOwnProperty ('help'))
    usage (0)

  const { host, port } = getHost (opts)

  if (host === undefined) 
    usage (2, 'Missing host value')

  const raw_entries = Object.entries (opts)
  const entries: [string, any][] = raw_entries
    .filter (filterCommand)

  if (! entries.length)
    usage (2, 'No commands given')

  try {
    const sock = await promiseConnect ({
      port, host, connectTimeout: 500
    })

    const conn = new DAVRC_Connection (sock)
    const onceDone = () => setTimeout (
      () => conn.writable.end (), 350
    )

    conn.readable.on ('data', logData)
    conn.queue.once ('done', onceDone)

    const enqueueCommand = ([key, val]: [string, string]) =>
      enqueue (conn , `${key}${val}`)

    entries.forEach (entry => enqueueCommand (entry))
  }
  catch (err) {
    console.error (err.message)
    process.exit (1)
  }

}

function usage (code = 0, message?: string) {
  if (message) console.log (`${message}\n`)
  console.log ('Usage: davrc [--host] --CMD <string> [...<string>] [...--CMD <string> [...<string>]]')
  console.log ('  Required: --host or set DAVRC_HOST')
  console.log ('  Optional: --port or set DAVRC_PORT')
  process.exit (code)
}

function getHost (opts: { host?: string, port?: any }):
  { host: string | undefined, port: number }
{
  let host = undefined
  let port = undefined
  
  const env = typeof process === 'object' &&
              typeof process.env === 'object' &&
              process.env

  if (opts.hasOwnProperty ('host'))
    host = opts.host
  else if (env && env.hasOwnProperty (ENV_HOST_PROP))
    host = env[ENV_HOST_PROP]

  if (opts.hasOwnProperty ('port'))
    port = +(opts.port || 0)

  if (!port && env && env.hasOwnProperty (ENV_PORT_PROP))
    port = +(env[ENV_PORT_PROP] || 0)

  if (!port)
    port = 23

  return { host, port }
}
