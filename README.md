# Channel example - BIoT
#### What's happening?

![What's happening?](https://cdn-images-1.medium.com/max/1600/1*dvWWNGXRbEUt5RdxvD7aJw.gif)

#### A device:
```sh
$ git clone https://github.com/BIoTws/example-biot-channels
$ cd example-biot-channels
$ npm install
$ ./testnetify.sh
$ node a.js
```

#### B device:
```sh
$ git clone https://github.com/BIoTws/example-biot-channels
$ cd example-biot-channels
$ npm install
$ ./testnetify.sh
$ node b.js
```

#### Configuration
1) Start B
2) Copy "my pairing code" and "my device address"
3) replace the values in a.js on A device 
4) start A