const fs = require('fs');
const { stdout, stderr } = require('process');
const videoShow = require('videoshow');
const gTTS = require('gtts');
const { connect } = require('http2');

let content;
let frame = [];



fs.readFile('text.txt', 'utf8', function(err, data){ 
    content = data;
    var gtts = new gTTS(content, 'en', true); 
  
    gtts.save('Voice.mp3', function (err, result){ 
        if(err) { throw new Error(err); } 
        console.log("Text to speech converted!"); 
    }); 
    for(i = 0; i < content.length; i++) {
        if(content.charAt(i) == "."){
          console.log("space")
          frame.push("mouth0.png")
          frame.push("mouth0.png")
          frame.push("mouth0.png")
          frame.push("mouth0.png")
          frame.push("mouth0.png")
        }else{
            if(content.charAt(i) != " "){
                frame.push("mouth2.png")
                frame.push("mouth2.png")
                frame.push("mouth2.png")
            } 
        }
        
    }
    generateVid(frame)
    
}); 



function generateVid(frames){
    console.log(frames)

    const secondsToShowEachImage = 1;
    const finalVideoPath = 'xd.mp4';
    const viocepath = 'Voice.wav'
    const videoOptions = {
        fps: 60,
        loop: 0.02,
        transition: false,
        videoBitrate: 1024,
        audioBitrate: '128k',
        audioChannels: 2,
        videoCodec: 'libx264',
        size: '640x640',
        outputOptions: ['-pix_fmt yuv420p'],
        format: 'mp4'
    }

    let images = ['frame1.png', 'frame2.png']

    videoShow(frames, videoOptions)
        //.audio(viocepath)
        .save(finalVideoPath)
        .on('start', (command) => {
            console.log('creating vid')
        })
        .on('error', (err, stdout, stderr) => {
            console.log(err)
        })
        .on('end', (output) => {
            console.log("Slowing down audio!");
            const { exec } = require('child_process');
            exec('ffmpeg -i Voice.mp3 -filter:a "atempo=0.96" -vn output.mp3 -y', (err, stdout, stderr) => {
                if(err) console.log(err)
                console.log("slowing down video!");
                console.log("Merging audio and video!");
                exec('ffmpeg -i xd.mp4 -i output.mp3 -c:v copy -c:a aac -map 0:v:0 -map 1:a:0 outputt.mp4 -y', (err, stdout, stderr) => {
                    if(err) console.log(err);
                })
            });

            

            console.log("Done! Uploading to youtube!")
        })
}

