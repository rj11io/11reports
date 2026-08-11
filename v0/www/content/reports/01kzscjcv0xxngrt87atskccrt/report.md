<!-- 11archive-source: 00-executive-playbook.md -->

# Website metadata, Open Graph, and SEO: executive playbook

**Created:** 2026-08-11
**Audience:** web engineers, technical marketers, content owners, reviewers
**Scope:** the tags a page puts in its `<head>` (plus the two files at the site root) that decide how search engines, chat apps, social networks, and AI assistants read, index, and display the page
**Evidence boundary:** official documentation from Google, Meta, Slack, Pinterest, Apple, Anthropic, OpenAI, Mozilla, Next.js, the Open Graph protocol, oEmbed, and IndexNow, read on 2026-08-11. X (Twitter) card documentation was unreachable (HTTP 402), so X specifics are marked as second-hand. No live crawl or A/B test was run.

## Terms used everywhere in this report

- **Metadata:** information *about* the page rather than the page content. Most of it lives in `<head>` as `<meta>` and `<link>` tags.
- **Crawler (or bot):** a program that downloads your page automatically. Googlebot is one. So is the fetcher behind a WhatsApp link preview.
- **Unfurl:** what a chat app does when you paste a link and it turns into a card with a title, a blurb, and a picture.
- **Canonical URL:** the one address you want counted as the real one when the same page is reachable at several addresses.
- **Structured data:** facts about the page written in a machine format (usually JSON) so a search engine does not have to guess them from prose.

## Result

Most sites need far fewer tags than the average "SEO checklist" implies, and they need them in the right layer. Three layers do almost all the work:

1. **Ten tags on every page** decide indexing and how the page looks in search and in chat previews.
2. **Two files at the site root** (`robots.txt`, `sitemap.xml`) decide what gets crawled and how fast changes are found.
3. **One JSON block** (structured data) unlocks the richer search result formats, and only for the page types Google actually supports.

Everything else is conditional: add it when the page type, the platform, or the app you ship needs it.

Two rules explain most real-world breakage:

- **Preview crawlers usually do not run JavaScript.** If your tags are injected in the browser, Facebook, WhatsApp, LinkedIn, Slack, and Discord see an empty card. Googlebot does render JavaScript, but on a delay and with caveats. Put metadata in the HTML the server sends.
- **Previews are cached by URL, not by page.** Fixing a bad image and re-sharing the same link changes nothing until you either force a refresh in the platform's debugger or publish the image at a new URL. Meta states this directly: images "are cached based on the URL and won't be updated unless the URL changes" ([Facebook webmasters docs](https://developers.facebook.com/docs/sharing/webmasters/)).

## The ten-tag baseline

Copy this block into every page and fill it in. Nothing here is optional for a public page.

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">

  <title>Page-specific title, then site name</title>
  <meta name="description" content="One or two plain sentences describing this page only.">
  <link rel="canonical" href="https://example.com/exact/page/url">

  <meta property="og:type" content="website">
  <meta property="og:url" content="https://example.com/exact/page/url">
  <meta property="og:title" content="Page-specific title">
  <meta property="og:description" content="One or two plain sentences.">
  <meta property="og:site_name" content="Example">
  <meta property="og:image" content="https://example.com/og/page.jpg">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:alt" content="What the image shows, in words.">

  <meta name="twitter:card" content="summary_large_image">

  <link rel="icon" href="/favicon.ico" sizes="32x32">
  <link rel="icon" href="/icon.svg" type="image/svg+xml">
  <link rel="apple-touch-icon" href="/apple-touch-icon.png">
</head>
```

Why each line is there:

| Line | What breaks without it |
|---|---|
| `lang` on `<html>` | Screen readers pick the wrong voice; translation signals get weaker |
| `charset` | Accented characters render as mojibake. Keep it first: browsers only scan the opening bytes for it |
| `viewport` | The page renders zoomed-out on phones. Google treats the tag's presence as a mobile-friendliness signal ([Google special tags](https://developers.google.com/search/docs/crawling-indexing/special-tags)) |
| `title` | Google's top source for the blue link text ([Google title link](https://developers.google.com/search/docs/appearance/title-link)) |
| `description` | Google writes its own snippet, often from the page's first paragraph |
| `canonical` | Duplicate addresses split their signals; Google picks a version for you |
| `og:*` | Every chat and social preview falls back to guessing from page text |
| `og:image:width` / `height` | Slow first share, and Discord cannot decide big image versus small thumbnail before downloading |
| `og:image:alt` | Blind users get a picture with no description in the preview card |
| `twitter:card` | X shows a small thumbnail instead of the large card, and Discord follows the same tag |
| icons | The tab and search result show a generic globe |

## Priority tiers

| Tier | Add it | Tags and files |
|---|---|---|
| 1. Always | Every public page | `charset`, `viewport`, `title`, `description`, `canonical`, `og:type/url/title/description/image` (+ width, height, alt), `og:site_name`, `twitter:card`, icons |
| 2. Site level | Once per site | `robots.txt`, `sitemap.xml`, `WebSite` and `Organization` structured data on the home page, `site.webmanifest`, `theme-color` |
| 3. Conditional | When the page type calls for it | `article:*` tags, `Article`/`Product`/`Event`/`FAQ` structured data, `BreadcrumbList`, `hreflang`, `robots` directives, `oEmbed` discovery link |
| 4. Platform specific | When you use that platform | `fb:app_id`, `twitter:site`/`creator`, `fediverse:creator`, `pinterest-rich-pin`, `apple-itunes-app`, `al:*` app links |
| 5. Rarely useful | Almost never | `keywords`, `author` as an SEO play, `revisit-after`, `msapplication-*`, `X-UA-Compatible` |

## Non-negotiable defaults

- Give every page its own title and description. Boilerplate repeated site-wide is on Google's list of title problems.
- Make every URL in metadata absolute, starting with `https://`. Relative paths in `og:image` and `canonical` are the single most common broken-preview cause.
- Ship metadata in the server's HTML response. Client-side injection loses every preview crawler.
- One `og:image` per page unless you truly want alternatives. When several are present the first one wins, and WhatsApp takes the first it finds.
- Use 1200 x 630 pixels for the share image. It satisfies the 1.91:1 shape Facebook and LinkedIn render, and X's large card, from one file.
- Keep the share image under 300 KB. That single number clears WhatsApp's limit and every other platform's, with room to spare.
- Never point `canonical` at a page that also carries `noindex`. Google names that combination as a mistake.
- Do not use `robots.txt` to hide a page from search. It blocks the download, not the listing. The URL can still appear without a snippet.
- Do not set `user-scalable=no` or `maximum-scale=1` in the viewport tag. It blocks zoom for people with low vision.
- Write structured data only for facts a visitor can see on the page. Marking up invisible or fake content is what triggers a manual penalty.
- Check the rendered HTML, not your source template. What the crawler sees is what counts.

## What is genuinely new since 2024

