const {Duplex} = require('stream')


module.exports = class WsBackpressure extends Duplex
{
  constructor(ws, options)
  {
    super({...options, objectMode: true})

    this._ws = ws

    this.cork()

    const uncork = () => process.nextTick(() => this.uncork())

    // ws.addEventListener('close', this.close.bind(this))
    ws.addEventListener('error', this.emit.bind(this, 'error'))
    ws.addEventListener('message', message =>
    {
      switch(message)
      {
        case 'cork'  : return this.cork()
        case 'uncork': return uncork()
      }

      if(!this.push(message)) ws.send('cork')
    })
    ws.addEventListener('open', uncork)
  }

  _read()
  {
    this._ws.send('uncork')
  }

  _write(data, _, callback)
  {
    this._ws.send(data)

    callback()
  }
}
