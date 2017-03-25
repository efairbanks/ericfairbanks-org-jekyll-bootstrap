---
title: "Tidal Electro"
date: 2012-08-26 21:25:49 -0400
categories: music tidal supercollider code
layout: post
---

Here's a four minute hack session in Tidal, a Haskell DSL for musical pattern manipulation that interfaces with an implementation of Dirt (a powerful OSC sampler) written in SCLang. I've been learning me some Haskell and wading through the TidalCycles source. Here I've managed to add some custom effects to SuperDirt that give Tidal a much more authentic EDM feel.

Shout out to the lovely folks over at the [TOPLAP Slack channel](https://toplap.org/toplap-on-slack/)! I would be lost without them.

Audio example:

<audio src="{{ site.baseurl }}/mp3/efairbanks_2016_03_25.mp3" controls></audio>

![Tidal &amp; SuperCollider]({{ site.baseurl }}/img/tidal_electro.png)

SuperDirt Mixer Code:

{% highlight smalltalk %}
SuperDirt.start;
(
~modBus = Bus.audio(s, numChannels:2); // assuming stereo, expand if needed
~carBus = Bus.audio(s, numChannels:2);
~dirt.orbits[0].outBus = ~modBus; // play into that bus.
~dirt.orbits[1].outBus = ~carBus;
Ndef(\x, {
    var modBus = In.ar(~modBus, 2);
    var carBus = In.ar(~carBus, 2);
    var out = modBus+carBus;
    //carBus = FreeVerb.ar(carBus, 0.9, 0.8, 0.8);
    out = Compander.ar(carBus, modBus, -40.dbamp, 1, 0.01, 0.01, 0.07)+modBus;
    out = Compander.ar(out, out, -15.dbamp, 1, 0.2);
    Out.ar(0, out);
});
) 
{% endhighlight %}

Tidal Script

{% highlight haskell %}
d1 $ density 2 $ s "[bd, <~ sn:6> hh:13]" # shape "0.7" # speed 1 # gain 0.7 # orbit 0
d2 $ slow 2 $ s "bass:3(<1>,12)" # up "0 1 2 3" # hcutoff 100 # orbit 1 # hcutoff 4000
d3 $ slow 2 $ s "bass:3(<16 16 16 20>,24)" # up "24 25 26 27" # hcutoff 1000 # orbit 1 # hcutoff 3000
{% endhighlight %}
