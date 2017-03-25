---
title: "Tidal Electro"
date: 2012-08-26 21:25:49 -0400
categories: music tidal supercollider code
layout: post
---

Audio example:

<audio src="{{ site.baseurl }}/mp3/efairbanks_2016_03_25.mp3" controls></audio>

SuperCollier Code:

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

{% highlight haskell %}
d1 $ density 2 $ s "[bd, <~ sn:6> hh:13]" # shape "0.7" # speed 1 # gain 0.7 # orbit 0
d2 $ slow 2 $ s "bass:3(<1>,12)" # up "0 1 2 3" # hcutoff 100 # orbit 1 # hcutoff 4000
d3 $ slow 2 $ s "bass:3(<16 16 16 20>,24)" # up "24 25 26 27" # hcutoff 1000 # orbit 1 # hcutoff 3000
{% endhighlight %}
