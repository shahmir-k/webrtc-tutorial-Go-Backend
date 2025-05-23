# webrtc-tutorial
This repository serves as a hands-on guide for WebRTC. It aims to clearly demonstrate how peer-to-peer connections are established and how video streams are exchanged using WebRTC.

> [!NOTE]
> You can find a more detailed explanation of the basic concepts of WebRTC and this tutorial’s code in my blog post. <br>
> [🔗 Coming soon]()

<br>

### 🌃 Preview
<img src="https://github.com/user-attachments/assets/fa93cf68-b764-4b95-9bc8-ee9a3e8de09d" width="600"/>


<br>

### 🔧 Stack
![Java](https://img.shields.io/badge/Java-007396?style=flat-square&logo=openjdk&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-6DB33F?style=flat-square&logo=spring-boot&logoColor=white)<br>
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-20232a?style=flat-square&logo=react&logoColor=61DAFB)
![Styled-Components](https://img.shields.io/badge/styled--components-DB7093?style=flat-square&logo=styled-components&logoColor=white)
![Zustand](https://img.shields.io/badge/Zustand-000000?style=flat-square)<br>
![WebSocket](https://img.shields.io/badge/WebSocket-010101?logo=websocket&logoColor=white&style=flat-square)
![WebRTC](https://img.shields.io/badge/WebRTC-333333?logo=webrtc&logoColor=white&style=flat-square)




<br><br>

## 📌 Before You Start

> Test Environment

This tutorial code can be tested in a local development environment.
To run the source code, you will need to have the following tools installed.
- VS Code
- node (v22.10.0)
- npm (v10.9.0)
- IntelliJ IDEA
- JDK 17

<br>

> WebRTC Communication Workflow & APIs and Hooks Used

This tutorial handles not only signaling but all server communications via WebSocket.
To establish a peer-to-peer connection, a signaling process is required.
The steps involved in the signaling process to connection establishment are as follows.

<img src="https://github.com/user-attachments/assets/10f10d76-5519-4f07-880e-58b0c3b9b936" width="600"/>

1. Both Peer A and Peer B set up their own media streams(microphone and video) - `Peer A`, `Peer B`
2. One peer (Peer A) creates an SDP(offer) - `Peer A`
3. Peer A sets the generated SDP(offer) as its local description and sends it to Peer B - `Peer A`
4. Peer B receives the SDP(offer) and sets it as its remote description - `Peer B`
5. Peer B creates an SDP(answer) in response to the received SDP(offer)  - `Peer B`
6. Peer B sets its generated SDP(answer) as its local description and sends it to Peer A - `Peer B`
7. Peer A receives the SDP(answer) and sets it as its remote description - `Peer A`
8. Both peers exchange the ICE candidates they collected and add the remote candidates - `Peer A`, `Peer B`
    - Each peer begins gathering its own ICE candidates after completing SDP creation.
A peer can only add the other peer's candidates after setting the remote SDP
9. Once ICE candidate exchange is complete and a viable candidate pair is found, the connection is successfully established - `Peer A`, `Peer B`




<br>

- Key APIs required for the signaling process


<br>

- Custom hooks created to utilize these key APIs in accordance with the tutorial code


<br>

> Requirements for Production Deployment






<br><br>

## 🏁 Getting Started




<br><br>

## 💥 Issue




<br><br>
