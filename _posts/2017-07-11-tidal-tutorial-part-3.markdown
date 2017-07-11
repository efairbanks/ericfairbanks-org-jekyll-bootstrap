---
title: "Tidal Tutorial Part 3: Combining ParamPatterns" 
---

### Combining Patterns

In the [previous tutorial](http://ericfairbanks.org/music/tidal/code/2017/06/05/tidal-tutorial-part-2.html), we discussed using `do` blocks and `let` to modularize and organize patterns. We also briefly covered **lists**, a Haskell data type for storing and passing around a collection of similar elements. In the tutorial before that, we explored **functions** and the `$` operator.

None of these things is specific to Tidal *(apart from patterns, that is)*. Now, however, we are going to investigate a series of operators that are *very much* specific to Tidal.

If you've spent any time going over the [TidalCycles pattern guide](https://tidalcycles.org/patterns.html), *(if you haven't, you should)* you may have noticed some operators that are being used in a way that looks suspiciously similar to the `$` operator we've recently familiarized ourselves with. *(eg. `|*|`, `|/|`, `|-|`, `|+|`, and `#`)* Don't be fooled! These operators are different, and you're about to learn how they work!

>**Note:** There is a similarity between these operators, and it's that they are both infix. If you don't remember what that means, or if you don't recall how the `$` operator works, go back to [the first tutorial](http://ericfairbanks.org/music/tidal/code/2017/05/31/an-introduction-to-tidal.html) and do some reading!

So what do these operators do? It's actually pretty simple. They are for **combining ParamPatterns**. There are so many of them because each one decides how the patterns will be combined in the event that the **parameter** being modified is present in both **ParamPatterns.**

>**Note:** We briefly discussed **Patterns**, **ParamPatterns**, and the differences between them in the first tutorial, but it's probably worth re-explaining. In Tidal, a **Pattern** is a collection of strings or numbers where each element in the collection is associated with a moment in time specified as a fraction of a cycle. A **ParamPattern** is a special type of pattern *(created using **Patterns** and helper functions like `s`)* that associates the aforementioned events and values with a **parameter** such as `s` (sound), `n` (note), `speed` (playback speed), etc...

Up until now, we have used functions that accept **Patterns** and return **ParamPatterns** like `s`, we've used functions that accept **ParamPatterns** and return other **ParamPatterns** such as `stack`, and we've even used functions like `d1` that accept **ParamPatterns** and use them to send messages to an audio system that makes sounds. What we *have not* done is take two **ParamPatterns** and fuse them together to make a new, different **ParamPattern**.

