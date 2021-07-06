<h1 align="center">Welcome to dji-web 👋</h1>
<p>
</p>

> Share the video feed of your DJI FPV Goggles directly to the two HDMI outputs of a Raspberry PI 4 with a latency of about 5ms and/or via the web interface with a latency of 15ms.

<details>
  <summary>Show demo images and videos!</summary>
  
  <p align="center">
    <img src="https://user-images.githubusercontent.com/37296364/124662116-ab9d0b00-dea8-11eb-86de-3567565ddc40.jpg" alt="Demo image" width="550px">
  </p>
  
  https://user-images.githubusercontent.com/37296364/124662089-a17b0c80-dea8-11eb-801f-25e991fe5ddc.mp4

</details>

## Install

1. Upgrade your raspberry PI ```sudo apt-get update; sudo apt-get upgrade -y```
2. Install node packages with ```npm install```

## Usage

1. Power on your raspberry
2. Start the program with ```npm run start``` or ```sh start.sh```
3. Attach your FPV DJI Goggles
4. Turn on your drone
5. Enjoy

The video output will be available on the two HDMI ports of the raspberry pi 4 and on the web page accessible at the IP address of the raspberry pi with the port 80.

## Tips

If you want to use the raspberry outside with a battery you can use <a href="https://en.wikipedia.org/wiki/Hostapd">Hostapd</a> to create a LAN WiFi Network that can be used to access the web interface from your phone/tablet/laptop/spacecraft/...

## Author

👤 **Filippo Finke**

- Website: https://filippofinke.ch
- Github: [@filippofinke](https://github.com/filippofinke)
- LinkedIn: [@filippofinke](https://linkedin.com/in/filippofinke)

## Show your support

Give a ⭐️ if this project helped you!

<a href="https://www.buymeacoffee.com/filippofinke">
  <img src="https://github.com/filippofinke/filippofinke/raw/main/images/buymeacoffe.png" width="160" alt="Buy Me A McFlurry">
</a>
