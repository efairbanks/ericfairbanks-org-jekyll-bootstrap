---
title: "Programming 101 /w Lua"
date: 2020-04-16 17:28:00 -0400
categories: cybing lua tutorial coding programming intro
layout: post
---

Today we're going to learn how to write and understand computer programs written in Lua, which is the language [Cybin](http://github.com/efairbanks/cybin) uses under the hood to make cool sounds *(and other things)* happen!

> I'll be recording a companion video where I demonstrate this code in Cybin, but in the meantime feel free to follow along by running code on [repl.it](https://repl.it/languages/lua)!

## Table of Contents
* **Building Blocks**: What are the most basic elements we can use to write a computer program?
* **Instructions**: Ok, so we have a bunch of stuff we can use to write a computer program, what does that mean?
* **Building Instructions with Values**: Let's reiterate what we've learned so far.
* **Using Functions**: What are **functions** and how do we use them?
* **Writing Instructions and creating Functions**: How do we use **functions** and how do we use them to write **instructions**? How can we turn a series of **instructions** into a **function?**
* **Environments, Tables, and Variables**: Let's learn about the remaining elements described in the first chapter so that we can write meaningful **instructions** that come together to form a useful **program**.
* **Wrapping Up**: Summarizing what we've learned, and a few examples of how to perform some common complex tasks with the tools we've learned how to use.

## Building Blocks

Lua is a programming language. Programming languages generally contain a limited set of builing blocks used to tell a computer to perform a series of actions.

More succinctly, a computer **program** is a series of **instructions**. Each **instruction** is a configuration of **values** that cumulatively tell a computer to do something _(this will start to make sense in a moment)_.

> We're talking about Lua here, but these concepts are common to most programming languages. It's pretty safe to say that if you see a concept here, it is represented in a very similar way in any other popular programming language.

