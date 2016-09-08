---
title: "Gameboy cartridge reader"
date: 2012-08-26 20:30:37 -0400
categories: gameboy processing code 
layout: post
---
This is an Arduino-based project I put together about a year or two ago. I had just finished a logic design course, and felt compelled to work on some sort of digital-electronics-related project over the summer. I've always had a bit of a soft spot for the old Nintendo Gameboys, and so I ended up designing a homebrew cartridge interface.

![Arduino]({{ site.baseurl }}/img/gb1.png)

Due to some buggy I/O, I was forced to write my own simple packets with checksums to verify that the data sent over USB wasn't junk. At the time, I didn't want to design a circuit board for a prototype, so I soldered 32 wires to the Gameboy cartridge header, an experience that I would not care to repeat.

![Arduino]({{ site.baseurl }}/img/gb2.png)

I wrote classes for interacting with multiplexers and shift registers, and I wrapped those classes in a larger one that represented an interface to the cartridge as a whole. Writing an OO interface for physical hardware is strangely fulfilling.

![Arduino]({{ site.baseurl }}/img/gb3.png)

I managed to read and verify a copy of Zelda: Link's Awakening with my mess of a cartridge reader and left it at that. While I had originally planned to add more features to my creation, I had already gleaned all of the knowledge I had sought to extract from this endeavor.

The time, effort, and monetary investment involved in further pursuing it would have outweighed the benefits, and so I have left the project as-is. Maybe one day I'll use what I've learned to design a custom Gameboy cartridge, but for now I would rather spend my time on projects that don't reinvent the wheel.

