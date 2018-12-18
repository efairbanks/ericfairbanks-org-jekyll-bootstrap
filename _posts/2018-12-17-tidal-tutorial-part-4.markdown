---
title: "Tidal Tutorial Part 4: Tidal 1.0 & MIDI-In" 
---

## The tutorial:

[![TIDAL 1.0 YISSS](https://img.youtube.com/vi/biynSrFygUo/0.jpg =400x)](https://www.youtube.com/watch?v=biynSrFygUo)

<iframe width="560" height="315" src="https://www.youtube.com/embed/biynSrFygUo" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

## Project files:

[Download!](http://ericfairbanks.org/tidal_midi_harmony_tutorial.zip)

## Internal Tidal functions we used:

### **cF**
**`cF` :: Double -> String -> Pattern Double**

`cF`'s first argument is its default _(floating point)_ value. It's second argument is a string representing the OSC route that the subsequent values will be arriving on. It returns a `Pattern` of `Double`s. There is a similar function `cI` for integers that operates in the same way.

### **cP**
**`cP` :: (Parseable a, Enumerable a) => Pattern a -> String -> Pattern a**

`cP`'s first argument is its default value. It's second argument is a string representing the OSC route that the subsequent values will be arriving on. It returns a `Pattern`. It's used for `Pattern`s of strings, or `Pattern`s that would be represented as strings.

## **fix**
**`fix`
:: (ControlPattern -> ControlPattern) -> ControlPattern -> ControlPattern -> ControlPattern**

`fix`'s first argument is a function that accepts a `Pattern` and returns a `Pattern`. Its second argument is a `Pattern` that will be compared with its third argument. It will apply the effects from the first argument to any elements in the `Pattern` provided in the third argument that match the `Pattern` supplied to the second argument.

## **mono**
**`mono` :: Pattern a -> Pattern a**

`mono`'s accepts a `Pattern` and returns a monophonic version of that `Pattern`.

## **discretise**
**`discretise` :: Pattern Time -> Pattern a -> Pattern a**

`discretise` quantizes the `Pattern` supplied to its second argument in time according to the number/fraction of cycles provided to its first argument.

## The code:

```haskell
do
  -- conditionally apply effectpat to the final implied argument of this function if the value of condpat is > 0
  let capply condpat effectpat = every (fmap (\x -> if x > 0 then 1 else 0) (discretise 1 condpat)) effectpat
  -- apply the pattern sent to "notes" by SuperCollider over OSC to another pattern (using n)
  let chordify p = p + n (cP "[]" "notes")
  -- apply the first/lowest note of the pattern sent to "notes" by SuperCollider over OSC to another pattern (using up)
  let bassify p = p * up (mono $ cP "[]" "notes")
  -- drum pattern -- using fix to set the high hat gain to 0.6 and to apply a highpass filter
  let edrums = fix ((* gain 0.6).(# hcutoff 10000)) (s "sonhh:1") $ s "[bd*2, [~ jstsn:5], [~ sonhh:1]*2]"
  -- bass pattern -- running through 20 samples in varbass, all tuned to C
  let bass = bassify $ slow 5 $ n (run 20) + s "varbass" * gain 0.6 # legato 1 # orbit 1
  -- chord pattern -- uses a custom synthdef contained in default.scd
  let chords = chordify $ s "[~ plucklead]*2" # orbit 1
  -- noise build pattern -- uses custom synthdef contained in default.scd
  let build = slow 16 $ s "noisebuild" * gain 0.9 # orbit 1
  -- crash pattern -- highpassed crash symbol with echo and highpass
  let crash = stut 4 0.5 (1/4) $ slow 16 $ s "cc" # hcutoff 5000 # orbit 1
  -- play stuff -- btw orbit 1 has reverb on it and is sidechained to orbit 0
  ---- orbits are like busses and can be manipulated and defined in default.scd
  d1 $ stack [edrums * gain (cF 1 "16"),
              bass * gain (cF 1 "17"),
              chords * gain (cF 1 "18"),
              build * gain (cF 1 "19"),
              crash * gain (cF 1 "20")] # cps (132/120)
```