For simplicity's sake, let's call these building blocks *things*. So, much like in meatspace, _(or "real life")_ we can talk about *things* in general, or a specific *thing*. *(for instance, the idea of computers in general, or the computer I'm writing this on in particular)* Lua is the same. It knows about a limited number of **types** of thing, but usually when you're actually doing something, you will be using a some *thing* in *particular*.

In Lua *(and pretty much every other language)*, **types** of things are referred to as...**types**. Not very creative, but straightforward. Specific *things* in *particular* are referred to as **values**. 

| Type *(of thing)* | Value *(of thing)* |
| ----- | -------- |
| number | `1`, `2.0`, `-1000`, `0.33333333` |
| string | `"hello"`, `'this is a test'`, `"a"` |
| boolean | `true`, `false` |
| function | `print`, `+`, `-`, `/`, `*`, `..`, `=`, `function(x) return x+1 end` |

<br/>Ok, so we've got a list of the **types** of things we can have, and we have some examples of what particular instances, or **values**, of these types of things look like. Unfortunately, we still have no idea how to arrange them in such a way that they cause a computer to *do* something with them.

In short, we don't know how to *instruct* our computer to do something meaningful with our **types** and **values**.

## Instructions

A Lua program is a list of **instructions**. If a computer program is a recipe, then an instruction is a single step in that recipe. There are two ways to indicate where one instruction ends and another begins. One is a new line, and the other is `;`.

In Lua, `;` is not very common. You could separate all of your instructions with `;`, but then your program would be one very long line, and that wouldn't be very easy to read.

Generally an instruction looks like `1+1`, or `print('hello')`.

Notice that these examples are simply combinations of the building blocks described above _(specifically, combinations of **values**)_. That's all an **instruction** really is- an arrangement of **values** that tells a computer to do something.

# Building Instructions with Values

So now we know that a **program** *(recipe)* is a series of **instructions** *(steps)*, and each **instruction** is a combination of **values** *(things)* that tells a the computer to do something.

These **values** *(things)* have **types** _(like, the apple I am eating right now is a **type** of fruit)_ that tell us about what we can do with them and how we should expect them to work when we incorporate them into our **instruction** _(for instance, a recipe might call for a knife and an apple, and while these are both **things**, you [hopefully] wouldn't bake a *knife* into a pie)_.

> Please don't make pies that are full of knives.

But we still don't know how to form a meaningful instruction, or how each **type** of **value** works and what it can or can't do. So, let's learn more about the **types** of **values**. Specifically, let's learn about **functions**, since it's impossible to write instructions without them.

## Using Functions

**Functions** are probably the secondmost complex **type** of **value**. They are what we use to tell the computer to *do* things. A **value** of the **type** **function** _(let's just say **function value** to save time)_ is a way of encapsulating and reusing a set of **instructions**.

> Here's a helpful metaphor. Let's say that a recipe has a step that tells you to mix two ingredients together. It doesn't elaborate on this. It just says "mix these ingredients together." If you didn't know how to mix ingredients together, you could look up how. This is what a function does. It allows you to "look up" a series of **instructions** and do them instead of having to write them out one-by-one every time you want to do that same thing.

If **functions** are collections of **instructions**, and we need **functions** to write **instructions**, then we need to learn how to *use* **functions** before we can learn to *write* **instructions**, and only then will we have the tools we need to *create* our *own* **functions**.

### Calling Functions

> **examples**: `print`, `+`, `-`, `/`, `*`, `=`, `function(x) return x+1 end`

Recall our list of example **functions** from earlier. These are examples of **function** **values**. That is, they are **values** of **type** **function**, and they are actually shorthand for a series of **instructions**. These **functions** are built into Lua, meaning that you can simply use them without having to make them first.

> You might have guessed already, but `print` prints out whatever you give it.

Of this list, `print` is the only *"normal"* **function**. What does that mean? In Lua, **functions** normally use *prefix* notation. That is, they accept parameters, or **arguments**, listed after they are named.

> When we say *operator* below, we mean these special-case, symbolized **functions**.

In contrast, `+`, `-`, `*`, `/`, `=`, and the other algebraic tools you know and love use *infix* notation just like in...algebra. That is, the parameters, or **arguments** you give them go to either side. Some languages also have *postfix* operators...weird!

> **prefix:** print(1,'two',false)<br>
> **infix:** 1+1<br>
> **postfix:** Function name goes at the end??? Lua doesn't do this!

To use a function, you refer to it by name and then append open and closed parentheses to it like so: `print()`

This is both so that you can refer to the **function** by name without actually *doing* it, and so that you have a place to put its parameters, or **arguments**.

> You may have noticed that our **infix** alegbraic operators like `+` don't work this way. They're special built-in functions that operate this way for convenience, since using parentheses with them would be cumbersome.
> 
> Lua could have just had a **prefix** function called `add` instead, _(there are languages that do things this way)_ but instead it sacrifices predictable syntax _(**syntax**: the set of rules that describes a language can be combined to create meaning)_ for convenience.
> 
> This is commonly referred to as *syntactic sugar*. It sacrifices a bit of simplicity and predictability to allow code to be more legible and expressive.

### Function arguments

We've mentioned **arguments** to **functions** a few times now without explaining what they are _(we called them parameters)_. To continue with our cooking metaphor, if a **function** is something we can do, **arguments** are how we specify what *things*, or **values** we are doing things to.

Consider the earlier example of mixing two ingredients together. In practice, that might look like:

`mix(ingredient1,ingredient2)`

Here, `mix` is our **function** and `ingredient1` and `ingredient2` are our **arguments**. We're teling `mix` to mix together our ingredients. But if we had a third, we could do:

`mix(ingredient1,ingredient2,ingredient3)`

Or if we just had the one we could:

`mix(ingredient1)`

Then, I guess, we would have just mixed one ingredient? Doesn't seem useful, but maybe `ingredient1` is an egg or something. Also:

`mix()`

Is still valid code, but it might cause problems. What are you mixing? If you find yourself in your kitchen whisking an empty bowl, you might want to address some personal issues before continuing with this tutorial.

Similarly, you can `print('a')` or `print(1,2,3,4)` or `print()`. Why are you printing nothing in the last example? Well, `print()` actually prints a new line after it prints its **arguments**, so maybe you just wanted to do that? Valid!

> Maybe you noticed that we haven't explained how the **infix** algebraic operators like `+` work. That's because they work just the same as they do in algebra, parentheses and all. `(1+1)/2*5+1` becomes `6`, just the way you'd expect. That's the benefit we get from sacrificing some predictability in our language in favor of nifty syntax tricks.

## Writing Instructions and creating Functions

### Writing Instructions

Ok, so we've seen some examples where we **call** **functions**, but how do we use that knowledge to write **instructions**? How do we create our own **functions**?

Good news. These examples of calling **functions** *are* **instructions**. That's it. `1+1`, `print('hello')`, `(2+2*3)/2`? Those are all instructions. A program is just those all strung together either line-by-line, separated by `;`s, or both.

> `--` starts a comment. Lua ignores text that follows `--`. It exists only to provide information to the programmer.

```lua
-- I'm a program!
print('how are you today?')
print("I'm good")
print("let's count: ");print(1);print(2);print(3)
```
Well shoot- now we've written a program. Neat! It's really that simple. Granted, we only know about algebraic functions and `print` at the moment, so there's not a whole lot we can *do*. Let's work on that.

### Creating Functions

We already know that a **function**, much like a **program**, is a series of instructions. In fact, **functions** are sometimes referred to as *subprograms*.  They are essentially small programs that we give a name so that we can refer back to them later. 

> If a program is a recipe, then think of a function as another recipe that is referred to implicitly by the recipe you are making. For instance, if you are making a pasta dish, it might call for a roux. It would not be unreasonable for the recipe to assume you know how to make a roux.
> 
> A program calling a function is a bit like a recipe saying "make a roux." It's telling you to perform the steps of another recipe, but rather than telling you the steps explicitly, it simply says "make the sub-recipe" and assumes that you either know how to do this, or can learn how.
> 
> It *could* explain all of this explicitly, but it's more convenient not to. As Carl Sagan once said, "If you wish to make an apple pie from scratch, you must first invent the universe." The same goes for pasta dishes, but we don't have time to invent the universe every time we write some code.

Earlier we wrote a very simple **program** where we used `print` a bunch. How would we go about turning that into a **function**? Simple!

```lua
function()
-- I'm a program! ...well now I'm a function, actually.
print('how are you today?')
print("I'm good")
print("let's count: ");print(1);print(2);print(3)
end
```

So wait, in order to write a **function** you just put a bunch of **instructions **between `function()` and `end`? Yep! 

> Usually you would indent the inner content though, so that it's clear that the instructions are within the **function**.

But how do we call our **function**? Well, as we mentioned earlier, **functions** are a **type** of **value**, and they are called using *parentheses*. Armed with this knowledge, you might try to do this:

```lua
function()
-- I'm a program! ...well now I'm a function, actually.
print('how are you today?')
print("I'm good")
print("let's count: ");print(1);print(2);print(3)
end() -- look we're calling it with parentheses!
```

That's...just not gonna work. It's not that this is _wrong_ per-se, it's just ambiguous. Are we saying "this is the end of the **function**, let's call it" or are we saying "within our function let's call another function called `end`?"

How do we solve this ambiguity so that Lua knows what we're on about? Let's go back to algebra. In algebra, we use parentheses to solve problems when we an ambiguous order of operations. When programming, we do the same thing:

```lua
(function()
	-- I'm a program! ...well now I'm a function, actually.
	-- Also adding more comments about how we're finally indenting
	-- the inside of the function so it's easier to read.
	-- Doesn't this look nicer?
	print('how are you today?')
	print("I'm good")
	print("let's count: ");print(1);print(2);print(3)
end)() -- look we're calling it with parentheses!
```
Admittedly, this is weird. Since we haven't learned how to keep track of **values** yet, we have to call our **function**'s **value** directly. This is not particularly useful. The next section will address this, but first let's learn a few final things about **functions**.

### Creating Functions with Arguments

Ok, so we can write **functions**. Neat. But right now, the **functions** we write can only do *one* thing. What if we want them to be a bit more flexible? We know **functions** can accept **arguments**, but how do we *write* a **function** with **arguments**.

Just like when you *call* them, you specify **arguments** between the parentheses:

`function(x) print(x+1) end`

or

```lua
function(x)
	print(x+1)
end
```

> You can write it either way!

Now, if you call that **function** with an argument where `x` is, it will print the result of `x+1`. Note that this **function** contains one **instruction**, but that **instruction** nests a **function** call *inside* another **function** call. The **function** call `x+1` is called *inside* `print`.

If this seems weird or confusing, consider algebra again. `2*(2+2)` is doing the same thing. If `*` and `+` were *prefix* operators called `multiply` and `add`, it would look like `multiply(2,add(2,2))`. It's really the same!

Perhaps it's obvious now, but to call our new **function** you just do...

`(function(x) print(x+1) end)(9)`

...and Lua will print `10`. If it's not obvious what's happening here, imagine a `9` everywhere you see an `x`. When we give our **function** `9` as an argument by putting it between parentheses we use to call our **function**, `x` is replaced by `9` and the **instructions** that make up the **function** are executed in order.

Similarly, you can do stuff like this:

```lua
(function(a,b) print(a+b) end)(3,4) -- this prints 7
```

```lua
 -- the following prints 9
(function(a,b,c)
	print(a*(b+c))
end)(3,2,1)
```

Now, you might be rightly asking yourself, if **functions** are like little sub-recipes, can't they create something, or turn something into something else? Isn't that what `+` and `*` are doing? These **functions** don't just `print` things, so what am I missing?

You're right, and that bring us to our final section on **functions**

### Return Values

We've talked about how **functions** *accept* other **values** as **arguments**, and we've seen that while **functions** are values themselves, they can also seemingly become _other **values**_ when called. Consider `print(1+1)`. Clearly this will print `2`, but when you really think about it, *why* does that happen?

The answer becomes more clear when you look at `print(1+1)` as `print(add(1,1))`. We're *calling* a **function** on the **values** `1` and `1` and it *returns* or *evaluates* to `2`. `1+1` becomes the **value** `2` and then `print` *prints* the **value** `2` that has been given to it.

To better understand, let's write our own **function** that *returns* a **value**:

```lua
function(x)
	return(x+1)
end
```

Okay, well that is straightforward enough. You can think of `return` as a **function** that causes the **function** that called it to cease executing and `return` to whatever called the **function** that called `return`. If `return` is given an **argument**, it will `return`, or evaluate to, that **argument**.

Ok, so then how do we use our new **function**? Maybe it's obvious by now, maybe not:

```lua
-- this evaluates to 3!
(function(x)
	return(x+1)
end)(2)
```

But we're not really doing anything with the **value** `3` that the **function** call evaulates to. Depending on what you're using to run this code _(if anything)_, it may not like that you're not doing anything with the `return` **value**. But luckily we know how to print **values**!

```lua
-- this prints 3!
print((function(x)
	return(x+1)
end)(2))
```

Okay, so we have a basic understanding of how to use and create **functions**, but our code is getting terribly ugly and unwieldly. Worse, we're writing reusable code in the form of **functions**, but because we have to write them *every time*, it's not helping us *at all!*

Let's solve this problem by learning how to give our **values** names so that we can refer back to them without re-writing them every time.

## Environments, Tables, and Variables

### Variables

Most programming languages provide a way to create **variables**. **Variables** provide a way to look up **values** that already exist, either because they come standard with the language, or because you have specifically created them.

If you'd like an example of a **variable**, look no further than `print`. `print` is one of those **variables** that comes with our programming language, and it lets us easily display a text-version of some other **variable** or **value** on our screen, provided we supply the **variable** or **value** as an **argument** to `print`.

So far we've talked about `print` as if it is a function, but really, `print` is a **variable** that has a **value** of a **function** that prints text to your display. I apologize if it feels as if you've been mislead, but imagine how meaningless this would sound if you hadn't worked with **function** **values** first!

**Variables** are relatively straightforward to use, since you can generally use them the same way you would use the **values** they refer to. For instance, if you run `print(print)`, _(printing the **funciton** **value** of the variable `print`)_ Lua will give you the best approximation of the **value** of `print` it can muster, which is this strangeness: `function: 0x1e4c470`

As for _setting_ variables, the _usual_ way is by using another *infix* operator- namely `=`. The `=` operator assumes whatever is to the *left* of it reperesents a **variable**. It *evaluates* everything to the *right* of it, takes the resulting **value**, and set the **variable** to the *left* of it to that **value**.

```lua
-- examples
myVariable = 1+1
print(myvariable) -- this will print 2

myOtherVariable = 3
print(3) -- this will print 3

idk123 = myVariable + myOtherVariable
print(idk123) -- this will print 5

add1=function(x) return x+1 end
idk123=add1(idk123) -- ooh tricky
print(idk123) -- this will print 6

```

> All these **variable** names are arbitrary nonsense and as long as your **variable** name starts with a character in the alphabet or a `_`, you can name it pretty much whatever. Just don't use wacky symbols like `*` or Lua won't know if you're trying to multiply two **variables** or something.


But what does that really *mean*?

### Environments & Tables

In order to understand how setting **variables** works under the hood, _(which is very helpful, believe it or not)_ we first need to understand another **type** of **value**, namely **tables**.

**Tables** are *associative collections*. In simpler terms, **tables** are like a *dictionary*- a book full of *words* and *their definitions*. Think of **variables** as being like *words in a dictionary,* and of **values** as being the *defintions of those words*. This is how **tables** work. Suddenly, the nature of **tables** and how they relate to the concept of **variables** starts making a lot of sense.

"But," you might ask, "if we have **variables**, then why do we need **tables** too?"

That's an excellent question, and there's a perfectly reasonable answer: You've been tricked! **Variables** _(in Lua)_ are just _elements of a **table**!_

For this to make sense, let's go over how to use **tables** quickly.

```lua
-- creating and printing an empty table
print({})

-- setting a variable to an empty table
myTable={}

-- setting elements in a table
myTable['add'] = function(a,b) return a+b end
myTable[1]=100
myTable[2]=200

-- getting elements from a table
print(myTable[1]) -- prints 100
print(myTable[2]) -- prints 200
print(myTable['add'](myTable[1], myTable[2])) -- prints 300

-- making another table and setting an element
-- in that table to our table
otherTable={}
otherTable['firstTable']=myTable

-- getting the value of myTable from otherTable
-- and getting a value out of the value of myTable
print(otherTable['firstTable'][2]) -- prints 200
```

Apologies if that's a lot to take in all at once, but if you've been paying attention so far, you have the tools required to understand all that. The long and the short of it is that **tables** are just another **type** of **value** and there are a limited number of ways to interact with them.

You access and set *elements* of **tables** the same way you would access and set the *names* and **values** of **variables**, with the exception that you must specify the **table** you want to work with, and in order to ask for or set a **value** you must give another **value** to be *associated* with the value you're storing or retrieving.

This is what we mean when we call a **table** an *associative collection*, and the **values** we use to look up or store other **values** _(such as `1`,`2`,`add`, and `firstTable`)_ are referred to as **keys**. We use **keys** to look up or set **values** in a **table**.

**Tables** let us associate **values** with one another, and as you will see shortly, that is *very* useful.

### Environments

So, finally, we can explain what we mean when we say that you, the reader, have been tricked, and that **variables** are just _elements of a **table**._

Remember earlier when we talked about *syntactic sugar*? If not, hit `<CTRL/CMD-F>` and search for "sugar," then come back. It turns out that **variables** in Lua are actually just *syntactic sugar*. **Variables** are just elements of a special **table** called an **environment**. This is actually super cool so let's explore this further.

By default, **variables** are *global*, meaning they are _elements of the global **environment**._ And that _global **environment**_ we're talking about? It's just itself a **variable** named `_G`. Don't believe me? Try evaluating these two lines:

```lua
print(print)
print(_G['print'])
```

Yeah, weird right? "But if variables are just elements in the global environment, which is just a table stored in a variable named _G, then how can we have a variable named _G? Wouldn't _G, being a variable, *also* be an element of the global environment, which is a variable named...this is giving me a headache! EXPLAIN!"

Yes, certainly. Try this:

```lua
print(_G)
print(_G['_G'])
```

Hmm. Yeah, they're the same huh? If that upsets you, I don't suggest studying metaphysics. Turns out that yeah, `_G` is just an element of the global **environment,** which is `_G`. Go figure, Lua is actually internally consistent.

So yeah, turns out that `myVar=1` is just shorthand for `_G['myVar']=1`, and you can access `myVar` by typing `_G['myVar']` if you really want.

I recommend playing with this. Try to break the global **environment**. **Tables** can do all sorts of neat things that are outside the scope of this tutorial, and the global **environment** is just a **table**, so you can do some *really wacky* things _(like invent entirely new language features)_ by modifying it if you so choose.

### Local Environments

In the last section, we implied that there are **environments** other than the _global **environment**_. Let's expand on that.

It's perhaps better to think of the _global **environment**_ as the **environment** of your **program**. We mentioned that it would be correct to think of **functions** as *subprograms*. Each *subprogram* _(or **function**)_ has its own **environnment**.

The benefit of this is that we can then create and use **variables** *inside* a **function** without affecting anything *outside* of the function.

For instance, if we had a variable `x` in the *global* **environment** and we set a variable called `x` in our *local* **environment** we might not be considering that we are also modifying `x` *everywhere else*. Maybe we *want* to do that. Probably, we don't.

In Lua, if you want to set a *local* **variable**, you just put `local` in front. So:

`local a = 10`

Or you can declare that the **variable** is **local** ahead of time and then use it as normal:

```lua
local a
a = 10
```

The *local* **environment** is a **table**, just like the *global* **enviroment**. If you want to get the *local* **environment** of a **function**, you can use the special **function** `getfenv`.

Let's look at an example where we use a local variable in a function.

```lua
add=function(a,b)
  local x -- here we declare that x is a local variable
  x=a+b
  return x
end

-- global x (different from the local x)
x = 1337
print(add(1,1)) -- prints 2
print(x) -- prints 1337 (global x is unchanged)
```

## Wrapping Up

Wait, it's over already? Yes, pretty much. That's all you need to know to write meaningful programs in Lua.

Really, it is.

What, you're still here? I'm not kidding.

"But," I hear you asking, "I've seen code before! What about all the `if`s and `while`s and `for`s! How do I call functions conditionally? How do I loop?!"

Believe it or not, you've just been given the tools you need to do those things. You can easily implement conditional logic _(`if` statements)_ using **functions** and **tables**. Here's a function that prints `"foo"` if the input is `0` and `"bar"` if the input is `1`.

```lua
foobar=function(input)
	local jumpTable={}
	jumpTable[0]=function() print("foo") end
	jumpTable[1]=function() print("bar") end
	jumpTable[input]()
end
foobar(0)
foobar(1)
```

Need to loop? Try a function that calls itself conditionally. Let's count from any number below `10` to `10`.

> The `<` and `>` operators are less-than and greater-than. They return `true` if the statment is true `2>1` or `false` if the statement is false `2<1`.

```lua
countToTen=function(n)
	local jumpTable={}
	jumpTable[true]=function() print(n); countToTen(n+1) end
	jumpTable[false]=function() end
	jumpTable[n<11]()
end
countToTen(0)
```

Of course, tools _(control structures, they're called)_ like `while` and `if` and `for` offer *easier* ways to do these things, but you don't *need* them.

The purpose of this guide was to provide you with the most basic toolset you need to start writing meaningful code in Lua. In that regard, I believe our work here is done.

If you want a comprehensive guide, go read the official Lua Manual. It's good!


