<div align="center"><a href="https://info-tube.workers.dev"><img width="80%" src="info-tube-img.png" alt="info-tube"></a></div>

<br>
<br>

### Manual

<br>

Base URL: [https://info-tube.zaco.workers.dev](https://info-tube.zaco.workers.dev)

<br>

#### Get Channel Data

`/channel/channelID`

`/c/customName`

`/user/userName`

`/@handleName`

`/watch?v=videoID`

**Example:** 

`info-tube.zaco.workers.dev/channel/channelID`

<br>

#### Get Video Data

`/watch?v=videoID`

`/live/videoID`

**Example:** 

`info-tube.zaco.workers.dev/watch?v=videoID`

<br>

#### Get Stream URL (LIVE)

`/channel/channelID/live`

`/c/customName/live`

`/user/userName/live`

`/@handleName/live`

`/live/videoID/live`

**Example:** 

`info-tube.zaco.workers.dev/channel/channelID/live`

<br>

> [!NOTE]
> To get the **Stream URL**, the YouTube channel must be (**LIVE**).

<br>

### Data is returned in JSON format

<br>

**Example:** Request > `/@MyChannel`

`JSON`

```json
   {
     "channel": {
       "logo": "https://yt3.googleusercontent.com/..",
       "name:" "My Channel",
       "description": "Channel profile description",
       "id": "UCDPk9MG2RexnOMGTD..",
       "url": "https://www.youtube.com/channel/UCDPk9MG2RexnOMGTD.."   
     }
   }
```

<br>

#### JSON data with Fetch API

`JavaScript`

```javascript
   const request = "/url-path"; // Refer to the manual

   (async function() {
     const response = await fetch("https://info-tube.zaco.workers.dev" + request);   

     if (response.ok) {
       const data = await response.json();

       if (data !== "") {
         const json = JSON.stringify(data);

         // Do something with JSON data
         console.log(json);
       }
       return;
     }
   })();
 
 
   /** Get each JSON data (Channel / Video / Stream)
 
      const str = JSON.parse(json)
 
    * Channel:
       str.channel.logo
       str.channel.name
       str.channel.description
       str.channel.id
       str.channel.url
    * Video:
       str.video.author_name
       str.video.author_url
       str.video.title
       str.video.description
       str.video.thumbnail
       str.video.view
       str.video.id
       str.video.url
       str.video.embed
    * Stream:
       str.stream.live
       str.stream.title
       str.stream.manifest.hls
       str.stream.manifest.dash
   **/
```
