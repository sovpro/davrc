# davrc

A command-line utility to send control protocol commands to a Denon AVR.

BETA

```bash
npm i -g @sovpro/davrc

davrc --help
```

## Examples

*The example commands below are not guaranteed to work for your AVR equipment. Consult the relevant documentation available for your AVR equipment.*

Display main zone channel volume state
```bash
davrc --host <host> --CV?
```

Display zone 2 channel volume state
```bash
davrc --host <host> --Z2CV?
```

Turn up main zone master volume by a step
```bash
davrc --host <host> --MVUP
```

Turn up zone 2 master volume by a step
```bash
davrc --host <host> --Z2UP
```

Turn up the main zone front left channel volume by a step
```bash
davrc --host <host> --CVFL UP
```

Turn up the main zone and zone 2 front left channel volume by a step
```bash
davrc --host <host> --CVFL UP --Z2CVFL UP
```

Set host environment variable for command 
```bash
# Get main zone on/off state

DAVRC_HOST=<host> davrc --ZM?
```

Set host environment variable for terminal session 
```bash
# Get main zone and zone 2 on/off state

export DAVRC_HOST=<host>

davrc --ZM?
davrc --Z2?
davrc --ZM? --Z2?
```

# Notice

This unsponsored software is provided, subject to a MIT license, unofficially and independently of Sound United, LLC, its affiliates, subsidiaries and brands (such as Denon and any such not listed here).
