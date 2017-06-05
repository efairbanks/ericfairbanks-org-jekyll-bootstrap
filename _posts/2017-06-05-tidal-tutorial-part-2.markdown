---
title: "Tidal Tutorial Part 2: Organization & Modularization"
date: 2017-06-05 14:30:00 -0400
categories: music tidal code
layout: post
---

### Level 2 - 1: Ugly Code

[Last time](http://ericfairbanks.org/music/tidal/code/2017/05/31/an-introduction-to-tidal.html) we talked about how Tidal and Haskell work. Today, we're going to look at ways that we can leverage Haskell's language features to write more readable and maintainable Tidal code.

Take these lines, for instance:

```
-- If the following is confusing to you, you should check out:
-- https://tidalcycles.org/patterns.html and read up on the Tidal pattern language.
-- Also, these (lines beginning with two hyphens) are Haskell comments.
-- They are not interpreted as code, and can be used to make notes or explain
-- things to the person reading your code.

cps (130/120)

d1 $ s "[bd bd]"

d3 $ s "[bass:3*4]"

d2 $ s "[[~ sn:3], [~ hh]*2]"
```

<audio src="{{ site.baseurl }}/mp3/tidalectro.mp3" controls></audio>

In the first line, we are calling a function `cps`, which is an acronym that stands for **cycles-per-second**. To set the tempo in **beats-per-minute**, we would usually divide a **BPM** value by 60 because there are 60 seconds in a minute. (*beats:* 130, *per:* /, *minute:* 60)

However, you'll note that we're instead dividing by 120. Why? Well, I like working in double time because it prevents me from having to write patterns like `[~ sn ~ sn]` or `[~ sn]*2` and I can instead pretend that cycles are half measures and just write `[~ sn]` and `[bd bd]`. You can think of doubling the denominator as either halving the length of a cycle *or* doubling the tempo.

**TL;DR** I'm lazy and these rhythms are very repetitive.

The [previous tutorial](http://ericfairbanks.org/music/tidal/code/2017/05/31/an-introduction-to-tidal.html) covers the remainder of the lines of code above. If the pattern syntax is confusing to you, I've already provided a link to the official Tidal guide, which includes audio examples and provides a much more thorough and intuitive explanation of patterns than I could hope to provide here, so *please* check it out and try some of the examples.

---

### Level 2 - 2: A Bit Better With Do

So why did I show you that chunk of code above? It's not like it's particularly exciting. It is, however, kind of a mess. It's unnecessarily verbose, nothing is labeled or named, and each line must be executed individually. You could try to bunch them up into a block and execute them together, but Haskell would yell at you because it doesn't understand what you are trying to do.

So how do we give the Haskell interpreter multiple instructions to execute simultaneously? We use a common programming language feature called a **control structure**, in this case Haskell's `do`.

```
do
  cps (130/120)
  d1 $ s "[bd bd]"
  d3 $ s "[bass:3*4]"
  d2 $ s "[[~ sn:3], [~ hh]*2]"
```

In the above example, we are handing the Haskell **control structure** `do` a **block** of code. **Blocks** of code are another common concept among programming languages, and they are essentially just a list of lines or instructions that are grouped together. Many languages use opening and closing symbols (`{` and `}` for example) to denote a block of instructions, but Haskell simply uses indentation.

Blocks of code and `do` are a bit more nuanced than I've just described. For instance, they involve a programming concept known as **scope**, which we will discuss in the following section. **Scope** is not a particularly complicated concept, but it's important to understand, especially if you've ever worked with languages that let you define variables and functions willy-nilly.

---

### Level 2 - 3: More Better With Stack & Lists

It's time that we learn about another Haskell language feature: **lists**. So far, we have worked with functions, numbers, strings, etc... But what if we want to represent a collection of those things? One way, the most common way even, is by using **lists**.

Haskell understands that any collection of things separated by `,`s and enclosed in `[` `]`s is a **list**. A list of numbers might look like `[1, 2, 3]`. A list of strings might look like `["this", "is", "a", "list"]`. We can also have lists of ParamPatterns! For instance: `[s "[bd sn]", s "bass"]`.

So what does this buy us? Well, Tidal provides us with some useful functions for leveraging the power of lists. One such function is `stack`, which accepts a list of ParamPatterns as its single argument and returns a ParamPattern. As its name implies, it "stacks" a list of ParamPatterns on top of one another. This allows us to do cool stuff like this: `d1 $ stack [s "bd*2", s "[~ sn]", s "hh*6"]`

With `stack` now in our toolbox, we can simplify that earlier do block.

```
do
  cps (130/120)
  d1 $ stack [s "[bd bd]", s "[bass:3*4]", s "[[~ sn:3], [~ hh]*2]"]
```

This can also be written as:

```
do
  cps (130/120)
  d1 $ stack [s "[bd bd]",
              s "[bass:3*4]",
              s "[[~ sn:3], [~ hh]*2]"]
```

> **Note:** *As you can see, Haskell will alow you to continue the definition of lists, functions, and other such things down through multiple lines using indentation. It is important to remember is that the proceeding lines must be indented beyond the thing that is being defined.*<br/>
> *In this case, the thing that is being defined is a list, so the elements of the list that are on lines below the beginning of the list should be indented beyond the opening bracket. In the case of a function, you would ensure that the contents of the function are indented beyond the name of the function.*

Huh, I guess we only really need one Tidal connection. (`d1` is our connection, if you remember from [part 1](http://ericfairbanks.org/music/tidal/code/2017/05/31/an-introduction-to-tidal.html)) Well, sort of. There are perfectly good reasons to use multiple connections, but we haven't gotten there quite yet. Suffice to say that Tidal will let you use multiple connections a bit like a DJ might use multiple decks. You can read about them over at [tidalcycles.org](http://tidalcycles.org) if you're feeling impatient.

---

### Level 2 - 3: Even More Better-er With Let & Functions

> **Note:** *This next part necessitates a really long and boring explanation of some programming concepts. I'm sorry about that, but I don't know how to convey these ideas in a more succinct way.*

So far we've taken some admirable steps toward making our code more organized and streamlined, but there's a heck of a lot of room for improvement. A big problem we've still got is that we have no way to easily identify or reference our ParamPatterns according to their purpose. What do I mean by that? Well, we've got a steady bass drum, some auxiliary percussion, and a bass line, but to anyone else (or ourselves a few weeks from now) this probably looks like a bunch of garbage.

We could add some comments to our code, but that's not going to make it any easier to work with. What we need is some way to label and reference snippets of code so that we can break our script up into digestible chunks that are easy to work on individually, move around, and understand. That's where `let` and **functions** come in.

We discussed **functions** to some extent in [part 1](http://ericfairbanks.org/music/tidal/code/2017/05/31/an-introduction-to-tidal.html). Functions are essentially shorthand or aliases for bits of Haskell code, and they can accept other aliases as **arguments** that are metaphorically find->replaced into the body of the **function** when they are **handed** to the function at runtime.

If you remember, we defined functions like this `myFunction = s "bd bd"` and like this `myOtherFunction myArg myOtherArg = myArg + myOtherArg` in the last tutorial. Outside of any kind of function or procedure (*when we're not in a `do` block, for instance*), we can get away with this. In any other scenario, defining a function this way would cause an error, but we got away with it last time because we were adding functions to the Haskell global environment.

The Haskell global environment contains every function we use. Things like `+`, `/`, `-`, `*`, and in our case because we are using Tidal, `s`, `slow`, `d1`, `d2`, etc... This is an example of **scope**, in this case global **scope**. The concept of **scope** is common to most programming languages, and it dictates the availability of things like **functions**. The functions I've just listed are defined in the global environment and thus have a global **scope**.

**Scope** is important in Haskell because Haskell takes the philosophical stance that, generally speaking, any function or procedure should produce no side-effects. That is, a function should not modify anything outside of itself, and should communicate any data to the outside world through the **value** it returns when its body is **evaluated**.

In practice, this sort of thing is unavoidable. You can't do things like write to an audio buffer or screen without side-effects. Haskell deals with this by compartmentalizing that sort of thing to a limited collection of special **functions** and **types** in the global environment.

This is all a roundabout way of explaining why you can't do something like `myGlobalFunction = "parp"` from within a function definition or `do` block. Other explanations include *"because you can't,"* or *"because math"*, or *"learn about programming language design"*. Those explanations, (well the last one isn't really an explanation) aren't wrong per-se, but they're also not constructive or satisfying. I don't know how much better mine is, but hopefully it's a marginal improvement.

Anyway, how do we solve this problem? Well, Haskell gives us a little something called `let`. When prepended to a function definition, `let` tells Haskell that we're defining a function within the current scope, and that it can be done away with when the current scope is destroyed.

If you use `let` in a do block, function, or any other block of code that is handed to a control structure or function, you may define functions that will be available within that block's scope or the scope of anything within it for the time where that block of code or anything within it is being executed. These functions will not be available outside of that block, and if you try to use them elsewhere, Haskell is going to yell at you because it has no idea what you're talking about.

The benefit of this is that we can have functions or do blocks that use the same names to refer to different things without having them step on each other's toes or clutter our global scope/environment. This might seem arbitrarily limiting unless you have ever accidentally used a language that doesn't enforce this sort of thing and gone wild using global variables. There's no pain quite like causing a bug by accidentally modifying something outside of the scope you intended.

If you managed to make it through all of that, then congratulations! Now we can get to the good stuff. Do you remember that convoluted example from what must seem like a few years back? Probably not, so here it is again in its ugliest form:

```
do
  cps (130/120)
  d1 $ stack [s "[bd bd]", s "[bass:3*4]", s "[[~ sn:3], [~ hh]*2]"]
```

Without the knowledge we had earlier, we might try to simplify this by doing the following:

```
-- This ain't gonna work
do
  cps (130/120)
  bassDrum = s "[bd bd]"
  bassLine = s "[bass:3*4]"
  percussion = s "[[~ sn:3], [~ hh]*2]"
  d1 $ stack [bassDrum, bassLine, percussion]
```

However, we now understand that we need to `let` these functions be defined the way they are above within the `do` block's scope. We can't use the non-`let` syntax that Haskell lets us get away with at the uppermost scope because we are working in a scope that is not the global scope. Instead we do this:

```
do
  cps (130/120)
  let bassDrum = s "[bd bd]"
  let bassLine = s "[bass:3*4]"
  let percussion = s "[[~ sn:3], [~ hh]*2]"
  d1 $ stack [bassDrum, bassLine, percussion]
```

Oh snap! Now we're cooking with gas. In fact, we can go totally overboard with this:

```
do
  let houseTempo = 130
  cps (houseTempo/120)
  let bassDrum = s "[bd bd]"
  let bassLine = s "[bass:3*4]"
  let percussion = s "[[~ sn:3], [~ hh]*2]"
  let mainLoop = stack [bassDrum, bassLine, percussion]
  d1 $ mainLoop
```

Oh, and we totally forgot, functions can take parameters in the form of *arguments*!

```
do
  let houseTempo = 130
  let tempoToCyclesPerSecond tempo = tempo/120
  cps $ tempoToCyclesPerSecond 130
  let bassDrum = s "[bd bd]"
  let bassLine = s "[bass:3*4]"
  let percussion = s "[[~ sn:3], [~ hh]*2]"
  let mainLoop = stack [bassDrum, bassLine, percussion]
  d1 $ mainLoop
```

Alright, this is getting a bit out of hand. We probably don't need this much organization and labeling. That said, it's nice to know we can do stuff like this. Now if we want to modify the bass line, it's isolated to its own line, easily editable. If we wanted to remove the bass line from the stack, we only have to delete a single element from the list we've handed to stack and re-execute the block. This is certainly more verbose than what we started with in the beginning, but it's also more legible and more easily manipulated, which is especially useful if we're trying to perform with Tidal.

Hopefully this has given you some ideas regarding what you can do with functions. It is possible to leverage functions to re-use, modularize, and parameterize Tidal and Haskell code in ways that are much more powerful than what has been demonstrated here, but in order to do that we're going to have to learn a little bit more about Haskell and **a lot** more about Tidal.

In the next tutorial, we'll be exploring the `#`, `|+|`, `|-|`, `|*|`, and `|/|` operators (which unlike `$` are specific to Tidal) as well as a new type of Haskell collection called a **tuple**. We'll also explore a new way of organizing Tidal ParamPatterns called `seqP` that will let us organize our ideas into specific segments of time specified by ranges of cycles, a tool that is very handy for organizing ideas and generating fully-realized compositions completely within Tidal.