- **AI assistants read your site through two doors, and you control them separately.** Training crawlers (GPTBot, ClaudeBot, Google-Extended) and answer-time fetchers (OAI-SearchBot, Claude-User, ChatGPT-User) are different user agents with different consequences. Blocking the first does not block the second.
- **You do not need new files to appear in AI answers on Google.** Google states it plainly: "You don't need to create new machine readable files, AI text files, or markup to appear in these features" ([Google AI features](https://developers.google.com/search/docs/appearance/ai-features)). `llms.txt` is a community proposal with real adoption, not a search requirement.
- **X removed its preview tool.** The card validator no longer previews. Test by drafting a post in the X composer, or use a third-party checker.
- **Mastodon added author credit.** `fediverse:creator` puts a "more from" byline on your link cards, and it only works if you also list the domain in your Mastodon profile settings.
- **Frameworks now own metadata.** In Next.js, hand-writing `<head>` tags is the wrong move: the metadata API merges parent and child values and generates the tags, and it changes how they stream to bots.

## Definition of done

A page's metadata is finished when:

- The rendered HTML, fetched with JavaScript off, contains title, description, canonical, and the full `og:` set.
- Title and description describe this page and no other page on the site.
- Canonical is absolute, resolves with HTTP 200, and points at a page that is not `noindex`.
- The share image loads over `https://`, is 1200 x 630, is under 300 KB, and has alt text.
- The card looks right in the Facebook Sharing Debugger, the LinkedIn Post Inspector, a Slack or Discord test channel, and an X draft post.
- Structured data passes Google's Rich Results Test with no errors, and every marked-up fact is visible on the page.
- `robots.txt` allows the page, and the sitemap lists it with an honest `lastmod`.
- Search Console's URL Inspection shows the canonical Google picked, and it matches yours.
- Crawler rules for AI training and AI answers reflect a decision someone actually made, rather than a copied default.

## Report map

- Head essentials and indexing control
- Open Graph and social cards
- Structured data
- Icons, PWA, app, and browser tags
- Crawler and AI agent controls
- Implementation, testing, and failure modes
- Glossary
- Methodology, coverage, limitations, and sources

---

<!-- 11archive-source: 01-head-essentials-and-indexing.md -->

# Head essentials and indexing control

What every page declares about itself, and how you tell search engines what to crawl, index, and show.

## 1. The document basics

| Tag | Value to use | Notes |
|---|---|---|
| `<html lang>` | `en`, `pt-PT`, `zh-Hans` | Language of the page's main text. Helps screen readers and translation |
| `<meta charset>` | `utf-8` | Put it first inside `<head>`. Browsers stop looking for it after the opening bytes |
| `<title>` | Unique per page | Google's top source for the result title |
| `<meta name="description">` | Unique per page | Feeds the grey snippet text under the title |
| `<meta name="viewport">` | `width=device-width, initial-scale=1` | Controls mobile layout |

### Viewport values

Every directive the viewport tag accepts, from [MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Guides/Viewport_meta_element):

| Directive | Values | Use |
|---|---|---|
| `width` | `device-width` or 1 to 10000 | Almost always `device-width` |
| `height` | `device-height` or 1 to 10000 | Rarely needed |
| `initial-scale` | 0.0 to 10.0 | Set to `1` |
| `minimum-scale` / `maximum-scale` | 0.0 to 10.0 | Leave unset |
| `user-scalable` | `yes` / `no` | Leave unset. `no` blocks zoom |
| `viewport-fit` | `auto` / `contain` / `cover` | `cover` draws under a phone notch |
| `interactive-widget` | `resizes-visual` / `resizes-content` / `overlays-content` | How the on-screen keyboard affects layout |

MDN is explicit that `user-scalable=no` and `maximum-scale=1.0` harm people with low vision. WCAG expects at least 2x zoom.

## 2. Title and description, as Google actually treats them

Google's [title link documentation](https://developers.google.com/search/docs/appearance/title-link) lists the sources it draws the result title from, in order of weight:

1. `<title>`
2. The main visible title on the page
3. `<h1>` and other headings
4. `og:title`
5. Styled, prominent text
6. Page body text
7. Anchor text of links pointing at the page
8. Structured data

**There is no character limit.** Google says the title link "is truncated in Google Search results as needed, typically to fit the device width". The same wording appears for descriptions. Treat roughly 60 characters for titles and roughly 155 for descriptions as a *display budget*, not a rule: put the important words first so truncation costs you nothing.

Google's named title problems: missing titles, boilerplate repeated across pages, keyword-stuffed titles, titles in a different language from the page, inaccurate titles, and a site name repeated so often it crowds out the specific part.

For descriptions, Google's [snippet documentation](https://developers.google.com/search/docs/appearance/snippet) says it uses the meta description only when it "might give users a more accurate description of the page than content taken directly from the page". Different searches on the same page can produce different snippets. Programmatic generation is fine for large sites as long as the result is readable and specific.

## 3. Canonical: one page, one address

The problem: `example.com/shoes`, `example.com/shoes?ref=twitter`, and `example.com/shoes/` can all serve the same page. Left alone, their signals split.

```html
<link rel="canonical" href="https://example.com/shoes">
```

For files that are not HTML, such as a PDF, use the HTTP header instead:

```
Link: <https://example.com/white-paper.pdf>; rel="canonical"
```

Google's [canonicalization guide](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls) ranks the signals it weighs:

1. Redirects (strongest)
2. `rel="canonical"`
3. Presence in the sitemap
4. Internal links
5. `hreflang` groups
6. HTTPS over HTTP

Rules that matter:

- Put a canonical on the canonical page too, pointing at itself.
- Use absolute URLs. No relative paths, no `#fragments`.
- Do not give the same page different canonicals through different methods.
- Do not use `robots.txt` or the removal tool to pick a canonical.
- Do not combine `noindex` with a canonical on a duplicate page.
- Prefer the HTML source over JavaScript. If JavaScript sets it, it must set the same value the HTML already had.

Google treats your canonical as a strong hint, not a command. Search Console's URL Inspection shows the canonical Google actually chose.

## 4. Robots directives: what to index and what to show

Two ways to say the same thing. Use the meta tag for HTML pages, the header for everything else.

```html
<meta name="robots" content="noindex, nofollow">
```

```
X-Robots-Tag: noindex, nofollow
```

Full directive list, from [Google's robots meta tag specification](https://developers.google.com/search/docs/crawling-indexing/robots-meta-tag):

| Directive | Effect |
|---|---|
| `all` | Default. No restrictions |
| `noindex` | Keep this page out of search results |
| `nofollow` | Do not crawl links on this page |
| `none` | Same as `noindex, nofollow` |
| `nosnippet` | No text snippet and no video preview |
| `indexifembedded` | Allow indexing when embedded in an iframe, despite `noindex` |
| `max-snippet:[n]` | Cap snippet length. `0` means none, `-1` lets Google choose |
| `max-image-preview:[none\|standard\|large]` | Cap image preview size |
| `max-video-preview:[n]` | Cap video preview seconds. `0` means a static image, `-1` means unlimited |
| `notranslate` | Do not offer a translated result |
| `noimageindex` | Do not index images on this page |
| `unavailable_after:[date]` | Drop the page after a date. Accepts RFC 822, RFC 850, or ISO 8601 |

You can target one crawler by name: `<meta name="googlebot" content="noindex">`. Google also honours `googlebot-news`.

**Conflicts resolve to the stricter rule.** Google's example: `max-snippet:50` alongside `nosnippet` produces no snippet at all.

To exclude part of a page from snippets rather than the whole page, use the `data-nosnippet` attribute on a `span`, `div`, or `section`:

```html
<p>Public summary. <span data-nosnippet>Internal note, keep out of snippets.</span></p>
```

It is a boolean attribute: `data-nosnippet="false"` still excludes the content.

**The trap:** a page blocked in `robots.txt` is never downloaded, so its `noindex` is never read. To remove a page from search, allow crawling and serve `noindex`.

## 5. Multiple languages: hreflang

Tell search engines which translations of a page exist, so a Portuguese reader gets the Portuguese one.

```html
<link rel="alternate" hreflang="en" href="https://example.com/en/page">
<link rel="alternate" hreflang="pt-PT" href="https://example.com/pt/page">
<link rel="alternate" hreflang="x-default" href="https://example.com/">
```

From [Google's localized versions guide](https://developers.google.com/search/docs/specialty/international/localized-versions):

- **Return links are mandatory.** If page X lists page Y, page Y must list page X. Missing return links make Google ignore the whole set.
- **Each page must list itself.**
- **Use full URLs**, including `https://`.
- Language codes follow ISO 639-1 (`en`, `de`). Region codes follow ISO 3166-1 Alpha 2 (`en-GB`, `de-CH`). Chinese scripts use ISO 15924 (`zh-Hans`, `zh-Hant`).
- `x-default` is the fallback for visitors whose language matches nothing you offer. A language chooser page is the natural target.
- Region alone is invalid. `be` is Belarusian the language, not Belgium.
- `EU`, `UN`, and `UK` are not valid region codes. Britain is `GB`.

Same information can go in an HTTP header (for PDFs) or inside the XML sitemap with the `xhtml:link` element.

## 6. robots.txt: what may be crawled

One plain text file at the site root. From [Google's robots.txt specification](https://developers.google.com/search/docs/crawling-indexing/robots/robots_txt):

```
User-agent: *
Disallow: /admin/
Allow: /admin/public-page

Sitemap: https://example.com/sitemap.xml
```

| Property | Value |
|---|---|
| Location | Site root only |
| Encoding | UTF-8 plain text |
| Size limit | 500 KiB |
| Cache | Up to 24 hours |
| On 4xx (except 429) | Google assumes no restrictions |
| On 5xx | Google stops crawling for 12 hours, uses the cached file for 30 days, then treats the file as absent |
| Wildcards | `*` matches any characters, `$` anchors the end of a URL |
| Rule precedence | The most specific rule by path length wins; on a tie, the least restrictive wins |
| Sitemap lines | Any number, absolute URLs |

**What robots.txt cannot do:** stop a URL appearing in search. Google's own words: it "can't index the content of pages which are disallowed for crawling, but it may still index the URL".

## 7. Sitemaps: helping discovery

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://example.com/page</loc>
    <lastmod>2026-08-11</lastmod>
  </url>
</urlset>
```

From [Google's sitemap guide](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap):

- Limits per file: 50,000 URLs or 50 MB uncompressed. Split with a sitemap index beyond that.
- UTF-8 encoded, full URLs, XML-escaped values.
- **Google uses `lastmod`** when it is "consistently and verifiably accurate". Bumping it for a copyright-year change teaches Google to ignore it.
- **Google ignores `priority` and `changefreq`.** Do not spend time on them.
- Submit through Search Console, through the `Sitemap:` line in robots.txt, or through the Search Console API. Submitting is advisory; it does not guarantee a download.

## 8. Faster updates: IndexNow

IndexNow pushes a "this URL changed" ping instead of waiting for a crawl. Bing and Yandex participate, and submissions are shared between participating engines. From [the IndexNow documentation](https://www.indexnow.org/documentation):

- Key: 8 to 128 characters, using `a-z`, `A-Z`, `0-9`, and dashes.
- Host the key in a UTF-8 text file, normally `https://example.com/<key>.txt`.
- The key file's directory limits which URLs you may submit.

Single URL:

```
https://api.indexnow.org/indexnow?url=https://example.com/page&key=YOUR_KEY
```

Bulk, up to 10,000 URLs per request:

```http
POST /indexnow HTTP/1.1
Content-Type: application/json; charset=utf-8

{
  "host": "example.com",
  "key": "YOUR_KEY",
  "keyLocation": "https://example.com/YOUR_KEY.txt",
  "urlList": ["https://example.com/a", "https://example.com/b"]
}
```

Response codes: `200` accepted, `202` key check pending, `400` bad format, `403` key invalid, `422` URL does not match the host, `429` too many requests.

## 9. When metadata is added by JavaScript

Googlebot renders JavaScript, in three stages: crawl, render, index. Pages that return HTTP 200 are queued for rendering in a headless browser, and that queue can add seconds or much longer. From [Google's JavaScript SEO basics](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics):

- Titles and descriptions set by JavaScript **are** picked up during rendering.
- Canonicals set by JavaScript are picked up, but you "shouldn't use JavaScript to change the canonical URL to something else than the URL you specified as the canonical URL in the original HTML".
- A `noindex` in the original HTML can make Google skip rendering, so removing that `noindex` with JavaScript may never take effect.
- Use the History API, not URL fragments, for single-page apps.
- Fingerprint asset filenames. Googlebot caches aggressively and may ignore cache headers.

Social and chat preview crawlers are a different story: treat them as HTML-only. Server-side rendering or pre-rendering is the safe default for anything that must appear in a preview card.

## 10. Head tags worth skipping

| Tag | Verdict |
|---|---|
| `<meta name="keywords">` | Ignored by Google for many years. No benefit |
| `<meta name="revisit-after">` | Never supported by any major engine |
| `<meta http-equiv="X-UA-Compatible">` | Was for Internet Explorer. Dead |
| `<meta name="author">` as an SEO signal | Fine as document metadata, not a ranking input. Use `Article` structured data for authorship |
| `<meta http-equiv="refresh">` | Use a server redirect instead. Google supports the tag but calls redirects better |
| `msapplication-*` | Next.js documents these as "no longer supported in Chromium builds of Microsoft Edge, and thus no longer needed" |

Two `<meta>` tags Google does support and people forget:

```html
<meta name="google" content="nopagereadaloud">      <!-- block text-to-speech reading -->
<meta name="googlebot" content="notranslate">        <!-- do not offer translated results -->
<meta name="google-site-verification" content="...">  <!-- Search Console ownership -->
<meta name="rating" content="adult">                 <!-- SafeSearch labelling -->
```

## Sources

- [Meta tags and attributes Google supports](https://developers.google.com/search/docs/crawling-indexing/special-tags)
- [Robots meta tag specifications](https://developers.google.com/search/docs/crawling-indexing/robots-meta-tag)
- [Title links](https://developers.google.com/search/docs/appearance/title-link)
- [Snippets](https://developers.google.com/search/docs/appearance/snippet)
- [Canonicalization](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls)
- [Localized versions](https://developers.google.com/search/docs/specialty/international/localized-versions)
- [robots.txt specification](https://developers.google.com/search/docs/crawling-indexing/robots/robots_txt)
- [Build a sitemap](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap)
- [JavaScript SEO basics](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics)
- [IndexNow documentation](https://www.indexnow.org/documentation)
- [MDN viewport meta element](https://developer.mozilla.org/en-US/docs/Web/HTML/Guides/Viewport_meta_element)

---

<!-- 11archive-source: 02-open-graph-and-social-cards.md -->

# Open Graph and social cards

How a pasted link turns into a card with a title, a blurb, and a picture, and which tags each platform reads.

## 1. What Open Graph is

Open Graph is a small vocabulary of `<meta>` tags, published at [ogp.me](https://ogp.me/), that lets a page describe itself to any program that wants to display it as an object rather than as a web page. Facebook created it; almost every chat app and social network now reads it.

It uses `property=`, not `name=`:

```html
<meta property="og:title" content="The Rock">
```

Four properties are required by the specification:

| Property | Meaning | Example |
|---|---|---|
| `og:title` | The name of the thing, without site branding | `The Rock` |
| `og:type` | What kind of thing it is | `video.movie` |
| `og:image` | A picture representing it | `https://example.com/rock.jpg` |
| `og:url` | Its permanent address | `https://www.imdb.com/title/tt0117500/` |

## 2. The full Open Graph vocabulary

### Core optional properties

| Property | Purpose |
|---|---|
| `og:description` | One or two sentences about the page |
| `og:site_name` | The name of the whole site, for example `IMDb` |
| `og:locale` | Language and territory, format `language_TERRITORY`, default `en_US` |
| `og:locale:alternate` | Other language versions available. Repeat the tag |
| `og:determiner` | The word before the title: `a`, `an`, `the`, blank, or `auto` |
| `og:audio` | A sound file for the page |
| `og:video` | A video file for the page |

### Structured sub-properties

Images and videos take a set of child tags. Each new root tag starts a fresh set.

```html
<meta property="og:image" content="https://example.com/og.jpg">
<meta property="og:image:secure_url" content="https://example.com/og.jpg">
<meta property="og:image:type" content="image/jpeg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="A shiny red apple with a bite taken out">
```

`og:video` accepts the same children except `alt`. `og:audio` accepts only `url`, `secure_url`, and `type`, because sound has no dimensions.

**Arrays:** repeat the root tag for multiple values. The specification says the first one takes priority when a consumer wants only one. That is why one `og:image` per page is the safe choice.

### Object types and their extra properties

| `og:type` | Extra properties |
|---|---|
| `website` | None beyond the required four |
| `article` | `article:published_time`, `article:modified_time`, `article:expiration_time`, `article:author`, `article:section`, `article:tag` |
| `book` | `book:author`, `book:isbn`, `book:release_date`, `book:tag` |
| `profile` | `profile:first_name`, `profile:last_name`, `profile:username`, `profile:gender` |
| `video.movie`, `video.episode`, `video.tv_show`, `video.other` | `video:actor`, `video:actor:role`, `video:director`, `video:writer`, `video:duration`, `video:release_date`, `video:tag`, plus `video:series` for episodes |
| `music.song`, `music.album`, `music.playlist`, `music.radio_station` | `music:duration`, `music:album`, `music:album:disc`, `music:album:track`, `music:musician`, `music:song`, `music:creator`, `music:release_date` |
| `payment.link` (beta) | `payment:description`, `payment:currency`, `payment:amount`, `payment:expires_at`, `payment:status`, `payment:id`, `payment:success_url` |

An article page in practice:

```html
<meta property="og:type" content="article">
<meta property="article:published_time" content="2026-08-11T09:00:00Z">
<meta property="article:modified_time" content="2026-08-11T14:30:00Z">
<meta property="article:author" content="https://example.com/authors/jane">
<meta property="article:section" content="Engineering">
<meta property="article:tag" content="metadata">
```

### Namespaces

Built-in types use a dot (`music.song`). Custom types use a colon and need a declared prefix:

```html
<head prefix="my_namespace: https://example.com/ns#">
<meta property="og:type" content="my_namespace:my_type">
```

The `prefix="og: https://ogp.me/ns#"` declaration on `<html>` appears in the specification's example. In practice every consumer parses `og:` tags without it, so it is optional in the wild.

## 3. X (Twitter) cards

X reads its own `twitter:` tags, and falls back to Open Graph when they are missing. Note the attribute change: `name=`, not `property=`.

```html
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:site" content="@example">
<meta name="twitter:creator" content="@janedoe">
<meta name="twitter:title" content="Page title">
<meta name="twitter:description" content="One or two sentences.">
<meta name="twitter:image" content="https://example.com/og.jpg">
<meta name="twitter:image:alt" content="What the image shows.">
```

| Card type | What it renders |
|---|---|
| `summary` | Small square thumbnail beside the text |
| `summary_large_image` | Full-width image above the text |
| `app` | A direct app-install card |
| `player` | An embedded video or audio player |

Other tags in the family: `twitter:site:id`, `twitter:creator:id`, `twitter:player`, `twitter:player:width`, `twitter:player:height`, `twitter:player:stream`, and the `twitter:app:name:*`, `twitter:app:id:*`, `twitter:app:url:*` sets for iPhone, iPad, and Google Play. The [Next.js metadata API](https://nextjs.org/docs/app/api-reference/functions/generate-metadata) documents and generates all of them, which is useful independent confirmation of the tag names.

**Evidence note:** X's own card documentation returned HTTP 402 (payment required) on 2026-08-11, so the numbers below are second-hand and should be re-checked before you rely on them.

Second-hand image constraints for `summary_large_image`: minimum 300 x 157 pixels, maximum 4096 x 4096, under 5 MB, in JPG, PNG, WEBP, or GIF, centre-cropped to roughly 2:1.

**X's preview tool is gone.** The card validator stopped previewing in 2022. To check a card, start a draft post in the X composer, or use a third-party preview tool.

## 4. Which platform reads what

| Consumer | Tags it reads | Image handling | Refresh path |
|---|---|---|---|
| **Facebook** | `og:url`, `og:title`, `og:description`, `og:image`, `fb:app_id` | Cached by image URL. `og:image:width`/`height` let it render on the first share | Sharing Debugger |
| **LinkedIn** | `og:title`, `og:description`, `og:image`, `og:url` | 1200 x 627, 1.91:1 (second-hand) | Post Inspector |
| **X** | `twitter:*`, falls back to `og:*` | Centre-cropped to the card shape | No official tool. Draft a post |
| **Slack** | Open Graph and X card metadata (official wording), plus oEmbed for known domains | Follows the card metadata | Re-paste after cache expiry, or use an app unfurl |
| **Discord** | `og:*` plus `twitter:card` for large-versus-thumbnail, and `theme-color` for the card's left border stripe (second-hand) | HTTPS only (second-hand) | Cache expiry |
| **WhatsApp** | `og:title`, `og:description`, `og:url` required and non-empty; `og:image` optional | Under 600 KB, at least 300 px wide, aspect no taller than 4:1 | Re-send after cache expiry |
| **Telegram** | `og:title`, `og:description`, `og:image` (second-hand) | Large preview needs roughly 1200 x 630 (second-hand) | `@WebpageBot` |
| **Pinterest** | Open Graph or schema.org, whichever is present | Rich Pin layout by type | Rich Pins validator |
| **Mastodon** | `og:*` plus `fediverse:creator` for the author byline | Standard card | Re-fetch on next share |
| **Google** | `og:title` as one title source, `og:site_name` as one site-name source. Does **not** use `og:description` for snippets | Search image previews come from page images, not `og:image` | URL Inspection |

### The details worth knowing per platform

**Facebook.** Its [webmasters documentation](https://developers.facebook.com/docs/sharing/webmasters/) names four essential tags and says `og:url` "should be the undecorated URL, without session variables, user identifying parameters, or counters". Mobile and desktop versions should share one canonical so engagement counts add up. `fb:app_id` is what unlocks Facebook Insights traffic data. The [best practices page](https://developers.facebook.com/docs/sharing/best-practices/) recommends images at least 1080 pixels wide for high-resolution screens, a 1.91:1 rectangle, and running the URL through the Sharing Debugger to pre-fetch metadata whenever the image changes.

**WhatsApp.** The only platform publishing precise, official numbers ([Meta business messaging docs](https://developers.facebook.com/documentation/business-messaging/whatsapp/link-previews/)): tags must appear within the first 300 KB of the page, the image must be under 600 KB and at least 300 pixels wide with an aspect ratio no taller than 4:1, and `og:title`, `og:description`, `og:url` must all be present and non-empty. The description "80 characters will suffice". WhatsApp sends an `Accept-Language` header, so you may localize the preview. Allow up to 10 seconds in the composer for the preview to appear.

**Slack.** [Slack's documentation](https://docs.slack.dev/messaging/unfurling-links-in-messages/) describes two systems. Classic unfurling reads "common OpenGraph and X (formerly known as Twitter) Card metadata" and renders an approximation. App unfurling fires a `link_shared` event to an app registered for your domain, which then posts a custom Block Kit preview through `chat.unfurl`. Media links unfurl by default; text pages need the `unfurl_links` parameter when posted by an app.

**Discord.** Discord publishes no formal specification. Community documentation consistently reports that it reads Open Graph, uses `twitter:card` to decide between a large image and a right-hand thumbnail, colours the card's left border from the `theme-color` meta tag, and refuses plain HTTP image URLs. Treat these as second-hand.

**Pinterest.** [Rich Pins](https://developers.pinterest.com/docs/web-features/rich-pins-overview/) read Open Graph or schema.org. Three types exist: Article, Product, Recipe. When a page carries markup for several, Pinterest applies Product first, then Recipe, then Article. Opt out with:

```html
<meta name="pinterest-rich-pin" content="false">
```

**Mastodon.** Version 4.3 added `fediverse:creator`, which puts a "more from" byline linking to the author's fediverse profile on the link card (second-hand):

```html
<meta name="fediverse:creator" content="@jane@mastodon.social">
```

It only takes effect after the domain is added to the "Websites allowed to credit you" author-attribution field in the account's verification settings.

## 5. The share image

One image satisfies everything:

| Property | Value | Why |
|---|---|---|
| Dimensions | 1200 x 630 | Fits the 1.91:1 shape Facebook and LinkedIn render and X's large card |
| Format | JPG or PNG | Universally supported. WebP and GIF are unreliable on Telegram |
| File size | Under 300 KB | Clears WhatsApp's limit with margin |
| Protocol | `https://` | Discord rejects plain HTTP |
| URL | Absolute | Relative paths break every platform |
| Alt text | Always | `og:image:alt` is the only accessible description in the card |

Two habits that pay off:

- **Version the filename.** Facebook caches by image URL, so `og-v2.jpg` is a guaranteed refresh where re-uploading `og.jpg` is not.
- **Declare width and height.** Meta says these let the crawler "render the image immediately without having to asynchronously download and process it", and Discord uses them to pick its layout.

Keep important text inside the middle 80% of the image. Platforms crop to their own shapes, and X centre-crops.

## 6. oEmbed: when your page should embed elsewhere

Open Graph describes a page. oEmbed hands another site the actual HTML to embed it, which is how a YouTube link becomes a playing video rather than a picture. It matters if you publish embeddable content: videos, charts, interactive widgets.

Discovery goes in `<head>`:

```html
<link rel="alternate" type="application/json+oembed"
      href="https://example.com/oembed?url=https%3A%2F%2Fexample.com%2Fvideo%2F123&format=json"
      title="Video oEmbed Profile">
```

The `type` must be `application/json+oembed` or `text/xml+oembed`. Consumers call your endpoint with `url` (required), and optionally `maxwidth`, `maxheight`, and `format`.

| Response type | Required fields |
|---|---|
| `photo` | `url`, `width`, `height` |
| `video` | `html`, `width`, `height` |
| `link` | none beyond `type` and `version` |
| `rich` | `html`, `width`, `height` |

Every response carries `type` and `version` (always `"1.0"`), plus optional `title`, `author_name`, `provider_name`, and thumbnails. Full specification at [oembed.com](https://oembed.com/).

## 7. Common card failures and their fixes

| Symptom | Cause | Fix |
|---|---|---|
| No image anywhere | `og:image` is a relative path | Use the full `https://` URL |
| Card empty on Facebook and Slack, fine on Google | Tags injected by JavaScript | Render metadata server-side |
| Old image keeps appearing | Platform cache keyed on URL | Publish at a new filename, then re-run the debugger |
| Image missing only on WhatsApp | File over 600 KB, or tags past the first 300 KB of HTML | Compress the image, move meta tags to the top of `<head>` |
| Image missing only on Discord | `http://` image URL | Serve over HTTPS |
| Small thumbnail instead of a big image on X or Discord | `twitter:card` absent or set to `summary` | Set `summary_large_image` |
| Wrong page title in the card | Duplicate `og:title` tags | Keep one; the first wins |
| Card shows the home page for every link | `og:url` hardcoded to the site root | Emit the page's own canonical URL |
| Preview works logged in, fails when shared | Crawler blocked by robots.txt, a firewall, or bot protection | Allow the platform's user agent |

## Sources

- [The Open Graph protocol](https://ogp.me/)
- [Facebook sharing for webmasters](https://developers.facebook.com/docs/sharing/webmasters/)
- [Facebook sharing best practices](https://developers.facebook.com/docs/sharing/best-practices/)
- [WhatsApp link previews](https://developers.facebook.com/documentation/business-messaging/whatsapp/link-previews/)
- [Slack: unfurling links in messages](https://docs.slack.dev/messaging/unfurling-links-in-messages/)
- [Pinterest Rich Pins overview](https://developers.pinterest.com/docs/web-features/rich-pins-overview/)
- [oEmbed specification](https://oembed.com/)
- [Next.js generateMetadata reference](https://nextjs.org/docs/app/api-reference/functions/generate-metadata) (used to confirm X and app-link tag names)
- Second-hand: X card image constraints, LinkedIn image sizes and cache window, Discord behaviour, Telegram behaviour, Mastodon `fediverse:creator`. See methodology for the specific pages.

---

<!-- 11archive-source: 03-structured-data.md -->

# Structured data

Facts about the page written in a machine format, so a search engine does not have to infer them from prose.

## 1. What it is and why it is separate

A `<meta name="description">` tag gives a search engine a sentence. Structured data gives it typed fields: this is a recipe, it takes 45 minutes, it has 312 reviews averaging 4.6 stars. That difference is what unlocks the richer result formats: star ratings, event dates, breadcrumb trails, and job listings.

Google supports three notations. It [recommends JSON-LD](https://developers.google.com/search/docs/appearance/structured-data/sd-policies), a JSON block in a script tag that sits apart from your markup:

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "How metadata actually works"
}
</script>
```

The alternatives, Microdata and RDFa, weave attributes into the HTML itself. Both are supported and both are harder to maintain. Use JSON-LD unless something forces your hand.

## 2. The rules that get sites penalised

From Google's [structured data general guidelines](https://developers.google.com/search/docs/appearance/structured-data/sd-policies):

- **Only mark up what a visitor can see.** "Don't mark up content that is not visible to readers of the page."
- **Do not mark up irrelevant or misleading content**, such as invented reviews.
- **Do not block the markup.** If `robots.txt` or `noindex` keeps Google out, the structured data does nothing.
- **Include every required property** for the feature you want, and add the recommended ones to improve your chances.
- **Use the most specific type available.** `Recipe`, not `CreativeWork`.

Breaking these earns a manual action: the site loses rich-result eligibility. Normal rankings are not directly affected, but the visible result gets plainer.

And a caveat worth saying out loud: correct markup never guarantees a rich result. Google decides per query.

## 3. The features Google documents

Every type in Google's [search gallery](https://developers.google.com/search/docs/appearance/structured-data/search-gallery), with its schema.org type:

| Feature | schema.org type | What it enables |
|---|---|---|
| Article | `Article` | News, sports, and blog articles in various rich formats |
| Breadcrumb | `BreadcrumbList` | The hierarchy path shown above the result |
| Carousel | `ItemList` | A scrollable gallery of items from one site |
| Course list | `Course` | Courses with titles, providers, descriptions |
| Dataset | `Dataset` | Inclusion in Google Dataset Search |
| Discussion forum | `DiscussionForumPosting` | Threaded discussion results |
| Education Q&A | `FAQPage` | Study flashcards and question-answer pairs |
| Employer aggregate rating | `AggregateRating` | A hiring organisation's rating |
| Event | `Event` | Dates, times, and locations in the result |
| Image metadata | `CreativeWork` | Creator, credit, and licence for images |
| Job posting | `JobPosting` | The interactive job-search result |
| Local business | `LocalBusiness` | Hours, ratings, directions, booking |
| Math solver | `MathSolver` | Step-by-step problem solutions |
| Movie | `Movie` | Movie carousels |
| Organization | `Organization` | Logo, name, address, contact details |
| Product | `Product` | Price, availability, review ratings |
| Profile page | `ProfilePage` | Results about one person or organisation |
| Q&A | `QAPage` | Question-and-answer pages |
| Recipe | `Recipe` | Recipe results and carousels |
| Review snippet | `Review` | A rating excerpt in the result |
| Software app | `SoftwareApplication` | App ratings, description, download link |
| Speakable | `Speakable` | News read aloud on voice devices |
| Subscription and paywalled content | `CreativeWork` | Marks paid content so it is not treated as cloaking |
| Vacation rental | `VacationRental` | Property details and amenities |
| Video | `VideoObject` | Playable video, key moments, live streams |

## 4. The four blocks nearly every site should ship

### Organization, on the home page

Place it once, on the home page or a single "about" page. Not on every page.

```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "url": "https://www.example.com",
  "name": "Example Corporation",
  "logo": "https://www.example.com/images/logo.png",
  "description": "Example makes high-quality widgets.",
  "email": "contact@example.com",
  "telephone": "+351-000-000-000",
  "sameAs": [
    "https://www.linkedin.com/company/example",
    "https://github.com/example"
  ],
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Rua Exemplo 99",
    "addressLocality": "Lisbon",
    "addressCountry": "PT",
    "postalCode": "1000-001"
  }
}
```

Logo requirements: at least 112 x 112 pixels, crawlable, indexable, and legible on a white background. Other recommended properties: `contactPoint`, `foundingDate` (ISO 8601), `numberOfEmployees`, `vatID`, `iso6523Code`.

### WebSite, for the site name in results

Google shows a site name beside your result. Its [site names documentation](https://developers.google.com/search/docs/appearance/site-names) ranks the signals: `WebSite` structured data first, then `og:site_name`, then `<title>`, then headings and page text, then how other sites refer to you.

```json
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Example",
  "alternateName": ["Example Corp", "EXC"],
  "url": "https://www.example.com/"
}
```

Rules: home page only (the domain or subdomain root, not a subdirectory), one name per site, home page must be crawlable, and the name should match what your title and headings say. Changes take days to weeks. If your preferred name is rejected, Google weighs `alternateName` strongly.

### BreadcrumbList, on inner pages

```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {"@type": "ListItem", "position": 1, "name": "Books", "item": "https://example.com/books"},
    {"@type": "ListItem", "position": 2, "name": "Science Fiction", "item": "https://example.com/books/sciencefiction"},
    {"@type": "ListItem", "position": 3, "name": "Award Winners"}
  ]
}
```

The last item may omit `item`; Google then uses the current page's URL. A page can declare several trails by putting multiple `BreadcrumbList` objects in a JSON array. Google's advice: model the path a typical user takes, not your URL folder structure.

### Article, on posts and news

```json
{
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": "How metadata actually works",
  "image": [
    "https://example.com/photos/1x1/photo.jpg",
    "https://example.com/photos/4x3/photo.jpg",
    "https://example.com/photos/16x9/photo.jpg"
  ],
  "datePublished": "2026-08-11T09:00:00+01:00",
  "dateModified": "2026-08-11T14:30:00+01:00",
  "author": [
    {"@type": "Person", "name": "Jane Doe", "url": "https://example.com/authors/jane"}
  ]
}
```

Google's [Article reference](https://developers.google.com/search/docs/appearance/structured-data/article) has **no required properties**. Recommended: `headline`, `image`, `datePublished`, `dateModified`, `author`.

- Types accepted: `Article`, `NewsArticle`, `BlogPosting`.
- Images: supply 16:9, 4:3, and 1:1 crops, each at least 50,000 total pixels, crawlable, and showing the article's actual subject rather than a logo.
- Dates: ISO 8601 with a timezone.
- Authors: list each person as a separate entry. Keep the publisher name, job titles, honorifics, and phrases like "posted by" out of `author.name`.

## 5. Structured data and AI answers

Google is explicit that AI Overviews and AI Mode need nothing extra: "There's also no special schema.org structured data that you need to add" ([AI features](https://developers.google.com/search/docs/appearance/ai-features)). Structured data still earns you the rich formats in ordinary search, which is reason enough.

## 6. How to validate

| Tool | Checks |
|---|---|
| [Rich Results Test](https://search.google.com/test/rich-results) | Whether Google can produce a rich result from your markup, on a live URL or pasted code |
| [Schema Markup Validator](https://validator.schema.org/) | Whether the markup is valid schema.org, regardless of Google's features |
| Search Console → Enhancements | Errors and warnings across your indexed pages over time |
| Search Console → URL Inspection | What Google's rendered version of a live page actually contains |

Test the rendered page, not the template. If a JavaScript framework injects the JSON-LD, confirm it survives rendering.

## 7. Practical guidance

- Start with `Organization` and `WebSite` on the home page, and `BreadcrumbList` on inner pages. Those three are cheap and apply everywhere.
- Add a page-type block (`Article`, `Product`, `Event`, `Recipe`) only where that type genuinely describes the page.
- Generate the JSON from the same data that renders the page. Hand-maintained JSON drifts out of sync, and drift is what breaks the "must be visible" rule.
- One JSON-LD script per page is easiest to read, using `@graph` when several objects belong together, but multiple scripts are valid.
- Do not mark up an `AggregateRating` you cannot show on the page. Invented ratings are the fastest route to a manual action.

## Sources

- [Structured data general guidelines](https://developers.google.com/search/docs/appearance/structured-data/sd-policies)
- [Search gallery of structured data features](https://developers.google.com/search/docs/appearance/structured-data/search-gallery)
- [Organization structured data](https://developers.google.com/search/docs/appearance/structured-data/organization)
- [Site names in Google Search](https://developers.google.com/search/docs/appearance/site-names)
- [Breadcrumb structured data](https://developers.google.com/search/docs/appearance/structured-data/breadcrumb)
- [Article structured data](https://developers.google.com/search/docs/appearance/structured-data/article)
- [AI features and your website](https://developers.google.com/search/docs/appearance/ai-features)

---

<!-- 11archive-source: 04-icons-pwa-app-and-browser-tags.md -->

# Icons, PWA, app, and browser tags

The tags that control the tab icon, the home-screen install, the browser chrome colour, the app banner, and what your links leak to other sites.

## 1. Favicons

The small icon in the browser tab, the bookmark list, and the Google search result.

```html
<link rel="icon" href="/favicon.ico" sizes="32x32">
<link rel="icon" href="/icon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">
```

Four files cover every surface:

| File | Size | Used by |
|---|---|---|
| `favicon.ico` | 32 x 32 (multi-size ICO is fine) | Older browsers, some feed readers |
| `icon.svg` | Vector | Modern browsers, scales to any density |
| `apple-touch-icon.png` | 180 x 180 | iOS home screen |
| `icon-192.png`, `icon-512.png` | 192 and 512 | Referenced from the web app manifest, used by Android |

Google's [favicon documentation](https://developers.google.com/search/docs/appearance/favicon-in-search) adds constraints for search results:

- Accepted `rel` values: `icon` (preferred), `shortcut icon`, `apple-touch-icon`, `apple-touch-icon-precomposed`.
- Any valid favicon format works. Minimum 8 x 8 pixels; Google recommends larger than 48 x 48 so it looks right on every surface.
- **One favicon per hostname.** `www.example.com` and `docs.example.com` can differ. `example.com/news` cannot differ from `example.com`.
- Both Googlebot and Googlebot-Image must be able to fetch the favicon *and* the home page.
- Keep the URL stable. Frequent changes work against you.
- Google may replace an icon it considers inappropriate, and a favicon is never guaranteed to appear.

## 2. Web app manifest

A JSON file that lets a browser install your site as an app: its name, icons, colours, and start screen.

```html
<link rel="manifest" href="/site.webmanifest">
```

Use `crossorigin="use-credentials"` when the manifest sits behind authentication. The `.webmanifest` extension served as `application/manifest+json` is preferred; `.json` with `application/json` also works.

```json
{
  "id": "/",
  "name": "Example Corporation",
  "short_name": "Example",
  "description": "Tools for widget makers.",
  "start_url": "/",
  "scope": "/",
  "display": "standalone",
  "theme_color": "#0b0b0b",
  "background_color": "#0b0b0b",
  "icons": [
    {"src": "/icon-192.png", "sizes": "192x192", "type": "image/png"},
    {"src": "/icon-512.png", "sizes": "512x512", "type": "image/png"},
    {"src": "/icon-maskable.png", "sizes": "512x512", "type": "image/png", "purpose": "maskable"}
  ]
}
```

Members documented on [MDN](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Manifest): `background_color`, `categories`, `description`, `display`, `display_override`, `file_handlers`, `icons`, `id`, `launch_handler`, `name`, `note_taking`, `orientation`, `prefer_related_applications`, `protocol_handlers`, `related_applications`, `scope`, `scope_extensions`, `screenshots`, `serviceworker`, `share_target`, `short_name`, `shortcuts`, `start_url`, `theme_color`, plus localized `*_localized` variants.

MDN notes that `dir`, `lang`, and `iarc_rating_id` are documented but not implemented.

The `maskable` icon matters on Android: without it the system crops your square icon into a circle and clips the edges.

## 3. Browser chrome colour and dark mode

```html
<meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: light)">
<meta name="theme-color" content="#0b0b0b" media="(prefers-color-scheme: dark)">
<meta name="color-scheme" content="light dark">
```

- `theme-color` tints the browser's own interface around the page, mostly on mobile. Community documentation reports Discord also uses it to colour the left border of a link card, which makes it a small branding win in chat.
- `color-scheme` tells the browser which colour schemes the page supports, so form controls and scrollbars match instead of staying stubbornly light.

## 4. Apple-specific tags

### Smart App Banner

A native iOS banner offering your app, shown above the page in Safari.

```html
<meta name="apple-itunes-app" content="app-id=123456789, app-argument=https://example.com/product/42">
```

Parameters (second-hand; Apple's own page did not return readable content on 2026-08-11):

| Parameter | Required | Purpose |
|---|---|---|
| `app-id` | Yes | The App Store identifier |
| `affiliate-data` | No | An iTunes affiliate token |
| `app-argument` | No | A full URL handed to the app on launch, so it opens the same content |

Encode the `app-argument` value, and replace commas with `%2C` because commas separate the parameters.

### Web app on iOS

```html
<meta name="apple-mobile-web-app-title" content="Example">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<meta name="mobile-web-app-capable" content="yes">
<link rel="apple-touch-startup-image" href="/startup.png">
```

## 5. App Links: opening a native app instead of the page

The `al:` family, generated by Next.js as `appLinks`, tells a platform which app can handle this URL.

```html
<meta property="al:ios:url" content="example://product/42">
<meta property="al:ios:app_store_id" content="123456789">
<meta property="al:ios:app_name" content="Example">
<meta property="al:android:package" content="com.example.app">
<meta property="al:android:url" content="example://product/42">
<meta property="al:android:app_name" content="Example">
<meta property="al:web:url" content="https://example.com/product/42">
<meta property="al:web:should_fallback" content="true">
```

## 6. Referrer policy: what your links leak

When someone clicks a link off your site, the browser tells the destination where they came from. The referrer policy decides how much it tells.

```html
<meta name="referrer" content="strict-origin-when-cross-origin">
```

Every value, from [MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Referrer-Policy):

| Value | Behaviour |
|---|---|
| `no-referrer` | Send nothing |
| `no-referrer-when-downgrade` | Full URL, except HTTPS to HTTP |
| `origin` | Only the origin, always |
| `origin-when-cross-origin` | Full URL to your own site, origin only to others |
| `same-origin` | Full URL to your own site, nothing to others |
| `strict-origin` | Origin only, and nothing when security downgrades |
| `strict-origin-when-cross-origin` | Full URL to your own site, origin to others, nothing on downgrade |
| `unsafe-url` | Full URL to everyone. Leaks paths and query strings |

`strict-origin-when-cross-origin` has been the browser default since late 2020. Set it explicitly only when you want a stricter policy; the meta tag sets it for the whole document, and `referrerpolicy` on an individual `<a>` overrides it.

## 7. Ownership verification tags

Each service proves you own the site with its own tag. They are inert otherwise.

```html
<meta name="google-site-verification" content="...">     <!-- Google Search Console -->
<meta name="msvalidate.01" content="...">                <!-- Bing Webmaster Tools -->
<meta name="yandex-verification" content="...">          <!-- Yandex Webmaster -->
<meta name="facebook-domain-verification" content="...">  <!-- Meta Business -->
<meta name="p:domain_verify" content="...">              <!-- Pinterest -->
```

Google's requirement: the value must match exactly what Search Console issued.

## 8. Odds and ends

```html
<meta name="format-detection" content="telephone=no">
```

Stops iOS turning every number that looks like a phone number into a link. Use it when your page shows order numbers or version strings.

```html
<link rel="alternate" type="application/rss+xml" title="Example blog" href="/feed.xml">
```

Feed discovery. Feed readers and some AI crawlers look for this.

```html
<meta name="application-name" content="Example">
<meta name="generator" content="Next.js">
<meta name="creator" content="Jane Doe">
<meta name="publisher" content="Example Corporation">
```

Document metadata from the HTML standard and the WHATWG extensions list. Harmless and occasionally useful; none of them affect ranking.

**Skip:** `msapplication-TileColor` and friends. Next.js documents them as "no longer supported in Chromium builds of Microsoft Edge, and thus no longer needed".

## 9. A complete non-essential head, for reference

```html
<!-- install and appearance -->
<link rel="icon" href="/favicon.ico" sizes="32x32">
<link rel="icon" href="/icon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">
<meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: light)">
<meta name="theme-color" content="#0b0b0b" media="(prefers-color-scheme: dark)">
<meta name="color-scheme" content="light dark">

<!-- privacy and behaviour -->
<meta name="referrer" content="strict-origin-when-cross-origin">
<meta name="format-detection" content="telephone=no">

<!-- discovery -->
<link rel="alternate" type="application/rss+xml" title="Example blog" href="/feed.xml">
<link rel="sitemap" type="application/xml" href="/sitemap.xml">
```

## Sources

- [Favicons in Google Search](https://developers.google.com/search/docs/appearance/favicon-in-search)
- [MDN web app manifest](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Manifest)
- [MDN meta name values](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/meta/name)
- [MDN Referrer-Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Referrer-Policy)
- [Next.js generateMetadata reference](https://nextjs.org/docs/app/api-reference/functions/generate-metadata) (app links, Apple web app tags, `msapplication-*` status)
- Second-hand: Apple Smart App Banner parameters, Discord `theme-color` behaviour. See methodology.

---

<!-- 11archive-source: 05-crawler-and-ai-agent-controls.md -->

# Crawler and AI agent controls

Which programs read your site, what each one does with what it reads, and how to decide per bot.

## 1. The distinction that matters

AI companies run two kinds of crawler, and they have opposite consequences:

- **Training crawlers** download your pages to help build a model. Blocking them costs you nothing today; the trade is your content in exchange for nothing back.
- **Answer-time fetchers** download a page because a user just asked a question and the assistant needs your page to answer it, usually with a link back to you. Blocking these removes you from the answer.

They are separate user agents. Blocking `GPTBot` does not block `OAI-SearchBot`. A site that blocks everything named "AI" often blocks its own referral traffic by accident.

## 2. Google's crawlers

From [Google's common crawlers list](https://developers.google.com/search/docs/crawling-indexing/google-common-crawlers):

| Token | What it does |
|---|---|
| `Googlebot` | Search, Images, Video, News, and Discover, desktop and mobile |
| `Googlebot-Image` | Image indexing |
| `Googlebot-Video` | Video discovery |
| `Googlebot-News` | Google News (uses the standard Googlebot user-agent string in requests) |
| `Storebot-Google` | Google Shopping surfaces |
| `Google-InspectionTool` | Search Console testing tools. Does not affect rankings |
| `GoogleOther` | Generic crawler for internal product research |
| `GoogleOther-Image`, `GoogleOther-Video` | Media variants of the above |
| `Google-CloudVertexBot` | Crawls for customer-built Vertex AI agents. Does not affect Search |
| `Google-Extended` | Controls whether crawled content may train Gemini models and ground its answers |

The important line: `Google-Extended` "does not impact a site's inclusion in Google Search". Blocking it opts you out of Gemini training and grounding while leaving search untouched.

Google warns that user-agent strings can be spoofed, and publishes IP ranges for verification.

## 3. OpenAI's crawlers

From [OpenAI's bots documentation](https://developers.openai.com/api/docs/bots):

| User agent | Purpose | Blocking it means |
|---|---|---|
| `GPTBot` | Content for training foundation models | Your content is not used for training |
| `OAI-SearchBot` | Surfacing sites in ChatGPT search | You disappear from ChatGPT search results, though links may still appear. Changes take about 24 hours |
| `ChatGPT-User` | Fetches a page because a user asked for it | Users cannot have ChatGPT read your page. Not normally blocked, since it is user-initiated |
| `OAI-AdsBot` | Checks landing pages submitted to ChatGPT advertising | Only visits pages you submitted. Not used for training |

IP lists are published per bot at `openai.com/gptbot.json`, `openai.com/searchbot.json`, `openai.com/chatgpt-user.json`, and `openai.com/adsbot.json`.

## 4. Anthropic's crawlers

From [Anthropic's crawler support article](https://support.claude.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler):

| User agent | Purpose |
|---|---|
| `ClaudeBot` | Collects web content that may contribute to model training |
| `Claude-User` | Fetches a page when a user asks Claude to visit it |
| `Claude-SearchBot` | Analyses content to improve the relevance and accuracy of search responses |

Anthropic honours `robots.txt` and supports the `Crawl-delay` extension:

```
User-agent: ClaudeBot
Crawl-delay: 1
```

IP verification list: `https://claude.com/crawling/bots.json`.

## 5. Other AI crawler tokens in circulation

These names are widely reported but were not confirmed against each vendor's own documentation in this pass. Treat the list as a starting point and verify before writing rules you care about.

| Token | Operator | Type |
|---|---|---|
| `PerplexityBot` | Perplexity | Indexing for answers |
| `Perplexity-User` | Perplexity | User-initiated fetch |
| `Applebot-Extended` | Apple | Training opt-out token only, no crawler behind it |
| `Bytespider` | ByteDance | Training |
| `CCBot` | Common Crawl | Open crawl corpus, used by many trainers |
| `Meta-ExternalAgent` | Meta | Training |
| `Cohere-AI` | Cohere | Training |
| `anthropic-ai`, `Claude-Web` | Legacy Anthropic names | Historic, kept in many robots.txt files |

`Google-Extended` and `Applebot-Extended` are control tokens rather than crawlers: nothing fetches under those names, they only exist so you can opt out of training.

## 6. Three robots.txt recipes

Pick one deliberately. Each expresses a different business decision.

**Open to everything.** You want maximum reach and treat AI answers as distribution.

```
User-agent: *
Allow: /

Sitemap: https://example.com/sitemap.xml
```

**Answers yes, training no.** The common middle ground: appear in AI answers with a link back, but do not feed training corpora.

```
User-agent: *
Allow: /

User-agent: GPTBot
Disallow: /

User-agent: ClaudeBot
Disallow: /

User-agent: Google-Extended
Disallow: /

User-agent: Applebot-Extended
Disallow: /

User-agent: CCBot
Disallow: /

User-agent: Bytespider
Disallow: /

# left allowed on purpose: OAI-SearchBot, ChatGPT-User, Claude-User,
# Claude-SearchBot, PerplexityBot, Googlebot

Sitemap: https://example.com/sitemap.xml
```

**Search only.** Nothing but classic search engines.

```
User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /

User-agent: *
Disallow: /

Sitemap: https://example.com/sitemap.xml
```

Two cautions:

- `robots.txt` is a request, not a wall. Well-behaved bots obey; others do not. Use server-side blocking or bot protection when the content genuinely must not be taken.
- Blocking a crawler does not remove already-trained-on content, and it does not remove your URL from search. That needs `noindex` on a crawlable page.

## 7. What Google says about AI answers

From [AI features and your website](https://developers.google.com/search/docs/appearance/ai-features):

- **No new files or markup.** "You don't need to create new machine readable files, AI text files, or markup to appear in these features. There's also no special schema.org structured data that you need to add."
- **Eligibility follows ordinary search.** The page must be indexed and eligible for snippets.
- **Controls are the ones you already have:** `nosnippet`, `data-nosnippet`, `max-snippet`, `noindex`, and robots.txt rules for Googlebot. Note the trade: `nosnippet` keeps you out of AI Overviews and out of ordinary snippets at the same time.
- **Query fan-out.** AI Mode may run several related searches at once, which Google says surfaces "a wider and more diverse set of helpful links".
- **Measurement.** AI-feature traffic appears in Search Console's Performance report under the "Web" search type, with no separate breakdown.

## 8. llms.txt

A community proposal, documented at [llmstxt.org](https://llmstxt.org/), for a Markdown file that gives AI agents a clean map of your site instead of making them parse navigation and scripts.

Format:

- Lives at `/llms.txt`, or in any subdirectory covering the URLs beneath it. The most specific file wins.
- One required element: an H1 with the project or site name.
- Optional: a blockquote summary, free-form Markdown sections, and H2 sections listing files as `[name](url)` links with notes.
- A section titled "Optional" marks links an agent can skip when short on context.

```markdown
# Example Corporation

> Tools for widget makers. This file points agents at the canonical docs.

## Docs

- [Getting started](https://example.com/docs/start.md): install and first run
- [API reference](https://example.com/docs/api.md): every endpoint

## Optional

- [Changelog](https://example.com/changelog.md): release history
```

**Status:** real adoption, no standing. Documentation platforms generate it automatically, and major AI labs publish one for their own docs. It is not a search requirement and Google explicitly says you do not need it. Ship it if you run a documentation site and want agents to read the clean version; skip it otherwise.

## 9. A decision table

| You want | Do this |
|---|---|
| Out of AI training, still in AI answers | Disallow `GPTBot`, `ClaudeBot`, `Google-Extended`, `Applebot-Extended`, `CCBot`, `Bytespider`. Allow the search and user bots |
| Out of AI answers entirely | Disallow the answer-time fetchers too, and consider `nosnippet` for Google |
| Out of Google's AI Overviews specifically | `nosnippet` or a tight `max-snippet`, accepting the same limit on normal snippets |
| Out of Gemini training, still fully in Search | Disallow `Google-Extended` only |
| Page out of search entirely | `noindex` on a page that stays crawlable. Not robots.txt |
| Part of a page out of snippets | `data-nosnippet` on that element |
| Clean, agent-readable docs | Publish `llms.txt` plus Markdown versions of key pages |

## Sources

- [Google common crawlers](https://developers.google.com/search/docs/crawling-indexing/google-common-crawlers)
- [OpenAI bots](https://developers.openai.com/api/docs/bots)
- [Anthropic crawler policy](https://support.claude.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler)
- [Google AI features](https://developers.google.com/search/docs/appearance/ai-features)
- [llms.txt proposal](https://llmstxt.org/)
- [robots.txt specification](https://developers.google.com/search/docs/crawling-indexing/robots/robots_txt)

---

<!-- 11archive-source: 06-implementation-testing-and-failure-modes.md -->

# Implementation, testing, and failure modes

How to ship metadata in a modern framework, how to prove it works, and the fifteen ways it breaks.

## 1. Next.js: the metadata API

Next.js generates the tags for you. Hand-writing `<head>` in an App Router project fights the framework. Two exports do the work.

### Static metadata

```tsx
// app/layout.tsx
import type { Metadata } from 'next'

export const metadata: Metadata = {
  metadataBase: new URL('https://example.com'),
  title: {
    default: 'Example',
    template: '%s | Example',
  },
  description: 'Tools for widget makers.',
  alternates: {
    canonical: '/',
    languages: { 'en-US': '/en-US', 'pt-PT': '/pt-PT' },
  },
  openGraph: {
    type: 'website',
    siteName: 'Example',
    locale: 'en_US',
    images: [{ url: '/og.png', width: 1200, height: 630, alt: 'Example' }],
  },
  twitter: { card: 'summary_large_image', creator: '@example' },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1, 'max-video-preview': -1 },
  },
}
```

### Dynamic metadata

```tsx
// app/blog/[slug]/page.tsx
import type { Metadata } from 'next'

export async function generateMetadata({ params }): Promise<Metadata> {
  const { slug } = await params
  const post = await getPost(slug)
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/blog/${slug}` },
    openGraph: {
      type: 'article',
      publishedTime: post.publishedAt,
      authors: [post.author],
      images: [{ url: post.ogImage, width: 1200, height: 630, alt: post.title }],
    },
  }
}
```

### Behaviour worth memorising

From the [Next.js reference](https://nextjs.org/docs/app/api-reference/functions/generate-metadata):

- **Server Components only.** Metadata resolves on the server before the page renders.
- **You cannot export both** `metadata` and `generateMetadata` from the same route segment.
- **`metadataBase` unlocks relative paths.** Without it, a relative URL in a metadata field is a build error.
- **Merging is shallow.** A child that sets any `openGraph` field replaces the parent's whole `openGraph` object. Share pieces through a variable and spread them.
- **`title.template` applies to children only**, never to the segment that declares it, and needs a `default` alongside it. `title.absolute` ignores the parent template.
- **File conventions win.** `favicon.ico`, `icon.*`, `apple-icon.*`, `opengraph-image.*`, `twitter-image.*`, `robots.ts`, `sitemap.ts`, and `manifest.ts` override the config exports.
- **Streaming metadata.** Since v15.2, Next.js can send the initial UI before `generateMetadata` resolves, appending the tags near `<body>`. It detects HTML-only bots such as `facebookexternalhit` by user agent and blocks rendering for them so their tags land in `<head>`. Override the list with `htmlLimitedBots`, or disable streaming with `htmlLimitedBots: /.*/`.
- **`themeColor`, `colorScheme`, and `viewport` moved** out of `metadata` into `generateViewport` as of v13.2.

### Structured data in Next.js

There is no metadata field for JSON-LD. Render the script in the component:

```tsx
export default async function Page({ params }) {
  const post = await getPost((await params).slug)
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    datePublished: post.publishedAt,
    author: [{ '@type': 'Person', name: post.author }],
  }
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <article>{/* ... */}</article>
    </>
  )
}
```

### Generated share images

`opengraph-image.tsx` renders an image per route at build or request time, so every post gets its own card without a designer in the loop. It emits the `og:image` tags, including width and height, automatically.

## 2. Other stacks, in one line each

| Stack | Where metadata lives |
|---|---|
| Astro | Props on a layout component, or the `astro-seo` component |
| SvelteKit | `<svelte:head>` in `+page.svelte`, fed by `+page.server.ts` load data |
| Nuxt | `useSeoMeta()` and `useHead()` |
| Remix / React Router | The `meta` export per route |
| Rails | `content_for :head` in the layout, or the `meta-tags` gem |
| Django | Template blocks in `base.html` |
| WordPress | Yoast, Rank Math, or SEOPress. Do not hand-edit the theme header |
| Plain HTML | A build step or an include. Never copy-paste per page |

The rule underneath all of them: metadata comes from the same data that renders the page. Anything hand-maintained drifts.

## 3. Test tools

| Tool | URL | Tests |
|---|---|---|
| Google Rich Results Test | `search.google.com/test/rich-results` | Structured data eligibility, rendered HTML |
| Google Search Console URL Inspection | `search.google.com/search-console` | Live crawl, chosen canonical, indexing state |
| Schema Markup Validator | `validator.schema.org` | schema.org validity |
| Facebook Sharing Debugger | `developers.facebook.com/tools/debug/` | Facebook card, cache refresh, tag errors |
| LinkedIn Post Inspector | `linkedin.com/post-inspector/` | LinkedIn card, cache refresh |
| Pinterest Rich Pins Validator | `developers.pinterest.com/tools/url-debugger/` | Rich Pin type detection |
| Telegram `@WebpageBot` | Telegram app | Telegram preview cache refresh |
| X composer | `x.com` draft post | The only reliable X card preview since the validator retired |
| Slack / Discord test channel | Your own workspace | Real unfurl behaviour |
| Lighthouse SEO audit | Chrome DevTools | Title, description, canonical, crawlability, plus an `llms.txt` check |

Command-line check of what a crawler really sees:

```bash
curl -sL -A "facebookexternalhit/1.1" https://example.com/page | grep -iE '<title|og:|twitter:|canonical'
```

## 4. A release checklist

Before a page goes live:

- [ ] `curl` the URL with JavaScript out of the picture; title, description, canonical, and `og:*` are all present
- [ ] Title and description are unique across the site
- [ ] Canonical is absolute, returns 200, and is not `noindex`
- [ ] `og:url` matches the canonical
- [ ] `og:image` is absolute, HTTPS, 1200 x 630, under 300 KB, with alt text
- [ ] `twitter:card` is `summary_large_image`
- [ ] Structured data passes the Rich Results Test with zero errors
- [ ] Every marked-up fact is visible on the page
- [ ] `robots.txt` allows the page
- [ ] The page is in the sitemap with an honest `lastmod`
- [ ] The card looks right in the Facebook debugger, the LinkedIn inspector, an X draft, and a Slack or Discord message
- [ ] `hreflang` links are reciprocal, if the page is translated
- [ ] AI crawler rules match a decision someone actually made

After a metadata change:

- [ ] Re-run the Facebook Sharing Debugger to refresh the cache
- [ ] Re-run the LinkedIn Post Inspector
- [ ] Publish a changed image under a new filename
- [ ] Ping IndexNow if you use it
- [ ] Watch Search Console coverage for the next crawl

## 5. Fifteen ways metadata breaks

| # | Symptom | Cause | Fix |
|---|---|---|---|
| 1 | Cards empty on every platform, fine in Google | Tags injected client-side | Render server-side or pre-render |
| 2 | No image anywhere | Relative `og:image` path | Absolute `https://` URL |
| 3 | Old image survives every fix | Platform cache keyed on URL | New filename plus a debugger refresh |
| 4 | Only WhatsApp misses the image | Over 600 KB, or tags past the first 300 KB of HTML | Compress; move meta to the top of `<head>` |
| 5 | Only Discord misses the image | Plain HTTP image URL | Serve over HTTPS |
| 6 | Small thumbnail instead of a big card | `twitter:card` missing or `summary` | Set `summary_large_image` |
| 7 | Every link previews as the home page | `og:url` hardcoded to the root | Emit the page's own canonical |
| 8 | Google shows a title you did not write | Title is boilerplate, stuffed, or contradicted by the visible heading | Write a specific title matching the visible `<h1>` |
| 9 | Google ignores your description | It judged page text more useful for that query | Expected behaviour, not a bug. Make the description specific |
| 10 | Page will not leave the index | `noindex` on a page blocked by robots.txt | Allow crawling so the directive can be read |
| 11 | Wrong canonical chosen | Conflicting signals, or a JavaScript override | One canonical, in the HTML, matching sitemap and internal links |
| 12 | `hreflang` ignored entirely | Missing return links or self-reference | Every version lists every version, itself included |
| 13 | Rich result never appears | Marked-up facts are not visible on the page | Show the data, or drop the markup |
| 14 | Traffic drops after a robots.txt change | An answer-time fetcher was blocked with the training crawlers | Separate the two lists |
| 15 | Duplicate tags with different values | A framework plus a plugin both emitting metadata | Pick one owner for `<head>` |

## 6. Performance-adjacent head tags

Not metadata, but they share the `<head>` and affect Core Web Vitals, which affect search:

```html
<link rel="preconnect" href="https://fonts.example.com" crossorigin>
<link rel="dns-prefetch" href="https://cdn.example.com">
<link rel="preload" href="/fonts/inter.woff2" as="font" type="font/woff2" crossorigin>
```

- `preconnect` opens the network connection early. Use it for two or three origins at most; each one costs a connection.
- `dns-prefetch` only resolves the name. Cheaper, weaker.
- `preload` fetches a specific file early. Wrong `as` values make it a pure waste.

In Next.js these go through `ReactDOM.preload`, `ReactDOM.preconnect`, and `ReactDOM.prefetchDNS` rather than the metadata API, and `next/font`, `next/image`, and `next/script` handle most of it for you.

## Sources

- [Next.js generateMetadata](https://nextjs.org/docs/app/api-reference/functions/generate-metadata)
- [Google Rich Results Test](https://search.google.com/test/rich-results)
- [Schema Markup Validator](https://validator.schema.org/)
- [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)
- [LinkedIn Post Inspector](https://www.linkedin.com/post-inspector/)
- Failure modes are drawn from the constraints documented in head essentials and Open Graph, not from a measured incident sample.

---

<!-- 11archive-source: 07-glossary.md -->

# Glossary

Every term used in this report, in plain words.

## Core concepts

**Metadata.** Information about a page rather than the content of the page. Most of it lives in `<head>` as `<meta>` and `<link>` tags. A title, a description, and a share image are all metadata.

**Crawler (bot, spider).** A program that downloads pages automatically. Googlebot is one. So is the fetcher that runs when you paste a link into WhatsApp.

**User agent.** The name a program gives when it makes a request, such as `GPTBot`. It is the handle you use in `robots.txt` to allow or block that program. It can be faked, which is why vendors publish IP lists.

**Indexing.** Storing a page so it can appear in search results. Distinct from crawling, which is only downloading it. A page can be indexed without being crawled, which is why `robots.txt` cannot hide a URL from search.

**Rendering.** Running a page's JavaScript to see the final HTML. Googlebot does this on a delay. Most preview crawlers do not do it at all.

**Unfurl.** What a chat app does when a pasted link becomes a card with a title, a blurb, and a picture. Slack's term, now used generally.

**Snippet.** The grey descriptive text under a search result. Google writes it from your description, your page text, or both, depending on the query.

**Rich result.** A search result with extra visual features: star ratings, event dates, a breadcrumb trail, an image carousel. Structured data makes a page eligible.

## Addresses and duplication

**Canonical URL.** The one address you want treated as the real one when the same page is reachable at several. Declared with `<link rel="canonical">`.

**Canonicalization.** Google's process of picking one address from a group of duplicates. Your `rel=canonical` is a strong hint, not a command.

**hreflang.** A `<link>` annotation naming another language or region version of the same page. Requires reciprocal links: if A names B, B must name A.

**x-default.** The `hreflang` value for the fallback version, used when a visitor's language matches nothing you offer.

**Sitemap.** An XML file listing your URLs so search engines can discover them. Google reads `<loc>` and `<lastmod>` and ignores `<priority>` and `<changefreq>`.

**Sitemap index.** A sitemap of sitemaps, needed past 50,000 URLs or 50 MB per file.

## Directives

**robots.txt.** A plain text file at the site root saying which paths a crawler may download. It controls crawling, not indexing.

**robots meta tag.** A `<meta name="robots">` tag in the page controlling indexing and how the result may be displayed.

**X-Robots-Tag.** The same directives sent as an HTTP header. Needed for files that are not HTML, such as PDFs.

**noindex.** Keep this page out of search results. Only works if the crawler can download the page.

**nofollow.** Do not crawl the links on this page.

**nosnippet.** Show no text snippet. It also removes the page from Google's AI Overviews.

**data-nosnippet.** An HTML attribute on a `span`, `div`, or `section` excluding just that part from snippets. It is boolean: any value, including `"false"`, still excludes.

**max-snippet, max-image-preview, max-video-preview.** Caps on how much of your content Google may show. `max-image-preview:large` is required for large images in Discover.

**unavailable_after.** A date after which Google drops the page from results.

**indexifembedded.** Allow indexing when the page is embedded in an iframe, even though it carries `noindex`.

**Crawl-delay.** A non-standard directive asking a bot to slow down. Anthropic honours it; Google does not.

## Sharing and previews

**Open Graph (OG).** The `<meta property="og:*">` vocabulary from ogp.me that lets a page describe itself as an object. Required: `og:title`, `og:type`, `og:image`, `og:url`.

**og:type.** What kind of thing the page is: `website`, `article`, `book`, `profile`, `video.movie`, `music.song`, and others.

**Twitter card / X card.** The `<meta name="twitter:*">` family. Note `name=`, not `property=`. X falls back to Open Graph when these are absent.

**summary_large_image.** The card type that renders a full-width image above the text. Discord follows this tag too.

**og:image:alt.** The text description of the share image. The only accessible description a card carries.

**Share image (OG image).** The picture in a link preview. 1200 x 630 pixels, under 300 KB, absolute HTTPS URL.

**oEmbed.** A protocol where your site returns embeddable HTML for one of your URLs, so another site can show a working player instead of a picture. Discovered through a `<link rel="alternate" type="application/json+oembed">` tag.

**Sharing Debugger / Post Inspector.** Platform tools that re-fetch your page and clear the cached preview. Facebook and LinkedIn respectively.

**Rich Pin.** Pinterest's enhanced pin, built from your Open Graph or schema.org markup. Types: Product, Recipe, Article, in that priority order.

**fediverse:creator.** A meta tag added in Mastodon 4.3 that credits an author's fediverse profile on the link card. Requires matching settings on the Mastodon account.

## Structured data

**Structured data.** Facts about the page in a machine format, so a search engine reads typed fields instead of inferring from prose.

**schema.org.** The shared vocabulary of types and properties (`Article`, `Product`, `Organization`) that search engines agree on.

**JSON-LD.** JSON inside a `<script type="application/ld+json">` tag. Google's recommended notation because it sits apart from the markup.

**Microdata / RDFa.** Older notations that put structured data in HTML attributes. Supported, harder to maintain.

**@context, @type, @graph.** JSON-LD keywords: which vocabulary, which type, and a container for several related objects.

**Manual action.** A human penalty from Google. For structured data it removes rich-result eligibility without directly changing rankings.

## Icons and apps

**Favicon.** The small icon in a tab, bookmark, or search result. One per hostname.

**apple-touch-icon.** The 180 x 180 icon iOS uses on the home screen.

**Web app manifest.** A JSON file describing your site as an installable app: name, icons, colours, start screen. Linked with `<link rel="manifest">`.

**Maskable icon.** An icon with padding so Android can crop it into any shape without clipping the artwork.

**theme-color.** The colour a browser tints its own interface with. Discord also uses it for a link card's border stripe.

**color-scheme.** Tells the browser which light and dark schemes the page supports, so native controls match.

**Smart App Banner.** The iOS banner promoting your app, set with `<meta name="apple-itunes-app">`.

**App Links (`al:*`).** Tags telling a platform which native app can open this URL.

**Referrer policy.** How much of the current URL the browser tells the next site. Default in modern browsers: `strict-origin-when-cross-origin`.

## AI and crawling

**Training crawler.** Downloads pages to build a model. `GPTBot`, `ClaudeBot`, `CCBot`.

**Answer-time fetcher.** Downloads a page because a user just asked something. `OAI-SearchBot`, `Claude-User`, `ChatGPT-User`, `PerplexityBot`. Blocking these removes you from the answers.

**Control token.** A `robots.txt` name with no crawler behind it, existing only so you can opt out. `Google-Extended` and `Applebot-Extended`.

**AI Overviews / AI Mode.** Google's generated summaries above and instead of ordinary results. No special markup makes you eligible.

**Query fan-out.** AI Mode running several related searches at once for a single question.

**llms.txt.** A community-proposed Markdown file at the site root giving AI agents a clean map of the site. Widely adopted, not a standard, not required by Google.

**IndexNow.** A protocol for pushing "this URL changed" notifications to participating search engines instead of waiting for a crawl.

## Measurement

**Search Console.** Google's free site dashboard: indexing state, chosen canonicals, structured data errors, and search performance.

**URL Inspection.** The Search Console tool showing what Google did with one specific URL, including the canonical it picked.

**Rich Results Test.** Google's tool for checking whether markup produces a rich result, on a live URL or pasted code.

**Core Web Vitals.** Google's loading, interaction, and layout-stability measurements. Not metadata, but part of the same search picture, and influenced by what you put in `<head>`.

---

<!-- 11archive-source: 08-methodology-and-sources.md -->

# Methodology, coverage, limitations, and sources

## 1. What this report is

A working reference for the metadata a website puts in its `<head>`, plus the two files at its root, covering four consumers: search engines, social and chat previews, structured-data features, and AI crawlers.

It is not a ranking-factor study. Nothing here was measured against traffic, and no claim about "what ranks" is made beyond what the platform owners publish.

## 2. How the evidence was collected

- **Date of research:** 2026-08-11. Timezone: Europe/Lisbon.
- **Method:** direct retrieval of vendor documentation, read and summarised page by page. Where the vendor page was unreachable, a targeted web search was run and the result is labelled second-hand.
- **Preference order:** the standard's own site (ogp.me, oembed.com, indexnow.org) first, then the platform's developer documentation, then MDN for browser behaviour, then framework documentation, then secondary sources.
- **No live crawling, no scraping, no A/B testing, and no authenticated surfaces.** Every fetch was a normal public page request.

## 3. Evidence states used

Every claim in this report falls into one of these:

| State | Meaning | How it is marked |
|---|---|---|
| **Documented** | Stated in the owning vendor's or standard's own documentation | Linked inline to that page |
| **Second-hand** | The vendor's page was unavailable; the claim comes from secondary sources that agree with each other | Labelled "second-hand" in the text |
| **Derived** | A recommendation combining several documented constraints, such as the single image spec that satisfies every platform | Stated as a recommendation with the constraints shown |
| **Unavailable** | Wanted but not obtainable in this pass | Listed in section 5 |

Numbers such as "1200 x 630" and "under 300 KB" are **derived**: they are the tightest values that satisfy every documented platform constraint at once, not a figure any single vendor publishes.

## 4. Coverage

**Consumers examined:** Google Search, Google Discover, Google AI Overviews and AI Mode, Bing and IndexNow participants, Facebook, WhatsApp, LinkedIn, X, Slack, Discord, Telegram, Pinterest, Mastodon, iOS Safari, Android and PWA installs, and the crawlers of OpenAI, Anthropic, Google, Apple, and other AI operators.

**Tag families examined:** document basics, indexing directives, canonical and hreflang, Open Graph and its object types, X cards, oEmbed discovery, structured data in JSON-LD, icons, web app manifest, theme and colour scheme, Apple and app-link tags, referrer policy, verification tags, robots.txt, sitemaps, IndexNow, and llms.txt.

**Framework coverage:** Next.js in depth, because its metadata API documents tag names and generation behaviour precisely. Other stacks named at one line each, without verification.

## 5. Limitations

1. **X (Twitter) documentation is paywalled.** `developer.x.com` and `developer.twitter.com` returned HTTP 402 on 2026-08-11, and `docs.x.com` returned 404 for the card paths tried. Every X image constraint and character limit in this report is second-hand and should be re-verified before you depend on it. The tag *names* are corroborated by the Next.js metadata API, which generates them.
2. **Apple's Smart App Banner page returned no readable body.** Parameter names come from secondary sources.
3. **Discord, Telegram, and LinkedIn publish no formal metadata specification.** Their behaviour here is reported by third parties who agree with each other, which is weaker than a vendor statement.
4. **Bing's webmaster guidelines were not retrieved.** The page returned no readable content. Bing-specific behaviour is therefore absent, except for IndexNow, which is documented independently.
5. **Platform behaviour drifts.** Caches, crop ratios, and character limits change without announcement. Everything here is a point-in-time reading of 2026-08-11.
6. **No effectiveness measurement.** This report says what the platforms accept and read. It does not say what improves clicks, rankings, or conversions. Those need your own tests.
7. **Character limits for titles and descriptions are display budgets, not rules.** Google states there is no limit and truncates to device width. Any specific number you see elsewhere, including the rough 60 and 155 figures cited here, is a convention.
8. **The AI crawler list is partial.** Only Google, OpenAI, and Anthropic tokens were confirmed against vendor documentation. The rest are listed as unverified.
9. **`llms.txt` adoption claims come from its own site**, which has an interest in reporting adoption favourably.

## 6. Primary sources

### Standards and protocols

- [The Open Graph protocol](https://ogp.me/)
- [oEmbed specification](https://oembed.com/)
- [IndexNow documentation](https://www.indexnow.org/documentation)
- [llms.txt proposal](https://llmstxt.org/)

### Google

- [Meta tags and attributes Google supports](https://developers.google.com/search/docs/crawling-indexing/special-tags)
- [Robots meta tag, data-nosnippet, and X-Robots-Tag specifications](https://developers.google.com/search/docs/crawling-indexing/robots-meta-tag)
- [Robots.txt specifications](https://developers.google.com/search/docs/crawling-indexing/robots/robots_txt)
- [Consolidate duplicate URLs (canonicalization)](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls)
- [Localized versions of a page (hreflang)](https://developers.google.com/search/docs/specialty/international/localized-versions)
- [Build and submit a sitemap](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap)
- [JavaScript SEO basics](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics)
- [Google common crawlers](https://developers.google.com/search/docs/crawling-indexing/google-common-crawlers)
- [Control your title links](https://developers.google.com/search/docs/appearance/title-link)
- [Control your snippets](https://developers.google.com/search/docs/appearance/snippet)
- [Define a favicon](https://developers.google.com/search/docs/appearance/favicon-in-search)
- [Site names](https://developers.google.com/search/docs/appearance/site-names)
- [Google Discover](https://developers.google.com/search/docs/appearance/google-discover)
- [AI features and your website](https://developers.google.com/search/docs/appearance/ai-features)
- [Structured data general guidelines](https://developers.google.com/search/docs/appearance/structured-data/sd-policies)
- [Structured data search gallery](https://developers.google.com/search/docs/appearance/structured-data/search-gallery)
- [Article structured data](https://developers.google.com/search/docs/appearance/structured-data/article)
- [Organization structured data](https://developers.google.com/search/docs/appearance/structured-data/organization)
- [Breadcrumb structured data](https://developers.google.com/search/docs/appearance/structured-data/breadcrumb)

### Meta

- [Sharing for webmasters](https://developers.facebook.com/docs/sharing/webmasters/)
- [Sharing best practices](https://developers.facebook.com/docs/sharing/best-practices/)
- [WhatsApp link previews](https://developers.facebook.com/documentation/business-messaging/whatsapp/link-previews/)

### Other platforms

- [Slack: unfurling links in messages](https://docs.slack.dev/messaging/unfurling-links-in-messages/)
- [Pinterest Rich Pins overview](https://developers.pinterest.com/docs/web-features/rich-pins-overview/)
- [OpenAI bots](https://developers.openai.com/api/docs/bots)
- [Anthropic: does Anthropic crawl data from the web](https://support.claude.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler)

### Browser and framework

- [MDN: meta name values](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/meta/name)
- [MDN: viewport meta element](https://developer.mozilla.org/en-US/docs/Web/HTML/Guides/Viewport_meta_element)
- [MDN: web app manifest](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Manifest)
- [MDN: Referrer-Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Referrer-Policy)
- [Next.js: generateMetadata](https://nextjs.org/docs/app/api-reference/functions/generate-metadata)

## 7. Secondary sources, by claim

Used only where the vendor's own page was unavailable. Each was cross-checked against at least one other source making the same claim.

| Claim | Sources consulted |
|---|---|
| X card image sizes (min 300 x 157, max 4096 x 4096, under 5 MB, JPG/PNG/WEBP/GIF), 2:1 centre crop | og-image.org platform guide, ogpreview.io Twitter guide, opengraphplus.com Twitter images guide |
| X card validator preview removed in 2022, test via the composer | X developer community thread on card validator preview removal, ogfixer.com card validator guide |
| LinkedIn 1200 x 627 at 1.91:1, roughly 7-day preview cache | share-preview.com LinkedIn guide, connectsafely.ai Post Inspector article, missinglinkz.io preview size guide |
| Discord reads `twitter:card` for large images, uses `theme-color` for the border, requires HTTPS images | opengraphplus.com Discord tag reference, previewog.com Discord guide, Discord support community post on theme-color |
| Telegram needs `og:title`, prefers 1200 x 630, JPEG and PNG only | share-preview.com Telegram guide, opengraphplus.com Telegram images guide |
| Mastodon `fediverse:creator`, added in 4.3, requires author-attribution settings | rknight.me Mastodon author tags, chrismcleod.dev attribution meta tag, mastodon/mastodon discussion #32328 |
| Apple Smart App Banner parameters and `%2C` comma encoding | zhead.dev apple-itunes-app reference, david-smith.org Smart App Banners implementation |
| `og:image` must be absolute; JS-injected tags invisible to preview crawlers | veonr.com relative vs absolute analysis, ogmagic.dev OG image debugging guide, plus corroboration in vendor docs on caching |

## 8. Reproducing this report

Every documented claim can be re-checked by opening the linked page. To refresh the second-hand claims when the X and Apple pages become reachable:

1. Fetch `https://docs.x.com/x-for-websites/cards/overview/markup` and compare the image constraints in Open Graph and social cards section 3.
2. Fetch Apple's Smart App Banner page and compare the parameter table in Icons, PWA, app, and browser tags section 4.
3. Re-run the crawler token lists in Crawler and AI agent controls against each vendor's current documentation; this list changes fastest.

The machine-readable companion, `data.json`, carries the tag registry, platform matrix, image constraints, crawler tokens, and validator list used to build the HTML view. Regenerating the HTML from it reproduces the same facts in the same order.
