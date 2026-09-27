---
lang: en
title: "eSIM IP Address: Is Your Exit IP Residential or Datacenter?"
description: "Travel eSIMs often exit through datacenter IPs in Singapore, France or the US — not the country you are in. We cataloged the IP exit profile of 37 providers: country, residential vs datacenter vs mobile, and how to check yours."
date: 2026-09-26
tags: [esim, ip-address, guide]
---

When you install a travel eSIM and open a website, the IP address the internet sees is not always the country printed on the package. For account registration, banking apps, AI signups or streaming, what matters is the **exit IP**: its country and its nature — residential, datacenter, business broadband, or mobile carrier.

## Why travel eSIMs often have "wrong" IPs

Most travel eSIM aggregators do not issue you a native profile from a local carrier. Instead, your traffic is **roamed** through a base operator and breaks out to the internet at a gateway that can be thousands of kilometers away.

Independent research measured this precisely. A 2024 academic study of Airalo ([arXiv 2408.14923](https://arxiv.org/html/2408.14923)) found that 21 of 24 eSIMs tested were roaming profiles, with public IPs belonging to Singtel Singapore, OVH France (a hosting provider) or Packet Host US — datacenter exits, not local residential ones. Holafly's own FAQ acknowledges that users may see a foreign IP because partners assign addresses from their own infrastructure.

Practical consequences:

- Registering on a platform that geo-blocks datacenter IPs may fail
- Banking and AI services may flag the connection as a proxy
- Streaming libraries may not match your physical country
- Speed and latency suffer when the breakout is on another continent

## The four IP types we track

For every provider in our directory we now maintain an **IP exit profile**:

1. **Mobile carrier** — the exit belongs to a real mobile operator network (best for looking like a local phone user)
2. **Residential** — consumer broadband IP (often via home-broadband breakout; prized for account registration)
3. **Business broadband** — commercial fixed-line IP
4. **Datacenter** — hosting-provider IP (OVH, AWS, Packet, etc.); cheapest to operate, most likely to be flagged

Each profile carries a confidence label: verified, likely, uncertain or community-reported. Community-reported means a single user observed it — carrier routing changes, so treat it as a hint, not a guarantee.

## Examples from our catalog

- [Airalo](/sims/airalo) — roaming architecture; exits commonly observed in Singapore, France or the US, often on hosting-provider networks (datacenter, verified by academic measurement)
- [Holafly](/sims/holafly) — official FAQ admits foreign IPs; community reports Singapore exits on some plans
- [giffgaff](/sims/giffgaff), [VOXI](/sims/voxi), [Lebara](/sims/lebara-uk) — UK MVNOs that home-route traffic: your exit stays a UK mobile IP even when roaming
- [CMLink UK](/sims/cmlink-uk) — UK mobile IP in the UK; community reports Hong Kong breakout when roaming in mainland China
- [eSIM.GG](/sims/esim-gg) — Estonian mobile exit; community reports the free promotional eSIM lands on a French IP
- [Hotlink](/sims/hotlink) — genuine Malaysia mobile IP (Maxis network), community-verified with speedtest

## Brand-by-brand: where does each eSIM's IP land?

These are the questions users actually search for. Answers combine academic measurement, official statements and community reports — confidence labels included.

**Airalo IP address: which country?** Measured exits: Singtel Singapore (AS45143) on home-routed profiles, OVH France (AS16276, Lille) and Packet Host US (AS54825) on breakout profiles — datacenter IPs, often not the country you are visiting. Airalo support confirms it cannot guarantee the IP's location. If you need a destination-country IP, Airalo is the wrong tool.

**Saily IP address?** No reliable public data on Saily's exit IP. The official blog says traffic exits through carrier servers without disclosing locations; a USENIX 2025 study summary places Saily among providers that do not route through Chinese networks. Treat as unknown.

**Nomad IP address?** Multiple independent Reddit users report Hong Kong exits — including when using US and Asia-Pacific plans (APAC bundles reportedly ride China Unicom via Hong Kong). No official statement; IP type unknown.

**Holafly IP address?** A USENIX 2025 study documented Holafly traffic routed through China Mobile and other undisclosed networks. Holafly's own traffic-routing FAQ confirms home-routed roaming with foreign IPs. Community reports Singapore landings on some plans. Whether the exit is residential or datacenter is not publicly known.

**Roamless IP address?** Users consistently report three regional breakout nodes — Europe (Belgium/France), USA (Ashburn) and Singapore — auto-selected by the network, not by you. The "Singapore residential IP" claim from our earlier community notes could not be verified; type remains unknown.

**UK MVNOs (giffgaff, VOXI, Lebara, Tesco)**: home-routed — the exit is a genuine UK mobile IP wherever you roam. This is why UK keep-alive numbers are also the go-to tool for UK-IP account registration.

## How to check your own eSIM exit IP

1. Connect with the eSIM and visit any IP-check site (ipinfo.io, ip.sb)
2. Note the **country** and the **ASN / organization** shown
3. If the organization is a hosting provider (OVH, AWS, DigitalOcean, Packet, Google Cloud), your exit is datacenter
4. If it is a mobile operator or consumer ISP, you have a mobile or residential exit

Re-check after moving between countries — some providers change breakout per destination, and routing can change over time.

## Choosing by IP profile

If you need a number or connection that looks like a local phone user — for verification SMS, AI signups, banking — prefer providers whose exit is a **mobile carrier or residential IP in the target country**, and avoid datacenter exits. If you only need cheap data for browsing and maps, the IP type barely matters and the cheapest plan wins.

Browse all 37 providers with their IP exit profiles in the [SIM directory](/sims).
