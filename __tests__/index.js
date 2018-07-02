const WsBackpressure = require('..')


class NullSocket
{
  addEventListener(name, func)
  {
    this[name] = func
  }

  send(data)
  {
    setImmediate(this['message'], data)
  }
}


test('Send Buffer, receive Blob', function(done)
{
  const expected = 'asdf'

  const ws = new WsBackpressure(new NullSocket)

  ws.write(Buffer.from(expected))
  ws.once('data', function(data)
  {
    done()
  })
})

test('Cork and uncork', function(done)
{
  const ws = new WsBackpressure(new NullSocket, {highWaterMark: 0})

  ws.write(1)
  ws.write(2)

  ws.once('data', function(data)
  {
    expect(data).toBe(1)

    ws.once('data', function(data)
    {
      expect(data).toBe(2)

      done()
    })
  })
})
