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

> WebRTC Communication Workflow

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

> Key APIs required for the signaling process for video calling
- `new RTCPeerConnection()`
    - Creates a new WebRTC connection instance for peer-to-peer communication
- `peerConnection.ontrack = (event) => {}`
    - Triggered when a media track (audio or video) is received from the remote peer
- `peerConnection.onicecandidate = (event) => {}`
    - Called when a new ICE candidate is discovered
- `peerConnection.oniceconnectionstatechange = (event) => {}`
    - Monitors changes in the ICE connection state (e.g., connected, disconnected)
- `navigator.mediaDevices.getUserMedia()`
    - Requests access to the user's camera and microphone
- `peerConnection.createOffer()`
    - Creates an SDP offer to initiate a WebRTC connection with another peer
- `peerConnection.createAnswer()`
    - Creates an SDP answer in response to an offer from another peer
- `peerConnection.setLocalDescription()`
    - Sets the local peer’s SDP (offer or answer) for signaling
- `peerConnection.setRemoteDescription()`
    - Applies the received SDP from the remote peer
- `peerConnection.addIceCandidate()`
    - Adds an ICE candidate received from the remote peer to establish connectivity

<br>

> Custom hooks created to utilize these key APIs in accordance with the tutorial code

A custom WebRTC hook was implemented to establish a peer-to-peer connection through user interaction in the call page component.
It is located at [`/frontend/src/hooks/useWebRTC.ts`](https://github.com/BenchPress200/webrtc-tutorial/blob/main/frontend/src/hooks/useWebRTC.ts)

<br>

> Requirements for Production Deployment

When deploying a WebRTC-based feature to a production environment, there are several critical considerations beyond what is covered in this tutorial:

- Automated Signaling Flow<br>
In this tutorial, the signaling process is manually triggered by user interactions (e.g., button clicks). However, in a real-world service, signaling should be initiated and completed automatically—such as sending an offer and receiving an answer—without requiring direct user actions. This ensures a seamless connection experience.

- Ping-Pong Mechanism<br>
Since signaling is handled over WebSocket in this tutorial, production environments must account for possible disconnections caused by NATs, firewalls, load balancers, or web servers that enforce idle timeouts. If the WebSocket connection is terminated during signaling, the peer connection cannot be established. To resolve this, a ping-pong mechanism should be implemented to keep the signaling connection alive.

- TURN Server Deployment<br>
Unlike local environments, real-world peer networks are often restricted by NATs or firewalls, which can prevent peers from exchanging usable IP and port information. In such cases, a TURN (Traversal Using Relays around NAT) server acts as a relay to facilitate media transmission. Deploying a TURN server is essential to ensure reliable connectivity across various network conditions.




<br><br>

## 🏁 Getting Started
writing...



<br><br>

## 💥 Issue

If you encounter any issues or have questions about the tutorial code, I'd really appreciate it if you could open an issue using the "Issues" tab at the top of the repository page. I'll respond as soon as possible. To create an issue, please follow these steps:

1. Click the Issues tab
    <img width="991" alt="스크린샷 2025-05-23 오전 11 47 53" src="https://github.com/user-attachments/assets/1fa9a310-ea73-46e2-9736-4bf4370402f5" width="800"/>

3. Click New Issue
   <img width="974" alt="스크린샷 2025-05-23 오전 11 48 35" src="https://github.com/user-attachments/assets/3d873f75-84ce-49cc-b5f8-117c9d5af925" width="800"/>

5. Select the custom issue template
   <img width="903" alt="스크린샷 2025-05-23 오전 11 49 22" src="https://github.com/user-attachments/assets/562ce37c-1ba1-456a-b7b6-0cd5ec7dbe94" width="800"/>

7. Fill in a clear and relevant title, complete each section, and click Submit new issue
   <img width="825" alt="스크린샷 2025-05-23 오전 11 49 51" src="https://github.com/user-attachments/assets/179aa349-0ed3-406e-84f7-3b1bced81389" width="800"/>


Thank you for your contribution!

<br><br>
