# davrc

A command-line utility to send control protocol commands to a Denon AVR.

BETA

```bash
npm i -g @sovpro/davrc

davrc --help
```

## Examples

*The example commands below are not guaranteed to work for your AVR equipment. Consult the relevant documentation available for your AVR equipment.*

Get main zone channel volume state
```bash
davrc --host <host> --CV ?
```

Turn up the main zone master volume by a step
```bash
davrc --host <host> --MV UP
```

Turn up the zone 2 master volume by a step
```bash
davrc --host <host> --Z2 UP
```

Turn up the main zone front left channel volume by a step
```bash
davrc --host <host> --CV FL UP
```

or...
```bash
davrc --host <host> --CV 'FL UP'
```

Turn up the main zone and zone 2 front left channel volume by a step
```bash
davrc --host <host> --CV FL UP --Z2 FL UP
```

or...
```bash
davrc --host <host> --CV 'FL UP' --Z2 'FL UP'
```

Set host environment variable for command 
```bash
# Get main zone on/off state

DAVRC_HOST=<host> davrc --ZM ?
```

Set host environment variable for terminal session 
```bash
# Get main zone and zone 2 on/off state

export DAVRC_HOST=<host>

davrc --ZM ?
davrc --Z2 ?
davrc --ZM ? --Z2 ?
```

# Notice

This unsponsored software is provided, subject to a MIT license, unofficially and independently of Sound United, LLC, its affiliates, subsidiaries and brands (such as Denon and any such not listed here).
