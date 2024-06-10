#include <ESP8266WiFi.h>
#include "config.h"

#define ALERT_DURATION 3000

// Replace with your network credentials
const char* ssid = WIFI_SSID;
const char* password = WIFI_PASS;

// Set web server port number to 80
WiFiServer server(8080);

// Variable to store the HTTP request
String header;

// Assign output variables to GPIO pins
const int switchPin = 2;

// Current time
unsigned long currentTime = millis();
// Previous time
unsigned long previousTime = 0;
// Define timeout time in milliseconds (example: 2000ms = 2s)
const long timeoutTime = 2000;

void setup() {
  delay(10000);

  pinMode(LED_BUILTIN, OUTPUT);
  digitalWrite(LED_BUILTIN, LOW);
  delay(1000);
  digitalWrite(LED_BUILTIN, HIGH);

  // Initialize the output variables as outputs
  pinMode(switchPin, OUTPUT);
  // Set outputs to LOW
  digitalWrite(switchPin, LOW);

  // Connect to Wi-Fi network with SSID and password
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    //Serial.print(".");
  }
  server.begin();

  digitalWrite(LED_BUILTIN, LOW);
}

void loop() {
  WiFiClient client = server.available();  // Listen for incoming clients

  if (client) {               // If a new client connects,
    String currentLine = "";  // make a String to hold incoming data from the client
    currentTime = millis();
    previousTime = currentTime;
    while (client.connected() && currentTime - previousTime <= timeoutTime) {  // loop while the client's connected
      currentTime = millis();
      if (client.available()) {  // if there's bytes to read from the client,
        char c = client.read();  // read a byte, then
        //Serial.write(c);         // print it out the serial monitor
        header += c;
        if (c == '\n') {  // if the byte is a newline character
          // if the current line is blank, you got two newline characters in a row.
          // that's the end of the client HTTP request, so send a response:
          if (currentLine.length() == 0) {
            // HTTP headers always start with a response code (e.g. HTTP/1.1 200 OK)
            // and a content-type so the client knows what's coming, then a blank line:
            //client.println("HTTP/1.1 200 OK");
            //client.println("Content-type:text/html");
            //client.println("Connection: close");
            //client.println();

            // turns the GPIOs on and off
            if (header.indexOf("GET /alert") >= 0) {
              client.println("HTTP/1.1 200 OK");
              client.println("Connection: close");
              client.println();

              triggerAlert();
            } else {
              client.println("HTTP/1.1 400 BAD REQUEST");
              client.println("Connection: close");
              client.println();
            }

            break;
          } else {  // if you got a newline, then clear currentLine
            currentLine = "";
          }
        } else if (c != '\r') {  // if you got anything else but a carriage return character,
          currentLine += c;      // add it to the end of the currentLine
        }
      }
    }
    // Clear the header variable
    header = "";
    // Close the connection
    client.stop();
  }
}

void triggerAlert() {
  digitalWrite(switchPin, HIGH);
  delay(ALERT_DURATION);
  digitalWrite(switchPin, LOW);
}