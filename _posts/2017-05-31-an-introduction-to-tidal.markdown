---
title: "Tidal Tutorial Part 1: An Introduction to Tidal"
date: 2017-05-31 17:00:00 -0400
categories: music tidal code
layout: post
---
## (via Haskell)
#### [or vice versa?]
<Part 1>


<br/>

> **Note:** _This tutorial assumes some basic familiarity with the Tidal framework, as well as a functioning environment for executing Tidal code. (Atom + SuperDirt + GHCI recommended) For more information, check out [tidalcycles.org](http://tidalcycles.org/)._

#### **Foreword**
Tidal is a Haskell framework for creating, manipulating, and utilizing rhythmic patterns to create (primarily sonic) art. It also defines its own powerful, domain-specific language for defining patterns. Understanding the Haskell programming language is not necessary to use Tidal, but there are aspects of Haskell that are useful to understand when creating or performing with the Tidal framework.

The goal of this tutorial is to explain those aspects of Haskell in a way that is simple and clear enough for non-programmers while still faithfully describing what is happening under the hood.

---

To start, make sure that you can execute this line and make some sounds:

```haskell
d1 $ s "bd"
```

Do you hear a periodic thump? **Y** / **N**

**Y:** Great! Let's move on.<br/>**N:** GOTO 0

So, what's going on in the above line? Well, it's easiest to understand Haskell code (*Tidal especially*) by reading from right to left.

On the far right, we have `"bd"`. This is a string, but it actually represents a Tidal pattern. This pattern contains a single event `bd` and will recur every cycle. If it were `"bd bd"`, which is also equivalent to `"[bd bd]"` (*the outer brackets are implied in Tidal for the sake of brevity and ease of use*), the pattern would contain two `bd` events that occur every cycle, evenly distributed throughout that cycle. In musical terms, it would be equivalent to two half notes.

---

Next there is `s`. In this case, `s` is a function. Functions are a shorthand for one or more operations and may accept zero, one, two, three, or any number of **arguments**. **Arguments** are shorthand for things (*numbers, strings, collections, or even other functions!*) that may be (*and sometimes must be*) given (**passed**) to a function when you execute (**call**) it.

Consider this Haskell function:

```haskell
myFunction = 1 + 1
```

Pretty straightforward, right? Here, we are saying that `myFunction` is equal to the operation `1 + 1`. Anywhere you see `myFunction`, you can imagine it being replaced by `1 + 1`. So for instance, `1 + myFunction` would become `1 + (1 + 1)`, which evaluates to `3`. It follows that `myFunction - 2` would become `(1 + 1) -2`, which evaluates to `0`. Bear in mind, the contents of `myFunction` would be evaluated before the instructions outside of the function, so `myFunction / 2` would be evaluated like `(1 + 1) / 2`, not `1 + 1 / 2`.

Now consider this function:

```haskell
myFunction a b = a + b
```

This function is just like the previous one, but it accepts two **arguments**, `a` and `b`. I explained earlier that functions work like placeholders, replacing themselves with their **definition** (what's to the right of the `=` sign), when your program is executed.

Arguments work in much the same way. When you **call** a function that accepts arguments, Haskell knows to put the arguments you provide in the places you'd expect when replacing the function with its **definition**. Thus, a call to `myFunction` that looks like this:

```haskell
myFunction 1 2
```

...would **evaluate** to this:

```haskell
(1 + 2)
```

In this example, our arguments are named `a` and `b`, but they could be `yaxu` and `fluffyCorgis` and our function would work just the same.

Now, in the case of `s`, it accepts a single argument (*a string representing a Tidal pattern*) and returns something called a `ParamPattern`, which is a special **type** of collection specific to Tidal used to represent a series of parameter-related events that occur at certain intervals distributed throughout some number of cycles. In this case, it represents the parameters `s`, shorthand for `sound`. The pattern "bd" tells `s` to create a ParamPattern that specifies a single sound, `bd`, that occupies a single cycle.

---

Next up, we have the **operator** `$`. Operators (*+ - / * %*) are really just functions. They don't look like functions because they use **infix** notation. You see, when you give arguments to functions, they don't always have to come after the function. That's called prefix notation. There are three kinds of notation that I'm aware of:

```
Prefix notation:   + 1 1
Postfix notation:  1 1 +
Infix notation:    1 + 1
```

They each have their strengths, and most languages use more than one kind. In this case, `$` uses infix notation. `$` is a function that takes everything to the right of it and hands it as an argument to whatever is to its left. Because of this, whatever is to the left of `$` must be a function that accepts at least one argument. Otherwise, Haskell has no idea what you are trying to do and will communicate that to you via an **error**.

We know that functions, when called, are essentially replaced by their contents, or **definition**. We also know that the order of operations within that function is preserved, which we have so far visualized using parentheses and our knowledge of the mathematical order of operations. We can then deduce that `d1 $ s "bd"` can be interpreted as `d1 (s "bd")`, since we know that the purpose of `$` is to hand its right argument to what is to the left of it.

Wait, does that mean that we could write `d1 (s "bd")` instead of `d1 $ s "bd"`? Indeed, it does! However, using `$` allows us to more freely move snippets of Tidal code around, which is useful during performances or when simply toying around with Tidal.

---

Finally, we have reached the last part of this strangely complicated eleven-character line of code. Given what we know now, we can assume that `d1` is a function, and we would assume correctly. But what does `d1` do?

`d1` is an example of a `connection`, a concept specific to the Tidal framework. A connection is represented by a function that accepts a ParamPattern as an argument, and what it does is specific to what kind of a connection it is. The simplest explanation of what a connection is (*that I can come up with, anyways*) is as follows:

A Tidal connection accepts a ParamPattern and continually processes that ParamPattern with respect to time, measured in cycles. The ParamPattern is looped through infinitely according to its length. The ParamPattern is interpreted differently depending on what Tidal-compatible output the connection is associated with.

If the connection represents a connection to the OSC-compatible sampler **Dirt**, then it will use the ParamPattern to control **Dirt**. If it represents a connection to the **SuperCollider** implementation of **Dirt**, **SuperDirt**, then it will be interpreted accordingly. If it represents a connection to the **tidal-midi** framework, then the ParamPattern will be interpreted as a MIDI stream that will be sent to the specified MIDI device. If it represents a connection to **tidal-vis**, then it will be represented visually.

---

"But I didn't need to know any of that to use Tidal," you might exclaim! And that's true. So what was the point of all this?

The point is that understanding Haskell syntax and program structure will help you to use Tidal more effectively. With a better understanding of how Tidal and Haskell works, you will be able to:

+ Solve syntax issues more easily
+ Debug Tidal scripts and snippets more effectively
+ Create reusable code that streamlines your creative process
+ Structure your creations sensibly and intuitively
+ Create your own functions for manipulating Tidal patterns
+ Do lots of really cool stuff with Tidal that would otherwise be super hard

Part 2 is coming soon and will cover organizing blocks of code using `do`, creating resuable Tidal snippets with `let`, and some tips for composing pieces of music with Tidal.