*(well, we sort of did that with `stack`, but you'll see what I mean in a moment)*

>**Note:** For simplicity's sake, I'm referring to **Patterns** and **ParamPatterns** colloquially as (lowercase) *patterns* unless the distinction is terribly important, in which case I'll refer to them specifically as **Patterns** or **ParamPatterns**.

For example, let's say that we have want to play a pitched-up bass drum. The most naive way to do this would be to play the sample back at a higher speed. Given the way we've modified patterns so far, you might think we would hand the pattern `s "bd"` to some sort of function that modifies the pitch of that pattern.

Well that's now how any of this works. As it turns out, `speed` is a parameter in the same way that `s` is a parameter that determines what sound is being played by the sound engine. *(eg. Dirt, SuperDirt, Tidal-MIDI)* Because of this, you have to create a second pattern to manipulate `speed` like so: `speed "10"` and then combine it with the first pattern like this:

```haskell
d1 $ s "bd" # speed "10"
```

If you recall from the first part of this series, `$` means *evaluate everything to the right of `$` and then pass it to the function to the left of `$`*. We can correctly express the above as:

```haskell
-- parentheses added for clarity
-- since the stuff to the right 
-- of $ is evaluated first
d1 $ (s "bd" # speed "10")
```

Since `#` is an infix operator that takes two ParamPatterns, this is equally valid:

```haskell
d1 $ speed "10" # s "bd"
```

So what happens if we do this?

```haskell
d1 $ s "bd" # speed "10" # speed "2"
```

Haskell evaluates in a left-to-right order because haskell functions are [curried](http://learnyouahaskell.com/higher-order-functions). In layman's terms, this means that you can hand a function that takes two arguments a single argument and you will get back a function that takes one argument *(the rightmost one)*.

You can think of Haskell evaluating a function with multiple arguments as actually evaluating that function with the first argument, returning a new function that takes one less argument, then giving the new function the next argument, returning a function that takes one less argument than that, until the function requires no more arguments, at which point it can be fully evaluated and its final value can be determined.

Anyway, suffice to say that `speed "2"` overrides `speed "10"` because it is applied after `speed "10"` and because the `#` simply sets the parameter specified, applying the **ParamPattern** on its right to the **ParamPattern** on its left.

But what if this isn't what we want? Surely if we wanted `speed` to be `10` we would have just set it that way to begin with. Well, that's where these operators come in: `|+|`, `|-|`, `|*|`, `|/|`

If the **ParamPatterns** on either side of the above operators both contain the same parameter, the operator will attempt to combine the events associated with that parameter using the arithmetic operator contained within the posts `| |`.  So, for instance, `n "2" |+| n "3"` becomes `n "5"`.

It is also probably worth mentioning at this point that each of these patterns occupies one cycle, and can contain more than one event. So if you combined `n "0 1"` with `n "0 1 2"` using the `|+|` operator you would get something that sounded like `n "0 0 1 2 3 3"`, though it might not be represented in quite that fashion internally. This might take some getting used to, but it can also be very powerful, allowing you to combine parameters [iso](https://en.wikipedia.org/wiki/Isorhythm)/[poly](https://en.wikipedia.org/wiki/Polyrhythm)-rhythmically.

There's one, final caveat to be aware of when combining **ParamPatterns**, which is that the rhythm that the sound is played with is always specified by the original **ParamPattern**, or more specifically, the leftmost **ParamPattern**. This is very important to consider, as:

```haskell
d1 $ n "0 3 7 5 8 12 7 10 14 0 3 7" # s "supermandolin*2"
```

...will play *(if I haven't messed up my MIDI note numbers)* a `i iv v` arpeggio in quarter-note triplets whereas:

```haskell
d1 $ s "supermandolin*2" # n "0 3 7 5 8 12 7 10 14 0 3 7"
```

...will cycle between the tonic and the dominant in half-notes. A big difference, I think you'll agree.

>**Note**: If you are following along with your own installation of Tidal, it may be useful for you to know that `s` can refer to two kinds of sounds, **samples** or **synths**. Tidal looks for a sample directory matching the name specified in the pattern handed to `s`. If it can't find a set of samples matching that name, it assumes there is a **synth** with that name and attempts to play it.
>Synths know what MIDI note number to play via the `n` parameter, (**supermandolin** is a synth) but `n` serves a different purpose where sample sets are concerned. Sounds like `bass` and `bd` are actually banks of samples loaded from similarly-named directories, and the `n` parameter allows you to select which sample from that bank you would like Tidal to play. 
>If you want to modify the pitch of a sample, you must use the `speed` parameter, or use `up`, a meta-parameter of sorts that creates a `speed` pattern that will shift the playback speed of a sample up by however many semitones are specified in the pattern handed to it. If you'd like to pitch a sample down, negative numbers may also be used.
>If you want to combine `n` parameters, you use `|+|` because `n` is short for `note`, and `n` parameters are represented by MIDI notes. However, if you want to combine `up`s, you have to use `|*|` for them to transpose each other the expected way, as they translate to a `speed` value, not a `note` value.
>In the following examples, I'll try to provide an example using synths *and* samples, since they function a bit differently. 

-----

### Examples

Applying the same progression to multiple **ParamPatterns**:

```haskell
do
  let progression p = p |*| up (slow 8 $ "0 5 10 7")
  let melody = progression $ stut 4 0.3 1.033 $ fast 2 $ up "0 3 7 10" |*| up "12" # s "pluck"
  let bass = progression $ s "pluck" |*| speed "0.5" |*| gain "1.0" # shape 0.6 # cut "-1"
  d1 $ stack [melody, bass]
-- or
do
  let progression p = p |+| n (slow 8 $ "0 5 10 7")
  let melody = progression $ stut 4 0.3 1.033 $ fast 2 $ note "0 3 7 10" |+| note "12" # s "superpiano"
  let bass = progression $ s "superpiano" |*| speed "0.5" |*| gain "1.0" # shape 0.6 # cut "-1"
  d1 $ stack [melody, bass]
```

Turning a simple melody into a chord progression:

```haskell
do
  cps 1
  let melody = slow 4 $ up "12 ~ ~ 12 ~ ~ 12 ~ 13 ~ ~ 13 ~ ~ 13 ~ 14 ~ ~ 14 ~ ~ 14 ~ 15 ~ ~ 15 ~ ~ 15 ~" # s "pluck"
  d1 $ melody |*| up "[0,3,7,10]"
-- or
do
  cps 1
  let melody = slow 4 $ n "12 ~ ~ 12 ~ ~ 12 ~ 13 ~ ~ 13 ~ ~ 13 ~ 14 ~ ~ 14 ~ ~ 14 ~ 15 ~ ~ 15 ~ ~ 15 ~" # s "superpiano" # legato 8
  d1 $ melody |+| n "[0,3,7,10]" |*| gain "0.74"
```

Fattening a synth line up using layering:

>**Note:** There's no `superbass`, *(yet)* so sadly I don't have an adequate parallel to this using synths. You can make your own synths, and honestly if you want to fatten up a synth with more voices, you should probably do it in the definition of the synth itself, but that's a conversation for another time.

```haskell
do
  cps 2
  let rhythm = s "[bd, <~ sn:3>, hh(1,2,1)]"
  let bass = s (slow 3 "bass:3(<7 5 6>*2,12)") # up (slow 4 "0 1 2 3")
  let fatten p = p |*| up "[0,7,12,19]" |*| gain "0.9"
  d1 $ stack [rhythm, fatten $ bass]
```

And finally, it's important to remember that you really don't need any of this fancy organizational nonsense:

```haskell
d1 $ stack [(foldEvery [2,3,5] (fast 2) $ n "[0 0 0 0]" # s "<bass bass1>" # n "1 2 3 2 1" |*| up "0 0 0 12" # cut 1 # shape 0.9 # gain "0.8") |*| (slow 8 $ up "0 5 7 -1"), s "[bd*2, [~ sn:3], [~ hh]*2]" |*| gain "0.85" # shape 0.7, (chop 64 $ s "mp3" # speed "-1" # unit "c") |*| gain (scale 0 1 (slow 4 saw)) |*| gain (scale 0 1 (slow 4 saw)) |*| gain (scale 0 1 (slow 4 saw)) |*| gain (scale 0 1 (slow 4 saw)) |*| gain 0.9, stut 4 0.5 1.5 $ slow 8 $ s "cc" # cutoff 3000 # hcutoff 9000 |*| gain 1.5]
```

That's all for today! 
