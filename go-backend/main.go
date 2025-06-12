package main

import (
	"log"
	"net/http"
	"os"
)

func main() {
	// Set up logging
	log.SetOutput(os.Stdout)
	log.SetFlags(log.LstdFlags | log.Lshortfile)

	// Set up WebSocket endpoint
	http.HandleFunc("/signal", handleWebSocket)

	// Start server
	log.Println("WebRTC signaling server starting on :8080")
	if err := http.ListenAndServe(":8080", nil); err != nil {
		log.Fatal("Server error:", err)
	}
}
