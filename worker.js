addEventListener("fetch", event => {
  event.respondWith(handler(event));
});

async function handler(event) {
  const requestUrl = new URL(event.request.url);
  const {protocol} = requestUrl;
  const {host} = requestUrl;
  const {pathname} = requestUrl;
  const {search} = requestUrl;

  /*
    Does not allow loading data into local files 
    or with insecure network protocols 
  */
  if (protocol.startsWith("http:") || protocol.startsWith("file:")) {
    var msgError = `<p>Insecure access requests with (<b><code>${protocol}</code></b>)</p>`;
    return new Response(msgError, {
      headers: {
        "Content-Type": "text/html"
      },
    });
  /* If safe */
  } else if (protocol.startsWith("https:")) {
    if (pathname.startsWith("/channel/") || pathname.startsWith("/c/") || pathname.startsWith("/user/") || pathname.startsWith("/@")) {
      var url = `https://www.youtube.com${pathname}`;
      var response = await fetch(url, {
        cf: {
          cacheTtl: 5,
          cacheEverything: true
        },
      });

      if (response.ok) {
        var text = await response.text();
        let channelLogo, channelName, channelDescription, channelId, channelUrl;

        /* Channel (live - stream) */
        if (pathname.endsWith("/live")) {
          var title = text.split('"title":"')[1].split('"')[0];
          var hlsUri = text.split('"hlsManifestUrl":"')[1].split('"')[0];
          var dashUri = text.split('"dashManifestUrl":"')[1].split('"')[0];

          var json = `{
  "stream": {
    "live": "true",
    "title": "${title}",
    "manifest": {
      "hls": "${decodeURIComponent(hlsUri)}",
      "dash": "${decodeURIComponent(dashUri)}"
    }
  }
}
          `;

          response = new Response(json, {
            headers: {
              "Access-Control-Allow-Origin": "*",
              "Content-Type": "application/json"
            },
          });
          response.headers.set("Cache-Control", "max-age=1500");

          return response;
        /* Channel (information) */
        } else {
          channelLogo = text.split('itemprop="thumbnailUrl"')[1].split('"')[1];
          channelName = text.split('itemprop="name"')[1].split('"')[1];
          channelDescription = text.split('itemprop="description"')[1].split('"')[1];
          channelId = text.split('itemprop="identifier"')[1].split('"')[1];
          channelUrl = text.split('itemprop="url"')[1].split('"')[1];

          var json = `{
  "channel": {
    "logo": "${channelLogo}",
    "name": "${channelName}",
    "description": "${channelDescription}",
    "id": "${channelId}",
    "url": "${channelUrl}"
  }
}
          `;

          response = new Response(json, {
            headers: {
              "Access-Control-Allow-Origin": "*",
              "Content-Type": "application/json"
            },
          });
          response.headers.set("Cache-Control", "max-age=1500");

          return response;
        }
      } else {
        var msgError = `<p>Youtube URL (<b><code>https://www.youtube.com${pathname}</code></b>) failed with status: <b>${response.status}</b></p>`;
        return new Response(msgError, {
          headers: {
            "Content-Type": "text/html"
          },
        });
      }
    /* Video (information) */
    } else if (pathname.startsWith("/watch")) {
      var url = `https://www.youtube.com/watch${search}`;
      var response = await fetch(url, {
        cf: {
          cacheTtl: 5,
          cacheEverything: true
        },
      });

      if (response.ok) {
        var text = await response.text();
        let videoAuthorName, videoAuthorUrl, videoTitle, videoDescription, videoView, videoId, videoThumbnail, videoEmbed;

        videoTitle = text.split('"title":"')[1].split('"')[0];
        videoDescription = text.split('"shortDescription":"')[1].split('"')[0];
        videoThumbnail = text.split('"microformat":')[1].split('"url":"')[1].split('"')[0];
        videoView = text.split('"viewCount":"')[1].split('"')[0];
        videoId = text.split('"videoId":"')[1].split('"')[0];
        videoEmbed = text.split('"iframeUrl":"')[1].split('"')[0];

        var responseUrl = await fetch(`https://noembed.com/embed?url=${url}`);
        if (responseUrl.ok) {
          var data = await responseUrl.text();
          videoAuthorName = data.split('"author_name":"')[1].split('"')[0];
          videoAuthorUrl = data.split('"author_url":"')[1].split('"')[0];

          var json = `{
  "video": {
    "author_name": "${videoAuthorName}",
    "author_url": "${videoAuthorUrl}",
    "title": "${videoTitle}",
    "description": "${videoDescription}",
    "thumbnail": "${videoThumbnail}",
    "view": "${videoView}",
    "id": "${videoId}",
    "url": "https://www.youtube.com/watch?v=${videoId}",
    "embed": "${videoEmbed}"
  }
}
          `;

          response = new Response(json, {
            headers: {
              "Access-Control-Allow-Origin": "*",
              "Content-Type": "application/json"
            },
          });
          response.headers.set("Cache-Control", "max-age=1500");

          return response;
        } else {
          var msgError = `<p>Youtube URL (<b><code>https://www.youtube.com\watch${search}</code></b>) failed with status: <b>${response.status}</b></p>`;
          return new Response(msgError, {
            headers: {
              "Content-Type": "text/html"
            },
          });
        }
      } else {
        var msgError = `<p>Youtube URL (<b><code>https://www.youtube.com/watch${search}</code></b>) failed with status: <b>${response.status}</b></p>`;
        return new Response(msgError, {
          headers: {
            "Content-Type": "text/html"
          },
        });
      }
    /* Video (live) */
    } else if (pathname.startsWith("/live/")) {
      var url = `https://www.youtube.com${pathname}`;
      var response = await fetch(url, {
        cf: {
          cacheTtl: 5,
          cacheEverything: true
        },
      });

      if (response.ok) {
        var text = await response.text();
        let videoAuthorName, videoAuthorUrl, videoTitle, videoDescription, videoView, videoId, videoThumbnail, videoEmbed;
        videoTitle = text.split('"title":"')[1].split('"')[0];
        videoDescription = text.split('"shortDescription":"')[1].split('"')[0];
        videoThumbnail = text.split('"microformat":')[1].split('"url":"')[1].split('"')[0];
        videoView = text.split('"viewCount":"')[1].split('"')[0];
        videoId = text.split('"videoId":"')[1].split('"')[0];
        videoEmbed = text.split('"iframeUrl":"')[1].split('"')[0];

        /* Video (live - stream) */
        if (pathname.endsWith("/live")) {
          var title = text.split('"title":"')[1].split('"')[0];
          var hlsUri = text.split('"hlsManifestUrl":"')[1].split('"')[0];
          var dashUri = text.split('"dashManifestUrl":"')[1].split('"')[0];

          var json = `{
  "stream": {
    "live": "true",
    "title": "${title}",
    "manifest": {
      "hls": "${decodeURIComponent(hlsUri)}",
      "dash": "${decodeURIComponent(dashUri)}"
    }
  }
}
          `;

          response = new Response(json, {
            headers: {
              "Access-Control-Allow-Origin": "*",
              "Content-Type": "application/json"
            },
          });
          response.headers.set("Cache-Control", "max-age=1500");

          return response;
        /* Video (live - information) */
        } else {
          var responseUrl = await fetch(`https://noembed.com/embed?url=https://www.youtube.com/watch?v=${videoId}`);
          if (responseUrl.ok) {
            var data = await responseUrl.text();
            videoAuthorName = data.split('"author_name":"')[1].split('"')[0];
            videoAuthorUrl = data.split('"author_url":"')[1].split('"')[0];

            var json = `{
  "video": {
    "author_name": "${videoAuthorName}",
    "author_url": "${videoAuthorUrl}",
    "title": "${videoTitle}",
    "description": "${videoDescription}",
    "thumbnail": "${videoThumbnail}",
    "view": "${videoView}",
    "id": "${videoId}",
    "url": "https://www.youtube.com/live/${videoId}",
    "embed": "${videoEmbed}"
  }
}
            `;

            response = new Response(json, {
              headers: {
                "Access-Control-Allow-Origin": "*",
                "Content-Type": "application/json"
              },
            });
            response.headers.set("Cache-Control", "max-age=1500");

            return response;
          } else {
            var msgError = `<p>Youtube URL (<b><code>https://www.youtube.com${pathname}</code></b>) failed with status: <b>${response.status}</b></p>`;
            return new Response(msgError, {
              headers: {
                "Content-Type": "text/html"
              },
            });
          }
        }
      } else {
        var msgError = `<p>Youtube URL (<b><code>https://www.youtube.com${pathname}</code></b>) failed with status: <b>${response.status}</b></p>`;
        return new Response(msgError, {
          headers: {
            "Content-Type": "text/html"
          },
        });
      }
    } else {
      /* Fetch URL content for your website with (custom header) */
      var urlContent = "http://your-url.site"; /* main page */ 
      var response = await fetch(urlContent);
      if (response.ok) {
        var content = await response.text();
        return new Response(content, {
          headers: {
            /* Set headers for allowed content (* | origin | null) */
            "Access-Control-Allow-Origin": "*",
            /* Set headers for your content source (same-site | same-origin | cross-origin) */
            "Cross-Origin-Resource-Policy": "cross-origin",
            /* Set the content source type */
            "Content-Type": "text/html;charset=UTF-8"
          },
        });
      }
    }
  } else {
    var msgError = "<p>Access permission is not allowed.</p>";
    return new Response(msgError, {
      headers: {
        "Content-Type": "text/html"
      },
    });
  }
};
